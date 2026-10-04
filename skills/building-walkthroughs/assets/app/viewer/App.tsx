import { useEffect, useMemo, useState } from "react";
import { buildModel, layout, matches, type Facets } from "./model";
import { MetroMap } from "./MetroMap";
import { Panel } from "./Panel";

// Every Markdown file in the root; retired/ and node_modules are outside the glob.
const sources = import.meta.glob<string>("/*.md", { query: "?raw", import: "default", eager: true });
const files = Object.fromEntries(Object.entries(sources).map(([p, s]) => [p.slice(1), s]));

export type Selection = { kind: "overview" } | { kind: "line"; id: string } | { kind: "station"; id: string } | { kind: "about" };

const readHash = (): Selection => {
  const [kind, id] = decodeURIComponent(location.hash.slice(2)).split("/");
  if ((kind === "line" || kind === "station") && id) return { kind, id };
  return kind === "about" ? { kind } : { kind: "overview" };
};

export function App() {
  const model = useMemo(() => buildModel(files), []);
  const map = useMemo(() => layout(model), [model]);
  const [sel, setSel] = useState<Selection>(readHash);
  const [query, setQuery] = useState("");
  const [active, setActive] = useState<Facets>({});
  const [issuesOpen, setIssuesOpen] = useState(false);
  const [theme, setTheme] = useState<"light" | "dark" | null>(null);

  useEffect(() => {
    const on = () => setSel(readHash());
    addEventListener("hashchange", on);
    return () => removeEventListener("hashchange", on);
  }, []);
  useEffect(() => {
    const next = sel.kind === "overview" ? "" : `#/${sel.kind}${"id" in sel ? `/${sel.id}` : ""}`;
    if (location.hash !== next) history.replaceState(null, "", next || location.pathname);
  }, [sel]);
  useEffect(() => {
    if (theme) document.documentElement.dataset.theme = theme;
  }, [theme]);
  useEffect(() => {
    const on = (e: KeyboardEvent) => {
      if (e.key === "Escape") setSel((s) => (s.kind === "station" ? { kind: "line", id: model.walkthroughs.get(s.id)?.line ?? "" } : { kind: "overview" }));
    };
    addEventListener("keydown", on);
    return () => removeEventListener("keydown", on);
  }, [model]);

  const facetKeys = useMemo(() => {
    const keys = new Map<string, Set<string>>();
    for (const w of model.walkthroughs.values()) for (const [k, vs] of Object.entries(w.facets)) for (const v of vs) {
      if (!keys.has(k)) keys.set(k, new Set());
      keys.get(k)!.add(v);
    }
    return [...keys].map(([k, vs]) => [k, [...vs].sort()] as const);
  }, [model]);

  const visible = useMemo(() => new Set([...model.walkthroughs.values()].filter((w) => matches(w, query, active)).map((w) => w.id)), [model, query, active]);
  const filtering = query.trim() !== "" || Object.values(active).some((v) => v.length);
  const toggle = (k: string, v: string) => setActive((a) => {
    const cur = a[k] ?? [];
    return { ...a, [k]: cur.includes(v) ? cur.filter((x) => x !== v) : [...cur, v] };
  });

  return (
    <div className="wv">
      <MetroMap model={model} map={map} sel={sel} setSel={setSel} visible={filtering ? visible : null} />
      <header className="wv-bar wv-glass">
        <button className="wv-app" onClick={() => setSel({ kind: "overview" })} title="Overview">{model.app}</button>
        <button onClick={() => setSel({ kind: "about" })}>Start here</button>
        <input type="search" placeholder="Search walkthroughs, cases, screens…" value={query} onChange={(e) => setQuery(e.target.value)} />
        {model.issues.length > 0 && (
          <button className="wv-warn" onClick={() => setIssuesOpen((o) => !o)}>{model.issues.length} issue{model.issues.length > 1 ? "s" : ""}</button>
        )}
        <button onClick={() => setTheme(document.documentElement.dataset.theme === "dark" || (!document.documentElement.dataset.theme && matchMedia("(prefers-color-scheme: dark)").matches) ? "light" : "dark")} title="Light or dark">◐</button>
      </header>
      {(facetKeys.length > 0 || model.lines.length > 0) && (
        <nav className="wv-chips wv-glass">
          {model.lines.map((l) => (
            <button key={l.id} className={sel.kind === "line" && sel.id === l.id ? "on" : ""} onClick={() => setSel({ kind: "line", id: l.id })}>
              <i style={{ background: l.color }} />{l.title}
            </button>
          ))}
          {facetKeys.map(([k, vs]) => (
            <span key={k} className="wv-facet">
              <b>{k}</b>
              {vs.map((v) => <button key={v} className={active[k]?.includes(v) ? "on" : ""} onClick={() => toggle(k, v)}>{v}</button>)}
            </span>
          ))}
        </nav>
      )}
      {filtering && (
        <ul className="wv-results wv-glass">
          {[...visible].map((id) => <li key={id}><button onClick={() => setSel({ kind: "station", id })}>{model.walkthroughs.get(id)!.title}</button></li>)}
          {!visible.size && <li className="wv-muted">No walkthrough matches</li>}
        </ul>
      )}
      {issuesOpen && (
        <ul className="wv-issues wv-glass">{model.issues.map((i) => <li key={i}>{i}</li>)}<li className="wv-muted">Run <code>npm run check</code> after fixing.</li></ul>
      )}
      {(sel.kind === "station" || sel.kind === "about") && <Panel model={model} sel={sel} setSel={setSel} />}
    </div>
  );
}
