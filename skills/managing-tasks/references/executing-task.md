# Executing Task

## Overview

**Execution mode.** Implements the current step unless it is documentation-only.

## Prerequisites

Per [task-contract.md](./task-contract.md) → **Resolve tasks root** and **Finding tasks root**.

## Guidelines

### 1. Resolve task folder

Per [task-contract.md](./task-contract.md) → **Resolve tasks root** and **Finding tasks root**.

Resolve `<task-folder>` from the user's message under `<tasks-root>/`. If unclear, list folders per **Finding existing tasks** and ask.

### 2. Startup protocol

1. Read `<task-folder>/status.md` — **first**
2. Read `<task-folder>/plan.md` for step details and acceptance criteria
3. If `overall_status` is `Cancelled` → stop; tell the user the task was cancelled
4. If `overall_status` is `Blocked` → stop unless the user says to unblock; address `blocking_reason` first
5. If `overall_status` is `Done` → stop; confirm completion or offer [archiving-task.md](./archiving-task.md)
6. Set `overall_status` to `In Progress` if it was `Not Started` or `Review`

### 3. Execute `next_step_id`

1. Find the step in `plan.md` (phases and/or frontmatter `todos`)
2. Load Context **Skills to load** from `plan.md`; read each skill's `SKILL.md`
3. Read Context **References** per [task-contract.md](./task-contract.md) → **Resolving domain references**
4. Implement the step: code, config, or docs as the plan specifies
5. Run quick checks mentioned in the plan (lint, typecheck) when practical

### 4. Update `status.md` before stopping

| After step | Update |
| --- | --- |
| Step completed | Check off step in queue; set todo `status: completed` in `plan.md` frontmatter |
| More steps remain | Set `current_step_id` to completed step; set `next_step_id` to following step |
| Only `verify` remains | Set `overall_status` to `Review`; `next_step_id`: `verify` |
| `verify` completed | Run verification checklist in `plan.md`; if all pass → `overall_status`: `Done`, `next_step_id`: `none` |

Always update:

- `handoff_note` — one sentence for the next session
- **Session log** — date, step id, result, brief notes

### 5. Blocked workflow

If a blocker prevents finishing the step, follow [blocking-task.md](./blocking-task.md) (or apply the same updates inline):

- Set `overall_status`: `Blocked`
- Set `blocking_reason` to a concrete description
- Do **not** advance `next_step_id` or check off the step
- Log the attempt in the session log

If the user only wants to unblock without implementing, use [unblocking-task.md](./unblocking-task.md).

### 6. Confirm to the user

Reply with:

- Step completed (or blocked reason)
- New `next_step_id` and `overall_status`
- Suggested follow-up if work remains

## Examples

**Execute:** User says continue `tasks/001-dark-mode-toggle`. Read `status.md` first → run `next_step_id`.
