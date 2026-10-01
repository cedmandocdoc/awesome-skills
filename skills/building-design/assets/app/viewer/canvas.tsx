import { Fragment, useEffect, useLayoutEffect, useRef, useState, type CSSProperties, type PointerEvent as RPointerEvent } from "react";
import { SIZES, type Registry, type Target, type Vp } from "./meta";
import type { Viewport } from "../system/define";

export interface View { x: number; y: number; z: number }

export function useWindowSize() {
  const [size, setSize] = useState({ w: window.innerWidth, h: window.innerHeight });
  useEffect(() => {
    const on = () => setSize({ w: window.innerWidth, h: window.innerHeight });
    window.addEventListener("resize", on);
    return () => window.removeEventListener("resize", on);
  }, []);
  return size;
}

// One persistent frame: steps, props, and viewport changes never reload it.
export function Stage({ visible, vp, target, chrome, onRegistry }: {
  visible: boolean; vp: Vp; target: Target | null; chrome: boolean; onRegistry: (r: Registry) => void;
}) {
  const ref = useRef<HTMLIFrameElement>(null);
  const latest = useRef(target);
  latest.current = target;
  const win = useWindowSize();
  const send = () => { if (latest.current) ref.current?.contentWindow?.postMessage({ type: "render", target: latest.current }, "*"); };

  useEffect(() => {
    const on = (e: MessageEvent) => {
      if (e.source !== ref.current?.contentWindow || e.data?.type !== "ready") return;
      if (e.data.registry) onRegistry(e.data.registry);
      send();
    };
    window.addEventListener("message", on);
    return () => window.removeEventListener("message", on);
  }, [onRegistry]);
  useEffect(send, [target]);

  let style: CSSProperties = {};
  if (vp !== "full") {
    const [w, h] = SIZES[vp];
    const top = 20, bottom = chrome ? 92 : 20;
    const scale = Math.min(1, (win.w - 40) / w, (win.h - top - bottom) / h);
    style = { width: w, height: h, left: win.w / 2, top: top + (win.h - top - bottom) / 2, transform: `translate(-50%, -50%) scale(${scale})` };
  }
  return (
    <div className={`dv-stage${visible ? "" : " dv-off"}${vp === "full" ? " dv-full" : ""}`}>
      <iframe ref={ref} src="/?frame&stage" title="Preview" style={style} />
    </div>
  );
}

export interface BoardItem { key: string; label: string; query: string }

// Figma-like canvas: frames in order, pan by scroll or drag, zoom with ⌘/Ctrl + scroll.
export function Board({ items, vp, flow, view, setView, fitNonce, onOpen }: {
  items: BoardItem[]; vp: Viewport | null; flow: boolean; view: View; setView: (v: View) => void; fitNonce: number; onOpen: (i: number) => void;
}) {
  const root = useRef<HTMLDivElement>(null);
  const content = useRef<HTMLDivElement>(null);
  const frames = useRef<(HTMLIFrameElement | null)[]>([]);
  const [heights, setHeights] = useState<Record<string, number>>({});
  const viewRef = useRef(view);
  viewRef.current = view;
  const [w, h] = vp ? SIZES[vp] : [480, 0];

  useEffect(() => {
    const on = (e: MessageEvent) => {
      if (e.data?.type !== "size" || vp) return;
      const i = frames.current.findIndex((f) => f?.contentWindow === e.source);
      if (i >= 0) setHeights((s) => (s[items[i].key] === e.data.height ? s : { ...s, [items[i].key]: e.data.height }));
    };
    window.addEventListener("message", on);
    return () => window.removeEventListener("message", on);
  }, [items, vp]);

  useLayoutEffect(() => {
    const r = root.current, c = content.current;
    if (!r || !c) return;
    const z = Math.min(1, (r.clientWidth - 160) / c.offsetWidth, (r.clientHeight - 220) / c.offsetHeight);
    setView({ z, x: (r.clientWidth - c.offsetWidth * z) / 2, y: Math.max(80, (r.clientHeight - c.offsetHeight * z) / 2 - 30) });
  }, [fitNonce]);

  useEffect(() => {
    const r = root.current!;
    const wheel = (e: WheelEvent) => {
      e.preventDefault();
      const v = viewRef.current;
      if (e.ctrlKey || e.metaKey) {
        const z = Math.min(2, Math.max(0.05, v.z * Math.exp(-e.deltaY * 0.01)));
        const box = r.getBoundingClientRect(), px = e.clientX - box.left, py = e.clientY - box.top;
        setView({ z, x: px - ((px - v.x) * z) / v.z, y: py - ((py - v.y) * z) / v.z });
      } else setView({ ...v, x: v.x - e.deltaX, y: v.y - e.deltaY });
    };
    r.addEventListener("wheel", wheel, { passive: false });
    return () => r.removeEventListener("wheel", wheel);
  }, [setView]);

  const drag = (e: RPointerEvent) => {
    if ((e.target as HTMLElement).closest(".dv-board-hit")) return;
    const start = { x: e.clientX, y: e.clientY, v: viewRef.current };
    const el = e.currentTarget as HTMLElement;
    el.setPointerCapture(e.pointerId);
    const move = (m: PointerEvent) => setView({ ...start.v, x: start.v.x + m.clientX - start.x, y: start.v.y + m.clientY - start.y });
    const up = () => { el.removeEventListener("pointermove", move); el.removeEventListener("pointerup", up); };
    el.addEventListener("pointermove", move);
    el.addEventListener("pointerup", up);
  };

  return (
    <div ref={root} className="dv-board" onPointerDown={drag}>
      <div ref={content} className={`dv-board-content${flow ? "" : " dv-board-wrap"}`} style={{ transform: `translate(${view.x}px, ${view.y}px) scale(${view.z})`, "--z": view.z } as CSSProperties}>
        {items.map((it, i) => (
          <Fragment key={it.key}>
            {flow && i > 0 && <span className="dv-board-arrow" aria-hidden>→</span>}
            <figure className="dv-board-item">
              <figcaption>{it.label}</figcaption>
              <div className="dv-board-frame" style={{ width: w, height: vp ? h : heights[it.key] ?? 200 }}>
                <iframe ref={(f) => { frames.current[i] = f; }} src={`/?frame&${it.query}`} title={it.label} loading="lazy" tabIndex={-1} />
                <button type="button" className="dv-board-hit" aria-label={`Play ${it.label}`} onClick={() => onOpen(i)} />
              </div>
            </figure>
          </Fragment>
        ))}
      </div>
    </div>
  );
}
