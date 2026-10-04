import { useEffect, useMemo, useRef, type MouseEvent } from "react";
import { marked } from "marked";
import mermaid from "mermaid";
import { BASELINE, branchesOf, routeTo, type Model } from "./model";
import type { Selection } from "./App";

let diagrams = 0;

function Markdown({ source, onLink }: { source: string; onLink: (id: string) => void }) {
  const ref = useRef<HTMLDivElement>(null);
  const html = useMemo(() => marked.parse(source, { async: false }), [source]);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const dark = document.documentElement.dataset.theme === "dark" || (!document.documentElement.dataset.theme && matchMedia("(prefers-color-scheme: dark)").matches);
    mermaid.initialize({ startOnLoad: false, theme: dark ? "dark" : "neutral", securityLevel: "strict" });
    el.querySelectorAll<HTMLElement>("code.language-mermaid").forEach(async (code) => {
      const pre = code.parentElement!;
      try {
        const { svg } = await mermaid.render(`wv-mermaid-${++diagrams}`, code.textContent ?? "");
        const fig = document.createElement("figure");
        fig.className = "wv-diagram";
        fig.innerHTML = svg;
        pre.replaceWith(fig);
      } catch (e) {
        pre.classList.add("wv-diagram-error");
        pre.title = String(e);
      }
    });
  }, [html]);

  // Links between walkthroughs (`send-invoice.md`) open that station.
  const click = (e: MouseEvent) => {
    const a = (e.target as HTMLElement).closest("a");
    const href = a?.getAttribute("href") ?? "";
    const m = /^(?:\.\/)?([\w-]+)\.md(?:#.*)?$/.exec(href);
    if (m) { e.preventDefault(); onLink(m[1]); }
    else if (a && /^https?:/.test(href)) a.target = "_blank";
  };

  return <div ref={ref} className="wv-md" onClick={click} dangerouslySetInnerHTML={{ __html: html }} />;
}

export function Panel({ model, sel, setSel }: { model: Model; sel: Selection; setSel: (s: Selection) => void }) {
  const open = (id: string) => setSel(model.walkthroughs.has(id) ? { kind: "station", id } : { kind: "about" });
  const close = () => setSel({ kind: "overview" });

  if (sel.kind !== "station") {
    return (
      <aside className="wv-panel wv-glass">
        <div className="wv-panel-head"><h1>{model.app}</h1><button onClick={close} aria-label="Close">✕</button></div>
        <div className="wv-panel-body"><Markdown source={model.indexBody} onLink={open} /></div>
      </aside>
    );
  }

  const w = model.walkthroughs.get(sel.id);
  if (!w) return null;
  const line = model.lines.find((l) => l.id === w.line);
  const route = routeTo(model, w.id);
  const baseline = model.baselines.find((b) => BASELINE + b.id === route[0]);
  // Nearest checkpoint before this walkthrough: jump there instead of replaying from the baseline.
  const jump = route.slice(1, -1).reverse().map((id) => model.walkthroughs.get(id)!).find((r) => r.checkpoint);
  const branches = branchesOf(model, w.id);

  return (
    <aside className="wv-panel wv-glass">
      <div className="wv-panel-head">
        <i className="wv-dot" style={{ background: line?.color }} />
        <h1>{w.title}</h1>
        <button onClick={close} aria-label="Close">✕</button>
      </div>
      <div className="wv-panel-body">
        <p className="wv-meta">
          {line?.title} · {w.kind}{w.minutes ? ` · ${w.minutes} min` : ""} · {w.actors.join(", ")}
          {Object.entries(w.facets).map(([k, vs]) => <span key={k} className="wv-tag">{k}: {vs.join(", ")}</span>)}
        </p>

        <section>
          <h2>Get here</h2>
          <ol className="wv-route">
            <li><button onClick={() => setSel({ kind: "about" })}>Baseline: {baseline?.title ?? route[0]}</button>{baseline?.setup && <code>{baseline.setup}</code>}</li>
            {route.slice(1).map((id) => {
              const r = model.walkthroughs.get(id)!;
              return (
                <li key={id} className={id === w.id ? "here" : ""}>
                  <button onClick={() => open(id)}>{r.title}</button>
                  {r.checkpoint && <span className="wv-tag">checkpoint</span>}
                </li>
              );
            })}
          </ol>
          {jump && <p className="wv-jump">Skip ahead: run <code>{jump.checkpoint}</code> to reach the end of <b>{jump.title}</b>.</p>}
        </section>

        <section>
          <h2>Ends with</h2>
          <ul>{w.endsWith.map((f) => <li key={f}>{f}</li>)}</ul>
          {w.checkpoint && <p className="wv-jump">Checkpoint: <code>{w.checkpoint}</code></p>}
        </section>

        {branches.length > 0 && (
          <section>
            <h2>Branches from here</h2>
            <ul>{branches.map((b) => <li key={b.id}><button onClick={() => open(b.id)}>{b.title}</button></li>)}</ul>
          </section>
        )}

        <Markdown source={w.body} onLink={open} />
      </div>
    </aside>
  );
}
