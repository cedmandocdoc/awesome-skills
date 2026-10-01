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

  // Board frames size themselves to a UI block's content.
  useEffect(() => {
    const el = fit.current;
    if (!el || window.parent === window) return;
    const ro = new ResizeObserver(() => window.parent.postMessage({ type: "size", height: el.offsetHeight + 64 }, "*"));
    ro.observe(el);
    return () => ro.disconnect();
  }, [target?.id]);

  const r = target && resolve(target);
  if (!target || !r) return <p className="dv-frame-empty">Nothing to render{target ? ` for ${target.id}` : ""}.</p>;
  const node = <Boundary key={`${target.id}:${target.key}`}><r.Component {...r.props} /></Boundary>;
  return target.id.startsWith("ui/")
    ? <div className="dv-frame-ui"><div ref={fit} className="dv-frame-fit">{node}</div></div>
    : node;
}
