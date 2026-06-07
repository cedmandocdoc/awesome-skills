# Cancelling a task

Mark a task as abandoned. No further execution unless the user explicitly replans.

## 1. Resolve task folder

Resolve `<task-folder>` from the user's message. Read `status.md`, then `plan.md`.

If already `Done` → confirm the user intends to cancel a completed task (unusual); otherwise stop.

## 2. Confirm intent

If the user's message is ambiguous (e.g. "stop working on this"), confirm cancellation vs pause. Cancellation is terminal for execution.

## 3. Record cancel reason

Capture `cancel_reason` from the user or context (e.g. duplicate task, wrong approach, deprioritized).

## 4. Update `status.md`

1. Set `overall_status`: `Cancelled`
2. Set `next_step_id`: `none`
3. Set `current_step_id`: `none`
4. Set `blocking_reason`: `None`
5. Add to execution pointer: `cancel_reason`: `<reason>`
6. Update `handoff_note`: task cancelled; replan only if user revives
7. Append session log: date, `—`, `Cancelled`, reason

**`plan.md` frontmatter (optional):**

- Set pending todos to `status: cancelled`
- Leave completed and skipped todos unchanged

## 5. Archive (optional)

If the user asks to archive or the tasks root uses `archive/`, follow [archiving-task.md](./archiving-task.md).

Do not delete task folders unless the user explicitly requests deletion.

## 6. Confirm to the user

Reply with:

- Task folder and `cancel_reason`
- Archive path if moved
- How to start fresh (new task via [creating-task.md](./creating-task.md)) or reopen (via [reopening-task.md](./reopening-task.md))

Do not implement application code in this workflow.
