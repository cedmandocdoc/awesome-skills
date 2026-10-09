import { Component, useEffect, useRef, useState, type ReactNode } from "react";
import "../system/tokens.css";
import "../system/type.css";
import "../system/motion.css";
import "./frame.css";
import { registry, resolve } from "./registry";
import type { Target } from "./meta";

const q = new URLSearchParams(location.search);
const initial: Target | null = q.get("id")
  ? { id: q.get("id")!, state: q.get("state") ?? undefined, preset: q.get("preset") ?? undefined, key: 0 }
  : null;

class Boundary extends Component<{ children: ReactNode }, { error?: Error }> {
  state: { error?: Error } = {};
  static getDerivedStateFromError(error: Error) { return { error }; }
  render() {
    return this.state.error ? <pre className="dv-frame-error">{this.state.error.stack ?? String(this.state.error)}</pre> : this.props.children;
  }
}

export function Frame() {
  const [target, setTarget] = useState(initial);
  const fit = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (window.parent === window) return;
    const on = (e: MessageEvent) => { if (e.source === window.parent && e.data?.type === "render") setTarget(e.data.target); };
    window.addEventListener("message", on);
    window.parent.postMessage({ type: "ready", registry: q.has("stage") ? registry : undefined }, "*");
    return () => window.removeEventListener("message", on);
  }, []);

  // The live stage stays interactive: it hands the viewer zoom gestures, shortcuts, and space-to-pan the screen leaves unused.
  useEffect(() => {
    if (window.parent === window || !q.has("stage")) return;
    const post = (m: object) => window.parent.postMessage(m, "*");
    const editable = (t: EventTarget | null) => (t as HTMLElement | null)?.closest?.("input, select, textarea, [contenteditable='true']");
    const wheel = (e: WheelEvent) => {
      if (!e.ctrlKey && !e.metaKey) return;
      e.preventDefault();
      post({ type: "zoom", x: e.clientX, y: e.clientY, deltaY: e.deltaY });
    };
    const key = (e: KeyboardEvent) => {
      if (e.defaultPrevented || e.metaKey || e.ctrlKey || e.altKey || editable(e.target)) return;
      if (e.key === " ") {
        if (e.type === "keydown" && !(e.target as HTMLElement).closest("button, a, summary, [role='button']")) e.preventDefault();
        post({ type: "space", down: e.type === "keydown" });
      } else if (e.type === "keydown" && /^(\\|[bprtf123]|ArrowLeft|ArrowRight)$/i.test(e.key)) post({ type: "key", key: e.key });
    };
    const blur = () => post({ type: "space", down: false });
    window.addEventListener("wheel", wheel, { passive: false });
    window.addEventListener("keydown", key);
    window.addEventListener("keyup", key);
    window.addEventListener("blur", blur);
    return () => {
      window.removeEventListener("wheel", wheel);
      window.removeEventListener("keydown", key);
      window.removeEventListener("keyup", key);
      window.removeEventListener("blur", blur);
    };
  }, []);

  // Board frames size themselves to a UI block's content.
  useEffect(() => {
    const el = fit.current;
    if (!el || window.parent === window) return;
    const ro = new ResizeObserver(() => window.parent.postMessage({ type: "size", height: el.offsetHeight + 64 }, "*"));
    ro.observe(el);
    return () => ro.disconnect();
  }, [target?.id]);

  const r = target && resolve(target);

  // A state below the first viewport opens scrolled to where it happens; stepping in Play glides there.
  const mounted = useRef("");
  useEffect(() => {
    const at = r?.at;
    const instance = target ? `${target.id}:${target.key}` : "";
    const fresh = mounted.current !== instance;
    mounted.current = instance;
    if (!at) return;
    const id = requestAnimationFrame(() =>
      document.querySelector(`[data-slot="${at}"], [data-motion="${at}"]`)?.scrollIntoView({ block: "start", behavior: fresh ? "instant" : "smooth" }));
    return () => cancelAnimationFrame(id);
  }, [target, r?.at]);

  if (!target || !r) return <p className="dv-frame-empty">Nothing to render{target ? ` for ${target.id}` : ""}.</p>;
  const node = <Boundary key={`${target.id}:${target.key}`}><r.Component {...r.props} /></Boundary>;
  return target.id.startsWith("ui/")
    ? <div className="dv-frame-ui"><div ref={fit} className="dv-frame-fit">{node}</div></div>
    : node;
}
