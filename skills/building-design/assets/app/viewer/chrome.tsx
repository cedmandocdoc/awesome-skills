import { useEffect, useState, type PointerEvent as RPointerEvent, type ReactNode } from "react";
import { controlDefault, type FeatureMeta, type FlowMeta, type Registry, type UIMeta, type Vp } from "./meta";
import type { Control } from "../system/define";

const store = {
  get<T>(k: string, fallback: T): T { try { const v = localStorage.getItem(`dv:${k}`); return v ? JSON.parse(v) : fallback; } catch { return fallback; } },
  set(k: string, v: unknown) { try { localStorage.setItem(`dv:${k}`, JSON.stringify(v)); } catch { /* storage unavailable */ } },
};

const PATHS = {
  back: "M10 3 5 8l5 5", prev: "M10 3 5 8l5 5", next: "m6 3 5 5-5 5", chevron: "m4 6 4 4 4-4",
  replay: "M3 8a5 5 0 1 0 1.5-3.5M3 2.5V5h2.5", info: "M8 7v4M8 5h0M8 14A6 6 0 1 0 8 2a6 6 0 0 0 0 12",
  props: "M3 5h6m3 0h1M3 11h1m3 0h6M9 3.5v3M4 9.5v3", minus: "M3.5 8h9", plus: "M8 3.5v9M3.5 8h9", fit: "M3 6V3h3m4 0h3v3m0 4v3h-3m-4 0H3v-3",
};
export const Icon = ({ name }: { name: keyof typeof PATHS }) => (
  <svg viewBox="0 0 16 16" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
    <path d={PATHS[name]} />
  </svg>
);

export function Seg<T extends string>({ value, options, onChange, label }: {
  value: T; options: [T, string, boolean?][]; onChange: (v: T) => void; label: string;
}) {
  return (
    <div className="dv-seg" role="radiogroup" aria-label={label}>
      {options.map(([v, text, disabled]) => (
        <button key={v} type="button" role="radio" aria-checked={v === value} disabled={disabled} onClick={() => onChange(v)}>{text}</button>
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

// Floating glass panel: drag by its header, collapse to the header, position remembered per viewer.
function Panel({ name, title, anchor, onBack, onClose, children }: {
  name: string; title: ReactNode; anchor: "left" | "right"; onBack?: () => void; onClose?: () => void; children: ReactNode;
}) {
  const width = 272;
  const [pos, setPos] = useState(() => store.get(`${name}:pos`, { x: anchor === "left" ? 16 : window.innerWidth - width - 16, y: anchor === "left" ? 16 : 68 }));
  const [collapsed, setCollapsed] = useState(() => store.get(`${name}:collapsed`, false));
  useEffect(() => store.set(`${name}:pos`, pos), [name, pos]);
  useEffect(() => store.set(`${name}:collapsed`, collapsed), [name, collapsed]);

  const x = Math.min(Math.max(0, pos.x), window.innerWidth - width);
  const y = Math.min(Math.max(0, pos.y), window.innerHeight - 48);
  const drag = (e: RPointerEvent<HTMLElement>) => {
    if ((e.target as HTMLElement).closest("button")) return;
    const start = { x: e.clientX - x, y: e.clientY - y };
    const el = e.currentTarget;
    el.setPointerCapture(e.pointerId);
    const move = (m: PointerEvent) => setPos({ x: m.clientX - start.x, y: m.clientY - start.y });
    const up = () => { el.removeEventListener("pointermove", move); el.removeEventListener("pointerup", up); };
    el.addEventListener("pointermove", move);
    el.addEventListener("pointerup", up);
  };

  return (
    <section className="dv-panel dv-glass" style={{ left: x, top: y, width }} aria-label={name}>
      <header className="dv-panel-head" onPointerDown={drag}>
        {onBack && <button type="button" className="dv-icon" aria-label="Back" onClick={onBack}><Icon name="back" /></button>}
        <h2>{title}</h2>
        <button type="button" className="dv-icon" aria-label={collapsed ? "Expand" : "Collapse"} aria-expanded={!collapsed} onClick={() => setCollapsed(!collapsed)}>
          <span style={{ display: "inline-flex", rotate: collapsed ? "-90deg" : "0deg" }}><Icon name="chevron" /></span>
        </button>
        {onClose && <button type="button" className="dv-icon" aria-label="Close" onClick={onClose}>×</button>}
      </header>
      {!collapsed && <div className="dv-panel-body">{children}</div>}
    </section>
  );
}

export function Navigator({ reg, feature, flow, ui, openFlow, openUI }: {
  reg: Registry; feature?: FeatureMeta; flow?: FlowMeta; ui?: UIMeta;
  openFlow: (f: FeatureMeta, flow: FlowMeta) => void; openUI: (u: UIMeta) => void;
}) {
  const [level, setLevel] = useState<string | null>(feature?.id ?? null);
  const [query, setQuery] = useState("");
  useEffect(() => { if (feature) setLevel(feature.id); }, [feature?.id]);
  const shown = reg.features.find((f) => f.id === level);
  const match = (s: string) => s.toLowerCase().includes(query.toLowerCase());

  return (
    <Panel name="navigator" anchor="left" title={shown ? shown.title : "Design"} onBack={shown ? () => setLevel(null) : undefined}>
      {!shown ? (
        <div key="home" className="dv-pane dv-in-back">
          <input className="dv-search" type="search" placeholder="Search" value={query} onChange={(e) => setQuery(e.target.value)} />
          <h3>Features</h3>
          {reg.features.filter((f) => match(f.title)).map((f) => (
            <button key={f.id} type="button" className="dv-row" aria-current={f.id === feature?.id} onClick={() => { setLevel(f.id); if (f.flows[0] && f.id !== feature?.id) openFlow(f, f.flows[0]); }}>
              <span>{f.title}</span><small>{f.flows.length}</small><Icon name="next" />
            </button>
          ))}
          {!reg.features.length && <p className="dv-empty">No features yet.</p>}
          <h3>UI</h3>
          {reg.ui.filter((u) => match(u.title)).map((u) => (
            <button key={u.id} type="button" className="dv-row" aria-current={u.id === ui?.id} onClick={() => openUI(u)}>
              <span>{u.title}</span><small>{Object.keys(u.presets).length}</small>
            </button>
          ))}
          {!reg.ui.length && <p className="dv-empty">No UI blocks yet.</p>}
        </div>
      ) : (
        <div key={shown.id} className="dv-pane dv-in-fwd">
            <p className="dv-note">{shown.intent}</p>
            <h3>Flows</h3>
            {shown.flows.map((x) => (
              <button key={x.id} type="button" className="dv-row" aria-current={shown.id === feature?.id && x.id === flow?.id} onClick={() => openFlow(shown, x)}>
                <span>{x.title}</span><small>{x.steps.length}</small>
              </button>
            ))}
            {shown.unflowed.length > 0 && <p className="dv-warn">Not in any flow: {shown.unflowed.join(", ")}</p>}
        </div>
      )}
    </Panel>
  );
}

export function ViewportPill({ value, options, board, onChange }: { value: Vp; options: Vp[]; board: boolean; onChange: (v: Vp) => void }) {
  const label: Record<Vp, string> = { full: "Full", desktop: "Desktop", tablet: "Tablet", mobile: "Mobile" };
  return (
    <div className="dv-pill dv-glass">
      <Seg label="Viewport" value={value} onChange={onChange} options={options.map((v) => [v, label[v], board && v === "full"])} />
    </div>
  );
}

export function Dock({ children }: { children: ReactNode }) {
  return <div className="dv-dock dv-glass">{children}</div>;
}

export function StepsInspector({ reg, flow, step, jump, onClose }: {
  reg: Registry; flow: FlowMeta; step: number; jump: (i: number) => void; onClose: () => void;
}) {
  return (
    <Panel name="inspector" anchor="right" title={`Steps · ${flow.title}`} onClose={onClose}>
      <ol className="dv-steps">
        {flow.steps.map((s, i) => {
          const screen = reg.screens[s.screen];
          const state = screen?.states.find((x) => x.id === s.state);
          const motion = screen?.motion.filter((m) => m.trigger !== "state" || m.when === s.state) ?? [];
          return (
            <li key={i} aria-current={i === step}>
              <button type="button" onClick={() => jump(i)}>
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

export function PropsInspector({ ui, preset, overrides, setPreset, setOverrides, onClose }: {
  ui: UIMeta; preset: string; overrides: Record<string, unknown>;
  setPreset: (p: string) => void; setOverrides: (o: Record<string, unknown>) => void; onClose: () => void;
}) {
  const base = (k: string) => (ui.presets[preset]?.[k] ?? controlDefault(ui.controls[k]));
  const modified = Object.keys(overrides).some((k) => overrides[k] !== base(k));
  return (
    <Panel name="inspector" anchor="right" title={`Props · ${ui.title}`} onClose={onClose}>
      <p className="dv-note">{ui.intent}</p>
      <h3>Presets</h3>
      <div className="dv-chips">
        {Object.keys(ui.presets).map((p) => (
          <button key={p} type="button" aria-pressed={p === preset && !modified} onClick={() => setPreset(p)}>{p}</button>
        ))}
      </div>
      <h3>Props {modified && <button type="button" className="dv-link" onClick={() => setOverrides({})}>modified · reset</button>}</h3>
      <div className="dv-controls">
        {Object.entries(ui.controls).map(([k, c]) => (
          <div key={k} className="dv-control">
            <span>{k}</span>
            <ControlInput name={k} control={c} value={k in overrides ? overrides[k] : base(k)} onChange={(v) => setOverrides({ ...overrides, [k]: v })} />
          </div>
        ))}
      </div>
    </Panel>
  );
}
