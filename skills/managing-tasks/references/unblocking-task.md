# Unblocking Task

## Overview

**Execution mode.** Clears blocker and restores `In Progress`.

## Prerequisites

Per [task-contract.md](./task-contract.md) → **Resolve tasks root**.

## Guidelines

### 1. Resolve task folder

Per [task-contract.md](./task-contract.md) → **Resolve tasks root** and **Finding tasks root**.

Resolve `<task-folder>` from the user's message under `<tasks-root>/`. If unclear, list folders per **Finding existing tasks** and ask. Read `status.md`, then `plan.md`.

If `overall_status` is not `Blocked` → stop; tell the user the task is not blocked (offer [checking-task.md](./checking-task.md) for status).

If `overall_status` is `Cancelled` or `Done` → stop and tell the user.

### 2. Confirm resolution

Capture how the blocker was resolved (from the user or context). Optional one-line note for the session log.

### 3. Update `status.md`

1. Set `blocking_reason`: `None`
2. Set `overall_status`: `In Progress` (or `Review` if only `verify` remains unchecked and was already in review)
3. Confirm `next_step_id` still exists in the step queue and is pending; if not, set to the first unchecked pending step
4. Update `handoff_note` for the executor
5. Append session log: date, `next_step_id`, `Unblocked`, resolution note
6. Sync `<tasks-root>/index.md` `Status` for this task to the new `overall_status` (per [task-contract.md](./task-contract.md) → **`index.md` status mirror**)

### 4. Confirm to the user

Reply with:

- Task folder and resolution summary
- Restored `overall_status` and `next_step_id`
- Suggested follow-up: _"Continue `<task-folder>`"_ → [executing-task.md](./executing-task.md) if work should resume now

Do not implement application code unless the user also asked to continue in the same message.
