import { createContext, useContext, useEffect, useMemo, useRef, useState, type MouseEvent } from "react";
import { marked } from "marked";
import mermaid from "mermaid";

let diagrams = 0;

/** Opens a walkthrough by id; `index` opens About, or Run locally for its `#run-it-locally` anchor. Provided by App. */
export const OpenLink = createContext<(id: string, anchor?: string) => void>(() => {});

/** `<id>.md` links open in the sidebar; every other link opens a new tab so the map stays put. */
function useFollow() {
  const open = useContext(OpenLink);
  return (e: MouseEvent) => {
    const a = (e.target as HTMLElement).closest("a");
    const href = a?.getAttribute("href") ?? "";
    if (!a || !href || href.startsWith("#")) return;
    const m = /^(?:\.\/)?([\w-]+)\.md(?:#(.*))?$/.exec(href);
    if (m) {
      e.preventDefault();
      open(m[1], m[2]);
    } else a.target = "_blank";
  };
}

function Body({ source, dark, className = "" }: { source: string; dark: boolean; className?: string }) {
  const ref = useRef<HTMLDivElement>(null);
  const follow = useFollow();
  const html = useMemo(() => marked.parse(source, { async: false }), [source]);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    mermaid.initialize({ startOnLoad: false, theme: dark ? "dark" : "neutral", securityLevel: "strict", fontFamily: "inherit" });
    el.querySelectorAll<HTMLElement>("code.language-mermaid").forEach(async (code) => {
      const pre = code.parentElement!;
      try {
        const { svg } = await mermaid.render(`wt-mermaid-${++diagrams}`, code.textContent ?? "");
        const fig = document.createElement("figure");
        fig.className = "wt-diagram";
        fig.innerHTML = svg;
        pre.replaceWith(fig);
      } catch (e) {
        pre.classList.add("wt-diagram-error");
        pre.title = String(e);
      }
    });
  }, [html, dark]);

  return <div ref={ref} className={`wt-md ${className}`} onClick={follow} dangerouslySetInnerHTML={{ __html: html }} />;
}

/** Remounts on theme change so mermaid re-renders the diagrams in the new theme. */
export const Markdown = (p: { source: string; dark: boolean; className?: string }) => <Body key={String(p.dark)} {...p} />;

export function Inline({ source, className }: { source: string; className?: string }) {
  const follow = useFollow();
  const html = useMemo(() => marked.parseInline(source, { async: false }), [source]);
  return <span className={className} onClick={follow} dangerouslySetInnerHTML={{ __html: html }} />;
}

export function Copy({ text }: { text: string }) {
  const [done, setDone] = useState(false);
  const copy = async () => {
    try {
      await navigator.clipboard.writeText(text);
      setDone(true);
      setTimeout(() => setDone(false), 1400);
    } catch {
      setDone(false);
    }
  };
  return (
    <span className="wt-cmd">
      <code>{text}</code>
      <button type="button" className="wt-chip" onClick={copy} aria-label={`Copy ${text}`}>{done ? "Copied" : "Copy"}</button>
    </span>
  );
}
