# Creating Task Agents

## Overview

**Docs only.** Creates or refreshes `managing-tasks` task-agent files when the user explicitly asks to run `managing-tasks creating-task-agents`.

Run only as an explicit user command — not implicitly from orchestration references.

## Prerequisites

Per [task-contract.md](./task-contract.md) → **Subagent signature**, **Task agent roots**, and **Discovering project skills** to resolve `<skill-dir>` and read canonical templates.

## Guidelines

### Managed task agents

| Agent id | `readonly` | Canonical template |
| --- | --- | --- |
| `task-planner` | `false` | [`../assets/agents/task-planner.md`](../assets/agents/task-planner.md) |
| `task-triager` | `true` | [`../assets/agents/task-triager.md`](../assets/agents/task-triager.md) |
| `task-implementer` | `false` | [`../assets/agents/task-implementer.md`](../assets/agents/task-implementer.md) |

### 1. Detect IDE and target root

Use [task-contract.md](./task-contract.md) → **Task agent roots**. Prefer project-level root when available. If no known root exists, create `.agents/agents/` and write portable agents there.

### 2. Create or refresh each agent

For each managed task-agent id:

1. Resolve destination path from the IDE filename pattern.
2. Read canonical body from the matching template.
3. Write frontmatter required by the IDE (`name`, `description`, model fields when needed), then append **Subagent signature** fields: `author` and `generated_by: managing-tasks`.
4. Preserve user-customized non-contract fields only when they do not conflict with required fields.
5. If an existing managed file body diverges from template and the file is not user-customized, refresh from template.

### 3. Confirm to the user

Reply with target agent root, created files, refreshed files, and skipped files (with reason). End with:

`Task agents are ready. Re-run the original managing-tasks command.`

## Related

- [finding-task-agents.md](./finding-task-agents.md) — gate orchestration workflows on existing task agents
- [creating-multiple-tasks.md](./creating-multiple-tasks.md) — requires `task-planner`
- [executing-multiple-tasks.md](./executing-multiple-tasks.md) — requires `task-triager` and `task-implementer`
