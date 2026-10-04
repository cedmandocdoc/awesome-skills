import { useEffect, useLayoutEffect, useRef, useState, type PointerEvent as RPointerEvent } from "react";
import { BASELINE, routeTo, type Layout, type Model, type Point } from "./model";
import type { Selection } from "./App";

interface View { x: number; y: number; k: number }
export const PANEL_W = 480;
const PAD = 90;

// Same row → straight; otherwise down from `a`, round the corner, then along to `b`.
function connector(a: Point, b: Point): string {
  if (a.y === b.y) return `M${a.x},${a.y}L${b.x},${b.y}`;
  const r = Math.min(18, Math.abs(b.x - a.x), Math.abs(b.y - a.y));
  return `M${a.x},${a.y}L${a.x},${b.y - r}Q${a.x},${b.y} ${a.x + r},${b.y}L${b.x},${b.y}`;
}

function wrap(title: string, max: number): string[] {
  const out: string[] = [];
  let cur = "";
  for (const word of title.split(" ")) {
    if (cur && (cur + " " + word).length > max) { out.push(cur); cur = word; } else cur = cur ? `${cur} ${word}` : word;
  }
  out.push(cur);
  return out.length > 2 ? [out[0], `${out.slice(1).join(" ").slice(0, max - 1)}…`] : out;
}

export function MetroMap({ model, map, sel, setSel, visible }: {
  model: Model; map: Layout; sel: Selection; setSel: (s: Selection) => void; visible: Set<string> | null;
}) {
  const svg = useRef<SVGSVGElement>(null);
  const [view, setView] = useState<View>({ x: 0, y: 0, k: 1 });
  const drag = useRef<{ x: number; y: number; vx: number; vy: number; moved: boolean } | null>(null);
  const panelOpen = sel.kind === "station" || sel.kind === "about";

  const parentPoint = (id: string): Point | undefined => {
    const from = model.walkthroughs.get(id)?.startsFrom ?? "";
    return from.startsWith(BASELINE) ? map.baselines.get(from.slice(BASELINE.length)) : map.stations.get(from);
  };

  const fit = (pts: Point[]) => {
    const el = svg.current;
    if (!el || !pts.length) return;
    const xs = pts.map((p) => p.x), ys = pts.map((p) => p.y);
    const [x0, x1, y0, y1] = [Math.min(...xs) - 160, Math.max(...xs) + 120, Math.min(...ys) - 60, Math.max(...ys) + 50];
    const w = el.clientWidth - (panelOpen && innerWidth > 760 ? PANEL_W : 0), h = el.clientHeight;
    const k = Math.min(1.4, (w - PAD) / (x1 - x0), (h - PAD * 2) / (y1 - y0));
    setView({ k, x: (w - (x1 - x0) * k) / 2 - x0 * k, y: (h - (y1 - y0) * k) / 2 - y0 * k + 20 });
  };

  useLayoutEffect(() => {
    if (sel.kind === "overview") fit([...map.stations.values(), ...map.baselines.values()]);
    else if (sel.kind === "line") {
      const line = map.lines.find((l) => l.id === sel.id);
      const spurs = map.spurs.filter((s) => model.walkthroughs.get(s.id)?.line === sel.id).map((s) => s.to);
      if (line) fit([line.origin, ...line.points, ...spurs]);
    } else if (sel.kind === "station") {
      const p = map.stations.get(sel.id), el = svg.current;
      if (!p || !el) return;
      const sx = p.x * view.k + view.x, sy = p.y * view.k + view.y;
      const w = el.clientWidth - (innerWidth > 760 ? PANEL_W : 0);
      if (sx < 80 || sx > w - 80 || sy < 120 || sy > el.clientHeight - 80) setView((v) => ({ ...v, x: w / 2 - p.x * v.k, y: el.clientHeight / 2 - p.y * v.k }));
    }
  }, [sel, map]);

  useEffect(() => {
    const el = svg.current;
    if (!el) return;
    const on = (e: WheelEvent) => {
      e.preventDefault();
      if (e.ctrlKey || e.metaKey) {
        const r = el.getBoundingClientRect(), px = e.clientX - r.left, py = e.clientY - r.top;
        setView((v) => {
          const k = Math.min(3, Math.max(0.2, v.k * Math.exp(-e.deltaY * 0.01)));
          return { k, x: px - ((px - v.x) * k) / v.k, y: py - ((py - v.y) * k) / v.k };
        });
      } else setView((v) => ({ ...v, x: v.x - e.deltaX, y: v.y - e.deltaY }));
    };
    el.addEventListener("wheel", on, { passive: false });
    return () => el.removeEventListener("wheel", on);
  }, []);

  const down = (e: RPointerEvent) => { drag.current = { x: e.clientX, y: e.clientY, vx: view.x, vy: view.y, moved: false }; };
  const move = (e: RPointerEvent) => {
    const d = drag.current;
    if (!d) return;
    const dx = e.clientX - d.x, dy = e.clientY - d.y;
    if (!d.moved && Math.hypot(dx, dy) < 4) return;
    if (!d.moved) svg.current?.setPointerCapture(e.pointerId);
    d.moved = true;
    setView((v) => ({ ...v, x: d.vx + dx, y: d.vy + dy }));
  };
  const up = () => { setTimeout(() => (drag.current = null)); };
  const click = (s: Selection) => () => { if (!drag.current?.moved) setSel(s); };

  const route = sel.kind === "station" ? new Set(routeTo(model, sel.id)) : null;
  const focusLine = sel.kind === "line" ? sel.id : null;
  const dim = (id: string, line: string) =>
    (route && !route.has(id)) || (focusLine && line !== focusLine) || (visible && !visible.has(id)) ? " dim" : "";
  const color = (line: string) => model.lines.find((l) => l.id === line)?.color ?? "var(--wv-ink-2)";

  return (
    <svg ref={svg} className="wv-map" onPointerDown={down} onPointerMove={move} onPointerUp={up} onPointerCancel={up}>
      <g transform={`translate(${view.x} ${view.y}) scale(${view.k})`}>
        {map.lines.map((l) => {
          const d = connector(l.origin, l.points[0]) + l.points.slice(1).map((p) => `L${p.x},${p.y}`).join("");
          const off = (route && !l.ids.some((id) => route.has(id))) || (focusLine && focusLine !== l.id);
          return <path key={l.id} d={d} className={`wv-track${off ? " dim" : ""}`} stroke={color(l.id)} onClick={click({ kind: "line", id: l.id })} />;
        })}
        {map.spurs.map((s) => {
          const line = model.walkthroughs.get(s.id)!.line;
          return <path key={s.id} d={connector(s.from, s.to)} className={`wv-spur${dim(s.id, line)}`} stroke={color(line)} />;
        })}
        {route && [...route].filter((id) => !id.startsWith(BASELINE)).map((id) => {
          const from = parentPoint(id), to = map.stations.get(id);
          return from && to ? <path key={id} d={connector(from, to)} className="wv-route" stroke={color(model.walkthroughs.get(id)!.line)} /> : null;
        })}
        {model.baselines.map((b) => {
          const p = map.baselines.get(b.id);
          if (!p) return null;
          return (
            <g key={b.id} className={`wv-baseline${route && !route.has(BASELINE + b.id) ? " dim" : ""}`} onClick={click({ kind: "about" })}>
              <rect x={p.x - 7} y={p.y - 14} width={14} height={28} rx={7} />
              <text x={p.x - 16} y={p.y + 4} textAnchor="end">{b.title}</text>
              <title>Baseline: {b.title}{b.setup ? ` — ${b.setup}` : ""}</title>
            </g>
          );
        })}
        {map.lines.map((l) => {
          const first = l.points[0];
          if (!first) return null;
          const x = l.transfer ? (l.origin.x + first.x) / 2 + 9 : (l.origin.x + first.x) / 2;
          return (
            <text key={l.id} x={x} y={first.y + 22} textAnchor="middle" className={`wv-line-name${focusLine && focusLine !== l.id ? " dim" : ""}`} fill={color(l.id)} onClick={click({ kind: "line", id: l.id })}>
              {model.lines.find((m) => m.id === l.id)?.title}
            </text>
          );
        })}
        {[...model.walkthroughs.values()].map((w) => {
          const p = map.stations.get(w.id);
          if (!p) return null;
          const core = w.kind === "core";
          const selected = sel.kind === "station" && sel.id === w.id;
          return (
            <g key={w.id} className={`wv-station${core ? "" : " branch"}${selected ? " sel" : ""}${dim(w.id, w.line)}`} transform={`translate(${p.x} ${p.y})`} onClick={click({ kind: "station", id: w.id })}>
              <circle r={core ? 9 : 6} stroke={color(w.line)} />
              {w.checkpoint && <circle r={core ? 3.5 : 2.5} className="wv-checkpoint" fill={color(w.line)} />}
              {!core && <path d="M10,-7V7" stroke={color(w.line)} className="wv-endcap" />}
              {core
                ? wrap(w.title, 26).map((t, i, a) => <text key={i} y={-18 - (a.length - 1 - i) * 14} textAnchor="middle">{t}</text>)
                : wrap(w.title, 20).map((t, i, a) => <text key={i} x={18} y={4 + (i - (a.length - 1) / 2) * 14}>{t}</text>)}
              <title>{w.title}{w.checkpoint ? " · checkpoint" : ""}</title>
            </g>
          );
        })}
      </g>
      {!model.walkthroughs.size && <text x="50%" y="50%" textAnchor="middle" className="wv-muted">No walkthroughs yet</text>}
    </svg>
  );
}
