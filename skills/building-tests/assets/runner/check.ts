// Validates definitions and implementations, then rewrites the coverage block in index.md.
// Copied by building-tests; never edited.

import { existsSync } from "node:fs";
import { readFile, writeFile } from "node:fs/promises";
import path from "node:path";
import {
  ROOT,
  given,
  implementation,
  loadConfig,
  loadJourneys,
  loadPersonas,
  loadProperties,
  loadSegments,
  loadStateDefs,
  loadStates,
  rel,
  then,
  type Segment,
} from "./model.ts";

const errors: string[] = [];
const warnings: string[] = [];
const KEBAB = /^[a-z0-9]+(-[a-z0-9]+)*$/;

function error(file: string, message: string): void {
  errors.push(`${rel(file)}: ${message}`);
}

const config = await loadConfig();
const [personas, stateDefs, segments, journeys, properties] = await Promise.all([
  loadPersonas(),
  loadStateDefs(),
  loadSegments(),
  loadJourneys(),
  loadProperties(),
]);

const index = path.join(ROOT, "index.md");
const roles = new Set(personas.map((p) => p.role));
const personaRole = new Map(personas.map((p) => [p.id, p.role]));
const declared = new Set(stateDefs.map((s) => s.id));

for (const [id, surface] of Object.entries(config.surfaces)) {
  if (!surface.ext || !surface.run) error(index, `surface ${id} needs ext and run`);
}

// States: Markdown and support code declare the same ids.
let code: Set<string> | null = null;
try {
  code = new Set(Object.keys(await loadStates()));
} catch (e) {
  errors.push(`support/states: failed to load — ${e instanceof Error ? e.message : String(e)}`);
}
for (const def of stateDefs) {
  if (code && !code.has(def.id)) error(def.file, `state ${def.id} has no support code`);
}
if (code) for (const id of code) if (!declared.has(id)) errors.push(`support/states: ${id} is not declared in states/*.md`);

function state(file: string, id: string, field: string): void {
  if (id !== "none" && !declared.has(id)) error(file, `${field} ${id} is not a declared state`);
}

async function tagged(file: string, tag: string): Promise<boolean> {
  return existsSync(file) && (await readFile(file, "utf8")).includes(`[${tag}]`);
}

// Segments.
const ids = new Set<string>();
for (const s of segments) {
  const f = s.file;
  if (path.basename(f, ".md") !== s.id) error(f, `id ${s.id} must equal the filename`);
  if (ids.has(s.id)) error(f, `duplicate segment id ${s.id}`);
  ids.add(s.id);
  if (path.dirname(path.dirname(f)) !== path.join(ROOT, "segments")) error(f, "must sit in segments/<area>/");
  if (!s.title) error(f, "title is required");
  if (!["ready", "draft"].includes(s.status)) error(f, `status ${s.status} must be ready or draft`);
  if (s.actor !== "system" && !roles.has(s.actor)) error(f, `actor ${s.actor} is not a persona role or system`);
  if (s.actor !== "system" && s.status === "ready") {
    const persona = s.params[s.actor];
    if (persona !== undefined && personaRole.get(String(persona)) !== s.actor) {
      error(f, `params.${s.actor} = ${persona} is not a persona with role ${s.actor}`);
    }
  }
  if (s.surfaces.length === 0) error(f, "surfaces is empty");
  for (const surface of s.surfaces) if (!config.surfaces[surface]) error(f, `surface ${surface} is not in index.md`);
  if (s.cases.length === 0) error(f, "cases is empty");
  const caseIds = new Set<string>();
  for (const c of s.cases) {
    if (!KEBAB.test(c.id ?? "")) error(f, `case id ${c.id} must be kebab-case`);
    if (caseIds.has(c.id)) error(f, `duplicate case ${c.id}`);
    caseIds.add(c.id);
    if (!["ready", "pending"].includes(c.status)) error(f, `case ${c.id} status must be ready or pending`);
    if (!c.source) error(f, `case ${c.id} needs a source`);
    if (s.status === "ready" && c.source === "draft") error(f, `case ${c.id} is ready but its source is draft`);
    state(f, given(s, c), "given");
    state(f, then(s, c), "then");
  }
  if (s.status === "draft") continue;
  for (const surface of s.surfaces) {
    const surfaceConfig = config.surfaces[surface];
    if (!surfaceConfig) continue;
    const impl = implementation(f, s.id, surfaceConfig);
    const ready = s.cases.filter((c) => c.status === "ready");
    if (ready.length > 0 && !existsSync(impl)) {
      error(f, `missing ${rel(impl)}`);
      continue;
    }
    for (const c of ready) if (!(await tagged(impl, c.id))) error(impl, `case [${c.id}] is not implemented`);
  }
}

// Journeys.
const byId = new Map(segments.map((s) => [s.id, s]));
for (const j of journeys) {
  const f = j.file;
  if (path.basename(f, ".md") !== j.id) error(f, `id ${j.id} must equal the filename`);
  if (j.steps.length < 2) error(f, "a journey chains at least two steps");
  let previous: string | null = null;
  for (const [i, step] of j.steps.entries()) {
    const s = byId.get(step.segment);
    if (!s) {
      error(f, `step ${i + 1}: no segment ${step.segment}`);
      previous = null;
      continue;
    }
    const c = s.cases.find((x) => x.id === step.case);
    if (!c) error(f, `step ${i + 1}: ${s.id} has no case ${step.case}`);
    if (!s.surfaces.includes(step.surface)) error(f, `step ${i + 1}: ${s.id} has no ${step.surface} implementation`);
    if (s.actor !== "system" && { ...s.params, ...c?.params, ...j.params }[s.actor] === undefined) {
      error(f, `step ${i + 1}: no persona for role ${s.actor}`);
    }
    if (c && previous !== null && given(s, c) !== previous) {
      error(f, `step ${i + 1}: Given ${given(s, c)} does not match the previous Then ${previous}`);
    }
    previous = c ? then(s, c) : null;
  }
}

// Properties.
for (const p of properties) {
  const f = p.file;
  if (path.basename(f, ".md") !== p.id) error(f, `id ${p.id} must equal the filename`);
  if (p.covers === "all" && !config.routes) error(f, "covers all needs a routes command in index.md");
  for (const e of p.except) if (!e.reason) error(f, `except ${e.route} needs a reason`);
  for (const surface of p.surfaces) {
    const surfaceConfig = config.surfaces[surface];
    if (!surfaceConfig) {
      error(f, `surface ${surface} is not in index.md`);
      continue;
    }
    const impl = implementation(f, p.id, surfaceConfig);
    if (!(await tagged(impl, p.id))) error(f, `missing ${rel(impl)} or its [${p.id}] tag`);
  }
}

// Coverage block.
const surfaceIds = Object.keys(config.surfaces);
function cell(s: Segment, surface: string): string {
  if (!s.surfaces.includes(surface)) return "—";
  if (s.status === "draft") return "draft";
  const ready = s.cases.filter((c) => c.status === "ready").length;
  const pending = s.cases.length - ready;
  return pending ? `${ready} ready · ${pending} pending` : `${ready} ready`;
}
const lines = [
  `| Segment | Area | ${surfaceIds.join(" | ")} |`,
  `| --- | --- | ${surfaceIds.map(() => "---").join(" | ")} |`,
  ...segments.map((s) => `| ${s.id} | ${s.area} | ${surfaceIds.map((x) => cell(s, x)).join(" | ")} |`),
];
if (journeys.length) {
  lines.push("", "| Journey | Steps | Runs |", "| --- | --- | --- |");
  for (const j of journeys) {
    const blocked = j.steps.find((step) => {
      const s = byId.get(step.segment);
      return !s || s.status === "draft" || s.cases.find((c) => c.id === step.case)?.status !== "ready";
    });
    const runs = blocked ? `skipped: ${blocked.segment} [${blocked.case}]` : "yes";
    lines.push(`| ${j.id} | ${j.steps.map((step) => `${step.segment} @${step.surface}`).join(" → ")} | ${runs} |`);
  }
}
if (properties.length) {
  lines.push("", "| Property | Surfaces | Covers | Except |", "| --- | --- | --- | --- |");
  for (const p of properties) {
    const covers = p.covers === "all" ? "all routes" : `${p.covers.length} routes`;
    lines.push(`| ${p.id} | ${p.surfaces.join(", ")} | ${covers} | ${p.except.length} |`);
  }
}
const drafts = segments.filter((s) => s.status === "draft").length;
if (drafts) warnings.push(`${drafts} draft segment(s) await confirmation`);

const text = await readFile(index, "utf8");
const start = "<!-- tests:coverage:start -->";
const end = "<!-- tests:coverage:end -->";
const a = text.indexOf(start);
const b = text.indexOf(end);
if (a === -1 || b === -1) errors.push("index.md: coverage markers are missing");
else await writeFile(index, `${text.slice(0, a + start.length)}\n${lines.join("\n")}\n${text.slice(b)}`);

for (const w of warnings) console.warn(`warning: ${w}`);
for (const e of errors) console.error(`error: ${e}`);
console.log(`${segments.length} segments, ${journeys.length} journeys, ${properties.length} properties — ${errors.length} error(s)`);
process.exit(errors.length ? 1 : 0);
