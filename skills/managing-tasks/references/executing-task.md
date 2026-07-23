# Executing Task

## Overview

**Execution mode.** Implements the current step unless it is documentation-only. When `next_step_id` is `verify`, runs the verification checklist; on pass marks `Done` and auto-archives.

**Runtime truth:** `<task-folder>/status.md` then `plan.md` (do not re-read create templates). For `task_type: spike`, also satisfy [findings-contract.md](./findings-contract.md) before Done. **Infra:** [task-contract.md](./task-contract.md) → **Resolve tasks root**, **Finding existing tasks**, **Resolving domain references**, **Step queue rules**, **Auto-archive**, **`index.md` status mirror**.

## Prerequisites

Per [task-contract.md](./task-contract.md) → **Resolve tasks root**.

## Guidelines

### 1. Resolve task folder

Per [task-contract.md](./task-contract.md) → **Resolve tasks root** and **Finding tasks root**.

Resolve `<task-folder>` from the user's message under `<tasks-root>/` (active only). If unclear, list folders per **Finding existing tasks** (exclude `archives/` unless the user points there) and ask.

### 2. Startup protocol

1. Read `<task-folder>/status.md` — **first**
2. Read `<task-folder>/plan.md` — Goal, **Requirements** (Sources, Constraints, Acceptance), Context, and the current step
3. If `overall_status` is `Cancelled` → stop; tell the user the task was cancelled (recreate via [creating-task.md](./creating-task.md) if needed)
4. If `overall_status` is `Blocked` → stop unless the user says to unblock; address `blocking_reason` first ([blocking-task.md](./blocking-task.md))
5. If `overall_status` is `Done` → stop; confirm completion (folder should already be under `archives/`)
6. Set `overall_status` to `In Progress` if it was `Not Started`

### 3. Execute `next_step_id`

If `next_step_id` is `verify`, go to **§4 Verify**.

Otherwise:

1. Find the step in `plan.md` (phases and/or frontmatter `todos`)
2. Apply **Requirements** — open Sources URLs/paths the step depends on (Figma, tickets, specs); honor Constraints and Acceptance
3. Load Context **Skills to load** from `plan.md`; read each skill's `SKILL.md`
4. Read Context **References** per [task-contract.md](./task-contract.md) → **Resolving domain references**
5. Implement the step: code, config, or docs as the plan specifies
6. Run quick checks mentioned in the plan (lint, typecheck) when practical

### 4. Verify

Run when `next_step_id` is `verify` (or the user asks to verify / mark done and only `verify` remains).

1. Ensure all non-`verify` steps are `completed` in the step queue and plan frontmatter todos
2. If pending implementation steps remain → stop; tell the user to finish them first or replan ([updating-task.md](./updating-task.md))
3. Keep `overall_status`: `In Progress`; `next_step_id`: `verify`
4. Execute every item in `plan.md` → **Verification checklist**:
   - Automated checks (lint, typecheck, tests) when practical
   - Manual smoke steps when listed
   - Do **not** add new features; only verify existing work
5. For spikes, also satisfy [findings-contract.md](./findings-contract.md)
6. Record pass/fail per item

**If all checks pass** → go to **§5 Mark Done and archive**.

**If checks fail:**

1. Keep `overall_status`: `In Progress`
2. Set `handoff_note` with failing items and suggested fix step
3. Append session log: date, `verify`, `Failed`, failing items
4. Optionally add a fix todo via [updating-task.md](./updating-task.md) if the user wants a formal replan
5. Sync `<tasks-root>/index.md` when `overall_status` changed

### 5. Mark Done and archive

When verification passes:

1. Check off `verify` in the step queue
2. Set todo `verify` to `status: completed` in `plan.md` frontmatter
3. Set `overall_status`: `Done`
4. Set `current_step_id`: `verify`
5. Set `next_step_id`: `none`
6. Update `handoff_note`: task complete
7. Append session log: date, `verify`, `Completed`, brief results
8. Auto-archive per [task-contract.md](./task-contract.md) → **Auto-archive** (move to `archives/`, update `task_folder`, remove index row)

### 6. Update `status.md` after a non-verify step

| After step | Update |
| --- | --- |
| Step completed | Check off step in queue; set todo `status: completed` in `plan.md` frontmatter |
| More steps remain | Set `current_step_id` to completed step; set `next_step_id` to following step |
| Only `verify` remains | Keep `overall_status`: `In Progress`; `next_step_id`: `verify` |

Always update:

- `handoff_note` — one sentence for the next session
- **Session log** — date, step id, result, brief notes
- `<tasks-root>/index.md` `Status` for this task when `overall_status` changed (per [task-contract.md](./task-contract.md) → **`index.md` status mirror**)

### 7. Blocked workflow

If a blocker prevents finishing the step, follow [blocking-task.md](./blocking-task.md) (or apply the same updates inline):

- Set `overall_status`: `Blocked`
- Set `blocking_reason` to a concrete description
- Do **not** advance `next_step_id` or check off the step
- Log the attempt in the session log

If the user only wants to unblock without implementing, use [blocking-task.md](./blocking-task.md) → **Unblock**.

### 8. Confirm to the user

Reply with:

- Step completed, verification results, or blocked reason
- New `next_step_id` and `overall_status` (or archived path when `Done`)
- Suggested follow-up if work remains

## Examples

**Execute:** User says continue `tasks/001-dark-mode-toggle`. Read `status.md` first → run `next_step_id`.

**Verify and archive:** `next_step_id` is `verify` → run checklist → on pass move to `tasks/archives/001-dark-mode-toggle/`.
