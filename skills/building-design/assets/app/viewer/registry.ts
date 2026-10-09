// Frame side: discovers every *.design.ts, resolves render targets, builds the serializable registry.
import type { ComponentType } from "react";
import type { FeatureDesign, ScreenDesign, UIDesign } from "../system/define";
import { controlDefault, type Registry, type Target } from "./meta";

type Design = FeatureDesign | ScreenDesign | UIDesign;
const mods = import.meta.glob<{ default?: Design }>(["/features/*/*.design.ts", "/ui/*/*.design.ts"], { eager: true });

const ui = new Map<string, UIDesign>();
const screens = new Map<string, ScreenDesign>();
const features = new Map<string, FeatureDesign>();

for (const [path, mod] of Object.entries(mods)) {
  const d = mod.default;
  const [, folder, file] = path.replace(/\.design\.ts$/, "").split("/").filter(Boolean);
  if (d?.kind === "ui") ui.set(`ui/${folder}`, d);
  else if (d?.kind === "screen") screens.set(`features/${folder}/${file}`, d);
  else if (d?.kind === "feature") features.set(folder, d);
}

const idOf = new Map<object, string>([...ui, ...screens].map(([id, d]) => [d, id]));
const slug = (s: string) => s.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");
const titleOf = (id: string) => {
  const name = id.split("/").pop() ?? id;
  return name.charAt(0).toUpperCase() + name.slice(1).replace(/-/g, " ");
};
const firstPreset = (d: UIDesign) => Object.keys(d.presets)[0];

export function resolve(t: Target): { Component: ComponentType<any>; props: Record<string, unknown>; at?: string } | null {
  const u = ui.get(t.id);
  if (u) {
    const defaults = Object.fromEntries(Object.entries(u.props).map(([k, c]) => [k, controlDefault(c as never)]));
    const preset = u.presets[t.preset ?? firstPreset(u)] ?? {};
    return { Component: u.component, props: { ...defaults, ...u.base, ...preset, ...t.overrides } };
  }
  const s = screens.get(t.id);
  if (s) {
    const state = (s.states as Record<string, ScreenDesign["states"]["default"]>)[t.state ?? "default"] ?? s.states.default;
    return { Component: s.component, props: { ...s.base, ...state.props }, at: state.at };
  }
  return null;
}

// Drop functions and React elements so the registry survives postMessage.
const plain = <T,>(v: T): T => JSON.parse(JSON.stringify(v, (_, x) => (typeof x === "function" || x?.$$typeof ? undefined : x)));

const reached = new Set<string>();
const featureList = [...features].map(([id, f]) => ({
  id,
  title: f.title,
  intent: f.intent,
  flows: Object.entries(f.flows).map(([title, steps]) => ({
    id: slug(title),
    title,
    steps: steps.map((s) => {
      const screen = idOf.get(s.screen) ?? "?";
      reached.add(`${screen}#${s.state}`);
      return { screen, state: s.state };
    }),
  })),
  unflowed: [] as string[],
}));
for (const f of featureList) {
  for (const [id, s] of screens) {
    if (!id.startsWith(`features/${f.id}/`)) continue;
    for (const state of Object.keys(s.states)) if (!reached.has(`${id}#${state}`)) f.unflowed.push(`${titleOf(id)} · ${state}`);
  }
}

export const registry: Registry = plain({
  features: featureList,
  screens: Object.fromEntries(
    [...screens].map(([id, s]) => [id, {
      id,
      title: s.title ?? titleOf(id),
      intent: s.intent,
      viewports: s.viewports,
      uses: (s.uses ?? []).map((u) => idOf.get(u) ?? "?"),
      states: Object.entries(s.states as Record<string, ScreenDesign["states"]["default"]>).map(([sid, st]) => ({ id: sid, description: st.description, trigger: st.trigger, shows: st.shows })),
      motion: s.motion ?? [],
      content: s.content ?? [],
    }]),
  ),
  ui: [...ui].map(([id, u]) => ({
    id,
    title: u.title ?? titleOf(id),
    intent: u.intent,
    viewports: u.viewports,
    controls: u.props as Record<string, never>,
    presets: u.presets as Record<string, Record<string, unknown>>,
    motion: u.motion ?? [],
    content: u.content ?? [],
  })),
});
