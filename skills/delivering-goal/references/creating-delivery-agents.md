# Creating Delivery Agents

## Overview

**Docs only.** Creates or refreshes `delivering-goal` delivery-agent files when the user explicitly asks to run `delivering-goal creating-delivery-agents`.

Do not invoke this flow implicitly from orchestration references.

## Prerequisites

Per [goal-contract.md](./goal-contract.md) → **Discovering project skills** to resolve `<skill-dir>` and read canonical templates.

## Guidelines

### Agent signature

Every created or refreshed delivery-agent file must include:

| Field | Value |
| --- | --- |
| `author` | `d4a6b8c0-5e3f-7a9b-1c2d-6f8e0a3b5c7d` |
| `generated_by` | `delivering-goal` |

### Managed delivery agents

| Agent id | `readonly` | Canonical template |
| --- | --- | --- |
| `delivery-planner` | `false` | [`../assets/agents/delivery-planner.md`](../assets/agents/delivery-planner.md) |
| `phase-decider` | `false` | [`../assets/agents/phase-decider.md`](../assets/agents/phase-decider.md) |

### 1. Detect IDE and target root

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

For each managed delivery-agent id:

1. Resolve destination path from the IDE filename pattern.
2. Read canonical body from the matching template.
3. Write frontmatter required by the IDE (`name`, `description`, model fields when needed), then append:
   - `author: d4a6b8c0-5e3f-7a9b-1c2d-6f8e0a3b5c7d`
   - `generated_by: delivering-goal`
4. Preserve user-customized non-contract fields only when they do not conflict with required fields.
5. If an existing managed file body diverges from template and the file is not user-customized, refresh from template.

### 3. Confirm to the user

Reply with:

- Target agent root used
- Created / refreshed / skipped files (with reason)

End with:

`Delivery agents are ready. Also ensure managing-tasks task agents exist (managing-tasks creating-task-agents). Re-run the original delivering-goal command.`

## Related

- [finding-delivery-agents.md](./finding-delivery-agents.md)
- [delivering-goal.md](./delivering-goal.md)
