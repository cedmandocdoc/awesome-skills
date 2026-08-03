# Creating Multiple Tasks

## Overview

**Planning only.** Creates multiple task folders from a user-provided list of goals. Requires `task-planner`, then delegates one spec at a time. Stop without implementing unless the user also asks to implement in the same message.

## Prerequisites

Per [task-contract.md](./task-contract.md) → **Resolve tasks root** when the user names a tasks root or one already exists.

Per [finding-task-agents.md](./finding-task-agents.md) when this workflow requires task-agent delegation.

## Guidelines

### 1. Resolve tasks root

Per [task-contract.md](./task-contract.md) → **Resolve tasks root**. Initialize when no `index.md` marker exists.

If no tasks root exists and the user did not name one, ask once for an empty folder path before building the creation plan.

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

Trim whitespace; drop empty entries. Preserve user order. Build this list in the parent — do not delegate decomposition.

**Carry Sources into every spec** — when the user message includes shared URLs, Figma/design links, tickets, or `@` paths that apply to the backlog, append them to each delegated planner prompt. Spec strings alone may drop links.

If the list is empty after parsing → exit (reason: `no_specs`).

Store as `creation_plan` (ordered spec strings). Set `plan_index` to `0`.

### 4. Require expected task agents

Follow [finding-task-agents.md](./finding-task-agents.md) for **`task-planner`**. If missing, stop and reply:

`Create the subagent first by running managing-tasks creating-task-agents.`

### 5. Task-agent contract

Parse subagent replies exactly — one line each.

| Reply | Meaning |
| --- | --- |
| `Created task-<NNN-slug>` | Task folder written under `<tasks-root>/` |
| `Skipped spec: <reason>` | Spec not planned (duplicate folder, ambiguous scope, etc.) |
| `Failed spec: <reason>` | Write or resolve error |

Map `task-<NNN-slug>` to `<tasks-root>/<NNN-slug>/`.

### 6. Orchestration loop

Track: `creation_plan`, `plan_index`, `created_count`, `created_tasks`, `last_outcome`.

For each entry in `creation_plan` starting at `plan_index`:

1. **Plan** — Launch `task-planner` for the current spec (one spec per launch; never parallel).
   - Prompt: `Create a task: <spec>. Sources (copy into plan Requirements): <shared URLs/paths or "none">. Tasks root: <tasks-root>/. Follow creating-task.md per managing-tasks. Planning only — do not implement.`
   - Parse the one-line reply:
     - `Created task-<NNN-slug>` → append to `created_tasks`, increment `created_count`, set `last_outcome`
     - `Skipped spec: ...` → set `last_outcome`; if `stop_on_skip`, exit (reason: `skipped`); else advance and continue
     - `Failed spec: ...` → set `last_outcome`; if `stop_on_failure`, exit (reason: `failed`); else advance and continue
2. **Cap check** — If `created_count >= max_created` → exit (reason: `max_created`).
3. Advance `plan_index` and run the next spec — do not re-parse the user message between tasks.

When `plan_index` reaches the end of `creation_plan` → exit (reason: `plan_exhausted`).

Delegate only — never substitute parent-session task creation for planner work. Trust subagent one-liners unless a reply does not match the contract patterns.

### 7. Report results

```
Task creation complete.
Requested: <M> (<comma-separated spec snippets or "none">)
Created: <N> (<comma-separated task ids or "none">)
Stop reason: <no_specs | max_created | skipped | failed | plan_exhausted>
Last outcome: <last planner one-liner, or "none">
```

Optional one-line note per created task; do not paste subagent logs or full plan bodies.

When `created_count > 0`, suggest follow-up: _"Execute the backlog with executing-multiple-tasks"_ or name the first created folder for single-task execution.

When the user also asked to implement, hand off to [executing-multiple-tasks.md](./executing-multiple-tasks.md) after reporting.

## Examples

**Create multiple:** "Create tasks for dark mode, profile, notifications" → three-spec plan → verify `task-planner` → delegate once per spec → report ids.

**Create then execute:** "Plan tasks for A and B, then implement" → this reference through §7, then [executing-multiple-tasks.md](./executing-multiple-tasks.md).

## Related

- [creating-task.md](./creating-task.md) — single-task planning used inside each planner run
- [executing-multiple-tasks.md](./executing-multiple-tasks.md) — backlog execution after tasks exist
- [finding-task-agents.md](./finding-task-agents.md) — checks whether `task-planner` exists
- [creating-task-agents.md](./creating-task-agents.md) — user-invoked agent creation
