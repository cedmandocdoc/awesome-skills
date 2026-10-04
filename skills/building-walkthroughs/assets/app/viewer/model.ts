// Shared by the viewer and scripts/walkthroughs.ts: parses the root's Markdown, validates the graph, lays out the metro map.
import { parse } from "yaml";

export interface Baseline { id: string; title: string; setup?: string }
export interface Line { id: string; title: string; color: string }
export type Facets = Record<string, string[]>;
export interface Walkthrough {
  id: string;
  title: string;
  kind: "core" | "branch";
  line: string;
  startsFrom: string;
  endsWith: string[];
  actors: string[];
  facets: Facets;
  checkpoint?: string;
  covers: string[];
  minutes?: number;
  body: string;
}
export interface Model {
  app: string;
  indexBody: string;
  baselines: Baseline[];
  lines: Line[];
  walkthroughs: Map<string, Walkthrough>;
  issues: string[];
}

const PALETTE = ["#2563eb", "#dc2626", "#16a34a", "#d97706", "#9333ea", "#0891b2", "#db2777", "#65a30d"];
export const BASELINE = "baseline:";

export function splitFrontmatter(src: string): { data: Record<string, unknown>; body: string } {
  const m = /^---\r?\n([\s\S]*?)\r?\n---\r?\n?/.exec(src);
  if (!m) return { data: {}, body: src };
  return { data: (parse(m[1]) ?? {}) as Record<string, unknown>, body: src.slice(m[0].length) };
}

const str = (v: unknown) => (typeof v === "string" ? v : v == null ? "" : String(v));
const list = (v: unknown) => (Array.isArray(v) ? v.map(str) : v == null ? [] : [str(v)]);

/** `files` maps a root-relative filename (`index.md`, `send-invoice.md`) to its source. */
export function buildModel(files: Record<string, string>): Model {
  const issues: string[] = [];
  const index = files["index.md"];
  if (index == null) issues.push("index.md is missing");
  const { data: head, body: indexBody } = splitFrontmatter(index ?? "");
  if (index != null && head.doc_type !== "walkthroughs-index") issues.push("index.md: doc_type is not walkthroughs-index");

  const baselines: Baseline[] = Object.entries((head.baselines ?? {}) as Record<string, Record<string, unknown>>).map(([id, b]) => ({
    id, title: str(b?.title) || id, setup: b?.setup ? str(b.setup) : undefined,
  }));
  const lines: Line[] = ((head.lines ?? []) as Record<string, unknown>[]).map((l, i) => ({
    id: str(l.id), title: str(l.title) || str(l.id), color: str(l.color) || PALETTE[i % PALETTE.length],
  }));
  const lineIds = new Set(lines.map((l) => l.id));
  const baselineIds = new Set(baselines.map((b) => b.id));

  const walkthroughs = new Map<string, Walkthrough>();
  for (const [file, src] of Object.entries(files)) {
    if (file === "index.md") continue;
    const { data: d, body } = splitFrontmatter(src);
    if (d.doc_type !== "walkthrough") continue;
    const id = str(d.id) || file.replace(/\.md$/, "");
    if (id !== file.replace(/\.md$/, "")) issues.push(`${file}: id "${id}" does not match the filename`);
    const kind = d.kind === "branch" ? "branch" : "core";
    if (d.kind !== "core" && d.kind !== "branch") issues.push(`${file}: kind must be core or branch`);
    const facets: Facets = {};
    for (const [k, v] of Object.entries((d.facets ?? {}) as Record<string, unknown>)) facets[k] = list(v);
    walkthroughs.set(id, {
      id, kind, title: str(d.title) || id, line: str(d.line), startsFrom: str(d.starts_from),
      endsWith: list(d.ends_with), actors: list(d.actors), facets,
      checkpoint: d.checkpoint ? str(d.checkpoint) : undefined, covers: list(d.covers),
      minutes: typeof d.minutes === "number" ? d.minutes : undefined, body,
    });
  }

  for (const w of walkthroughs.values()) {
    const at = `${w.id}.md`;
    const parent = walkthroughs.get(w.startsFrom);
    if (w.startsFrom.startsWith(BASELINE)) {
      if (!baselineIds.has(w.startsFrom.slice(BASELINE.length))) issues.push(`${at}: unknown baseline in starts_from "${w.startsFrom}"`);
      if (w.kind === "branch") issues.push(`${at}: a branch starts from a core walkthrough, not a baseline`);
    } else if (!parent) issues.push(`${at}: starts_from "${w.startsFrom}" is neither baseline:<id> nor a walkthrough id`);
    else if (parent.kind === "branch") issues.push(`${at}: starts from branch "${parent.id}"; branches are dead ends — make it a core walkthrough on its own line`);
    if (w.kind === "branch") {
      if (parent) w.line = parent.line;
    } else if (!lineIds.has(w.line)) issues.push(`${at}: line "${w.line}" is not declared in index.md`);
    if (!w.endsWith.length) issues.push(`${at}: ends_with is empty`);
    if (w.actors.length < 2) issues.push(`${at}: actors needs at least a person and the app`);
  }

  for (const l of lines) {
    const cores = [...walkthroughs.values()].filter((w) => w.kind === "core" && w.line === l.id);
    if (!cores.length) { issues.push(`index.md: line "${l.id}" has no core walkthroughs`); continue; }
    const heads = cores.filter((w) => walkthroughs.get(w.startsFrom)?.line !== l.id || walkthroughs.get(w.startsFrom)?.kind !== "core");
    if (heads.length !== 1) issues.push(`line "${l.id}": needs exactly one first walkthrough (starting from a baseline or another line), found ${heads.length}`);
    const seen = new Map<string, string>();
    for (const w of cores) {
      const other = seen.get(w.startsFrom);
      if (other) issues.push(`line "${l.id}": ${other} and ${w.id} both start from "${w.startsFrom}" — make one a branch or put it on its own line`);
      seen.set(w.startsFrom, w.id);
    }
  }

  for (const w of walkthroughs.values()) {
    const seen = new Set<string>();
    for (let c: Walkthrough | undefined = w; c; c = walkthroughs.get(c.startsFrom)) {
      if (seen.has(c.id)) { issues.push(`${w.id}.md: starts_from loops back to "${c.id}"`); break; }
      seen.add(c.id);
    }
  }

  return { app: str(head.app) || "Walkthroughs", indexBody, baselines, lines, walkthroughs, issues: [...new Set(issues)] };
}

/** Replay order from the baseline to `id`: [baseline:<id>, first, …, id]. */
export function routeTo(m: Model, id: string): string[] {
  const out: string[] = [];
  const seen = new Set<string>();
  for (let cur = id; cur && !seen.has(cur); ) {
    seen.add(cur);
    out.unshift(cur);
    const w = m.walkthroughs.get(cur);
    if (!w) break;
    cur = w.startsFrom;
  }
  return out;
}

/** Cores of a line in replay order. */
export function stationsOf(m: Model, line: string): Walkthrough[] {
  const cores = [...m.walkthroughs.values()].filter((w) => w.kind === "core" && w.line === line);
  const byParent = new Map(cores.map((w) => [w.startsFrom, w]));
  const first = cores.find((w) => m.walkthroughs.get(w.startsFrom)?.line !== line || m.walkthroughs.get(w.startsFrom)?.kind !== "core");
  const out: Walkthrough[] = [];
  for (let c = first; c && !out.includes(c); c = byParent.get(c.id)) out.push(c);
  return out;
}

export const branchesOf = (m: Model, id: string) => [...m.walkthroughs.values()].filter((w) => w.kind === "branch" && w.startsFrom === id);

// ---- Metro layout ----

const STEP = 220;
const ROW = 120;
const SPUR = 46;

export interface Point { x: number; y: number }
export interface Layout {
  stations: Map<string, Point>;
  baselines: Map<string, Point>;
  lines: { id: string; origin: Point; ids: string[]; points: Point[]; transfer: boolean }[];
  spurs: { id: string; from: Point; to: Point }[];
  width: number;
  height: number;
}

export function layout(m: Model): Layout {
  const stations = new Map<string, Point>();
  const baselines = new Map<string, Point>();
  const out: Layout["lines"] = [];
  const spurs: Layout["spurs"] = [];
  const placed = new Set<string>();
  let y = 0;

  const children = (origin: string) => m.lines.filter((l) => !placed.has(l.id) && stationsOf(m, l.id)[0]?.startsFrom === origin);

  const place = (lineId: string, origin: Point, transfer: boolean) => {
    placed.add(lineId);
    const chain = stationsOf(m, lineId);
    const rowY = transfer ? y : origin.y;
    const points = chain.map((_, i) => ({ x: origin.x + STEP * (i + 1), y: rowY }));
    chain.forEach((w, i) => stations.set(w.id, points[i]));
    out.push({ id: lineId, origin, ids: chain.map((w) => w.id), points, transfer });
    let deepest = 0;
    chain.forEach((w, i) => {
      const bs = branchesOf(m, w.id);
      bs.forEach((b, j) => {
        const to = { x: points[i].x + STEP * 0.3, y: rowY + SPUR * (j + 1) };
        stations.set(b.id, to);
        spurs.push({ id: b.id, from: points[i], to });
      });
      deepest = Math.max(deepest, bs.length);
    });
    y = rowY + ROW + deepest * SPUR;
    for (const w of chain) for (const l of children(w.id)) place(l.id, stations.get(w.id)!, true);
  };

  for (const b of m.baselines) {
    const roots = children(BASELINE + b.id);
    if (!roots.length) continue;
    const origin = { x: 0, y };
    baselines.set(b.id, origin);
    roots.forEach((l, i) => place(l.id, origin, i > 0));
  }
  // Lines unreachable from a baseline (broken graph) still render, on their own rows.
  for (const l of m.lines) if (!placed.has(l.id) && stationsOf(m, l.id).length) place(l.id, { x: 0, y }, false);

  let width = 0;
  for (const p of stations.values()) width = Math.max(width, p.x);
  return { stations, baselines, lines: out, spurs, width: width + STEP, height: y };
}

export function matches(w: Walkthrough, query: string, active: Facets): boolean {
  for (const [k, vals] of Object.entries(active)) {
    if (vals.length && !vals.some((v) => w.facets[k]?.includes(v))) return false;
  }
  const q = query.trim().toLowerCase();
  return !q || `${w.title}\n${w.body}`.toLowerCase().includes(q);
}
