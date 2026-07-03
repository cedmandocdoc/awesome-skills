---
name: managing-design
description: Creates complete visual style guides and Google Stitch handoff files from PRD/FRD, user stories, and UI specs. Use when the user wants a style guide, design.md, prompt.md, design tokens, Stitch prompt, Google Stitch handoff, or UI-spec-to-Stitch workflow.
version: 1.0.0
---

# Managing Design

Skill collection for visual styling and Google Stitch handoff. Works in any environment where the agent can read and write repository files.

## Overview

Creates visual style guides and Google Stitch handoff files (`design.md`, `prompt.md`) from PRD/FRD, user stories, and UI specs.

### Output formats

| Recipe | Output | Structure |
| --- | --- | --- |
| [creating-style-guide.md](references/creating-style-guide.md) | Standalone style guide (chat or file) | [`assets/style-guide.md`](assets/style-guide.md) — 9 sections, shadcn-oriented tokens |
| [creating-stitch-design.md](references/creating-stitch-design.md) | `design.md` on disk | [`assets/design.md`](assets/design.md) — [official Stitch DESIGN.md spec](https://stitch.withgoogle.com/docs/design-md/specification.md) |
| [creating-stitch-prompts.md](references/creating-stitch-prompts.md) | `design.md` + `prompt.md` on disk | `design.md` via creating-stitch-design; `prompt.md` = [`assets/prompt.md`](assets/prompt.md) |

**Stitch handoff flow:** style guide (internal) → `design.md` (official spec). [creating-stitch-design.md](references/creating-stitch-design.md) parses the style guide and transforms it into YAML front matter plus canonical markdown sections.

**Style guide** ([`assets/style-guide.md`](assets/style-guide.md)) — internal authoring format. Nine fixed sections, shadcn token naming. Used for chat delivery and as input to Stitch transformation.

**design.md** ([`assets/design.md`](assets/design.md)) — Google Stitch handoff format. YAML design tokens + eight canonical prose sections per the [official specification](https://stitch.withgoogle.com/docs/design-md/specification.md).

## Agent workflow

Follow this skill when creating a visual style guide; generating Google Stitch prompts from PRD/FRD, user stories, and UI specs; updating an existing Stitch handoff; or when the user asks for a design brief for Google Stitch. Match one **Recipes** row; open exactly that reference.

### Recipes

| Intent | Example phrasing | Read |
| --- | --- | --- |
| Create style guide | "style guide", "design tokens", "visual language", "token sheet" | [creating-style-guide.md](references/creating-style-guide.md) |
| Create Stitch design.md | "design.md for Stitch", "convert style guide to design.md" | [creating-stitch-design.md](references/creating-stitch-design.md) |
| Create Stitch handoff | "Stitch prompt for …", "Google Stitch handoff", "generate design.md and prompt.md" | [creating-stitch-prompts.md](references/creating-stitch-prompts.md) |
| Update Stitch handoff | "Add checkout screen to prompt", "update color tokens in design.md", "revise the Stitch prompt" | [creating-stitch-prompts.md](references/creating-stitch-prompts.md) |

## Reference index

| Doc | When to use |
| --- | --- |
| [creating-style-guide.md](references/creating-style-guide.md) | Standalone visual style guide; token conventions; parsing foreign guides |
| [creating-stitch-design.md](references/creating-stitch-design.md) | Transform style guide to official Stitch `design.md` |
| [creating-stitch-prompts.md](references/creating-stitch-prompts.md) | Full Stitch handoff — `design.md` + `prompt.md` from product specs |

## Templates

- [`assets/style-guide.md`](assets/style-guide.md) — complete visual styling guide (standalone)
- [`assets/design.md`](assets/design.md) — Stitch DESIGN.md (YAML + canonical sections)
- [`assets/prompt.md`](assets/prompt.md) — Google Stitch generation prompt with component library, screens, and build plan
