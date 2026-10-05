# Walkthrough Contract

## Overview

Shared rules for every recipe: where walkthroughs live, the model this skill derives from any app's code, complete coverage, lenses, the frontmatter and Markdown shape the viewer and `npm run check` read, and how each walkthrough is written. A walkthrough is a document for understanding the app by using it. It has no status, progress, or run log, and nothing waits on it.

## Guidelines

### Author signature

Static UUID identifying walkthrough roots created by this skill:

```text
2f1b6e9a-e16d-4361-93a9-bccb7508bc90
```

Every `<walkthroughs-root>/index.md` carries this value in frontmatter `author`.

### Output layout

```text
<walkthroughs-root>/            # default: walkthroughs/
  index.md                      # root marker: app, baselines, areas, actors, journeys, lenses, surfaces; overview, run-it-locally, generated blocks
  <slug>.md                     # one walkthrough per task or variation; slug = id
  files/                        # optional: input files the walkthroughs link to (imports, uploads)
  retired/<slug>.md             # tasks that left the app; the viewer and check skip them
  index.html  package.json  vite.config.ts  tsconfig.json  .gitignore   # viewer — copied, never edited
  viewer/  scripts/             # viewer and check — copied, never edited
```

Never read `node_modules/` or `dist/`.

### Resolve walkthroughs root

1. Search the repository for `index.md` files whose frontmatter has `doc_type: walkthroughs-index`, `generated_by: building-walkthroughs`, and `author` = **Author signature**.
2. One match → use it. Several → ask, listing each path. None → **Setup** → **Initialize walkthroughs root** on Create; stop and report on other recipes.
3. A root whose `index.md` has `lines` was built by 1.x: on Create or Update, rewrite it to this contract with Create from step 2 and replace the 1.x standing rule line; on Guide, offer that and stop.
4. Read and write only under the resolved root, except the instruction files in `SKILL.md` → **Setup**.

### Model

The skill structures every app with its own five concepts. Find each in the code first; other sources only sharpen it.

| Concept | What it is | Found in code | Sharpened by |
| --- | --- | --- | --- |
| **Area** | A place in the app | The app's own navigation: menus, tabs, route groups. The map mirrors it | Feature docs, README sections |
| **Task** (one walkthrough) | One thing a person gets done | Routes, screens, forms, actions or mutations, buttons | User stories, tickets, tests |
| **Variation** | An alternate or error path of a task where the steps differ | Error states, validation messages, status branches | Alternate-path docs, test cases |
| **Journey** | A goal a person reaches by chaining tasks across areas, in order | Which tasks feed which (data and status dependencies), and which actor does each | User journeys, personas, onboarding docs |
| **Actor** | Who acts | Roles and permissions in auth or route guards | Personas |

With no docs, derive journeys by asking what each actor comes to the app to get done, then chain the tasks that deliver it in dependency order. The first journey is the one a newcomer should follow first.

### Inputs

| Need | Required | Sources |
| --- | --- | --- |
| Code | yes | Navigation, routes, screens, actions or mutations, guards, data model, UI strings |
| App purpose | yes | README or other docs; otherwise ask the user what the app is for |
| Run the app | yes | README, package scripts, compose files, `.env.example` |
| Baselines | yes | Reset, seed, sandbox, or sign-up paths that give a reproducible start |
| Accounts | when the app has logins | Seeds, fixtures, `.env.example` |
| Specs, stories, tickets, tests, design files | optional | Exact labels, expected values, intent, links for **Why** |

Ask once for every required row the sources leave empty. Building seeds belongs to other work.

### Coverage

Coverage is complete by default:

- A **surface** is a user-facing route or screen. Declare each one in `index.md` → `surfaces` with its `area`.
- Every surface appears in at least one walkthrough's `surfaces`, or carries `gap: "<reason>: <what, in one line>"`. Valid reasons:

| Reason | When |
| --- | --- |
| `needs-setup` | Needs data or an outside service the baselines lack (name it) |
| `internal` | Internal, admin-only, or dev-only screen |
| `not-built` | Reachable but not built yet |

- Priority is never a gap reason, and writing order is never a cut-off.
- `npm run check` fails on a declared surface that is neither covered nor a gap, a gap that a walkthrough covers, and a walkthrough surface that is not declared.

### Lenses

A **lens** is a global highlight: it changes emphasis on the map, never hides anything, and never navigates. A dimension may be a lens only when all four hold; `npm run check` enforces 1, 2, and 4:

1. Every walkthrough has a value.
2. It has 2–6 values from a fixed list declared in `index.md`, and each value covers at least 2 walkthroughs.
3. It answers "show me what's relevant to me".
4. It does not repeat areas or journeys.

- **Actor** is the default lens (**View as**), derived from walkthrough `actors`; it appears when 2–6 actors each act in at least 2 walkthroughs. Never declare it.
- At most 2 lenses in total, counting Actor. Typical second lenses: Surface (web, mobile) when the app ships on both; Plan (free, pro) when features are gated.
- No qualifying dimension (one actor, one surface) → no lenses and no top bar. Free-form tags are never lenses.

### Index frontmatter

```yaml
doc_type: walkthroughs-index
generated_by: building-walkthroughs
author: 2f1b6e9a-e16d-4361-93a9-bccb7508bc90
app: Tally
baselines:
  fresh: { title: Fresh install, setup: npm run db:reset }
  demo: { title: Demo studio, setup: npm run seed:demo }
areas:                                  # the app's navigation order
  - { id: clients, title: Clients }
  - { id: invoices, title: Invoices, summary: Bill clients once or on a schedule }
actors:
  - { id: owner, title: Studio owner }
  - { id: client, title: Client }
journeys:                               # the first is "Start here"
  - id: get-paid
    title: Bill a client and get paid
    actors: [owner, client]
    goal: Money for finished work lands in the studio account
    walkthroughs: [add-client, send-invoice, pay-invoice]
lenses:                                 # optional; never the actor lens
  - id: surface
    title: Surface
    values: [{ id: web, title: Web }, { id: mobile, title: Mobile }]
surfaces:
  - { id: /clients, title: Client list, area: clients }
  - { id: /invoices/:id, title: Invoice, area: invoices }
  - { id: /settings/billing, title: Billing, area: invoices, gap: "needs-setup: a live payment-provider account" }
```

| Field | Rule |
| --- | --- |
| `areas` | One per top-level place in the app's navigation, in its order; the map's regions. `summary` optional, one line |
| `actors` | Every kind of person who acts, from roles and guards |
| `journeys` | Ordered task ids (never variations), each with a one-line `goal` and the `actors` who act in it; 2+ walkthroughs. A walkthrough may sit in several journeys or none |
| `lenses` | Per **Lenses** |
| `surfaces` | `id` is the route pattern or screen name as the code names it; per **Coverage** |

Ids other than surfaces are kebab-case and unique. Accounts list seed or dev credentials only; real credentials stay in env setup.

### Index body

From [`../assets/index.md`](../assets/index.md). The viewer reads two sections by exact heading, and `npm run index` owns three marker blocks:

| Section | Holds |
| --- | --- |
| `## What this app does` | What the app is for, who uses it, which journey to start with |
| `## Run it locally` | `### Start the app`, `### Baselines`, `### Accounts` |
| `## Journeys` | `walkthroughs:journeys` block — each journey's goal and ordered walkthroughs |
| `## Walkthroughs` | `walkthroughs:list` block — every walkthrough by area |
| `## Coverage` | `walkthroughs:coverage` block — each surface with the walkthroughs that cover it, or its gap |

### Walkthrough frontmatter

| Field | Required | Value |
| --- | --- | --- |
| `doc_type` | yes | `walkthrough` |
| `id` | yes | Kebab-case slug, same as the filename |
| `title` | yes | The outcome in the user's words: `Send an invoice` |
| `area` | yes | An `areas` id; a variation takes its task's area |
| `variation_of` | variation | The task id it varies; marks the walkthrough as a variation |
| `actors` | yes | `actors` ids of everyone who acts in it |
| `surfaces` | yes | Declared surface ids it passes through |
| `starts_from` | yes | `baseline:<id>` or one task id (**Setup tree**) |
| `ends_with` | yes | Facts true at the end; walkthroughs that start from it rely on them |
| `checkpoint` | no | Command that reaches this walkthrough's end state (**Checkpoints**) |
| `covers` | yes | Code paths or globs and doc sections the task depends on; Update maps diffs through it |
| `lens` | per lens | `{ <lens id>: <value id> }`, one value for every declared lens |

### Setup tree

`starts_from` says where the user must be before step 1. It forms a tree rooted at baselines and is setup only; journeys carry order.

- Start from a baseline. Use a task id only when the task needs facts that only that task's `ends_with` produces (an invoice must be sent before it can be paid).
- A state a baseline can give (signed out, on a page) belongs in the baseline.
- A variation usually starts where its task starts. Nothing starts from a variation.

### Cutting tasks

- A walkthrough ends when something meaningful is finished. Actors switch inside it; never split by actor.
- Split only past 15 steps, at a real-world pause (an invite accepted days later), or where alternative paths begin.
- **Case or variation:** different input on the same path with one observable difference → a row in **Cases**. When the following steps differ → a variation.
- One walkthrough per surface type (web or mobile).

### Writing a walkthrough

Template: [`../assets/walkthrough.md`](../assets/walkthrough.md). Body in this order, with these exact headings; `npm run check` rejects any other `##` heading:

1. `# <Title>`, then the goal line `By the end, …` as the next paragraph (the map card and sidebar show it)
2. `## Before you start`
3. `## Flow`
4. `## Steps`
5. `## Cases` — omit when empty
6. `## Try it yourself` — omit when empty

| Part | Rule |
| --- | --- |
| Before you start | Plain words, no commands: what must already be true and the walkthrough that makes it true (`Needs an invoice sent to Oak & Co: finish [Send an invoice](send-invoice.md) first.`), or `Starts from <baseline title>.`; who is signed in, on which surface; files to keep at hand. `npm run check` rejects a code span that starts with a command (`pnpm`, `npm`, `yarn`, `npx`, `bun`, `supabase`, `docker`, `make`, `./`) and a task `starts_from` the section does not link |
| Flow | A `mermaid` block: `sequenceDiagram` when the task passes between participants (people, the app, outside services); `flowchart` with lanes when one actor branches. Main path only, ~12 arrows max |
| Steps | **Step format**, ≤ 15 steps |
| You should see | Something observable on screen, in an inbox, or in a file |
| Why | One or two sentences; link the doc section when one exists. Omit when the step is self-evident |

Take labels from the code (UI strings, translation files, design copy), never from memory. Link a design screen instead of adding screenshots. Link other walkthroughs as `<id>.md`; the viewer opens them in place, and `npm run check` rejects links to missing ids.

### Step format

The viewer renders one card per actor group, so `## Steps` holds only these lines (blank lines allowed):

```markdown
### Studio owner

1. Click **Invoices**, then **New invoice**.
   - You should see: an empty invoice with **Draft** status.
   - Why: drafts are saved as you type.
2. Type `1200` in **Amount**.
   - You should see: **Total** reads $1,200.00.

### Client

3. Open the invoice email and click **Pay now**.
   - You should see: the payment page showing $1,200.00.
```

- `### <Actor title>` opens a group; the title is one of the walkthrough's `actors`. Group steps by actor in the order they act.
- `N. <action>` — one action, on one line. Numbers run 1..N across all groups; the next group continues the count.
- `   - You should see: <result>` — required, one line, indented three spaces.
- `   - Why: <reason>` — optional, one line, after **You should see**.
- Inline Markdown only (bold labels, backticks, links). No nested lists, tables, or paragraphs; move detail to **Cases** or **Why**.

### Expected values

Every number, name, status, or amount in a step comes from a seed, a fixture, input typed in an earlier step, or a value computed from those. With no such source, describe what appears without the value ("the invoice total").

### Checkpoints

A checkpoint is a project command (seed, snapshot, script) that reaches a walkthrough's end state without replaying its setup chain. Add one only when the command exists and produces every `ends_with` fact; read the command's source to confirm. A checkpoint that no longer produces them is removed or fixed in the same work.

### Sync

| Change | Sync |
| --- | --- |
| Any frontmatter field, the step count, or a walkthrough added, retired, or renamed | `npm run index` |
| `ends_with` changed | Re-read every walkthrough that starts from it, and its `checkpoint` |
| `starts_from` changed | Rewrite **Before you start** to name what it needs and link the new start |
| A walkthrough retired or renamed | Re-point every `starts_from`, `variation_of`, journey entry, and `<id>.md` link to it |
| Route or screen added, renamed, or removed | `index.md` → `surfaces`, then cover it or mark the gap; remove it from every walkthrough's `surfaces` when gone |
| Area, actor, journey, or lens added, renamed, or removed | `index.md`, then every walkthrough's `area`, `actors`, or `lens` |

### Viewer

Copied from [`../assets/app/`](../assets/app/). `npm run dev` in the root opens one screen: the map fills it, and every tool floats over it on glass.

| Region | Shows |
| --- | --- |
| Map (full screen) | One region per area in navigation order, wrapped into rows so the map fits at a readable zoom (floor about 55%). Task cards with variations nested under them; each card shows title, actor badges, and step count, plus the goal on hover or selection. Quiet by default. Selecting a journey numbers its cards in order, draws its path across areas, and dims the rest; selecting an area emphasizes its region and dims the rest, with no path. Selecting a walkthrough lights it, its variations, and its setup route. Drag from anywhere to pan (a press that moves under 4px is a click), wheel pan, ctrl/cmd + wheel zoom, fit |
| Navigator (left) | Search (filters and dims, results grouped by area); a **Journeys** \| **Areas** switch over one list of collapsible groups. A journey group shows title, **Start here** on the first, actors, and count, with its walkthroughs numbered 1..N; an area group shows title and count, with its tasks and their variations nested. A group header selects the group (spotlight, overview, expanded; one open at a time); a child opens its walkthrough. A walkthrough selected anywhere expands its group and reveals its row, switching mode only when the current one has no group holding it. **About** and **Run locally** at the bottom |
| Lenses (top) | One switch per qualifying lens; hidden when none qualify |
| Sidebar (right, widen toggle) | Journey overview (actors, goal, ordered walkthroughs); area overview (summary, count, walkthroughs with variations nested); walkthrough, one scrolling page: **Variation of** link, title, goal, actors, step count; **Before you start** with a collapsed **Starting fresh?** that words the replay route with the nearest checkpoint or baseline command to copy; a collapsed **Show flow**; **Steps**; **Other cases** (Cases, Try it yourself, variations; omitted when all are empty); footer with the sequence and prev/next along the active journey or else the area. **About** (summary, **Start with** the first journey, journeys, areas, coverage N/M with gaps); **Run locally**. About opens on the first visit |
| Dock (bottom) | Zoom, fit, theme, and the issue count when `npm run check` would fail |

The URL hash holds the active journey or area, the walkthrough or page, the navigator mode, and the lens values. Keys: `\` tools, `/` search, `f` fit, `t` theme, `←`/`→` prev/next in an open walkthrough, `Esc` steps back (walkthrough → group overview → none, then clears search). Only the theme and the first-visit About dismissal persist. Under 760px the areas stack and the panels become sheets.

`npm run check` type-checks the viewer and validates everything above; `npm run build` builds a static copy.

### Checklist

Before confirming Create or Update:

- [ ] `npm run index` ran after the last frontmatter or step change.
- [ ] `npm run check` passes.
- [ ] Every route and screen in the code is a declared surface, covered or a gap with a valid reason.
- [ ] Every `starts_from` that is not a baseline names a task whose `ends_with` the walkthrough needs.
- [ ] Every **Before you start** is plain words: what must be true and the walkthrough that makes it true, no commands.
- [ ] Every label in a step was read from the code or design copy.
- [ ] Every expected value has a source per **Expected values**.
- [ ] Every **Flow** diagram stays within ~12 arrows.
- [ ] Every `checkpoint` produces its `ends_with` facts.
- [ ] No real credentials in `index.md`.
- [ ] No file the viewer owns was edited.

## Setup

### Initialize walkthroughs root

1. Target = user-named folder, else `walkthroughs/`. Target not empty → ask for another path.
2. Copy everything in [`../assets/app/`](../assets/app/), dotfiles included (`cp -R <skill>/assets/app/. <walkthroughs-root>/`), then run `npm install` there.
3. Write `index.md` from [`../assets/index.md`](../assets/index.md).

## Related

- [`../assets/index.md`](../assets/index.md) — root marker and app guide
- [`../assets/walkthrough.md`](../assets/walkthrough.md) — walkthrough template
