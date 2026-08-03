# Cancelling Task

## Overview

**Execution mode.** Marks a task cancelled with reason, then auto-archives it. Terminal for that folder — recreate via [creating-task.md](./creating-task.md) if work is needed again.

## Prerequisites

Per [task-contract.md](./task-contract.md) → **Resolve tasks root**.

## Guidelines

### 1. Resolve task folder

Per [task-contract.md](./task-contract.md) → **Resolve tasks root**.

Resolve `<task-folder>` from the user's message under `<tasks-root>/`. If unclear, list folders per **Finding existing tasks** and ask. Read `status.md`, then `plan.md`.

If already `Done` → stop; Done tasks are already archived.

### 2. Confirm intent

If the user's message is ambiguous (e.g. "stop working on this"), confirm cancellation vs pause. Cancellation is terminal for this folder.

### 3. Record cancel reason

Capture `cancel_reason` from the user or context (e.g. duplicate task, wrong approach, deprioritized).

### 4. Update `status.md`

1. Set `overall_status`: `Cancelled`
2. Set `next_step_id`: `none`; `current_step_id`: `none`; `blocking_reason`: `None`
3. Add `cancel_reason`: `<reason>` to the execution pointer
4. Update `handoff_note`: task cancelled
5. Append session log: date, `—`, `Cancelled`, reason

Optional in `plan.md` frontmatter: set pending todos to `status: cancelled`; leave completed todos unchanged.

### 5. Auto-archive

Per [task-contract.md](./task-contract.md) → **Auto-archive**. Do not delete task folders unless the user explicitly requests deletion.

### 6. Confirm to the user

Reply with archived path, `cancel_reason`, and how to start fresh via [creating-task.md](./creating-task.md).
