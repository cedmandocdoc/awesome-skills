---
name: managing-tasks
description: Manages structured task folders (plan.md, status.md) for cross-session agent handoff. Creates plans, executes steps, updates scope, skips or cancels work. Use when the user wants to create, continue, resume, update, replan, skip, or cancel a task, or work from a tasks/NNN-slug folder.
---

# Managing Tasks

Skill collection for durable, handoff-ready task work on disk. Works in any environment where the agent can read and write repository files.

**Contract:** [`references/task-contract.md`](references/task-contract.md) — layout, frontmatter, status fields, skill discovery.

**Rule:** Read exactly **one** recipe below for the user's intent. Do not load other recipe files unless the user switches intent mid-session.

## When to use

Follow this skill for every task-lifecycle action: planning, continuing, amending scope, skipping a step, or cancelling work under `<tasks-root>/NNN-slug/`.

## Task recipes

| Intent | Example phrasing | Read |
| --- | --- | --- |
| Create | "Create a task: …", "Plan … as a task", "new task" | [creating-task.md](references/creating-task.md) |
| Execute | "Continue `tasks/001-…`", "Resume the dark mode task", "implement next step" | [executing-task.md](references/executing-task.md) |
| Update | "Update task scope", "add a phase to `tasks/003-…`", "replan" | [updating-task.md](references/updating-task.md) |
| Skip | "Skip this step", "defer `step-2`", "skip and move on" | [skipping-step.md](references/skipping-step.md) |
| Cancel | "Cancel task", "abandon `tasks/005-…`", "stop this task" | [cancelling-task.md](references/cancelling-task.md) |

Load this skill when intent matches any row, whether the user @-mentions the skill or describes the work in natural language.

## Reference index

| Doc | When to use |
| --- | --- |
| [task-contract.md](references/task-contract.md) | Layout, frontmatter, status fields, finding tasks, resolving domain references |
| [creating-task.md](references/creating-task.md) | New task folder, plan + initial status; **no application code** |
| [executing-task.md](references/executing-task.md) | Run `next_step_id`, implement, update status before stopping |
| [updating-task.md](references/updating-task.md) | Amend `plan.md` and sync `status.md` when scope changes |
| [skipping-step.md](references/skipping-step.md) | Skip a step with reason; advance execution pointer |
| [cancelling-task.md](references/cancelling-task.md) | Mark task cancelled; optional archive |

## Templates

- [`templates/plan.md`](templates/plan.md)
- [`templates/status.md`](templates/status.md)

## Examples

**Create:** User asks to plan "Add dark mode toggle". Follow [creating-task.md](references/creating-task.md) → write `tasks/001-dark-mode-toggle/plan.md` + `status.md` → suggest _"Continue `tasks/001-dark-mode-toggle`"_.

**Execute:** User says continue `tasks/001-dark-mode-toggle`. Follow [executing-task.md](references/executing-task.md) → read `status.md` first → run `next_step_id`.

**Update:** User adds a phase to an in-progress task. Follow [updating-task.md](references/updating-task.md) → bump `plan_revision` → sync step queue.
