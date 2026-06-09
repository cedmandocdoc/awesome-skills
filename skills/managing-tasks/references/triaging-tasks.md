# Triaging tasks

**Read-only.** Among available tasks, identify which can begin or continue implementation now and which still need prep work, inputs, or upstream completion.

Use when the user asks what to work on next across the backlog, which tasks are unblocked, or which tasks are waiting on something.

## 1. Resolve scope

| Scope | Trigger phrasing |
| --- | --- |
| All tasks | "What can I start?", "Which tasks are ready?", "What's unblocked?" |
| Filtered | "Ready tasks in the app package", "Startable tasks that aren't in progress" |

Per [task-contract.md](./task-contract.md) → **Resolve tasks root** and **Finding existing tasks**.

Discover every task folder under `<tasks-root>/` and `<tasks-root>/archive/`. **Exclude archived tasks** unless the user asks to include them.

## 2. Read artifacts

For each task folder:

1. Read `status.md` — **first**
2. Read `plan.md` — goal, Context, phases, frontmatter `todos`, verification checklist

Build a working map of task id → `overall_status`, `next_step_id`, `blocking_reason`, and Context → **Related tasks**.

Do **not** modify any files.

## 3. Evaluate readiness

A task is **startable now** when the executor can run `next_step_id` per [executing-task.md](./executing-task.md) without inventing missing prerequisites, guessing file paths, or doing preparatory work that belongs in another task or workflow.

Evaluate **every** task. A task may appear in only one group.

### 3.1 Lifecycle gate (hard stop)

| Condition | Verdict | Notes |
| --- | --- | --- |
| `overall_status` is `Done` or `Cancelled` | **Not ready** — lifecycle | No implementation work unless user reopens ([reopening-task.md](./reopening-task.md)) |
| `overall_status` is `Blocked` or `blocking_reason` is set | **Not ready** — blocked | Report `blocking_reason`; unblock via [unblocking-task.md](./unblocking-task.md) |
| `next_step_id` is `none` and status is not `Review` needing verify | **Not ready** — no next step | Task may be complete or misconfigured |
| `overall_status` is `Not Started`, `In Progress`, or `Review` with a runnable `next_step_id` | Continue checks below | `Review` is startable when `next_step_id` is `verify` |

### 3.2 Task dependencies

Inspect `plan.md` → Context → **Related tasks** and phase text for ordering language (`depends on`, `after`, `requires`, `blocked by`, `once … is done`).

For each referenced sibling task folder:

1. Resolve the path under `<tasks-root>/`
2. Read its `status.md` → `overall_status`

| Condition | Verdict |
| --- | --- |
| Prerequisite task is `Done` or explicitly listed as non-blocking in the plan | Pass |
| Prerequisite task is `Not Started`, `In Progress`, `Blocked`, `Review`, or `Cancelled` | **Not ready** — task dependency |
| Related task path missing or not a valid task folder | **Not ready** — broken dependency link |

When the plan does not state whether a related task is a prerequisite, treat it as **informational only** unless phase text implies ordering.

### 3.3 Artifacts and references on disk

Check inputs the **next step** (and steps it explicitly builds on in the same phase) requires:

| Source in plan | Check |
| --- | --- |
| Context → **Primary files** | Path exists, or the plan says the next step creates it |
| Phase steps for `next_step_id` | Named paths, configs, fixtures, and assets exist or are created in an earlier **completed** step in this task |
| Context → **References** | Each basename resolves per [task-contract.md](./task-contract.md) → **Resolving domain references** |
| Design / spec pointers | Files or URLs named in the plan (mockup, stitch prompt, style guide, Figma link with accessible file, wireframe, API spec) exist and are usable |

| Condition | Verdict |
| --- | --- |
| All required inputs exist or are produced by completed steps in this task | Pass |
| Missing file, asset, design, or unresolved reference needed for the next step | **Not ready** — missing artifact |
| Plan points to design work that does not exist yet (e.g. "implement from mockup" with no mockup path) | **Not ready** — missing design |

**Design and asset gap examples:** no `style-guide.md` when the plan requires it; Figma URL with no export or spec file; `assets/` path empty when the step consumes assets; API contract referenced but not checked in.

### 3.4 Plan completeness for the next step

Inspect the phase and todo matching `next_step_id`.

| Red flag | Verdict |
| --- | --- |
| Vague step with no file paths, patterns, or acceptance criteria (`implement feature`, `add UI`, `wire up backend`) | **Not ready** — missing input |
| Placeholders: `TBD`, `TODO`, `pending design`, `awaiting spec`, `???`, `fill in later` | **Not ready** — missing input |
| Next step assumes work that is not in the plan and not in a completed related task | **Not ready** — would invent steps |
| Concrete paths, patterns, skills, references, and acceptance criteria for the next step | Pass |

If the plan is incomplete but the gap is small and the user only asked for a readiness report, note the specific question to resolve in **Unblock action** — do not replan unless the user switches intent ([updating-task.md](./updating-task.md) or [creating-task.md](./creating-task.md)).

### 3.5 Startable verdict

If the task passes **§3.1–§3.4**, mark it **Startable now**.

Record a one-line **Why startable** (e.g. "In Progress; next step `step-2` has paths and deps satisfied").

## 4. Build the report

### Startable now

| Task folder | Title | `overall_status` | `next_step_id` | Why startable |

Sort order:

1. `In Progress` first (continue existing work)
2. Then `Review` with `verify`
3. Then `Not Started`
4. Within each group, ascending task id

### Not ready

| Task folder | Title | `overall_status` | Blocker type | Detail | Unblock action |

**Blocker type** — use one primary label:

| Label | Meaning |
| --- | --- |
| lifecycle | Done, Cancelled, or no runnable next step |
| blocked | `Blocked` status or `blocking_reason` |
| task dependency | Sibling task not finished |
| missing artifact | File, fixture, or resolved reference missing on disk |
| missing design | Design, mockup, or spec artifact missing |
| missing input | Plan too vague or placeholder content for the next step |
| would invent steps | Next step requires undefined preparatory work |

**Unblock action** — one concrete next step: finish prerequisite task, run design workflow, add asset path, amend plan, unblock task, etc. Link the relevant recipe when obvious ([blocking-task.md](./blocking-task.md), [creating-task.md](./creating-task.md), [updating-task.md](./updating-task.md)).

When the user asked for a single recommendation, pick the top **Startable now** row and say why. If none are startable, summarize the shortest path to unblock one task.

## 5. Confirm to the user

Reply with the report. Do not advance execution pointers, check off steps, create tasks, or write application code unless the user switches intent (e.g. "continue `tasks/003-…`" → [executing-task.md](./executing-task.md)).
