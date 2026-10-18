// Runs segments, journeys, and properties from their Markdown definitions.
// Copied by building-tests; never edited.
//
// Usage: tsx runner/run.ts [all | area <area> | segment <id> [--surface <s>] [--case <c>] | journey <id> | property <id>]

import { spawn } from "node:child_process";
import { mkdir, writeFile } from "node:fs/promises";
import { existsSync } from "node:fs";
import path from "node:path";
import {
  ROOT,
  given,
  implementation,
  loadConfig,
  loadJourneys,
  loadPersonaSessions,
  loadProperties,
  loadSegments,
  loadStates,
  rel,
  then,
  type Case,
  type Config,
  type Journey,
  type Property,
  type Segment,
} from "./model.ts";
import type { Params, Personas, States, Subject } from "./types.ts";

interface Result {
  kind: "segment" | "journey" | "property";
  id: string;
  case?: string;
  surface?: string;
  outcome: "passed" | "failed" | "skipped";
  reason?: string;
  seconds: number;
}

const results: Result[] = [];
let config: Config;
let states: States;
let personas: Personas | null;

function quote(value: string): string {
  return `'${value.replace(/'/g, `'\\''`)}'`;
}

function exec(command: string, env: Record<string, string> = {}, capture = false): Promise<{ code: number; stdout: string }> {
  return new Promise((resolve) => {
    const child = spawn(command, {
      shell: true,
      cwd: ROOT,
      env: { ...process.env, ...env },
      stdio: capture ? ["ignore", "pipe", "inherit"] : "inherit",
    });
    let stdout = "";
    child.stdout?.on("data", (chunk) => (stdout += chunk));
    child.on("close", (code) => resolve({ code: code ?? 1, stdout }));
  });
}

function envKey(key: string): string {
  return `TEST_${key.replace(/([a-z0-9])([A-Z])/g, "$1_$2").replace(/[^A-Za-z0-9]+/g, "_").toUpperCase()}`;
}

function render(template: string, file: string, caseId: string, env: Record<string, string>): string {
  const envArgs = Object.entries(env)
    .map(([key, value]) => `-e ${key}=${quote(value)}`)
    .join(" ");
  return template.replaceAll("{file}", quote(file)).replaceAll("{case}", caseId).replaceAll("{envArgs}", envArgs);
}

function record(result: Omit<Result, "seconds">, started: number): Result {
  const full = { ...result, seconds: Math.round((Date.now() - started) / 100) / 10 };
  results.push(full);
  const where = [full.case && `[${full.case}]`, full.surface && `@${full.surface}`].filter(Boolean).join(" ");
  const label = full.outcome.toUpperCase().padEnd(7);
  console.log(`${label} ${full.kind} ${full.id} ${where} (${full.seconds}s)${full.reason ? ` — ${full.reason}` : ""}`);
  return full;
}

async function holds(state: string, params: Params): Promise<Subject | null> {
  const def = states[state];
  if (!def) throw new Error(`state ${state} has no support code`);
  const subject = await def.lookup(params);
  return subject && (await def.check(subject, params)) ? subject : null;
}

async function health(): Promise<void> {
  for (const command of config.health) {
    if ((await exec(command)).code !== 0) {
      const start = config.backend.start ? ` Start it with \`${config.backend.start}\` and run again.` : "";
      console.error(`Stack not healthy: \`${command}\` failed.${start}`);
      process.exit(2);
    }
  }
}

async function reset(): Promise<void> {
  if (!config.backend.reset) return;
  if ((await exec(config.backend.reset)).code !== 0) {
    console.error(`Reset failed: \`${config.backend.reset}\``);
    process.exit(2);
  }
}

/** One case on one surface. `build` creates the Given; `verify` requires it to hold already (journeys). */
async function runCase(
  segment: Segment,
  c: Case,
  surface: string,
  mode: "build" | "verify",
  extra: Params = {},
): Promise<Result> {
  const started = Date.now();
  const base = { kind: "segment" as const, id: segment.id, case: c.id, surface };
  if (segment.status === "draft") return record({ ...base, outcome: "skipped", reason: "draft" }, started);
  if (c.status === "pending") return record({ ...base, outcome: "skipped", reason: "pending" }, started);
  const fail = (reason: string) => record({ ...base, outcome: "failed", reason }, started);
  try {
    const surfaceConfig = config.surfaces[surface];
    if (!surfaceConfig) return fail(`surface ${surface} is not in index.md`);
    const file = implementation(segment.file, segment.id, surfaceConfig);
    if (!existsSync(file)) return fail(`missing ${rel(file)}`);
    const params: Params = { ...segment.params, ...c.params, ...extra };

    let subject: Subject = {};
    const givenState = given(segment, c);
    if (givenState !== "none") {
      if (mode === "build") {
        const def = states[givenState];
        if (!def) return fail(`state ${givenState} has no support code`);
        subject = await def.build(params);
      } else {
        const found = await holds(givenState, params);
        if (!found) return fail(`Given ${givenState} does not hold`);
        subject = found;
      }
    }

    let session: Record<string, string> = {};
    if (segment.actor !== "system") {
      const persona = params[segment.actor];
      if (persona === undefined) return fail(`params has no persona for role ${segment.actor}`);
      if (!personas) return fail("support/personas.ts is missing");
      session = await personas.session(String(persona), surface);
    }

    const env: Record<string, string> = {
      TEST_CASE: c.id,
      TEST_SURFACE: surface,
      TEST_PARAMS: JSON.stringify(params),
      TEST_SUBJECT: JSON.stringify(subject),
      ...Object.fromEntries(Object.entries(subject).map(([key, value]) => [envKey(key), String(value ?? "")])),
      ...session,
    };
    const { code } = await exec(render(surfaceConfig.run, rel(file), c.id, env), env);
    if (code !== 0) return fail(`implementation exited ${code}`);

    const thenState = then(segment, c);
    if (thenState !== "none" && !(await holds(thenState, params))) return fail(`Then ${thenState} does not hold`);
    return record({ ...base, outcome: "passed" }, started);
  } catch (error) {
    return fail(error instanceof Error ? error.message : String(error));
  }
}

async function runSegment(segment: Segment, onlySurface?: string, onlyCase?: string): Promise<void> {
  const surfaces = onlySurface ? [onlySurface] : segment.surfaces;
  const cases = onlyCase ? segment.cases.filter((c) => c.id === onlyCase) : segment.cases;
  if (cases.length === 0) {
    record({ kind: "segment", id: segment.id, outcome: "failed", reason: `no case ${onlyCase}` }, Date.now());
    return;
  }
  for (const surface of surfaces) for (const c of cases) await runCase(segment, c, surface, "build");
}

async function runJourney(journey: Journey, segments: Map<string, Segment>): Promise<void> {
  const started = Date.now();
  const base = { kind: "journey" as const, id: journey.id };
  const resolved: [Segment, Case, string][] = [];
  for (const step of journey.steps) {
    const segment = segments.get(step.segment);
    const c = segment?.cases.find((x) => x.id === step.case);
    if (!segment || !c) {
      record({ ...base, outcome: "failed", reason: `unknown step ${step.segment} [${step.case}]` }, started);
      return;
    }
    if (segment.status === "draft" || c.status === "pending") {
      record({ ...base, outcome: "skipped", reason: `${step.segment} [${step.case}] is ${segment.status === "draft" ? "draft" : "pending"}` }, started);
      return;
    }
    resolved.push([segment, c, step.surface]);
  }
  await reset();
  for (const [index, [segment, c, surface]] of resolved.entries()) {
    const result = await runCase(segment, c, surface, index === 0 ? "build" : "verify", journey.params);
    if (result.outcome !== "passed") {
      record({ ...base, outcome: "failed", reason: `step ${index + 1} ${segment.id}: ${result.reason}` }, started);
      return;
    }
  }
  record({ ...base, outcome: "passed" }, started);
}

let routeCache: Record<string, string[]> | null = null;

async function routes(surface: string): Promise<string[]> {
  if (!config.routes) throw new Error("index.md has no routes command");
  if (!routeCache) {
    const { code, stdout } = await exec(config.routes, {}, true);
    if (code !== 0) throw new Error(`routes command exited ${code}`);
    routeCache = JSON.parse(stdout);
  }
  return routeCache![surface] ?? [];
}

async function runProperty(property: Property): Promise<void> {
  for (const surface of property.surfaces) {
    const started = Date.now();
    const base = { kind: "property" as const, id: property.id, surface };
    try {
      const surfaceConfig = config.surfaces[surface];
      if (!surfaceConfig) throw new Error(`surface ${surface} is not in index.md`);
      const file = implementation(property.file, property.id, surfaceConfig);
      if (!existsSync(file)) throw new Error(`missing ${rel(file)}`);
      const excluded = new Set(property.except.map((e) => e.route));
      const covered = (property.covers === "all" ? await routes(surface) : property.covers).filter((r) => !excluded.has(r));
      const env = { TEST_PROPERTY: property.id, TEST_SURFACE: surface, TEST_ROUTES: JSON.stringify(covered) };
      const { code } = await exec(render(surfaceConfig.run, rel(file), property.id, env), env);
      record({ ...base, outcome: code === 0 ? "passed" : "failed", reason: code === 0 ? undefined : `implementation exited ${code}` }, started);
    } catch (error) {
      record({ ...base, outcome: "failed", reason: error instanceof Error ? error.message : String(error) }, started);
    }
  }
}

function flag(args: string[], name: string): string | undefined {
  const index = args.indexOf(`--${name}`);
  return index === -1 ? undefined : args[index + 1];
}

function usage(message: string): never {
  console.error(`${message}\nUsage: run [all | area <area> | segment <id> [--surface <s>] [--case <c>] | journey <id> | property <id>]`);
  process.exit(64);
}

async function main(): Promise<void> {
  const args = process.argv.slice(2);
  const [scope = "all", target] = args;
  config = await loadConfig();
  const [segments, journeys, properties] = await Promise.all([loadSegments(), loadJourneys(), loadProperties()]);
  const byId = new Map(segments.map((s) => [s.id, s]));
  const find = <T extends { id: string }>(list: T[], kind: string): T => {
    if (!target) usage(`Missing ${kind} id.`);
    return list.find((x) => x.id === target) ?? usage(`No ${kind} ${target}.`);
  };

  if (!["all", "area", "segment", "journey", "property"].includes(scope)) usage(`Unknown scope ${scope}.`);
  if (scope === "area" && !target) usage("Missing area.");
  const segment = scope === "segment" ? find(segments, "segment") : undefined;
  const journey = scope === "journey" ? find(journeys, "journey") : undefined;
  const property = scope === "property" ? find(properties, "property") : undefined;

  await health();
  states = await loadStates();
  personas = await loadPersonaSessions();

  if (scope === "all") {
    await reset();
    for (const p of properties) await runProperty(p);
    for (const s of segments) await runSegment(s);
    for (const j of journeys) await runJourney(j, byId);
  }
  if (scope === "area") for (const s of segments.filter((x) => x.area === target)) await runSegment(s);
  if (segment) await runSegment(segment, flag(args, "surface"), flag(args, "case"));
  if (journey) await runJourney(journey, byId);
  if (property) await runProperty(property);

  const count = (outcome: Result["outcome"]) => results.filter((r) => r.outcome === outcome).length;
  console.log(`\n${count("passed")} passed, ${count("failed")} failed, ${count("skipped")} skipped`);
  await mkdir(path.join(ROOT, ".results"), { recursive: true });
  await writeFile(path.join(ROOT, ".results", "last.json"), JSON.stringify({ scope, target, results }, null, 2));
  process.exit(count("failed") > 0 ? 1 : 0);
}

await main();
