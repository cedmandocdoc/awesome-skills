# Finding Task Agents

## Overview

**Read-only.** Checks whether required `managing-tasks` task agents already exist before orchestration recipes run.

Use before any workflow that delegates to `task-planner`, `task-triager`, or `task-implementer`.

## Prerequisites

Per [task-contract.md](./task-contract.md) → **Subagent signature**, **Task agent roots**, and **Discovering project skills** when resolving `<skill-dir>`.

## Guidelines

### Required agents by workflow

| Workflow | Required agent ids |
| --- | --- |
| [creating-multiple-tasks.md](./creating-multiple-tasks.md) | `task-planner` |
| [executing-multiple-tasks.md](./executing-multiple-tasks.md) | `task-triager`, `task-implementer` |

### 1. Detect IDE and agent roots

Use roots and filename patterns from [task-contract.md](./task-contract.md) → **Task agent roots**. Prefer project-level roots; use user-level fallbacks only for reuse.

### 2. Validate each required agent

For each required agent id:

1. Search candidate roots by filename pattern.
2. Read frontmatter from matches.
3. Accept the first file where `name` matches the required id, `author` matches the **Subagent signature**, and `generated_by` is `managing-tasks`.

Track results as `found_agents` and `missing_agents`.

### 3. Return one of two outcomes

If `missing_agents` is non-empty, stop immediately and reply with exactly:

`Create the subagent first by running managing-tasks creating-task-agents.`

If every required agent is found, continue with the calling workflow.

## Related

- [creating-task-agents.md](./creating-task-agents.md) — user-invoked task-agent creation and refresh
- [creating-multiple-tasks.md](./creating-multiple-tasks.md) — requires `task-planner`
- [executing-multiple-tasks.md](./executing-multiple-tasks.md) — requires `task-triager` and `task-implementer`
