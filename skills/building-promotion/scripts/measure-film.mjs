// measure-film.mjs: diagnostics on a rendered film (reports, never blocks). Measures the length, the share of
// time the picture moves, distinct visual moments a second, the longest frozen stretch, the share of the frame
// changing each second, mean saturation, the loudness jump from the quietest to the loudest 2 s, and, with
// --bpm, the share of motion starts within 1 frame of a beat against the chance level. Needs ffmpeg and ffprobe.
//
//   node measure-film.mjs <file.mp4> [--bpm <n> [--offset <s>]] [--json]
//
// --offset is the film time of a beat on the track's grid (default 0).
import fs from "node:fs";
import path from "node:path";
import { spawn, spawnSync } from "node:child_process";

const FPS = 30;
const GRAY = { w: 135, h: 240 }; // motion, moments, frozen stretches, frame change
const RGB = { w: 68, h: 120 }; // saturation
const SR = 22050, RMS_FRAME = 2048, RMS_HOP = 512;
const MOVING = 0.002; // mean absolute change per frame (0..1) above which the picture moves
const MOMENT = { height: 0.006, distance: 3 }; // a peak in that change, at least 100 ms apart
const CHANGED = 6 / 255; // a pixel changes in a second when it moves more than 6 levels
const START = { on: 0.004, off: 0.0015 }; // a motion start crosses `on` from still; it lands below `off`

const fail = (msg, code = 1) => {
  process.stderr.write(`measure-film: ${msg}\n`);
  process.exit(code);
};

// ---- arguments
const argv = process.argv.slice(2);
const opts = { json: false, bpm: null, offset: null, file: null };
for (let i = 0; i < argv.length; i++) {
  const a = argv[i];
  if (a === "--json") opts.json = true;
  else if (a === "--bpm" || a === "--offset") {
    const v = Number(argv[++i]);
    if (!Number.isFinite(v)) fail(`${a} needs a number`, 2);
    opts[a.slice(2)] = v;
  } else if (a === "-h" || a === "--help") {
    process.stdout.write("usage: node measure-film.mjs <file.mp4> [--bpm <n> [--offset <s>]] [--json]\n");
    process.exit(0);
  } else if (a.startsWith("--")) fail(`unknown option ${a}`, 2);
  else if (opts.file) fail(`one film at a time (got ${opts.file} and ${a})`, 2);
  else opts.file = a;
}
if (!opts.file) fail("usage: node measure-film.mjs <file.mp4> [--bpm <n> [--offset <s>]] [--json]", 2);
if (opts.bpm !== null && opts.bpm <= 0) fail("--bpm must be above 0", 2);
if (opts.offset !== null && opts.bpm === null) fail("--offset needs --bpm", 2);
if (!fs.existsSync(opts.file)) fail(`no such file: ${opts.file}`, 2);

for (const tool of ["ffmpeg", "ffprobe"]) {
  const r = spawnSync(tool, ["-version"], { stdio: "ignore" });
  if (r.error) fail(`${tool} is not installed or not on PATH (macOS: brew install ffmpeg; Debian/Ubuntu: apt install ffmpeg)`, 3);
}

// ---- decoding
const run = (cmd, args) =>
  new Promise((resolve, reject) => {
    const p = spawn(cmd, args, { stdio: ["ignore", "pipe", "pipe"] });
    const out = [], err = [];
    p.stdout.on("data", (c) => out.push(c));
    p.stderr.on("data", (c) => err.push(c));
    p.on("error", reject);
    p.on("close", (code) =>
      code === 0 ? resolve(Buffer.concat(out)) : reject(new Error(`${cmd} failed: ${Buffer.concat(err).toString().trim()}`)),
    );
  });
const frames = (pix, { w, h }) =>
  run("ffmpeg", ["-v", "error", "-i", opts.file, "-vf", `scale=${w}:${h},fps=${FPS}`, "-f", "rawvideo", "-pix_fmt", pix, "-"]);
const audio = () => run("ffmpeg", ["-v", "error", "-i", opts.file, "-ac", "1", "-ar", String(SR), "-f", "f32le", "-"]);

const probe = spawnSync("ffprobe", ["-v", "error", "-show_entries", "stream=codec_type", "-of", "csv=p=0", opts.file], {
  encoding: "utf8",
});
if (probe.status !== 0) fail(`ffprobe could not read ${opts.file}: ${probe.stderr.trim()}`);
const streams = probe.stdout.split(/\s+/).filter(Boolean);
if (!streams.includes("video")) fail(`${opts.file} has no video stream`);
const hasAudio = streams.includes("audio");

const started = Date.now();
const [grayBuf, rgbBuf, wavBuf] = await Promise.all([
  frames("gray", GRAY),
  frames("rgb24", RGB),
  hasAudio ? audio() : Promise.resolve(null),
]).catch((e) => fail(e.message));

// ---- picture
// Values follow the reference tools, which work in float32 (pixel / 255); the per-pixel tests use lookup tables
// built with float32 rounding so a 6-level change counts exactly as it did there.
const f32 = Float32Array.from({ length: 256 }, (_, v) => v / 255);
const npix = GRAY.w * GRAY.h;
const n = Math.floor(grayBuf.length / npix);
if (n < 2) fail("the film has fewer than 2 frames");
const T = n / FPS;

// mean absolute change between consecutive frames
const d = new Float64Array(n - 1);
for (let i = 0; i < n - 1; i++) {
  let s = 0;
  for (let p = i * npix, q = p + npix, e = p + npix; p < e; p++, q++) s += Math.abs(grayBuf[q] - grayBuf[p]);
  d[i] = s / (255 * npix);
}

const moving = Array.from(d, (v) => v > MOVING);
const movingShare = moving.filter(Boolean).length / moving.length;

let freeze = { len: 0, start: 0 };
for (let i = 0, run0 = -1; i <= moving.length; i++) {
  if (i < moving.length && !moving[i]) {
    if (run0 < 0) run0 = i;
  } else if (run0 >= 0) {
    if (i - run0 > freeze.len) freeze = { len: i - run0, start: run0 };
    run0 = -1;
  }
}

const moments = findPeaks(d, MOMENT.height, MOMENT.distance);

const changedLut = new Uint8Array(256 * 256);
for (let a = 0; a < 256; a++)
  for (let b = 0; b < 256; b++) changedLut[a * 256 + b] = Math.abs(Math.fround(f32[a] - f32[b])) > Math.fround(CHANGED) ? 1 : 0;
const cover = [];
const changed = new Uint8Array(npix);
for (let s = 0; s < Math.floor(T); s++) {
  const a = s * FPS, b = Math.min(n - 1, (s + 1) * FPS);
  if (b <= a) continue;
  changed.fill(0);
  for (let i = a; i < b; i++) {
    const p0 = i * npix, q0 = p0 + npix;
    for (let p = 0; p < npix; p++) if (changedLut[grayBuf[q0 + p] * 256 + grayBuf[p0 + p]]) changed[p] = 1;
  }
  let c = 0;
  for (let p = 0; p < npix; p++) c += changed[p];
  cover.push(c / npix);
}
const frameChanging = cover.length ? cover.reduce((x, y) => x + y, 0) / cover.length : 0;

const satLut = new Float64Array(256 * 256); // [max * 256 + min] -> (max - min) / max
for (let mx = 1; mx < 256; mx++)
  for (let mn = 0; mn <= mx; mn++) satLut[mx * 256 + mn] = Math.fround(Math.fround(f32[mx] - f32[mn]) / f32[mx]);
let satSum = 0;
const rgbPx = Math.floor(rgbBuf.length / 3);
for (let i = 0; i < rgbPx * 3; i += 3) {
  const r = rgbBuf[i], g = rgbBuf[i + 1], b = rgbBuf[i + 2];
  satSum += satLut[Math.max(r, g, b) * 256 + Math.min(r, g, b)];
}
const saturation = rgbPx ? satSum / rgbPx : 0;

// ---- sound: RMS per 2048-sample frame (centred, zero-padded), then dB of each 2 s window every 0.5 s
let loudnessJump = null;
if (wavBuf && wavBuf.length >= 4) {
  const y = new Float32Array(new Uint8Array(wavBuf).buffer, 0, Math.floor(wavBuf.length / 4));
  const nr = 1 + Math.floor(y.length / RMS_HOP), half = RMS_FRAME / 2;
  const power = new Float64Array(nr);
  for (let k = 0; k < nr; k++) {
    let s = 0;
    const lo = Math.max(0, k * RMS_HOP - half), hi = Math.min(y.length, k * RMS_HOP + half);
    for (let j = lo; j < hi; j++) s += y[j] * y[j];
    power[k] = s / RMS_FRAME;
  }
  const db = [];
  for (let w = 0; w * 0.5 < T - 2; w++) {
    let s = 0, c = 0;
    for (let k = 0; k < nr; k++) {
      const t = (k * RMS_HOP) / SR;
      if (t >= w * 0.5 && t < w * 0.5 + 2) (s += power[k]), c++;
    }
    if (c) db.push(20 * Math.log10(Math.sqrt(s / c) + 1e-9));
  }
  if (db.length) loudnessJump = Math.max(...db) - Math.min(...db);
}

// ---- beat lock: motion starts against the beat, after removing the best constant phase
let beat = null;
if (opts.bpm !== null) {
  const offset = opts.offset ?? 0, period = 60 / opts.bpm;
  const starts = [];
  for (let i = 0, on = false; i < d.length; i++) {
    if (!on && d[i] > START.on) (on = true), starts.push((i + 1) / FPS);
    else if (on && d[i] < START.off) on = false;
  }
  const t = starts.map((s) => s - offset);
  const within = (shift) =>
    t.filter((x) => {
      const r = ((((x - shift) / period) % 1) + 1) % 1;
      return Math.min(r, 1 - r) * period <= 1 / FPS + 1e-6;
    }).length / t.length;
  let fitted = 0, shift = 0;
  if (t.length >= 3) {
    const re = t.reduce((a, x) => a + Math.cos((2 * Math.PI * x) / period), 0) / t.length;
    const im = t.reduce((a, x) => a + Math.sin((2 * Math.PI * x) / period), 0) / t.length;
    shift = (Math.atan2(im, re) / (2 * Math.PI)) * period;
    fitted = within(shift);
  }
  beat = {
    bpm: opts.bpm,
    offsetS: offset,
    motionStarts: starts.length,
    onBeatPct: pyRound(100 * fitted),
    chancePct: pyRound(100 * Math.min(1, 2 / FPS / period)),
    phaseShiftMs: t.length >= 3 ? pyRound(1000 * shift) : null,
    onGivenGridPct: t.length ? pyRound(100 * within(0)) : 0,
  };
}

const result = {
  film: path.basename(opts.file),
  lengthS: pyRound(T, 1),
  movingPct: pyRound(100 * movingShare),
  momentsPerS: pyRound(moments.length / T, 2),
  moments: moments.length,
  longestFrozenS: pyRound(freeze.len / FPS, 1),
  longestFrozenStartS: pyRound(freeze.start / FPS, 2),
  frameChangingPct: pyRound(100 * frameChanging),
  meanSaturation: pyRound(saturation, 3),
  loudnessJumpDb: loudnessJump === null ? null : pyRound(loudnessJump, 1),
  beat,
  seconds: pyRound((Date.now() - started) / 1000, 1),
};

if (opts.json) process.stdout.write(JSON.stringify(result, null, 2) + "\n");
else {
  const r = result;
  const rows = [
    ["film", r.film],
    ["length", `${r.lengthS} s`],
    ["moving", `${r.movingPct} % of the time`],
    ["moments", `${r.momentsPerS} a second (${r.moments} in all)`],
    ["longest freeze", `${r.longestFrozenS} s, from ${r.longestFrozenStartS} s`],
    ["frame changing", `${r.frameChangingPct} % each second`],
    ["saturation", `${r.meanSaturation} mean`],
    ["loudness jump", r.loudnessJumpDb === null ? "no audio" : `${r.loudnessJumpDb} dB, quietest to loudest 2 s`],
  ];
  if (r.beat) {
    const b = r.beat;
    rows.push([
      "on the beat",
      `${b.onBeatPct} % of ${b.motionStarts} motion starts within 1 frame of a ${b.bpm} BPM beat (chance ${b.chancePct} %)` +
        (b.phaseShiftMs === null ? "" : `; best phase ${b.phaseShiftMs} ms from the grid at ${b.offsetS} s, ${b.onGivenGridPct} % on that grid as given`),
    ]);
  }
  for (const [k, v] of rows) process.stdout.write(`${k.padEnd(15)}${v}\n`);
}

// scipy.signal.find_peaks(x, height, distance): local maxima (plateaus take their middle), at least
// `height` tall, then the tallest first, dropping any neighbour closer than `distance` samples.
function findPeaks(x, height, distance) {
  const peaks = [];
  for (let i = 1, last = x.length - 1; i < last; i++) {
    if (x[i - 1] < x[i]) {
      let ahead = i + 1;
      while (ahead < last && x[ahead] === x[i]) ahead++;
      if (x[ahead] < x[i]) {
        peaks.push((i + ahead - 1) >> 1);
        i = ahead;
      }
    }
  }
  const tall = peaks.filter((p) => x[p] >= height);
  const keep = new Uint8Array(tall.length).fill(1);
  const order = tall.map((_, k) => k).sort((a, b) => x[tall[a]] - x[tall[b]]);
  for (let r = order.length - 1; r >= 0; r--) {
    const j = order[r];
    if (!keep[j]) continue;
    for (let k = j - 1; k >= 0 && tall[j] - tall[k] < distance; k--) keep[k] = 0;
    for (let k = j + 1; k < tall.length && tall[k] - tall[j] < distance; k++) keep[k] = 0;
  }
  return tall.filter((_, k) => keep[k]);
}

// Python's round(): halves go to the even neighbour.
function pyRound(v, digits = 0) {
  const m = 10 ** digits, x = v * m, f = Math.floor(x);
  const r = x - f === 0.5 ? (f % 2 === 0 ? f : f + 1) : Math.round(x);
  return r / m;
}
