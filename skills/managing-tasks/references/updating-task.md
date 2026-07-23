# Updating Task

## Overview

**Planning only.** Amends `plan.md` and syncs `status.md` when scope changes.

**Structure:** keep section order from [`../assets/plan.md`](../assets/plan.md); fill rules match [creating-task.md](./creating-task.md) §4. **Infra:** [task-contract.md](./task-contract.md) → **Resolve tasks root**, **Step queue rules**, **`index.md` status mirror**, **Discovering project skills**.

## Prerequisites

Per [task-contract.md](./task-contract.md) → **Resolve tasks root**.

## Guidelines

### 1. Resolve task folder

Same as [executing-task.md](./executing-task.md) → step 1.

### 2. Read current state

1. Read `status.md`, then `plan.md`
2. Note `overall_status`, completed steps, and `next_step_id`
3. If `overall_status` is `Cancelled` (or the folder is only under `archives/` as cancelled) → stop; tell the user to create a new task via [creating-task.md](./creating-task.md)

### 3. Gather changes

From the user message, determine:

- New goals, phases, or acceptance criteria
- New or corrected **Requirements** (Sources URLs, scope, constraints, acceptance)
- Removed or deferred scope (move to Non-goals)
- New files, skills, or skill reference basenames to add to Context

Ask **at most one** clarifying question if the amend scope is ambiguous.

### 4. Update `plan.md`

1. Bump `plan_revision` in frontmatter (e.g. `1` → `2`)
2. Append a **Plan changelog** section entry (if missing, add the section before Phases):

   ```markdown
   ## Plan changelog

   | Rev | Date | Summary |
   | --- | --- | --- |
   | 2 | YYYY-MM-DD | Added phase 3 for API error handling |
   ```

3. Edit Goal, Requirements, Non-goals, Context, Approach, Phases, Verification checklist, and Risks as needed
4. When the user adds a URL or design link, append it to Requirements → **Sources** (verbatim); do not leave it only in chat or phase prose
5. Sync frontmatter `todos`:
   - **Preserve** todos with `status: completed` — do not reset them
   - Add new todos for new steps; mark removed steps `status: cancelled` (do not delete rows)
   - Renumber or rename step ids only when necessary; if ids change, update `status.md` queue to match

Re-run skill discovery from [task-contract.md](./task-contract.md) when the amended work touches new areas.

### 5. Sync `status.md`

1. Update the **Step queue** to match plan todos (keep checkmarks for completed steps)
2. Set `next_step_id`:
   - If the current `next_step_id` still exists and is pending → keep it
   - If it was removed or completed → set to the first unchecked pending step
   - If user asked to redo a step → uncheck only that step with explicit confirmation
3. Clear `blocking_reason` if the amend resolves the blocker; set `overall_status` to `In Progress` if was `Blocked`
4. Update `handoff_note` for the executor
5. Sync `<tasks-root>/index.md` `Status` for this task when `overall_status` changed (per [task-contract.md](./task-contract.md) → **`index.md` status mirror**)

### 6. Confirm to the user

Reply with:

- `plan_revision` and changelog summary
- Updated `next_step_id`
- What changed vs what was preserved

**Stop without implementing** new phases unless the user also asked to continue in the same message.

## Examples

**Update:** User adds a phase to an in-progress task. Bump `plan_revision` → sync step queue.
