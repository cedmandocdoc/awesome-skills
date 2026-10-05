// Shared by the viewer and scripts/walkthroughs.ts: parses the root's Markdown and validates the model.
import { parse } from "yaml";

export const SIGNATURE = "2f1b6e9a-e16d-4361-93a9-bccb7508bc90";
export const INDEX_DOC_TYPE = "walkthroughs-index";
export const GENERATOR = "building-walkthroughs";
export const BASELINE = "baseline:";
export const MAX_STEPS = 15;
export const MAX_LENSES = 2;
export const OVERVIEW = "What this app does";
export const RUN = "Run it locally";
/** Walkthrough `##` sections, in the only allowed order. */
export const SECTIONS = ["Before you start", "Flow", "Steps", "Cases", "Try it yourself"] as const;
const REQUIRED_SECTIONS = new Set<string>(["Before you start", "Flow", "Steps"]);
/** Valid gap reasons: `gap: "<reason>: <what, in one line>"`. */
export const GAP_REASONS = ["needs-setup", "internal", "not-built"] as const;
/** Lens ids the URL hash or the model already uses. */
const RESERVED_LENS_IDS = new Set(["actor", "actors", "area", "areas", "journey", "journeys", "j", "a", "w", "p", "nav"]);
/** A code span in Before you start whose text starts like this is a command; the viewer derives commands from `starts_from`. */
const COMMAND = /^(?:\$\s*)?(?:(?:pnpm|npm|yarn|npx|bunx?|supabase|docker(?:-compose)?|make)(?:\s|$)|\.\/)/;

export interface Baseline { id: string; title: string; setup?: string }
export interface Area { id: string; title: string; summary?: string }
export interface Actor { id: string; title: string }
export interface Journey { id: string; title: string; actors: string[]; goal: string; walkthroughs: string[] }
export interface LensValue { id: string; title: string }
export interface Lens { id: string; title: string; values: LensValue[]; actor?: boolean }
export interface Surface { id: string; title: string; area: string; gap?: string }
export interface Section { title: string; body: string }
export interface Step { n: number; actor: string; action: string; see: string; why?: string }
export interface Walkthrough {
  id: string;
  title: string;
  area: string;
  variationOf: string;
  actors: string[];
  surfaces: string[];
  startsFrom: string;
  endsWith: string[];
  checkpoint?: string;
  covers: string[];
  lens: Record<string, string>;
  goal: string;
  sections: Section[];
  steps: Step[];
  body: string;
}
export interface Model {
  app: string;
  baselines: Baseline[];
  areas: Area[];
  actors: Actor[];
  journeys: Journey[];
  /** Lenses that qualify, actor first when it does; the top bar shows these. */
  lenses: Lens[];
  surfaces: Surface[];
  overview: string;
  run: string;
  walkthroughs: Map<string, Walkthrough>;
  issues: string[];
}

const str = (v: unknown) => (typeof v === "string" ? v.trim() : v == null ? "" : String(v));
const list = (v: unknown) => (Array.isArray(v) ? v.map(str) : v == null || v === "" ? [] : [str(v)]);
const records = (v: unknown) => (Array.isArray(v) ? v.filter((x) => x && typeof x === "object") as Record<string, unknown>[] : []);
/** A Markdown link to a walkthrough in the root: `[text](<id>.md)`. */
const MD_LINK = /\]\((?:\.\/)?([\w-]+)\.md(?:#[^)]*)?\)/g;
const KEBAB = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;
const oneLine = (v: unknown) => typeof v === "string" && !/\r?\n/.test(v.trim());

export function splitFrontmatter(src: string): { data: Record<string, unknown>; body: string; offset: number; error?: string } {
  const m = /^---\r?\n([\s\S]*?)\r?\n---\r?\n?/.exec(src);
  if (!m) return { data: {}, body: src, offset: 0 };
  const offset = m[0].split("\n").length - 1;
  try {
    return { data: (parse(m[1]) ?? {}) as Record<string, unknown>, body: src.slice(m[0].length), offset };
  } catch (e) {
    return { data: {}, body: src.slice(m[0].length), offset, error: (e as Error).message.split("\n")[0] };
  }
}

/** Splits a body at `## ` headings outside code fences. `line` is the 1-based file line of each heading. */
function splitSections(body: string, offset: number): { preamble: string; sections: (Section & { line: number })[] } {
  const chunks: { title: string; line: number; lines: string[] }[] = [{ title: "", line: 0, lines: [] }];
  let fence = false;
  body.split(/\r?\n/).forEach((l, i) => {
    if (/^\s*(```|~~~)/.test(l)) fence = !fence;
    const h = fence ? null : /^## (.+?)\s*$/.exec(l);
    if (h) chunks.push({ title: h[1], line: offset + i + 1, lines: [] });
    else chunks[chunks.length - 1].lines.push(l);
  });
  const [pre, ...rest] = chunks;
  return { preamble: pre.lines.join("\n"), sections: rest.map((c) => ({ title: c.title, line: c.line, body: c.lines.join("\n").trim() })) };
}

/**
 * Parses the pinned step format inside `## Steps`:
 *   ### <Actor title>
 *   1. <action>
 *      - You should see: <result>
 *      - Why: <reason>            (optional)
 * Numbers run 1..N across actor groups.
 */
export function parseSteps(text: string, startLine: number, actors: string[], at: string, issues: string[]): Step[] {
  const steps: Step[] = [];
  let actor = "";
  let cur: Step | null = null;
  text.split(/\r?\n/).forEach((raw, i) => {
    const where = `${at}:${startLine + i + 1}`;
    const line = raw.replace(/\s+$/, "");
    if (!line) return;
    let m: RegExpExecArray | null;
    if ((m = /^### (.+)$/.exec(line))) {
      actor = m[1].trim();
      if (!actors.includes(actor)) issues.push(`${where}: step group "### ${actor}" is not one of this walkthrough's actors (${actors.join(", ") || "none"})`);
      cur = null;
    } else if ((m = /^(\d+)\. (.+)$/.exec(line))) {
      const n = Number(m[1]);
      if (!actor) issues.push(`${where}: step ${n} comes before any "### <Actor>" heading`);
      if (n !== steps.length + 1) issues.push(`${where}: step numbered ${n}, expected ${steps.length + 1} — number steps 1..N across all actor groups`);
      cur = { n: steps.length + 1, actor, action: m[2].trim(), see: "" };
      steps.push(cur);
    } else if ((m = /^ {2,4}- You should see: (.+)$/.exec(line))) {
      if (!cur) issues.push(`${where}: "You should see" line outside a step`);
      else if (cur.see) issues.push(`${where}: step ${cur.n} has two "You should see" lines`);
      else cur.see = m[1].trim();
    } else if ((m = /^ {2,4}- Why: (.+)$/.exec(line))) {
      if (!cur) issues.push(`${where}: "Why" line outside a step`);
      else if (cur.why) issues.push(`${where}: step ${cur.n} has two "Why" lines`);
      else cur.why = m[1].trim();
    } else {
      issues.push(`${where}: unexpected line in Steps: "${line.trim().slice(0, 60)}" — allowed: "### <Actor>", "N. <action>", "   - You should see: …", "   - Why: …"`);
    }
  });
  for (const s of steps) if (!s.see) issues.push(`${at}: step ${s.n} has no "   - You should see: …" line`);
  if (!steps.length) issues.push(`${at}: Steps has no numbered steps`);
  if (steps.length > MAX_STEPS) issues.push(`${at}: ${steps.length} steps — split past ${MAX_STEPS}`);
  return steps;
}

/** `files` maps a root-relative filename (`index.md`, `send-invoice.md`) to its source. */
export function buildModel(files: Record<string, string>): Model {
  const issues: string[] = [];
  const index = files["index.md"];
  if (index == null) issues.push("index.md is missing");
  const fm = splitFrontmatter(index ?? "");
  const head = fm.data;
  const hasIndex = index != null;
  if (fm.error) issues.push(`index.md: frontmatter is not valid YAML: ${fm.error}`);
  if (hasIndex) {
    if (head.doc_type !== INDEX_DOC_TYPE) issues.push(`index.md: doc_type must be ${INDEX_DOC_TYPE}`);
    if (head.generated_by !== GENERATOR) issues.push(`index.md: generated_by must be ${GENERATOR}`);
    if (head.author !== SIGNATURE) issues.push(`index.md: author must be ${SIGNATURE}`);
    if (!str(head.app)) issues.push("index.md: app is empty");
  }

  const baselines: Baseline[] = Object.entries((head.baselines ?? {}) as Record<string, Record<string, unknown>>).map(([id, b]) => ({
    id, title: str(b?.title) || id, setup: b?.setup ? str(b.setup) : undefined,
  }));
  if (hasIndex && !baselines.length) issues.push("index.md: baselines is empty — declare at least one");

  const declared = <T extends { id: string }>(name: string, items: T[], kebab = true, required = true) => {
    if (hasIndex && required && !items.length) issues.push(`index.md: ${name} is empty — declare at least one`);
    const seen = new Set<string>();
    for (const it of items) {
      if (!it.id) issues.push(`index.md: a ${name} entry has no id`);
      else if (kebab && !KEBAB.test(it.id)) issues.push(`index.md: ${name} id "${it.id}" must be kebab-case`);
      if (seen.has(it.id)) issues.push(`index.md: ${name} id "${it.id}" is declared twice`);
      seen.add(it.id);
    }
    return seen;
  };

  const areas: Area[] = records(head.areas).map((a) => ({ id: str(a.id), title: str(a.title) || str(a.id), summary: a.summary ? str(a.summary) : undefined }));
  const areaIds = declared("areas", areas);
  for (const a of records(head.areas)) if (a.summary != null && !oneLine(a.summary)) issues.push(`index.md: area "${str(a.id)}" summary must be one line of text`);

  const actors: Actor[] = records(head.actors).map((r) => ({ id: str(r.id), title: str(r.title) || str(r.id) }));
  const actorIds = declared("actors", actors);
  const actorTitles = new Map(actors.map((a) => [a.id, a.title]));

  const journeys: Journey[] = records(head.journeys).map((j) => ({
    id: str(j.id), title: str(j.title) || str(j.id), actors: list(j.actors), goal: str(j.goal), walkthroughs: list(j.walkthroughs),
  }));
  declared("journeys", journeys);
  for (const j of records(head.journeys)) if (!oneLine(j.goal) || !str(j.goal)) issues.push(`index.md: journey "${str(j.id)}" needs a goal of one line`);

  const declaredLenses: Lens[] = records(head.lenses).map((l) => ({
    id: str(l.id), title: str(l.title) || str(l.id),
    values: records(l.values).map((v) => ({ id: str(v.id), title: str(v.title) || str(v.id) })),
  }));
  declared("lenses", declaredLenses, true, false);

  const surfaces: Surface[] = records(head.surfaces).map((s) => ({
    id: str(s.id), title: str(s.title) || str(s.id), area: str(s.area), gap: s.gap == null ? undefined : str(s.gap),
  }));
  declared("surfaces", surfaces, false);
  const surfaceIds = new Set(surfaces.map((s) => s.id));

  const baselineIds = new Set(baselines.map((b) => b.id));
  const { sections: indexSections } = splitSections(fm.body, fm.offset);
  const indexSection = (title: string) => {
    const s = indexSections.find((x) => x.title === title);
    if (hasIndex && !s) issues.push(`index.md: missing "## ${title}" section`);
    return s?.body ?? "";
  };
  const overview = indexSection(OVERVIEW);
  const run = indexSection(RUN);

  const walkthroughs = new Map<string, Walkthrough>();
  const links: [string, string][] = [];
  for (const [file, src] of Object.entries(files).sort(([a], [b]) => a.localeCompare(b))) {
    if (file === "index.md") continue;
    const { data: d, body, offset, error } = splitFrontmatter(src);
    if (error) { issues.push(`${file}: frontmatter is not valid YAML: ${error}`); continue; }
    if (d.doc_type !== "walkthrough") continue;
    const id = str(d.id) || file.replace(/\.md$/, "");
    if (id !== file.replace(/\.md$/, "")) issues.push(`${file}: id "${id}" does not match the filename`);
    if (!str(d.title)) issues.push(`${file}: title is empty`);
    const wActors = list(d.actors);
    const { preamble, sections } = splitSections(body, offset);

    const goal = preamble.split(/\r?\n/).filter((l) => l.trim() && !/^# /.test(l)).join(" ").trim();
    if (!/^By the end, /.test(goal)) issues.push(`${file}: the line after the title must be the goal, starting "By the end, "`);

    let last = -1;
    const titles = new Set<string>();
    for (const s of sections) {
      const i = (SECTIONS as readonly string[]).indexOf(s.title);
      if (i < 0) issues.push(`${file}:${s.line}: unknown section "## ${s.title}" — allowed: ${SECTIONS.join(", ")}`);
      else if (i < last) issues.push(`${file}:${s.line}: "## ${s.title}" is out of order — order: ${SECTIONS.join(", ")}`);
      else last = i;
      if (titles.has(s.title)) issues.push(`${file}:${s.line}: "## ${s.title}" appears twice`);
      titles.add(s.title);
    }
    for (const r of REQUIRED_SECTIONS) if (!titles.has(r)) issues.push(`${file}: missing "## ${r}" section`);
    const before = sections.find((s) => s.title === "Before you start");
    if (before) {
      const fenced = [...before.body.matchAll(/^\s*(?:```|~~~)[^\n]*\n([\s\S]*?)^\s*(?:```|~~~)/gm)].flatMap((m) => m[1].split(/\r?\n/));
      const inline = [...before.body.replace(/^\s*(?:```|~~~)[\s\S]*?^\s*(?:```|~~~)/gm, "").matchAll(/(`+)([^`]+?)\1/g)].map((m) => m[2]);
      for (const code of [...fenced, ...inline].map((c) => c.trim()).filter((c) => COMMAND.test(c))) {
        issues.push(`${file}:${before.line}: Before you start has the command "${code.slice(0, 60)}" — say in plain words what must be true; the viewer shows the commands from starts_from`);
      }
      const from = str(d.starts_from);
      if (from && !from.startsWith(BASELINE) && ![...before.body.matchAll(MD_LINK)].some((m) => m[1] === from)) {
        issues.push(`${file}:${before.line}: Before you start must link ${from}.md, the walkthrough to finish first (starts_from)`);
      }
    }
    const flow = sections.find((s) => s.title === "Flow");
    if (flow && !/```mermaid/.test(flow.body)) issues.push(`${file}: Flow needs a mermaid diagram`);
    const stepsSection = sections.find((s) => s.title === "Steps");
    let steps: Step[] = [];
    if (stepsSection) {
      // The section body is trimmed: find the 0-based index of its first non-blank line after the heading.
      const all = src.split(/\r?\n/);
      let first = stepsSection.line;
      while (first < all.length && !all[first].trim()) first++;
      steps = parseSteps(stepsSection.body, first, wActors.map((a) => actorTitles.get(a) ?? a), file, issues);
    }

    for (const m of body.matchAll(MD_LINK)) links.push([file, m[1]]);
    const lensRaw = d.lens && typeof d.lens === "object" && !Array.isArray(d.lens) ? d.lens as Record<string, unknown> : {};
    if (d.lens != null && lensRaw !== d.lens) issues.push(`${file}: lens must be a map of lens id to value id`);

    walkthroughs.set(id, {
      id, title: str(d.title) || id, area: str(d.area), variationOf: str(d.variation_of), actors: wActors,
      surfaces: list(d.surfaces), startsFrom: str(d.starts_from), endsWith: list(d.ends_with),
      checkpoint: d.checkpoint ? str(d.checkpoint) : undefined, covers: list(d.covers),
      lens: Object.fromEntries(Object.entries(lensRaw).map(([k, v]) => [k, str(v)])),
      goal, sections: sections.map(({ title, body }) => ({ title, body })), steps, body,
    });
  }
  const all = [...walkthroughs.values()];

  for (const w of all) {
    const at = `${w.id}.md`;
    const parent = walkthroughs.get(w.startsFrom);
    if (w.startsFrom.startsWith(BASELINE)) {
      if (!baselineIds.has(w.startsFrom.slice(BASELINE.length))) issues.push(`${at}: unknown baseline in starts_from "${w.startsFrom}"`);
    } else if (!parent) issues.push(`${at}: starts_from "${w.startsFrom}" is neither baseline:<id> nor a walkthrough id`);
    else if (parent.variationOf) issues.push(`${at}: starts from variation "${parent.id}" — variations are dead ends; start from a task or a baseline`);

    if (!areaIds.has(w.area)) issues.push(`${at}: area "${w.area}" is not declared in index.md areas`);
    if (w.variationOf) {
      const core = walkthroughs.get(w.variationOf);
      if (!core) issues.push(`${at}: variation_of "${w.variationOf}" is not a walkthrough`);
      else if (core.variationOf) issues.push(`${at}: variation_of "${w.variationOf}" is itself a variation — vary a task`);
      else if (core.area !== w.area) issues.push(`${at}: area "${w.area}" differs from "${core.id}"'s area "${core.area}" — a variation sits in its task's area`);
    }

    if (!w.actors.length) issues.push(`${at}: actors is empty`);
    for (const a of w.actors) if (!actorIds.has(a)) issues.push(`${at}: actor "${a}" is not declared in index.md actors`);
    if (!w.endsWith.length) issues.push(`${at}: ends_with is empty`);
    if (!w.covers.length) issues.push(`${at}: covers is empty`);
    if (!w.surfaces.length) issues.push(`${at}: surfaces is empty — list the routes or screens it passes through`);
    for (const s of w.surfaces) if (!surfaceIds.has(s)) issues.push(`${at}: surface "${s}" is not declared in index.md surfaces`);
  }

  const cycles = new Set<string>();
  for (const w of all) {
    const path: string[] = [];
    for (let c: Walkthrough | undefined = w; c; c = walkthroughs.get(c.startsFrom)) {
      const at = path.indexOf(c.id);
      if (at >= 0) {
        const loop = path.slice(at);
        const key = [...loop].sort().join(",");
        if (!cycles.has(key)) issues.push(`starts_from loops: ${[...loop, c.id].join(" → ")} (each starts from the next) — every chain must end at a baseline`);
        cycles.add(key);
        break;
      }
      path.push(c.id);
    }
  }

  // Journeys
  if (hasIndex && journeys.length) {
    for (const j of journeys) {
      const at = `index.md: journey "${j.id}"`;
      if (!j.actors.length) issues.push(`${at} has no actors`);
      for (const a of j.actors) if (!actorIds.has(a)) issues.push(`${at}: actor "${a}" is not declared in actors`);
      if (j.walkthroughs.length < 2) issues.push(`${at} needs at least 2 walkthroughs — a journey chains tasks`);
      const seen = new Set<string>();
      for (const id of j.walkthroughs) {
        const w = walkthroughs.get(id);
        if (!w) issues.push(`${at}: "${id}" is not a walkthrough`);
        else if (w.variationOf) issues.push(`${at}: "${id}" is a variation — journeys chain tasks, never variations`);
        else if (j.actors.length && !w.actors.some((a) => j.actors.includes(a))) issues.push(`${at}: "${id}" has none of the journey's actors (${j.actors.join(", ")})`);
        if (seen.has(id)) issues.push(`${at}: "${id}" is listed twice`);
        seen.add(id);
      }
      for (const a of j.actors) {
        if (actorIds.has(a) && !j.walkthroughs.some((id) => walkthroughs.get(id)?.actors.includes(a))) issues.push(`${at}: actor "${a}" acts in none of its walkthroughs`);
      }
    }
  }

  // Areas and actors in use
  for (const a of areas) {
    if (!all.some((w) => w.area === a.id) && !surfaces.some((s) => s.area === a.id)) issues.push(`index.md: area "${a.id}" has no walkthroughs and no surfaces`);
  }
  for (const a of actors) if (!all.some((w) => w.actors.includes(a.id))) issues.push(`index.md: actor "${a.id}" acts in no walkthrough`);

  // Coverage: every declared surface is covered by a walkthrough or marked as a gap.
  const coveredBy = coverage({ walkthroughs, surfaces } as Model);
  for (const s of surfaces) {
    const at = `index.md: surface "${s.id}"`;
    if (!areaIds.has(s.area)) issues.push(`${at}: area "${s.area}" is not declared in areas`);
    const covered = coveredBy.get(s.id)?.length ?? 0;
    if (s.gap != null) {
      const m = /^([a-z-]+):\s*(\S.*)$/.exec(s.gap);
      if (!m || !(GAP_REASONS as readonly string[]).includes(m[1])) issues.push(`${at}: gap must read "<${GAP_REASONS.join(" | ")}>: <what, in one line>"`);
      if (covered) issues.push(`${at} is marked as a gap but ${coveredBy.get(s.id)!.join(", ")} covers it — drop the gap`);
    } else if (!covered) {
      issues.push(`${at} is not covered — add it to a walkthrough's surfaces, or mark it gap: "<${GAP_REASONS.join(" | ")}>: <why>"`);
    }
  }

  // Lenses: the actor lens is derived; declared lenses must pass rules 1, 2, and 4.
  const lenses: Lens[] = [];
  const actorLens = actors.length >= 2 && actors.length <= 6 && actors.every((a) => all.filter((w) => w.actors.includes(a.id)).length >= 2);
  if (actorLens) lenses.push({ id: "actor", title: "View as", values: actors, actor: true });
  const partition = (key: (w: Walkthrough) => string) => {
    const groups = new Map<string, string[]>();
    for (const w of all) groups.set(key(w), [...(groups.get(key(w)) ?? []), w.id]);
    return new Set([...groups.values()].map((ids) => ids.sort().join(",")));
  };
  const areaParts = partition((w) => w.area);
  const journeySets = new Set(journeys.map((j) => [...j.walkthroughs].sort().join(",")));
  for (const l of declaredLenses) {
    const at = `index.md: lens "${l.id}"`;
    if (RESERVED_LENS_IDS.has(l.id)) issues.push(`${at}: the id is reserved — the actor lens is derived from walkthrough actors; areas and journeys are never lenses`);
    if (l.values.length < 2 || l.values.length > 6) issues.push(`${at} has ${l.values.length} values — a lens needs 2–6`);
    const valueIds = new Set(l.values.map((v) => v.id));
    for (const v of l.values) if (!KEBAB.test(v.id)) issues.push(`${at}: value "${v.id}" must be kebab-case`);
    for (const w of all) {
      const v = w.lens[l.id];
      if (!v) issues.push(`${w.id}.md: no value for lens "${l.id}" — every walkthrough needs one (${[...valueIds].join(", ")})`);
      else if (!valueIds.has(v)) issues.push(`${w.id}.md: lens "${l.id}" value "${v}" is not declared (${[...valueIds].join(", ")})`);
    }
    for (const v of l.values) {
      const n = all.filter((w) => w.lens[l.id] === v.id).length;
      if (n < 2) issues.push(`${at}: value "${v.id}" is used by ${n} walkthrough${n === 1 ? "" : "s"} — each value needs at least 2`);
    }
    const parts = partition((w) => w.lens[l.id] ?? "");
    if (all.length && [...parts].every((p) => areaParts.has(p))) issues.push(`${at} repeats areas — its values group walkthroughs exactly as areas do`);
    else if (all.length && [...parts].every((p) => journeySets.has(p))) issues.push(`${at} repeats journeys — its values group walkthroughs exactly as journeys do`);
    lenses.push(l);
  }
  for (const w of all) for (const k of Object.keys(w.lens)) if (!declaredLenses.some((l) => l.id === k)) issues.push(`${w.id}.md: lens "${k}" is not declared in index.md lenses`);
  if (lenses.length > MAX_LENSES) {
    issues.push(`index.md: ${lenses.length} lenses${actorLens ? " (counting the derived actor lens)" : ""} — at most ${MAX_LENSES}; keep the ones that answer "show me what's relevant to me"`);
  }

  for (const [file, id] of links) if (id !== "index" && !walkthroughs.has(id)) issues.push(`${file}: links to ${id}.md, which is not a walkthrough`);

  return {
    app: str(head.app) || "Walkthroughs", baselines, areas, actors, journeys, lenses: lenses.slice(0, MAX_LENSES), surfaces,
    overview, run, walkthroughs, issues: [...new Set(issues)],
  };
}

/** Surface id → walkthrough ids whose `surfaces` include it. */
export function coverage(m: Pick<Model, "walkthroughs" | "surfaces">): Map<string, string[]> {
  const out = new Map<string, string[]>(m.surfaces.map((s) => [s.id, []]));
  for (const w of m.walkthroughs.values()) for (const s of w.surfaces) out.get(s)?.push(w.id);
  return out;
}

/** Replay order from the baseline to `id`: [baseline:<id>, …, id]. */
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

/** Rank by first appearance across journeys (journey order, then position), so journey tasks lead their area. */
function journeyRank(m: Model, id: string): number {
  let best = Number.MAX_SAFE_INTEGER;
  m.journeys.forEach((j, ji) => { const i = j.walkthroughs.indexOf(id); if (i >= 0) best = Math.min(best, ji * 1000 + i); });
  return best;
}

/** Tasks (non-variations) of an area: journey tasks first, then the rest by title. */
export function tasksOf(m: Model, area: string): Walkthrough[] {
  return [...m.walkthroughs.values()]
    .filter((w) => !w.variationOf && w.area === area)
    .sort((a, b) => journeyRank(m, a.id) - journeyRank(m, b.id) || a.title.localeCompare(b.title));
}

export const variationsOf = (m: Model, id: string) =>
  [...m.walkthroughs.values()].filter((w) => w.variationOf === id).sort((a, b) => a.title.localeCompare(b.title));

/** An area's walkthroughs in map order: each task followed by its variations. */
export const areaOrder = (m: Model, area: string) => tasksOf(m, area).flatMap((t) => [t, ...variationsOf(m, t.id)]);

export const journeyWalkthroughs = (m: Model, j: Journey) =>
  j.walkthroughs.map((id) => m.walkthroughs.get(id)).filter((w): w is Walkthrough => !!w);

export const journeySteps = (m: Model, j: Journey) => journeyWalkthroughs(m, j).reduce((n, w) => n + w.steps.length, 0);

/** The group the navigator and the map spotlight: a journey or an area. */
export interface Group { kind: "journey" | "area"; id: string }

export const groupHas = (m: Model, g: Group, id: string) =>
  g.kind === "journey" ? !!m.journeys.find((j) => j.id === g.id)?.walkthroughs.includes(id) : m.walkthroughs.get(id)?.area === g.id;

/** Prev/next along the active journey when `id` is in it, else along its area. */
export function neighbors(m: Model, id: string, journey?: Journey): { along: string; kind: "journey" | "area"; pos: number; total: number; prev?: Walkthrough; next?: Walkthrough } {
  const w = m.walkthroughs.get(id);
  const inJourney = !!journey && journey.walkthroughs.includes(id);
  const order = inJourney ? journeyWalkthroughs(m, journey!) : areaOrder(m, w?.area ?? "");
  const i = order.findIndex((x) => x.id === id);
  const along = inJourney ? journey!.title : m.areas.find((a) => a.id === w?.area)?.title ?? "Area";
  return { along, kind: inJourney ? "journey" : "area", pos: i + 1, total: order.length, prev: i > 0 ? order[i - 1] : undefined, next: i >= 0 ? order[i + 1] : undefined };
}

/** Lens selection: lens id → value id ("" = all). */
export type LensState = Record<string, string>;

export function matchesLenses(m: Model, w: Walkthrough, state: LensState): boolean {
  return m.lenses.every((l) => {
    const v = state[l.id];
    if (!v) return true;
    return l.actor ? w.actors.includes(v) : w.lens[l.id] === v;
  });
}

export function matchesQuery(w: Walkthrough, query: string): boolean {
  const q = query.trim().toLowerCase();
  return !!q && `${w.title}\n${w.body}\n${w.surfaces.join("\n")}`.toLowerCase().includes(q);
}

export const actorTitle = (m: Model, id: string) => m.actors.find((a) => a.id === id)?.title ?? id;

/** Markdown inline text without emphasis, code ticks, or link targets — for card text. */
export const plain = (s: string) => s.replace(/\[([^\]]+)\]\([^)]*\)/g, "$1").replace(/[*_`]/g, "");
