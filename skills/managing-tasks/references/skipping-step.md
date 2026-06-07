# Skipping a step

Skip the current or named step and advance the execution pointer. Use when the user explicitly defers work or accepts missing acceptance criteria for that step.

## 1. Resolve task folder and step

1. Resolve `<task-folder>` from the user's message
2. Read `status.md`, then `plan.md`
3. Determine step to skip:
   - Default: `next_step_id` from `status.md`
   - Or the step id the user names (e.g. `step-2`)

If `overall_status` is `Cancelled` or `Done` → stop and tell the user.

## 2. Record skip reason

Require a brief reason (from the user or inferred from context), e.g.:

- Deferred to a follow-up task
- Blocked on external dependency
- No longer needed after scope change

## 3. Update artifacts

**`plan.md` frontmatter:**

- Set the skipped todo's `status` to `skipped`

**`status.md`:**

1. In the step queue, mark the step as skipped (append `— SKIPPED: <reason>` to the line, or add a **Skipped steps** subsection)
2. Set `current_step_id` to the skipped step id
3. Set `next_step_id` to the next pending step in queue (or `verify` if only verification remains)
4. Set `overall_status` to `In Progress` (or keep `Review` if skipping non-verify work while in review)
5. Append session log: date, step id, `Skipped`, reason
6. Update `handoff_note`

Do **not** check off skipped steps as completed.

## 4. Follow-up obligations

If skipping leaves a gap in the verification checklist:

- Add a note to `handoff_note` or a new todo in `plan.md` (prefer [updating-task.md](./updating-task.md) if the user wants a formal amend)
- Or link a related task under Context → **Related tasks**

## 5. Confirm to the user

Reply with:

- Which step was skipped and why
- New `next_step_id`
- Any verification or follow-up risk

Do not implement the skipped step's work in this workflow unless the user changes intent.
