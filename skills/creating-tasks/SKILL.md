---
name: creating-tasks
description: Creates structured task folders with plan.md and status.md for cross-session agent handoff. Discovers project skills from agent IDE roots (.agents, .claude, .cursor, etc.) and reference docs, writes an implementation plan, and initializes execution status. Use when the user wants to create or plan a task, start structured work with a written spec, or resume work from an existing task folder.
---

# Creating Tasks

Creates durable, handoff-ready task artifacts on disk. **Planning only** — do not implement unless the user explicitly asks in the same message.

Works in any coding environment where the agent can read and write repository files. The on-disk layout (`plan.md`, `status.md`) is the contract between sessions and tools.

## When to use

**Create a task**

- User says "create a task", "new task", "plan this work", or similar
- User provides a title plus details and wants a plan written to disk
- User wants a follow-up session to continue without chat history

**Continue a task**

- User says "continue task", "resume task", or names a task folder (e.g. `tasks/001-dark-mode-toggle`)
- User asks to pick up where a previous session left off — read that folder's `status.md` first

## How users trigger this skill

| Intent | Example phrasing | Agent action |
| --- | --- | --- |
| Create | "Create a task: …", "Plan … as a task" | Run this skill's create workflow |
| Continue | "Continue `tasks/001-…`", "Resume the dark mode task" | Read `<task-folder>/status.md`, execute `next_step_id`, update `status.md` |

Load this skill when the user's intent matches create or continue, whether they @-mention the skill, attach it, or describe the work in natural language.

## Output layout

```text
<tasks-root>/
  <NNN>-<slug>/
    plan.md      # Stable spec: goal, phases, files, acceptance criteria
    status.md    # Mutable state: execution pointer, step queue, handoff note
```

Templates: [`templates/plan.md`](templates/plan.md), [`templates/status.md`](templates/status.md).

Every `plan.md` includes `generated_by: creating-tasks` in YAML frontmatter so later runs can find tasks created by this skill.

## Workflow (create)

### 1. Resolve tasks root

Determine where to write task documents:

1. **Search for existing skill tasks** — find `plan.md` files containing `generated_by: creating-tasks` (use ripgrep or glob + read frontmatter).
2. **Collect parent folders** — for each match, the tasks root is the directory that contains the numbered task folder (e.g. `tasks/007-foo/plan.md` → root is `tasks/`).
3. **Decide location:**
   - **One unique root** → use it; no need to ask.
   - **Multiple roots** → ask the user which root to use (list paths).
   - **No matches** → default to `tasks/` at the repository root, then **ask the user to confirm or specify** a different path (e.g. `docs/tasks/`).

Do not create task folders outside the resolved root unless the user explicitly overrides.

### 2. Assign task id and slug

Within the resolved tasks root:

1. List directories matching `[0-9][0-9][0-9]-*/`.
2. Parse the highest three-digit prefix; next id = max + 1 (or `001` if none).
3. Build slug from the title:
   - lowercase, hyphens only, max ~40 chars
   - drop filler words when helpful (`implement`, `the`, `a`)
   - example: `Add user profile settings page` → `user-profile-settings`
4. Folder name: `{id}-{slug}` (e.g. `007-user-profile-settings`).

If the folder already exists, stop and ask whether to overwrite or pick a new slug.

### 3. Gather project context

Before writing the plan, build context from the project and the user's request:

| Source | What to extract |
| --- | --- |
| User input | Goal, constraints, files/features mentioned |
| `README.md`, `AGENTS.md` | Conventions, skill references, architecture notes |
| Project structure | Monorepo layout, app/package boundaries, key directories |
| Mentioned files | **Read them** — patterns, dependencies, related code |
| Project skills | Discover applicable skills (see **Discovering skills and references** below) |
| Existing tasks | Related plans under the tasks root (reference, do not duplicate) |

Ask **at most one** clarifying question if scope or target area is ambiguous.

### Discovering skills and references

Each skill is `<skill-name>/SKILL.md` with optional `references/`, `scripts/`, and `assets/` ([Agent Skills](https://agentskills.io)).

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

**Choose skills to load** — include every skill whose `description` (frontmatter) or scope clearly governs the work area (stack, folder, doc type, workflow). Read each chosen skill’s `SKILL.md` before picking references.

**Choose references for the plan** — per skill, in order:

1. **Task recipes** — if `SKILL.md` has a `## Task recipes` (or equivalent) table, copy the closest row’s reference basenames.
2. **Reference index** — if `SKILL.md` has a reference table or categorized index (`## Reference index`, `## References`, etc.), pick the rows whose “When to use” matches the task; add at most 1–2 extras if needed.
3. **`references/` folder** — if neither table exists, list `<skill-dir>/references/*.md` and select basenames that match the task from filenames and a quick read of intros.
4. **Linked root docs** — include `reference.md`, `examples.md`, or scripts only when `SKILL.md` points to them for this task type.

Record basenames without `.md`. Use `skill-name/reference-basename` when names collide across skills.

### 4. Write `plan.md`

Use [`templates/plan.md`](templates/plan.md). Required sections:

| Section | Content |
| --- | --- |
| YAML frontmatter | `name`, `overview`, `generated_by`, `todos` (id + content + status: pending) |
| Goal | One paragraph outcome |
| Non-goals | Explicit out-of-scope items |
| Context | Links to files, related tasks, **skills to load**, and **references** |
| Phases | Ordered steps with concrete file paths; optional per-phase `References:` when a step needs a different doc set |
| Verification checklist | How to confirm done |
| Risks | Non-obvious decisions or blockers |

Keep phases implementation-ready: file paths, patterns to follow, acceptance criteria per phase.

**Skills and references** — when conventions apply, fill both Context fields using **Discovering skills and references** above. Include reference basenames, not skill names alone (~6 references max unless scope requires more).

### 5. Write `status.md`

Use [`templates/status.md`](templates/status.md). Initialize:

- `overall_status`: `Not Started`
- `next_step_id`: first step id from the plan's todo/step queue
- All steps: unchecked
- `handoff_note`: one sentence describing what the executor should do first
- Include full `task_folder` path in the execution pointer

### 6. Confirm to the user

Reply with:

- Tasks root path and task folder path
- One-line summary
- `next_step_id` for the executor
- Suggested follow-up: _"Continue `tasks/001-dark-mode-toggle`"_ or _"Read `tasks/001-dark-mode-toggle/status.md` and run the next step"_

**Do not write application code** in this workflow unless the user also asks to implement.

## Workflow (continue)

Resolve `<task-folder>` from the user's message (or ask under the tasks root), then follow **Executor handoff**.

## Executor handoff

1. Read `<task-folder>/status.md`, then `plan.md`
2. Load Context **skills**; read **references** per **Resolving references**
3. Execute `next_step_id` unless `overall_status` is `Blocked`
4. Update `status.md` before stopping

### Resolving references (continue / execute)

For each entry in `plan.md` → Context → **References**:

| Plan entry | Resolve to |
| --- | --- |
| `reference-basename` | For each skill in **Skills to load**, try `<skill-dir>/references/reference-basename.md`; use the first match, or every match if the plan implies all skills share that doc name |
| `skill-name/reference-basename` | `<skill-dir>/references/reference-basename.md` for that skill only |

`<skill-dir>` is the folder containing that skill’s `SKILL.md` (per **Discovering skills and references**). If missing under `references/`, use the link in that skill’s `SKILL.md` index.

## Examples

**User:** Create a task "Add dark mode toggle" — persist preference in localStorage, follow existing theme setup in `src/theme.css`.

**Agent actions:**

1. Search for `generated_by: creating-tasks` → none found → propose `tasks/`, user confirms
2. Next id → scan `tasks/` → e.g. `001`
3. Slug → `dark-mode-toggle`
4. Read `src/theme.css`, related files; discover skill + references per **Discovering skills and references**
5. Write `plan.md` + `status.md` with Context **Skills to load** and **References**
6. Stop without implementing; suggest continuing `tasks/001-dark-mode-toggle`

**User:** Create another task after several exist under `docs/tasks/`.

**Agent actions:**

1. Search finds plans with signature under `docs/tasks/` → use that root automatically
2. Assign next id, gather context, write plan + status
3. Confirm path to user

**User:** Continue `tasks/001-dark-mode-toggle`.

**Agent actions:** Follow **Executor handoff**.
