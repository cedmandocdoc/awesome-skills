---
name: developing-application
description: >-
  Decides what work comes next when delivering an application from product specs
  (PRD, TRD, FRD, UI specs, design). Runs each goal as a named delivery folder
  under delivery-root/delivery-name with a delivery map and numbered waves, sizes
  each wave from current code + Slice Brief, creates/executes tasks via the
  managing-tasks companion skill, then repeats. Use when shipping an app from
  zero, continuing a delivery, or asking what to build next. Fails early when
  HOW docs or managing-tasks are missing. Halts the delivery loop when a task
  is Blocked.
version: 1.4.0
---

# Developing Application

## Overview

Embeds developer sequencing judgment as a **delivery**: given a clear goal and HOW documents, open `<delivery-root>/<delivery-name>/`, decide what piece comes next, write a numbered wave file, create and execute tasks via the named companion skill `managing-tasks`, then decide again until that delivery’s map is done.

**Delivery name** comes from the user (`delivery: mvp`, `authentication`) or is derived from the goal. Big milestone or small feature — same loop, different `<delivery-name>`.

**Named companion:** `managing-tasks` must be installed. This skill discovers it by frontmatter `name` and follows that skill’s own recipes (create multiple, execute multiple). It does not reimplement task folders.

**Subagents** do the heavy reads/writes and return **one-line handoffs** (paths and task ids only). The parent orchestrates; it does not paste map or wave bodies into chat.

**Layering:** recipes own action rules; [`assets/`](assets/) are copy skeletons; [`references/delivery-contract.md`](references/delivery-contract.md) is plumbing; on-disk `<delivery-dir>/delivery-map.md` + `waves/NN-slug.md` are runtime truth.

Out of scope: inventing architecture or HOW, spikes, stack-specific bootstrap recipes (scaffold is wave 1 when the tree is empty), and automated tests by default (typecheck, lint, build, smoke).

## Agent workflow

Follow this skill for delivery folders under `<delivery-root>/<delivery-name>/`. Works wherever the agent can read and write repository files. Before any recipe: require `managing-tasks`, a clear goal, a delivery name, and HOW documents ([delivery-contract.md](references/delivery-contract.md)). Soft cap: **at most 7** task specs per wave. Halt delivery when implementation returns `Blocked`.

Match one **Recipes** row; open exactly that reference. End-to-end “develop / ship the app” → [executing-delivery.md](references/executing-delivery.md) (requires delivery agents + `managing-tasks` task agents).

Delivery agents: `delivery-planner` (writes `delivery-map.md`) and `wave-decider` (writes `waves/NN-slug.md`, creates tasks via `managing-tasks`). Gate with [finding-delivery-agents.md](references/finding-delivery-agents.md); create via [creating-delivery-agents.md](references/creating-delivery-agents.md).

### Recipes

| Intent | Example phrasing | Read |
| --- | --- | --- |
| Execute delivery (loop) | "Develop the MVP from the PRD", "Ship the app using react-native skills", "Continue delivery until done" | [executing-delivery.md](references/executing-delivery.md) |
| Plan delivery only | "Create a delivery map for mvp", "Plan discovery for authentication" | [planning-delivery.md](references/planning-delivery.md) |
| Decide next wave only | "What's the next wave for mvp?", "Create tasks for the next slice" | [deciding-next-wave.md](references/deciding-next-wave.md) |
| Find delivery agents | "Check delivery agents", gate before orchestration | [finding-delivery-agents.md](references/finding-delivery-agents.md) |
| Create delivery agents | "creating-delivery-agents", refresh planner/decider | [creating-delivery-agents.md](references/creating-delivery-agents.md) |

## Reference index

### Contract

[delivery-contract.md](references/delivery-contract.md) — author signatures, delivery layout, require `managing-tasks` / HOW, halt-on-blocked, skill discovery.

| Doc | When to use |
| --- | --- |
| [delivery-contract.md](references/delivery-contract.md) | Signatures, layout, prerequisites, companion require, halt-on-blocked |
| [slice-brief.md](references/slice-brief.md) | Eight questions every wave must answer before emitting task specs |
| [executing-delivery.md](references/executing-delivery.md) | Parent loop: plan → decide → execute → halt on blocked → repeat |
| [planning-delivery.md](references/planning-delivery.md) | Orient once; write/update `delivery-map.md` |
| [deciding-next-wave.md](references/deciding-next-wave.md) | Review prior + survey + Slice Brief + wave file + create-multiple |
| [finding-delivery-agents.md](references/finding-delivery-agents.md) | Gate on `delivery-planner` / `wave-decider` |
| [creating-delivery-agents.md](references/creating-delivery-agents.md) | User-invoked create/refresh of delivery agents |

## Templates

- [`assets/delivery-map.md`](assets/delivery-map.md)
- [`assets/wave.md`](assets/wave.md)
- [`assets/agents/delivery-planner.md`](assets/agents/delivery-planner.md)
- [`assets/agents/wave-decider.md`](assets/agents/wave-decider.md)
