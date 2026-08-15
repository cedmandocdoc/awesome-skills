---
name: managing-tasks
id: 34d10b1d-f2fb-4121-b7bf-0c17401658a3
description: Manages structured task folders (plan.md, status.md) for cross-session agent handoff. Creates, creates multiple (plan a backlog of new tasks), executes, executes multiple (plan then implement backlog), triages (status, readiness, roadmap), updates, blocks, unblocks, or cancels tasks. Done and Cancelled tasks auto-archive. Use when the user works with tasks/NNN-slug folders or asks about task status, blockers, readiness, or lifecycle.
version: 1.4.0
---

# Managing Tasks

## Overview

Durable task folders (`plan.md`, `status.md`) for cross-session agent handoff. Recipes own action rules; [`assets/`](assets/) are copy skeletons; [task-contract.md](references/task-contract.md) is system plumbing; on-disk plans/status are runtime truth after create.

## Agent workflow

Follow this skill for every task-lifecycle action under `<tasks-root>/NNN-slug/`. Works wherever the agent can read and write repository files.

**Tasks root:** Locate via `<tasks-root>/index.md` with the static **Author signature** UUID. If none exists, ask the user for an empty folder path, then initialize. See [task-contract.md](references/task-contract.md) → **Resolve tasks root**.

**Statuses:** `Not Started`, `In Progress`, `Blocked`, `Done`, `Cancelled`. Verify-only remaining keeps `In Progress` with `next_step_id: verify`. `Done` and `Cancelled` auto-move to `archives/`.

Match one **Recipes** row; open exactly that reference.

### Recipes

| Intent | Example phrasing | Read |
| --- | --- | --- |
| Create | "Create a task: …", "Plan … as a task", "new task" | [creating-task.md](references/creating-task.md) |
| Create multiple | "Create tasks for …", "Plan tasks: …", "break this into tasks" | [creating-multiple-tasks.md](references/creating-multiple-tasks.md) |
| Execute | "Continue `tasks/001-…`", "Resume the dark mode task", "implement next step", "verify / mark done" | [executing-task.md](references/executing-task.md) |
| Execute multiple | "Finish all tasks", "run the backlog", "implement until no task available", @-mention tasks root with no folder | [executing-multiple-tasks.md](references/executing-multiple-tasks.md) |
| Triage / check | "Status of `tasks/003-…`", "list all tasks", "What can I start?", "What's unblocked?", "roadmap for tasks" | [triaging-tasks.md](references/triaging-tasks.md) |
| Update | "Update task scope", "add a phase to `tasks/003-…`", "replan" | [updating-task.md](references/updating-task.md) |
| Block / Unblock | "Block this task", "waiting on design review", "Unblock `tasks/002-…`", "dependency resolved" | [blocking-task.md](references/blocking-task.md) |
| Cancel | "Cancel task", "abandon `tasks/005-…`", "stop this task" | [cancelling-task.md](references/cancelling-task.md) |

## Reference index

### Contract

[task-contract.md](references/task-contract.md) — resolve root, layout, status, auto-archive, dependency resolve, discovery, task-agent roots.

| Doc | When to use |
| --- | --- |
| [task-contract.md](references/task-contract.md) | Tasks root marker, layout, frontmatter, status, auto-archive, Depends on, discovery, task-agent roots |
| [creating-task.md](references/creating-task.md) | New task folder; planning only |
| [creating-multiple-tasks.md](references/creating-multiple-tasks.md) | Multiple new folders via `task-planner` |
| [executing-task.md](references/executing-task.md) | Run `next_step_id` for one folder; verify and archive on Done |
| [executing-multiple-tasks.md](references/executing-multiple-tasks.md) | Backlog loop via `task-triager` then `task-implementer` |
| [triaging-tasks.md](references/triaging-tasks.md) | Status report, readiness report, or execution roadmap |
| [finding-task-agents.md](references/finding-task-agents.md) | Gate orchestration on existing task agents |
| [creating-task-agents.md](references/creating-task-agents.md) | User-invoked create/refresh of task agents |
| [updating-task.md](references/updating-task.md) | Amend `plan.md` and sync `status.md` |
| [blocking-task.md](references/blocking-task.md) | Mark blocked or clear blocker |
| [cancelling-task.md](references/cancelling-task.md) | Cancel and auto-archive |

## Templates

- [`assets/index.md`](assets/index.md)
- [`assets/plan.md`](assets/plan.md)
- [`assets/status.md`](assets/status.md)
- [`assets/agents/task-planner.md`](assets/agents/task-planner.md)
- [`assets/agents/task-triager.md`](assets/agents/task-triager.md)
- [`assets/agents/task-implementer.md`](assets/agents/task-implementer.md)
