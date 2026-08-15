# Delivering Goal

## Overview

**Execution mode.** Parent orchestration loop for one goal: ensure `goal.md`, then repeatedly decide next phase → execute via `managing-tasks` → decide again until complete or blocked.

## Prerequisites

1. [goal-contract.md](./goal-contract.md) → **Require managing-tasks**, **Require clear goal**, **Resolve goals root**, **Assign goal id and slug**, **Pin governing method**, **Invoke dependency recipes**, **Halt on blocked**, **Handoff style**
2. [finding-delivery-agents.md](./finding-delivery-agents.md) for `goal-planner`, `phase-decider`
3. Confirm `managing-tasks` task agents (`task-planner`, `task-triager`, `task-implementer`) exist per that skill’s finding-task-agents flow

If delivery agents are missing → stop: `Create the subagent first by running delivering-goal creating-delivery-agents.`

If task agents are missing → stop: `Create the subagent first by running managing-tasks creating-task-agents.`

## Guidelines

### Parameters

| Parameter | Default | Meaning |
| --- | --- | --- |
| `max_phases` | `20` | Stop after this many successful phase execute cycles (safety cap) |
| `stop_on_blocked` | `true` | Always halt delivery when a task is Blocked |

Carry user-named skills (e.g. “prefer the installed docs skills”) into every subagent prompt as **Skills to prefer**.

Before ensuring `goal.md`, run **Require clear goal** inline. On gaps, stop and ask once. Then resolve `<goals-root>` (default suggestion `goals/` when initializing).

### Handoff contracts

**goal-planner** (one line):

| Reply | Meaning |
| --- | --- |
| `Planned goal: <path-to-goal.md>` | `goal.md` written |
| `Failed goal plan: <reason>` | Unclear goal or write failure |
| `Skipped goal plan: <reason>` | Ambiguous or duplicate |

**phase-decider** (one line):

| Reply | Meaning |
| --- | --- |
| `Phase ready: <path-to-phase-md>; tasks: task-<NNN-slug>, ...` | Phase file + tasks created |
| `Goal complete: <path-to-goal.md>` | No further phases |
| `Blocked delivery: <reason>` | Cannot decide (unclear goal, prior phase blocked, etc.) |
| `Failed phase: <reason>` | Write or create-multiple failure |

**managing-tasks execute multiple** — use that recipe’s report; treat any `Blocked task-...` in Last outcome as delivery halt.

### A — Ensure goal.md

1. Resolve `goal.md` per [goal-contract.md](./goal-contract.md) (**Resolve goals root** + **Resolve goal.md**).
2. If none → launch `goal-planner`:
   - Prompt: `Plan goal. Goal: <goal>. Goal name: <slug or none>. Sources: <paths or none>. Skills to prefer: <list or none>. Goals root: <path or ask — default goals/>. Follow planning-goal.md per delivering-goal. Return the one-line handoff only.`
   - `Planned goal: ...` → store path
   - `Failed` / `Skipped` → exit (reason: `plan_failed`)
3. If `goal.md` exists for this goal → use it (re-plan only when the user asked). If multiple goals match and none named → ask which goal.

### B — Delivery loop

Track: `goal_md`, `phases_completed`, `last_outcome`.

While `phases_completed < max_phases`:

1. **Decide** — Launch `phase-decider`:
   - Prompt: `Decide the next phase for goal.md <path>. Skills to prefer: <list or none>. Follow deciding-next-phase.md per delivering-goal (review prior phase, read pinned governing method, write phases/NN-slug.md, create tasks via managing-tasks). Return the one-line handoff only.`
   - Parse reply:
     - `Goal complete: ...` → exit (reason: `goal_complete`)
     - `Blocked delivery: ...` / `Failed phase: ...` → exit (reason: `decide_blocked` or `decide_failed`)
     - `Phase ready: <phase-path>; tasks: ...` → store `phase_path` and task id list; continue
     - Unmatched → exit (reason: `bad_handoff`)

2. **Execute** — Per **Invoke dependency recipes**, run `managing-tasks` **Execute multiple** with:
   - `stop_on_blocked: true`
   - `max_completed` ≥ number of task ids from the handoff (or that count exactly)
   - Prompt context: prefer executing the phase’s task ids; triager still owns readiness order
3. Read the execute summary:
   - If Last outcome matches `Blocked task-...` **or** stop reason is `blocked` → apply **Halt on blocked**; exit (reason: `task_blocked`)
   - If no tasks completed and stop is `no_task` → exit (reason: `no_task`)
   - Otherwise increment `phases_completed`, set `last_outcome`, **loop to Decide**

Order is always decide → execute → decide → … (never parallel). Delegate plan/decide to delivery agents; execute only via `managing-tasks`. Re-read full artifacts only when a handoff breaks the contract patterns. On clarity failures, surface gaps and stop.

### C — Report

```text
Delivery run complete.
Goal: <goal-id>
Map: <path-to-goal.md>
Phases completed this run: <N>
Stop reason: <goal_complete | task_blocked | decide_blocked | decide_failed | plan_failed | max_phases | no_task | bad_handoff>
Last outcome: <last one-liner or "none">
```

If `task_blocked` / `decide_blocked`, add one sentence on what the user can do (unblock task, clarify the goal or its sources, then re-run deliver goal).

## Related

- [planning-goal.md](./planning-goal.md)
- [deciding-next-phase.md](./deciding-next-phase.md)
- [finding-delivery-agents.md](./finding-delivery-agents.md)
