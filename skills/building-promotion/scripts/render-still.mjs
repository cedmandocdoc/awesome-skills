#!/usr/bin/env node
// building-promotion: renders still frame pages to PNG + JPEG and measures them for checking-still.md → S3.
//
//   node render-still.mjs <page.html…> [--out renders] [--sheet] [--jpeg-quality 90]
//   node render-still.mjs --doctor
//
// A page declares its size on <body data-size="1080x1350">. Read words carry data-read, app screen
// containers data-app, and the Sample chip data-chip (see directing-still.md → Frame pages).
// Playwright is resolved from the current directory upward (playwright, @playwright/test or playwright-core).

import { createRequire } from "node:module";
import { pathToFileURL } from "node:url";
import fs from "node:fs/promises";
import path from "node:path";

// Read areas as margins [left, top, right, bottom], per promotion-contract.md → Frame sizes and safe zones.
const RATIOS = [
  { name: "4x5", value: 4 / 5, margins: [0.06, 0.05, 0.06, 0.05] },
  { name: "1x1", value: 1, margins: [0.06, 0.05, 0.06, 0.05] },
  { name: "9x16", value: 9 / 16, margins: [0.06, 0.14, 0.06, 0.2] },
  { name: "191x100", value: 1.91, margins: [0.05, 0.05, 0.05, 0.05] },
];
const MIN_READ_PX = 26;
const MIN_CHIP_PX = 18;

function parseArgs(argv) {
  const opts = { pages: [], out: "renders", sheet: false, quality: 90, doctor: false };
  for (let i = 0; i < argv.length; i++) {
    const a = argv[i];
    if (a === "--out") opts.out = argv[++i];
    else if (a === "--sheet") opts.sheet = true;
    else if (a === "--jpeg-quality") opts.quality = Number(argv[++i]);
    else if (a === "--doctor") opts.doctor = true;
    else if (a.startsWith("--")) throw new Error(`Unknown flag ${a}`);
    else opts.pages.push(a);
  }
  return opts;
}

async function loadChromium() {
  const req = createRequire(path.join(process.cwd(), "noop.js"));
  for (const name of ["playwright", "@playwright/test", "playwright-core"]) {
    try {
      const mod = await import(pathToFileURL(req.resolve(name)).href);
      const chromium = mod.chromium ?? mod.default?.chromium;
      if (chromium) return { chromium, name };
    } catch {}
  }
  throw new Error(
    `Playwright not found from ${process.cwd()}: npm i -D playwright, then npx playwright install chromium`,
  );
}

function ratioFor(w, h) {
  const v = w / h;
  return RATIOS.reduce((best, r) => (Math.abs(r.value - v) < Math.abs(best.value - v) ? r : best));
}

// Runs in the page. Measures read words, chips, fonts and contrast.
function measurePage({ w, h, margins, minRead, minChip }) {
  const [ml, mt, mr, mb] = margins;
  const area = { x0: w * ml, y0: h * mt, x1: w * (1 - mr), y1: h * (1 - mb) };
  const parse = (c) => {
    const m = c.match(/rgba?\(([^)]+)\)/);
    if (!m) return null;
    const p = m[1].split(/[ ,/]+/).filter(Boolean).map(Number);
    return { r: p[0], g: p[1], b: p[2], a: p.length > 3 ? p[3] : 1 };
  };
  const lum = ({ r, g, b }) => {
    const f = (v) => {
      v /= 255;
      return v <= 0.03928 ? v / 12.92 : ((v + 0.055) / 1.055) ** 2.4;
    };
    return 0.2126 * f(r) + 0.7152 * f(g) + 0.0722 * f(b);
  };
  const over = (top, under) => ({
    r: top.r * top.a + under.r * (1 - top.a),
    g: top.g * top.a + under.g * (1 - top.a),
    b: top.b * top.a + under.b * (1 - top.a),
    a: 1,
  });
  const text = (el) => (el.innerText || el.textContent || "").trim().replace(/\s+/g, " ").slice(0, 60);
  const scaleOf = (el) => (el.offsetHeight ? el.getBoundingClientRect().height / el.offsetHeight : 1);

  // The visual ground under an element's centre: solid colours composited down to the first opaque one.
  const groundAt = (el, x, y) => {
    const stack = document.elementsFromPoint(x, y).filter((e) => e !== el && !el.contains(e));
    const layers = [];
    for (const e of stack) {
      const tag = e.tagName.toLowerCase();
      if (["img", "iframe", "video", "canvas", "svg", "picture"].includes(tag)) return { image: tag };
      const cs = getComputedStyle(e);
      if (cs.backgroundImage && cs.backgroundImage !== "none") return { image: "background-image" };
      const c = parse(cs.backgroundColor);
      if (c && c.a > 0) {
        layers.push(c);
        if (c.a >= 1) break;
      }
    }
    let ground = { r: 255, g: 255, b: 255, a: 1 };
    for (const c of layers.reverse()) ground = over(c, ground);
    return { color: ground };
  };

  const clippedBy = (el) => {
    const r = el.getBoundingClientRect();
    if (el.scrollWidth > el.clientWidth + 1 && getComputedStyle(el).overflowX !== "visible") return "self";
    for (let a = el.parentElement; a && a !== document.body; a = a.parentElement) {
      const cs = getComputedStyle(a);
      if (cs.overflow === "visible" && cs.overflowX === "visible" && cs.overflowY === "visible") continue;
      const ar = a.getBoundingClientRect();
      if (r.left < ar.left - 0.5 || r.top < ar.top - 0.5 || r.right > ar.right + 0.5 || r.bottom > ar.bottom + 0.5)
        return a.className || a.tagName.toLowerCase();
    }
    return null;
  };

  const faces = [...document.fonts];
  const loaded = new Set(faces.filter((f) => f.status === "loaded").map((f) => f.family.replace(/["']/g, "")));
  const fontErrors = faces.filter((f) => f.status === "error").map((f) => f.family);

  // Each line of text as a box trimmed to its ink band, so tight but clear leading doesn't count as a collision.
  const lineBoxes = (el) => {
    const rg = document.createRange();
    rg.selectNodeContents(el);
    return [...rg.getClientRects()].filter((q) => q.width > 1 && q.height > 1).map((q) => {
      const k = q.height * 0.1;
      return [q.left, q.top + k, q.right, q.bottom - k].map(Math.round);
    });
  };
  const readEls = [...document.querySelectorAll("[data-read]")];
  const read = readEls.map((el) => {
    const cs = getComputedStyle(el);
    const r = el.getBoundingClientRect();
    const px = Math.round(parseFloat(cs.fontSize) * scaleOf(el) * 10) / 10;
    const family = cs.fontFamily.split(",")[0].trim().replace(/["']/g, "");
    const issues = [];
    if (!loaded.has(family)) issues.push(`font "${family}" not loaded from @font-face`);
    if (px < minRead) issues.push(`${px} px < ${minRead} px`);
    if (r.left < area.x0 - 0.5 || r.top < area.y0 - 0.5 || r.right > area.x1 + 0.5 || r.bottom > area.y1 + 0.5)
      issues.push("outside the read area");
    const clip = clippedBy(el);
    if (clip) issues.push(`clipped by ${clip}`);
    let contrast = null;
    const fg = parse(cs.color);
    const g = groundAt(el, r.left + r.width / 2, r.top + r.height / 2);
    if (g.image) contrast = { unchecked: `over ${g.image}` };
    else if (fg) {
      const c = over(fg, g.color);
      const [hi, lo] = [lum(c), lum(g.color)].sort((a, b) => b - a);
      const ratio = Math.round(((hi + 0.05) / (lo + 0.05)) * 100) / 100;
      const need = px >= 72 ? 3 : 4.5;
      contrast = { ratio, need };
      if (ratio < need) issues.push(`contrast ${ratio}:1 < ${need}:1`);
    }
    const within = readEls.findIndex((o) => o !== el && o.contains(el));
    return { role: el.dataset.read || "read", text: text(el), px, family, box: [r.left, r.top, r.right, r.bottom].map(Math.round), contrast, issues, lines: lineBoxes(el), within };
  });

  // Each app container must show a chip inside its visible area (same document or a same-origin iframe).
  const apps = [...document.querySelectorAll("[data-app]")].map((app) => {
    const ar = app.getBoundingClientRect();
    const chips = [];
    const collect = (doc, toTop, scale) => {
      const marked = [...doc.querySelectorAll("[data-chip]")];
      const found = marked.length ? marked : [...doc.querySelectorAll("span, div, small, b, em, i, p")].filter((e) => !e.children.length && /^sample$/i.test(e.textContent.trim()));
      for (const chip of found) {
        const cr = chip.getBoundingClientRect();
        const box = toTop(cr);
        const px = parseFloat(doc.defaultView.getComputedStyle(chip).fontSize) * scale * (chip.offsetHeight ? cr.height / chip.offsetHeight : 1);
        const visible = box.left >= ar.left - 1 && box.top >= ar.top - 1 && box.right <= ar.right + 1 && box.bottom <= ar.bottom + 1 && box.right > box.left;
        chips.push({ px: Math.round(px * 10) / 10, visible });
      }
    };
    collect(document, (r) => r, 1);
    for (const frame of app.querySelectorAll("iframe")) {
      const fr = frame.getBoundingClientRect();
      const s = frame.offsetWidth ? fr.width / frame.offsetWidth : 1;
      try {
        const doc = frame.contentDocument;
        if (doc) collect(doc, (r) => ({ left: fr.left + r.left * s, top: fr.top + r.top * s, right: fr.left + r.right * s, bottom: fr.top + r.bottom * s }), s);
      } catch {}
    }
    const shown = chips.filter((c) => c.visible);
    const issues = [];
    if (!shown.length) issues.push("no visible Sample chip");
    else if (shown.every((c) => c.px < minChip) && !document.querySelector('[data-read="disclosure"]'))
      issues.push(`chip ${Math.max(...shown.map((c) => c.px))} px < ${minChip} px, and no disclosure line on the frame`);
    return { app: app.dataset.app || "app", chips, issues };
  });

  return { read, apps, fontErrors };
}

async function waitForPage(page) {
  for (const frame of page.frames()) {
    await frame
      .evaluate(async () => {
        await document.fonts.ready;
        await Promise.all(
          [...document.images].map((i) => (i.complete ? 0 : new Promise((r) => (i.onload = i.onerror = r)))),
        );
      })
      .catch(() => {});
  }
  await page.waitForTimeout(150);
}

async function imagePage(browser, html, w, h) {
  const ctx = await browser.newContext({ viewport: { width: w, height: h }, deviceScaleFactor: 1 });
  const p = await ctx.newPage();
  await p.setContent(html, { waitUntil: "load" });
  return { ctx, p };
}

async function main() {
  const opts = parseArgs(process.argv.slice(2));
  const { chromium, name } = await loadChromium();
  const browser = await chromium.launch({ args: ["--allow-file-access-from-files"] });
  if (opts.doctor) {
    console.log(`ok ${name} chromium ${browser.version()}`);
    await browser.close();
    return;
  }
  if (!opts.pages.length) throw new Error("Give one or more frame pages (frames/*.html)");

  await fs.mkdir(path.join(opts.out, "thumbs"), { recursive: true });
  const reports = [];
  const sheets = new Map();
  // Pages from several stills share names (01-4x5); prefix each output with its still's folder then.
  const names = opts.pages.map((f) => path.basename(f, ".html"));
  const clash = new Set(names).size < names.length;
  const stillOf = (abs) => {
    const dir = path.dirname(abs);
    return path.basename(path.basename(dir) === "frames" ? path.dirname(dir) : dir);
  };
  const outName = (abs) => (clash ? `${stillOf(abs)}--${path.basename(abs, ".html")}` : path.basename(abs, ".html"));

  for (const file of opts.pages) {
    const abs = path.resolve(file);
    const html = await fs.readFile(abs, "utf8");
    const m = html.match(/data-size=["'](\d+)x(\d+)["']/);
    if (!m) throw new Error(`${file}: <body data-size="WxH"> missing`);
    const [w, h] = [Number(m[1]), Number(m[2])];
    const ratio = ratioFor(w, h);
    const base = outName(abs);

    const ctx = await browser.newContext({ viewport: { width: w, height: h }, deviceScaleFactor: 1 });
    const outside = [];
    const failed = [];
    await ctx.route("**/*", (route) => {
      const u = route.request().url();
      if (/^(file|data|blob|about):/.test(u)) return route.continue();
      outside.push(u);
      return route.abort();
    });
    const page = await ctx.newPage();
    page.on("requestfailed", (r) => {
      if (!outside.includes(r.url())) failed.push(r.url());
    });
    await page.goto(pathToFileURL(abs).href, { waitUntil: "load" });
    await waitForPage(page);

    const measured = await page.evaluate(measurePage, {
      w,
      h,
      margins: ratio.margins,
      minRead: MIN_READ_PX,
      minChip: MIN_CHIP_PX,
    });
    const clip = { x: 0, y: 0, width: w, height: h };
    const png = path.join(opts.out, `${base}.png`);
    const jpg = path.join(opts.out, `${base}.jpg`);
    await page.screenshot({ path: png, clip });
    await page.screenshot({ path: jpg, clip, type: "jpeg", quality: opts.quality });
    await ctx.close();

    const dataUrl = `data:image/png;base64,${(await fs.readFile(png)).toString("base64")}`;
    const [tw, th] = [Math.round(w / 3), Math.round(h / 3)];
    const thumb = await imagePage(browser, `<body style="margin:0"><img src="${dataUrl}" style="display:block;width:${tw}px;height:${th}px"></body>`, tw, th);
    await thumb.p.screenshot({ path: path.join(opts.out, "thumbs", `${base}.png`) });
    await thumb.ctx.close();

    if (!sheets.has(ratio.name)) sheets.set(ratio.name, { w, h, rows: new Map() });
    const rows = sheets.get(ratio.name).rows;
    const row = clash ? stillOf(abs) : "";
    if (!rows.has(row)) rows.set(row, []);
    rows.get(row).push(dataUrl);

    // Two read elements, neither inside the other, whose lines of text overlap collide.
    const overlaps = [];
    measured.read.forEach((a, i) => measured.read.forEach((b, j) => {
      if (j <= i || a.within === j || b.within === i) return;
      const hit = a.lines.some(([al, at, ar, ab]) => b.lines.some(([bl, bt, br, bb]) =>
        Math.min(ar, br) - Math.max(al, bl) > 4 && Math.min(ab, bb) - Math.max(at, bt) > 4));
      if (hit) overlaps.push(`${a.role} "${a.text}" overlaps ${b.role} "${b.text}"`);
    }));
    for (const r of measured.read) delete r.lines;

    const issues = [
      ...measured.read.flatMap((r) => r.issues.map((i) => `${r.role} "${r.text}": ${i}`)),
      ...measured.apps.flatMap((a) => a.issues.map((i) => `${a.app}: ${i}`)),
      ...overlaps,
      ...measured.fontErrors.map((f) => `font "${f}" failed to load`),
      ...outside.map((u) => `request left the folder: ${u}`),
      ...failed.map((u) => `file failed to load: ${u}`),
    ];
    const listed = measured.read.filter((r) => r.contrast?.unchecked).map((r) => `${r.role} "${r.text}" ${r.contrast.unchecked}`);
    reports.push({ page: file, size: `${w}x${h}`, ratio: ratio.name, png, jpg, pass: issues.length === 0, issues, eyeCheck: listed, read: measured.read, apps: measured.apps });
  }

  if (opts.sheet) {
    // One row per still: a single call's pages, or each folder's when pages come from several stills.
    for (const [name, { w, h, rows }] of sheets) {
      const [fw, fh, gap] = [Math.round(w / 2), Math.round(h / 2), 24];
      const most = Math.max(...[...rows.values()].map((u) => u.length));
      const sw = most * fw + (most + 1) * gap;
      const sh = rows.size * (fh + gap) + gap;
      const img = (u) => `<img src="${u}" style="width:${fw}px;height:${fh}px;display:block">`;
      const lines = [...rows.values()].map((u) => `<div style="display:flex;gap:${gap}px">${u.map(img).join("")}</div>`).join("");
      const s = await imagePage(browser, `<body style="margin:0;background:#8a8a85"><div style="display:flex;flex-direction:column;gap:${gap}px;padding:${gap}px">${lines}</div></body>`, sw, sh);
      const file = path.join(opts.out, `sheet-${name}.png`);
      await s.p.screenshot({ path: file });
      await s.ctx.close();
      console.error(`sheet ${file}`);
    }
  }

  await browser.close();
  console.log(JSON.stringify(reports, null, 2));
  const failing = reports.filter((r) => !r.pass);
  for (const r of reports) console.error(`${r.pass ? "pass" : "FAIL"} ${r.page}${r.pass ? "" : `: ${r.issues.length} issue(s)`}${r.eyeCheck.length ? `; ${r.eyeCheck.length} for the eye check` : ""}`);
  if (failing.length) process.exitCode = 1;
}

main().catch((e) => {
  console.error(e.message);
  process.exit(2);
});
