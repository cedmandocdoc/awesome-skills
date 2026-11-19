#!/usr/bin/env node
// building-promotion: renders the delivered set of existing promotions into each one's renders/, one after
// another, with the commands creating-still.md → 6 and creating-promotion.md → 11 use:
//   a still   node render-still.mjs frames/*.html --out renders   (the folder's own copy: a PNG and a JPEG per
//             frame and ratio, and thumbs/)
//   a video   npx --yes hyperframes@<the folder's pin> render --quality delivery -o renders/<NN-slug>-<ratio>.mp4,
//             and -c <name>.html -o renders/<NN-slug>-<name>-<ratio>.mp4 for each further root composition
//
//   node render-promotions.mjs [<target>…] [--missing] [--stills | --videos] [--list]
//
// Run from the repository. Every promotions root in it is in scope (index.md with the building-promotion
// marker); a target narrows that: a root or promotion folder (promotions/, promotions/01-one-photo), or an id,
// <root folder>/<NN-slug>, or its start (crew-payroll, crew-payroll/01). --missing keeps only the promotions
// with nothing rendered yet, --stills or --videos one format, and --list prints the plan and renders nothing.
// It writes only into renders/. A still whose frames fail render-still.mjs's checks is still rendered, and
// its issues are listed at the end.

import { execFileSync, spawn } from "node:child_process";
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const HERE = path.dirname(fileURLToPath(import.meta.url));
const AUTHOR = "d5c5849b-3fed-4204-a7a1-d245dcf86d09";
const FLAGS = ["--missing", "--stills", "--videos", "--list", "--help"];

const fail = (msg) => {
  console.error(msg);
  process.exit(2);
};
const argv = process.argv.slice(2).filter((a) => a !== "--");
const flags = new Set(argv.filter((a) => a.startsWith("--")));
const targets = argv.filter((a) => !a.startsWith("--"));
for (const f of flags) if (!FLAGS.includes(f)) fail(`Unknown flag ${f} (${FLAGS.join(", ")})`);
if (flags.has("--help")) {
  const lines = fs.readFileSync(fileURLToPath(import.meta.url), "utf8").split("\n").slice(1);
  console.log(lines.slice(0, lines.findIndex((l) => !l.startsWith("//"))).map((l) => l.replace(/^\/\/ ?/, "")).join("\n"));
  process.exit(0);
}

let REPO;
try {
  REPO = execFileSync("git", ["rev-parse", "--show-toplevel"], { encoding: "utf8", stdio: ["ignore", "pipe", "ignore"] }).trim();
} catch {
  REPO = process.cwd();
}

// Promotions roots: index.md files carrying the marker, outside dependencies, dot folders and skill folders
// (whose assets/index.md is the marker's template).
const SKIP = new Set(["node_modules", "dist", "build"]);
function roots(dir = REPO, depth = 0, out = []) {
  if (fs.existsSync(path.join(dir, "SKILL.md"))) return out;
  for (const e of fs.readdirSync(dir, { withFileTypes: true })) {
    if (e.isFile() && e.name === "index.md") {
      const fm = fs.readFileSync(path.join(dir, e.name), "utf8").match(/^---\n([\s\S]*?)\n---/)?.[1] ?? "";
      const field = (k) => fm.match(new RegExp(`^${k}:\\s*["']?([^"'\\n]*)`, "m"))?.[1].trim();
      if (field("doc_type") === "promotions-index" && field("generated_by") === "building-promotion" && field("author") === AUTHOR) out.push(dir);
    } else if (e.isDirectory() && depth < 6 && !e.name.startsWith(".") && !SKIP.has(e.name)) roots(path.join(dir, e.name), depth + 1, out);
  }
  return out;
}

// Every <NN-slug>/ folder with a promotion.md, and its format.
function scan() {
  const out = [];
  for (const root of roots()) {
    for (const e of fs.readdirSync(root, { withFileTypes: true })) {
      const dir = path.join(root, e.name);
      if (!e.isDirectory() || !/^\d{2}-/.test(e.name) || !fs.existsSync(path.join(dir, "promotion.md"))) continue;
      const has = (f) => fs.existsSync(path.join(dir, f));
      const format = has("frames") ? "still" : has("hyperframes.json") && has("index.html") ? "video" : null;
      out.push({ id: `${path.basename(root)}/${e.name}`, slug: e.name, dir, format });
    }
  }
  return out.sort((a, b) => (a.id < b.id ? -1 : 1));
}

const rendered = (dir) => {
  const r = path.join(dir, "renders");
  return fs.existsSync(r) && fs.readdirSync(r).some((f) => /\.(png|jpe?g|mp4|webm|mov)$/i.test(f));
};

// A root composition's ratio, from the first data-composition-id element of its page (1080x1920 → 9x16).
function ratioOf(file) {
  const tag = fs.readFileSync(file, "utf8").match(/<[^>]*\bdata-composition-id="[^"]*"[^>]*>/)?.[0] ?? "";
  const w = Number(tag.match(/\bdata-width="(\d+)"/)?.[1]), h = Number(tag.match(/\bdata-height="(\d+)"/)?.[1]);
  if (!w || !h) return null;
  const gcd = (a, b) => (b ? gcd(b, a % b) : a);
  return `${w / gcd(w, h)}x${h / gcd(w, h)}`;
}

// The HyperFrames package the folder pins in its render script ("npx --yes hyperframes@0.9.31 render").
function hyperframesOf(dir) {
  const pkg = path.join(dir, "package.json");
  const script = fs.existsSync(pkg) ? (JSON.parse(fs.readFileSync(pkg, "utf8")).scripts?.render ?? "") : "";
  return script.match(/\bhyperframes@[\w.-]+/)?.[0] ?? "hyperframes";
}

// The commands one promotion renders with, run in its folder.
function plan(p) {
  if (p.format === "still") {
    const pages = fs.readdirSync(path.join(p.dir, "frames")).filter((f) => f.endsWith(".html")).sort().map((f) => `frames/${f}`);
    if (!pages.length) throw new Error("frames/ has no pages");
    const own = path.join(p.dir, "render-still.mjs");
    const script = fs.existsSync(own) ? "render-still.mjs" : path.join(HERE, "render-still.mjs");
    return { what: `${pages.length} frame${pages.length > 1 ? "s" : ""}`, runs: [["node", [script, ...pages, "--out", "renders"]]] };
  }
  const hf = hyperframesOf(p.dir), outs = [], runs = [];
  const add = (file, out) => {
    outs.push(out);
    runs.push(["npx", ["--yes", hf, "render", ...(file === "index.html" ? [] : ["-c", file]), "--quality", "delivery", "-o", out]]);
  };
  const master = ratioOf(path.join(p.dir, "index.html"));
  if (!master) throw new Error("index.html has no data-width and data-height on its root composition");
  add("index.html", `renders/${p.slug}-${master}.mp4`);
  for (const f of fs.readdirSync(p.dir).filter((f) => f.endsWith(".html") && f !== "index.html").sort()) {
    const ratio = ratioOf(path.join(p.dir, f));
    if (ratio) add(f, `renders/${p.slug}-${f.slice(0, -5)}-${ratio}.mp4`);
  }
  return { what: outs.join(", "), runs };
}

// One command. A still prints a pass/FAIL line per frame and keeps its JSON report; a video shows one progress
// line from HyperFrames' @hf-progress events and keeps the rest of its log, printing its tail only on a failure.
function run(p, [cmd, args]) {
  return new Promise((resolve) => {
    const video = p.format === "video";
    const child = spawn(cmd, args, { cwd: p.dir, stdio: ["ignore", "pipe", video ? "pipe" : "inherit"] });
    let stdout = "",
      tail = [],
      pct = -1,
      partial = "";
    const progress = (n) => {
      if (n === pct) return;
      pct = n;
      if (process.stdout.isTTY) process.stdout.write(`\r  rendering ${n}%`);
      else if (n % 25 === 0) console.log(`  rendering ${n}%`);
    };
    const onVideo = (b) => {
      const lines = (partial + b).split(/\r?\n|\r/);
      partial = lines.pop();
      for (const line of lines) {
        const m = line.match(/^@hf-progress (\{.*\})$/);
        if (!m) {
          if (line.trim()) tail = [...tail.slice(-39), line];
          continue;
        }
        try {
          progress(JSON.parse(m[1]).pct);
        } catch {
          // a malformed event: skip it
        }
      }
    };
    if (video) {
      child.stdout.on("data", onVideo);
      child.stderr.on("data", onVideo);
    } else child.stdout.on("data", (b) => (stdout += b));
    child.on("error", (e) => resolve({ code: 2, error: e.message, issues: [] }));
    child.on("close", (code) => {
      if (video && pct >= 0 && process.stdout.isTTY) process.stdout.write("\n");
      if (video && code !== 0) console.log(tail.join("\n"));
      let issues = [];
      if (!video && code === 1) {
        try {
          issues = JSON.parse(stdout).flatMap((r) => r.issues.map((i) => `${path.basename(r.page)}: ${i}`));
        } catch {
          // no report: the summary says the checks failed
        }
      }
      resolve({ code, issues });
    });
  });
}

let picked = scan();
if (!picked.length) fail(`No promotions under ${REPO}: no index.md with the building-promotion marker has an NN-slug/ folder`);
if (targets.length) {
  const match = (p, t) => {
    const abs = path.resolve(t);
    if (fs.existsSync(abs) && fs.statSync(abs).isDirectory()) return p.dir === abs || p.dir.startsWith(abs + path.sep);
    const id = t.replace(/\/$/, "");
    return p.id === id || p.id.startsWith(`${id}/`) || (id.includes("/") && p.id.startsWith(id));
  };
  const unknown = targets.filter((t) => !picked.some((p) => match(p, t)));
  if (unknown.length) fail(`No promotion matches ${unknown.join(", ")}`);
  picked = picked.filter((p) => targets.some((t) => match(p, t)));
}
for (const p of picked.filter((x) => !x.format)) console.log(`skip ${p.id}: neither a still (frames/) nor a video (hyperframes.json and index.html)`);
picked = picked.filter((p) => p.format);
if (flags.has("--stills") !== flags.has("--videos")) picked = picked.filter((p) => p.format === (flags.has("--stills") ? "still" : "video"));
if (flags.has("--missing")) picked = picked.filter((p) => !rendered(p.dir));

const jobs = picked.map((p) => {
  try {
    return { p, job: plan(p) };
  } catch (e) {
    return { p, error: e.message };
  }
});
if (!jobs.length) {
  console.log("Nothing to render.");
  process.exit(0);
}
const videos = jobs.filter((j) => j.p.format === "video").length;
console.log(`${jobs.length} promotion${jobs.length > 1 ? "s" : ""} to render (${jobs.length - videos} still, ${videos} video):`);
for (const { p, job, error } of jobs) console.log(`  ${p.format.padEnd(5)}  ${p.id}  ${error ? `· can't: ${error}` : `→ ${job.what}`}`);
if (flags.has("--list")) process.exit(0);
if (videos) {
  try {
    execFileSync("ffmpeg", ["-version"], { stdio: "ignore" });
  } catch {
    fail("A video render needs ffmpeg: https://ffmpeg.org/download.html");
  }
}

const results = [];
for (const [i, { p, job, error }] of jobs.entries()) {
  if (error) {
    results.push({ p, ok: false, note: error, issues: [] });
    continue;
  }
  console.log(`\n[${i + 1}/${jobs.length}] ${p.id} (${p.format})`);
  const started = Date.now();
  let ok = true,
    note = job.what,
    issues = [];
  for (const r of job.runs) {
    const res = await run(p, r);
    issues = issues.concat(res.issues);
    if (res.code === 0 || (p.format === "still" && res.code === 1)) continue;
    ok = false;
    note = res.error ?? `${r[1].at(-1)}: exited with code ${res.code}`;
    break;
  }
  results.push({ p, ok, note, issues, secs: Math.round((Date.now() - started) / 1000) });
}

console.log("\nDone:");
for (const r of results) {
  console.log(`  ${(!r.ok ? "FAILED" : r.issues.length ? "checks" : "ok").padEnd(6)}  ${r.p.id}  ${r.note}${r.secs != null ? `  (${r.secs}s)` : ""}`);
  for (const issue of r.issues) console.log(`            ${issue}`);
}
const failed = results.filter((r) => !r.ok).length;
console.log(`\n${results.length - failed} rendered${failed ? `, ${failed} failed` : ""}.`);
process.exitCode = failed ? 1 : 0;
