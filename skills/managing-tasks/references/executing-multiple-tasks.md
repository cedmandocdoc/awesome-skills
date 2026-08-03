# Executing Multiple Tasks

## Overview

**Backlog execution mode.** Plans then implements tasks in order until cap or exit. Delegate only — never substitute parent-session triage or implementation for task-agent work.

## Prerequisites

Per [finding-task-agents.md](./finding-task-agents.md) when this workflow requires task-agent delegation.

## Guidelines

### 1. Resolve tasks root

Per [task-contract.md](./task-contract.md) → **Resolve tasks root**.

### 2. Parameters

Parse from the user's message. Use defaults when omitted.

| Parameter | Default | Meaning |
| --- | --- | --- |
| `max_completed` | `5` | Stop after this many tasks reach `Done` |
| `stop_on_blocked` | `true` | Stop when implementer returns `Blocked task-...` |
| `push_on_done` | `false` | Tell implementer to push only when the user explicitly requests push |

### 3. Require expected task agents

Follow [finding-task-agents.md](./finding-task-agents.md) for **`task-triager`** and **`task-implementer`**. If missing, stop and reply:

`Create the subagent first by running managing-tasks creating-task-agents.`

### 4. Task-agent contracts

Parse subagent replies exactly — one line each.

**task-triager** (`readonly: true`):

| Reply | Meaning |
| --- | --- |
| `Execution Plan: task-<NNN-slug>, task-<NNN-slug>, ...` | Ordered implementation series |
| `No Task Available` | Nothing to run in this backlog pass |

**task-implementer**:

| Reply | Meaning |
| --- | --- |
| `Finished implementing task-<NNN-slug>` | Task reached `Done` |
| `Blocked task-<NNN-slug>: <reason>` | Task blocked |
| `Cancelled task-<NNN-slug>` | Task cancelled |

Map `task-<NNN-slug>` to `<tasks-root>/<NNN-slug>/`.

### 5. Orchestration loop

Track: `execution_plan`, `plan_index`, `completed_count`, `completed_tasks`, `last_outcome`.

#### Phase A — Plan once

1. Launch `task-triager` with `readonly: true`.
   - Prompt: `Build an execution plan for the task backlog. max_completed: <N>.`
   - `No Task Available` → exit (reason: `no_task`)
   - `Execution Plan: ...` → split on commas, trim, store as `execution_plan`; set `plan_index` to `0`

Do not launch the implementer until phase A returns a plan. Do not call `task-triager` again mid-loop.

#### Phase B — Execute the plan

For each entry in `execution_plan` starting at `plan_index` (one task per implementer launch; never parallel with triager):

1. **Implement** — Launch `task-implementer` for the current `task-<NNN-slug>`.
   - Prompt: `Implement <tasks-root>/<NNN-slug> end-to-end per managing-tasks.` Append `Push to remote when Done.` only when `push_on_done` is true.
   - Parse the one-line reply:
     - `Finished implementing task-<NNN-slug>` → append to `completed_tasks`, increment `completed_count`, set `last_outcome`
     - `Blocked task-<NNN-slug>: ...` → set `last_outcome`; if `stop_on_blocked`, exit (reason: `blocked`); else advance and continue
     - `Cancelled task-<NNN-slug>` → set `last_outcome`; do not increment `completed_count`; advance and continue
2. **Cap check** — If `completed_count >= max_completed` → exit (reason: `max_completed`).
3. Advance `plan_index` and run the next entry — do not re-triage between tasks.

When `plan_index` reaches the end of `execution_plan` → exit (reason: `plan_exhausted`).

Trust subagent one-liners unless a reply does not match the contract patterns. Do not update task plans or unblock tasks unless the user explicitly asks outside this run.

Each fully implemented task follows [executing-task.md](./executing-task.md) (including verify and auto-archive) inside the implementer subagent.

### 6. Report results

```
Task run complete.
Planned: <M> (<comma-separated planned ids or "none">)
Completed: <N> (<comma-separated task ids or "none">)
Stop reason: <no_task | max_completed | blocked | plan_exhausted>
Last outcome: <last implementer one-liner, or "none">
```

Optional one-line progress per completed task; do not paste subagent logs, diffs, or step-by-step narration. If stop reason is `blocked`, one sentence on how to unblock is allowed.

## Related

- [creating-multiple-tasks.md](./creating-multiple-tasks.md) — plan multiple new tasks before execution

## Examples

**Execute multiple:** "Finish all tasks" → verify agents → `task-triager` for the plan → `task-implementer` per planned task until cap or exit.
