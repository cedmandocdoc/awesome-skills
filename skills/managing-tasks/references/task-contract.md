# Task Contract

## Overview

Shared layout and field meanings for all `managing-tasks` workflows.

## Guidelines

### Author signature

Static UUID identifying tasks roots created by this skill:

```text
b2e4f6a8-3c1d-5e7f-9a2b-4d6e8f0c1a3b
```

Every `<tasks-root>/index.md` must include this value in frontmatter `author`. Search the repository for that field to locate the tasks root — do not infer the root from `plan.md`, `status.md`, or numbered task folders alone.

### Subagent signature

Static UUID identifying subagents owned by this skill:

```text
a7c9e1f3-5b2d-7e9f-1a3c-5d7e9f1b3a5c
```

Managed task agents (`task-planner`, `task-triager`, `task-implementer`) must include frontmatter `author` (this UUID) and `generated_by: managing-tasks`. Discovery and explicit creation flows: [finding-task-agents.md](./finding-task-agents.md), [creating-task-agents.md](./creating-task-agents.md).

### Output layout

Only this skill may establish a tasks root. The root is always marked by `<tasks-root>/index.md`.

```text
<tasks-root>/
  index.md                          # tasks root marker — required; created first
  <NNN>-<slug>/
    plan.md      # Stable spec: goal, phases, files, acceptance criteria
    status.md    # Mutable state: execution pointer, step queue, handoff note
    findings.md  # Optional for spike tasks: feasibility decision and handoff deliverables
  archive/       # Optional: cancelled or completed tasks moved here
    <NNN>-<slug>/
```

Templates: [`../assets/plan.md`](../assets/plan.md), [`../assets/status.md`](../assets/status.md), [`../assets/findings.md`](../assets/findings.md), [`../assets/index.md`](../assets/index.md) for new tasks roots.

### Plan frontmatter

Every `plan.md` includes YAML frontmatter:

| Field | Purpose |
| --- | --- |
| `name` | Task title |
| `overview` | One-line summary |
| `generated_by` | `managing-tasks` (legacy tasks may say `creating-tasks`) |
| `plan_revision` | Integer; start at `1`, bump on each plan amend |
| `todos` | Step queue: `id`, `content`, `status` (`pending` \| `completed` \| `skipped` \| `cancelled`) |

### Findings frontmatter (spike tasks)

When a task is a spike/research/investigation effort, `findings.md` should include:

| Field | Purpose |
| --- | --- |
| `doc_type` | Must be `task-findings` |
| `generated_by` | Must be `managing-tasks` |
| `task_type` | Must be `spike` |
| `recommendation` | `feasible` \| `not feasible` \| `conditional` |
| `confidence` | `low` \| `medium` \| `high` |
| `last_updated` | Date in `YYYY-MM-DD` |

Contract details: [findings-contract.md](./findings-contract.md).

### Resolve tasks root

1. Search per **Finding tasks root** below.
2. **Decide location:**
   - **One match** → use that folder; no need to ask.
   - **Multiple matches** → ask the user which root to use (list full paths to each `index.md`).
   - **No match** → on **create** intent: **ask the user where to create** the tasks folder. Do not assume a default path. Then follow **Initialize tasks root**. On any other intent: stop and report that no tasks root exists; do not initialize.

Do not create task folders outside the resolved root. Do not treat a folder as the tasks root unless it contains a valid `index.md` per **Finding tasks root**.

### Finding tasks root

Search the repository for `index.md` files whose YAML frontmatter contains **all** of:

| Field | Value |
| --- | --- |
| `doc_type` | `tasks-root-index` |
| `generated_by` | `managing-tasks` |
| `author` | `b2e4f6a8-3c1d-5e7f-9a2b-4d6e8f0c1a3b` (see **Author signature**) |

The tasks root is the parent directory of each matching `index.md` (e.g. `tasks/index.md` → root is `tasks/`).

After resolving the root, list and read task folders only under that directory.

### Initialize tasks root

When **no** valid `index.md` exists and the user is creating a task:

1. **Ask the user** for the target folder path (relative to repository root, e.g. `tasks/`, `docs/tasks/`).
2. **Verify the folder is empty:**
   - Path does not exist → OK; create the directory.
   - Path exists and contains **no files and no subdirectories** → OK.
   - Path exists and is **not empty** → stop. Tell the user the folder must be empty and ask for another path.
3. Write `<tasks-root>/index.md` from [`../assets/index.md`](../assets/index.md) with the **Author signature** in `author`. This is the first file the skill creates in a new root.
4. Proceed with the requested task folder(s) under that root.

Only this skill may create or replace `index.md`. If the user points at a non-empty folder without a valid `index.md`, do not write tasks there.

### Finding existing tasks

After resolving the tasks root per **Finding tasks root**, search under `<tasks-root>/` and `<tasks-root>/archive/` for directories matching `[0-9][0-9][0-9]-*/` that contain `plan.md`.

Treat `plan.md` as a task when frontmatter contains `generated_by: managing-tasks` **or** `generated_by: creating-tasks` (legacy).

### Status fields

| Field | Values | Meaning |
| --- | --- | --- |
| `overall_status` | `Not Started`, `In Progress`, `Blocked`, `Review`, `Done`, `Cancelled` | Task lifecycle |
| `current_step_id` | step id or `none` | Step in progress this session |
| `next_step_id` | step id or `none` | Next step for the executor |
| `blocking_reason` | text or `None` | Why work is blocked |
| `cancel_reason` | text or `None` | Why the task was cancelled |
| `handoff_note` | one sentence | What the next session should do first |

### Step queue rules

- Check off steps when completed.
- Skipped steps stay in the queue with a skip reason in the session log; set todo `status: skipped` in plan frontmatter.
- Never uncheck a completed step unless the user explicitly replans and confirms.
- `verify` is always the last step before `Done`.

### Resolving domain references (execute / plan)

For each entry in `plan.md` → Context → **References**:

| Plan entry | Resolve to |
| --- | --- |
| `reference-basename` | For each skill in **Skills to load**, try `<skill-dir>/references/reference-basename.md`; use the first match |
| `skill-name/reference-basename` | `<skill-dir>/references/reference-basename.md` for that skill only |

`<skill-dir>` is the folder containing that skill's `SKILL.md`. If missing under `references/`, use the link in that skill's `SKILL.md` index.

### Discovering project skills

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

**Choose skills to load** — include every skill whose `description` (frontmatter) or scope clearly governs the work area. Read each chosen skill's `SKILL.md` before picking references.

**Choose references for the plan** — per skill, in order:

1. **Task recipes** — if `SKILL.md` has a `## Task recipes` table, copy the closest row's reference basenames.
2. **Reference index** — pick rows whose "When to use" matches the task; add at most 1–2 extras if needed.
3. **`references/` folder** — list `<skill-dir>/references/*.md` and select basenames that match the task.
4. **Linked root docs** — include only when `SKILL.md` points to them for this task type.

Record basenames without `.md`. Use `skill-name/reference-basename` when names collide across skills.
