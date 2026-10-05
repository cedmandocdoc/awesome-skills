import { Fragment, useMemo, useState, type CSSProperties, type ReactNode } from "react";
import { BASELINE, actorTitle, areaOrder, coverage, journeySteps, journeyWalkthroughs, neighbors, plain, routeTo, tasksOf, variationsOf, type Area, type Group, type Journey, type Model, type Step, type Walkthrough } from "./model";
import { Copy, Inline, Markdown } from "./Markdown";
import { Icon, type Selection } from "./chrome";

interface Shell { expanded: boolean; setExpanded: (e: boolean) => void; onClose: () => void; closeLabel: string; style: CSSProperties }

function Frame({ shell, label, head, children, foot }: { shell: Shell; label: string; head: ReactNode; children: ReactNode; foot?: ReactNode }) {
  return (
    <aside className="wt-inspector wt-glass" aria-label={label} style={shell.style}>
      <header className="wt-ins-head">
        <div className="wt-ins-tools">
          <button type="button" className="wt-icon" aria-label={shell.expanded ? "Narrow the sidebar" : "Widen the sidebar"} aria-pressed={shell.expanded}
            onClick={() => shell.setExpanded(!shell.expanded)}><Icon name={shell.expanded ? "shrink" : "expand"} /></button>
          <button type="button" className="wt-icon" aria-label={`${shell.closeLabel} (Esc)`} title={shell.closeLabel} onClick={shell.onClose}><Icon name="close" /></button>
        </div>
        {head}
      </header>
      <div className="wt-ins-body">{children}</div>
      {foot && <footer className="wt-ins-foot">{foot}</footer>}
    </aside>
  );
}

const Actors = ({ model, ids }: { model: Model; ids: string[] }) => <>{ids.map((a) => <span key={a} className="wt-badge">{actorTitle(model, a)}</span>)}</>;

/** "A", "A and B", "A, B, and C" from rendered parts. */
function Series({ parts }: { parts: ReactNode[] }) {
  return <>{parts.map((p, i) => <Fragment key={i}>{i > 0 && (parts.length > 2 ? ", " : " ")}{i > 0 && i === parts.length - 1 && "and "}{p}</Fragment>)}</>;
}

/** The replay route in plain words: the nearest checkpoint, else the baseline, then the walkthroughs left to do. */
function StartingFresh({ model, w, go, open }: { model: Model; w: Walkthrough; go: (id: string) => void; open: (s: Selection) => void }) {
  const route = routeTo(model, w.id);
  const baseline = model.baselines.find((b) => BASELINE + b.id === route[0]);
  const chain = route.slice(1, -1).map((r) => model.walkthroughs.get(r)).filter((r): r is Walkthrough => !!r);
  const at = chain.map((r) => !!r.checkpoint).lastIndexOf(true);
  const todo = chain.slice(at + 1);
  const link = (r: Walkthrough) => <button key={r.id} type="button" className="wt-link" onClick={() => go(r.id)}><i>{r.title}</i></button>;
  const then = todo.length > 0 && <>, then do <Series parts={todo.map(link)} /> first{todo.length > 1 && ", in that order"}</>;
  return (
    <details className="wt-disclosure wt-fresh">
      <summary>Starting fresh?</summary>
      <p>
        {at >= 0 ? <>Skip ahead with <Copy text={chain[at].checkpoint!} />, which ends where {link(chain[at])} ends{then}.</>
          : baseline?.setup ? <>Reset with <Copy text={baseline.setup} />{then}.</>
          : <>Start from <button type="button" className="wt-link" onClick={() => open({ kind: "run" })}>{baseline?.title ?? route[0].replace(BASELINE, "")}</button>{then}.</>}
      </p>
    </details>
  );
}

function WalkthroughPanel({ model, w, journey, dark, shell, open }: {
  model: Model; w: Walkthrough; journey?: Journey; dark: boolean; shell: Shell; open: (s: Selection) => void;
}) {
  const section = (title: string) => w.sections.find((s) => s.title === title)?.body ?? "";
  const vars = variationsOf(model, w.id);
  const parent = w.variationOf ? model.walkthroughs.get(w.variationOf) : undefined;
  const nb = neighbors(model, w.id, journey);
  const [flow, setFlow] = useState(false);
  const groups = useMemo(() => {
    const out: { actor: string; steps: Step[] }[] = [];
    for (const s of w.steps) {
      const last = out[out.length - 1];
      if (last && last.actor === s.actor) last.steps.push(s);
      else out.push({ actor: s.actor, steps: [s] });
    }
    return out;
  }, [w]);
  const go = (id: string) => open({ kind: "w", id });
  const sequence = `${nb.kind === "journey" ? "Journey" : "Area"}: ${nb.along} · ${nb.pos} of ${nb.total}`;
  const cases = section("Cases"), tryIt = section("Try it yourself");

  const head = <>
    {parent && <p className="wt-eyebrow">Variation of <a href={`#w=${parent.id}`} onClick={(e) => { e.preventDefault(); go(parent.id); }}>{parent.title}</a></p>}
    <h1 className="wt-ins-title">{w.title}</h1>
    <p className="wt-ins-goal"><Inline source={w.goal} /></p>
    <p className="wt-card-meta"><Actors model={model} ids={w.actors} /><span>{w.steps.length} steps</span></p>
  </>;

  const foot = <>
    <p className="wt-sequence">{sequence}</p>
    <nav className="wt-prevnext" aria-label={`Along ${sequence}`}>
      {nb.prev ? <button type="button" onClick={() => go(nb.prev!.id)} aria-keyshortcuts="ArrowLeft"><small><Icon name="prev" />Previous</small><span>{nb.prev.title}</span></button> : <span />}
      {nb.next ? <button type="button" className="wt-next" onClick={() => go(nb.next!.id)} aria-keyshortcuts="ArrowRight"><small>Next<Icon name="next" /></small><span>{nb.next.title}</span></button> : <span />}
    </nav>
  </>;

  return (
    <Frame shell={shell} label={w.title} head={head} foot={foot}>
      <div className="wt-pane">
        <section className="wt-before" aria-label="Before you start">
          <h2>Before you start</h2>
          <Markdown source={section("Before you start")} dark={dark} />
          <StartingFresh model={model} w={w} go={go} open={open} />
        </section>

        <details className="wt-disclosure" onToggle={(e) => setFlow(e.currentTarget.open)}>
          <summary>Show flow</summary>
          {flow && <Markdown source={section("Flow")} dark={dark} />}
        </details>

        <h2>Steps</h2>
        {groups.map((g, gi) => (
          <section key={gi} className="wt-group" aria-label={`${g.actor}, steps ${g.steps[0].n}–${g.steps[g.steps.length - 1].n}`}>
            <header className="wt-group-head"><b>{g.actor}</b><small>{g.steps.length} step{g.steps.length > 1 ? "s" : ""}</small></header>
            <ol className="wt-steps" start={g.steps[0].n}>
              {g.steps.map((s) => (
                <li key={s.n} className="wt-step">
                  <Inline source={s.action} className="wt-step-action" />
                  <p className="wt-see"><b>You should see</b> <Inline source={s.see} /></p>
                  {s.why && <p className="wt-why"><b>Why</b> <Inline source={s.why} /></p>}
                </li>
              ))}
            </ol>
          </section>
        ))}

        {(cases || tryIt || vars.length > 0) && <section className="wt-other" aria-label="Other cases">
          <h2>Other cases</h2>
          {cases && <Markdown source={cases} dark={dark} />}
          {tryIt && <><h3>Try it yourself</h3><Markdown source={tryIt} dark={dark} /></>}
          {vars.length > 0 && <>
            <h3>Variations</h3>
            <ul className="wt-list">{vars.map((v) => <li key={v.id}><button type="button" className="wt-link" onClick={() => go(v.id)}>{v.title}</button> <span className="wt-muted">— {plain(v.goal)}</span></li>)}</ul>
          </>}
        </section>}
      </div>
    </Frame>
  );
}

function JourneyPanel({ model, journey, shell, open }: { model: Model; journey: Journey; shell: Shell; open: (s: Selection) => void }) {
  const ws = journeyWalkthroughs(model, journey);
  const start = model.journeys[0]?.id === journey.id;
  const head = <>
    <p className="wt-eyebrow"><span>Journey</span>{start && <span className="wt-tag wt-tag-start">Start here</span>}</p>
    <h1 className="wt-ins-title">{journey.title}</h1>
    <p className="wt-card-meta"><Actors model={model} ids={journey.actors} /><span>{ws.length} walkthroughs · {journeySteps(model, journey)} steps</span></p>
  </>;
  return (
    <Frame shell={shell} label={`Journey: ${journey.title}`} head={head}>
      <div className="wt-pane">
        <p className="wt-goal">{journey.goal}</p>
        <h2>In order</h2>
        <ol className="wt-journey-list">
          {ws.map((w, i) => (
            <li key={w.id}>
              <button type="button" onClick={() => open({ kind: "w", id: w.id })}>
                <b className="wt-step-badge">{i + 1}</b>
                <span>
                  <span className="wt-row-title">{w.title}</span>
                  <small>{model.areas.find((a) => a.id === w.area)?.title} · {w.actors.map((a) => actorTitle(model, a)).join(", ")} · {w.steps.length} steps</small>
                  <small className="wt-muted">{plain(w.goal)}</small>
                </span>
                <Icon name="next" />
              </button>
            </li>
          ))}
        </ol>
      </div>
    </Frame>
  );
}

function AreaPanel({ model, area, shell, open }: { model: Model; area: Area; shell: Shell; open: (s: Selection) => void }) {
  const tasks = tasksOf(model, area.id);
  const all = areaOrder(model, area.id);
  const variations = all.length - tasks.length;
  const item = (w: Walkthrough) => (
    <button type="button" onClick={() => open({ kind: "w", id: w.id })}>
      <span>
        <span className="wt-row-title">{w.title}</span>
        <small>{w.actors.map((a) => actorTitle(model, a)).join(", ")} · {w.steps.length} steps</small>
        <small className="wt-muted">{plain(w.goal)}</small>
      </span>
      <Icon name="next" />
    </button>
  );
  const head = <>
    <p className="wt-eyebrow">Area</p>
    <h1 className="wt-ins-title">{area.title}</h1>
    <p className="wt-card-meta"><span>{tasks.length} walkthroughs{variations > 0 && ` · ${variations} variation${variations > 1 ? "s" : ""}`} · {all.reduce((n, w) => n + w.steps.length, 0)} steps</span></p>
  </>;
  return (
    <Frame shell={shell} label={`Area: ${area.title}`} head={head}>
      <div className="wt-pane">
        {area.summary && <p className="wt-goal">{area.summary}</p>}
        <h2>Walkthroughs</h2>
        <ul className="wt-journey-list">
          {tasks.map((t) => {
            const vars = variationsOf(model, t.id);
            return (
              <li key={t.id}>
                {item(t)}
                {vars.length > 0 && <ul className="wt-journey-list wt-nested" aria-label={`Variations of ${t.title}`}>{vars.map((v) => <li key={v.id}>{item(v)}</li>)}</ul>}
              </li>
            );
          })}
        </ul>
        {!tasks.length && <p className="wt-note">No walkthroughs in this area yet — see Coverage in About.</p>}
      </div>
    </Frame>
  );
}

function AboutPanel({ model, dark, shell, open, selectGroup }: { model: Model; dark: boolean; shell: Shell; open: (s: Selection) => void; selectGroup: (g: Group) => void }) {
  const first = model.journeys[0];
  const by = coverage(model);
  const covered = model.surfaces.filter((s) => by.get(s.id)?.length).length;
  const gaps = model.surfaces.filter((s) => s.gap);
  const head = <><p className="wt-eyebrow">About</p><h1 className="wt-ins-title">{model.app}</h1></>;
  return (
    <Frame shell={shell} label={`About ${model.app}`} head={head}>
      <div className="wt-pane">
        <Markdown source={model.overview} dark={dark} />
        {first && (
          <div className="wt-start-card">
            <p><b>{first.title}</b> — {first.goal}</p>
            <button type="button" className="wt-btn primary" onClick={() => selectGroup({ kind: "journey", id: first.id })}><Icon name="play" />Start with {first.title}</button>
          </div>
        )}
        <h2>Journeys</h2>
        <ol className="wt-plain-list">
          {model.journeys.map((j) => (
            <li key={j.id}><button type="button" className="wt-link" onClick={() => selectGroup({ kind: "journey", id: j.id })}>{j.title}</button>
              <span className="wt-muted"> — {j.actors.map((a) => actorTitle(model, a)).join(", ")} · {j.walkthroughs.length} walkthroughs</span></li>
          ))}
        </ol>
        <h2>Areas</h2>
        <ul className="wt-plain-list">
          {model.areas.map((a) => (
            <li key={a.id}><button type="button" className="wt-link" onClick={() => selectGroup({ kind: "area", id: a.id })}><b>{a.title}</b></button>{a.summary && <span className="wt-muted"> — {a.summary}</span>}
              <span className="wt-muted"> · {tasksOf(model, a.id).length} walkthroughs</span></li>
          ))}
        </ul>
        <h2>Coverage</h2>
        <p className="wt-coverage"><b>{covered}/{model.surfaces.length}</b> screens covered
          <span className="wt-bar" aria-hidden><span style={{ width: `${model.surfaces.length ? (covered / model.surfaces.length) * 100 : 0}%` }} /></span></p>
        {gaps.length > 0 && <>
          <p className="wt-note">Not covered, with the reason:</p>
          <ul className="wt-list wt-gaps">{gaps.map((s) => <li key={s.id}><code>{s.id}</code> {s.title} — <span className="wt-muted">{s.gap}</span></li>)}</ul>
        </>}
        <p><button type="button" className="wt-btn" onClick={() => open({ kind: "run" })}><Icon name="run" />Run it locally</button></p>
      </div>
    </Frame>
  );
}

function RunPanel({ model, dark, shell }: { model: Model; dark: boolean; shell: Shell }) {
  const head = <><p className="wt-eyebrow">{model.app}</p><h1 className="wt-ins-title">Run it locally</h1></>;
  return <Frame shell={shell} label="Run it locally" head={head}><div className="wt-pane"><Markdown source={model.run} dark={dark} /></div></Frame>;
}

export function Inspector({ model, selection, journey, area, dark, open, selectGroup, ...shell }: Shell & {
  model: Model; selection: Exclude<Selection, null>; journey?: Journey; area?: Area;
  dark: boolean; open: (s: Selection) => void; selectGroup: (g: Group) => void;
}) {
  if (selection.kind === "about") return <AboutPanel model={model} dark={dark} shell={shell} open={open} selectGroup={selectGroup} />;
  if (selection.kind === "run") return <RunPanel model={model} dark={dark} shell={shell} />;
  if (selection.kind === "group") {
    return journey ? <JourneyPanel model={model} journey={journey} shell={shell} open={open} />
      : area ? <AreaPanel model={model} area={area} shell={shell} open={open} /> : null;
  }
  const w = model.walkthroughs.get(selection.id);
  if (!w) {
    return (
      <Frame shell={shell} label="Not found" head={<h1 className="wt-ins-title">Walkthrough not found</h1>}>
        <p className="wt-note">No walkthrough has the id <code>{selection.id}</code>.</p>
      </Frame>
    );
  }
  return <WalkthroughPanel key={w.id} model={model} w={w} journey={journey} dark={dark} shell={shell} open={open} />;
}
