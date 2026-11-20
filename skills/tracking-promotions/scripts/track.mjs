#!/usr/bin/env node
// The tracking-promotions CLI, run from the repository. Reads its config from the tracking root's index.md.
//
//   node track.mjs setup                         create the database when missing, then its tables
//   node track.mjs check                         exit 0 when the database answers with both tables
//   node track.mjs record [--file <json>|-]      record approved deliveries (a JSON array or object; stdin by default)
//   node track.mjs update --id <n> --status <s> [--link …] [--error …] [--note …] [--planned-for <ISO time>]
//   node track.mjs update --file <json>|-        the same for a JSON array, or JSON lines, of { id, status, link?, error?, note?, planned_for? }
//   node track.mjs list [--kind post|message] [--channel …] [--status …] [--batch …] [--label …] [--ref a,b] [--promotion …]
//   node track.mjs promotions                    every promotion with its state, as JSON
//   node track.mjs backup [--dir <folder>]       export the database to <folder>/<database>-<date>.sql
//
// Output is JSON on stdout; errors go to stderr with exit code 1. record writes nothing when any item is
// invalid; update applies every change it can and lists the ones it couldn't.

import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import { args, d1, DELIVERY_COLS, fingerprint, loadConfig, now, promotionStates, q, readInput, scanPromotions, SCHEMA, shapeDelivery, STATUSES, wrangler } from "./tracking-lib.mjs";

const o = args(), cmd = o._[0];
const out = (v) => process.stdout.write(JSON.stringify(v, null, 2) + "\n");
const fail = (msg) => { process.stderr.write(`${msg}\n`); process.exit(1); };
const str = (v) => (typeof v === "string" && v.trim() ? v.trim() : null);

let cfg;
try { cfg = loadConfig(); } catch (e) { fail(e.message); }

// A status may follow only these; each sets its own time.
const FROM = { scheduled: ["approved"], sent: ["approved", "scheduled"], failed: ["approved", "scheduled"], replied: ["sent"], bounced: ["sent"],
  stopped: ["sent", "replied"], cancelled: ["approved", "scheduled", "failed"] };
const TIME = { scheduled: "scheduled_at", sent: "sent_at", failed: "failed_at", replied: "answered_at", bounced: "answered_at", stopped: "answered_at", cancelled: "cancelled_at" };

const commands = {
  setup() {
    const list = JSON.parse(wrangler(cfg, ["d1", "list", "--json"]));
    if (!list.some((d) => d.name === cfg.database)) wrangler(cfg, ["d1", "create", cfg.database]);
    d1(cfg, SCHEMA.join(";\n"));
    out({ database: cfg.database, tables: ["promotions", "deliveries"] });
  },

  check() {
    const [t] = d1(cfg, "SELECT name FROM sqlite_master WHERE type = 'table' AND name IN ('promotions', 'deliveries')");
    if (t.length !== 2) fail(`${cfg.database} lacks its tables: run track.mjs setup`);
    out({ database: cfg.database, ok: true });
  },

  record() {
    const raw = JSON.parse(readInput(o.file));
    const items = Array.isArray(raw) ? raw : [raw];
    if (!items.length) fail("Nothing to record");
    const known = new Map(scanPromotions().map((p) => [p.id, p]));
    const errors = [], rows = [], at = now();
    items.forEach((d, i) => {
      const where = `#${i + 1}${d.target_name ? ` (${d.target_name})` : ""}`;
      const p = known.get(d.promotion);
      if (!p) errors.push(`${where}: no promotion ${d.promotion} in a promotions root`);
      if (!["post", "message"].includes(d.kind)) errors.push(`${where}: kind is post or message`);
      if (!str(d.channel)) errors.push(`${where}: no channel`);
      if (!str(d.text)) errors.push(`${where}: no text (the caption or the message body, as it goes out)`);
      if (!Array.isArray(d.assets) || !d.assets.length || d.assets.some((a) => typeof a !== "string" || a.startsWith("/") || a.includes("..")))
        errors.push(`${where}: assets is a list of paths inside the promotion folder`);
      if (d.kind === "message" && !str(d.target)) errors.push(`${where}: a message needs its target (the address it goes to)`);
      const status = d.status ?? "approved";
      if (!["approved", "scheduled", "sent"].includes(status)) errors.push(`${where}: a new delivery is approved, scheduled or sent`);
      rows.push({ ...d, status, assets: JSON.stringify(d.assets ?? []), fill: d.fill ? JSON.stringify(d.fill) : null, approved_at: at,
        scheduled_at: status === "scheduled" ? at : null, sent_at: status === "sent" ? at : null });
    });
    if (errors.length) fail(errors.join("\n"));

    // Freeze each promotion at its first delivery; a frozen one must still match its fingerprint.
    const ids = [...new Set(items.map((d) => d.promotion))];
    const [frozen] = d1(cfg, `SELECT id, fingerprint, frozen_at FROM promotions WHERE id IN (${ids.map(q).join(", ")})`);
    const fresh = [];
    for (const id of ids) {
      const f = frozen.find((x) => x.id === id), fp = fingerprint(known.get(id).dir);
      if (!f) fresh.push({ id, fp });
      else if (f.fingerprint !== fp) errors.push(`${id} changed since it was frozen on ${f.frozen_at.slice(0, 10)}: restore its source, or make the change in a new promotion folder`);
    }
    if (errors.length) fail(errors.join("\n"));
    const sql = [
      ...(fresh.length ? [`INSERT INTO promotions (id, fingerprint, frozen_at) VALUES ${fresh.map((f) => `(${q(f.id)}, ${q(f.fp)}, ${q(at)})`).join(", ")}`] : []),
      `INSERT INTO deliveries (${DELIVERY_COLS.join(", ")}) VALUES ${rows.map((r) => `(${DELIVERY_COLS.map((k) => q(r[k])).join(", ")})`).join(", ")} RETURNING id, promotion, kind, channel, target_name, status`,
    ];
    const res = d1(cfg, sql.join(";\n"));
    out({ frozen: fresh.map((f) => f.id), recorded: res.at(-1) });
  },

  update() {
    let changes;
    if (o.file !== undefined) {
      const raw = readInput(o.file).trim();
      changes = raw.startsWith("[") ? JSON.parse(raw) : raw.split("\n").filter(Boolean).map((l) => JSON.parse(l));
    } else changes = [{ id: o.id, status: o.status, link: o.link, error: o.error, note: o.note, planned_for: o["planned-for"] }];
    const results = [], errors = [];
    for (const c of changes) {
      const id = Number(c.id), s = c.status;
      if (!Number.isInteger(id) || !FROM[s]) { errors.push(`${c.id ?? "?"}: each change needs a delivery id and a status: ${Object.keys(FROM).join(", ")}`); continue; }
      const set = [`status = ${q(s)}`, `${TIME[s]} = ${q(now())}`];
      if (str(c.link)) set.push(`link = ${q(c.link)}`);
      if (s === "failed") set.push(`error = ${q(str(c.error) ?? "failed")}`);
      if (str(c.note)) set.push(`note = ${q(c.note)}`);
      if (s === "scheduled" && str(c.planned_for)) {
        if (Number.isNaN(Date.parse(c.planned_for))) { errors.push(`${id}: planned_for is an ISO time`); continue; }
        set.push(`planned_for = ${q(new Date(c.planned_for).toISOString())}`);
      }
      const [r] = d1(cfg, `UPDATE deliveries SET ${set.join(", ")} WHERE id = ${id} AND status IN (${FROM[s].map(q).join(", ")}) RETURNING id, status`);
      if (!r.length) {
        const [cur] = d1(cfg, `SELECT status FROM deliveries WHERE id = ${id}`);
        errors.push(cur.length ? `${id}: it is ${cur[0].status} and can't become ${s} (from ${FROM[s].join(" or ")} only)` : `${id}: no such delivery`);
        continue;
      }
      results.push(r[0]);
    }
    out({ updated: results, errors });
    if (errors.length) fail(errors.join("\n"));
  },

  list() {
    const w = [];
    for (const k of ["kind", "channel", "status", "batch", "label", "promotion"]) if (str(o[k])) w.push(`${k} IN (${o[k].split(",").map(q).join(", ")})`);
    if (str(o.ref)) w.push(`ref IN (${o.ref.split(",").map(q).join(", ")})`);
    for (const s of str(o.status)?.split(",") ?? []) if (!STATUSES.includes(s)) fail(`Unknown status ${s}: ${STATUSES.join(", ")}`);
    const [rows] = d1(cfg, `SELECT * FROM deliveries${w.length ? ` WHERE ${w.join(" AND ")}` : ""} ORDER BY id`);
    out(rows.map(shapeDelivery));
  },

  promotions() {
    const [frozen] = d1(cfg, "SELECT * FROM promotions");
    out(promotionStates(frozen).map(({ dir, ...p }) => p));
  },

  backup() {
    const dir = (str(o.dir) ?? path.join(os.homedir(), ".awesome-skills", "tracking-promotions", "backups")).replace(/^~/, os.homedir());
    fs.mkdirSync(dir, { recursive: true });
    const file = path.join(dir, `${cfg.database}-${now().slice(0, 10)}.sql`);
    wrangler(cfg, ["d1", "export", cfg.database, "--remote", "--output", file]);
    out({ file, kb: Math.round(fs.statSync(file).size / 1024) });
  },
};

if (!commands[cmd]) fail(`Usage: track.mjs ${Object.keys(commands).join("|")} … (see the top of track.mjs)`);
try { commands[cmd](); } catch (e) { fail(e.message); }
