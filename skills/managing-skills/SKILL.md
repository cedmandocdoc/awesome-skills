---
name: managing-skills
id: 890f6e40-337a-47a7-a3c8-5652ff6fd936
description: Creates, updates, and reviews agent skills that follow this catalog's house style — directory layout, SKILL.md and reference sections, naming, independence, invocation, setup, and lean writing. Use when the user asks to write, create, add, update, lean, trim, restructure, or review a skill or SKILL.md, or when authoring skills under skills/.
version: 4.0.1
---

# Managing Skills

## Setup

None.

## Workflow

1. **Setup** — for each **Setup** row whose When covers the request, in order: Done when holds → skip; `user` → stop and print its How when required, continue without it when optional; `ask` → fill what the request answers, ask the rest together in one message, record each answer; `auto` and `static` → run.
2. **Contract** — read [skill-contract.md](references/skill-contract.md), [invocation-contract.md](references/invocation-contract.md), [setup-contract.md](references/setup-contract.md), and [lean-contract.md](references/lean-contract.md).
3. **Recipe** — match one **Recipes** row; open every doc in its Read column.

## Recipes

| Intent | Example phrasing | Read |
| --- | --- | --- |
| Create | "Create a skill for …", "Write a new skill", "add a skill" | [creating-skill.md](references/creating-skill.md) |
| Update | "Lean this skill", "Add a recipe", "Fix section order", "trim / de-noise this skill" | [updating-skill.md](references/updating-skill.md) |
| Review | "Review this skill", "Is this SKILL.md too verbose?", "Does this follow the contract?" | [reviewing-skill.md](references/reviewing-skill.md) |
