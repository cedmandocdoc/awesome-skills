# Creating Task Agents

## Overview

**Docs only.** Creates or refreshes `managing-tasks` task-agent files when the user explicitly asks to run `managing-tasks creating-task-agents`.

Run this only as an explicit user command. Do not invoke this flow implicitly from task orchestration references.

## Prerequisites

Per [task-contract.md](./task-contract.md) -> **Discovering project skills** to resolve `<skill-dir>` and read canonical task-agent templates.

## Guidelines

### Agent signature

Every created or refreshed task-agent file must include:

| Field | Value |
| --- | --- |
| `author` | `a7c9e1f3-5b2d-7e9f-1a3c-5d7e9f1b3a5c` |
| `generated_by` | `managing-tasks` |

### Managed task agents

| Agent id | `readonly` | Canonical template |
| --- | --- | --- |
| `task-planner` | `false` | [`../assets/agents/task-planner.md`](../assets/agents/task-planner.md) |
| `task-triager` | `true` | [`../assets/agents/task-triager.md`](../assets/agents/task-triager.md) |
| `task-implementer` | `false` | [`../assets/agents/task-implementer.md`](../assets/agents/task-implementer.md) |

### 1. Detect IDE and target root

Use project-level root when available:

| IDE | Root | Filename pattern |
| --- | --- | --- |
| Cursor | `.cursor/agents/` | `<name>.md` |
| Claude Code | `.claude/agents/` | `<name>.md` |
| Codex | `.codex/agents/` | `<name>.md` |
| Cline | `.cline/agents/` | `<name>.md` |
| GitHub Copilot | `.github/agents/` | `<name>.agent.md` |
| Gemini CLI | `.gemini/agents/` | `<name>.md` |
| Antigravity | `.agent/agents/` | `<name>.md` |
| Roo Code | `.roo/agents/` or `.roomodes` | `<name>.md` or mode entry |
| Portable fallback | `.agents/agents/` | `<name>.md` |

If no known root exists, create `.agents/agents/` and write portable agents there.

### 2. Create or refresh each agent

For each managed task-agent id:

1. Resolve destination path from the IDE filename pattern.
2. Read canonical body from the matching template.
3. Write frontmatter required by the IDE (`name`, `description`, model fields when needed), then append:
   - `author: a7c9e1f3-5b2d-7e9f-1a3c-5d7e9f1b3a5c`
   - `generated_by: managing-tasks`
4. Preserve user-customized non-contract fields only when they do not conflict with required fields.
5. If an existing managed file body diverges from template and the file is not user-customized, refresh from template.

### 3. Confirm to the user

Reply with:

- Target agent root used
- Created files
- Refreshed files
- Skipped files (with reason)

End with:

`Task agents are ready. Re-run the original managing-tasks command.`

## Related

- [finding-task-agents.md](./finding-task-agents.md) - gate orchestration workflows on existing task agents
- [creating-multiple-tasks.md](./creating-multiple-tasks.md) - requires `task-planner`
- [executing-multiple-tasks.md](./executing-multiple-tasks.md) - requires `task-triager` and `task-implementer`
