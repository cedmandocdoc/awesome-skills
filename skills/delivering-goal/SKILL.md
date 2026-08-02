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

Adaptive **delivery loop** that owns *what* and *when*; the named companion `managing-tasks` owns task folders and implementers. Portable across domains — software, docs, ops, or other — via a thin meta brief and a **pinned** governing method on `goal.md`.

Effectiveness depends on two cores: a clear **`goal.md`** (high-level deliverables toward the goal) and **task-detail quality** grounded in current state plus the pinned method. Weak map or weak specs make the loop ineffective.

Given a clear goal, open `<goals-root>/<NN>-<slug>/`, then repeat until the goal is met or blocked:

```text
plan goal.md (once) → decide next phase → create-multiple → execute-multiple
       ↑______________________________________________|
              resurvey + read pinned governing method
```

Each **decide** pass re-reads current state and the goal. `goal.md` is a **living backlog** (seeded at plan time) — decide may insert, rewrite, or split pending rows. The **Governing method** pin on `goal.md` is sticky across phases; decide reads it every pass and repins only when the contract allows.

**Goal id** is `{NN}-{slug}` under the goals root (e.g. `01-mvp`). Slug comes from the user or is derived from the goal; `NN` is assigned like task ids in `managing-tasks`.

**Named companion:** `managing-tasks` must be installed. Discover by frontmatter `name`; follow that skill’s create-multiple / execute-multiple recipes. This skill does not reimplement task folders.

**Subagents** return **one-line handoffs** (paths and task ids only). Parent orchestrates; it does not paste `goal.md` or phase bodies into chat.

**Layering:** recipes own action rules; [`assets/`](assets/) are copy skeletons; [`references/goal-contract.md`](references/goal-contract.md) is plumbing; on-disk `goal.md` + `phases/NN-slug.md` are runtime truth.

Out of scope: inventing a goal, researching missing goal detail, domain-specific methodology (lives in other skills when installed).

## Agent workflow

Follow this skill for goal folders under `<goals-root>/<NN>-<slug>/`. Before any recipe: a clear goal per the contract’s **Require clear goal** gate (Outcome + Scope), and a resolved goals root ([goal-contract.md](references/goal-contract.md)). On goal gaps, stop and ask the user what to adjust — never start on an unclear goal. Require `managing-tasks` for decide and deliver — not for plan-only. Soft cap: **at most 7** task specs per phase. Halt when implementation returns `Blocked`.

**Goals root:** Located only via `<goals-root>/index.md` with the static **Author signature** UUID in frontmatter. If none exists, **ask once** for an empty folder path (default: `goals/`), then initialize with `index.md` before any goal folder. See [goal-contract.md](references/goal-contract.md) → **Resolve goals root**.

Match one **Recipes** row; open exactly that reference. End-to-end ship → [delivering-goal.md](references/delivering-goal.md).

Delivery agents: `goal-planner` (seeds `goal.md` + pins method) and `phase-decider` (brief + create tasks). Gate with [finding-delivery-agents.md](references/finding-delivery-agents.md); create via [creating-delivery-agents.md](references/creating-delivery-agents.md).

### Recipes

| Intent | Example phrasing | Read |
| --- | --- | --- |
| Plan goal only | "Plan this goal", "Create goal.md for …" | [planning-goal.md](references/planning-goal.md) |
| Deliver goal (loop) | "Deliver this goal", "Ship until done", "Continue until done" | [delivering-goal.md](references/delivering-goal.md) |
| Find delivery agents | "Check delivery agents", gate before orchestration | [finding-delivery-agents.md](references/finding-delivery-agents.md) |
| Create delivery agents | "creating-delivery-agents", refresh goal-planner/phase-decider | [creating-delivery-agents.md](references/creating-delivery-agents.md) |

## Reference index

### Contract

[goal-contract.md](references/goal-contract.md) — signatures, goals root, living `goal.md`, goal gate, pinned governing method, companion require, halt-on-blocked.

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
