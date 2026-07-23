# Triaging Tasks

## Overview

**Read-only.** Report status for one or all tasks, identify which can begin or continue now, or build an **ordered execution roadmap** for backlog runs.

Use when the user asks for status, what to work on next, which tasks are unblocked, which tasks are waiting on something, or wants a roadmap/plan across the backlog.

To triage and then implement tasks in sequence, use [executing-multiple-tasks.md](./executing-multiple-tasks.md) (which plans via execution-roadmap mode here, then delegates to `task-implementer`).

## Prerequisites

Per [task-contract.md](./task-contract.md) → **Resolve tasks root**.

## Guidelines

### 1. Mode

| Mode | Trigger phrasing | Output |
| --- | --- | --- |
| **status-report** | "Status of `tasks/003-…`", "list all tasks", "task dashboard", "what's next on this task?" | Single-task or all-tasks status (§5) |
| **readiness-report** (default when triage-shaped) | "What can I start?", "Which tasks are ready?", "What's unblocked?" | Startable / not-ready tables (§6) |
| **execution-roadmap** | "Roadmap for tasks", "execution plan", "what order should I implement?", parent prompt with `max_completed` | Ordered roadmap (§7–§8) |

When mode is unclear between readiness and status, prefer **readiness-report** if the user asks what to start; otherwise **status-report**.

### 2. Resolve scope

| Scope | Trigger phrasing |
| --- | --- |
| Single task | "Status of `tasks/003-…`", "summarize the dark mode task" |
| All tasks | "List all tasks", "What can I start?", "Which tasks are ready?" |
| Filtered | "Ready tasks in the app package", "blocked tasks only" |

Per [task-contract.md](./task-contract.md) → **Resolve tasks root** and **Finding existing tasks**.

For readiness and roadmap: discover every task folder under `<tasks-root>/`. **Exclude** `<tasks-root>/archives/` unless the user or parent explicitly asks to include archived tasks.

For status-report of a single task: resolve under active root first; if missing and the user named an archived id, read under `archives/`.

Parse from the user or parent prompt when in execution-roadmap mode:

| Parameter | Default | Meaning |
| --- | --- | --- |
| `max_completed` | `5` | Include at most this many tasks in the roadmap |

### 3. Read artifacts

For each task folder in scope:

1. Read `status.md` — **first**
2. Read `plan.md` — goal, Requirements, Context, phases, frontmatter `todos`, verification checklist

Build a working map of task id → `overall_status`, `next_step_id`, `blocking_reason`, and Context → **Depends on**.

Do **not** modify any files.

### 4. Evaluate readiness

A task is **startable now** when the executor can run `next_step_id` per [executing-task.md](./executing-task.md) without inventing missing prerequisites, guessing file paths, or doing preparatory work that belongs in another task or workflow.

Evaluate **every** active task. A task may appear in only one group. Used by readiness-report and execution-roadmap modes.

#### 4.1 Lifecycle gate (hard stop)

| Condition | Verdict | Notes |
| --- | --- | --- |
| `overall_status` is `Done` or `Cancelled` | **Not ready** — lifecycle | Terminal; recreate via [creating-task.md](./creating-task.md) if needed |
| `overall_status` is `Blocked` or `blocking_reason` is set | **Not ready** — blocked | Report `blocking_reason`; unblock via [blocking-task.md](./blocking-task.md) |
| `next_step_id` is `none` | **Not ready** — no next step | Task may be misconfigured |
| `overall_status` is `Not Started` or `In Progress` with a runnable `next_step_id` | Continue checks below | `In Progress` with `next_step_id: verify` is startable |

#### 4.2 Task dependencies

Read `plan.md` → Context → **Depends on** only. Ignore **Related tasks**, phase prose, and freeform ordering language for readiness.

| **Depends on** value | Action |
| --- | --- |
| `none`, empty, or field missing | Pass — no task prerequisites |
| One or more folder names | Gate each entry per [task-contract.md](./task-contract.md) → **Resolve task dependency** |

All listed entries must be **Satisfied** (`Done` in active or `archives/`). **Related tasks** never blocks.

#### 4.3 Artifacts and references on disk

Check inputs the **next step** (and steps it explicitly builds on in the same phase) requires:

| Source in plan | Check |
| --- | --- |
| Context → **Primary files** | Path exists, or the plan says the next step creates it |
| Phase steps for `next_step_id` | Named paths, configs, fixtures, and assets exist or are created in an earlier **completed** step in this task |
| Context → **References** | Each basename resolves per [task-contract.md](./task-contract.md) → **Resolving domain references** |
| Requirements → **Sources** | External URLs and design/spec paths the task depends on |
| Design / spec pointers | Files or URLs named in the plan (mockup, stitch prompt, style guide, Figma link with accessible file, wireframe, API spec) exist and are usable |

| Condition | Verdict |
| --- | --- |
| All required inputs exist or are produced by completed steps in this task | Pass |
| Missing file, asset, design, or unresolved reference needed for the next step | **Not ready** — missing artifact |
| Plan points to design work that does not exist yet (e.g. "implement from mockup" with no mockup path) | **Not ready** — missing design |

**Design and asset gap examples:** no `style-guide.md` when the plan requires it; Figma URL with no export or spec file; `assets/` path empty when the step consumes assets; API contract referenced but not checked in.

#### 4.4 Plan completeness for the next step

Inspect the phase and todo matching `next_step_id`.

| Red flag | Verdict |
| --- | --- |
| Vague step with no file paths, patterns, or acceptance criteria (`implement feature`, `add UI`, `wire up backend`) | **Not ready** — missing input |
| Placeholders: `TBD`, `TODO`, `pending design`, `awaiting spec`, `???`, `fill in later` | **Not ready** — missing input |
| Next step assumes work that is not in the plan and not delivered by a completed **Depends on** task | **Not ready** — would invent steps |
| Concrete paths, patterns, skills, references, and acceptance criteria for the next step | Pass |

If the plan is incomplete but the gap is small and the user only asked for a readiness report, note the specific question to resolve in **Unblock action** — do not replan unless the user switches intent ([updating-task.md](./updating-task.md) or [creating-task.md](./creating-task.md)).

#### 4.5 Startable verdict

If the task passes **§4.1–§4.4**, mark it **Startable now**.

Record a one-line **Why startable** (e.g. "In Progress; next step `step-2` has paths and deps satisfied").

Treat tasks with `overall_status: Done` (including under `archives/`) as already satisfied for dependency checks in roadmap simulation. Treat `Cancelled` as not satisfied.

### 5. Status report (status-report mode)

**Single task — include:**

- Task folder path and title (`plan.md` frontmatter `name`)
- `overall_status`, `current_step_id`, `next_step_id`
- `blocking_reason`, `cancel_reason`, or `handoff_note` when set
- Step queue progress: completed, pending, cancelled counts; list unchecked steps
- Last 2–3 **Session log** rows
- Plan revision (`plan_revision` from `plan.md`)
- Suggested next action (execute, unblock, verify, cancel, create replacement) — **suggestion only**

**All tasks — table columns:**

| Task folder | Title | `overall_status` | `next_step_id` | `handoff_note` (truncated) |

Sort by task id. Group or filter by status when the user asks (e.g. "blocked tasks only"). Default to active (non-archived) folders.

Reply with the report. Do not advance the execution pointer, check off steps, or write application code unless the user switches intent (e.g. "continue this task" → [executing-task.md](./executing-task.md)).

### 6. Readiness report (readiness-report mode)

#### Startable now

| Task folder | Title | `overall_status` | `next_step_id` | Why startable |

Sort order:

1. `In Progress` first (continue existing work, including `next_step_id: verify`)
2. Then `Not Started`
3. Within each group, ascending task id

#### Not ready

| Task folder | Title | `overall_status` | Blocker type | Detail | Unblock action |

**Blocker type** — use one primary label:

| Label | Meaning |
| --- | --- |
| lifecycle | Done, Cancelled, or no runnable next step |
| blocked | `Blocked` status or `blocking_reason` |
| task dependency | Sibling task not finished (`Done`) |
| missing artifact | File, fixture, or resolved reference missing on disk |
| missing design | Design, mockup, or spec artifact missing |
| missing input | Plan too vague or placeholder content for the next step |
| would invent steps | Next step requires undefined preparatory work |

**Unblock action** — one concrete next step: finish prerequisite task, run design workflow, add asset path, amend plan, unblock task, etc. Link the relevant recipe when obvious ([blocking-task.md](./blocking-task.md), [creating-task.md](./creating-task.md), [updating-task.md](./updating-task.md)).

When the user asked for a single recommendation, pick the top **Startable now** row and say why. If none are startable, summarize the shortest path to unblock one task.

Reply with the report. Do not advance execution pointers, check off steps, create tasks, or write application code unless the user switches intent (e.g. "continue `tasks/003-…`" → [executing-task.md](./executing-task.md)).

### 7. Simulate execution roadmap (execution-roadmap mode)

Build the plan by simulating sequential completion — the same order [executing-multiple-tasks.md](./executing-multiple-tasks.md) will run — without implementing anything.

Initialize:

- `plan` — empty ordered list of `task-<NNN-slug>` ids
- `simulated_done` — task ids whose `overall_status` is already `Done` (active or under `archives/` when scanning deps)
- `remaining` — all non-archived task folders not in `simulated_done` and not `Cancelled`

Repeat until `len(plan) >= max_completed` or no progress in an iteration:

1. Re-evaluate **startable now** among `remaining` using §4, treating every id in `simulated_done` as a satisfied prerequisite (even if it was not `Done` at triage time but was added to the plan earlier in this simulation).
2. If zero tasks are startable → stop simulation.
3. Pick the top startable task using sort order from §6:
   - `In Progress` first
   - Then `Not Started`
   - Within each group, ascending task id
4. Append `task-<NNN-slug>` to `plan`.
5. Add that id to `simulated_done` and remove it from `remaining`.

This captures tasks that are not startable on disk yet but **will become** startable once earlier roadmap entries complete.

### 8. Roadmap output (execution-roadmap mode)

When the user asked for a roadmap directly, reply with a short summary plus an ordered list:

```
Execution roadmap (max <N> tasks):

1. task-<NNN-slug> — <title> (<overall_status>, next: <next_step_id>)
2. ...
```

If the plan is empty, say no tasks are runnable in the simulated series and point to the top blocker from §6 **Not ready** if helpful.

### 9. Constraints

- **Read-only** — do not modify task files, advance execution pointers, or write application code.
- **Plan once** — the orchestrator does not call triage again mid-run unless the user starts a new backlog run.
- **Trust simulation** — if a task lands in the roadmap but becomes blocked during implementation, the implementer handoff handles it; do not re-plan from triage mid-loop.
- Perform full triage internally even when the parent or user only sees a one-line or short roadmap.

## Examples

**Status:** User asks "what's the status of the dark mode task?". Read `status.md` → report without mutating files.

**Triage:** User asks "what can I work on?". Scan all active tasks → split into startable now vs not ready with blocker type and unblock action.
