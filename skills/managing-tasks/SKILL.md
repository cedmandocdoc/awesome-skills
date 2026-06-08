---
name: managing-tasks
description: Manages structured task folders (plan.md, status.md) for cross-session agent handoff. Creates, executes, checks, updates, blocks, verifies, archives, reopens, skips, or cancels tasks. Use when the user works with tasks/NNN-slug folders or asks about task status, blockers, or lifecycle.
---

# Managing Tasks

Skill collection for durable, handoff-ready task work on disk. Works in any environment where the agent can read and write repository files.

**Contract:** [`references/task-contract.md`](references/task-contract.md) — layout, frontmatter, status fields, skill discovery.

**Rule:** Read exactly **one** recipe below for the user's intent. Do not load other recipe files unless the user switches intent mid-session.

## When to use

Follow this skill for every task-lifecycle action under `<tasks-root>/NNN-slug/`: planning, executing, checking status, amending scope, blocking, verifying, archiving, reopening, skipping, or cancelling.

## Task recipes

| Intent | Example phrasing | Read |
| --- | --- | --- |
| Create | "Create a task: …", "Plan … as a task", "new task" | [creating-task.md](references/creating-task.md) |
| Execute | "Continue `tasks/001-…`", "Resume the dark mode task", "implement next step" | [executing-task.md](references/executing-task.md) |
| Check | "Status of `tasks/003-…`", "list all tasks", "what's next?" | [checking-task.md](references/checking-task.md) |
| Update | "Update task scope", "add a phase to `tasks/003-…`", "replan" | [updating-task.md](references/updating-task.md) |
| Block | "Block this task", "waiting on design review" | [blocking-task.md](references/blocking-task.md) |
| Unblock | "Unblock `tasks/002-…`", "dependency resolved" | [unblocking-task.md](references/unblocking-task.md) |
| Verify | "Run verification", "mark done if checks pass" | [verifying-task.md](references/verifying-task.md) |
| Archive | "Archive done tasks", "move to archive/" | [archiving-task.md](references/archiving-task.md) |
| Reopen | "Reopen cancelled task", "reopen `tasks/005-…`" | [reopening-task.md](references/reopening-task.md) |
| Skip | "Skip this step", "defer `step-2`", "skip and move on" | [skipping-step.md](references/skipping-step.md) |
| Cancel | "Cancel task", "abandon `tasks/005-…`", "stop this task" | [cancelling-task.md](references/cancelling-task.md) |

Load this skill when intent matches any row, whether the user @-mentions the skill or describes the work in natural language.

## Reference index

| Doc | When to use |
| --- | --- |
| [task-contract.md](references/task-contract.md) | Layout, frontmatter, status fields, finding tasks, resolving domain references |
| [creating-task.md](references/creating-task.md) | New task folder, plan + initial status; **no application code** |
| [executing-task.md](references/executing-task.md) | Run `next_step_id`, implement, update status before stopping |
| [checking-task.md](references/checking-task.md) | Read-only status report for one task or all tasks |
| [updating-task.md](references/updating-task.md) | Amend `plan.md` and sync `status.md` when scope changes |
| [blocking-task.md](references/blocking-task.md) | Mark task blocked with reason; freeze execution pointer |
| [unblocking-task.md](references/unblocking-task.md) | Clear blocker; restore `In Progress` |
| [verifying-task.md](references/verifying-task.md) | Run verification checklist; mark `Done` or report failures |
| [archiving-task.md](references/archiving-task.md) | Move `Done` or `Cancelled` tasks to `archive/` |
| [reopening-task.md](references/reopening-task.md) | Restore a cancelled task for continued work |
| [skipping-step.md](references/skipping-step.md) | Skip a step with reason; advance execution pointer |
| [cancelling-task.md](references/cancelling-task.md) | Mark task cancelled; optional archive |

## Templates

- [`assets/plan.md`](assets/plan.md)
- [`assets/status.md`](assets/status.md)

## Examples

**Create:** User asks to plan "Add dark mode toggle". Follow [creating-task.md](references/creating-task.md) → write `tasks/001-dark-mode-toggle/plan.md` + `status.md` → suggest _"Continue `tasks/001-dark-mode-toggle`"_.

**Execute:** User says continue `tasks/001-dark-mode-toggle`. Follow [executing-task.md](references/executing-task.md) → read `status.md` first → run `next_step_id`.

**Update:** User adds a phase to an in-progress task. Follow [updating-task.md](references/updating-task.md) → bump `plan_revision` → sync step queue.

**Check:** User asks "what's the status of the dark mode task?". Follow [checking-task.md](references/checking-task.md) → read `status.md` → report without mutating files.
