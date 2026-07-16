# Task status — {{TASK_ID}} {{TASK_TITLE}}

Execution source of truth for [`plan.md`](./plan.md). **Read this file first** in every new agent session.

## Agent startup protocol

1. Open this file and read the **Execution pointer**
2. Open `plan.md` — read **Requirements** (Sources, Constraints, Acceptance), then step details
3. Pick the workflow from `managing-tasks` → **Recipes** (usually `executing-task.md`)
4. Execute `next_step_id` unless status is `Blocked` or `Cancelled`
5. Update this file before ending the session (pointer, queue, handoff note)

## Execution pointer

- `task_id`: `{{TASK_ID}}`
- `task_folder`: `{{TASKS_ROOT}}/{{TASK_FOLDER}}/`
- `overall_status`: `Not Started`
- `current_step_id`: `none`
- `next_step_id`: `{{FIRST_STEP_ID}}`
- `blocking_reason`: `None`
- `cancel_reason`: `None`
- `handoff_note`: Task created. Start with `{{FIRST_STEP_ID}}` per plan.md.

## Step queue

Check off steps as completed. The executor should always pick `next_step_id` unless blocked or cancelled.

- [ ] `{{FIRST_STEP_ID}}` — {{short description}}
- [ ] `{{SECOND_STEP_ID}}` — {{short description}}
- [ ] `verify` — Run verification checklist in plan.md

## Session log

| Date | Step | Result | Notes |
| --- | --- | --- | --- |
| {{YYYY-MM-DD}} | — | Created | Initial plan and status written |
