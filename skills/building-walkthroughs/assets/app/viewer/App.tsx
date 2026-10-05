import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { buildModel, groupHas, neighbors, type Group, type LensState, type Model, type Walkthrough } from "./model";
import { MapCanvas, type Insets, type MapApi, type View } from "./canvas";
import { Dock, Icon, Issues, LensBar, Navigator, groupKey, type NavMode, type Selection } from "./chrome";
import { Inspector } from "./Inspector";
import { OpenLink } from "./Markdown";
import { load, save } from "./storage";

// Every Markdown file in the root; retired/ and node_modules are outside the glob.
const sources = import.meta.glob<string>("/*.md", { query: "?raw", import: "default", eager: true });
const files = Object.fromEntries(Object.entries(sources).map(([p, s]) => [p.slice(1), s]));

const NAV_W = 272, INSPECTOR_W = 480, NARROW = "(max-width: 759px)";

/**
 * Hash: the active group as `j=<journey>` or `a=<area>`, then `w=<id>` or `p=about|run` (a group alone shows its overview),
 * `nav=areas` when the navigator groups by area, and `<lens id>=<value>` per lens.
 */
function readHash(m: Model) {
  const p = new URLSearchParams(location.hash.slice(1));
  const j = p.get("j"), a = p.get("a"), w = p.get("w"), page = p.get("p");
  const group: Group | null = m.journeys.some((x) => x.id === j) ? { kind: "journey", id: j! }
    : m.areas.some((x) => x.id === a) ? { kind: "area", id: a! } : null;
  const selection: Selection = w ? { kind: "w", id: w } : page === "about" || page === "run" ? { kind: page } : group ? { kind: "group" } : null;
  const lenses: LensState = {};
  for (const l of m.lenses) {
    const v = p.get(l.id);
    if (v && l.values.some((x) => x.id === v)) lenses[l.id] = v;
  }
  const nav: NavMode = p.get("nav") === "areas" ? "areas" : group?.kind === "area" ? "areas" : "journeys";
  return { group, selection, lenses, nav };
}
const placeKey = (group: Group | null, s: Selection) => {
  const p = new URLSearchParams();
  if (group) p.set(group.kind === "journey" ? "j" : "a", group.id);
  if (s?.kind === "w") p.set("w", s.id);
  else if (s?.kind === "about" || s?.kind === "run") p.set("p", s.kind);
  return p.toString();
};

/** The navigator group that shows `w`: the active group when it holds it, else the first group in the current mode, else its area. */
function homeOf(m: Model, w: Walkthrough, group: Group | null, mode: NavMode): Group {
  if (group && groupHas(m, group, w.id)) return group;
  const j = mode === "journeys" ? m.journeys.find((x) => x.walkthroughs.includes(w.id)) : undefined;
  return j ? { kind: "journey", id: j.id } : { kind: "area", id: w.area };
}

function useMedia(query: string) {
  const [on, setOn] = useState(() => matchMedia(query).matches);
  useEffect(() => {
    const mq = matchMedia(query);
    const ch = () => setOn(mq.matches);
    mq.addEventListener("change", ch);
    return () => mq.removeEventListener("change", ch);
  }, [query]);
  return on;
}

function useWidth() {
  const [w, setW] = useState(innerWidth);
  useEffect(() => {
    const on = () => setW(innerWidth);
    addEventListener("resize", on);
    return () => removeEventListener("resize", on);
  }, []);
  return w;
}

export function App() {
  const model = useMemo(() => buildModel(files), []);
  const initial = useMemo(() => readHash(model), [model]);
  const firstVisit = !initial.selection && !load("about-dismissed", false);

  const [group, setGroup] = useState<Group | null>(initial.group);
  const [navMode, setNavMode] = useState<NavMode>(initial.nav);
  const [expanded, setExpanded] = useState<string | null>(initial.group ? groupKey(initial.group) : null);
  const [selection, setSelection] = useState<Selection>(initial.selection ?? (firstVisit ? { kind: "about" } : null));
  const [lenses, setLenses] = useState<LensState>(initial.lenses);
  const [query, setQuery] = useState("");
  const [chrome, setChrome] = useState(true);
  const [wide, setWide] = useState(false);
  const [navCollapsed, setNavCollapsed] = useState(false);
  const [sheet, setSheet] = useState(false);
  const [issuesOpen, setIssuesOpen] = useState(false);
  const [theme, setTheme] = useState<"light" | "dark" | "">(() => load<"light" | "dark" | "">("theme", ""));
  const sysDark = useMedia("(prefers-color-scheme: dark)");
  const dark = theme ? theme === "dark" : sysDark;
  const narrow = useMedia(NARROW);
  const width = useWidth();
  const [view, setView] = useState<View>({ x: 0, y: 0, z: 1 });
  const mapApi = useRef<MapApi | null>(null);
  const searchRef = useRef<HTMLInputElement>(null);
  const journey = group?.kind === "journey" ? model.journeys.find((j) => j.id === group.id) : undefined;
  const area = group?.kind === "area" ? model.areas.find((a) => a.id === group.id) : undefined;
  const groupTitle = journey?.title ?? area?.title;

  const open = useCallback((s: Selection) => { setSelection(s); setSheet(false); }, []);
  const openId = useCallback((id: string, anchor?: string) =>
    open(id !== "index" ? { kind: "w", id } : anchor === "run-it-locally" ? { kind: "run" } : { kind: "about" }), [open]);
  /** Select a group: spotlight it, open its overview, and expand it in its mode. */
  const selectGroup = useCallback((g: Group) => {
    setGroup(g);
    setNavMode(g.kind === "journey" ? "journeys" : "areas");
    setExpanded(groupKey(g));
    open({ kind: "group" });
  }, [open]);
  /** A group header: select it, or clear it when its overview is already showing. */
  const onGroup = useCallback((g: Group) => {
    if (group && groupKey(group) === groupKey(g) && selection?.kind === "group") { setGroup(null); setExpanded(null); open(null); }
    else selectGroup(g);
  }, [group, selection, open, selectGroup]);
  const onChild = useCallback((g: Group, id: string) => { setGroup(g); setExpanded(groupKey(g)); open({ kind: "w", id }); }, [open]);
  /** Close one level: a walkthrough returns to the active group's overview; the overview clears the group. */
  const close = useCallback(() => {
    if (selection?.kind === "w" && group) open({ kind: "group" });
    else if (selection?.kind === "group") { setGroup(null); open(null); }
    else open(null);
  }, [selection, group, open]);
  const setLens = useCallback((id: string, value: string) => setLenses((l) => ({ ...l, [id]: value })), []);

  // Remember that the first-visit About page was dismissed.
  const wasAbout = useRef(selection?.kind === "about");
  useEffect(() => {
    if (wasAbout.current && selection?.kind !== "about") save("about-dismissed", true);
    wasAbout.current = selection?.kind === "about";
  }, [selection]);

  useEffect(() => {
    if (theme) document.documentElement.dataset.theme = theme;
    else delete document.documentElement.dataset.theme;
    save("theme", theme || null);
  }, [theme]);

  // URL hash mirrors the view; a new place is a history entry, a lens or navigator mode change replaces it.
  useEffect(() => {
    const p = new URLSearchParams(placeKey(group, selection));
    if (selection?.kind === "group" && !group) return;
    if (navMode === "areas") p.set("nav", "areas");
    for (const l of model.lenses) if (lenses[l.id]) p.set(l.id, lenses[l.id]);
    const next = `#${p}`;
    if (next === location.hash || (next === "#" && !location.hash)) return;
    const h = readHash(model);
    const moved = placeKey(h.group, h.selection) !== placeKey(group, selection);
    history[moved ? "pushState" : "replaceState"](null, "", next === "#" ? location.pathname + location.search : next);
  }, [model, group, selection, navMode, lenses]);
  useEffect(() => {
    const on = () => {
      const h = readHash(model);
      setGroup(h.group);
      setSelection(h.selection);
      setLenses(h.lenses);
      setNavMode(h.nav);
      if (h.group) setExpanded(groupKey(h.group));
    };
    addEventListener("popstate", on);
    return () => removeEventListener("popstate", on);
  }, [model]);

  const selected = selection?.kind === "w" ? model.walkthroughs.get(selection.id) : undefined;
  useEffect(() => {
    document.title = `${selected?.title ?? groupTitle ?? "Walkthroughs"} · ${model.app}`;
  }, [selected, groupTitle, model.app]);

  // Reveal a walkthrough selected anywhere: switch the navigator's mode only when needed, and expand the group that holds it.
  useEffect(() => {
    if (!selected) return;
    const home = homeOf(model, selected, group, navMode);
    setNavMode(home.kind === "journey" ? "journeys" : "areas");
    setExpanded(groupKey(home));
    // Keyed on the selection only, so switching modes by hand afterwards stays put.
  }, [model, selected?.id]);

  useEffect(() => {
    const on = (e: KeyboardEvent) => {
      const typing = (e.target as HTMLElement).closest?.("input, textarea, select, [contenteditable='true']");
      if (e.key === "Escape") {
        if (typing) { if (query) setQuery(""); (e.target as HTMLElement).blur(); }
        else if (issuesOpen) setIssuesOpen(false);
        else if (sheet) setSheet(false);
        else if (selection) close();
        else if (group) setGroup(null);
        else if (query) setQuery("");
        else return;
        e.preventDefault();
        return;
      }
      if (typing || e.metaKey || e.ctrlKey || e.altKey) return;
      if (e.key === "\\") setChrome((c) => !c);
      else if ((e.key === "ArrowRight" || e.key === "ArrowLeft") && selected) {
        const nb = neighbors(model, selected.id, journey);
        const to = e.key === "ArrowRight" ? nb.next : nb.prev;
        if (!to) return;
        open({ kind: "w", id: to.id });
      } else if (e.key === "f") mapApi.current?.fit();
      else if (e.key === "t") setTheme(dark ? "light" : "dark");
      else if (e.key === "/") {
        setChrome(true);
        if (narrow) setSheet(true); else setNavCollapsed(false);
        requestAnimationFrame(() => searchRef.current?.focus());
      } else return;
      e.preventDefault();
    };
    addEventListener("keydown", on);
    return () => removeEventListener("keydown", on);
  }, [model, query, issuesOpen, sheet, selection, selected, group, journey, close, open, dark, narrow]);

  const inspectorW = Math.min(width - 32, wide ? Math.max(INSPECTOR_W, width * 0.5) : INSPECTOR_W);
  const sidebarOpen = selection != null;
  const insets: Insets = useMemo(() => ({
    left: chrome && !narrow && !navCollapsed ? 16 + NAV_W + 16 : 16,
    right: chrome && !narrow && sidebarOpen ? 16 + inspectorW + 16 : 16,
    top: chrome ? 68 : 16,
    bottom: chrome ? 84 : 16,
  }), [chrome, narrow, navCollapsed, sidebarOpen, inspectorW]);
  const center = narrow ? undefined : { left: (insets.left + width - insets.right) / 2 };
  const closeLabel = selection?.kind === "w" && groupTitle ? `Back to ${groupTitle}` : selection?.kind === "group" ? `Close ${journey ? "the journey" : "the area"}` : "Close sidebar";

  return (
    <OpenLink.Provider value={openId}>
      <div className={`wt${chrome ? "" : " wt-hidden"}${narrow ? " wt-narrow" : ""}`}>
        <MapCanvas model={model} journey={journey} area={area} lenses={lenses} query={query} selected={selected?.id}
          view={view} setView={setView} insets={insets} narrow={narrow} apiRef={mapApi} onSelect={openId} />

        <div className="wt-chrome">
          {(!narrow || sheet) && (
            <Navigator model={model} mode={navMode} setMode={setNavMode} group={group} expanded={expanded} selection={selection} lenses={lenses}
              query={query} setQuery={setQuery} searchRef={searchRef} collapsed={navCollapsed} setCollapsed={setNavCollapsed} narrow={narrow}
              onClose={() => setSheet(false)} onGroup={onGroup} onChild={onChild} onSelect={openId} onPage={(p) => open({ kind: p })} />
          )}
          {narrow && sheet && <button type="button" className="wt-scrim" aria-label="Close navigator" onClick={() => setSheet(false)} />}

          {(narrow || model.lenses.length > 0) && (
            <div className="wt-top" style={narrow ? undefined : { ...center, maxWidth: width - insets.left - insets.right - 16 }}>
              {narrow && (
                <button type="button" className="wt-btn wt-glass wt-menu" aria-label="Open navigator" aria-expanded={sheet} onClick={() => setSheet(true)}>
                  <Icon name="menu" /><span>{model.app}</span>
                </button>
              )}
              <LensBar model={model} lenses={lenses} setLens={setLens} />
            </div>
          )}

          {selection && (
            <Inspector model={model} selection={selection} journey={journey} area={area} dark={dark} open={open}
              selectGroup={selectGroup} expanded={wide} setExpanded={setWide} onClose={close} closeLabel={closeLabel}
              style={narrow ? {} : { width: inspectorW }} />
          )}

          {issuesOpen && <Issues issues={model.issues} onClose={() => setIssuesOpen(false)} />}

          <Dock style={center}>
            {!narrow && <>
              <button type="button" className="wt-icon" aria-label="Zoom out" onClick={() => mapApi.current?.zoom(1 / 1.25)}><Icon name="minus" /></button>
              <span className="wt-zoom" aria-label="Zoom level">{Math.round(view.z * 100)}%</span>
              <button type="button" className="wt-icon" aria-label="Zoom in" onClick={() => mapApi.current?.zoom(1.25)}><Icon name="plus" /></button>
              <button type="button" className="wt-icon" aria-label="Fit the map (f)" title="Fit (f)" onClick={() => mapApi.current?.fit()}><Icon name="fit" /></button>
              <span className="wt-sep" />
            </>}
            <button type="button" className="wt-icon" aria-label={dark ? "Switch to light theme (t)" : "Switch to dark theme (t)"} title="Theme (t)" onClick={() => setTheme(dark ? "light" : "dark")}><Icon name="theme" /></button>
            {model.issues.length > 0 && (
              <button type="button" className="wt-btn wt-warn" aria-expanded={issuesOpen} onClick={() => setIssuesOpen((o) => !o)}>
                <Icon name="warn" />{model.issues.length}<span className="wt-hide-narrow"> issue{model.issues.length > 1 ? "s" : ""}</span>
              </button>
            )}
          </Dock>
        </div>
      </div>
    </OpenLink.Provider>
  );
}
