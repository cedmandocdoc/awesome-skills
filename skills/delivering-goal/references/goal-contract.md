# Goal Contract

## Overview

Shared plumbing for `delivering-goal`: author signatures, goals-root layout, living `goal.md`, clear-goal gate, pinned governing method, companion require, and halt-on-blocked. Recipe bodies live in planning / decide / deliver references — not here.

## Guidelines

### Author signature

Static UUID identifying goals roots and goal artifacts created by this skill:

```text
c3f5a7b9-4d2e-6f8a-0b1c-5e7d9f2a4c6b
```

Every `<goals-root>/index.md`, `goal.md`, and `phases/NN-slug.md` must include this value in frontmatter `author`. Search the repository for that field on `index.md` to locate the goals root — do not infer the root from `goal.md` or numbered goal folders alone.

### Subagent signature

Static UUID identifying delivery agents owned by this skill:

```text
d4a6b8c0-5e3f-7a9b-1c2d-6f8e0a3b5c7d
```

Managed agents (`goal-planner`, `phase-decider`) must include frontmatter `author` (this UUID) and `generated_by: delivering-goal`.

### Output layout

Only this skill may establish a goals root. The root is always marked by `<goals-root>/index.md`.

```text
<goals-root>/                        # default when initializing: goals/
  index.md                           # root marker — required; created first
  01-mvp/
    goal.md                          # living backlog for this goal
    phases/
      01-first-slice.md
      02-next-slice.md
  02-onboarding/
    goal.md
    phases/
```

| Term | Meaning |
| --- | --- |
| `<goals-root>` | Parent folder for all goals, marked by `index.md` |
| `<goal-id>` | Folder name `{NN}-{slug}` (e.g. `01-mvp`) |
| `<goal-dir>` | `<goals-root>/<goal-id>/` — parent of `goal.md` |

Templates: [`../assets/index.md`](../assets/index.md), [`../assets/goal.md`](../assets/goal.md), [`../assets/phase.md`](../assets/phase.md).

The goal tree is independent of `<tasks-root>/`. Tasks live under the `managing-tasks` companion root. Phase files hold the phase brief so handoffs stay reference-only.

### Resolve goals root

1. Search per **Finding goals root** below.
2. **Decide location:**

| Matches | Action |
| --- | --- |
| One | Use that root |
| Multiple | Ask which root to use (list full paths to each `index.md`) |
| None | On **plan** / **deliver**: ask where to create the folder (**default: `goals/`**), then **Initialize goals root**. On decide-only or other intents: stop — no goals root exists; do not initialize |

Do not create goal folders outside the resolved root. Do not treat a folder as the goals root unless it contains a valid `index.md`.

### Finding goals root

Search the repository for `index.md` files whose YAML frontmatter contains **all** of:

| Field | Value |
| --- | --- |
| `doc_type` | `goals-root-index` |
| `generated_by` | `delivering-goal` |
| `author` | `c3f5a7b9-4d2e-6f8a-0b1c-5e7d9f2a4c6b` (see **Author signature**) |

The goals root is the parent directory of each matching `index.md` (e.g. `goals/index.md` → root is `goals/`).

After resolving the root, list and read goal folders only under that directory.

### Initialize goals root

When **no** valid `index.md` exists and the user is planning or delivering a goal:

1. **Ask once** for the target folder path. Default suggestion: `goals/`. Accept that default when the user confirms or leaves it unspecified after the ask.
2. **Verify the folder is empty** (or does not exist yet). If non-empty without a valid `index.md`, do not write goals there — ask for another path.
3. Write `<goals-root>/index.md` from [`../assets/index.md`](../assets/index.md) with the **Author signature** in `author`. This is the first file the skill creates in a new root.
4. Proceed with the requested goal folder under that root.

Only this skill may create or replace `index.md`.

### Assign goal id and slug

Within the resolved goals root:

1. List directories matching `[0-9][0-9]-*/`.
2. Parse the highest two-digit prefix; next id = max + 1 (or `01` if none).
3. Build slug from the user-provided goal name or the goal statement:
   - lowercase, hyphens only, max ~40 chars
   - drop filler (`the`, `a`, `implement`, `ship`, `build`, `deliver`)
4. Folder name: `{id}-{slug}` (e.g. `01-mvp`).

**User-provided name** (prefer): explicit name in the prompt (`goal: mvp`, `name it onboarding`) becomes the slug; still assign the next `NN` prefix.

If the folder already exists and the user did not ask to continue/replan that goal → `Skipped goal plan: goal <goal-id> already exists`.

### Resolve goal.md

1. Resolve `<goals-root>` per **Resolve goals root**.
2. Locate the goal:

| Cue | Action |
| --- | --- |
| User named a goal (`01-mvp`, `mvp`, `goal: mvp`) | Match folder `<NN>-<slug>` under the root (slug or full id) |
| One active goal | Use it |
| Multiple, no cue | Ask which goal (list `<goal-id>` + `goal.md` paths) |
| None | On plan / deliver: **Assign goal id and slug**, create `<goal-dir>/`. On decide-only: stop — suggest planning-goal |

3. `goal.md` must live at `<goal-dir>/goal.md` with frontmatter:

| Field | Value |
| --- | --- |
| `doc_type` | `goal` |
| `generated_by` | `delivering-goal` |
| `author` | Author signature |
| `goal_id` | `<goal-id>` (e.g. `01-mvp`) |

4. Ensure `<goal-dir>/phases/` exists before writing a phase file.

### Living goal.md

`goal.md` is a **seeded, revisable backlog** — not a fixed schedule. It is the source of truth for **what** to deliver toward the goal (high-level deliverables as phase candidates).

| Rule | Detail |
| --- | --- |
| Plan seeds | Planning writes an initial ordered index of candidate phases and pins governing method |
| Decide owns truth | After each executed phase, decide resurveys current state and may change what comes next |
| Allowed edits | Insert pending rows, rewrite pending titles/outcomes, reorder pending rows, split/spill when >7 specs, drop obsolete pending rows |
| Protected rows | Do not delete or rewrite rows whose phase file is `done`, `ready`, or `implementing` unless the user explicitly asks to replan |
| Changelog | Every `goal.md` edit bumps `map_revision` and adds a changelog line |

### Categorize goal

Record on `goal.md` (plan seeds; decide may revise):

| Field | Meaning |
| --- | --- |
| `domain` | Broad kind of work (e.g. `software`, `docs`, `ops`, `content`) — from goal, workspace, or user |
| `tags` | Finer labels — optional list |
| Evidence | Short note: what justified the category |

If domain is ambiguous on an inline run → ask **once**. Subagent without enough signal → leave `domain: unknown` and continue; do not invent a category.

### Pin governing method

`goal.md` stores a sticky **Governing method** so every decide pass uses the same how-to-decide rules.

| Field on `goal.md` | Meaning |
| --- | --- |
| **Governing skills** | Installed skill names that apply (best-effort list) |
| **Governing method** | One pinned method: skill name + method reference basename, or `none` |

**Plan** (first pin):

1. Bind governing skills best-effort.
2. Resolve a delivery method once per **Resolve delivery method**.
3. Write the pin on `goal.md` (`skill` + `method` basename, or `none`).

**Decide** (every pass):

1. **Read the pin first** — open the pinned skill’s method reference when present; honor it for this phase.
2. Re-survey domain/tags and **Skills to prefer**.
3. **Repin only when** one of these is true:
   - pin is `none` and a clear method now matches
   - domain / tags / **Skills to prefer** changed enough that a different method clearly fits
   - user explicitly asks to rebind
4. On repin: update **Governing skills** and **Governing method**, bump `map_revision`, changelog the reason.

Never stop the loop solely because the pin is `none`. Meta brief + goal + survey are enough when no method applies.

### Phase files

| Rule | Detail |
| --- | --- |
| Path | `<goal-dir>/phases/NN-slug.md` — `NN` is two-digit sequence (`01`, `02`, …); slug from title |
| Template | [`../assets/phase.md`](../assets/phase.md) |
| Frontmatter | `doc_type: delivery-phase`, `generated_by: delivering-goal`, `author` signature, `goal_id`, `phase_id`, `status` |
| Status values | `ready` (tasks created, not executed), `implementing`, `done`, `blocked` |
| Map index | Each phase row stores **Phase file** path and **Task ids** — not the brief body |

Assign next phase `NN` by listing `<goal-dir>/phases/*.md` and taking max + 1 (or `01` if none).

### `index.md` status mirror

`<goals-root>/index.md` is the root-level summary for goals. Keep it synchronized:

- Maintain one row per goal folder under `<goals-root>/` (excluding `index.md`).
- `ID` is the folder name `<goal-id>` (e.g. `01-mvp`).
- `Goal` is a short title from the `goal.md` frontmatter `goal` or Goal section.
- `Status` mirrors overall progress: `planned` (`goal.md` only), `active` (has a ready/implementing phase or open tasks), `blocked`, `done`.
- On plan create: append a row with `Status` = `planned`.
- On phase ready / execute progress: set `active` (or `blocked` / `done` when applicable).

### Require managing-tasks

Named companion (hard prerequisite for **decide**, **deliver**, and the delivery **loop**). Not required for **plan-only**. Discover by frontmatter `name` only — never path-link into that skill.

1. Discover skills per **Discovering project skills**.
2. Accept when `SKILL.md` frontmatter `name` is `managing-tasks`.
3. If missing → **stop**:

```text
Install the managing-tasks skill before using delivering-goal.
delivering-goal only decides what comes next; create/execute of task folders requires managing-tasks.
```

4. Open that skill’s `SKILL.md` and follow its recipes by name for create / execute. Do not invent parallel task-folder formats.

### Require clear goal

A delivery starts from a **clear goal** in any form — document, ticket, user story, or plain prompt. The form does not matter; **answerability** does.

**Hard gate** — before writing any goal file, both questions below must be answerable without inventing:

| Question | Answerable from |
| --- | --- |
| **Outcome** — what is true when the goal is done | Goal statement or its sources |
| **Scope** — what is in and out of this goal | Goal statement or its sources |

**Best-effort at plan/decide (not a hard gate):** use goal sources, the pinned governing method when present, and current workspace state to choose next work. Missing approach detail alone does not fail this gate.

**Guard — never run on an unclear goal:**

| Context | On gap (Outcome or Scope) |
| --- | --- |
| Inline (user-facing recipe) | Stop before writing files. List each gap and what would close it. Proceed only after the user answers. Ask **once**; do not invent a goal. |
| Subagent | Never ask. Return `Failed goal plan: unclear goal — <gaps>` (planner) or `Blocked delivery: unclear goal — <gaps>` (decider). Parent surfaces the gaps and stops the loop. |

This skill does **not** research missing goal detail. When a gap needs investigation, stop and point at finishing or clarifying the goal sources.

After the goal passes the gate, assign `<goal-id>` per **Assign goal id and slug** before creating `<goal-dir>` (on new goals).

### Discovering project skills

Each skill is `<skill-name>/SKILL.md` with optional `references/`, `scripts/`, and `assets/`.

**Find skills:**

1. **Explicit pointers** — `AGENTS.md`, the user request, `@`-mentioned or attached skills, **Skills to prefer**
2. **Project skill roots** — glob `<root>/<skill-name>/SKILL.md` under each existing root:

| Root | Tool / environment |
| --- | --- |
| `.agents/skills/` | Agent Skills (portable / multi-agent) |
| `.claude/skills/` | Claude Code |
| `.cursor/skills/` | Cursor |
| `.codex/skills/` | OpenAI Codex |
| `.windsurf/skills/` | Windsurf |
| `.gemini/skills/` | Gemini CLI |
| `.github/skills/` | GitHub Copilot (project skills) |
| `.agent/skills/` | Google Antigravity |
| `.cline/skills/` | Cline |
| `.continue/skills/` | Continue |
| `.roo/skills/` | Roo Code |

3. **Custom roots** — additional paths named in `AGENTS.md` or by the user

**Deduplicate** — one copy per skill `name` in frontmatter; prefer `AGENTS.md` path, else first matching root in the table order.

### Bind governing skills (best-effort)

Match installed skills to the goal’s `domain`, `tags`, goal text, and **Skills to prefer**. Record matches on `goal.md` as **Governing skills**.

| Result | Action |
| --- | --- |
| Matches found | Open each skill’s `SKILL.md`. Resolve any **delivery method** per below. Carry skill names into phase briefs and task specs. |
| None found | Continue. Meta brief + goal + survey are enough. |

Never stop the loop solely because no governing skill exists.

### Resolve delivery method (best-effort)

For each governing skill, open its `SKILL.md` and look for **one** recipe or reference-index row whose intent is delivering a phase/slice/method for this domain (match by description, not by path convention).

| Result | Action |
| --- | --- |
| One clear method reference | Use that reference basename for the **Governing method** pin; on decide, open it and answer its questions into the phase file under **Method notes**; follow any sequencing or deliverable rules it defines for this phase |
| Multiple candidates | Prefer the row that best matches `domain` / `tags`; if still tied, use **Skills to prefer**, else pick the most specific and note it on `goal.md` |
| None | Pin `none`; skip method notes; complete the meta brief only |

Never path-link into another skill from this skill’s docs. Discover by `name`, then follow that skill’s own index.

### Phase sizing

- Smallest shippable unit of progress toward the goal.
- **Soft cap: 7** task specs per phase; spill remainder into later **pending** map rows without emitting them yet.

### Halt on blocked

When `managing-tasks` execute-multiple (or a task-implementer) returns `Blocked task-...`:

1. Mark the current phase file `status: blocked` with the reason
2. Update the `goal.md` row and root `index.md` mirror
3. **Stop the delivery loop** — do not decide or create the next phase
4. Parent reply must surface the blocked task id and reason

`stop_on_blocked: true` is required for delivery runs.

### Handoff style

Subagents and parent summaries return **references** (`goal.md` path, phase path, `task-<NNN-slug>` ids), not document bodies or brief dumps.

### Invoke companion recipes

When a recipe needs task create or execute:

1. Resolve the installed `managing-tasks` skill (see **Require managing-tasks**).
2. Open its `SKILL.md`.
3. Match the recipe by intent name:

| Intent | Companion recipe name |
| --- | --- |
| Create multiple tasks | Create multiple |
| Execute multiple tasks | Execute multiple |
| Find task agents | Finding / creating task agents (per that skill’s index) |

4. Follow only that companion reference. Never copy its file path into this skill’s docs.
