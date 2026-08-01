# Finding Delivery Agents

## Overview

**Read-only.** Checks whether required `developing-application` delivery agents exist before orchestration runs.

## Prerequisites

Per [delivery-contract.md](./delivery-contract.md) → **Discovering project skills** when resolving `<skill-dir>` for templates and signature checks.

## Guidelines

### Agent signature

Valid managed delivery-agent files must include all fields:

| Field | Value |
| --- | --- |
| `author` | `d4a6b8c0-5e3f-7a9b-1c2d-6f8e0a3b5c7d` |
| `generated_by` | `developing-application` |

### Required agents by workflow

| Workflow | Required agent ids |
| --- | --- |
| executing-delivery | `delivery-planner`, `wave-decider` |
| planning-delivery via subagent | `delivery-planner` |
| deciding-next-wave via subagent | `wave-decider` |

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
   - `generated_by` is `developing-application`

Track `found_agents` and `missing_agents`.

### 3. Return one of two outcomes

If `missing_agents` is non-empty, stop immediately and reply with exactly:

`Create the subagent first by running developing-application creating-delivery-agents.`

If every required agent is found, continue with the calling workflow.

## Related

- [creating-delivery-agents.md](./creating-delivery-agents.md)
- [executing-delivery.md](./executing-delivery.md)
