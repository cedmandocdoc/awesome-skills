# Blocking a task

Mark a task as blocked when work cannot proceed. No implementation in this workflow.

## 1. Resolve task folder

Per [task-contract.md](./task-contract.md) → **Resolve tasks root** and **Finding tasks root**.

Resolve `<task-folder>` from the user's message under `<tasks-root>/`. If unclear, list folders per **Finding existing tasks** and ask. Read `status.md`, then `plan.md`.

If `overall_status` is `Cancelled` or `Done` → stop and tell the user.

## 2. Record blocking reason

Require a concrete `blocking_reason` from the user or context, e.g.:

- Waiting on external API or credentials
- Design review pending
- Upstream dependency not merged

## 3. Update `status.md`

1. Set `overall_status`: `Blocked`
2. Set `blocking_reason`: `<reason>`
3. Keep `current_step_id` and `next_step_id` unchanged — do **not** advance or check off steps
4. Update `handoff_note`: blocked; what must resolve before continuing
5. Append session log: date, current or `next_step_id`, `Blocked`, reason

Do **not** change `plan.md` frontmatter todo statuses.

## 4. Confirm to the user

Reply with:

- Task folder and `blocking_reason`
- Frozen `next_step_id`
- What to do when unblocked ([unblocking-task.md](./unblocking-task.md))

Do not implement application code in this workflow.
