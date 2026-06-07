# Archiving a task

Move completed or cancelled tasks to `archive/`. No implementation in this workflow.

## 1. Resolve scope

| Scope | Trigger phrasing |
| --- | --- |
| Single task | "Archive `tasks/003-…`", "move this task to archive" |
| Batch | "Archive all done tasks", "clean up completed tasks" |

Resolve `<task-folder>` for a single task. For batch, discover tasks under each tasks root per [task-contract.md](./task-contract.md) → **Finding existing tasks**, then filter by `overall_status` (`Done` and/or `Cancelled` as the user specifies).

## 2. Eligibility

Archive only when `overall_status` is `Done` or `Cancelled`.

If the task is `In Progress`, `Blocked`, or `Review` → confirm with the user before archiving (unusual).

## 3. Move folder

For each task to archive:

1. Ensure `<tasks-root>/archive/` exists (create if missing)
2. Move `<tasks-root>/<NNN>-<slug>/` → `<tasks-root>/archive/<NNN>-<slug>/`
3. Update `task_folder` in `status.md` to the new path
4. Append session log: date, `—`, `Archived`, optional note

Do not delete task folders unless the user explicitly requests deletion.

## 4. Confirm to the user

Reply with:

- Original and archive paths for each moved task
- Count of tasks archived in batch mode

Do not implement application code in this workflow.
