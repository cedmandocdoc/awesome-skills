---
name: managing-skills
id: 890f6e40-337a-47a7-a3c8-5652ff6fd936
description: Creates, updates, and reviews agent skills that follow this catalog's house style — directory layout, SKILL.md and reference sections, naming, independence, invocation, and lean writing. Use when the user asks to write, create, add, update, lean, trim, restructure, or review a skill or SKILL.md, or when authoring skills under skills/.
version: 2.2.0
---

# Managing Skills

## Overview

House style for this catalog's skills. Recipes own create, update, and review; three contracts own the rules: structure, invocation, and leanness.

## Agent workflow

Follow this skill when creating, updating, or reviewing a skill that uses this catalog's layout (`SKILL.md`, `references/`, `agents/openai.yaml`). Works wherever the agent can read and write skill directories. Match one **Recipes** row; open that reference and every contract under **Reference index** → **Contract**.

### Recipes

| Intent | Example phrasing | Read |
| --- | --- | --- |
| Create | "Create a skill for …", "Write a new skill", "add a skill" | [creating-skill.md](references/creating-skill.md) |
| Update | "Lean this skill", "Add a recipe", "Fix section order", "trim / de-noise this skill" | [updating-skill.md](references/updating-skill.md) |
| Review | "Review this skill", "Is this SKILL.md too verbose?", "Does this follow the contract?" | [reviewing-skill.md](references/reviewing-skill.md) |

## Reference index

### Contract

| Doc | Governs |
| --- | --- |
| [skill-contract.md](references/skill-contract.md) | Layout, naming, `SKILL.md` and reference sections, `agents/openai.yaml`, independence, resolve target, checklist |
| [invocation-contract.md](references/invocation-contract.md) | Loads answer, trigger wording, hard block, standing rule Setup row |
| [lean-contract.md](references/lean-contract.md) | Leanness test, finding categories, strategies, content shape |

| Doc | When to use |
| --- | --- |
| [creating-skill.md](references/creating-skill.md) | New skill directory |
| [updating-skill.md](references/updating-skill.md) | Amend structure, lean an existing skill, or both |
| [reviewing-skill.md](references/reviewing-skill.md) | Read-only contract and leanness audit |
