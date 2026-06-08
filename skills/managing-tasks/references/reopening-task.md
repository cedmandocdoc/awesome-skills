# Reopening a task

Restore a cancelled task for continued work. Replanning optional; this workflow only restores execution state.

## 1. Resolve task folder

Per [task-contract.md](./task-contract.md) → **Resolve tasks root** and **Finding tasks root**.

Resolve `<task-folder>` from the user's message under `<tasks-root>/`. If unclear, list folders per **Finding existing tasks** and ask. Read `status.md`, then `plan.md`.

If `overall_status` is not `Cancelled` → stop; tell the user (offer [checking-task.md](./checking-task.md) or [executing-task.md](./executing-task.md) as appropriate).

## 2. Confirm intent

Confirm the user intends to reopen, not start a separate copy. Reopening continues the same folder; for a new task with similar scope, use [creating-task.md](./creating-task.md).

If scope also changed, follow [updating-task.md](./updating-task.md) after reopening or in the same session if the user asks.

## 3. Restore execution state

1. Set `overall_status`: `In Progress` (or `Not Started` if no steps were ever completed)
2. Set `cancel_reason`: `None`
3. Set `blocking_reason`: `None`
4. Set `next_step_id` to the first pending step in the step queue (first unchecked non-`verify` step, or `verify` if only verification remains)
5. Set `current_step_id`: `none`
6. In `plan.md` frontmatter, set todos with `status: cancelled` back to `status: pending` (leave `completed` and `skipped` unchanged)
7. Update `handoff_note` for the executor
8. Append session log: date, `—`, `Reopened`, reason

**Optional plan changelog** — if the user describes scope changes while reopening, bump `plan_revision` and add a row per [updating-task.md](./updating-task.md).

## 4. Confirm to the user

Reply with:

- Task folder and reopen reason
- Restored `overall_status` and `next_step_id`
- Suggested follow-up: _"Continue `<task-folder>`"_ → [executing-task.md](./executing-task.md)

Do not implement application code unless the user also asked to continue in the same message.
