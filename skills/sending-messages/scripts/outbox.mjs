#!/usr/bin/env node
// The sending-messages CLI, run from the repository. Reads its config from the sending root's index.md.
//
//   node outbox.mjs setup                      create the database, its table and the KV namespace when missing; install and deploy the Worker
//   node outbox.mjs deploy                     deploy the Worker again (after a change to index.md)
//   node outbox.mjs secrets                    store the SMTP login from env_file as the Worker's secrets (never printed)
//   node outbox.mjs check                      exit 0 when the table, the namespace, the Worker and its secrets are there
//   node outbox.mjs schedule [--file <json>|-] [--start "YYYY-MM-DD HH:MM"] [--batch <name>] [--yes]
//                                              plan the messages' send times; with --yes, queue them
//   node outbox.mjs list [--batch …] [--status queued,sent,…]
//   node outbox.mjs cancel --ids 3,4 | --batch <name>
//
// Output is JSON on stdout; errors go to stderr with exit code 1. A message:
//   { "to", "to_name"?, "subject", "text", "attachments"?: ["<file path>"], "delivery"?: <tracking id>, "batch"? }

import { randomUUID } from "node:crypto";
import { execFileSync } from "node:child_process";
import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import { args, d1, fmtLocal, HERE, kvDelete, kvPut, loadConfig, loadEnvFile, localParts, now, parseStart, plan, q, readInput, SCHEMA, setConfig, STATUSES, track, wrangler } from "./outbox-lib.mjs";

const o = args(), cmd = o._[0];
const out = (v) => process.stdout.write(JSON.stringify(v, null, 2) + "\n");
const fail = (msg) => { process.stderr.write(`${msg}\n`); process.exit(1); };
const str = (v) => (typeof v === "string" && v.trim() ? v.trim() : null);
const WORKER = path.join(HERE, "worker");
const TYPES = { ".jpg": "image/jpeg", ".jpeg": "image/jpeg", ".png": "image/png", ".pdf": "application/pdf", ".gif": "image/gif", ".webp": "image/webp" };

let cfg;
try { cfg = loadConfig(); } catch (e) { fail(e.message); }

const databases = () => JSON.parse(wrangler(cfg, ["d1", "list", "--json"]));
function deploy() {
  const dbs = databases();
  const id = (name) => dbs.find((d) => d.name === name)?.uuid ?? fail(`No D1 database ${name} in account ${cfg.account_id}`);
  if (!fs.existsSync(path.join(WORKER, "node_modules", "worker-mailer"))) execFileSync("npm", ["install", "--no-audit", "--no-fund", "--no-package-lock"], { cwd: WORKER, stdio: "ignore" });
  const config = {
    name: cfg.worker, main: path.join(WORKER, "index.js"), compatibility_date: "2026-01-01", compatibility_flags: ["nodejs_compat"],
    workers_dev: false, preview_urls: false, triggers: { crons: ["*/5 * * * *"] },
    d1_databases: [{ binding: "DB", database_name: cfg.database, database_id: id(cfg.database) },
      ...(cfg.tracking_database ? [{ binding: "TRACK", database_name: cfg.tracking_database, database_id: id(cfg.tracking_database) }] : [])],
    kv_namespaces: [{ binding: "FILES", id: cfg.kv_id }],
    vars: { CONFIG: JSON.stringify({ from: cfg.from, smtp_host: cfg.smtp_host, smtp_port: cfg.smtp_port, timezone: cfg.timezone, hours: cfg.hours, days: [...cfg.days], daily_cap: cfg.daily_cap, list_unsubscribe: cfg.list_unsubscribe }) },
  };
  const file = path.join(fs.mkdtempSync(path.join(os.tmpdir(), "sending-messages-")), "wrangler.json");
  fs.writeFileSync(file, JSON.stringify(config, null, 2));
  try { wrangler(cfg, ["deploy", "--config", file], { noConfig: true }); } finally { fs.rmSync(path.dirname(file), { recursive: true, force: true }); }
  return { worker: cfg.worker, cron: "*/5 * * * *", tracking: cfg.tracking_database ?? "none" };
}
const secretNames = () => { try { return JSON.parse(wrangler(cfg, ["secret", "list", "--name", cfg.worker, "--format", "json"])).map((s) => s.name); } catch { return null; } };

function validate(items) {
  const errors = [];
  items.forEach((m, i) => {
    const where = `#${i + 1}${m.to ? ` (${m.to})` : ""}`;
    if (!str(m.to) || !/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(m.to)) errors.push(`${where}: to is an email address`);
    if (!str(m.subject)) errors.push(`${where}: no subject`);
    if (!str(m.text)) errors.push(`${where}: no text`);
    if (m.attachments !== undefined && (!Array.isArray(m.attachments) || m.attachments.some((a) => typeof a !== "string"))) errors.push(`${where}: attachments is a list of file paths`);
    if (m.delivery !== undefined && !Number.isInteger(m.delivery)) errors.push(`${where}: delivery is a tracking-promotions delivery id`);
  });
  return errors;
}

const commands = {
  setup() {
    if (!databases().some((d) => d.name === cfg.database)) wrangler(cfg, ["d1", "create", cfg.database]);
    d1(cfg, SCHEMA.join(";\n"));
    if (!cfg.kv_id) {
      const res = wrangler(cfg, ["kv", "namespace", "create", `${cfg.worker}-files`]);
      const id = res.match(/"?id"?\s*[:=]\s*"([0-9a-f]{32})"/)?.[1] ?? fail(`Couldn't read the new namespace's id:\n${res}`);
      setConfig(cfg, "kv_id", id);
      cfg.kv_id = id;
    }
    const deployed = deploy();
    const secrets = secretNames() ?? [];
    out({ database: cfg.database, kv_id: cfg.kv_id, ...deployed, secrets: ["SMTP_USER", "SMTP_PASS"].every((s) => secrets.includes(s)) ? "set" : "missing: run outbox.mjs secrets" });
  },

  deploy() { out(deploy()); },

  secrets() {
    const file = loadEnvFile(cfg);
    const vals = { SMTP_USER: process.env[cfg.smtp_user_var], SMTP_PASS: process.env[cfg.smtp_pass_var] };
    const missing = Object.entries({ [cfg.smtp_user_var]: vals.SMTP_USER, [cfg.smtp_pass_var]: vals.SMTP_PASS }).filter(([, v]) => !v).map(([k]) => k);
    if (missing.length) fail(`Missing ${missing.join(", ")} in the environment${file ? ` or ${file}` : ""}`);
    for (const [name, value] of Object.entries(vals)) wrangler(cfg, ["secret", "put", name, "--name", cfg.worker], { input: value });
    out({ worker: cfg.worker, secrets: Object.keys(vals) });
  },

  check() {
    const problems = [];
    try { const [t] = d1(cfg, "SELECT name FROM sqlite_master WHERE type = 'table' AND name = 'outbox'"); if (!t.length) problems.push("no outbox table: run outbox.mjs setup"); }
    catch (e) { problems.push(e.message); }
    if (!cfg.kv_id) problems.push("no kv_id: run outbox.mjs setup");
    const secrets = secretNames();
    if (!secrets) problems.push(`the Worker ${cfg.worker} isn't deployed: run outbox.mjs setup`);
    else for (const s of ["SMTP_USER", "SMTP_PASS"]) if (!secrets.includes(s)) problems.push(`the Worker lacks ${s}: run outbox.mjs secrets`);
    if (problems.length) fail(problems.join("\n"));
    out({ worker: cfg.worker, database: cfg.database, ok: true });
  },

  schedule() {
    const raw = JSON.parse(readInput(o.file));
    const items = Array.isArray(raw) ? raw : [raw];
    if (!items.length) fail("Nothing to schedule");
    const errors = validate(items);
    if (errors.length) fail(errors.join("\n"));
    const batch = str(o.batch);
    const start = parseStart(cfg, o.start);

    // Count what is already queued or sent per day, so the cap holds across batches.
    const [rows] = d1(cfg, `SELECT COALESCE(sent_at, send_at) AS at FROM outbox WHERE status IN ('queued', 'sent') AND COALESCE(sent_at, send_at) >= ${q(new Date(start.getTime() - 86400000).toISOString())}`);
    const taken = {};
    for (const r of rows) { const d = localParts(new Date(r.at), cfg.timezone).day; taken[d] = (taken[d] ?? 0) + 1; }
    const times = plan(cfg, items.length, start, taken, JSON.stringify(items.map((m) => [m.to, m.subject, m.delivery ?? null])));
    const shown = items.map((m, i) => ({ to: m.to, to_name: m.to_name ?? null, delivery: m.delivery ?? null, send_at: times[i], local: fmtLocal(cfg, times[i]) }));
    const perDay = {};
    for (const t of times) { const d = localParts(new Date(t), cfg.timezone).day; perDay[d] = (perDay[d] ?? 0) + 1; }

    if (!o.yes) return out({ queued: false, from: cfg.from, window: `${cfg.days_text} ${cfg.hours.map((h) => `${h}:00`).join("–")} ${cfg.timezone}`, daily_cap: cfg.daily_cap, gap_minutes: cfg.gap, per_day: perDay, messages: shown });

    // The go: every tied delivery must still be approved, every attachment must exist.
    const tied = items.filter((m) => m.delivery);
    if (tied.length) {
      if (!cfg.tracking_database) fail("These messages carry tracking deliveries but index.md has no tracking_database");
      const approved = new Set(track(["list", "--kind", "message", "--status", "approved"]).map((d) => d.id));
      const not = tied.filter((m) => !approved.has(m.delivery)).map((m) => m.delivery);
      if (not.length) fail(`Not approved in tracking-promotions: ${not.join(", ")}`);
    }
    for (const m of items) for (const a of m.attachments ?? []) if (!fs.existsSync(a)) fail(`${m.to}: no file ${a}`);

    const at = now(), queued = [];
    items.forEach((m, i) => {
      const files = (m.attachments ?? []).map((a) => {
        const key = `msg/${randomUUID()}/${path.basename(a)}`;
        kvPut(cfg, key, a);
        return { key, filename: path.basename(a), type: TYPES[path.extname(a).toLowerCase()] ?? "application/octet-stream" };
      });
      const [r] = d1(cfg, `INSERT INTO outbox (batch, delivery, to_addr, to_name, subject, text, attachments, status, send_at, queued_at)
        VALUES (${q(m.batch ?? batch)}, ${q(m.delivery ?? null)}, ${q(m.to)}, ${q(m.to_name ?? null)}, ${q(m.subject)}, ${q(m.text)}, ${q(JSON.stringify(files))}, 'queued', ${q(times[i])}, ${q(at)}) RETURNING id`);
      queued.push({ id: r[0].id, ...shown[i] });
    });

    // Tied deliveries become scheduled with their send time; any refused one is cancelled here too.
    let refused = [];
    if (tied.length) {
      const res = track(["update"], queued.filter((x) => x.delivery).map((x) => ({ id: x.delivery, status: "scheduled", planned_for: x.send_at })));
      refused = res.errors ?? [];
      const bad = new Set(refused.map((e) => Number(String(e).split(":")[0])));
      for (const x of queued.filter((x) => bad.has(x.delivery))) cancelRows([x.id]);
    }
    out({ queued: true, count: queued.length - refused.length, per_day: perDay, messages: queued, refused });
  },

  list() {
    const w = [];
    if (str(o.batch)) w.push(`batch IN (${o.batch.split(",").map(q).join(", ")})`);
    if (str(o.status)) { for (const s of o.status.split(",")) if (!STATUSES.includes(s)) fail(`Unknown status ${s}: ${STATUSES.join(", ")}`); w.push(`status IN (${o.status.split(",").map(q).join(", ")})`); }
    const [rows] = d1(cfg, `SELECT id, batch, delivery, to_addr, to_name, subject, status, send_at, sent_at, failed_at, cancelled_at, message_id, error FROM outbox${w.length ? ` WHERE ${w.join(" AND ")}` : ""} ORDER BY send_at`);
    out(rows.map((r) => ({ ...r, local: fmtLocal(cfg, r.sent_at ?? r.send_at) })));
  },

  cancel() {
    let ids;
    if (str(o.ids)) ids = o.ids.split(",").map(Number);
    else if (str(o.batch)) ids = d1(cfg, `SELECT id FROM outbox WHERE batch = ${q(o.batch)} AND status = 'queued'`)[0].map((r) => r.id);
    else fail("Usage: outbox.mjs cancel --ids 3,4 | --batch <name>");
    const done = cancelRows(ids);
    const tied = done.filter((r) => r.delivery);
    const res = tied.length ? track(["update"], tied.map((r) => ({ id: r.delivery, status: "cancelled" }))) : { errors: [] };
    out({ cancelled: done.map((r) => r.id), tracking: res.errors?.length ? res.errors : "ok", not_queued: ids.filter((i) => !done.some((r) => r.id === i)) });
  },
};

function cancelRows(ids) {
  if (!ids.length) return [];
  const [rows] = d1(cfg, `UPDATE outbox SET status = 'cancelled', cancelled_at = ${q(now())} WHERE id IN (${ids.map(Number).join(", ")}) AND status = 'queued' RETURNING id, delivery, attachments`);
  for (const r of rows) for (const a of JSON.parse(r.attachments || "[]")) kvDelete(cfg, a.key);
  return rows;
}

if (!commands[cmd]) fail(`Usage: outbox.mjs ${Object.keys(commands).join("|")} … (see the top of outbox.mjs)`);
try { commands[cmd](); } catch (e) { fail(e.message); }
