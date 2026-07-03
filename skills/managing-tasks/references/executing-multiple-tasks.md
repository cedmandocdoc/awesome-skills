# Executing Multiple Tasks

## Overview

**Backlog execution mode.** Plans then implements tasks in order until cap or exit.

## Prerequisites

Per [subagent-provisioning.md](./subagent-provisioning.md) when delegating to subagents.

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

### 3. Provision subagents

Before delegating, follow [subagent-provisioning.md](./subagent-provisioning.md) for **`task-triager`** and **`task-implementer`**.

If the IDE has no subagent support (Windsurf, Continue, or unknown), run the orchestration loop **inline** — you orchestrate but follow triaging-tasks execution-roadmap and executing-task per task yourself; skip §4–§5 delegation and use the same exit conditions in §6.

### 4. Subagent contracts

Parse subagent replies exactly — one line each.

**task-triager** (`readonly: true`):

| Reply | Meaning |
| --- | --- |
| `Execution Plan: task-<NNN-slug>, task-<NNN-slug>, ...` | Ordered implementation series (comma-separated) |
| `No Task Available` | Nothing to run in this backlog pass |

**task-implementer**:

| Reply | Meaning |
| --- | --- |
| `Finished implementing task-<NNN-slug>` | Task reached `Done` (committed locally) |
| `Blocked task-<NNN-slug>: <reason>` | Task blocked |
| `Cancelled task-<NNN-slug>` | Task cancelled |

Map `task-<NNN-slug>` to `<tasks-root>/<NNN-slug>/`.

### 5. Orchestration loop

Run in two phases. Track:

- `execution_plan` — ordered list of `task-<NNN-slug>` ids from phase A
- `plan_index` — next index in `execution_plan` to run
- `completed_count` — tasks that returned `Finished implementing ...`
- `completed_tasks` — list of `task-<NNN-slug>` ids
- `last_outcome` — last implementer reply line

#### Phase A — Plan once

1. **Plan** — Launch `task-triager` with `readonly: true` (or run [triaging-tasks.md](./triaging-tasks.md) execution-roadmap inline when subagents are unavailable).
   - Prompt: `Build an execution plan for the task backlog. max_completed: <N>.`
   - If reply is `No Task Available` → exit (reason: `no_task`).
   - If reply matches `Execution Plan: ...` → split on commas, trim whitespace, store as `execution_plan`. Set `plan_index` to `0`.

Do not launch the implementer until phase A returns a plan.

#### Phase B — Execute the plan

For each entry in `execution_plan` starting at `plan_index`:

1. **Implement** — Launch `task-implementer` for the current `task-<NNN-slug>` (or follow [executing-task.md](./executing-task.md) inline).
   - Prompt: `Implement <tasks-root>/<NNN-slug> end-to-end per managing-tasks. Commit when Done.` Append `Push to remote when Done.` only when `push_on_done` is true.
   - Parse the one-line reply:
     - `Finished implementing task-<NNN-slug>` → append to `completed_tasks`, increment `completed_count`, set `last_outcome`.
     - `Blocked task-<NNN-slug>: ...` → set `last_outcome`. If `stop_on_blocked`, exit loop (reason: `blocked`). Otherwise advance `plan_index` and continue.
     - `Cancelled task-<NNN-slug>` → set `last_outcome`. Do not increment `completed_count`. Advance `plan_index` and continue.

2. **Cap check** — If `completed_count >= max_completed` → exit loop (reason: `max_completed`).

3. Advance `plan_index` and run the next plan entry immediately — **do not** re-triage between tasks.

When `plan_index` reaches the end of `execution_plan` → exit loop (reason: `plan_exhausted`).

Do not launch triager and implementer in parallel. Order is always plan once → implement → implement → …

### 6. Report results

Reply with a short summary. Optional one-line progress per completed task is allowed; do not paste subagent logs, diffs, or step-by-step narration.

```
Task run complete.
Planned: <M> (<comma-separated planned ids or "none">)
Completed: <N> (<comma-separated task ids or "none">)
Stop reason: <no_task | max_completed | blocked | plan_exhausted>
Last outcome: <last implementer one-liner, or "none">
```

If stop reason is `blocked`, you may add one sentence on what the user can do to unblock.

### 7. Constraints

- **Delegate only** (when subagents are available) — never substitute your own triage or implementation for subagent work.
- **Plan once per run** — do not call `task-triager` again mid-loop; follow `execution_plan` until an exit condition.
- **One task per implementer launch** — do not batch multiple folders in one implementer call.
- **Trust subagent one-liners** — do not re-read `status.md` to second-guess implementer outcomes unless a reply does not match the contract patterns.
- **No extra git operations** — do not commit, push, or amend unless the user explicitly asked and implementer handles commits on Done.
- **No replanning** — do not update task plans, unblock tasks, or archive unless the user explicitly asks outside this run.

Each fully implemented task follows [executing-task.md](./executing-task.md) and [verifying-task.md](./verifying-task.md) inside the implementer subagent (or inline) — not in the orchestrating session.

## Examples

**Execute multiple:** User says "finish all tasks". Provision subagents per [subagent-provisioning.md](./subagent-provisioning.md) → delegate to `task-triager` for the plan, then `task-implementer` for each planned task until cap or exit.
