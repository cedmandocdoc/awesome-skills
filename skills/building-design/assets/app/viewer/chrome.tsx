import { useEffect, useState, type CSSProperties, type ReactNode } from "react";
import { controlDefault, type FeatureMeta, type FlowMeta, type Registry, type UIMeta } from "./meta";
import type { Control, Viewport } from "../system/define";

const PATHS = {
  prev: "M10 3 5 8l5 5", next: "m6 3 5 5-5 5", chevron: "m4 6 4 4 4-4",
  replay: "M3 8a5 5 0 1 0 1.5-3.5M3 2.5V5h2.5", theme: "M8 2a6 6 0 1 0 0 12A6 6 0 0 0 8 2v12",
  minus: "M3.5 8h9", plus: "M8 3.5v9M3.5 8h9", fit: "M3 6V3h3m4 0h3v3m0 4v3h-3m-4 0H3v-3",
};
export const Icon = ({ name }: { name: keyof typeof PATHS }) => (
  <svg viewBox="0 0 16 16" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
    <path d={PATHS[name]} />
  </svg>
);

export function Seg<T extends string>({ value, options, onChange, label }: {
  value: T; options: [T, string][]; onChange: (v: T) => void; label: string;
}) {
  return (
    <div className="dv-seg" role="radiogroup" aria-label={label}>
      {options.map(([v, text]) => (
        <button key={v} type="button" role="radio" aria-checked={v === value} onClick={() => onChange(v)}>{text}</button>
      ))}
    </div>
  );
}

export function Select({ value, options, onChange, label }: {
  value: string; options: [string, string][]; onChange: (v: string) => void; label: string;
}) {
  return (
    <span className="dv-select">
      <select value={value} aria-label={label} onChange={(e) => onChange(e.target.value)}>
        {options.map(([v, text]) => <option key={v} value={v}>{text}</option>)}
      </select>
    </span>
  );
}

// Fixed glass sidebar; collapses to its header.
function Panel({ side, label, title, collapsed, setCollapsed, children }: {
  side: "left" | "right"; label: string; title: ReactNode; collapsed: boolean; setCollapsed: (c: boolean) => void; children: ReactNode;
}) {
  return (
    <section className={`dv-panel dv-${side} dv-glass${collapsed ? " is-collapsed" : ""}`} aria-label={label}>
      <header className="dv-panel-head">
        <h2>{title}</h2>
        <button type="button" className="dv-icon" aria-label={`${collapsed ? "Expand" : "Collapse"} ${label.toLowerCase()}`} aria-expanded={!collapsed} onClick={() => setCollapsed(!collapsed)}>
          <span className={`dv-chev${collapsed ? " is-closed" : ""}`}><Icon name="chevron" /></span>
        </button>
      </header>
      {!collapsed && children}
    </section>
  );
}

// One collapsible group: the header opens the group's first view, or folds it when it is already current.
function NavGroup({ title, count, open, active, onHead, children }: {
  title: string; count: number; open: boolean; active: boolean; onHead: () => void; children: ReactNode;
}) {
  return (
    <div className="dv-navgroup" role="group" aria-label={title}>
      <button type="button" className="dv-row dv-group-row" aria-expanded={open} aria-current={active} onClick={onHead}>
        <span className={`dv-chev${open ? "" : " is-closed"}`}><Icon name="chevron" /></span>
        <span>{title}</span><small>{count}</small>
      </button>
      {open && <div className="dv-group-kids">{children}</div>}
    </div>
  );
}

type Tab = "features" | "ui";

export function Navigator({ reg, feature, flow, ui, preset, collapsed, setCollapsed, openFlow, openUI, openPreset }: {
  reg: Registry; feature?: FeatureMeta; flow?: FlowMeta; ui?: UIMeta; preset: string; collapsed: boolean; setCollapsed: (c: boolean) => void;
  openFlow: (f: FeatureMeta, flow: FlowMeta) => void; openUI: (u: UIMeta) => void; openPreset: (u: UIMeta, p: string) => void;
}) {
  const [tab, setTab] = useState<Tab>(ui ? "ui" : "features");
  const [expanded, setExpanded] = useState<string | null>(null);
  const [query, setQuery] = useState("");
  useEffect(() => { if (feature) { setTab("features"); setExpanded(`f:${feature.id}`); } }, [feature?.id]);
  useEffect(() => { if (ui) { setTab("ui"); setExpanded(`u:${ui.id}`); } }, [ui?.id]);

  const q = query.trim().toLowerCase();
  const match = (s: string) => s.toLowerCase().includes(q);
  const group = (k: string, current: boolean, open: () => void) => ({
    open: !!q || expanded === k,
    active: current,
    onHead: () => { if (!current) { open(); setExpanded(k); } else setExpanded(expanded === k ? null : k); },
  });

  const features = reg.features
    .map((f) => ({ f, flows: match(f.title) ? f.flows : f.flows.filter((x) => match(x.title)) }))
    .filter(({ flows, f }) => flows.length || match(f.title));
  const blocks = reg.ui.filter((u) => match(u.title) || Object.keys(u.presets).some(match));

  return (
    <Panel side="left" label="Navigator" title="Design" collapsed={collapsed} setCollapsed={setCollapsed}>
      <div className="dv-nav-tools">
        <input className="dv-search" type="search" placeholder="Search" aria-label="Search" value={query} onChange={(e) => setQuery(e.target.value)} />
        <Seg label="Section" value={tab} onChange={setTab} options={[["features", "Features"], ["ui", "UI"]]} />
      </div>
      <div className="dv-panel-body">
        {tab === "features" ? <>
          {features.map(({ f, flows }) => (
            <NavGroup key={f.id} title={f.title} count={f.flows.length} {...group(`f:${f.id}`, f.id === feature?.id, () => f.flows[0] && openFlow(f, f.flows[0]))}>
              {flows.map((x) => (
                <button key={x.id} type="button" className="dv-row" aria-current={f.id === feature?.id && x.id === flow?.id} onClick={() => openFlow(f, x)}>
                  <span>{x.title}</span><small>{x.steps.length}</small>
                </button>
              ))}
              {f.unflowed.length > 0 && <p className="dv-warn">Not in any flow: {f.unflowed.join(", ")}</p>}
            </NavGroup>
          ))}
          {!features.length && <p className="dv-empty">{q ? "No match." : "No features yet."}</p>}
        </> : <>
          {blocks.map((u) => (
            <NavGroup key={u.id} title={u.title} count={Object.keys(u.presets).length} {...group(`u:${u.id}`, u.id === ui?.id, () => openUI(u))}>
              {Object.keys(u.presets).map((p) => (
                <button key={p} type="button" className="dv-row" aria-current={u.id === ui?.id && p === preset} onClick={() => openPreset(u, p)}>
                  <span>{p}</span>
                </button>
              ))}
            </NavGroup>
          ))}
          {!blocks.length && <p className="dv-empty">{q ? "No match." : "No UI blocks yet."}</p>}
        </>}
      </div>
    </Panel>
  );
}

// Prev, position, next, replay — at the top of the right sidebar in Play.
function Player({ noun, index, count, go, replay }: { noun: string; index: number; count: number; go: (i: number) => void; replay: () => void }) {
  return (
    <div className="dv-player">
      <button type="button" className="dv-icon" aria-label={`Previous ${noun}`} disabled={index === 0} onClick={() => go(index - 1)}><Icon name="prev" /></button>
      <span>{noun === "step" ? "Step" : "Preset"} {index + 1} of {count}</span>
      <button type="button" className="dv-icon" aria-label={`Next ${noun}`} disabled={index === count - 1} onClick={() => go(index + 1)}><Icon name="next" /></button>
      <button type="button" className="dv-icon" aria-label="Replay (R)" title="Replay (R)" onClick={replay}><Icon name="replay" /></button>
    </div>
  );
}

export function FlowInspector({ reg, feature, flow, step, play, go, open, replay, collapsed, setCollapsed }: {
  reg: Registry; feature: FeatureMeta; flow: FlowMeta; step: number; play: boolean;
  go: (i: number) => void; open: (i: number) => void; replay: () => void; collapsed: boolean; setCollapsed: (c: boolean) => void;
}) {
  return (
    <Panel side="right" label="Steps" title={`${feature.title} · ${flow.title}`} collapsed={collapsed} setCollapsed={setCollapsed}>
      {play && <Player noun="step" index={step} count={flow.steps.length} go={go} replay={replay} />}
      <div className="dv-panel-body">
        <p className="dv-note">{feature.intent}</p>
        <ol className="dv-steps">
          {flow.steps.map((s, i) => {
            const screen = reg.screens[s.screen];
            const state = screen?.states.find((x) => x.id === s.state);
            const motion = screen?.motion.filter((m) => m.trigger !== "state" || m.when === s.state) ?? [];
            return (
              <li key={i} aria-current={i === step}>
                <button type="button" onClick={() => open(i)}>
                  <b>{i + 1}</b><span>{screen?.title ?? s.screen} · {s.state}</span>
                </button>
                {i === step && state && (
                  <dl>
                    <dt>View</dt><dd>{state.description}</dd>
                    {state.trigger && <><dt>When</dt><dd>{state.trigger}</dd></>}
                    {state.shows && <><dt>Shows</dt><dd>{state.shows}</dd></>}
                    {motion.length > 0 && <><dt>Motion</dt><dd>{motion.map((m) => m.id).join(", ")}</dd></>}
                  </dl>
                )}
              </li>
            );
          })}
        </ol>
      </div>
    </Panel>
  );
}

function ControlInput({ name, control, value, onChange }: { name: string; control: Control; value: unknown; onChange: (v: unknown) => void }) {
  if (Array.isArray(control)) {
    return control.length <= 4
      ? <Seg label={name} value={String(value)} options={control.map((o) => [o, o])} onChange={onChange} />
      : <Select label={name} value={String(value)} options={control.map((o) => [o, o])} onChange={onChange} />;
  }
  if (typeof control === "boolean") {
    return <button type="button" role="switch" aria-label={name} aria-checked={!!value} className="dv-switch" onClick={() => onChange(!value)} />;
  }
  if (typeof control === "number") {
    return <input className="dv-input" type="number" aria-label={name} value={Number(value)} onChange={(e) => onChange(Number(e.target.value))} />;
  }
  return <input className="dv-input" type="text" aria-label={name} value={String(value ?? "")} onChange={(e) => onChange(e.target.value)} />;
}

export function UIInspector({ ui, preset, overrides, play, go, open, setOverrides, replay, collapsed, setCollapsed }: {
  ui: UIMeta; preset: string; overrides: Record<string, unknown>; play: boolean;
  go: (i: number) => void; open: (i: number) => void; setOverrides: (o: Record<string, unknown>) => void; replay: () => void;
  collapsed: boolean; setCollapsed: (c: boolean) => void;
}) {
  const presets = Object.keys(ui.presets);
  const base = (k: string) => (ui.presets[preset]?.[k] ?? controlDefault(ui.controls[k]));
  const modified = Object.keys(overrides).some((k) => overrides[k] !== base(k));
  return (
    <Panel side="right" label="Props" title={ui.title} collapsed={collapsed} setCollapsed={setCollapsed}>
      {play && <Player noun="preset" index={presets.indexOf(preset)} count={presets.length} go={go} replay={replay} />}
      <div className="dv-panel-body">
        <p className="dv-note">{ui.intent}</p>
        <h3>Presets</h3>
        <div className="dv-chips">
          {presets.map((p, i) => (
            <button key={p} type="button" aria-pressed={p === preset && !modified} onClick={() => open(i)}>{p}</button>
          ))}
        </div>
        {play && <>
          <h3>Props {modified && <button type="button" className="dv-link" onClick={() => setOverrides({})}>modified · reset</button>}</h3>
          <div className="dv-controls">
            {Object.entries(ui.controls).map(([k, c]) => (
              <div key={k} className="dv-control">
                <span>{k}</span>
                <ControlInput name={k} control={c} value={k in overrides ? overrides[k] : base(k)} onChange={(v) => setOverrides({ ...overrides, [k]: v })} />
              </div>
            ))}
          </div>
        </>}
      </div>
    </Panel>
  );
}

export function ViewportBar({ value, options, onChange, style }: { value: Viewport; options: Viewport[]; onChange: (v: Viewport) => void; style: CSSProperties }) {
  const label: Record<Viewport, string> = { desktop: "Desktop", tablet: "Tablet", mobile: "Mobile" };
  return (
    <div className="dv-top dv-glass" style={style}>
      <Seg label="Viewport" value={value} onChange={onChange} options={options.map((v) => [v, label[v]])} />
    </div>
  );
}

export function Dock({ children, style }: { children: ReactNode; style: CSSProperties }) {
  return <div className="dv-dock dv-glass" role="toolbar" aria-label="View tools" style={style}>{children}</div>;
}
