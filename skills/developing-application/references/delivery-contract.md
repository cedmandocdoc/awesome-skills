# Delivery Contract

## Overview

Shared plumbing for `developing-application`: author signatures, delivery root layout, prerequisite checks, named companion require, agent discovery hooks, verification stance, and halt-on-blocked. Recipe bodies live in planning / decide / execute references — not here.

## Guidelines

### Author signature (maps and waves)

Static UUID identifying delivery artifacts created by this skill:

```text
c3f5a7b9-4d2e-6f8a-0b1c-5e7d9f2a4c6b
```

Every `delivery-map.md` and `waves/NN-slug.md` must include this value in frontmatter `author`.

### Subagent signature

Static UUID identifying delivery agents owned by this skill:

```text
d4a6b8c0-5e3f-7a9b-1c2d-6f8e0a3b5c7d
```

Managed agents (`delivery-planner`, `wave-decider`) must include frontmatter `author` (this UUID) and `generated_by: developing-application`.

### Output layout (delivery)

Each developing-application run is a **delivery**: one named folder that holds that goal’s map and waves.

```text
<delivery-root>/
  <delivery-name>/                 # e.g. mvp, authentication, home-dashboard
    delivery-map.md              # delivery index — goal, sources, wave index (paths only)
    waves/
      01-scaffold.md             # full brief + task ids for one wave
      02-auth-shell.md
  <other-delivery>/
    delivery-map.md
    waves/
```

| Term | Meaning |
| --- | --- |
| `<delivery-root>` | Parent folder for all deliveries (e.g. `docs/delivery/`). Asked once when none exists. |
| `<delivery-name>` | Folder name for this goal — user-provided or derived (see **Resolve delivery name**) |
| `<delivery-dir>` | `<delivery-root>/<delivery-name>/` — parent of `delivery-map.md` |

The delivery is independent of `<tasks-root>/`. Tasks live under the `managing-tasks` companion root. Wave files hold Slice Brief detail so handoffs stay reference-only.

### Resolve delivery name

Every new delivery needs a `<delivery-name>` before writing files.

1. **User-provided** (prefer) — explicit name in the prompt, e.g. `delivery: mvp`, `name it authentication`, `delivery/authentication`, or a quoted folder name.
2. **Derive from goal** — slugify the goal: lowercase, hyphens only, max ~40 chars, drop filler (`the`, `a`, `implement`, `ship`, `build`, `develop`). Examples:
   - “Ship the MVP” → `mvp`
   - “Implement authentication” → `authentication`
   - “Home dashboard polish” → `home-dashboard-polish`
3. If still ambiguous → ask **once** for the delivery folder name. Subagents without a name → `Failed delivery plan: missing delivery name`.

Reuse an existing `<delivery-dir>` for a different goal only when the user explicitly asks to continue or replan that delivery.

### Resolve delivery map

1. Search for `delivery-map.md` whose YAML frontmatter contains **all** of:

| Field | Value |
| --- | --- |
| `doc_type` | `delivery-map` |
| `generated_by` | `developing-application` |
| `author` | `c3f5a7b9-4d2e-6f8a-0b1c-5e7d9f2a4c6b` |

Prefer matches whose frontmatter `delivery` equals the resolved `<delivery-name>` when the user named a delivery.

2. **Decide location:**

| Matches | Action |
| --- | --- |
| One (or one matching `delivery`) | Use that file; `<delivery-dir>` = its parent; `<delivery-root>` = parent of `<delivery-dir>` |
| Multiple (no delivery filter) | Ask which delivery to use (list `<delivery-name>` + full map paths) |
| None | On **plan** / **execute delivery**: resolve `<delivery-root>` (ask once if unknown, e.g. `docs/delivery/`) + **Resolve delivery name**, then create `<delivery-dir>/`. On decide-only: stop — suggest planning-delivery |

3. Ensure `<delivery-dir>/waves/` exists before writing a wave file.

### Wave files

| Rule | Detail |
| --- | --- |
| Path | `<delivery-dir>/waves/NN-slug.md` — `NN` is two-digit sequence (`01`, `02`, …); slug from title |
| Template | [`../assets/wave.md`](../assets/wave.md) |
| Frontmatter | `doc_type: delivery-wave`, `generated_by: developing-application`, `author` signature, `delivery`, `wave_id`, `status` |
| Status values | `ready` (tasks created, not executed), `implementing`, `done`, `blocked` |
| Map index | Each wave row on `delivery-map.md` stores **Wave file** path and **Task ids** — not the brief body |

Assign next `NN` by listing `<delivery-dir>/waves/*.md` and taking max + 1 (or `01` if none).

### Require managing-tasks

Named companion (hard prerequisite). Discover by frontmatter `name` only — never path-link into that skill.

1. Discover skills per **Discovering project skills**.
2. Accept when `SKILL.md` frontmatter `name` is `managing-tasks`.
3. If missing → **stop**:

```text
Install the managing-tasks skill before using developing-application.
developing-application only decides what comes next; create/execute/triage of task folders requires managing-tasks.
```

4. Open that skill’s `SKILL.md` and follow its recipes by name for create / execute / triage. Do not invent parallel task-folder formats.

### Require goal

Parse a clear delivery goal from the user message (big milestone or small feature — same loop). If missing → ask **once**. Do not invent a goal.

After the goal is known, resolve `<delivery-name>` per **Resolve delivery name** before creating `<delivery-dir>`.

### Require HOW documents

**Fail early** when implementers would invent approach. This skill does **not** spike or research HOW.

**Minimum for planning-delivery / execute-delivery start:**

| Required | Acceptable forms |
| --- | --- |
| Goal | User prompt |
| Product / behavior intent | PRD, FRD set, user stories, or equivalent |
| Implementation HOW | TRD or equivalent naming stack, structure, major contracts |

**Additional for deciding-next-wave (that wave):**

| When the wave includes… | Also require |
| --- | --- |
| User-facing surfaces | UI specs and/or design sources |
| Backend / data work | Schema or API contracts in HOW docs |
| Content-driven behavior | Content source paths named by TRD/FRD |

On failure, stop and report missing paths/sections; point at finishing specs or a `managing-tasks` spike **outside** this skill.

### Verification stance

Default: typecheck / lint / build / manual smoke. Require automated tests only when the user or project docs demand them.

### Discovering project skills

Each skill is `<skill-name>/SKILL.md` with optional `references/`, `scripts/`, and `assets/`.

**Find skills:**

1. **Explicit pointers** — `AGENTS.md`, the user request, `@`-mentioned or attached skills
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

Include skills whose description governs the wave. Prefer domain skills for HOW; never invent stack conventions when a governing skill exists. User phrases like “use react skills” mean: include matching installed skills in Sources/Constraints for planners.

### Wave sizing

- Smallest shippable vertical that advances the map.
- **Soft cap: 7** task specs per wave; spill remainder into later map rows without emitting them yet.

### Review merged into decide

There is **no** separate review recipe. Deciding-next-wave always:

1. Inspects current implementation and the previous wave file (if any)
2. Writes carry-forward deltas into the **next** wave file
3. Then sizes and creates that next wave’s tasks

### Halt on blocked

When `managing-tasks` execute-multiple (or a task-implementer) returns `Blocked task-...`:

1. Mark the current wave file `status: blocked` with the reason
2. Update the map row
3. **Stop the delivery loop** — do not decide or create the next wave
4. Parent reply must surface the blocked task id and reason

`stop_on_blocked: true` is required for delivery runs.

### Handoff style

Subagents and parent summaries return **references** (map path, wave path, `task-<NNN-slug>` ids), not document bodies, plan excerpts, or Slice Brief dumps.

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
