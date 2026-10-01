import { useCallback, useEffect, useState } from "react";
import "./viewer.css";
import { Board, Stage, type BoardItem, type View } from "./canvas";
import { Dock, Icon, Navigator, PropsInspector, Seg, Select, StepsInspector, ViewportPill } from "./chrome";
import type { FeatureMeta, FlowMeta, Registry, Target, UIMeta, Vp } from "./meta";
import type { Viewport } from "../system/define";

type Mode = "board" | "play";
type Sel = { kind: "flow"; feature: string; flow: string; step: number } | { kind: "ui"; ui: string; preset: string };

const ALL: Viewport[] = ["desktop", "tablet", "mobile"];
const hash = Object.fromEntries(new URLSearchParams(location.hash.slice(1)));
const initialSel = (): Sel | null =>
  hash.u ? { kind: "ui", ui: hash.u, preset: hash.preset ?? "" }
  : hash.f ? { kind: "flow", feature: hash.f, flow: hash.flow ?? "", step: Number(hash.step) || 0 }
  : null;

const flipTheme = () => {
  const root = document.documentElement;
  const current = root.dataset.theme ?? (matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light");
  root.dataset.theme = current === "dark" ? "light" : "dark";
};

export function App() {
  const [reg, setReg] = useState<Registry | null>(null);
  const [sel, setSel] = useState<Sel | null>(initialSel);
  const [mode, setMode] = useState<Mode>(hash.mode === "play" ? "play" : "board");
  const [vp, setVp] = useState<Vp>((hash.vp as Vp) || "full");
  const [overrides, setOverrides] = useState<Record<string, unknown>>({});
  const [key, setKey] = useState(0);
  const [chrome, setChrome] = useState(true);
  const [inspector, setInspector] = useState(false);
  const [view, setView] = useState<View>({ x: 0, y: 0, z: 1 });
  const [fitNonce, setFitNonce] = useState(0);

  const feature = sel?.kind === "flow" ? reg?.features.find((f) => f.id === sel.feature) : undefined;
  const flow = sel?.kind === "flow" ? feature?.flows.find((f) => f.id === sel.flow) : undefined;
  const ui = sel?.kind === "ui" ? reg?.ui.find((u) => u.id === sel.ui) : undefined;
  const step = sel?.kind === "flow" && flow ? Math.min(sel.step, flow.steps.length - 1) : 0;
  const preset = sel?.kind === "ui" && ui ? (sel.preset in ui.presets ? sel.preset : Object.keys(ui.presets)[0]) : "";
  const current = flow?.steps[step];

  const openFlow = useCallback((f: FeatureMeta, x: FlowMeta) => {
    setSel({ kind: "flow", feature: f.id, flow: x.id, step: 0 }); setKey((k) => k + 1); setFitNonce((n) => n + 1);
  }, []);
  const openUI = useCallback((u: UIMeta) => {
    setSel({ kind: "ui", ui: u.id, preset: Object.keys(u.presets)[0] }); setOverrides({}); setKey((k) => k + 1); setFitNonce((n) => n + 1);
  }, []);

  // Fall back to the first flow, then the first UI block, when the hash names nothing that exists.
  useEffect(() => {
    if (!reg || flow || ui) return;
    const f = reg.features.find((x) => x.flows.length);
    if (f) openFlow(f, f.flows[0]);
    else if (reg.ui[0]) openUI(reg.ui[0]);
  }, [reg, flow, ui, openFlow, openUI]);

  const viewports: Viewport[] = (current && reg?.screens[current.screen]?.viewports) || ui?.viewports || ALL;
  const boardVp: Viewport = vp !== "full" && viewports.includes(vp) ? vp : viewports[0];
  const playVp: Vp = vp === "full" || viewports.includes(vp) ? vp : "full";

  // Stepping keeps the instance so state motion plays; jumping (fresh) remounts it.
  const go = (i: number, fresh = false) => {
    if (sel?.kind !== "flow" || !flow) return;
    setSel({ ...sel, step: Math.max(0, Math.min(flow.steps.length - 1, i)) });
    if (fresh) setKey((k) => k + 1);
  };
  const pickPreset = (p: string) => { if (sel?.kind === "ui") { setSel({ ...sel, preset: p }); setOverrides({}); } };
  const presets = ui ? Object.keys(ui.presets) : [];
  const open = (i: number) => {
    if (flow) go(i, true);
    else if (ui) { pickPreset(presets[i]); setKey((k) => k + 1); }
    setMode("play");
  };

  const target: Target | null =
    current ? { id: current.screen, state: current.state, key }
    : ui ? { id: ui.id, preset, overrides, key }
    : null;

  useEffect(() => {
    const p = new URLSearchParams({ mode, vp });
    if (sel?.kind === "flow") { p.set("f", sel.feature); p.set("flow", sel.flow); p.set("step", String(step)); }
    if (sel?.kind === "ui") { p.set("u", sel.ui); p.set("preset", preset); }
    history.replaceState(null, "", `#${p}`);
  }, [mode, vp, sel, step, preset]);

  useEffect(() => { setFitNonce((n) => n + 1); }, [boardVp]);

  useEffect(() => {
    const on = (e: KeyboardEvent) => {
      if (e.metaKey || e.ctrlKey || e.altKey || (e.target as HTMLElement).closest("input, select, textarea")) return;
      const k = e.key.toLowerCase();
      if (k === "\\") setChrome((c) => !c);
      else if (k === "b") setMode("board");
      else if (k === "p") setMode("play");
      else if (k === "t") flipTheme();
      else if (k === "r") setKey((n) => n + 1);
      else if ("1234".includes(k) && k.length === 1) {
        const v = (["full", ...ALL] as Vp[])[Number(k) - 1];
        if (v === "full" || viewports.includes(v)) setVp(v);
      } else if ((k === "arrowleft" || k === "arrowright") && mode === "play") {
        const d = k === "arrowleft" ? -1 : 1;
        if (flow) go(step + d);
        else if (ui) pickPreset(presets[(presets.indexOf(preset) + d + presets.length) % presets.length]);
      } else return;
      e.preventDefault();
    };
    window.addEventListener("keydown", on);
    return () => window.removeEventListener("keydown", on);
  });

  const items: BoardItem[] = flow
    ? flow.steps.map((s, i) => ({ key: `${i}`, label: `${i + 1} · ${reg?.screens[s.screen]?.title ?? s.screen} · ${s.state}`, query: `id=${encodeURIComponent(s.screen)}&state=${encodeURIComponent(s.state)}` }))
    : presets.map((p) => ({ key: p, label: p, query: `id=${encodeURIComponent(ui!.id)}&preset=${encodeURIComponent(p)}` }));
  const empty = reg && !reg.features.length && !reg.ui.length;

  return (
    <div className={`dv${chrome ? "" : " dv-hidden"}`}>
      <Stage visible={mode === "play" || !reg} vp={playVp} target={target} chrome={chrome} onRegistry={setReg} />
      {reg && mode === "board" && (flow || ui) && (
        <Board key={flow ? `${feature!.id}/${flow.id}` : ui!.id} items={items} vp={flow || ui?.viewports ? boardVp : null} flow={!!flow}
          view={view} setView={setView} fitNonce={fitNonce} onOpen={open} />
      )}
      {empty && <p className="dv-empty-stage">No surfaces yet. Add <code>*.design.ts</code> files under <code>features/</code> or <code>ui/</code>.</p>}
      {reg && (
        <div className="dv-chrome">
          <Navigator reg={reg} feature={feature} flow={flow} ui={ui} openFlow={openFlow} openUI={openUI} />
          {!(mode === "board" && ui && !ui.viewports) && <ViewportPill value={mode === "board" ? boardVp : playVp} options={["full", ...viewports]} board={mode === "board"} onChange={setVp} />}
          {(flow || ui) && (
            <Dock>
              <Seg label="View" value={mode} onChange={setMode} options={[["board", "Board"], ["play", "Play"]]} />
              <span className="dv-sep" />
              {mode === "board" ? <>
                <button type="button" className="dv-icon" aria-label="Zoom out" onClick={() => setView({ ...view, z: Math.max(0.05, view.z / 1.25) })}><Icon name="minus" /></button>
                <span className="dv-zoom">{Math.round(view.z * 100)}%</span>
                <button type="button" className="dv-icon" aria-label="Zoom in" onClick={() => setView({ ...view, z: Math.min(2, view.z * 1.25) })}><Icon name="plus" /></button>
                <button type="button" className="dv-icon" aria-label="Fit" onClick={() => setFitNonce((n) => n + 1)}><Icon name="fit" /></button>
              </> : flow ? <>
                <button type="button" className="dv-icon" aria-label="Previous step" disabled={step === 0} onClick={() => go(step - 1)}><Icon name="prev" /></button>
                <Select label="Step" value={String(step)} onChange={(v) => go(Number(v), true)}
                  options={flow.steps.map((s, i) => [String(i), `${i + 1} · ${reg.screens[s.screen]?.title ?? s.screen} · ${s.state}`])} />
                <button type="button" className="dv-icon" aria-label="Next step" disabled={step === flow.steps.length - 1} onClick={() => go(step + 1)}><Icon name="next" /></button>
                <button type="button" className="dv-icon" aria-label="Replay" onClick={() => setKey((k) => k + 1)}><Icon name="replay" /></button>
                <span className="dv-sep" />
                <button type="button" className="dv-btn" aria-pressed={inspector} onClick={() => setInspector(!inspector)}><Icon name="info" />Steps</button>
              </> : <>
                <Select label="Preset" value={preset} onChange={pickPreset} options={presets.map((p) => [p, p])} />
                <button type="button" className="dv-icon" aria-label="Replay" onClick={() => setKey((k) => k + 1)}><Icon name="replay" /></button>
                <span className="dv-sep" />
                <button type="button" className="dv-btn" aria-pressed={inspector} onClick={() => setInspector(!inspector)}><Icon name="props" />Props</button>
              </>}
            </Dock>
          )}
          {mode === "play" && inspector && flow && <StepsInspector reg={reg} flow={flow} step={step} jump={(i) => go(i, true)} onClose={() => setInspector(false)} />}
          {mode === "play" && inspector && ui && (
            <PropsInspector ui={ui} preset={preset} overrides={overrides} setPreset={pickPreset} setOverrides={setOverrides} onClose={() => setInspector(false)} />
          )}
        </div>
      )}
    </div>
  );
}
