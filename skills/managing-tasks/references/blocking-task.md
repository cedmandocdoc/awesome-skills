# Blocking Task

## Overview

**Execution mode.** Marks a task blocked with reason and freezes the execution pointer, or clears a blocker and restores `In Progress`.

## Prerequisites

Per [task-contract.md](./task-contract.md) → **Resolve tasks root**.

## Guidelines

### 1. Resolve task folder

Per [task-contract.md](./task-contract.md) → **Resolve tasks root** and **Finding tasks root**.

Resolve `<task-folder>` from the user's message under `<tasks-root>/`. If unclear, list folders per **Finding existing tasks** and ask. Read `status.md`, then `plan.md`.

Match intent: **block** vs **unblock**. When unclear, ask once.

### 2. Block

If `overall_status` is `Cancelled` or `Done` → stop and tell the user.

#### Record blocking reason

Require a concrete `blocking_reason` from the user or context, e.g.:

- Waiting on external API or credentials
- Design review pending
- Upstream dependency not merged

#### Update `status.md`

1. Set `overall_status`: `Blocked`
2. Set `blocking_reason`: `<reason>`
3. Keep `current_step_id` and `next_step_id` unchanged — do **not** advance or check off steps
4. Update `handoff_note`: blocked; what must resolve before continuing
5. Append session log: date, current or `next_step_id`, `Blocked`, reason
6. Sync `<tasks-root>/index.md` `Status` for this task to `Blocked` (per [task-contract.md](./task-contract.md) → **`index.md` status mirror**)

Do **not** change `plan.md` frontmatter todo statuses.

#### Confirm to the user

Reply with:

- Task folder and `blocking_reason`
- Frozen `next_step_id`
- What to do when unblocked (this doc → **Unblock**)

Do not implement application code in the block workflow.

### 3. Unblock

If `overall_status` is not `Blocked` → stop; tell the user the task is not blocked (offer [triaging-tasks.md](./triaging-tasks.md) status-report for status).

If `overall_status` is `Cancelled` or `Done` → stop and tell the user.

#### Confirm resolution

Capture how the blocker was resolved (from the user or context). Optional one-line note for the session log.

#### Update `status.md`

1. Set `blocking_reason`: `None`
2. Set `overall_status`: `In Progress` (including when only `verify` remains)
3. Confirm `next_step_id` still exists in the step queue and is pending; if not, set to the first unchecked pending step
4. Update `handoff_note` for the executor
5. Append session log: date, `next_step_id`, `Unblocked`, resolution note
6. Sync `<tasks-root>/index.md` `Status` for this task to `In Progress` (per [task-contract.md](./task-contract.md) → **`index.md` status mirror**)

#### Confirm to the user

Reply with:

- Task folder and resolution summary
- Restored `overall_status` and `next_step_id`
- Suggested follow-up: _"Continue `<task-folder>`"_ → [executing-task.md](./executing-task.md) if work should resume now

Do not implement application code unless the user also asked to continue in the same message.
