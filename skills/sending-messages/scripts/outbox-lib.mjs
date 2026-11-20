// sending-messages: the sending root's config, Cloudflare D1 and KV through Wrangler, the send-window planner,
// and the optional link to a tracking-promotions database.

import { createHash } from "node:crypto";
import { execFileSync } from "node:child_process";
import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import { fileURLToPath } from "node:url";

export const HERE = path.dirname(fileURLToPath(import.meta.url));
const git = (...a) => execFileSync("git", a, { encoding: "utf8" }).trim();
export const REPO = git("rev-parse", "--show-toplevel");
export const MAIN = path.dirname(git("rev-parse", "--path-format=absolute", "--git-common-dir")); // the main checkout
export const AUTHOR = "e174974e-3680-4d3d-b926-27cf069d9f5f";
const TRACKER_ID = "1f308488-2ec0-4a45-aaf5-a9fa2af7d03b"; // tracking-promotions

// Config -----------------------------------------------------------------------------------------------------

export function frontmatter(text) {
  const m = text.match(/^---\n([\s\S]*?)\n---/);
  const out = {};
  for (const line of m ? m[1].split("\n") : []) {
    const kv = line.match(/^([A-Za-z_][\w-]*):\s*(.*)$/);
    if (kv) out[kv[1]] = kv[2].trim().replace(/^"(.*)"$/, "$1").replace(/^'(.*)'$/, "$1");
  }
  return out;
}

function indexFiles(dir = REPO, depth = 0, out = []) {
  if (fs.existsSync(path.join(dir, "SKILL.md"))) return out;
  for (const e of fs.readdirSync(dir, { withFileTypes: true })) {
    if (e.isFile() && e.name === "index.md") out.push(path.join(dir, e.name));
    else if (e.isDirectory() && depth < 5 && !e.name.startsWith(".") && !["node_modules", "dist", "build"].includes(e.name)) indexFiles(path.join(dir, e.name), depth + 1, out);
  }
  return out;
}

const REQUIRED = ["account_id", "database", "worker", "from", "smtp_host", "smtp_port", "timezone", "hours", "days", "daily_cap", "gap_minutes"];
export function loadConfig() {
  const hits = indexFiles().filter((f) => { const fm = frontmatter(fs.readFileSync(f, "utf8")); return fm.doc_type === "sending-index" && fm.generated_by === "sending-messages" && fm.author === AUTHOR; });
  if (hits.length !== 1) throw new Error(hits.length ? `Several sending roots: ${hits.map((h) => path.relative(REPO, h)).join(", ")}` : "No sending root (sending-messages → Set up)");
  const fm = frontmatter(fs.readFileSync(hits[0], "utf8"));
  const missing = REQUIRED.filter((k) => !fm[k] || fm[k] === "none");
  if (missing.length) throw new Error(`${path.relative(REPO, hits[0])} has no ${missing.join(", ")} (sending-messages → Set up)`);
  const opt = (v) => (!v || v === "none" ? null : v);
  const [hFrom, hTo] = fm.hours.split("-").map(Number);
  const [gMin, gMax] = fm.gap_minutes.split("-").map(Number);
  return {
    file: hits[0], account_id: fm.account_id, database: fm.database, kv_id: opt(fm.kv_id), worker: fm.worker, from: fm.from,
    smtp_host: fm.smtp_host, smtp_port: Number(fm.smtp_port), env_file: opt(fm.env_file), smtp_user_var: opt(fm.smtp_user_var) ?? "SMTP_USER", smtp_pass_var: opt(fm.smtp_pass_var) ?? "SMTP_PASS",
    list_unsubscribe: opt(fm.list_unsubscribe), timezone: fm.timezone, hours: [hFrom, hTo], days: parseDays(fm.days), days_text: fm.days,
    daily_cap: Number(fm.daily_cap), gap: [gMin, gMax ?? gMin], tracking_database: opt(fm.tracking_database),
  };
}
// Writes one frontmatter field back into the sending root's index.md.
export function setConfig(cfg, key, value) {
  const text = fs.readFileSync(cfg.file, "utf8");
  const re = new RegExp(`^${key}:.*$`, "m");
  fs.writeFileSync(cfg.file, re.test(text) ? text.replace(re, `${key}: ${value}`) : text.replace(/\n---\n/, `\n${key}: ${value}\n---\n`));
}

const DAY_NAMES = ["sun", "mon", "tue", "wed", "thu", "fri", "sat"];
function parseDays(s) {
  const set = new Set();
  for (const part of s.toLowerCase().split(",").map((x) => x.trim())) {
    const [a, b] = part.split("-").map((d) => DAY_NAMES.indexOf(d.slice(0, 3)));
    if (a < 0 || (b !== undefined && b < 0)) throw new Error(`days: ${s} (use names like mon-sat or mon,wed,fri)`);
    for (let d = a; ; d = (d + 1) % 7) { set.add(d); if (b === undefined || d === b) break; }
  }
  return set;
}

// Wrangler, D1, KV -------------------------------------------------------------------------------------------

const WRANGLER = path.join(HERE, "wrangler.toml");
const env = (cfg) => ({ ...process.env, CLOUDFLARE_ACCOUNT_ID: cfg.account_id });
const failure = (what, e) => new Error(`${what}: ${String(e.stderr || e.stdout || e.message).trim().split("\n").filter(Boolean).slice(-3).join(" ")}`);
export function wrangler(cfg, argv, opts = {}) {
  try { return execFileSync("npx", ["--yes", "wrangler", ...argv, ...(opts.noConfig ? [] : ["--config", WRANGLER])], { encoding: "utf8", env: env(cfg), stdio: ["pipe", "pipe", "pipe"], maxBuffer: 1 << 26, cwd: HERE, ...opts }); }
  catch (e) { throw failure("wrangler", e); }
}
export function d1(cfg, sql, database = cfg.database) {
  try {
    const out = execFileSync("npx", ["--yes", "wrangler", "d1", "execute", database, "--remote", "--json", "--config", WRANGLER, "--command", sql],
      { encoding: "utf8", env: env(cfg), maxBuffer: 1 << 26, cwd: HERE, stdio: ["ignore", "pipe", "pipe"] });
    return JSON.parse(out).map((r) => r.results ?? []);
  } catch (e) { throw failure(`D1 ${database}`, e); }
}
export const q = (v) => (v == null || v === "" ? "NULL" : typeof v === "number" ? String(v) : `'${String(v).replace(/'/g, "''")}'`);
export const now = () => new Date().toISOString();

export const STATUSES = ["queued", "sent", "failed", "cancelled", "skipped"];
export const SCHEMA = [
  `CREATE TABLE IF NOT EXISTS outbox (id INTEGER PRIMARY KEY AUTOINCREMENT, batch TEXT, delivery INTEGER, to_addr TEXT NOT NULL, to_name TEXT,
    subject TEXT NOT NULL, text TEXT NOT NULL, attachments TEXT NOT NULL DEFAULT '[]',
    status TEXT NOT NULL CHECK (status IN ('queued', 'sent', 'failed', 'cancelled', 'skipped')),
    send_at TEXT NOT NULL, queued_at TEXT NOT NULL, sent_at TEXT, failed_at TEXT, cancelled_at TEXT, message_id TEXT, error TEXT)`,
  `CREATE INDEX IF NOT EXISTS outbox_due ON outbox (status, send_at)`,
  `CREATE INDEX IF NOT EXISTS outbox_batch ON outbox (batch)`,
];

export const kvPut = (cfg, key, file) => wrangler(cfg, ["kv", "key", "put", key, "--path", file, "--namespace-id", cfg.kv_id, "--remote"]);
export const kvDelete = (cfg, key) => { try { wrangler(cfg, ["kv", "key", "delete", key, "--namespace-id", cfg.kv_id, "--remote"]); } catch { /* already gone */ } };

// Tracking (optional): tracking-promotions' CLI, found like any dependency skill --------------------------------

let trackCli;
function findTracker() {
  const roots = [".agents/skills", ".claude/skills", ".cursor/skills", ".codex/skills", ".github/skills"].map((r) => path.join(REPO, r))
    .concat([".agents/skills", ".claude/skills", ".cursor/skills", ".codex/skills"].map((r) => path.join(os.homedir(), r)));
  for (const r of roots) {
    const md = path.join(r, "tracking-promotions", "SKILL.md");
    if (fs.existsSync(md) && fs.readFileSync(md, "utf8").includes(`id: ${TRACKER_ID}`)) return path.join(r, "tracking-promotions", "scripts", "track.mjs");
  }
  throw new Error("tracking_database is set but tracking-promotions isn't installed (sending-messages → Setup)");
}
export function track(argv, input) {
  trackCli ??= findTracker();
  try {
    return JSON.parse(execFileSync("node", [trackCli, ...argv, ...(input ? ["--file", "-"] : [])], { encoding: "utf8", cwd: REPO, input: input ? JSON.stringify(input) : undefined, maxBuffer: 1 << 26, stdio: ["pipe", "pipe", "pipe"] }));
  } catch (e) {
    const err = String(e.stdout || "").trim();
    try { return JSON.parse(err); } catch { throw new Error(`tracking-promotions: ${String(e.stderr || e.message).trim()}`); }
  }
}

// The send window ---------------------------------------------------------------------------------------------

// A time's wall clock in the configured timezone: its date (YYYY-MM-DD), weekday (0 = Sunday) and minute of day.
export function localParts(date, timezone) {
  const p = Object.fromEntries(new Intl.DateTimeFormat("en-US", { timeZone: timezone, year: "numeric", month: "2-digit", day: "2-digit", weekday: "short", hour: "2-digit", minute: "2-digit", hourCycle: "h23" })
    .formatToParts(date).map((x) => [x.type, x.value]));
  return { day: `${p.year}-${p.month}-${p.day}`, weekday: DAY_NAMES.indexOf(p.weekday.toLowerCase()), minute: Number(p.hour) * 60 + Number(p.minute) };
}
export const inWindow = (cfg, date) => { const l = localParts(date, cfg.timezone); return cfg.days.has(l.weekday) && l.minute >= cfg.hours[0] * 60 && l.minute < cfg.hours[1] * 60; };
export const fmtLocal = (cfg, iso) => new Intl.DateTimeFormat("en-PH", { timeZone: cfg.timezone, weekday: "short", month: "short", day: "numeric", hour: "numeric", minute: "2-digit" }).format(new Date(iso));

// "2026-11-20 09:00" or "2026-11-20T09:00" in the configured timezone, or an ISO time with its own offset.
export function parseStart(cfg, s) {
  if (!s || s === true) return new Date();
  if (/[zZ]|[+-]\d\d:?\d\d$/.test(s)) return new Date(s);
  const m = s.match(/^(\d{4})-(\d\d)-(\d\d)(?:[ T](\d\d):(\d\d))?$/);
  if (!m) throw new Error(`--start ${s}: use YYYY-MM-DD HH:MM (${cfg.timezone})`);
  const guess = new Date(Date.UTC(+m[1], +m[2] - 1, +m[3], +(m[4] ?? 0), +(m[5] ?? 0)));
  const l = localParts(guess, cfg.timezone); // shift by the zone's offset at that time
  const offset = (Date.UTC(+l.day.slice(0, 4), +l.day.slice(5, 7) - 1, +l.day.slice(8, 10)) + l.minute * 60000) - guess.getTime();
  return new Date(guess.getTime() - offset);
}

// A seeded random so the same items and start give the same plan between the look and the go.
function rng(seed) {
  let h = createHash("sha256").update(seed).digest().readUInt32LE(0);
  return () => { h = (h + 0x6d2b79f5) | 0; let t = Math.imul(h ^ (h >>> 15), 1 | h); t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t; return ((t ^ (t >>> 14)) >>> 0) / 4294967296; };
}

// Gives each message a send time: inside the window, a random gap apart, at most daily_cap a day counting what
// is already queued or sent for that day. taken: { "<YYYY-MM-DD>": count }.
export function plan(cfg, count, start, taken, seed) {
  const rand = rng(seed);
  const perDay = { ...taken };
  let t = new Date(Math.ceil(start.getTime() / 300000) * 300000); // the next 5 minutes, so a plan holds a while
  const out = [];
  for (let i = 0; i < count; i++) {
    for (let guard = 0; ; guard++) {
      if (guard > 60 * 24 * 120) throw new Error("No room in the send window within 120 days");
      const l = localParts(t, cfg.timezone);
      if (inWindow(cfg, t) && (perDay[l.day] ?? 0) < cfg.daily_cap) break;
      t = new Date(t.getTime() + 60000);
    }
    const day = localParts(t, cfg.timezone).day;
    perDay[day] = (perDay[day] ?? 0) + 1;
    out.push(t.toISOString());
    const gap = cfg.gap[0] + rand() * (cfg.gap[1] - cfg.gap[0]);
    t = new Date(t.getTime() + Math.round(gap * 60000));
  }
  return out;
}

export function args(argv = process.argv.slice(2)) {
  const o = { _: [] };
  for (let i = 0; i < argv.length; i++) {
    const a = argv[i];
    if (!a.startsWith("--")) o._.push(a);
    else if (argv[i + 1] === undefined || argv[i + 1].startsWith("--")) o[a.slice(2)] = true;
    else o[a.slice(2)] = argv[++i];
  }
  return o;
}
export const readInput = (file) => fs.readFileSync(typeof file === "string" && file !== "-" ? file : 0, "utf8");
export function loadEnvFile(cfg) {
  const file = cfg.env_file ? path.resolve(MAIN, cfg.env_file) : null;
  if (file && fs.existsSync(file)) process.loadEnvFile(file);
  return file;
}
