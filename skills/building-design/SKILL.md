---
name: building-design
id: caa2ddd5-c78f-41af-8a9d-1af7973d08ac
description: Creates design.md visual systems (DESIGN.md format with canonical tokens), static design-handoff prompt folders for Claude Design, Google Stitch, and Figma Make, and self-contained HTML screen boards (inline CSS, 1:1 viewport frames) from PRD/FRD, user stories, and UI specs. Use when the user wants design.md, a style guide, design tokens, visual language, design prompts, Stitch prompt, Figma Make prompt, Claude Design prompt, HTML preview, static screen board, design handoff, or UI-spec handoff workflow.
version: 2.2.0
---

# Building Design

## Overview

Creates `design.md` (official [DESIGN.md](https://stitch.withgoogle.com/docs/design-md/specification.md) format with this skill’s token naming) and static design handoffs: prompt folders for Claude Design, Google Stitch, and Figma Make, and HTML screen boards. Visual tokens live in `design.md`; screens and states live in product specs. Prompts and HTML are independent renderers of those sources. [handoff-contract.md](references/handoff-contract.md) is the shared board contract.

**Default layout** (confirm paths with the user):

```text
design/
├── design.md
├── prompts/
│   └── <task>/          # mvp, checkout-v2, …
│       ├── README.md
│       └── 01-….md …
└── previews/
    └── <task>/
        └── <screen>.html …   # login.html, home.html
```

## Agent workflow

Follow this skill when creating or updating `design.md`, generating static design-handoff prompts, or generating HTML screen boards from PRD/FRD, user stories, and UI specs. Works wherever the agent can read and write repository files. Match one **Recipes** row; open exactly that reference.

### Recipes

| Intent | Example phrasing | Read |
| --- | --- | --- |
| Create or update design.md | "design.md", "style guide", "design tokens", "visual language" | [creating-design.md](references/creating-design.md) |
| Create or update design prompts | "design prompts", "Stitch prompt", "Figma Make prompt", "Claude Design prompt", "add settings screen to prompts" | [creating-design-prompts.md](references/creating-design-prompts.md) |
| Create or update HTML previews | "HTML preview", "static screen board", "preview the login screen", "add settings screen to previews" | [creating-design-previews.md](references/creating-design-previews.md) |

## Reference index

### Contract

[handoff-contract.md](references/handoff-contract.md) — static board rules, sources of truth, viewport matrix, paths. Required by the prompt and preview recipes.

| Doc | When to use |
| --- | --- |
| [handoff-contract.md](references/handoff-contract.md) | Shared handoff rules; sources; paths |
| [creating-design.md](references/creating-design.md) | Create or amend `design.md`; token conventions; parsing foreign guides |
| [creating-design-prompts.md](references/creating-design-prompts.md) | Shared static-handoff prompt folder — README adapters + screen/flow passes |
| [creating-design-previews.md](references/creating-design-previews.md) | Self-contained HTML screen boards — one file per screen, 1:1 frames |

## Templates

- [`assets/design.md`](assets/design.md) — DESIGN.md (YAML + canonical sections, skill token names)
- [`assets/prompts-readme.md`](assets/prompts-readme.md) — task README with scope, chrome rules, handoff deliverable, and platform adapters
- [`assets/design-pass.md`](assets/design-pass.md) — single numbered screen/flow pass prompt
- [`assets/preview-screen.html`](assets/preview-screen.html) — one-screen HTML board (inline CSS, viewport frames)
