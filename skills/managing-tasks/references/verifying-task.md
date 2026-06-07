# Verifying a task

Run the plan's verification checklist when implementation is complete. Use when `overall_status` is `Review` or only the `verify` step remains.

## 1. Resolve task folder

Resolve `<task-folder>` from the user's message. Read `status.md`, then `plan.md`.

If `overall_status` is `Cancelled` → stop and tell the user.

If `overall_status` is `Done` → confirm completion or offer [archiving-task.md](./archiving-task.md).

## 2. Confirm verify scope

1. Ensure all non-`verify` steps are completed or explicitly skipped in the step queue
2. If pending implementation steps remain → stop; tell the user to finish or skip them first ([executing-task.md](./executing-task.md) or [skipping-step.md](./skipping-step.md))
3. Set `overall_status` to `Review` if not already
4. Set `next_step_id` to `verify` if not already

## 3. Run verification checklist

Execute every item in `plan.md` → **Verification checklist**:

- Automated checks (lint, typecheck, tests) when practical
- Manual smoke steps when listed
- Do **not** add new features; only verify existing work

Record pass/fail per item.

## 4. Update artifacts

**If all checks pass:**

1. Check off `verify` in the step queue
2. Set todo `verify` to `status: completed` in `plan.md` frontmatter
3. Set `overall_status`: `Done`
4. Set `current_step_id`: `verify`
5. Set `next_step_id`: `none`
6. Update `handoff_note`: task complete
7. Append session log: date, `verify`, `Completed`, brief results

**If checks fail:**

1. Do **not** set `overall_status` to `Done`
2. Keep or set `overall_status`: `Review` or `In Progress` depending on whether code fixes are needed
3. Set `handoff_note` with failing items and suggested fix step
4. Append session log: date, `verify`, `Failed`, failing items
5. Optionally add a fix todo via [updating-task.md](./updating-task.md) if the user wants a formal replan

## 5. Confirm to the user

Reply with:

- Verification results (pass/fail per checklist item)
- `overall_status` and `next_step_id`
- Suggested follow-up: archive if `Done` ([archiving-task.md](./archiving-task.md)), or fix and re-verify
