import { useCallback, useEffect, useLayoutEffect, useMemo, useRef, useState, type CSSProperties, type MouseEvent as RMouseEvent, type PointerEvent as RPointerEvent, type RefObject } from "react";
import { actorTitle, matchesLenses, matchesQuery, plain, routeTo, tasksOf, variationsOf, type Area, type Journey, type LensState, type Model, type Walkthrough } from "./model";

export interface View { x: number; y: number; z: number }
export interface Insets { left: number; right: number; top: number; bottom: number }
export interface MapApi { fit(): void; zoom(factor: number): void }

const MIN_Z = 0.2, MAX_Z = 2, READABLE_Z = 0.55, COMFORT_Z = 0.7, COL_W = 280, GAP = 24;
/** A press that moves less than this many pixels is a click, not a pan. */
const DRAG_PX = 4;
const clampZ = (z: number) => Math.min(MAX_Z, Math.max(MIN_Z, z));

/**
 * Columns per row for areas of the given heights: the widest balanced layout whose fit zoom stays comfortable,
 * else the one with the largest fit zoom. Rows are balanced so the last row is not a stub.
 */
export function columnsFor(heights: number[], aw: number, ah: number): number {
  const n = heights.length;
  if (n < 2) return 1;
  const options = [...new Set(Array.from({ length: n }, (_, r) => Math.ceil(n / (r + 1))))];
  const zoomFor = (c: number) => {
    let h = 0;
    for (let i = 0; i < n; i += c) h += Math.max(...heights.slice(i, i + c)) + GAP;
    return Math.min(1, aw / (c * COL_W + (c - 1) * GAP), ah / Math.max(1, h - GAP));
  };
  const scored = options.map((c) => ({ c, z: zoomFor(c) }));
  return (scored.find((o) => o.z >= COMFORT_Z) ?? scored.reduce((a, b) => (b.z > a.z ? b : a))).c;
}

/** Cards lit by a selected walkthrough: itself, its setup route, its task, and its variations. */
export function focusOf(m: Model, id: string | undefined): { all: Set<string>; route: Set<string> } | null {
  const w = id ? m.walkthroughs.get(id) : undefined;
  if (!w) return null;
  const route = new Set(routeTo(m, w.id).filter((r) => r !== w.id && m.walkthroughs.has(r)));
  const all = new Set([w.id, ...route, ...variationsOf(m, w.id).map((v) => v.id)]);
  if (w.variationOf) all.add(w.variationOf);
  return { all, route };
}

/** Layout box of `el` inside `root`, unaffected by the canvas transform. */
function box(el: HTMLElement, root: HTMLElement) {
  let x = 0, y = 0;
  for (let e: HTMLElement | null = el; e && e !== root; e = e.offsetParent as HTMLElement | null) { x += e.offsetLeft; y += e.offsetTop; }
  return { x, y, w: el.offsetWidth, h: el.offsetHeight };
}
type Box = ReturnType<typeof box>;

/** A curve from card a to card b: sideways edge to edge, down a row from bottom to top, within a column around the left edge. */
function link(a: Box, b: Box): string {
  const ay = a.y + a.h / 2, by = b.y + b.h / 2;
  const sameRow = b.y < a.y + a.h + 120 && a.y < b.y + b.h + 120;
  if (b.x > a.x + a.w / 2 && sameRow) {
    const x1 = a.x + a.w, x2 = b.x, dx = Math.max(24, (x2 - x1) / 2);
    return `M${x1},${ay} C${x1 + dx},${ay} ${x2 - dx},${by} ${x2},${by}`;
  }
  if (Math.abs(b.x - a.x) > a.w / 2) {
    const down = b.y > a.y;
    const y1 = down ? a.y + a.h : a.y, y2 = down ? b.y : b.y + b.h, d = down ? 70 : -70;
    return `M${a.x + a.w / 2},${y1} C${a.x + a.w / 2},${y1 + d} ${b.x + b.w / 2},${y2 - d} ${b.x + b.w / 2},${y2}`;
  }
  const out = Math.min(a.x, b.x) - 22;
  return `M${a.x},${ay} C${out},${ay} ${out},${by} ${b.x},${by}`;
}

function Card({ model, w, step, selected, state, onSelect }: {
  model: Model; w: Walkthrough; step: number; selected: boolean; state: string; onSelect: (id: string) => void;
}) {
  return (
    <button type="button" data-id={w.id} className={`wt-card${w.variationOf ? " wt-variation" : ""}${selected ? " is-sel" : ""} ${state}`}
      aria-pressed={selected} onClick={() => onSelect(w.id)}>
      {step > 0 && <span className="wt-step-badge" title={`Journey step ${step}`}>{step}</span>}
      {w.variationOf && <span className="wt-kind">Variation</span>}
      <span className="wt-card-title">{w.title}</span>
      <span className="wt-card-meta">
        {w.actors.map((a) => <span key={a} className="wt-badge">{actorTitle(model, a)}</span>)}
        <span>{w.steps.length} steps</span>
      </span>
      <span className="wt-card-goal">{plain(w.goal)}</span>
    </button>
  );
}

export function MapCanvas({ model, journey, area, lenses, query, selected, view, setView, insets, narrow, apiRef, onSelect }: {
  model: Model; journey?: Journey; area?: Area; lenses: LensState; query: string; selected?: string;
  view: View; setView: (v: View) => void; insets: Insets; narrow: boolean; apiRef: RefObject<MapApi | null>; onSelect: (id: string) => void;
}) {
  const root = useRef<HTMLDivElement>(null);
  const content = useRef<HTMLDivElement>(null);
  const viewRef = useRef(view);
  viewRef.current = view;
  const [glide, setGlide] = useState(false);
  const [dragging, setDragging] = useState(false);
  const dragged = useRef(false);
  const [size, setSize] = useState(() => [innerWidth, innerHeight]);
  const [lines, setLines] = useState<{ journey: string[]; route: string[]; size: [number, number] }>({ journey: [], route: [], size: [0, 0] });
  const [cols, setCols] = useState(() => Math.min(model.areas.length, 4) || 1);
  const touched = useRef(false);
  const focus = useMemo(() => focusOf(model, selected), [model, selected]);

  // Pick the columns for the space beside the open panels. Frozen while a walkthrough is selected, so opening one never reflows the map.
  const chosen = useRef(false);
  useLayoutEffect(() => {
    const r = root.current, c = content.current;
    if (!r || !c || narrow || (selected && chosen.current)) return;
    chosen.current = true;
    const heights = [...c.querySelectorAll<HTMLElement>(".wt-col")].map((el) => el.offsetHeight);
    const aw = Math.max(200, r.clientWidth - insets.left - insets.right - 48);
    const ah = Math.max(200, r.clientHeight - insets.top - insets.bottom - 16);
    setCols(columnsFor(heights, aw, ah));
  }, [model, insets, narrow, selected, size]);

  const apply = useCallback((v: View, animate = false) => {
    viewRef.current = v;
    setView(v);
    if (animate) { setGlide(true); setTimeout(() => setGlide(false), 360); }
  }, [setView]);

  const fit = useCallback((animate = false) => {
    const r = root.current, c = content.current;
    if (!r || !c || narrow) return;
    const aw = Math.max(200, r.clientWidth - insets.left - insets.right - 48);
    const ah = Math.max(200, r.clientHeight - insets.top - insets.bottom - 16);
    // Fit the whole map; when that would be too small to read, keep a readable zoom and let the height pan.
    const z = clampZ(Math.min(1, Math.max(aw / c.offsetWidth, READABLE_Z), Math.max(ah / c.offsetHeight, READABLE_Z)));
    const x = insets.left + 24 + Math.max(0, (aw - c.offsetWidth * z) / 2);
    const y = insets.top + 8 + Math.max(0, (ah - c.offsetHeight * z) / 2);
    touched.current = false;
    apply({ x, y, z }, animate);
  }, [insets, narrow, apply]);

  /** Pans `selector` into the space between the panels. */
  const reveal = useCallback((selector: string) => {
    const r = root.current, c = content.current;
    const el = c?.querySelector<HTMLElement>(selector);
    if (!r || !c || !el) return;
    if (narrow) { el.scrollIntoView({ block: "center", behavior: "smooth" }); return; }
    const b = box(el, c), v = viewRef.current;
    const left = insets.left + 16, right = r.clientWidth - insets.right - 16;
    const top = insets.top + 8, bottom = r.clientHeight - insets.bottom - 8;
    const sx = v.x + b.x * v.z, sy = v.y + b.y * v.z, sw = b.w * v.z, sh = b.h * v.z;
    let { x, y } = v;
    if (sx < left || sx + sw > right) x += (left + right) / 2 - (sx + sw / 2);
    if (sy < top || sy + sh > bottom) y += sh > bottom - top ? top - sy : (top + bottom) / 2 - (sy + sh / 2);
    if (x !== v.x || y !== v.y) apply({ ...v, x, y }, true);
  }, [insets, narrow, apply]);

  apiRef.current = {
    fit: () => fit(true),
    zoom: (f) => {
      const r = root.current, v = viewRef.current;
      if (!r) return;
      const z = clampZ(v.z * f), cx = (insets.left + r.clientWidth - insets.right) / 2, cy = r.clientHeight / 2;
      touched.current = true;
      apply({ z, x: cx - ((cx - v.x) * z) / v.z, y: cy - ((cy - v.y) * z) / v.z }, true);
    },
  };

  // Fit on first layout, when the columns change, and on resize, unless the user has panned or zoomed since.
  useLayoutEffect(() => { fit(); }, [narrow, cols]);
  useEffect(() => {
    const on = () => { setSize([innerWidth, innerHeight]); if (!touched.current) requestAnimationFrame(() => fit()); };
    addEventListener("resize", on);
    return () => removeEventListener("resize", on);
  }, [fit]);

  // A sidebar opening or closing refits an untouched map; with a walkthrough selected it only pans.
  const first = useRef(true);
  useEffect(() => {
    if (first.current) { first.current = false; return; }
    if (!touched.current && !selected) fit(true);
  }, [fit]);

  // Keep the selection, else the active area, in view, clear of the sidebars.
  useEffect(() => {
    if (selected) reveal(`[data-id="${CSS.escape(selected)}"]`);
    else if (area) reveal(`[data-area="${CSS.escape(area.id)}"]`);
  }, [selected, area, insets.left, insets.right, reveal]);

  // Journey path and setup route, recomputed whenever the cards change size or place.
  useLayoutEffect(() => {
    const c = content.current;
    if (!c || narrow) return;
    const measure = () => {
      const at = (id: string) => {
        const el = c.querySelector<HTMLElement>(`[data-id="${CSS.escape(id)}"]`);
        return el ? box(el, c) : null;
      };
      const chain = (ids: string[]) => ids.slice(1).map((id, i) => {
        const a = at(ids[i]), b = at(id);
        return a && b ? link(a, b) : "";
      }).filter(Boolean);
      const route = selected ? routeTo(model, selected).filter((id) => model.walkthroughs.has(id)) : [];
      setLines({ journey: journey ? chain(journey.walkthroughs) : [], route: chain(route), size: [c.offsetWidth, c.offsetHeight] });
    };
    measure();
    const ro = new ResizeObserver(measure);
    ro.observe(c);
    c.querySelectorAll(".wt-card").forEach((el) => ro.observe(el));
    return () => ro.disconnect();
  }, [model, journey, selected, narrow, cols]);

  useEffect(() => {
    const r = root.current;
    if (!r || narrow) return;
    const wheel = (e: WheelEvent) => {
      e.preventDefault();
      const v = viewRef.current;
      touched.current = true;
      if (e.ctrlKey || e.metaKey) {
        const z = clampZ(v.z * Math.exp(-e.deltaY * 0.01));
        const b = r.getBoundingClientRect(), px = e.clientX - b.left, py = e.clientY - b.top;
        apply({ z, x: px - ((px - v.x) * z) / v.z, y: py - ((py - v.y) * z) / v.z });
      } else apply({ ...v, x: v.x - e.deltaX, y: v.y - e.deltaY });
    };
    r.addEventListener("wheel", wheel, { passive: false });
    return () => r.removeEventListener("wheel", wheel);
  }, [narrow, apply]);

  // Pan from anywhere, cards included. A press that stays within DRAG_PX is a click; a drag never clicks the card it started on.
  const drag = (e: RPointerEvent) => {
    if (narrow || e.button !== 0) return;
    e.preventDefault();
    const start = { x: e.clientX, y: e.clientY, v: viewRef.current };
    const el = e.currentTarget as HTMLElement;
    let moving = false;
    const move = (m: PointerEvent) => {
      const dx = m.clientX - start.x, dy = m.clientY - start.y;
      if (!moving) {
        if (Math.hypot(dx, dy) < DRAG_PX) return;
        moving = true;
        el.setPointerCapture(m.pointerId);
        setDragging(true);
      }
      touched.current = true;
      apply({ ...start.v, x: start.v.x + dx, y: start.v.y + dy });
    };
    const up = () => {
      el.removeEventListener("pointermove", move);
      el.removeEventListener("pointerup", up);
      el.removeEventListener("pointercancel", up);
      if (!moving) return;
      setDragging(false);
      dragged.current = true;
      setTimeout(() => { dragged.current = false; });
    };
    el.addEventListener("pointermove", move);
    el.addEventListener("pointerup", up);
    el.addEventListener("pointercancel", up);
  };
  const swallowDragClick = (e: RMouseEvent) => {
    if (!dragged.current) return;
    dragged.current = false;
    e.preventDefault();
    e.stopPropagation();
  };

  const q = query.trim();
  // Quiet by default; a journey or area spotlights its cards and dims the rest; a selection lights its route and variations.
  const stateOf = (w: Walkthrough) => {
    const out: string[] = [];
    const inGroup = journey ? journey.walkthroughs.includes(w.id) : area ? w.area === area.id : false;
    if (!matchesLenses(model, w, lenses) || (q && !matchesQuery(w, q))) out.push("is-dim");
    else if (inGroup || focus?.all.has(w.id)) out.push("is-lit");
    else if (journey || area) out.push("is-faded");
    if (focus?.route.has(w.id)) out.push("is-route");
    return out.join(" ");
  };
  const card = (w: Walkthrough) => (
    <Card model={model} w={w} step={journey ? journey.walkthroughs.indexOf(w.id) + 1 : 0} selected={w.id === selected} state={stateOf(w)} onSelect={onSelect} />
  );

  return (
    <div ref={root} className={`wt-canvas${narrow ? " wt-stacked" : ""}${dragging ? " is-dragging" : ""}`} onPointerDown={drag} onClickCapture={swallowDragClick}>
      <div ref={content} className={`wt-map${glide ? " wt-glide" : ""}${journey ? " has-journey" : ""}`}
        style={narrow ? undefined : ({ transform: `translate(${view.x}px, ${view.y}px) scale(${view.z})`, gridTemplateColumns: `repeat(${cols}, ${COL_W}px)` } as CSSProperties)}>
        {!narrow && (
          <svg className="wt-lines" width={lines.size[0]} height={lines.size[1]} aria-hidden>
            {lines.journey.map((d, i) => <path key={`j${i}`} d={d} className="wt-line-journey" />)}
            {lines.route.map((d, i) => <path key={`r${i}`} d={d} className="wt-line-route" />)}
          </svg>
        )}
        {model.areas.map((a) => {
          const tasks = tasksOf(model, a.id);
          return (
            <section key={a.id} data-area={a.id} className={`wt-col${area?.id === a.id ? " is-active" : area ? " is-faded" : ""}`} aria-labelledby={`col-${a.id}`}>
              <header className="wt-col-head">
                <h2 id={`col-${a.id}`}>{a.title}<small>{tasks.length}</small></h2>
                {a.summary && <p>{a.summary}</p>}
              </header>
              <ul className="wt-cards">
                {tasks.map((t) => {
                  const vars = variationsOf(model, t.id);
                  return (
                    <li key={t.id}>
                      {card(t)}
                      {vars.length > 0 && (
                        <ul className="wt-vars" aria-label={`Variations of ${t.title}`}>
                          {vars.map((v) => <li key={v.id}>{card(v)}</li>)}
                        </ul>
                      )}
                    </li>
                  );
                })}
                {!tasks.length && <li className="wt-col-empty">No walkthroughs — see Coverage in About.</li>}
              </ul>
            </section>
          );
        })}
      </div>
    </div>
  );
}
