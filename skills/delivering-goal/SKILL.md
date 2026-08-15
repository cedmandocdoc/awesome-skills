---
name: delivering-goal
id: 317e7227-bf0b-42d4-a288-4650802eace5
description: >-
  Portable delivery loop that ships a clear goal until done. Seeds goal.md under
  goals/, pins a governing method, decides the next phase (resurvey + method +
  meta brief), creates ≤7 tasks via managing-tasks, executes them, then
  re-decides. Use when planning or delivering a goal, continuing goal.md, or
  shipping until done. Guards on goal clarity; requires managing-tasks for
  deliver/decide (not plan-only). Domain skills boost phase quality when present
  and are never required to run. Halts when a task is Blocked.
version: 1.3.0
---

# Delivering Goal

## Overview

Adaptive **delivery loop** that owns *what* and *when*; `managing-tasks` owns task folders. Portable across domains via a meta brief and a sticky **Governing method** pin on living `goal.md`. Goal id: `{NN}-{slug}`. Subagents return one-line handoffs only.

```text
plan goal.md (once) → decide next phase → create-multiple → execute-multiple
       ↑______________________________________________|
              resurvey + read pinned governing method
```

Out of scope: inventing a goal, researching missing goal detail, domain-specific methodology.

## Dependencies

Resolve every **required** row before recipes that need it. Skill discovery and missing-skill stop text: [goal-contract.md](references/goal-contract.md) → **Require managing-tasks**.

| Item | Required | When | How |
| --- | --- | --- | --- |
| [managing-tasks](https://github.com/cedmandocdoc/awesome-skills/tree/main/skills/managing-tasks) `34d10b1d-f2fb-4121-b7bf-0c17401658a3` | required | Decide, deliver, loop | `npx skills add cedmandocdoc/awesome-skills --skill managing-tasks` |

Install both: `npx skills add cedmandocdoc/awesome-skills --skill delivering-goal --skill managing-tasks`

## Setup

| Item | Required | When | How |
| --- | --- | --- | --- |
| Delivery agents `goal-planner`, `phase-decider` | required | Deliver, decide via subagent | [finding-delivery-agents.md](references/finding-delivery-agents.md), then [creating-delivery-agents.md](references/creating-delivery-agents.md) |
| Task agents on `managing-tasks` | required | Create / execute multiple | That skill’s finding- then creating-task-agents recipes |

## Agent workflow

Follow this skill for goal folders under `<goals-root>/<NN>-<slug>/`. Before any recipe: **Require clear goal** and a resolved goals root ([goal-contract.md](references/goal-contract.md)). On gaps, stop and ask once. Soft cap: **at most 7** task specs per phase. Halt when implementation returns `Blocked`.

Match one **Recipes** row; open exactly that reference. End-to-end ship → [delivering-goal.md](references/delivering-goal.md).

### Recipes

| Intent | Example phrasing | Read |
| --- | --- | --- |
| Plan goal only | "Plan this goal", "Create goal.md for …" | [planning-goal.md](references/planning-goal.md) |
| Deliver goal (loop) | "Deliver this goal", "Ship until done", "Continue until done" | [delivering-goal.md](references/delivering-goal.md) |
| Find delivery agents | "Check delivery agents", gate before orchestration | [finding-delivery-agents.md](references/finding-delivery-agents.md) |
| Create delivery agents | "creating-delivery-agents", refresh goal-planner/phase-decider | [creating-delivery-agents.md](references/creating-delivery-agents.md) |

## Reference index

### Contract

[goal-contract.md](references/goal-contract.md) — signatures, goals root, living `goal.md`, goal gate, pinned governing method, dependency `managing-tasks`, halt-on-blocked, delivery-agent roots.

| Doc | When to use |
| --- | --- |
| [goal-contract.md](references/goal-contract.md) | Root resolve, `NN-slug` layout, living `goal.md`, pin method, dependency invoke |
| [planning-goal.md](references/planning-goal.md) | Seed `goal.md` under goals/ |
| [delivering-goal.md](references/delivering-goal.md) | Parent loop: plan → decide → execute → re-decide |
| [deciding-next-phase.md](references/deciding-next-phase.md) | Survey → read pin → meta brief → create-multiple (used by loop) |
| [finding-delivery-agents.md](references/finding-delivery-agents.md) | Gate on `goal-planner` / `phase-decider` |
| [creating-delivery-agents.md](references/creating-delivery-agents.md) | User-invoked create/refresh of delivery agents |

## Templates

- [`assets/index.md`](assets/index.md)
- [`assets/goal.md`](assets/goal.md)
- [`assets/phase.md`](assets/phase.md)
- [`assets/agents/goal-planner.md`](assets/agents/goal-planner.md)
- [`assets/agents/phase-decider.md`](assets/agents/phase-decider.md)
