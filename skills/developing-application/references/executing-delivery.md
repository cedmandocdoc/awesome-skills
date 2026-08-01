# Executing Delivery

## Overview

**Execution mode.** Parent orchestration loop for one delivery. Resolves goal + delivery name, plans `<delivery-root>/<delivery-name>/delivery-map.md` (if needed), then repeatedly: decide next wave (subagent) → execute that wave’s tasks via `managing-tasks` → halt on blocked or continue until the delivery is complete.

Trust subagent **one-line** handoffs. Do not paste map/wave bodies into the user reply.

## Prerequisites

1. [delivery-contract.md](./delivery-contract.md) → **Require managing-tasks**, **Require goal**, **Resolve delivery name**, **Require HOW documents**, **Invoke companion recipes**
2. [finding-delivery-agents.md](./finding-delivery-agents.md) for `delivery-planner`, `wave-decider`
3. Companion `managing-tasks`: open its `SKILL.md` and confirm task agents (`task-planner`, `task-triager`, `task-implementer`) exist per that skill’s finding-task-agents flow

If delivery agents are missing → stop: `Create the subagent first by running developing-application creating-delivery-agents.`

If task agents are missing → stop: `Create the subagent first by running managing-tasks creating-task-agents.`

## Guidelines

### Parameters

| Parameter | Default | Meaning |
| --- | --- | --- |
| `max_waves` | `20` | Stop after this many successful wave execute cycles (safety cap) |
| `stop_on_blocked` | `true` | Always halt delivery when a task is Blocked |

Carry user-named domain skills (e.g. “use react-native skills”) into every subagent prompt as **Skills to prefer**.

Before Phase A, resolve `<delivery-name>` (user or derived) and `<delivery-root>` when creating a new delivery.

### Handoff contracts

**delivery-planner** (one line):

| Reply | Meaning |
| --- | --- |
| `Planned delivery: <path-to-delivery-map.md>` | Map written |
| `Failed delivery plan: <reason>` | HOW/goal/write failure |
| `Skipped delivery plan: <reason>` | Ambiguous or duplicate |

**wave-decider** (one line):

| Reply | Meaning |
| --- | --- |
| `Wave ready: <path-to-wave-md>; tasks: task-<NNN-slug>, ...` | Wave file + tasks created |
| `Delivery complete: <path-to-delivery-map.md>` | No further waves |
| `Blocked delivery: <reason>` | Cannot decide (HOW gap, prior wave blocked, etc.) |
| `Failed wave: <reason>` | Write or create-multiple failure |

**managing-tasks execute multiple** — use that recipe’s report; treat any `Blocked task-...` in Last outcome as delivery halt.

### Phase A — Ensure delivery map

1. Resolve delivery map for this delivery per [delivery-contract.md](./delivery-contract.md) (**Resolve delivery name** + **Resolve delivery map**).
2. If none → launch `delivery-planner`:
   - Prompt: `Plan delivery. Goal: <goal>. Delivery name: <delivery-name>. Sources: <paths or none>. Skills to prefer: <list or none>. Delivery root: <path or ask>. Follow planning-delivery.md per developing-application. Return the one-line handoff only.`
   - `Planned delivery: ...` → store path (`.../<delivery-name>/delivery-map.md`)
   - `Failed` / `Skipped` → exit (reason: `plan_failed`)
3. If map exists for this delivery → use it (do not re-plan unless user asked to replan). If multiple deliveries match and none named → ask which delivery.

### Phase B — Wave loop

Track: `delivery_map`, `waves_completed`, `last_outcome`.

While `waves_completed < max_waves`:

1. **Decide** — Launch `wave-decider`:
   - Prompt: `Decide the next wave for delivery map <path>. Skills to prefer: <list or none>. Follow deciding-next-wave.md per developing-application (review prior implementation, write waves/NN-slug.md under the delivery dir, create tasks via managing-tasks). Return the one-line handoff only.`
   - Parse reply:
     - `Delivery complete: ...` → exit (reason: `delivery_complete`)
     - `Blocked delivery: ...` / `Failed wave: ...` → exit (reason: `decide_blocked` or `decide_failed`)
     - `Wave ready: <wave-path>; tasks: ...` → store `wave_path` and task id list; continue
     - Unmatched → exit (reason: `bad_handoff`)

2. **Execute** — Per [delivery-contract.md](./delivery-contract.md) → **Invoke companion recipes**, run `managing-tasks` **Execute multiple** with:
   - `stop_on_blocked: true`
   - `max_completed` ≥ number of task ids from the handoff (or that count exactly)
   - Prompt context: prefer executing the wave’s task ids; triager still owns readiness order
3. Read the execute summary:
   - If Last outcome matches `Blocked task-...` **or** stop reason is `blocked`:
     - Mark wave file `blocked` (parent may edit wave frontmatter `status` + reason, and map row) when practical
     - **Halt** exit (reason: `task_blocked`)
   - If no tasks completed and stop is `no_task` → exit (reason: `no_task`)
   - Otherwise increment `waves_completed`, set `last_outcome`, **loop to Decide** (do not re-plan the map)

Do not launch decide and execute in parallel. Order is always decide → execute → decide → …

### Phase C — Report

```text
Delivery run complete.
Delivery: <delivery-name>
Map: <path>
Waves completed this run: <N>
Stop reason: <delivery_complete | task_blocked | decide_blocked | decide_failed | plan_failed | max_waves | no_task | bad_handoff>
Last outcome: <last one-liner or "none">
```

If `task_blocked` / `decide_blocked`, add one sentence on what the user can do (unblock task, fix HOW docs, then re-run execute delivery).

Do not dump wave markdown, Slice Briefs, or plan bodies.

### Constraints

- **Delegate plan/decide** — use `delivery-planner` / `wave-decider` during this loop
- **Delegate task execute** — only via `managing-tasks` execute multiple
- **Trust one-liners** — re-read full artifacts only when the reply breaks the contract patterns
- **Halt on blocked** — never start the next wave after a blocked task
- **No HOW invention** — if planner/decider fail on HOW, report and stop

## Related

- [planning-delivery.md](./planning-delivery.md)
- [deciding-next-wave.md](./deciding-next-wave.md)
- [finding-delivery-agents.md](./finding-delivery-agents.md)
