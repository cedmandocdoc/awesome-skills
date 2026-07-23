---
name: building-design
description: Creates design.md visual systems (DESIGN.md format with canonical tokens) and shared application-design prompt folders for Claude Design, Google Stitch, and Figma Make from PRD/FRD, user stories, and UI specs. Use when the user wants design.md, a style guide, design tokens, visual language, design prompts, Stitch prompt, Google Stitch handoff, Figma Make prompt, Claude Design prompt, phased design prompts, or UI-spec handoff workflow.
version: 2.0.0
---

# Building Design

Skill collection for visual systems (`design.md`) and shared application-design prompt folders that run on Claude Design, Google Stitch, and Figma Make. Works in any environment where the agent can read and write repository files.

## Overview

Creates `design.md` (official [DESIGN.md](https://stitch.withgoogle.com/docs/design-md/specification.md) format with this skill’s token naming) and a common prompt task folder — screen/flow passes plus a README with short platform adapters. One prompt set; platform differences are how-to-run only.

### Output formats

| Recipe | Output | Structure |
| --- | --- | --- |
| [creating-design.md](references/creating-design.md) | `design.md` on disk | [`assets/design.md`](assets/design.md) — YAML tokens + eight canonical sections |
| [creating-design-prompts.md](references/creating-design-prompts.md) | Folder under `design/prompts/<task>/` | [`prompts-readme.md`](assets/prompts-readme.md) + numbered [`design-pass.md`](assets/design-pass.md) files |

**Default layout** (always confirm with the user; paths may change):

```text
design/
├── design.md
└── prompts/
    └── <task>/          # mvp, checkout-v2, landing-v2, …
        ├── README.md
        └── 01-….md …
```

**Visual system:** One file — `design.md`. YAML holds normative tokens; markdown body holds rationale and guardrails per the [official specification](https://stitch.withgoogle.com/docs/design-md/specification.md).

**Prompt flow:** `design.md` (required) → shared screen/flow passes. No default UI-kit or empty-shell passes. Chrome rules and component names live in the task README.

## Agent workflow

Follow this skill when creating or updating `design.md`; generating design prompts for Claude Design, Google Stitch, or Figma Make from PRD/FRD, user stories, and UI specs; or when the user asks for a style guide, design tokens, or visual language. Match one **Recipes** row; open exactly that reference.

### Recipes

| Intent | Example phrasing | Read |
| --- | --- | --- |
| Create or update design.md | "design.md", "style guide", "design tokens", "visual language" | [creating-design.md](references/creating-design.md) |
| Create design prompts | "design prompts", "Stitch prompt", "Figma Make prompt", "Claude Design prompt", "handoff for the MVP screens" | [creating-design-prompts.md](references/creating-design-prompts.md) |
| Update design prompts | "Add settings screen to prompts", "update checkout-v2 passes" | [creating-design-prompts.md](references/creating-design-prompts.md) |

## Reference index

| Doc | When to use |
| --- | --- |
| [creating-design.md](references/creating-design.md) | Create or amend `design.md`; token conventions; parsing foreign guides |
| [creating-design-prompts.md](references/creating-design-prompts.md) | Shared application-design prompt folder — README adapters + screen/flow passes |

## Templates

- [`assets/design.md`](assets/design.md) — DESIGN.md (YAML + canonical sections, skill token names)
- [`assets/prompts-readme.md`](assets/prompts-readme.md) — task README with scope, chrome rules, and platform adapters
- [`assets/design-pass.md`](assets/design-pass.md) — single numbered screen/flow pass prompt
