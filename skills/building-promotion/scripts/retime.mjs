// retime.mjs: writes every element's data-start / data-duration from its data-at="bar:beat"
// (and data-at-end), using the grid in index.html <script id="grid">. Copy it into the promotion folder.
// Bars are a number, D (DROP_BAR), E (END_BAR = DROP_BAR + APP_BARS), or D+n / D-n / E+n / E-n.
//
//   node retime.mjs [file.html]   rewrite the composition's timing from the grid (default: index.html)
//   node retime.mjs --bed         also write a placeholder click bed to assets/music/bed.mp3 (needs ffmpeg)
//
// The compositions read the same grid at runtime (window.GRID), so after this one command the picture,
// cuts and sounds all sit on the new grid.
import fs from "node:fs";
import path from "node:path";
import { execFileSync } from "node:child_process";
import { fileURLToPath } from "node:url";

const dir = path.dirname(fileURLToPath(import.meta.url));
const target = process.argv.slice(2).find((a) => !a.startsWith("--")) ?? "index.html";
const file = path.resolve(dir, target);
let html = fs.readFileSync(file, "utf8");

const grid = fs.readFileSync(path.join(dir, "index.html"), "utf8");
const grab = (k) => {
  const m = grid.match(new RegExp(`var ${k} = ([0-9.]+)`));
  if (!m) throw new Error(`grid constant ${k} not found in index.html <script id="grid">`);
  return Number(m[1]);
};
const BPM = grab("BPM"), BPB = grab("BEATS_PER_BAR"), D = grab("DROP_BAR"), APP = grab("APP_BARS");
const E = D + APP, BEAT = 60 / BPM, BAR = BPB * BEAT;
const at = (bar, beat = 0) => bar * BAR + beat * BEAT;
const bar = (s) => {
  const m = s.trim().match(/^([DE]|\d+(?:\.\d+)?)(?:\s*([+-])\s*(\d+(?:\.\d+)?))?$/);
  if (!m) throw new Error(`bad bar "${s}"`);
  const base = m[1] === "D" ? D : m[1] === "E" ? E : Number(m[1]);
  return m[2] ? base + (m[2] === "+" ? 1 : -1) * Number(m[3]) : base;
};
const when = (spec) => { const [b, beat = "0"] = spec.split(":"); return at(bar(b), Number(beat)); };
const r3 = (x) => String(Math.round(x * 1000) / 1000);
const setAttr = (tag, name, value) =>
  new RegExp(`\\b${name}="[^"]*"`).test(tag)
    ? tag.replace(new RegExp(`\\b${name}="[^"]*"`), `${name}="${value}"`)
    : tag.replace(/\s*\/?>$/, (end) => ` ${name}="${value}"${end}`);

let n = 0;
html = html.replace(/<[a-z][\w-]*\b[^>]*\bdata-at="[^"]*"[^>]*>/g, (tag) => {
  const start = when(tag.match(/data-at="([^"]*)"/)[1]);
  const endSpec = tag.match(/data-at-end="([^"]*)"/);
  let out = setAttr(tag, "data-start", r3(start));
  if (endSpec) out = setAttr(out, "data-duration", r3(when(endSpec[1]) - start));
  n++;
  return out;
});
fs.writeFileSync(file, html);
console.log(`grid: ${BPM} BPM, ${BPB}/bar, drop bar ${D} (${r3(at(D))} s), end bar ${E} (${r3(at(E))} s); retimed ${n} elements in ${target}`);

if (process.argv.includes("--bed")) {
  // Placeholder pulse: a short tick per beat, an accent on each downbeat, a louder one on the drop.
  const len = at(E);
  const dropBeat = D * BPB;
  const expr =
    `st(0,floor(t/${BEAT}));st(1,t-ld(0)*${BEAT});` +
    `(0.07+0.11*eq(mod(ld(0),${BPB}),0)+0.30*eq(ld(0),${dropBeat}))` +
    `*exp(-ld(1)*(55-30*eq(ld(0),${dropBeat})))` +
    `*sin(2*PI*(1700-650*eq(mod(ld(0),${BPB}),0))*ld(1))`;
  const out = path.join(dir, "assets/music/bed.mp3");
  fs.mkdirSync(path.dirname(out), { recursive: true });
  execFileSync("ffmpeg", ["-hide_banner", "-loglevel", "error", "-y", "-f", "lavfi",
    "-i", `aevalsrc='${expr}':s=44100:d=${r3(len)}`, "-ac", "2", "-c:a", "libmp3lame", "-b:a", "128k", out]);
  console.log(`bed: ${out} (${r3(len)} s)`);
}
