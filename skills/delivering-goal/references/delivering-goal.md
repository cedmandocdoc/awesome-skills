# Delivering Goal

## Overview

**Backlog execution mode.** Main-session loop for one goal: ensure `goal.md`, resolve a pending review, then deliver one phase per `phase-deliverer` run until the goal is complete, blocked, or awaiting review.

## Prerequisites

Per [goal-contract.md](./goal-contract.md) → **Resolve goals root**, **Review gate**, **Commits**, **Handoff style**.

## Guidelines

### 1. Ensure goal.md

Resolve the goal. None → [planning-goal.md](./planning-goal.md) inline, then continue. Carry user-named skills as **Skills to prefer**.

A row is `review` → the user’s message approves it or requests changes → apply per **Review gate** and commit **Review resolved**; otherwise → show the review per §3 and stop.

No phase cap by default. When the user names one (“at most 3 phases”), stop there with `phase_cap`.

### 2. Loop

Launch `phase-deliverer` with:

`Deliver the next phase. Skill dir: <path>. Goal: <goal.md>. Skills to prefer: <list or none>. Blocker resolved: <yes when the user said so this run, else no>. Return the one-line handoff only.`

No subagent support → follow [delivering-phase.md](./delivering-phase.md) inline instead.

| Reply | Action |
| --- | --- |
| `Phase done: …` | Count it; launch the next phase |
| `Review phase: …` | Exit `review` |
| `Goal complete: …` | Exit `goal_complete` |
| `Blocked phase: …` | Exit `task_blocked` |
| `Blocked delivery: …` / `Failed phase: …` / unmatched | Exit `plan_blocked` |

Run one phase at a time. Trust handoffs; read artifacts only when a reply breaks the pattern.

### 3. Confirm to the user

```text
Delivery run complete.
Goal: <goal-id>
Phases delivered this run: <N>
Stop reason: <goal_complete | review | task_blocked | plan_blocked | phase_cap>
Last outcome: <last handoff or none>
```

On `review`, show the phase’s **Outcome** and **Review** (screenshots included), then ask: approve, or tell me what to change. On `task_blocked` / `plan_blocked`, add one sentence on what the user can do (resolve the blocker, clarify the goal), then re-run deliver goal.
