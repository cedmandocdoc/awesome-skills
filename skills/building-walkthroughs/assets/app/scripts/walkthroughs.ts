// `check`: validate the walkthroughs. `index`: regenerate the journeys, walkthroughs, and coverage blocks in index.md.
import { readdirSync, readFileSync, writeFileSync } from "node:fs";
import { join } from "node:path";
import { BASELINE, actorTitle, areaOrder, buildModel, coverage, type Model } from "../viewer/model";

const root = join(import.meta.dirname, "..");
const files = Object.fromEntries(
  readdirSync(root).filter((f) => f.endsWith(".md")).map((f) => [f, readFileSync(join(root, f), "utf8")]),
);
const model = buildModel(files);

const cell = (s: string) => s.replace(/\|/g, "\\|").replace(/\r?\n/g, " ");
const link = (m: Model, id: string) => `[${cell(m.walkthroughs.get(id)?.title ?? id)}](${id}.md)`;
const actors = (m: Model, ids: string[]) => ids.map((a) => cell(actorTitle(m, a))).join(", ");

function journeys(m: Model): string {
  return m.journeys.map((j, i) => {
    const path = j.walkthroughs.map((id, n) => `${n + 1}. ${link(m, id)}`).join(" → ");
    return `**${cell(j.title)}**${i === 0 ? " (start here)" : ""} — ${actors(m, j.actors)}: ${cell(j.goal)}<br>${path}`;
  }).join("\n\n");
}

function list(m: Model): string {
  const from = (s: string) =>
    s.startsWith(BASELINE) ? `Baseline: ${cell(m.baselines.find((b) => BASELINE + b.id === s)?.title ?? s)}` : link(m, s);
  const inJourneys = (id: string) => m.journeys.filter((j) => j.walkthroughs.includes(id)).map((j) => cell(j.title)).join(", ");
  const rows = m.areas.flatMap((a) =>
    areaOrder(m, a.id).map((w) =>
      `| ${link(m, w.id)} | ${cell(a.title)} | ${w.variationOf ? `variation of ${link(m, w.variationOf)}` : "task"} | ${actors(m, w.actors)} | ${from(w.startsFrom)} | ${w.steps.length} | ${inJourneys(w.id)} |`),
  );
  return ["| Walkthrough | Area | Kind | Actors | Starts from | Steps | Journeys |", "| --- | --- | --- | --- | --- | --- | --- |", ...rows].join("\n");
}

function coverageTable(m: Model): string {
  const by = coverage(m);
  const covered = m.surfaces.filter((s) => by.get(s.id)?.length).length;
  const area = (id: string) => cell(m.areas.find((a) => a.id === id)?.title ?? id);
  const rows = m.areas.flatMap((a) => m.surfaces.filter((s) => s.area === a.id)).concat(m.surfaces.filter((s) => !m.areas.some((a) => a.id === s.area)))
    .map((s) => `| \`${cell(s.id)}\` ${cell(s.title)} | ${area(s.area)} | ${(by.get(s.id) ?? []).map((id) => link(m, id)).join(", ") || (s.gap ? `Gap — ${cell(s.gap)}` : "**Not covered**")} |`);
  return [`**Covered ${covered} of ${m.surfaces.length} surfaces.**`, "", "| Surface | Area | Covered by |", "| --- | --- | --- |", ...rows].join("\n");
}

function replace(src: string, name: string, content: string): string {
  const start = `<!-- walkthroughs:${name}:start -->`, end = `<!-- walkthroughs:${name}:end -->`;
  const re = new RegExp(`${start}[\\s\\S]*?${end}`);
  if (!re.test(src)) throw new Error(`index.md is missing the ${start} … ${end} block`);
  return src.replace(re, () => `${start}\n${content}\n${end}`);
}

const command = process.argv[2];
if (command === "check") {
  for (const issue of model.issues) console.error(`✗ ${issue}`);
  if (model.issues.length) {
    console.error(`\n${model.issues.length} issue${model.issues.length > 1 ? "s" : ""} — fix them and run npm run check again.`);
    process.exit(1);
  }
  const all = [...model.walkthroughs.values()];
  const variations = all.filter((w) => w.variationOf).length;
  const gaps = model.surfaces.filter((s) => s.gap).length;
  const lenses = model.lenses.map((l) => l.title).join(", ") || "none (no top bar)";
  console.log(`✓ ${all.length} walkthroughs (${variations} variations) across ${model.areas.length} areas, ${model.journeys.length} journeys, ${model.actors.length} actors`);
  console.log(`✓ coverage ${model.surfaces.length - gaps}/${model.surfaces.length} surfaces, ${gaps} gap${gaps === 1 ? "" : "s"}; lenses: ${lenses}`);
} else if (command === "index") {
  const path = join(root, "index.md");
  let src = readFileSync(path, "utf8");
  src = replace(src, "journeys", journeys(model));
  src = replace(src, "list", list(model));
  src = replace(src, "coverage", coverageTable(model));
  writeFileSync(path, src);
  console.log("✓ index.md journeys, walkthroughs, and coverage regenerated");
  for (const issue of model.issues) console.error(`✗ ${issue}`);
} else {
  console.error("usage: walkthroughs.ts check | index");
  process.exit(2);
}
