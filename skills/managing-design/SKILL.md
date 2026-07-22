---
name: managing-design
description: Creates visual style guides, Google Stitch handoff files, Figma Make showcase prompts, and Claude Design phased prompt folders from PRD/FRD, user stories, and UI specs. Use when the user wants a style guide, design.md, prompt.md, design tokens, Stitch prompt, Google Stitch handoff, Figma Make prompt, Figma showcase, Claude Design prompt, Claude Design handoff, Claude Design guide, phased design prompts, or UI-spec handoff workflow.
version: 1.1.0
---

# Managing Design

Skill collection for visual styling, Google Stitch handoff, Figma Make showcase prompts, and Claude Design phased pass folders. Works in any environment where the agent can read and write repository files.

## Overview

Creates visual style guides, Google Stitch handoff files (`design.md`, `prompt.md`), self-contained Figma Make showcase prompts, and ordered Claude Design prompt folders from PRD/FRD, user stories, and UI specs.

### Output formats

| Recipe | Output | Structure |
| --- | --- | --- |
| [creating-style-guide.md](references/creating-style-guide.md) | Standalone style guide (chat or file) | [`assets/style-guide.md`](assets/style-guide.md) — 9 sections, shadcn-oriented tokens |
| [creating-stitch-design.md](references/creating-stitch-design.md) | `design.md` on disk | [`assets/design.md`](assets/design.md) — [official Stitch DESIGN.md spec](https://stitch.withgoogle.com/docs/design-md/specification.md) |
| [creating-stitch-prompts.md](references/creating-stitch-prompts.md) | `design.md` + `prompt.md` on disk | `design.md` via creating-stitch-design; `prompt.md` = [`assets/prompt.md`](assets/prompt.md) |
| [creating-figma-showcase-prompt.md](references/creating-figma-showcase-prompt.md) | Figma Make prompt on disk | [`assets/figma-showcase-prompt.md`](assets/figma-showcase-prompt.md) — self-contained; Components + Screens pages |
| [creating-claude-design-prompts.md](references/creating-claude-design-prompts.md) | Folder under `design/prompts/claude-design/<slug>/` | Guide + `00-design-system` + numbered pass files from [`claude-design-guide.md`](assets/claude-design-guide.md) / [`claude-design-pass.md`](assets/claude-design-pass.md) |

**Stitch handoff flow:** style guide (internal) → `design.md` (official spec). [creating-stitch-design.md](references/creating-stitch-design.md) parses the style guide and transforms it into YAML front matter plus canonical markdown sections.

**Figma showcase flow:** style guide (required) → self-contained prompt with embedded design system. [creating-figma-showcase-prompt.md](references/creating-figma-showcase-prompt.md) produces one file for Figma Make — Components page + Screens page, strict build order.

**Claude Design flow:** style guide (required) → ordered pass folder (system → kit → shells → screens). [creating-claude-design-prompts.md](references/creating-claude-design-prompts.md) produces a multi-file handoff for conversational, design-system-first generation — not one megaprompt.

**Style guide** ([`assets/style-guide.md`](assets/style-guide.md)) — internal authoring format. Nine fixed sections, shadcn token naming. Used for chat delivery and as input to Stitch transformation and Claude Design / Figma embeds.

**design.md** ([`assets/design.md`](assets/design.md)) — Google Stitch handoff format. YAML design tokens + eight canonical prose sections per the [official specification](https://stitch.withgoogle.com/docs/design-md/specification.md).

## Agent workflow

Follow this skill when creating a visual style guide; generating Google Stitch, Figma Make, or Claude Design handoffs from PRD/FRD, user stories, and UI specs; updating an existing handoff; or when the user asks for a design brief for Stitch, Figma Make, or Claude Design. Match one **Recipes** row; open exactly that reference.

### Recipes

| Intent | Example phrasing | Read |
| --- | --- | --- |
| Create style guide | "style guide", "design tokens", "visual language", "token sheet" | [creating-style-guide.md](references/creating-style-guide.md) |
| Create Stitch design.md | "design.md for Stitch", "convert style guide to design.md" | [creating-stitch-design.md](references/creating-stitch-design.md) |
| Create Stitch handoff | "Stitch prompt for …", "Google Stitch handoff", "generate design.md and prompt.md" | [creating-stitch-prompts.md](references/creating-stitch-prompts.md) |
| Update Stitch handoff | "Add checkout screen to prompt", "update color tokens in design.md", "revise the Stitch prompt" | [creating-stitch-prompts.md](references/creating-stitch-prompts.md) |
| Create Figma showcase prompt | "Figma Make prompt", "Figma showcase", "full screen handoff for Figma" | [creating-figma-showcase-prompt.md](references/creating-figma-showcase-prompt.md) |
| Update Figma showcase prompt | "Add settings screen to Figma prompt", "update Figma handoff" | [creating-figma-showcase-prompt.md](references/creating-figma-showcase-prompt.md) |
| Create Claude Design prompts | "Claude Design prompt", "Claude Design handoff", "Claude Design guide", "phased design prompts" | [creating-claude-design-prompts.md](references/creating-claude-design-prompts.md) |
| Update Claude Design prompts | "Add settings screen to Claude Design passes", "update Claude Design handoff" | [creating-claude-design-prompts.md](references/creating-claude-design-prompts.md) |

## Reference index

| Doc | When to use |
| --- | --- |
| [creating-style-guide.md](references/creating-style-guide.md) | Standalone visual style guide; token conventions; parsing foreign guides |
| [creating-stitch-design.md](references/creating-stitch-design.md) | Transform style guide to official Stitch `design.md` |
| [creating-stitch-prompts.md](references/creating-stitch-prompts.md) | Full Stitch handoff — `design.md` + `prompt.md` from product specs |
| [creating-figma-showcase-prompt.md](references/creating-figma-showcase-prompt.md) | Self-contained Figma Make prompt — component library + full screens from style guide and product specs |
| [creating-claude-design-prompts.md](references/creating-claude-design-prompts.md) | Ordered Claude Design pass folder — design system, UI kit, shells, feature screens |

## Templates

- [`assets/style-guide.md`](assets/style-guide.md) — complete visual styling guide (standalone)
- [`assets/design.md`](assets/design.md) — Stitch DESIGN.md (YAML + canonical sections)
- [`assets/prompt.md`](assets/prompt.md) — Google Stitch generation prompt with component library, screens, and build plan
- [`assets/figma-showcase-prompt.md`](assets/figma-showcase-prompt.md) — Figma Make showcase prompt with embedded design system, two-page structure, and build plan
- [`assets/claude-design-guide.md`](assets/claude-design-guide.md) — Claude Design folder index / how-to-run guide
- [`assets/claude-design-pass.md`](assets/claude-design-pass.md) — single numbered Claude Design pass prompt
