# Finding Task Agents

## Overview

**Read-only.** Checks whether required `managing-tasks` task agents already exist before orchestration recipes run.

Use this reference before any workflow that delegates to `task-planner`, `task-triager`, or `task-implementer`.

## Prerequisites

Per [task-contract.md](./task-contract.md) -> **Discovering project skills** when resolving `<skill-dir>` for templates and signature checks.

## Guidelines

### Agent signature

Valid managed task-agent files must include all fields:

| Field | Value |
| --- | --- |
| `author` | `a7c9e1f3-5b2d-7e9f-1a3c-5d7e9f1b3a5c` |
| `generated_by` | `managing-tasks` |

### Required agents by workflow

| Workflow | Required agent ids |
| --- | --- |
| [creating-multiple-tasks.md](./creating-multiple-tasks.md) | `task-planner` |
| [executing-multiple-tasks.md](./executing-multiple-tasks.md) | `task-triager`, `task-implementer` |

### 1. Detect IDE and agent roots

Prefer project-level roots first:

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

User-level fallback roots (reuse only): `~/.cursor/agents/`, `~/.claude/agents/`, `~/.codex/agents/`, `~/.copilot/agents/`.

### 2. Validate each required agent

For each required agent id:

1. Search candidate roots by filename pattern.
2. Read frontmatter from matches.
3. Accept the first file where:
   - `name` matches required id
   - `author` matches signature
   - `generated_by` is `managing-tasks`

Track results as `found_agents` and `missing_agents`.

### 3. Return one of two outcomes

If `missing_agents` is non-empty, stop immediately and reply with exactly:

`Create the subagent first by running managing-tasks creating-task-agents.`

If every required agent is found, continue with the calling workflow.

## Related

- [creating-task-agents.md](./creating-task-agents.md) - user-invoked task-agent creation and refresh
- [creating-multiple-tasks.md](./creating-multiple-tasks.md) - workflow requiring `task-planner`
- [executing-multiple-tasks.md](./executing-multiple-tasks.md) - workflow requiring `task-triager` and `task-implementer`
