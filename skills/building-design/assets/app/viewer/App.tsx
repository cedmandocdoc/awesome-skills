import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import "./viewer.css";
import { BoardFrames, Canvas, Stage, useWindowSize, type BoardItem, type CanvasApi, type Insets, type View } from "./canvas";
import { Dock, FlowInspector, Icon, Navigator, Seg, UIInspector, ViewportBar } from "./chrome";
import { SIZES, type FeatureMeta, type FlowMeta, type Registry, type Target, type UIMeta } from "./meta";
import type { Viewport } from "../system/define";

type Mode = "board" | "play";
type Sel = { kind: "flow"; feature: string; flow: string; step: number } | { kind: "ui"; ui: string; preset: string };

const ALL: Viewport[] = ["desktop", "tablet", "mobile"];
const NAV_W = 272, INSPECTOR_W = 300;
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
  const [vp, setVp] = useState<Viewport>(ALL.includes(hash.vp as Viewport) ? (hash.vp as Viewport) : "desktop");
  const [overrides, setOverrides] = useState<Record<string, unknown>>({});
  const [key, setKey] = useState(0);
  const [chrome, setChrome] = useState(true);
  const [navCollapsed, setNavCollapsed] = useState(false);
  const [insCollapsed, setInsCollapsed] = useState(false);
  const [panning, setPanning] = useState(false);
  const [view, setView] = useState<View>({ x: 0, y: 0, z: 1 });
  const [fitNonce, setFitNonce] = useState(0);
  const api = useRef<CanvasApi | null>(null);
  const win = useWindowSize();

  const feature = sel?.kind === "flow" ? reg?.features.find((f) => f.id === sel.feature) : undefined;
  const flow = sel?.kind === "flow" ? feature?.flows.find((f) => f.id === sel.flow) : undefined;
  const ui = sel?.kind === "ui" ? reg?.ui.find((u) => u.id === sel.ui) : undefined;
  const step = sel?.kind === "flow" && flow ? Math.min(sel.step, flow.steps.length - 1) : 0;
  const presets = ui ? Object.keys(ui.presets) : [];
  const preset = sel?.kind === "ui" && ui ? (sel.preset in ui.presets ? sel.preset : presets[0]) : "";
  const current = flow?.steps[step];

  const openFlow = useCallback((f: FeatureMeta, x: FlowMeta) => {
    setSel({ kind: "flow", feature: f.id, flow: x.id, step: 0 }); setKey((k) => k + 1);
  }, []);
  const openUI = useCallback((u: UIMeta) => {
    setSel({ kind: "ui", ui: u.id, preset: Object.keys(u.presets)[0] }); setOverrides({}); setKey((k) => k + 1);
  }, []);
  const openPreset = (u: UIMeta, p: string) => {
    setSel({ kind: "ui", ui: u.id, preset: p }); setOverrides({}); setKey((k) => k + 1); setMode("play");
  };

  // Fall back to the first flow, then the first UI block, when the hash names nothing that exists.
  useEffect(() => {
    if (!reg || flow || ui) return;
    const f = reg.features.find((x) => x.flows.length);
    if (f) openFlow(f, f.flows[0]);
    else if (reg.ui[0]) openUI(reg.ui[0]);
  }, [reg, flow, ui, openFlow, openUI]);

  const viewports: Viewport[] | undefined = (current && reg?.screens[current.screen]?.viewports) || ui?.viewports;
  const activeVp = viewports ? (viewports.includes(vp) ? vp : viewports[0]) : null;
  const size = activeVp ? SIZES[activeVp] : null;

  // Stepping keeps the instance so state motion plays; opening (fresh) remounts it.
  const go = (i: number, fresh = false) => {
    if (sel?.kind === "flow" && flow) setSel({ ...sel, step: Math.max(0, Math.min(flow.steps.length - 1, i)) });
    else if (sel?.kind === "ui" && ui) { setSel({ ...sel, preset: presets[Math.max(0, Math.min(presets.length - 1, i))] }); setOverrides({}); }
    if (fresh) setKey((k) => k + 1);
  };
  const open = (i: number) => { go(i, true); setMode("play"); };
  const replay = () => setKey((k) => k + 1);

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

  // Refit when what the canvas holds changes; stepping within a flow keeps the user's zoom.
  const shown = flow ? `${feature!.id}/${flow.id}` : ui?.id;
  useEffect(() => { setFitNonce((n) => n + 1); }, [shown, mode, activeVp]);

  // Shortcuts, from the viewer or forwarded by the live frame.
  const onKey = (k: string): boolean => {
    k = k.toLowerCase();
    if (k === "\\") setChrome((c) => !c);
    else if (k === "b") setMode("board");
    else if (k === "p") setMode("play");
    else if (k === "t") flipTheme();
    else if (k === "r") replay();
    else if (k === "f") api.current?.fit();
    else if ("123".includes(k) && k.length === 1) {
      const v = ALL[Number(k) - 1];
      if (viewports?.includes(v)) setVp(v);
    } else if ((k === "arrowleft" || k === "arrowright") && mode === "play") {
      go((flow ? step : presets.indexOf(preset)) + (k === "arrowleft" ? -1 : 1));
    } else return false;
    return true;
  };
  const keyRef = useRef(onKey);
  keyRef.current = onKey;
  useEffect(() => {
    const down = (e: KeyboardEvent) => {
      const t = e.target as HTMLElement;
      if (e.metaKey || e.ctrlKey || e.altKey || t.closest("input, select, textarea")) return;
      if (e.key === " ") { if (!t.closest("button")) { setPanning(true); e.preventDefault(); } }
      else if (keyRef.current(e.key)) e.preventDefault();
    };
    const up = (e: KeyboardEvent) => { if (e.key === " ") setPanning(false); };
    const blur = () => setPanning(false);
    window.addEventListener("keydown", down);
    window.addEventListener("keyup", up);
    window.addEventListener("blur", blur);
    return () => { window.removeEventListener("keydown", down); window.removeEventListener("keyup", up); window.removeEventListener("blur", blur); };
  }, []);

  const insets: Insets = useMemo(() => ({
    left: chrome && !navCollapsed ? 16 + NAV_W + 16 : 16,
    right: chrome && (flow || ui) && !insCollapsed ? 16 + INSPECTOR_W + 16 : 16,
    top: chrome ? 64 : 16,
    bottom: chrome ? 76 : 16,
  }), [chrome, navCollapsed, insCollapsed, !!(flow || ui)]);
  const center = { left: (insets.left + win.w - insets.right) / 2 };

  const items: BoardItem[] = flow
    ? flow.steps.map((s, i) => ({ key: `${i}`, label: `${i + 1} · ${reg?.screens[s.screen]?.title ?? s.screen} · ${s.state}`, query: `id=${encodeURIComponent(s.screen)}&state=${encodeURIComponent(s.state)}` }))
    : presets.map((p) => ({ key: p, label: p, query: `id=${encodeURIComponent(ui!.id)}&preset=${encodeURIComponent(p)}` }));
  const label = flow && current ? items[step].label : ui ? `${ui.title} · ${preset}` : "";
  const refit = () => api.current?.refit();
  const empty = reg && !reg.features.length && !reg.ui.length;

  return (
    <div className={`dv${chrome ? "" : " dv-hidden"}`}>
      <Canvas view={view} setView={setView} insets={insets} fitNonce={fitNonce} wrap={mode === "board" && !flow} panning={panning} apiRef={api}>
        {mode === "board" && (flow || ui) && (
          <BoardFrames key={shown} items={items} size={size} flow={!!flow} current={flow ? step : presets.indexOf(preset)} onOpen={open} onSized={refit} />
        )}
        <Stage hidden={mode !== "play" || !target} size={size} label={label} target={target} onRegistry={setReg} onSized={refit}
          onZoom={(x, y, f) => api.current?.zoomAt(x, y, f)} onKey={(k) => keyRef.current(k)} onSpace={setPanning} />
      </Canvas>
      {empty && <p className="dv-empty-stage">No surfaces yet. Add <code>*.design.ts</code> files under <code>features/</code> or <code>ui/</code>.</p>}
      {reg && (
        <div className="dv-chrome">
          <Navigator reg={reg} feature={feature} flow={flow} ui={ui} preset={preset} collapsed={navCollapsed} setCollapsed={setNavCollapsed}
            openFlow={openFlow} openUI={openUI} openPreset={openPreset} />
          {viewports && activeVp && <ViewportBar value={activeVp} options={viewports} onChange={setVp} style={center} />}
          {feature && flow && (
            <FlowInspector reg={reg} feature={feature} flow={flow} step={step} play={mode === "play"} go={go} open={open} replay={replay}
              collapsed={insCollapsed} setCollapsed={setInsCollapsed} />
          )}
          {ui && (
            <UIInspector ui={ui} preset={preset} overrides={overrides} play={mode === "play"} go={go} open={open} setOverrides={setOverrides} replay={replay}
              collapsed={insCollapsed} setCollapsed={setInsCollapsed} />
          )}
          {(flow || ui) && (
            <Dock style={center}>
              <Seg label="View" value={mode} onChange={setMode} options={[["board", "Board"], ["play", "Play"]]} />
              <span className="dv-sep" />
              <button type="button" className="dv-icon" aria-label="Zoom out" onClick={() => api.current?.zoom(1 / 1.25)}><Icon name="minus" /></button>
              <span className="dv-zoom" aria-label="Zoom level">{Math.round(view.z * 100)}%</span>
              <button type="button" className="dv-icon" aria-label="Zoom in" onClick={() => api.current?.zoom(1.25)}><Icon name="plus" /></button>
              <button type="button" className="dv-icon" aria-label="Fit (F)" title="Fit (F)" onClick={() => api.current?.fit()}><Icon name="fit" /></button>
              <span className="dv-sep" />
              <button type="button" className="dv-icon" aria-label="Flip theme (T)" title="Theme (T)" onClick={flipTheme}><Icon name="theme" /></button>
            </Dock>
          )}
        </div>
      )}
    </div>
  );
}
