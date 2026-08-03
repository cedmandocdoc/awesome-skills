---
name: delivering-goal
description: >-
  Portable delivery loop that ships a clear goal until done. Seeds goal.md under
  goals/, pins a governing method, decides the next phase (resurvey + method +
  meta brief), creates ≤7 tasks via managing-tasks, executes them, then
  re-decides. Use when planning or delivering a goal, continuing goal.md, or
  shipping until done. Guards on goal clarity; requires managing-tasks for
  deliver/decide (not plan-only). Domain skills boost phase quality when present
  and are never required to run. Halts when a task is Blocked.
version: 1.2.0
---

# Delivering Goal

## Overview

Adaptive **delivery loop** that owns *what* and *when*; named companion `managing-tasks` owns task folders. Portable across domains via a meta brief and a sticky **Governing method** pin on living `goal.md`. Goal id: `{NN}-{slug}`. Subagents return one-line handoffs only.

```text
plan goal.md (once) → decide next phase → create-multiple → execute-multiple
       ↑______________________________________________|
              resurvey + read pinned governing method
```

Out of scope: inventing a goal, researching missing goal detail, domain-specific methodology.

## Agent workflow

Follow this skill for goal folders under `<goals-root>/<NN>-<slug>/`. Before any recipe: clear goal per **Require clear goal**, and a resolved goals root ([goal-contract.md](references/goal-contract.md)). On gaps, stop and ask once. Require `managing-tasks` for decide and deliver — not for plan-only. Soft cap: **at most 7** task specs per phase. Halt when implementation returns `Blocked`.

**Goals root:** Locate via `<goals-root>/index.md` with the static **Author signature** UUID. If none exists, ask once for an empty folder path (default: `goals/`), then initialize. See [goal-contract.md](references/goal-contract.md) → **Resolve goals root**.

Match one **Recipes** row; open exactly that reference. End-to-end ship → [delivering-goal.md](references/delivering-goal.md).

Delivery agents: gate with [finding-delivery-agents.md](references/finding-delivery-agents.md); create via [creating-delivery-agents.md](references/creating-delivery-agents.md).

### Recipes

| Intent | Example phrasing | Read |
| --- | --- | --- |
| Plan goal only | "Plan this goal", "Create goal.md for …" | [planning-goal.md](references/planning-goal.md) |
| Deliver goal (loop) | "Deliver this goal", "Ship until done", "Continue until done" | [delivering-goal.md](references/delivering-goal.md) |
| Find delivery agents | "Check delivery agents", gate before orchestration | [finding-delivery-agents.md](references/finding-delivery-agents.md) |
| Create delivery agents | "creating-delivery-agents", refresh goal-planner/phase-decider | [creating-delivery-agents.md](references/creating-delivery-agents.md) |

## Reference index

### Contract

[goal-contract.md](references/goal-contract.md) — signatures, goals root, living `goal.md`, goal gate, pinned governing method, companion require, halt-on-blocked, delivery-agent roots.

| Doc | When to use |
| --- | --- |
| [goal-contract.md](references/goal-contract.md) | Root resolve, `NN-slug` layout, living `goal.md`, pin method, companion invoke |
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
