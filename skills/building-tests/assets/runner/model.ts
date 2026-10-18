// Reads the tests root: index.md config, personas, states, segments, journeys, properties.
// Copied by building-tests; never edited.

import { existsSync } from "node:fs";
import { readdir, readFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath, pathToFileURL } from "node:url";
import { parse } from "yaml";
import type { Params, Personas, States } from "./types.ts";

export const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");

export interface SurfaceConfig {
  ext: string;
  run: string;
  requires?: string;
}

export interface Config {
  app?: string;
  backend: { start?: string; reset?: string };
  health: string[];
  routes?: string;
  surfaces: Record<string, SurfaceConfig>;
}

export interface Case {
  id: string;
  status: "ready" | "pending";
  source: string;
  given?: string;
  then?: string;
  params?: Params;
}

export interface Segment {
  file: string;
  area: string;
  id: string;
  title: string;
  status: "ready" | "draft";
  actor: string;
  surfaces: string[];
  given: string;
  then: string;
  params: Params;
  covers: string[];
  cases: Case[];
}

export interface Step {
  segment: string;
  surface: string;
  case: string;
}

export interface Journey {
  file: string;
  id: string;
  title: string;
  params: Params;
  steps: Step[];
}

export interface Property {
  file: string;
  id: string;
  title: string;
  surfaces: string[];
  covers: "all" | string[];
  except: { route: string; reason: string }[];
}

export interface Persona {
  id: string;
  role: string;
  title?: string;
}

export interface StateDef {
  id: string;
  summary?: string;
  file: string;
}

export function rel(file: string): string {
  return path.relative(ROOT, file);
}

export async function frontmatter(file: string): Promise<Record<string, any>> {
  const text = await readFile(file, "utf8");
  const match = /^---\r?\n([\s\S]*?)\r?\n---/.exec(text);
  if (!match) throw new Error(`${rel(file)}: no frontmatter`);
  return parse(match[1]) ?? {};
}

async function markdown(dir: string, nested: boolean): Promise<string[]> {
  if (!existsSync(dir)) return [];
  const out: string[] = [];
  for (const entry of await readdir(dir, { withFileTypes: true })) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory() && nested) out.push(...(await markdown(full, false)));
    else if (entry.isFile() && entry.name.endsWith(".md")) out.push(full);
  }
  return out.sort();
}

export async function loadConfig(): Promise<Config> {
  const fm = await frontmatter(path.join(ROOT, "index.md"));
  return {
    app: fm.app,
    backend: fm.backend ?? {},
    health: fm.health ?? [],
    routes: fm.routes,
    surfaces: fm.surfaces ?? {},
  };
}

export async function loadPersonas(): Promise<Persona[]> {
  const file = path.join(ROOT, "personas.md");
  if (!existsSync(file)) return [];
  return (await frontmatter(file)).personas ?? [];
}

export async function loadStateDefs(): Promise<StateDef[]> {
  const out: StateDef[] = [];
  for (const file of await markdown(path.join(ROOT, "states"), false)) {
    for (const s of (await frontmatter(file)).states ?? []) out.push({ ...s, file });
  }
  return out;
}

export async function loadSegments(): Promise<Segment[]> {
  const out: Segment[] = [];
  for (const file of await markdown(path.join(ROOT, "segments"), true)) {
    const fm = await frontmatter(file);
    out.push({
      file,
      area: path.basename(path.dirname(file)),
      id: fm.id,
      title: fm.title,
      status: fm.status ?? "ready",
      actor: fm.actor,
      surfaces: fm.surfaces ?? [],
      given: fm.given ?? "none",
      then: fm.then ?? "none",
      params: fm.params ?? {},
      covers: fm.covers ?? [],
      cases: (fm.cases ?? []).map((c: Partial<Case>) => ({ status: "ready", ...c }) as Case),
    });
  }
  return out;
}

export async function loadJourneys(): Promise<Journey[]> {
  const out: Journey[] = [];
  for (const file of await markdown(path.join(ROOT, "journeys"), false)) {
    const fm = await frontmatter(file);
    out.push({
      file,
      id: fm.id,
      title: fm.title,
      params: fm.params ?? {},
      steps: (fm.steps ?? []).map((s: Partial<Step>) => ({ case: "happy", ...s })),
    });
  }
  return out;
}

export async function loadProperties(): Promise<Property[]> {
  const out: Property[] = [];
  for (const file of await markdown(path.join(ROOT, "properties"), false)) {
    const fm = await frontmatter(file);
    out.push({
      file,
      id: fm.id,
      title: fm.title,
      surfaces: fm.surfaces ?? [],
      covers: fm.covers ?? "all",
      except: fm.except ?? [],
    });
  }
  return out;
}

/** The implementation beside a definition for one surface. */
export function implementation(definition: string, id: string, surface: SurfaceConfig): string {
  return path.join(path.dirname(definition), `${id}${surface.ext}`);
}

export function given(segment: Segment, c: Case): string {
  return c.given ?? segment.given;
}

export function then(segment: Segment, c: Case): string {
  return c.then ?? segment.then;
}

/** Merges every support/states/*.ts default export; throws on a duplicate id. */
export async function loadStates(): Promise<States> {
  const dir = path.join(ROOT, "support", "states");
  const states: States = {};
  if (!existsSync(dir)) return states;
  for (const name of (await readdir(dir)).filter((n) => n.endsWith(".ts")).sort()) {
    const mod = await import(pathToFileURL(path.join(dir, name)).href);
    for (const [id, state] of Object.entries((mod.default ?? {}) as States)) {
      if (states[id]) throw new Error(`state ${id} is exported twice (support/states/${name})`);
      states[id] = state;
    }
  }
  return states;
}

export async function loadPersonaSessions(): Promise<Personas | null> {
  const file = path.join(ROOT, "support", "personas.ts");
  if (!existsSync(file)) return null;
  return (await import(pathToFileURL(file).href)).default as Personas;
}
