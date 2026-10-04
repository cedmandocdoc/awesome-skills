// `check`: validate the walkthrough graph. `index`: regenerate the map and list blocks in index.md.
import { readdirSync, readFileSync, writeFileSync } from "node:fs";
import { join } from "node:path";
import { BASELINE, branchesOf, buildModel, stationsOf, type Model } from "../viewer/model";

const root = join(import.meta.dirname, "..");
const files = Object.fromEntries(
  readdirSync(root).filter((f) => f.endsWith(".md")).map((f) => [f, readFileSync(join(root, f), "utf8")]),
);
const model = buildModel(files);

const nodeId = (id: string) => (id.startsWith(BASELINE) ? "b_" : "w_") + id.replace(BASELINE, "").replace(/[^A-Za-z0-9]/g, "_");
const label = (s: string) => s.replace(/"/g, "'");

function map(m: Model): string {
  const out = ["```mermaid", "flowchart LR"];
  for (const b of m.baselines) out.push(`  ${nodeId(BASELINE + b.id)}(["${label(b.title)}"])`);
  for (const l of m.lines) {
    const cls = `line_${l.id.replace(/[^A-Za-z0-9]/g, "_")}`;
    out.push(`  classDef ${cls} stroke:${l.color},stroke-width:3px`);
    for (const w of stationsOf(m, l.id)) {
      out.push(`  ${nodeId(w.id)}["${label(w.title)}"]:::${cls}`);
      out.push(`  ${nodeId(w.startsFrom)} --> ${nodeId(w.id)}`);
      for (const b of branchesOf(m, w.id)) {
        out.push(`  ${nodeId(b.id)}("${label(b.title)}"):::${cls}`);
        out.push(`  ${nodeId(w.id)} -.-> ${nodeId(b.id)}`);
      }
    }
  }
  out.push("```");
  return out.join("\n");
}

function table(m: Model): string {
  const rows: string[] = [];
  const from = (s: string) => (s.startsWith(BASELINE) ? `Baseline: ${m.baselines.find((b) => BASELINE + b.id === s)?.title ?? s}` : `[${m.walkthroughs.get(s)?.title ?? s}](${s}.md)`);
  const row = (id: string, line: string, kind: string) => {
    const w = m.walkthroughs.get(id)!;
    rows.push(`| [${w.title}](${w.id}.md) | ${line} | ${kind} | ${from(w.startsFrom)} | ${w.minutes ?? ""} |`);
  };
  for (const l of m.lines) for (const w of stationsOf(m, l.id)) row(w.id, l.title, "core");
  for (const l of m.lines) for (const w of stationsOf(m, l.id)) for (const b of branchesOf(m, w.id)) row(b.id, l.title, "branch");
  return ["| Walkthrough | Line | Kind | Starts from | Minutes |", "| --- | --- | --- | --- | --- |", ...rows].join("\n");
}

function replace(src: string, name: string, content: string): string {
  const start = `<!-- walkthroughs:${name}:start -->`, end = `<!-- walkthroughs:${name}:end -->`;
  const re = new RegExp(`${start}[\\s\\S]*?${end}`);
  if (!re.test(src)) throw new Error(`index.md is missing the ${start} … ${end} block`);
  return src.replace(re, `${start}\n${content}\n${end}`);
}

const command = process.argv[2];
if (command === "check") {
  for (const issue of model.issues) console.error(`✗ ${issue}`);
  if (model.issues.length) process.exit(1);
  console.log(`✓ ${model.walkthroughs.size} walkthroughs on ${model.lines.length} lines`);
} else if (command === "index") {
  const path = join(root, "index.md");
  writeFileSync(path, replace(replace(readFileSync(path, "utf8"), "map", map(model)), "list", table(model)));
  console.log("✓ index.md map and list regenerated");
  for (const issue of model.issues) console.error(`✗ ${issue}`);
} else {
  console.error("usage: walkthroughs.ts check | index");
  process.exit(2);
}
