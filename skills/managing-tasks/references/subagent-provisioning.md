# Subagent Provisioning

## Overview

Finds, validates, and creates `task-planner`, `task-triager`, and `task-implementer` subagents across AI-assisted IDEs. Recipes that delegate work call this reference **before** launching a subagent.

## Guidelines

### Agent signature

Static UUID identifying subagents owned by this skill:

```text
a7c9e1f3-5b2d-7e9f-1a3c-5d7e9f1b3a5c
```

Every managed-tasks subagent file must include **all** of these frontmatter fields:

| Field | Value |
| --- | --- |
| `author` | `a7c9e1f3-5b2d-7e9f-1a3c-5d7e9f1b3a5c` |
| `generated_by` | `managing-tasks` |

**Match rule:** A file is a valid managed-tasks subagent when frontmatter `name` matches the required agent id **and** `author` + `generated_by` match the table above. Reuse that file. Do not create a duplicate.

**Canonical bodies:** [`../assets/agents/task-planner.md`](../assets/agents/task-planner.md), [`../assets/agents/task-implementer.md`](../assets/agents/task-implementer.md), [`../assets/agents/task-triager.md`](../assets/agents/task-triager.md). When creating or refreshing an agent, copy the matching template and write only IDE-specific frontmatter fields (see **IDE agent roots**).

### Managed subagents

| Agent id | Recipe | `readonly` | Template |
| --- | --- | --- | --- |
| `task-planner` | [creating-task.md](./creating-task.md) | `false` | [`../assets/agents/task-planner.md`](../assets/agents/task-planner.md) |
| `task-triager` | [triaging-tasks.md](./triaging-tasks.md) — execution-roadmap mode | `true` | [`../assets/agents/task-triager.md`](../assets/agents/task-triager.md) |
| `task-implementer` | [executing-task.md](./executing-task.md), [verifying-task.md](./verifying-task.md) | `false` | [`../assets/agents/task-implementer.md`](../assets/agents/task-implementer.md) |

### Provision workflow

Run once per required agent id before the first delegation in a session:

1. **Detect IDE** — infer from environment (Cursor Task tool, Claude Code Agent tool, Cline `.cline/agents/`, etc.). If unknown, use **Portable** row below.
2. **Resolve agent path** — look up the IDE row in **IDE agent roots** for `agent_root` and `filename_pattern`.
3. **Search existing** — glob `agent_root` + pattern for the required `name`. Read frontmatter; if `author` and `generated_by` match → **reuse** (skip create).
4. **Create** — if no valid match:
   - Read the template from **Managed subagents**
   - Merge IDE frontmatter (name, description, model, readonly, plus any IDE-only fields)
   - Add `author` and `generated_by` from **Agent signature**
   - Resolve `<skill-dir>` for `managing-tasks` per [task-contract.md](./task-contract.md) → **Discovering project skills**; substitute in the template body
   - Write the file to `agent_root` using the IDE filename pattern
5. **Launch** — delegate per **Launch by IDE**. If the IDE has no subagent support, run the recipe **inline** in the parent session instead of delegating.

Do not hand-edit managed subagent bodies outside the skill templates unless the user explicitly asks — refresh from the template on the next provision.

### IDE agent roots

Prefer the first existing root in this table for the detected IDE. Project-level paths win over user-level paths when both exist.

| IDE | `agent_root` (project) | Filename pattern | Required frontmatter | Common optional | Launch |
| --- | --- | --- | --- | --- | --- |
| **Cursor** | `.cursor/agents/` | `<name>.md` | `name`, `description` | `model: inherit`, `readonly`, `is_background` | Task tool — `subagent_type` = `name`; set `readonly: true` on launch when agent is read-only |
| **Claude Code** | `.claude/agents/` | `<name>.md` | `name`, `description` | `model: inherit`, `tools`, `skills` | Delegate to subagent by `name` (Agent tool / `/name`) |
| **Codex** | `.codex/agents/` | `<name>.md` | `name`, `description` | `model: inherit`, `readonly`, `is_background` | Same as Cursor |
| **Cline** | `.cline/agents/` | `<name>.md` | `name`, `description` | `providerId`, `modelId`, `cwd`, `maxIterations` | Cline subagent / plugin preset by `name` |
| **GitHub Copilot** | `.github/agents/` | `<name>.agent.md` | `description` | `name`, `model`, `tools` | Copilot agent picker or CLI `-a <name>` |
| **Gemini CLI** | `.gemini/agents/` | `<name>.md` | `name`, `description` | `model` | Gemini agent delegation when available |
| **Windsurf** | — | — | — | — | **No native subagents** — run recipe inline |
| **Antigravity** | `.agent/agents/` | `<name>.md` | `name`, `description` | `model` | Tool-specific delegation when available |
| **Continue** | — | — | — | — | **No native subagents** — use `config.yaml` rules or run inline |
| **Roo Code** | `.roo/agents/` or `.roomodes` | `<name>.md` or mode entry | `name`, `description` | `model`, tool groups | Custom mode / subagent by `name` when supported |
| **Portable** | `.agents/agents/` | `<name>.md` | `name`, `description`, `author`, `generated_by` | `model: inherit`, `readonly` | Generic Task/subagent tool when present; else inline |

**Cursor / Codex compatibility:** Cursor also reads `.claude/agents/` and `.codex/agents/`; prefer `.cursor/agents/` when running in Cursor.

**User-level fallbacks** (reuse only when project root has no valid managed agent): `~/.cursor/agents/`, `~/.claude/agents/`, `~/.codex/agents/`, `~/.copilot/agents/`.

### Launch by IDE

| IDE | Delegate `task-planner` | Delegate `task-triager` | Delegate `task-implementer` |
| --- | --- | --- | --- |
| Cursor / Codex | Task tool, prompt per [creating-multiple-tasks.md](./creating-multiple-tasks.md) §6 | Task tool, `readonly: true`, prompt per [executing-multiple-tasks.md](./executing-multiple-tasks.md) §5 | Task tool, prompt per executing-multiple-tasks §5 |
| Claude Code | Subagent `task-planner` | Subagent `task-triager`, read-only | Subagent `task-implementer` |
| Cline | Subagent preset `task-planner` | Subagent preset `task-triager` | Subagent preset `task-implementer` |
| GitHub Copilot | Agent `task-planner` | Agent `task-triager` | Agent `task-implementer` |
| Unsupported | Parent runs [creating-task.md](./creating-task.md) inline per spec | Parent runs [triaging-tasks.md](./triaging-tasks.md) execution-roadmap inline | Parent runs [executing-task.md](./executing-task.md) inline per task |

### Refresh on skill update

When `generated_by: managing-tasks` matches but the body diverges from the template (e.g. after a skill upgrade), overwrite the body from the template and preserve IDE frontmatter plus `author` / `generated_by`. Only do this during provision when the user has not customized the agent.
