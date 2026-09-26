# Delivering Phase

## Overview

**Execution mode.** One phase in one context: fold the prior phase’s findings, choose and size the phase, write `phase.md` and its task files, then implement the tasks in order with a commit each. Run by `phase-deliverer`, or inline when the harness has no subagents. Read each file once; reuse what is already in context.

## Prerequisites

Per [goal-contract.md](./goal-contract.md) → **Output layout**, **Living goal.md**, **Require clear goal**, **Governing skills and method**, **Phase sizing**, **Task rules**, **Commits**.

## Guidelines

### 1. Resume or plan

Read `goal.md`, then take the first matching branch:

| Row state | Action |
| --- | --- |
| A row is `blocked` | The user or parent prompt says the blocker is resolved → clear the blocked task’s `blocked_reason`, set the row `ready`, go to §5. Otherwise return `Blocked phase: <phase-dir> — <task-id>: <reason>` |
| A row is `ready` | Go to §5 for that phase |
| Otherwise | Go to §2 |

### 2. Choose the phase

1. For the latest `done` phase, read only the **Findings** of its task files. When they change what comes next, revise pending rows per **Living goal.md**.
2. Candidate = first `pending` row whose dependencies are `done`.
3. No pending rows → run `goal.md` → **Verification**. All pass → commit **Goal complete**, return `Goal complete: <goal.md>`. A check fails that the latest `done` row was added to fix → return `Blocked delivery: goal check still failing — <check>`. Other fails → add a pending row titled `Fix: <check>` and use it.
4. Pinned method requires unblock work first → insert that phase ahead of the candidate and use it.
5. Candidate breaks **Phase sizing** → split it into pending rows and use the first.
6. Candidate needs invented detail → return per **Require clear goal**.

### 3. Brief

1. Open the pinned method (when not `none`); answer its questions under **Method notes** and follow its sequencing and vocabulary.
2. Survey the target area once: structure, conventions, what is built, specs under `docs/` that Sources point to.
3. Copy [`../assets/phase.md`](../assets/phase.md) → `<goal-dir>/phases/<phase-id>/phase.md`; fill every section.

### 4. Tasks

1. Per **Task rules**, copy [`../assets/task.md`](../assets/task.md) → `<phase-dir>/<NN>-<slug>.md` for each task in run order, grounded in the §3 survey.
2. Set the `goal.md` row: Status `ready`, Phase dir; bump `map_revision` and changelog when rows changed.
3. Commit **Phase planned**.

### 5. Implement each task

For each task file in order whose status is not `done`. None left → set the `goal.md` row `done`, commit **Task done**, go to §6.

1. **Start** — set `status: in-progress`. Load its **Skills to load** `SKILL.md` files and **References** (`basename` → first `<skill-dir>/references/<basename>.md` among loaded skills; `skill/basename` → that skill only). Open the Sources its steps need; specs in `docs/` win over assumptions.
2. **Steps** — each unchecked step in order: implement within Requirements and Constraints, run the checks it names, check it off. Keep diffs scoped to the task.
3. **Verify** — run every Verification item (checks and listed smoke steps, no new features). Fail → fix within scope and re-run. All pass → check off `verify`.
4. **Findings** — write only what later phases must know: deviations, new dependencies, deferred work, wrong assumptions; else `none`. Set `status: done`; on the last task also set the `goal.md` row `done`.
5. **Commit** — **Task done**.

**Blocked:** when a blocker stops a step or verify, set the task `status: blocked` and `blocked_reason`, set the `goal.md` row `blocked`, and return `Blocked phase: <phase-dir> — <task-id>: <reason>`.

### 6. Confirm to the user

Reply with one line:

| Outcome | Reply |
| --- | --- |
| Phase delivered | `Phase done: <phase-dir>` |
| Goal met | `Goal complete: <goal.md>` |
| Task blocked | `Blocked phase: <phase-dir> — <task-id>: <reason>` |
| Cannot plan | `Blocked delivery: <reason>` |
| Write error | `Failed phase: <reason>` |
