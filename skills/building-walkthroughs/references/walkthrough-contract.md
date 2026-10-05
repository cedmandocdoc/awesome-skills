# Walkthrough Contract

## Overview

Shared rules for every `building-walkthroughs` recipe: where walkthroughs live, the frontmatter the viewer and `npm run check` read, how journeys are cut into walkthroughs, and how each one is written. A walkthrough is a guide the user follows in the running app. It has no status or run log, and nothing waits on it.

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
  index.md                      # root marker: app, baselines, lines, accounts, generated map and list
  <slug>.md                     # one walkthrough per journey; slug = id
  retired/<slug>.md             # journeys that left the app; the viewer and check skip them
  index.html  package.json  vite.config.ts  tsconfig.json  .gitignore   # viewer — copied, never edited
  viewer/  scripts/             # viewer and check — copied, never edited
```

Never read `node_modules/`.

### Resolve walkthroughs root

1. Search the repository for `index.md` files whose frontmatter has `doc_type: walkthroughs-index`, `generated_by: building-walkthroughs`, and `author` = **Author signature**.
2. One match → use it. Several → ask, listing each path. None → **Initialize walkthroughs root** on Create; stop and report on other recipes.
3. Read and write only under the resolved root, except the instruction files in `SKILL.md` → **Setup**.

### Initialize walkthroughs root

1. Target = user-named folder, else `walkthroughs/`. Target not empty → ask for another path.
2. Copy everything in [`../assets/app/`](../assets/app/), dotfiles included (`cp -R <skill>/assets/app/. <walkthroughs-root>/`), then run `npm install` there.
3. Write `index.md` from [`../assets/index.md`](../assets/index.md).

### Inputs

| Need | Required | Sources |
| --- | --- | --- |
| Code | yes | Routes, screens, actions or mutations, data model, UI strings |
| App purpose | yes | README, specs; otherwise ask the user what the app is for |
| Run the app | yes | README, package scripts, compose files, `.env.example` |
| Baselines | yes | Reset, seed, sandbox, or sign-up paths that give a reproducible start |
| Accounts | when the app has logins | Seeds, fixtures, `.env.example` |
| Specs, design flows, seeds, fixtures, tests | optional | Journeys, exact labels, expected values, spec links |

Ask once for every required row the sources leave empty. A journey whose baseline or setup data does not exist is skipped: report what it needs (an account, a seed, a sandbox key). Building seeds belongs to other work.

### Index frontmatter

```yaml
doc_type: walkthroughs-index
generated_by: building-walkthroughs
author: 2f1b6e9a-e16d-4361-93a9-bccb7508bc90
app: Tally
baselines:
  fresh: { title: Fresh install, setup: npm run db:reset }
  demo: { title: Demo studio, setup: npm run seed:demo }
lines:
  - { id: billing, title: Billing }
  - { id: team, title: Team, color: "#dc2626" }   # color optional; the viewer assigns one
```

`lines` order is the board's order. The body follows [`../assets/index.md`](../assets/index.md). `npm run index` owns the blocks between the `walkthroughs:map` and `walkthroughs:list` markers. Accounts list seed or dev credentials only; real credentials stay in env setup.

### Walkthrough frontmatter

| Field | Required | Value |
| --- | --- | --- |
| `doc_type` | yes | `walkthrough` |
| `id` | yes | Kebab-case slug, same as the filename |
| `title` | yes | The outcome in the user's words: `Send an invoice` |
| `kind` | yes | `core` (a station on a line) or `branch` (a dead-end spur) |
| `line` | core | A `lines` id from `index.md`; a branch takes its parent's line |
| `starts_from` | yes | `baseline:<id>` or one walkthrough id |
| `ends_with` | yes | Facts true at the end; the next walkthrough relies on them |
| `actors` | yes | Participants in this journey: people, the app, outside services (email, card provider). At least a person and the app |
| `minutes` | yes | Estimated time, 5–15 |
| `facets` | no | Flat map of filter keys to a value or a list (**Facets**) |
| `checkpoint` | no | Command that reaches this walkthrough's end state (**Checkpoints**) |
| `covers` | yes | Code paths or globs and spec sections the journey depends on; Update maps diffs through it |

### Lines, branches, transfers

- A **line** is a storyline: its core walkthroughs chained by `starts_from`. The first starts from a baseline or from another line's station (a **transfer**); each next one starts from the previous one.
- A **branch** starts from a core walkthrough and is a dead end. A branch that needs to continue becomes the first core walkthrough of its own line.
- Each walkthrough has one parent. A second prerequisite goes earlier in the chain or into the baseline.

### Cutting journeys

- A walkthrough ends when something meaningful is finished. Roles switch inside it; never split by role.
- Split only past ~15 steps, at a real-world pause (an invite accepted days later), or where alternative paths begin.
- **Case or branch:** a case is different input on the same path with one observable difference → a row in **Cases**. When the following steps differ → a branch.
- Core walkthroughs are the journeys the app exists for. Write them before branches.
- One walkthrough per surface (web or mobile).

### Writing a walkthrough

Template: [`../assets/walkthrough.md`](../assets/walkthrough.md). Sections in order: goal line (`By the end, …`), **Before you start**, **Journey**, **Steps**, **Cases**, **Try it yourself**, **Something looks wrong?**. Omit **Cases** or **Try it yourself** when empty.

| Part | Rule |
| --- | --- |
| Before you start | The baseline command or the walkthrough to finish first, who is logged in on which surface, the minutes |
| Journey | `sequenceDiagram` when the journey passes between actors; `flowchart` with lanes when one actor branches. Main path only, ~12 arrows max |
| Steps | Grouped under `### <Actor>` headings in the order they act. One action per step, exact on-screen labels in **bold**, typed input in backticks |
| You should see | Something observable on screen, in an inbox, or in a file |
| Why | One or two sentences; link the spec section when one exists. Omit when the step is self-evident |
| Something looks wrong? | `Report it as \`<Title> › step <N> › what you saw\`.` |

Take labels from the code (UI strings, translation files, design copy), never from memory. Link a design screen instead of adding screenshots. Link other walkthroughs as `<id>.md`; the viewer opens them in place.

### Expected values

Every number, name, status, or amount in a step comes from a seed, a fixture, input typed in an earlier step, or a value computed from those. With no such source, describe what appears without the value ("the invoice total").

### Facets

Free keys the viewer turns into filter chips. Suggest `area`, `role`, or `surface` only when the project has them (several areas, several roles, web and mobile). Keep each key's values to a short shared vocabulary across walkthroughs.

### Checkpoints

A checkpoint is a project command (seed, snapshot, script) that reaches a walkthrough's end state without replaying the chain. Add one only when the command exists and produces every `ends_with` fact; read the command's source to confirm. A checkpoint that no longer produces them is removed or fixed in the same work.

### Sync

| Change | Sync |
| --- | --- |
| Any `title`, `kind`, `line`, `starts_from`, or `minutes`; a walkthrough added, retired, or renamed | `npm run index` |
| `ends_with` changed | Re-read every walkthrough that starts from it, and its `checkpoint` |
| A walkthrough retired or renamed | Re-point every `starts_from` and `<id>.md` link to it |
| Line added, renamed, or removed | `index.md` → `lines` |

### Viewer

Copied from [`../assets/app/`](../assets/app/) and never edited. `npm run dev` in the root opens a metro map: lines and stations from frontmatter, branches as spurs, transfers where a line leaves another line's station. Selecting a line zooms to it. Selecting a station opens the walkthrough in a side panel, highlights its route from the baseline, and names the nearest checkpoint to skip ahead. Facet chips and search filter the map. The selection lives in the URL hash.

### Checklist

Before confirming Create or Update:

- [ ] `npm run index` ran after the last frontmatter change.
- [ ] `npm run check` passes.
- [ ] Every label in a step was read from the code or design copy.
- [ ] Every expected value has a source per **Expected values**.
- [ ] Every walkthrough is ≤ ~15 steps and has a **Journey** diagram within ~12 arrows.
- [ ] Every `checkpoint` produces its `ends_with` facts.
- [ ] No real credentials in `index.md`.
- [ ] No file the viewer owns was edited.

## Related

- [`../assets/index.md`](../assets/index.md) — root marker and app guide
- [`../assets/walkthrough.md`](../assets/walkthrough.md) — walkthrough template
