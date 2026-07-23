---
name: managing-design
description: Creates design.md visual systems (DESIGN.md format with canonical tokens), Google Stitch handoff files, Figma Make showcase prompts, and Claude Design phased prompt folders from PRD/FRD, user stories, and UI specs. Use when the user wants design.md, a style guide, design tokens, visual language, prompt.md, Stitch prompt, Google Stitch handoff, Figma Make prompt, Figma showcase, Claude Design prompt, Claude Design handoff, Claude Design guide, phased design prompts, or UI-spec handoff workflow.
version: 1.2.0
---

# Managing Design

Skill collection for visual systems (`design.md`), Google Stitch handoff, Figma Make showcase prompts, and Claude Design phased pass folders. Works in any environment where the agent can read and write repository files.

## Overview

Creates `design.md` (official [DESIGN.md](https://stitch.withgoogle.com/docs/design-md/specification.md) format with this skill’s token naming), Google Stitch handoff files (`design.md` + `prompt.md`), self-contained Figma Make showcase prompts, and ordered Claude Design prompt folders from PRD/FRD, user stories, and UI specs.

### Output formats

| Recipe | Output | Structure |
| --- | --- | --- |
| [creating-design.md](references/creating-design.md) | `design.md` on disk | [`assets/design.md`](assets/design.md) — YAML tokens + eight canonical sections |
| [creating-stitch-prompts.md](references/creating-stitch-prompts.md) | `design.md` + `prompt.md` on disk | `design.md` via creating-design; `prompt.md` = [`assets/prompt.md`](assets/prompt.md) |
| [creating-figma-showcase-prompt.md](references/creating-figma-showcase-prompt.md) | Figma Make prompt on disk | [`assets/figma-showcase-prompt.md`](assets/figma-showcase-prompt.md) — self-contained; Components + Screens pages |
| [creating-claude-design-prompts.md](references/creating-claude-design-prompts.md) | Folder under `design/prompts/claude-design/<slug>/` | Guide + `00-design-system` + numbered pass files from [`claude-design-guide.md`](assets/claude-design-guide.md) / [`claude-design-pass.md`](assets/claude-design-pass.md) |

**Visual system:** One file — `design.md`. YAML holds normative tokens (shadcn colors, `text-*`, `space-*`, `radius-*`); markdown body holds rationale, elevation, breakpoints, motion, and guardrails per the [official specification](https://stitch.withgoogle.com/docs/design-md/specification.md).

**Stitch handoff flow:** `design.md` → `prompt.md`. [creating-stitch-prompts.md](references/creating-stitch-prompts.md) generates or updates both.

**Figma showcase flow:** `design.md` (required) → self-contained prompt with embedded design system.

**Claude Design flow:** `design.md` (required) → ordered pass folder (system → kit → shells → screens).

## Agent workflow

Follow this skill when creating or updating `design.md`; generating Google Stitch, Figma Make, or Claude Design handoffs from PRD/FRD, user stories, and UI specs; or when the user asks for a style guide, design tokens, or visual language. Match one **Recipes** row; open exactly that reference.

### Recipes

| Intent | Example phrasing | Read |
| --- | --- | --- |
| Create or update design.md | "design.md", "style guide", "design tokens", "visual language" | [creating-design.md](references/creating-design.md) |
| Create Stitch handoff | "Stitch prompt for …", "Google Stitch handoff", "generate design.md and prompt.md" | [creating-stitch-prompts.md](references/creating-stitch-prompts.md) |
| Update Stitch handoff | "Add checkout screen to prompt", "update color tokens in design.md", "revise the Stitch prompt" | [creating-stitch-prompts.md](references/creating-stitch-prompts.md) |
| Create Figma showcase prompt | "Figma Make prompt", "Figma showcase", "full screen handoff for Figma" | [creating-figma-showcase-prompt.md](references/creating-figma-showcase-prompt.md) |
| Update Figma showcase prompt | "Add settings screen to Figma prompt", "update Figma handoff" | [creating-figma-showcase-prompt.md](references/creating-figma-showcase-prompt.md) |
| Create Claude Design prompts | "Claude Design prompt", "Claude Design handoff", "Claude Design guide", "phased design prompts" | [creating-claude-design-prompts.md](references/creating-claude-design-prompts.md) |
| Update Claude Design prompts | "Add settings screen to Claude Design passes", "update Claude Design handoff" | [creating-claude-design-prompts.md](references/creating-claude-design-prompts.md) |

## Reference index

| Doc | When to use |
| --- | --- |
| [creating-design.md](references/creating-design.md) | Create or amend `design.md`; token conventions; parsing foreign guides |
| [creating-stitch-prompts.md](references/creating-stitch-prompts.md) | Full Stitch handoff — `design.md` + `prompt.md` from product specs |
| [creating-figma-showcase-prompt.md](references/creating-figma-showcase-prompt.md) | Self-contained Figma Make prompt — component library + full screens |
| [creating-claude-design-prompts.md](references/creating-claude-design-prompts.md) | Ordered Claude Design pass folder — design system, UI kit, shells, feature screens |

## Templates

- [`assets/design.md`](assets/design.md) — DESIGN.md (YAML + canonical sections, skill token names)
- [`assets/prompt.md`](assets/prompt.md) — Google Stitch generation prompt with component library, screens, and build plan
- [`assets/figma-showcase-prompt.md`](assets/figma-showcase-prompt.md) — Figma Make showcase prompt with embedded design system, two-page structure, and build plan
- [`assets/claude-design-guide.md`](assets/claude-design-guide.md) — Claude Design folder index / how-to-run guide
- [`assets/claude-design-pass.md`](assets/claude-design-pass.md) — single numbered Claude Design pass prompt
