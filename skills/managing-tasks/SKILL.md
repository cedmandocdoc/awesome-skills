---
name: managing-tasks
description: Manages structured task folders (plan.md, status.md) for cross-session agent handoff. Creates, creates multiple (plan a backlog of new tasks), executes, executes multiple (plan then implement backlog), checks, triages, updates, blocks, verifies, archives, reopens, skips, or cancels tasks. Use when the user works with tasks/NNN-slug folders or asks about task status, blockers, readiness, or lifecycle.
version: 1.2.0
---

# Managing Tasks

## Overview

Skill collection for durable, handoff-ready task work on disk. Works in any environment where the agent can read and write repository files.

**Layering:** recipes own action rules; [`assets/`](assets/) are copy skeletons; [`references/task-contract.md`](references/task-contract.md) is system plumbing (resolve root, status, discovery); on-disk `plan.md` / `status.md` are runtime truth after create.

## Agent workflow

Follow this skill for every task-lifecycle action under `<tasks-root>/NNN-slug/`: planning, executing, checking status, amending scope, blocking, verifying, archiving, reopening, skipping, or cancelling.

**Tasks root:** Located only via `<tasks-root>/index.md` with the static **Author signature** UUID in frontmatter. If none exists, **ask the user** for an empty folder path, then initialize with `index.md` before any task folder. See [task-contract.md](references/task-contract.md) → **Resolve tasks root**.

Match one **Recipes** row; open exactly that reference.

### Recipes

| Intent | Example phrasing | Read |
| --- | --- | --- |
| Create | "Create a task: …", "Plan … as a task", "new task" | [creating-task.md](references/creating-task.md) |
| Create spike | "Create a spike task for …", "Research feasibility of …", "Investigate whether … is achievable" | [creating-spike-task.md](references/creating-spike-task.md) |
| Create multiple | "Create tasks for …", "Plan tasks: …", "break this into tasks" | [creating-multiple-tasks.md](references/creating-multiple-tasks.md) |
| Execute | "Continue `tasks/001-…`", "Resume the dark mode task", "implement next step" | [executing-task.md](references/executing-task.md) |
| Execute multiple | "Finish all tasks", "run the backlog", "implement until no task available", @-mention tasks root with no folder | [executing-multiple-tasks.md](references/executing-multiple-tasks.md) |
| Check | "Status of `tasks/003-…`", "list all tasks", "what's next on this task?" | [checking-task.md](references/checking-task.md) |
| Triage | "What can I start?", "Which tasks are ready?", "What's unblocked?", "roadmap for tasks" | [triaging-tasks.md](references/triaging-tasks.md) |
| Update | "Update task scope", "add a phase to `tasks/003-…`", "replan" | [updating-task.md](references/updating-task.md) |
| Block | "Block this task", "waiting on design review" | [blocking-task.md](references/blocking-task.md) |
| Unblock | "Unblock `tasks/002-…`", "dependency resolved" | [unblocking-task.md](references/unblocking-task.md) |
| Verify | "Run verification", "mark done if checks pass" | [verifying-task.md](references/verifying-task.md) |
| Archive | "Archive done tasks", "move to archive/" | [archiving-task.md](references/archiving-task.md) |
| Reopen | "Reopen cancelled task", "reopen `tasks/005-…`" | [reopening-task.md](references/reopening-task.md) |
| Skip | "Skip this step", "defer `step-2`", "skip and move on" | [skipping-step.md](references/skipping-step.md) |
| Cancel | "Cancel task", "abandon `tasks/005-…`", "stop this task" | [cancelling-task.md](references/cancelling-task.md) |

## Reference index

### Contract

[task-contract.md](references/task-contract.md) — system plumbing only (resolve root, layout, status, discovery).

| Doc | When to use |
| --- | --- |
| [task-contract.md](references/task-contract.md) | Tasks root `index.md` marker, author UUID, layout, plan frontmatter fields, status fields, finding tasks, resolving domain references |
| [creating-task.md](references/creating-task.md) | New task folder, plan + initial status; planning only — owns Requirements fill rules |
| [creating-spike-task.md](references/creating-spike-task.md) | New spike/research/investigation task folder with `plan.md`, `status.md`, and `findings.md` handoff |
| [creating-multiple-tasks.md](references/creating-multiple-tasks.md) | Multiple new task folders — parse spec list, require expected task agents, then delegate planning |
| [executing-task.md](references/executing-task.md) | Run `next_step_id` for one task folder, implement, update status before stopping |
| [executing-multiple-tasks.md](references/executing-multiple-tasks.md) | Backlog loop — require expected task agents, plan execution series once, then implement in order |
| [checking-task.md](references/checking-task.md) | Read-only status report for one task or all tasks |
| [triaging-tasks.md](references/triaging-tasks.md) | Read-only triage — readiness report or ordered execution roadmap |
| [finding-task-agents.md](references/finding-task-agents.md) | Check whether required task agents already exist and decide whether to continue or stop early |
| [creating-task-agents.md](references/creating-task-agents.md) | User-invoked creation and refresh flow for `task-planner`, `task-triager`, and `task-implementer` |
| [updating-task.md](references/updating-task.md) | Amend `plan.md` and sync `status.md` when scope changes |
| [blocking-task.md](references/blocking-task.md) | Mark task blocked with reason; freeze execution pointer |
| [unblocking-task.md](references/unblocking-task.md) | Clear blocker; restore `In Progress` |
| [verifying-task.md](references/verifying-task.md) | Run verification checklist; mark `Done` or report failures |
| [archiving-task.md](references/archiving-task.md) | Move `Done` or `Cancelled` tasks to `archive/` |
| [reopening-task.md](references/reopening-task.md) | Restore a cancelled task for continued work |
| [skipping-step.md](references/skipping-step.md) | Skip a step with reason; advance execution pointer |
| [cancelling-task.md](references/cancelling-task.md) | Mark task cancelled; optional archive |
| [findings-contract.md](references/findings-contract.md) | Spike `findings.md` validation — frontmatter enums, deliverables quality, handoff checklist |

## Templates

- [`assets/index.md`](assets/index.md)
- [`assets/plan.md`](assets/plan.md)
- [`assets/status.md`](assets/status.md)
- [`assets/findings.md`](assets/findings.md)
- [`assets/agents/task-planner.md`](assets/agents/task-planner.md)
- [`assets/agents/task-triager.md`](assets/agents/task-triager.md)
- [`assets/agents/task-implementer.md`](assets/agents/task-implementer.md)
