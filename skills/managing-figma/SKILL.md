---
name: managing-figma
description: Creates Figma Make handoff prompts and related Figma design workflows from UI specifications and style guides. Use when the user wants a Figma Make prompt, design handoff brief, UI-spec-to-Figma prompt, or follow-up updates to an existing handoff prompt.
---

# Managing Figma

Skill collection for Figma design handoff and prompt workflows on disk. Works in any environment where the agent can read and write repository files.

**Rule:** Read exactly **one** recipe below for the user's intent. Do not load other recipe files unless the user switches intent mid-session.

## When to use

Follow this skill when generating Figma Make prompts from UI specs and style guides, updating an existing handoff prompt, or when the user asks for a design handoff brief for Figma Make.

## Figma recipes

| Intent | Example phrasing | Read |
| --- | --- | --- |
| Create handoff prompt | "Figma Make prompt for …", "handoff brief from UI spec", "generate design prompt" | [creating-figma-make-handoff-prompts.md](references/creating-figma-make-handoff-prompts.md) |
| Update handoff prompt | "Add mobile variant to step 5", "update Screens page", "revise the Figma prompt" | [creating-figma-make-handoff-prompts.md](references/creating-figma-make-handoff-prompts.md) |

Load this skill when intent matches either row, whether the user @-mentions the skill or describes the work in natural language.

## Reference index

| Doc | When to use |
| --- | --- |
| [creating-figma-make-handoff-prompts.md](references/creating-figma-make-handoff-prompts.md) | Generate or update a Figma Make handoff prompt markdown file from UI spec + style guide |

## Templates

- [`assets/prompt.md`](assets/prompt.md)

## Examples

**Create:** User shares a UI spec and style guide and asks for a Figma Make prompt. Follow [creating-figma-make-handoff-prompts.md](references/creating-figma-make-handoff-prompts.md) → confirm delivery path → fill [`assets/prompt.md`](assets/prompt.md) → write `figma-make-prompts/<feature-slug>/prompt.md`.

**Update:** User says "add mobile variant to step 5 in the register prompt." Follow [creating-figma-make-handoff-prompts.md](references/creating-figma-make-handoff-prompts.md) → read existing file at agreed path → apply changes → overwrite same file.
