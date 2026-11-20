#!/usr/bin/env node
// The board: a view-only page of every promotion (its assets, read from its renders/) and every delivery,
// read from D1. Its page is board.html beside this file, dressed by the tracking root's board_theme
// stylesheets when it names any. It writes nothing.
//
//   node board.mjs [--port 4410]     then open http://127.0.0.1:4410     (serves only on 127.0.0.1)

import http from "node:http";
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { args, d1Async, loadConfig, now, promotionStates, REPO, shapeDelivery } from "./tracking-lib.mjs";

const port = Number(args().port) || 4410;
const PAGE = path.join(path.dirname(fileURLToPath(import.meta.url)), "board.html");
const cfg = loadConfig();

let data = null;
async function reload() {
  const [frozen, deliveries] = await d1Async(cfg, "SELECT * FROM promotions ORDER BY id; SELECT * FROM deliveries ORDER BY id");
  const promotions = promotionStates(frozen);
  data = { promotions, deliveries: deliveries.map(shapeDelivery), dirs: new Map(promotions.map((p) => [p.id, p.dir])) };
}

const TYPES = { ".jpg": "image/jpeg", ".jpeg": "image/jpeg", ".png": "image/png", ".webp": "image/webp", ".svg": "image/svg+xml", ".mp4": "video/mp4",
  ".webm": "video/webm", ".mov": "video/quicktime", ".css": "text/css; charset=utf-8", ".woff2": "font/woff2", ".woff": "font/woff", ".ttf": "font/ttf", ".otf": "font/otf" };
const PUBLIC_TYPES = new Set([".woff2", ".woff", ".ttf", ".otf", ".svg", ".png", ".jpg", ".jpeg", ".webp"]);
const inside = (base, rel) => { const f = path.resolve(base, rel); return f.startsWith(path.resolve(base) + path.sep) ? f : null; };

// A file, with byte ranges so a video can seek.
function sendFile(req, res, file) {
  const size = fs.statSync(file).size, type = TYPES[path.extname(file).toLowerCase()] ?? "application/octet-stream";
  const m = /^bytes=(\d*)-(\d*)$/.exec(req.headers.range ?? "");
  if (m) {
    const start = m[1] ? Number(m[1]) : size - Number(m[2]), end = m[1] && m[2] ? Number(m[2]) : size - 1;
    if (start >= size || start < 0 || end >= size) return res.writeHead(416, { "content-range": `bytes */${size}` }).end();
    res.writeHead(206, { "content-type": type, "content-range": `bytes ${start}-${end}/${size}`, "accept-ranges": "bytes", "content-length": end - start + 1, "cache-control": "no-store" });
    return fs.createReadStream(file, { start, end }).pipe(res);
  }
  res.writeHead(200, { "content-type": type, "content-length": size, "accept-ranges": "bytes", "cache-control": "no-store" });
  fs.createReadStream(file).pipe(res);
}
const text = (res, code, body) => res.writeHead(code, { "content-type": "text/plain; charset=utf-8" }).end(body);

function page() {
  const theme = cfg.theme.map((_, i) => `<link rel="stylesheet" href="/theme/${i}.css">`).join("\n");
  return fs.readFileSync(PAGE, "utf8").replace("<!--theme-->", theme).replaceAll("{{brand}}", cfg.brand.replace(/[<>&"]/g, ""));
}

http.createServer(async (req, res) => {
  const url = new URL(req.url, "http://127.0.0.1");
  try {
    if (req.method === "POST" && url.pathname === "/api/reload") { await reload(); return res.writeHead(200, { "content-type": "application/json" }).end("{}"); }
    if (req.method !== "GET") return text(res, 405, "The board is view-only");
    if (url.pathname === "/") return res.writeHead(200, { "content-type": "text/html; charset=utf-8", "cache-control": "no-store" }).end(page());
    if (url.pathname === "/api/data") {
      if (!data) await reload();
      const { dirs, ...rest } = data;
      return res.writeHead(200, { "content-type": "application/json" }).end(JSON.stringify({ now: now(), brand: cfg.brand, logo: Boolean(cfg.logo), ...rest, promotions: rest.promotions.map(({ dir, ...p }) => p) }));
    }
    // An output of a promotion, from its renders/ only.
    if (url.pathname === "/asset") {
      if (!data) await reload();
      const id = url.searchParams.get("promotion"), rel = url.searchParams.get("file") ?? "", dir = data.dirs.get(id);
      if (!dir) return text(res, 404, `No source folder for ${id}`);
      const file = rel.startsWith("renders/") ? inside(dir, rel) : null;
      if (!file || !fs.existsSync(file)) return text(res, 404, `Not rendered: ${id} has no ${rel}. Render it with building-promotion.`);
      return sendFile(req, res, file);
    }
    const theme = url.pathname.match(/^\/theme\/(\d+)\.css$/);
    if (theme && cfg.theme[Number(theme[1])]) {
      const file = inside(REPO, cfg.theme[Number(theme[1])]);
      return file && fs.existsSync(file) ? sendFile(req, res, file) : text(res, 404, "No such theme file");
    }
    if (url.pathname === "/logo" && cfg.logo) {
      const file = inside(REPO, cfg.logo);
      return file && fs.existsSync(file) ? sendFile(req, res, file) : text(res, 404, "No logo");
    }
    // Fonts and images the theme's stylesheets point at, from board_public.
    if (cfg.public && PUBLIC_TYPES.has(path.extname(url.pathname).toLowerCase())) {
      const file = inside(path.join(REPO, cfg.public), decodeURIComponent(url.pathname).slice(1));
      if (file && fs.existsSync(file)) return sendFile(req, res, file);
    }
    text(res, 404, "Not found");
  } catch (e) {
    res.writeHead(500, { "content-type": "application/json" }).end(JSON.stringify({ error: String(e.message).slice(0, 400) }));
  }
}).listen(port, "127.0.0.1", () => console.log(`Board: http://127.0.0.1:${port}`));
