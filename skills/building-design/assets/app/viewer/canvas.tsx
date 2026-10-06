import { Fragment, useEffect, useLayoutEffect, useRef, useState, type CSSProperties, type ReactNode, type RefObject, type PointerEvent as RPointerEvent } from "react";
import { type Registry, type Target } from "./meta";

export interface View { x: number; y: number; z: number }
export interface Insets { left: number; right: number; top: number; bottom: number }
export interface CanvasApi { fit: () => void; refit: () => void; zoom: (factor: number) => void; zoomAt: (x: number, y: number, factor: number) => void }

const clampZ = (z: number) => Math.min(2, Math.max(0.05, z));

export function useWindowSize() {
  const [size, setSize] = useState({ w: window.innerWidth, h: window.innerHeight });
  useEffect(() => {
    const on = () => setSize({ w: window.innerWidth, h: window.innerHeight });
    window.addEventListener("resize", on);
    return () => window.removeEventListener("resize", on);
  }, []);
  return size;
}

// Figma-like canvas shared by Board and Play: drag or scroll to pan, ⌘/Ctrl + scroll or pinch to zoom.
// It follows content and inset changes until the user pans or zooms; fit resumes that.
export function Canvas({ view, setView, insets, fitNonce, wrap, panning, apiRef, children }: {
  view: View; setView: (v: View) => void; insets: Insets; fitNonce: number; wrap: boolean; panning: boolean;
  apiRef: RefObject<CanvasApi | null>; children: ReactNode;
}) {
  const root = useRef<HTMLDivElement>(null);
  const content = useRef<HTMLDivElement>(null);
  const viewRef = useRef(view);
  viewRef.current = view;
  const auto = useRef(true);
  const moved = useRef(false);
  const move = (v: View) => { auto.current = false; setView(v); };

  const fit = () => {
    const r = root.current, c = content.current;
    if (!r || !c || !c.offsetWidth) return;
    auto.current = true;
    const w = r.clientWidth - insets.left - insets.right, h = r.clientHeight - insets.top - insets.bottom;
    const z = Math.min(1, (w - 48) / c.offsetWidth, (h - 48) / c.offsetHeight);
    setView({ z, x: insets.left + (w - c.offsetWidth * z) / 2, y: insets.top + (h - c.offsetHeight * z) / 2 });
  };
  const zoomAt = (px: number, py: number, factor: number) => {
    const v = viewRef.current, z = clampZ(v.z * factor);
    move({ z, x: px - ((px - v.x) * z) / v.z, y: py - ((py - v.y) * z) / v.z });
  };
  apiRef.current = {
    fit,
    refit: () => { if (auto.current) fit(); },
    zoom: (f) => zoomAt((insets.left + window.innerWidth - insets.right) / 2, (insets.top + window.innerHeight - insets.bottom) / 2, f),
    zoomAt,
  };

  useLayoutEffect(fit, [fitNonce]);
  useEffect(() => { if (auto.current) fit(); }, [insets.left, insets.right, insets.top, insets.bottom]);

  useEffect(() => {
    const r = root.current!;
    const wheel = (e: WheelEvent) => {
      e.preventDefault();
      const v = viewRef.current;
      if (e.ctrlKey || e.metaKey) apiRef.current?.zoomAt(e.clientX, e.clientY, Math.exp(-e.deltaY * 0.01));
      else move({ ...v, x: v.x - e.deltaX, y: v.y - e.deltaY });
    };
    r.addEventListener("wheel", wheel, { passive: false });
    return () => r.removeEventListener("wheel", wheel);
  }, []);

  // A press that moves under 4px stays a click; past that it pans, captured so it keeps panning over frames.
  const drag = (e: RPointerEvent) => {
    if (e.button !== 0) return;
    const el = e.currentTarget as HTMLElement;
    const start = { x: e.clientX, y: e.clientY, v: viewRef.current };
    moved.current = false;
    const onMove = (m: PointerEvent) => {
      if (!moved.current && Math.hypot(m.clientX - start.x, m.clientY - start.y) < 4) return;
      if (!moved.current) { moved.current = true; el.setPointerCapture(e.pointerId); el.classList.add("is-dragging"); }
      move({ ...start.v, x: start.v.x + m.clientX - start.x, y: start.v.y + m.clientY - start.y });
    };
    const up = () => {
      el.classList.remove("is-dragging");
      el.removeEventListener("pointermove", onMove);
      el.removeEventListener("pointerup", up);
      el.removeEventListener("pointercancel", up);
    };
    el.addEventListener("pointermove", onMove);
    el.addEventListener("pointerup", up);
    el.addEventListener("pointercancel", up);
  };

  return (
    <div ref={root} className="dv-canvas" onPointerDown={drag} onClickCapture={(e) => { if (moved.current) { e.stopPropagation(); moved.current = false; } }}>
      <div ref={content} className={`dv-canvas-content${wrap ? " is-wrap" : ""}`} style={{ transform: `translate(${view.x}px, ${view.y}px) scale(${view.z})`, "--z": view.z } as CSSProperties}>
        {children}
      </div>
      {panning && <div className="dv-shield" aria-hidden />}
    </div>
  );
}

export interface BoardItem { key: string; label: string; query: string }

// Board: every step or preset in order; a frame opens Play at it.
export function BoardFrames({ items, size, flow, current, onOpen, onSized }: {
  items: BoardItem[]; size: [number, number] | null; flow: boolean; current: number; onOpen: (i: number) => void; onSized: () => void;
}) {
  const frames = useRef<(HTMLIFrameElement | null)[]>([]);
  const [heights, setHeights] = useState<Record<string, number>>({});

  useEffect(() => {
    const on = (e: MessageEvent) => {
      if (e.data?.type !== "size" || size) return;
      const i = frames.current.findIndex((f) => f?.contentWindow === e.source);
      if (i >= 0) setHeights((s) => (s[items[i].key] === e.data.height ? s : { ...s, [items[i].key]: e.data.height }));
    };
    window.addEventListener("message", on);
    return () => window.removeEventListener("message", on);
  }, [items, size]);
  useEffect(onSized, [heights]);

  return <>
    {items.map((it, i) => (
      <Fragment key={it.key}>
        {flow && i > 0 && <span className="dv-board-arrow" aria-hidden>→</span>}
        <figure className="dv-item dv-board-item" aria-current={i === current}>
          <figcaption>{it.label}</figcaption>
          <div className="dv-frame" style={{ width: size ? size[0] : 480, height: size ? size[1] : heights[it.key] ?? 200 }}>
            <iframe ref={(f) => { frames.current[i] = f; }} src={`/?frame&${it.query}`} title={it.label} loading="lazy" tabIndex={-1} />
            <button type="button" className="dv-board-hit" aria-label={`Play ${it.label}`} onClick={() => onOpen(i)} />
          </div>
        </figure>
      </Fragment>
    ))}
  </>;
}

// Play: one persistent live frame. Steps, props, and viewport changes never reload it; Board only hides it.
// It also loads the registry, so it mounts before anything else shows.
export function Stage({ hidden, size, label, target, onRegistry, onSized, onZoom, onKey, onSpace }: {
  hidden: boolean; size: [number, number] | null; label: string; target: Target | null; onRegistry: (r: Registry) => void;
  onSized: () => void; onZoom: (x: number, y: number, factor: number) => void; onKey: (key: string) => void; onSpace: (down: boolean) => void;
}) {
  const ref = useRef<HTMLIFrameElement>(null);
  const latest = useRef(target);
  latest.current = target;
  const cb = useRef({ onRegistry, onZoom, onKey, onSpace });
  cb.current = { onRegistry, onZoom, onKey, onSpace };
  const [height, setHeight] = useState(200);
  const send = () => { if (latest.current) ref.current?.contentWindow?.postMessage({ type: "render", target: latest.current }, "*"); };

  useEffect(() => {
    const on = (e: MessageEvent) => {
      const f = ref.current;
      if (!f || e.source !== f.contentWindow) return;
      const d = e.data;
      if (d?.type === "ready") { if (d.registry) cb.current.onRegistry(d.registry); send(); }
      else if (d?.type === "size") setHeight(d.height);
      else if (d?.type === "zoom") {
        // Frame coordinates are unscaled; map them through the frame's on-screen box.
        const box = f.getBoundingClientRect(), s = box.width / f.offsetWidth;
        cb.current.onZoom(box.left + d.x * s, box.top + d.y * s, Math.exp(-d.deltaY * 0.01));
      } else if (d?.type === "key") cb.current.onKey(d.key);
      else if (d?.type === "space") cb.current.onSpace(d.down);
    };
    window.addEventListener("message", on);
    return () => window.removeEventListener("message", on);
  }, []);
  useEffect(send, [target]);
  useEffect(onSized, [height]);

  return (
    <figure className="dv-item dv-play" hidden={hidden}>
      <figcaption>{label}</figcaption>
      <div className="dv-frame" style={{ width: size ? size[0] : 480, height: size ? size[1] : height }}>
        <iframe ref={ref} src="/?frame&stage" title="Preview" />
      </div>
    </figure>
  );
}
