---
name: managing-tasks
description: Manages structured task folders (plan.md, status.md) for cross-session agent handoff. Creates, creates multiple (plan a backlog of new tasks), executes, executes multiple (plan then implement backlog), triages (status, readiness, roadmap), updates, blocks, unblocks, or cancels tasks. Done and Cancelled tasks auto-archive. Use when the user works with tasks/NNN-slug folders or asks about task status, blockers, readiness, or lifecycle.
version: 1.3.0
---

# Managing Tasks

## Overview

Skill collection for durable, handoff-ready task work on disk. Works in any environment where the agent can read and write repository files.

**Layering:** recipes own action rules; [`assets/`](assets/) are copy skeletons; [`references/task-contract.md`](references/task-contract.md) is system plumbing (resolve root, status, discovery); on-disk `plan.md` / `status.md` are runtime truth after create.

## Agent workflow

Follow this skill for every task-lifecycle action under `<tasks-root>/NNN-slug/`: planning, executing, checking status, amending scope, blocking, cancelling, or running backlog work via subagents.

**Tasks root:** Located only via `<tasks-root>/index.md` with the static **Author signature** UUID in frontmatter. If none exists, **ask the user** for an empty folder path, then initialize with `index.md` before any task folder. See [task-contract.md](references/task-contract.md) → **Resolve tasks root**.

**Statuses:** `Not Started`, `In Progress`, `Blocked`, `Done`, `Cancelled`. Verify remaining keeps `In Progress` with `next_step_id: verify`. `Done` and `Cancelled` auto-move to `archives/`.

Match one **Recipes** row; open exactly that reference.

### Recipes

| Intent | Example phrasing | Read |
| --- | --- | --- |
| Create | "Create a task: …", "Plan … as a task", "new task" | [creating-task.md](references/creating-task.md) |
| Create spike | "Create a spike task for …", "Research feasibility of …", "Investigate whether … is achievable" | [creating-spike-task.md](references/creating-spike-task.md) |
| Create multiple | "Create tasks for …", "Plan tasks: …", "break this into tasks" | [creating-multiple-tasks.md](references/creating-multiple-tasks.md) |
| Execute | "Continue `tasks/001-…`", "Resume the dark mode task", "implement next step", "verify / mark done" | [executing-task.md](references/executing-task.md) |
| Execute multiple | "Finish all tasks", "run the backlog", "implement until no task available", @-mention tasks root with no folder | [executing-multiple-tasks.md](references/executing-multiple-tasks.md) |
| Triage / check | "Status of `tasks/003-…`", "list all tasks", "What can I start?", "What's unblocked?", "roadmap for tasks" | [triaging-tasks.md](references/triaging-tasks.md) |
| Update | "Update task scope", "add a phase to `tasks/003-…`", "replan" | [updating-task.md](references/updating-task.md) |
| Block / Unblock | "Block this task", "waiting on design review", "Unblock `tasks/002-…`", "dependency resolved" | [blocking-task.md](references/blocking-task.md) |
| Cancel | "Cancel task", "abandon `tasks/005-…`", "stop this task" | [cancelling-task.md](references/cancelling-task.md) |

## Reference index

### Contract

[task-contract.md](references/task-contract.md) — system plumbing only (resolve root, layout, status, auto-archive, dependency resolve, discovery).

| Doc | When to use |
| --- | --- |
| [task-contract.md](references/task-contract.md) | Tasks root `index.md` marker, author UUID, layout, plan frontmatter fields, status fields, auto-archive, resolve Depends on, finding tasks, resolving domain references |
| [creating-task.md](references/creating-task.md) | New task folder, plan + initial status; planning only — owns Requirements fill rules |
| [creating-spike-task.md](references/creating-spike-task.md) | New spike/research/investigation task folder with `plan.md`, `status.md`, and `findings.md` handoff |
| [creating-multiple-tasks.md](references/creating-multiple-tasks.md) | Multiple new task folders — parse spec list, require expected task agents, then delegate planning |
| [executing-task.md](references/executing-task.md) | Run `next_step_id` for one task folder, verify when last step, auto-archive on Done |
| [executing-multiple-tasks.md](references/executing-multiple-tasks.md) | Backlog loop — require expected task agents, plan execution series once, then implement in order |
| [triaging-tasks.md](references/triaging-tasks.md) | Read-only status report, readiness report, or ordered execution roadmap |
| [finding-task-agents.md](references/finding-task-agents.md) | Check whether required task agents already exist and decide whether to continue or stop early |
| [creating-task-agents.md](references/creating-task-agents.md) | User-invoked creation and refresh flow for `task-planner`, `task-triager`, and `task-implementer` |
| [updating-task.md](references/updating-task.md) | Amend `plan.md` and sync `status.md` when scope changes |
| [blocking-task.md](references/blocking-task.md) | Mark task blocked with reason, or clear blocker and restore `In Progress` |
| [cancelling-task.md](references/cancelling-task.md) | Mark task cancelled with reason and auto-archive |
| [findings-contract.md](references/findings-contract.md) | Spike `findings.md` validation — frontmatter enums, deliverables quality, handoff checklist |

## Templates

- [`assets/index.md`](assets/index.md)
- [`assets/plan.md`](assets/plan.md)
- [`assets/status.md`](assets/status.md)
- [`assets/findings.md`](assets/findings.md)
- [`assets/agents/task-planner.md`](assets/agents/task-planner.md)
- [`assets/agents/task-triager.md`](assets/agents/task-triager.md)
- [`assets/agents/task-implementer.md`](assets/agents/task-implementer.md)
