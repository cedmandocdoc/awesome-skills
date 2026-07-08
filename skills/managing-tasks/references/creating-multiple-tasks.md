# Creating Multiple Tasks

## Overview

**Planning only.** Creates multiple task folders from a user-provided list of goals. Requires `task-planner` to exist, then orchestrates delegation per spec; stops without implementing unless the user also asks to implement in the same message.

## Prerequisites

Per [task-contract.md](./task-contract.md) → **Resolve tasks root** when the user names a tasks root or one already exists.

Per [finding-task-agents.md](./finding-task-agents.md) when this workflow requires task-agent delegation.

## Guidelines

### 1. Resolve tasks root

Per [task-contract.md](./task-contract.md) → **Resolve tasks root**, **Finding tasks root**, and **Initialize tasks root** when no `index.md` marker exists.

If no tasks root exists and the user did not name one, **ask once** for an empty folder path before building the creation plan.

### 2. Parameters

Parse from the user's message. Use defaults when omitted.

| Parameter | Default | Meaning |
| --- | --- | --- |
| `max_created` | `5` | Stop after this many tasks are successfully created |
| `stop_on_skip` | `false` | Stop when planner returns `Skipped spec: ...` |
| `stop_on_failure` | `true` | Stop when planner returns `Failed spec: ...` |

### 3. Build creation plan (parent inline)

Derive an ordered list of task specs from the user message. Each spec is a short title or goal string sufficient for [creating-task.md](./creating-task.md).

| Source pattern | Example extraction |
| --- | --- |
| Comma-separated list | "Create tasks: dark mode, auth flow, settings page" → three specs |
| Bulleted or numbered list | One spec per bullet or number |
| Multiple sentences with "and" | Split only when each clause is a distinct deliverable |
| Single broad goal | One spec — use [creating-task.md](./creating-task.md) directly instead |

Trim whitespace; drop empty entries. Preserve user order.

If the list is empty after parsing → exit (reason: `no_specs`).

Store as `creation_plan` — ordered list of spec strings. Set `plan_index` to `0`.

Do not delegate this decomposition to a subagent.

### 4. Require expected task agents

Before delegating, follow [finding-task-agents.md](./finding-task-agents.md) for required agents: **`task-planner`**.

If the finder reports missing expected agents, stop immediately and reply:

`Create the subagent first by running managing-tasks creating-task-agents.`

Do not continue into orchestration until required agents exist.

### 5. Task-agent contract

Parse subagent replies exactly — one line each.

**task-planner**:

| Reply | Meaning |
| --- | --- |
| `Created task-<NNN-slug>` | Task folder written under `<tasks-root>/` |
| `Skipped spec: <reason>` | Spec not planned (duplicate folder, ambiguous scope, etc.) |
| `Failed spec: <reason>` | Write or resolve error |

Map `task-<NNN-slug>` to `<tasks-root>/<NNN-slug>/`.

### 6. Orchestration loop

Track:

- `creation_plan` — ordered spec strings from §3
- `plan_index` — next index in `creation_plan` to run
- `created_count` — tasks that returned `Created task-...`
- `created_tasks` — list of `task-<NNN-slug>` ids
- `last_outcome` — last planner reply line

For each entry in `creation_plan` starting at `plan_index`:

1. **Plan** — Launch `task-planner` for the current spec.
   - Prompt: `Create a task: <spec>. Tasks root: <tasks-root>/. Follow creating-task.md per managing-tasks. Planning only — do not implement.`
   - Parse the one-line reply:
     - `Created task-<NNN-slug>` → append to `created_tasks`, increment `created_count`, set `last_outcome`.
     - `Skipped spec: ...` → set `last_outcome`. If `stop_on_skip`, exit loop (reason: `skipped`). Otherwise advance `plan_index` and continue.
     - `Failed spec: ...` → set `last_outcome`. If `stop_on_failure`, exit loop (reason: `failed`). Otherwise advance `plan_index` and continue.

2. **Cap check** — If `created_count >= max_created` → exit loop (reason: `max_created`).

3. Advance `plan_index` and run the next spec immediately — do not re-parse the user message between tasks.

When `plan_index` reaches the end of `creation_plan` → exit loop (reason: `plan_exhausted`).

Do not launch multiple planners in parallel. Order is always plan spec -> plan spec -> ...

### 7. Report results

Reply with a short summary. Optional one-line note per created task is allowed; do not paste subagent logs or full plan bodies.

```
Task creation complete.
Requested: <M> (<comma-separated spec snippets or "none">)
Created: <N> (<comma-separated task ids or "none">)
Stop reason: <no_specs | max_created | skipped | failed | plan_exhausted>
Last outcome: <last planner one-liner, or "none">
```

When `created_count > 0`, suggest follow-up: _"Execute the backlog with executing-multiple-tasks"_ or name the first created folder for single-task execution.

**Stop without implementing** unless the user also asked to implement in the same message. When they did, hand off to [executing-multiple-tasks.md](./executing-multiple-tasks.md) after reporting creation results.

### 8. Constraints

- **Require expected agents first** — run [finding-task-agents.md](./finding-task-agents.md) and return early when required agents are missing.
- **Delegate only** — never substitute your own task creation for task-agent work.
- **One spec per planner launch** — do not batch multiple specs in one planner call.
- **Trust subagent one-liners** — do not re-read disk to second-guess planner outcomes unless a reply does not match the contract patterns.
- **No git operations** — creating tasks does not commit unless the user explicitly asks outside this run.
- **No execution** — do not advance `next_step_id`, run implementation steps, or call `task-implementer` unless the user explicitly asked to implement in the same message.

Each created task follows [creating-task.md](./creating-task.md) inside the planner subagent, not in the orchestrating session.

## Examples

**Create multiple:** User says "Create tasks for dark mode toggle, user profile settings, and push notifications". Resolve tasks root -> build three-spec `creation_plan` -> verify `task-planner` exists via [finding-task-agents.md](./finding-task-agents.md) -> delegate once per spec until cap or exit -> report created ids.

**Create then execute:** User says "Plan tasks for A and B, then implement them". Run this reference through §7, then [executing-multiple-tasks.md](./executing-multiple-tasks.md) in the same session.

## Related

- [creating-task.md](./creating-task.md) — single-task planning recipe used inside each planner run
- [executing-multiple-tasks.md](./executing-multiple-tasks.md) — backlog execution after tasks exist
- [finding-task-agents.md](./finding-task-agents.md) — checks whether `task-planner` exists
- [creating-task-agents.md](./creating-task-agents.md) — user-invoked agent creation workflow
