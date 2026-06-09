---
name: managing-design
description: Creates complete visual style guides and Google Stitch handoff files from PRD/FRD, user stories, and UI specs. Use when the user wants a style guide, design.md, prompt.md, design tokens, Stitch prompt, Google Stitch handoff, or UI-spec-to-Stitch workflow.
---

# Managing Design

Skill collection for visual styling and Google Stitch handoff. Works in any environment where the agent can read and write repository files.

**Rule:** Read exactly **one** recipe below for the user's intent. Do not load other recipe files unless the user switches intent mid-session.

## Scope

Two recipes, one shared style guide structure:

| Recipe | Output | Structure |
| --- | --- | --- |
| [creating-style-guide.md](references/creating-style-guide.md) | Standalone style guide (chat or file) | [`assets/style-guide.md`](assets/style-guide.md) — 9 sections |
| [creating-stitch-prompts.md](references/creating-stitch-prompts.md) | `design.md` + `prompt.md` on disk | `design.md` = style guide via creating-style-guide; `prompt.md` = [`assets/prompt.md`](assets/prompt.md) |

`design.md` is not a separate document type — it is the filled [`style-guide.md`](assets/style-guide.md) template written to disk for Stitch.

## When to use

Follow this skill when creating a visual style guide; generating Google Stitch prompts from PRD/FRD, user stories, and UI specs; updating an existing Stitch handoff; or when the user asks for a design brief for Google Stitch.

## Design recipes

| Intent | Example phrasing | Read |
| --- | --- | --- |
| Create style guide | "style guide", "design tokens", "visual language", "token sheet" | [creating-style-guide.md](references/creating-style-guide.md) |
| Create Stitch handoff | "Stitch prompt for …", "Google Stitch handoff", "generate design.md and prompt.md" | [creating-stitch-prompts.md](references/creating-stitch-prompts.md) |
| Update Stitch handoff | "Add checkout screen to prompt", "update color tokens in design.md", "revise the Stitch prompt" | [creating-stitch-prompts.md](references/creating-stitch-prompts.md) |

Load this skill when intent matches any row, whether the user @-mentions the skill or describes the work in natural language.

## Style guide structure

[`assets/style-guide.md`](assets/style-guide.md) defines the single canonical structure:

1. Visual Theme & Atmosphere
2. Color Palette & Roles
3. Typography
4. Spacing
5. Grid
6. Alignment & Density
7. Depth & Elevation
8. Roundness
9. Breakpoints & Responsive Behavior

Token naming, parsing custom guides, and default values live in [creating-style-guide.md](references/creating-style-guide.md).

## Templates

- [`assets/style-guide.md`](assets/style-guide.md) — complete visual styling guide (standalone or `design.md`)
- [`assets/prompt.md`](assets/prompt.md) — Google Stitch generation prompt with component library, screens, and build plan

## Examples

**Style guide:** User asks for design tokens and visual direction. Follow [creating-style-guide.md](references/creating-style-guide.md) → normalize any foreign guide to canonical tokens → output copiable markdown in chat (or write a file if asked).

**Create:** User shares PRD, user story, and UI specs and asks for a Google Stitch handoff. Follow [creating-stitch-prompts.md](references/creating-stitch-prompts.md) → generate `design.md` via [creating-style-guide.md](references/creating-style-guide.md) → generate `prompt.md` → write both to `stitch/<feature-slug>/`.

**Update:** User says "add mobile variant to the settings screen in prompt." Follow [creating-stitch-prompts.md](references/creating-stitch-prompts.md) → read existing files at agreed path → apply changes → overwrite same files.
