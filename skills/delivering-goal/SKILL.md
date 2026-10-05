---
name: delivering-goal
id: 317e7227-bf0b-42d4-a288-4650802eace5
description: >-
  Delivers a clear goal until done. Plans a living goal.md under goals/, then
  loops one phase-deliverer subagent per phase: fold prior findings, write
  phase.md plus ≤7 task files (sources, skills, steps, verification), implement
  each task with a commit. Halts when a task is blocked. Use only when the user
  names this skill (`/delivering-goal`, `$delivering-goal`, or
  "delivering-goal"), or references a file under a marked goals root
  (`@goals/01-mvp/goal.md`, a phase or task file).
version: 2.1.0
---

# Delivering Goal

## Overview

Plan-then-ship loop that leaves a documented trail: `goal.md` (what, phase status), `phase.md` (brief), task files (tickets with rules, status, findings). The main session plans the goal and holds only one-line handoffs; each phase is planned and implemented in one fresh subagent context.

```text
plan goal.md (main session, once) → phase-deliverer: plan phase → implement tasks → commit each
                                          ↑________________ findings ________________|
```

Out of scope: inventing a goal, researching missing goal detail.

## Setup

| Item | Required | When | How |
| --- | --- | --- | --- |
| Delivery agent `phase-deliverer` | required | Deliver loop, when the harness supports subagents | [creating-delivery-agents.md](references/creating-delivery-agents.md) |

## Agent workflow

Follow this skill when the user names it, or references a file under a marked goals root, for goal folders under `<goals-root>/<NN>-<slug>/`. Resolve every **required** **Setup** row before opening a recipe. Match one **Recipes** row; open exactly that reference.

### Recipes

| Intent | Example phrasing | Read |
| --- | --- | --- |
| Plan goal only | "Plan this goal", "Create goal.md for …" | [planning-goal.md](references/planning-goal.md) |
| Deliver or continue | "Deliver this goal", "Ship until done", "Continue @goals/01-mvp/goal.md" | [delivering-goal.md](references/delivering-goal.md) |
| Deliver one phase | "Deliver the next phase only" | [delivering-phase.md](references/delivering-phase.md) |
| Create delivery agent | "creating-delivery-agents", refresh the agent | [creating-delivery-agents.md](references/creating-delivery-agents.md) |

## Reference index

### Contract

[goal-contract.md](references/goal-contract.md) — signatures, layout, goals root, living `goal.md`, clear-goal gate, governing skills and method, phase sizing, task rules, handoffs, agent roots.

| Doc | When to use |
| --- | --- |
| [goal-contract.md](references/goal-contract.md) | Shared rules every recipe cites |
| [planning-goal.md](references/planning-goal.md) | Seed `goal.md` and pin the method |
| [delivering-goal.md](references/delivering-goal.md) | Main loop: one `phase-deliverer` per phase |
| [delivering-phase.md](references/delivering-phase.md) | Resume or plan a phase, write tasks, implement, commit |
| [creating-delivery-agents.md](references/creating-delivery-agents.md) | Write `phase-deliverer` |

## Templates

- [`assets/index.md`](assets/index.md)
- [`assets/goal.md`](assets/goal.md)
- [`assets/phase.md`](assets/phase.md)
- [`assets/task.md`](assets/task.md)
- [`assets/agents/phase-deliverer.md`](assets/agents/phase-deliverer.md)
