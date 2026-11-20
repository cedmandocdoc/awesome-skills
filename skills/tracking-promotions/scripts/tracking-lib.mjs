// tracking-promotions: the tracking root's config, Cloudflare D1 through Wrangler, and the promotions read
// from building-promotion roots. Promotion folders are only ever read.

import { createHash } from "node:crypto";
import { execFile, execFileSync } from "node:child_process";
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { promisify } from "node:util";

const HERE = path.dirname(fileURLToPath(import.meta.url));
export const REPO = execFileSync("git", ["rev-parse", "--show-toplevel"], { encoding: "utf8" }).trim();
export const AUTHOR = "eb59f31b-fd99-476e-af15-8d0690701ab6";
const PROMOTIONS_AUTHOR = "d5c5849b-3fed-4204-a7a1-d245dcf86d09"; // building-promotion's author signature

// Frontmatter: `key: value` lines and `key:` followed by `  - item` lines. Quotes are dropped.
export function frontmatter(text) {
  const m = text.match(/^---\n([\s\S]*?)\n---/);
  const out = {};
  if (!m) return out;
  let list = null;
  for (const line of m[1].split("\n")) {
    const item = line.match(/^\s+-\s+(.*)$/);
    if (item && list) { out[list].push(unquote(item[1])); continue; }
    const kv = line.match(/^([A-Za-z_][\w-]*):\s*(.*)$/);
    if (!kv) continue;
    list = null;
    if (kv[2] === "") { out[kv[1]] = []; list = kv[1]; } else out[kv[1]] = unquote(kv[2]);
  }
  return out;
}
const unquote = (s) => s.trim().replace(/^"(.*)"$/, "$1").replace(/^'(.*)'$/, "$1");

const SKIP_DIRS = new Set(["node_modules", "dist", "build"]);
// Every index.md in the repository, leaving out dependencies, dot folders, and skill folders (whose assets/
// hold root-marker templates).
function indexFiles(dir = REPO, depth = 0, out = []) {
  if (fs.existsSync(path.join(dir, "SKILL.md"))) return out;
  for (const e of fs.readdirSync(dir, { withFileTypes: true })) {
    if (e.isFile() && e.name === "index.md") out.push(path.join(dir, e.name));
    else if (e.isDirectory() && depth < 5 && !e.name.startsWith(".") && !SKIP_DIRS.has(e.name)) indexFiles(path.join(dir, e.name), depth + 1, out);
  }
  return out;
}
const marked = (docType, by, author) =>
  indexFiles().filter((f) => { const fm = frontmatter(fs.readFileSync(f, "utf8")); return fm.doc_type === docType && fm.generated_by === by && fm.author === author; });

// The tracking root: <root>/index.md, the config every command reads.
export function loadConfig() {
  const hits = marked("tracking-index", "tracking-promotions", AUTHOR);
  if (hits.length !== 1) throw new Error(hits.length ? `Several tracking roots: ${hits.map((h) => path.relative(REPO, h)).join(", ")}` : "No tracking root (tracking-promotions → Set up)");
  const fm = frontmatter(fs.readFileSync(hits[0], "utf8"));
  const list = (v) => (Array.isArray(v) ? v : !v || v === "none" ? [] : [v]);
  const opt = (v) => (!v || v === "none" ? null : v);
  for (const k of ["database", "account_id"]) if (!opt(fm[k])) throw new Error(`${path.relative(REPO, hits[0])} has no ${k} (tracking-promotions → Set up)`);
  return {
    file: hits[0], database: fm.database, account_id: fm.account_id,
    brand: opt(fm.board_brand) ?? "Promotions", theme: list(fm.board_theme), public: opt(fm.board_public), logo: opt(fm.board_logo),
  };
}

// D1 ------------------------------------------------------------------------------------------------------

const WRANGLER = path.join(HERE, "wrangler.toml");
const env = (cfg) => ({ ...process.env, CLOUDFLARE_ACCOUNT_ID: cfg.account_id });
const d1Args = (cfg, sql) => ["--yes", "wrangler", "d1", "execute", cfg.database, "--remote", "--json", "--config", WRANGLER, "--command", sql];
const parse = (out) => JSON.parse(out).map((r) => r.results ?? []);
const failure = (e) => new Error(`D1: ${String(e.stderr || e.stdout || e.message).trim().split("\n").filter(Boolean).slice(-3).join(" ")}`);
// One call runs every statement in sql and returns one result list per statement.
export function d1(cfg, sql) {
  try { return parse(execFileSync("npx", d1Args(cfg, sql), { encoding: "utf8", env: env(cfg), maxBuffer: 1 << 26, stdio: ["ignore", "pipe", "pipe"] })); }
  catch (e) { throw failure(e); }
}
const run = promisify(execFile);
export async function d1Async(cfg, sql) {
  try { return parse((await run("npx", d1Args(cfg, sql), { encoding: "utf8", env: env(cfg), maxBuffer: 1 << 26 })).stdout); }
  catch (e) { throw failure(e); }
}
export function wrangler(cfg, args, opts = {}) {
  return execFileSync("npx", ["--yes", "wrangler", ...args, "--config", WRANGLER], { encoding: "utf8", env: env(cfg), stdio: ["ignore", "pipe", "pipe"], ...opts });
}
export const q = (v) => (v == null || v === "" ? "NULL" : typeof v === "number" ? String(v) : `'${String(v).replace(/'/g, "''")}'`);
export const now = () => new Date().toISOString();

export const STATUSES = ["approved", "scheduled", "sent", "failed", "replied", "bounced", "stopped", "cancelled"];
export const SCHEMA = [
  `CREATE TABLE IF NOT EXISTS promotions (id TEXT PRIMARY KEY, fingerprint TEXT NOT NULL, frozen_at TEXT NOT NULL, note TEXT)`,
  `CREATE TABLE IF NOT EXISTS deliveries (id INTEGER PRIMARY KEY AUTOINCREMENT, promotion TEXT NOT NULL REFERENCES promotions(id),
    kind TEXT NOT NULL CHECK (kind IN ('post', 'message')), channel TEXT NOT NULL, format TEXT, label TEXT, assets TEXT NOT NULL, fill TEXT,
    target TEXT, target_name TEXT, ref TEXT, subject TEXT, text TEXT NOT NULL, batch TEXT,
    status TEXT NOT NULL CHECK (status IN (${STATUSES.map(q).join(", ")})), link TEXT, error TEXT, note TEXT,
    approved_at TEXT NOT NULL, planned_for TEXT, scheduled_at TEXT, sent_at TEXT, failed_at TEXT, answered_at TEXT, cancelled_at TEXT)`,
  `CREATE INDEX IF NOT EXISTS deliveries_by_promotion ON deliveries(promotion)`,
  `CREATE INDEX IF NOT EXISTS deliveries_by_ref ON deliveries(ref)`,
];
export const DELIVERY_COLS = ["promotion", "kind", "channel", "format", "label", "assets", "fill", "target", "target_name", "ref", "subject", "text",
  "batch", "status", "link", "note", "approved_at", "planned_for", "scheduled_at", "sent_at"];
// A delivery row as callers see it: assets and fill parsed.
export const shapeDelivery = (d) => ({ ...d, assets: JSON.parse(d.assets || "[]"), fill: d.fill ? JSON.parse(d.fill) : null });

// Promotions: read from building-promotion roots -----------------------------------------------------------

// Every promotions root, and every NN-slug/ folder with a promotion.md in it. A promotion's id is
// <root folder>/<NN-slug>.
export function scanPromotions() {
  const out = [];
  for (const idx of marked("promotions-index", "building-promotion", PROMOTIONS_AUTHOR)) {
    const root = path.dirname(idx), app = path.basename(root);
    for (const e of fs.readdirSync(root, { withFileTypes: true })) {
      const dir = path.join(root, e.name), md = path.join(dir, "promotion.md");
      if (!e.isDirectory() || !/^\d{2}-/.test(e.name) || !fs.existsSync(md)) continue;
      const text = fs.readFileSync(md, "utf8"), fm = frontmatter(text);
      out.push({ id: `${app}/${e.name}`, app, dir, format: fm.format || (fs.existsSync(path.join(dir, "frames")) ? "still" : "video"), plan: section(text, "Message plan") });
    }
  }
  return out.sort((a, b) => (a.id < b.id ? -1 : 1));
}
const section = (text, name) => text.match(new RegExp(`^## ${name}\\n([\\s\\S]*?)(?=^## |(?![\\s\\S]))`, "m"))?.[1].trim() ?? "";

// The fingerprint: every file of the folder but promotion.md, outputs (renders/, snapshots/), dependencies
// and dot entries (caches).
const OUTPUTS = new Set(["renders", "snapshots", "node_modules"]);
export function fingerprint(dir) {
  const files = [];
  const walk = (d) => {
    for (const e of fs.readdirSync(d, { withFileTypes: true })) {
      if (e.name.startsWith(".") || (e.isDirectory() && OUTPUTS.has(e.name))) continue;
      const rel = path.relative(dir, path.join(d, e.name));
      if (e.isDirectory()) walk(path.join(d, e.name));
      else if (rel !== "promotion.md") files.push(rel);
    }
  };
  walk(dir);
  const h = createHash("sha256");
  for (const f of files.sort()) h.update(f + "\0").update(fs.readFileSync(path.join(dir, f))).update("\0");
  return h.digest("hex");
}

// A promotion's outputs in renders/: images (a JPEG over the PNG of the same frame), videos, and the
// one-third thumbnails building-promotion writes for stills.
export function rendersOf(dir) {
  const r = path.join(dir, "renders");
  if (!fs.existsSync(r)) return { images: [], videos: [], thumbs: {} };
  const files = fs.readdirSync(r).filter((f) => !f.startsWith(".") && !f.startsWith("sheet-") && fs.statSync(path.join(r, f)).isFile());
  const jpg = new Set(files.filter((f) => /\.jpe?g$/i.test(f)).map((f) => f.replace(/\.jpe?g$/i, "")));
  const images = files.filter((f) => /\.jpe?g$/i.test(f) || (/\.png$/i.test(f) && !jpg.has(f.slice(0, -4)))).sort().map((f) => `renders/${f}`);
  const thumbs = {};
  const t = path.join(r, "thumbs");
  if (fs.existsSync(t)) for (const f of fs.readdirSync(t).filter((x) => /\.png$/i.test(x))) thumbs[f.slice(0, -4)] = `renders/thumbs/${f}`;
  return { images, videos: files.filter((f) => /\.(mp4|webm|mov)$/i.test(f)).sort().map((f) => `renders/${f}`), thumbs };
}

// Every promotion with its state: live (no delivery yet), ok (frozen, source unchanged), changed, or missing
// (frozen, folder gone).
export function promotionStates(frozenRows) {
  const scanned = scanPromotions(), frozen = new Map(frozenRows.map((p) => [p.id, p]));
  const out = scanned.map((p) => {
    const f = frozen.get(p.id), current = fingerprint(p.dir);
    return { id: p.id, app: p.app, dir: p.dir, format: p.format, plan: p.plan, frozen_at: f?.frozen_at ?? null, fingerprint: f?.fingerprint ?? null, current,
      source: !f ? "live" : f.fingerprint === current ? "ok" : "changed", renders: rendersOf(p.dir), note: f?.note ?? null };
  });
  for (const f of frozenRows) if (!scanned.some((p) => p.id === f.id))
    out.push({ id: f.id, app: f.id.split("/")[0], dir: null, format: null, plan: "", frozen_at: f.frozen_at, fingerprint: f.fingerprint, current: null, source: "missing", renders: { images: [], videos: [], thumbs: {} }, note: f.note });
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
