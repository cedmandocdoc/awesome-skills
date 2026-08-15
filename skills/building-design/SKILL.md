---
name: building-design
id: caa2ddd5-c78f-41af-8a9d-1af7973d08ac
description: Creates design.md visual systems (DESIGN.md format with canonical tokens) and shared application-design prompt folders for Claude Design, Google Stitch, and Figma Make from PRD/FRD, user stories, and UI specs. Use when the user wants design.md, a style guide, design tokens, visual language, design prompts, Stitch prompt, Google Stitch handoff, Figma Make prompt, Claude Design prompt, phased design prompts, or UI-spec handoff workflow.
version: 2.1.0
---

# Building Design

## Overview

Creates `design.md` (official [DESIGN.md](https://stitch.withgoogle.com/docs/design-md/specification.md) format with this skill’s token naming) and shared application-design prompt folders for Claude Design, Google Stitch, and Figma Make. One prompt set; platform differences are README adapters only.

**Default layout** (confirm paths with the user):

```text
design/
├── design.md
└── prompts/
    └── <task>/          # mvp, checkout-v2, …
        ├── README.md
        └── 01-….md …
```

## Agent workflow

Follow this skill when creating or updating `design.md`, or generating design prompts from PRD/FRD, user stories, and UI specs. Works wherever the agent can read and write repository files. Match one **Recipes** row; open exactly that reference.

### Recipes

| Intent | Example phrasing | Read |
| --- | --- | --- |
| Create or update design.md | "design.md", "style guide", "design tokens", "visual language" | [creating-design.md](references/creating-design.md) |
| Create or update design prompts | "design prompts", "Stitch prompt", "Figma Make prompt", "Claude Design prompt", "add settings screen to prompts" | [creating-design-prompts.md](references/creating-design-prompts.md) |

## Reference index

| Doc | When to use |
| --- | --- |
| [creating-design.md](references/creating-design.md) | Create or amend `design.md`; token conventions; parsing foreign guides |
| [creating-design-prompts.md](references/creating-design-prompts.md) | Shared application-design prompt folder — README adapters + screen/flow passes |

## Templates

- [`assets/design.md`](assets/design.md) — DESIGN.md (YAML + canonical sections, skill token names)
- [`assets/prompts-readme.md`](assets/prompts-readme.md) — task README with scope, chrome rules, and platform adapters
- [`assets/design-pass.md`](assets/design-pass.md) — single numbered screen/flow pass prompt
