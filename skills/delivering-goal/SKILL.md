---
name: delivering-goal
id: 317e7227-bf0b-42d4-a288-4650802eace5
description: >-
  Delivers a clear goal until done — an app, a feature, or a fix. Plans a
  living goal.md under goals/ as an ordered list of phases the user confirms,
  then loops one phase-deliverer subagent per phase: load the skills the phase
  needs, write phase.md plus ≤7 task files (sources, steps, verification),
  implement each task with a commit, and adjust the remaining phases from its
  findings. Halts when a task is blocked or the goal's checks pass. Use only when the user
  names this skill (`/delivering-goal`, `$delivering-goal`, or
  "delivering-goal"), or references a file under a marked goals root
  (`@goals/01-mvp/goal.md`, a phase or task file).
version: 4.0.0
---

# Delivering Goal

## Setup

| Item | Kind | Required | When | Done when | How |
| --- | --- | --- | --- | --- | --- |
| Git CLI | user | required | All | `git --version` succeeds | https://git-scm.com/downloads |
| Local repository | auto | required | All | `git rev-parse HEAD` succeeds | `git init` when the project has no repository; then `git commit --allow-empty -m "chore: initialize repository"` when it has no commit |
| Root path | ask | required | Plan goal, Deliver or continue | [goal-contract.md](references/goal-contract.md) → **Resolve goals root** finds a root | Ask for the folder (default `goals/`); missing or empty → use it, else ask for another path; recorded as the root's location |
| Root marker | static | required | Plan goal, Deliver or continue | `<goals-root>/index.md` carries [goal-contract.md](references/goal-contract.md) → **Author signature** | Write `index.md` from [`assets/index.md`](assets/index.md) |
| Delivery agent `phase-deliverer` | auto | required | Deliver or continue, when the harness supports subagents | [goal-contract.md](references/goal-contract.md) → **Delivery agents** → **Find** accepts it and its body matches [`assets/agents/phase-deliverer.md`](assets/agents/phase-deliverer.md) | [creating-delivery-agents.md](references/creating-delivery-agents.md) |

## Workflow

1. **Setup** — for each **Setup** row whose When covers the request, in order: Done when holds → skip; `user` → stop and print its How when required, continue without it when optional; `ask` → fill what the request answers, ask the rest together in one message, record each answer; `auto` and `static` → run.
2. **Contract** — read [goal-contract.md](references/goal-contract.md).
3. **Recipe** — match one **Recipes** row; open every doc in its Read column.

- Invents and researches no missing goal detail.

## Recipes

| Intent | Example phrasing | Read |
| --- | --- | --- |
| Set up | "Set up delivering-goal", "Is delivering-goal ready?", "Refresh the delivery agent" | **Setup** — run Workflow step 1 for every row, then report each row's state |
| Plan goal | "Plan this goal", "Create goal.md for …" | [planning-goal.md](references/planning-goal.md) |
| Deliver or continue | "Deliver this goal", "Build it", "Ship until done", "Continue @goals/01-mvp/goal.md" | [delivering-goal.md](references/delivering-goal.md) |
| Deliver one phase | "Deliver the next phase only" | [delivering-phase.md](references/delivering-phase.md) |
