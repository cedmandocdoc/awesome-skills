---
name: managing-skills
id: 890f6e40-337a-47a7-a3c8-5652ff6fd936
description: Creates, updates, and reviews agent skills that follow this catalog's house style — directory layout, SKILL.md and reference sections, naming, independence, and lean writing. Use when the user asks to write, create, add, update, lean, trim, restructure, or review a skill or SKILL.md, or when authoring skills under skills/.
version: 2.1.0
---

# Managing Skills

## Overview

House style for this catalog's skills: contract layout and lean writing. Recipes own create, update, and review; [skill-contract.md](references/skill-contract.md) is structure; [lean-contract.md](references/lean-contract.md) is the leanness test.

## Agent workflow

Follow this skill when creating, updating, or reviewing a skill that uses this catalog's layout (`SKILL.md`, `references/`, `agents/openai.yaml`). Works wherever the agent can read and write skill directories. Match one **Recipes** row; open that reference, [skill-contract.md](references/skill-contract.md), and [lean-contract.md](references/lean-contract.md).

### Recipes

| Intent | Example phrasing | Read |
| --- | --- | --- |
| Create | "Create a skill for …", "Write a new skill", "add a skill" | [creating-skill.md](references/creating-skill.md) |
| Update | "Lean this skill", "Add a recipe", "Fix section order", "trim / de-noise this skill" | [updating-skill.md](references/updating-skill.md) |
| Review | "Review this skill", "Is this SKILL.md too verbose?", "Does this follow the contract?" | [reviewing-skill.md](references/reviewing-skill.md) |

## Reference index

### Contract

[skill-contract.md](references/skill-contract.md) — layout, naming, `SKILL.md` and reference sections, independence, checklist. [lean-contract.md](references/lean-contract.md) — finding categories, strategies, content shape.

| Doc | When to use |
| --- | --- |
| [skill-contract.md](references/skill-contract.md) | Layout, naming, sections, independence, resolve target, checklist |
| [lean-contract.md](references/lean-contract.md) | Leanness test, finding categories, strategies, content shape |
| [creating-skill.md](references/creating-skill.md) | New skill directory; authoring mode |
| [updating-skill.md](references/updating-skill.md) | Amend structure, lean an existing skill, or both |
| [reviewing-skill.md](references/reviewing-skill.md) | Read-only contract and leanness audit |
