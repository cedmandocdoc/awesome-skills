---
name: managing-documentation
description: Creates and reviews Markdown and AI-facing documentation (skills, rules, AGENTS.md) for clarity, structure, style, and formatting. Use when writing or editing .md files, reviewing doc PRs, authoring SKILL.md or rules, or when the user asks whether documentation is well written or needs improvement.
---

# Managing Documentation

Skill collection for authoring and reviewing project documentation. Works in any environment where the agent can read and write repository files.

**Rule:** Read exactly **one** recipe below for the user's intent. Do not load other recipe files unless the user switches intent mid-session.

## When to use

Follow this skill when creating or updating Markdown docs, skills (`SKILL.md`), rules, `AGENTS.md`, or similar instructional content — or when reviewing those docs for quality before merge or publication.

## Documentation recipes

| Intent | Example phrasing | Read |
| --- | --- | --- |
| Create | "Write docs for …", "Draft a skill", "Update the README section on …" | [creating-documentation.md](references/creating-documentation.md) |
| Review | "Review this doc", "Is this well written?", "Doc PR feedback" | [reviewing-documentation.md](references/reviewing-documentation.md) |

Load this skill when intent matches either row, whether the user @-mentions the skill or describes the work in natural language.

## Reference index

| Doc | When to use |
| --- | --- |
| [creating-documentation.md](references/creating-documentation.md) | New or updated docs; template-first workflow; style, formatting, and skill/rule conventions |
| [reviewing-documentation.md](references/reviewing-documentation.md) | Read-only review with checklist and structured feedback against creating-documentation standards |

## Examples

**Create:** User asks to document a new API endpoint. Follow [creating-documentation.md](references/creating-documentation.md) → propose outline if no template → draft concise reference with backticks on paths and commands.

**Review:** User pastes a skill draft and asks if it reads well. Follow [reviewing-documentation.md](references/reviewing-documentation.md) → run checklist → deliver Summary / Strengths / Issues / Suggested next steps.

**Review (scoped):** User shares a doc PR diff. Follow [reviewing-documentation.md](references/reviewing-documentation.md) → review changed sections plus consistency with surrounding content unless the user asks for a full-doc pass.
