# Checking a task

**Read-only.** Report status without changing artifacts or implementing work.

## 1. Resolve scope

Determine what the user wants:

| Scope | Trigger phrasing |
| --- | --- |
| Single task | "Status of `tasks/003-…`", "summarize the dark mode task", "what's next on this task?" |
| All tasks | "List all tasks", "task dashboard", "what's in progress?" |

Per [task-contract.md](./task-contract.md) → **Resolve tasks root** and **Finding tasks root**.

For a single task, resolve `<task-folder>` from the user's message under `<tasks-root>/`. If unclear, list folders per **Finding existing tasks** and ask.

For all tasks, discover every task folder under `<tasks-root>/` per **Finding existing tasks**.

## 2. Read artifacts

**Single task:**

1. Read `<task-folder>/status.md` — **first**
2. Read `<task-folder>/plan.md` for goal, phases, and verification checklist

**All tasks:**

1. For each task folder, read `status.md` (and `plan.md` frontmatter `name` / `overview` if status is sparse)

Do **not** modify any files.

## 3. Build the report

**Single task — include:**

- Task folder path and title (`plan.md` frontmatter `name`)
- `overall_status`, `current_step_id`, `next_step_id`
- `blocking_reason`, `cancel_reason`, or `handoff_note` when set
- Step queue progress: completed, pending, skipped, cancelled counts; list unchecked steps
- Last 2–3 **Session log** rows
- Plan revision (`plan_revision` from `plan.md`)
- Suggested next action (execute, unblock, verify, reopen, archive) — **suggestion only**

**All tasks — table columns:**

| Task folder | Title | `overall_status` | `next_step_id` | `handoff_note` (truncated) |

Sort by task id. Group or filter by status when the user asks (e.g. "blocked tasks only").

## 4. Confirm to the user

Reply with the report. Do not advance the execution pointer, check off steps, or write application code unless the user switches intent (e.g. "continue this task" → [executing-task.md](./executing-task.md)).
