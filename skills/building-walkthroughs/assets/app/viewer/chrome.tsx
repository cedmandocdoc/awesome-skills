import { useEffect, useRef, type CSSProperties, type ReactNode, type RefObject } from "react";
import { actorTitle, areaOrder, journeyWalkthroughs, matchesLenses, matchesQuery, tasksOf, variationsOf, type Group, type LensState, type Model, type Walkthrough } from "./model";

const PATHS = {
  prev: "M10 3 5 8l5 5", next: "m6 3 5 5-5 5", chevron: "m4 6 4 4 4-4",
  minus: "M3.5 8h9", plus: "M8 3.5v9M3.5 8h9", fit: "M3 6V3h3m4 0h3v3m0 4v3h-3m-4 0H3v-3",
  play: "M5 3.5v9l7-4.5z", close: "m4 4 8 8m0-8-8 8", theme: "M8 2a6 6 0 1 0 0 12A6 6 0 0 0 8 2v12",
  expand: "M9.5 3H13v3.5M6.5 13H3V9.5M13 3 9 7M3 13l4-4", shrink: "M13 7H9V3M3 9h4v4M9 7l4-4M7 9l-4 4",
  menu: "M2.5 4.5h11M2.5 8h11M2.5 11.5h11", info: "M8 7v4M8 5h0M8 14A6 6 0 1 0 8 2a6 6 0 0 0 0 12", run: "M3 4l3 3-3 3M8 11h5",
  warn: "M8 2.5 14 13H2zM8 6.5v3M8 11.5h0",
};
export type IconName = keyof typeof PATHS;
export const Icon = ({ name }: { name: IconName }) => (
  <svg viewBox="0 0 16 16" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
    <path d={PATHS[name]} />
  </svg>
);

export function Seg<T extends string>({ value, options, onChange, label }: {
  value: T; options: [T, string][]; onChange: (v: T) => void; label: string;
}) {
  return (
    <div className="wt-seg" role="radiogroup" aria-label={label}>
      {options.map(([v, text]) => (
        <button key={v || "all"} type="button" role="radio" aria-checked={v === value} onClick={() => onChange(v)}>{text}</button>
      ))}
    </div>
  );
}

/** What the right sidebar shows. `group` is the active journey's or area's overview. */
export type Selection = { kind: "w"; id: string } | { kind: "group" } | { kind: "about" } | { kind: "run" } | null;
export type NavMode = "journeys" | "areas";
/** Navigator key of a group: `journey:<id>` or `area:<id>`. */
export const groupKey = (g: Group) => `${g.kind}:${g.id}`;

function Row({ model, w, num, selected, lenses, sub, onSelect }: {
  model: Model; w: Walkthrough; num?: number; selected?: string; lenses: LensState; sub?: boolean; onSelect: (id: string) => void;
}) {
  const ref = useRef<HTMLButtonElement>(null);
  const current = w.id === selected;
  useEffect(() => { if (current) ref.current?.scrollIntoView({ block: "nearest" }); }, [current]);
  return (
    <button ref={ref} type="button" className={`wt-row${sub ? " wt-sub" : ""}${matchesLenses(model, w, lenses) ? "" : " is-dim"}`} aria-current={current} onClick={() => onSelect(w.id)}>
      {num ? <b className="wt-step-badge small">{num}</b> : <i className="wt-dot" aria-hidden />}
      <span>{w.title}</span>
      <small>{w.steps.length}</small>
    </button>
  );
}

/** One collapsible group, the same in both modes: the header selects the group, the children open walkthroughs. */
function NavGroup({ title, tag, meta, count, open, active, onHead, children }: {
  title: string; tag?: string; meta?: string; count: number; open: boolean; active: boolean; onHead: () => void; children: ReactNode;
}) {
  return (
    <div className="wt-navgroup" role="group" aria-label={title}>
      <button type="button" className="wt-row wt-group-row" aria-expanded={open} aria-current={active} onClick={onHead}>
        <span className={`wt-chev${open ? "" : " is-closed"}`}><Icon name="chevron" /></span>
        <span>
          <span className="wt-row-title">{title}{tag && <em className="wt-tag wt-tag-start">{tag}</em>}</span>
          {meta && <small>{meta}</small>}
        </span>
        <small>{count}</small>
      </button>
      {open && <div className="wt-group-kids">{children}</div>}
    </div>
  );
}

/** Left sidebar: search, the Journeys | Areas switch, one group list, then About and Run locally. */
export function Navigator({ model, mode, setMode, group, expanded, selection, lenses, query, setQuery, searchRef, collapsed, setCollapsed, narrow, onClose, onGroup, onChild, onSelect, onPage }: {
  model: Model; mode: NavMode; setMode: (m: NavMode) => void; group: Group | null; expanded: string | null; selection: Selection;
  lenses: LensState; query: string; setQuery: (q: string) => void; searchRef: RefObject<HTMLInputElement | null>;
  collapsed: boolean; setCollapsed: (c: boolean) => void; narrow: boolean; onClose: () => void;
  onGroup: (g: Group) => void; onChild: (g: Group, id: string) => void; onSelect: (id: string) => void; onPage: (p: "about" | "run") => void;
}) {
  const selected = selection?.kind === "w" ? selection.id : undefined;
  const q = query.trim();
  const rowProps = { model, selected, lenses };
  const props = (g: Group) => ({ open: expanded === groupKey(g), active: !!group && groupKey(group) === groupKey(g), onHead: () => onGroup(g) });

  return (
    <section className={`wt-nav wt-glass${collapsed && !narrow ? " is-collapsed" : ""}`} aria-label="Navigator">
      <header className="wt-panel-head">
        <h2>{model.app}</h2>
        {narrow
          ? <button type="button" className="wt-icon" aria-label="Close navigator" onClick={onClose}><Icon name="close" /></button>
          : <button type="button" className="wt-icon" aria-label={collapsed ? "Expand navigator" : "Collapse navigator"} aria-expanded={!collapsed} onClick={() => setCollapsed(!collapsed)}>
              <span className={`wt-chev${collapsed ? " is-closed" : ""}`}><Icon name="chevron" /></span>
            </button>}
      </header>
      {(!collapsed || narrow) && <>
        <div className="wt-nav-search">
          <input ref={searchRef} className="wt-search" type="search" placeholder="Search walkthroughs" aria-label="Search walkthroughs" aria-keyshortcuts="/"
            value={query} onChange={(e) => setQuery(e.target.value)} />
          <kbd aria-hidden>/</kbd>
        </div>
        {!q && <div className="wt-nav-mode"><Seg label="Group by" value={mode} onChange={setMode} options={[["journeys", "Journeys"], ["areas", "Areas"]]} /></div>}
        <div className="wt-nav-body">
          {q ? (
            <div key="search" className="wt-pane">
              {model.areas.map((a) => {
                const hits = areaOrder(model, a.id).filter((w) => matchesQuery(w, q));
                return hits.length > 0 && (
                  <div key={a.id}>
                    <h3>{a.title}</h3>
                    {hits.map((w) => <Row key={w.id} w={w} {...rowProps} onSelect={onSelect} />)}
                  </div>
                );
              })}
              {![...model.walkthroughs.values()].some((w) => matchesQuery(w, q)) && <p className="wt-empty">No walkthrough matches “{q}”.</p>}
            </div>
          ) : mode === "journeys" ? (
            <div key="journeys" className="wt-pane">
              {model.journeys.map((j, i) => {
                const g: Group = { kind: "journey", id: j.id };
                return (
                  <NavGroup key={j.id} title={j.title} tag={i === 0 ? "Start here" : undefined} meta={j.actors.map((a) => actorTitle(model, a)).join(", ")}
                    count={j.walkthroughs.length} {...props(g)}>
                    {journeyWalkthroughs(model, j).map((w, n) => <Row key={w.id} w={w} num={n + 1} {...rowProps} onSelect={(id) => onChild(g, id)} />)}
                  </NavGroup>
                );
              })}
            </div>
          ) : (
            <div key="areas" className="wt-pane">
              {model.areas.map((a) => {
                const g: Group = { kind: "area", id: a.id };
                const tasks = tasksOf(model, a.id);
                return (
                  <NavGroup key={a.id} title={a.title} count={tasks.length} {...props(g)}>
                    {tasks.map((t) => (
                      <div key={t.id}>
                        <Row w={t} {...rowProps} onSelect={(id) => onChild(g, id)} />
                        {variationsOf(model, t.id).map((v) => <Row key={v.id} w={v} sub {...rowProps} onSelect={(id) => onChild(g, id)} />)}
                      </div>
                    ))}
                    {!tasks.length && <p className="wt-empty">No walkthroughs in this area yet.</p>}
                  </NavGroup>
                );
              })}
            </div>
          )}
        </div>
        <footer className="wt-nav-foot">
          <button type="button" className="wt-row" aria-current={selection?.kind === "about"} onClick={() => onPage("about")}><Icon name="info" /><span>About {model.app}</span></button>
          <button type="button" className="wt-row" aria-current={selection?.kind === "run"} onClick={() => onPage("run")}><Icon name="run" /><span>Run locally</span></button>
        </footer>
      </>}
    </section>
  );
}

/** Top pill: one segmented switch per qualifying lens. Renders nothing when no lens qualifies. */
export function LensBar({ model, lenses, setLens }: { model: Model; lenses: LensState; setLens: (id: string, value: string) => void }) {
  if (!model.lenses.length) return null;
  return (
    <div className="wt-pill wt-glass" role="group" aria-label="Lenses">
      {model.lenses.map((l, i) => (
        <div key={l.id} className="wt-lens">
          {i > 0 && <span className="wt-sep" />}
          <span className="wt-pill-label">{l.title}</span>
          <Seg label={l.title} value={lenses[l.id] ?? ""} onChange={(v) => setLens(l.id, v)}
            options={[["", "All"], ...l.values.map((v): [string, string] => [v.id, v.title])]} />
        </div>
      ))}
    </div>
  );
}

export function Dock({ children, style }: { children: ReactNode; style?: CSSProperties }) {
  return <div className="wt-dock wt-glass" role="toolbar" aria-label="Map tools" style={style}>{children}</div>;
}

export function Issues({ issues, onClose }: { issues: string[]; onClose: () => void }) {
  return (
    <section className="wt-issues wt-glass" aria-label="Issues">
      <header className="wt-panel-head">
        <h2>{issues.length} issue{issues.length > 1 ? "s" : ""}</h2>
        <button type="button" className="wt-icon" aria-label="Close issues" onClick={onClose}><Icon name="close" /></button>
      </header>
      <ul>{issues.map((i) => <li key={i}>{i}</li>)}</ul>
      <p className="wt-note">Fix these, then run <code>npm run check</code>.</p>
    </section>
  );
}
