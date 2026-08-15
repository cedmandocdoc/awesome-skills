# Goal Contract

## Overview

Shared plumbing for `delivering-goal`: author signatures, goals-root layout, living `goal.md`, clear-goal gate, pinned governing method, dependency `managing-tasks`, halt-on-blocked, and delivery-agent roots.

## Guidelines

### Author signature

Static UUID identifying goals roots and goal artifacts created by this skill:

```text
c3f5a7b9-4d2e-6f8a-0b1c-5e7d9f2a4c6b
```

Every `<goals-root>/index.md`, `goal.md`, and `phases/NN-slug.md` must include this value in frontmatter `author`. Search the repository for that field on `index.md` to locate the goals root — infer the root from `index.md` only, not from `goal.md` or numbered goal folders alone.

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

Templates: [`../assets/index.md`](./../assets/index.md), [`../assets/goal.md`](./../assets/goal.md), [`../assets/phase.md`](./../assets/phase.md).

The goal tree is independent of `<tasks-root>/`. Tasks live under the `managing-tasks` dependency root. Phase files hold the phase brief so handoffs stay reference-only.

### Resolve goals root

1. Search per **Finding goals root** below.
2. **Decide location:**

| Matches | Action |
| --- | --- |
| One | Use that root |
| Multiple | Ask which root to use (list full paths to each `index.md`) |
| None | On **plan** / **deliver**: ask where to create the folder (**default: `goals/`**), then **Initialize goals root**. On decide-only or other intents: stop — no goals root exists; do not initialize |

Create goal folders only under the resolved root. Treat a folder as the goals root only when it contains a valid `index.md`.

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
2. **Verify the folder is empty** (or does not exist yet). If non-empty without a valid `index.md`, ask for another path.
3. Write `<goals-root>/index.md` from [`../assets/index.md`](./../assets/index.md) with the **Author signature** in `author`. This is the first file the skill creates in a new root.
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

`goal.md` is a seeded, revisable backlog of high-level phase candidates (source of truth for **what** to deliver).

| Rule | Detail |
| --- | --- |
| Plan seeds | Initial ordered index + governing method pin |
| Decide owns truth | After each executed phase, resurvey and may change what comes next |
| Allowed edits | Insert / rewrite / reorder pending rows; split/spill when >7 specs; drop obsolete pending |
| Protected rows | Rows with phase `done` / `ready` / `implementing` — change only when user asks to replan |
| Changelog | Every edit bumps `map_revision` and adds a changelog line |

### Categorize goal

Record on `goal.md` (plan seeds; decide may revise):

| Field | Meaning |
| --- | --- |
| `domain` | Broad kind of work (e.g. `software`, `docs`, `ops`, `content`) — from goal, workspace, or user |
| `tags` | Finer labels — optional list |
| Evidence | Short note: what justified the category |

If domain is ambiguous on an inline run → ask **once**. Subagent without enough signal → leave `domain: unknown` and continue.

### Pin governing method

Sticky how-to-decide pin on `goal.md`:

| Field | Meaning |
| --- | --- |
| **Governing skills** | Installed skill names (best-effort) |
| **Governing method** | One pin: skill name + method reference basename, or `none` |

**Plan** (first pin): bind skills → resolve once per **Resolve delivery method** → write pin (`skill` + basename, or `none`).

**Decide** (every pass):

1. **Read the pin first**; open and honor the method reference when present.
2. Re-survey domain/tags and **Skills to prefer**.
3. **Repin only when:** pin is `none` and a method now matches; domain/tags/Skills to prefer changed enough; or user asks to rebind.
4. On repin: update both fields, bump `map_revision`, changelog the reason.

Pin `none` is valid — continue with meta brief + goal + survey. Never stop the loop solely because no governing skill or method exists.

### Phase files

| Rule | Detail |
| --- | --- |
| Path | `<goal-dir>/phases/NN-slug.md` — `NN` is two-digit sequence (`01`, `02`, …); slug from title |
| Template | [`../assets/phase.md`](./../assets/phase.md) |
| Frontmatter | `doc_type: delivery-phase`, `generated_by: delivering-goal`, `author` signature, `goal_id`, `phase_id`, `status` |
| Status values | `ready` (tasks created, not executed), `implementing`, `done`, `blocked` |
| Map index | Each phase row stores **Phase file** path and **Task ids** — not the brief body |

Assign next phase `NN` by listing `<goal-dir>/phases/*.md` and taking max + 1 (or `01` if none).

### `index.md` status mirror

Keep `<goals-root>/index.md` synchronized — one row per goal folder:

| Column | Value |
| --- | --- |
| `ID` | `<goal-id>` folder name |
| `Goal` | Short title from `goal.md` |
| `Status` | `planned` / `active` / `blocked` / `done` |

On plan create → `planned`. On phase ready / execute progress → `active` (or `blocked` / `done` when applicable).

### Require managing-tasks

Required skill dependency for **decide**, **deliver**, and the delivery **loop**. Not required for **plan-only**. [`managing-tasks`](https://github.com/cedmandocdoc/awesome-skills/tree/main/skills/managing-tasks) owns task folders (`plan.md`, `status.md`) — create, execute, triage.

| Field | Value |
| --- | --- |
| `name` | `managing-tasks` |
| `id` | `34d10b1d-f2fb-4121-b7bf-0c17401658a3` |
| Source | https://github.com/cedmandocdoc/awesome-skills/tree/main/skills/managing-tasks |
| Install | `npx skills add cedmandocdoc/awesome-skills --skill managing-tasks` |

1. Discover and accept per **Discovering project skills** (`name` + `id` from the table).
2. If missing → **stop**:

```text
Install managing-tasks before using delivering-goal (create/execute of task folders requires it).

npx skills add cedmandocdoc/awesome-skills --skill managing-tasks

Source: https://github.com/cedmandocdoc/awesome-skills/tree/main/skills/managing-tasks
Id: 34d10b1d-f2fb-4121-b7bf-0c17401658a3
```

3. Open that skill’s `SKILL.md` and follow its recipes by intent name for create / execute.

### Require clear goal

**Hard gate** — before writing any goal file, both must be answerable without inventing (form of the goal does not matter):

| Question | Answerable from |
| --- | --- |
| **Outcome** — what is true when the goal is done | Goal statement or its sources |
| **Scope** — what is in and out of this goal | Goal statement or its sources |

Missing approach detail alone does not fail this gate. Plan/decide may use sources, the pinned method, and workspace state best-effort.

| Context | On gap (Outcome or Scope) |
| --- | --- |
| Inline | Stop before writing. List each gap and what would close it. Ask **once**; proceed only after the user answers. |
| Subagent | Never ask. Return `Failed goal plan: unclear goal — <gaps>` (planner) or `Blocked delivery: unclear goal — <gaps>` (decider). Parent surfaces gaps and stops. |

When a gap needs investigation, stop and point at clarifying the goal sources. After the gate passes, assign `<goal-id>` per **Assign goal id and slug** before creating `<goal-dir>` (on new goals).

### Discovering project skills

Each skill is `<skill-name>/SKILL.md`.

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

3. **User-level skill roots** — same folder names under `~/` (for example `~/.cursor/skills/`, `~/.agents/skills/`, `~/.claude/skills/`). Use when the skill is not in a project root.
4. **Custom roots** — additional paths named in `AGENTS.md` or by the user

**Deduplicate** — one copy per skill `id` (then `name`); prefer `AGENTS.md` path, else first matching **project** root in the table order, else first user-level match.

**Accept a dependency skill** when frontmatter `name` **and** `id` match the required skill. Unique `name` with no `id` still counts (legacy install). Skip when `name` matches but `id` is present and different.

### Bind governing skills (best-effort)

Match installed skills to the goal’s `domain`, `tags`, goal text, and **Skills to prefer**. Record matches on `goal.md` as **Governing skills**.

| Result | Action |
| --- | --- |
| Matches found | Open each skill’s `SKILL.md`. Resolve any **delivery method** per below. Carry skill names into phase briefs and task specs. |
| None found | Continue. Meta brief + goal + survey are enough. |

### Resolve delivery method (best-effort)

For each governing skill, open its `SKILL.md` and look for **one** recipe or reference-index row whose intent is delivering a phase/slice/method for this domain (match by description, not by path convention).

| Result | Action |
| --- | --- |
| One clear method reference | Use that reference basename for the **Governing method** pin; on decide, open it and answer its questions into the phase file under **Method notes**; follow any sequencing or deliverable rules it defines for this phase |
| Multiple candidates | Prefer the row that best matches `domain` / `tags`; if still tied, use **Skills to prefer**, else pick the most specific and note it on `goal.md` |
| None | Pin `none`; skip method notes; complete the meta brief only |

Discover governing skills by `name` / description; follow that skill’s own index.

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

### Invoke dependency recipes

When a recipe needs task create or execute, resolve `managing-tasks` per **Require managing-tasks**, then match by intent name:

| Intent | Dependency recipe name |
| --- | --- |
| Create multiple tasks | Create multiple |
| Execute multiple tasks | Execute multiple |
| Find task agents | Finding / creating task agents (per that skill’s index) |

Follow only that reference. Never copy its file path into this skill’s docs.

### Delivery agent roots

Prefer project-level roots first:

| IDE | Root | Filename pattern |
| --- | --- | --- |
| Cursor | `.cursor/agents/` | `<name>.md` |
| Claude Code | `.claude/agents/` | `<name>.md` |
| Codex | `.codex/agents/` | `<name>.md` |
| Cline | `.cline/agents/` | `<name>.md` |
| GitHub Copilot | `.github/agents/` | `<name>.agent.md` |
| Gemini CLI | `.gemini/agents/` | `<name>.md` |
| Antigravity | `.agent/agents/` | `<name>.md` |
| Roo Code | `.roo/agents/` or `.roomodes` | `<name>.md` or mode entry |
| Portable fallback | `.agents/agents/` | `<name>.md` |

User-level fallback roots (reuse only): `~/.cursor/agents/`, `~/.claude/agents/`, `~/.codex/agents/`, `~/.copilot/agents/`.

If no known root exists when **creating** agents, create `.agents/agents/` and write portable agents there.
