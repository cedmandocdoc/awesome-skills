---
name: building-design
id: caa2ddd5-c78f-41af-8a9d-1af7973d08ac
description: Creates design.md visual systems (DESIGN.md format with canonical tokens), static design-handoff prompt folders for Claude Design, Google Stitch, and Figma Make, and self-contained HTML screen boards (inline CSS, 1:1 viewport frames) from a screen list, screen content, states, and design.md. Use when the user wants design.md, a style guide, design tokens, visual language, design prompts, Stitch prompt, Figma Make prompt, Claude Design prompt, HTML preview, static screen board, or design handoff.
version: 2.4.0
---

# Building Design

## Overview

Creates `design.md` (official [DESIGN.md](https://stitch.withgoogle.com/docs/design-md/specification.md) format with this skill’s token naming) and static design handoffs: prompt folders for Claude Design, Google Stitch, and Figma Make, and HTML screen boards. Visual tokens live in `design.md`. Screen list, content, and states come from the user prompt; ask for any empty required Inputs. Prompts and HTML are independent renderers of those Inputs. Recipes own artifact rules; [design-contract.md](references/design-contract.md) is shared plumbing.

## Agent workflow

Follow this skill when creating or updating `design.md`, generating static design-handoff prompts, or generating HTML screen boards. Works wherever the agent can read and write repository files.

**Design root:** Locate via `<design-root>/index.md` with the static **Author signature** UUID. Default folder is `design/`. If none exists, initialize. See [design-contract.md](references/design-contract.md) → **Resolve design root**.

Match every **Recipes** row that applies; open each linked reference. When the design.md row matches, run it before prompt/preview work. When both prompt and preview rows match, fill Inputs once per [design-contract.md](references/design-contract.md) → **Fill inputs**, then run each of those recipes from its plan/write step.

### Recipes

| Intent | Example phrasing | Read |
| --- | --- | --- |
| Create or update design.md | "design.md", "style guide", "design tokens", "visual language" | [creating-design.md](references/creating-design.md) |
| Create or update design prompts | "design prompts", "Stitch prompt", "Figma Make prompt", "Claude Design prompt", "add settings screen to prompts", "prompts and HTML previews" | [creating-design-prompts.md](references/creating-design-prompts.md) |
| Create or update HTML previews | "HTML preview", "static screen board", "preview the login screen", "add settings screen to previews", "prompts and HTML previews" | [creating-design-previews.md](references/creating-design-previews.md) |

## Reference index

### Contract

[design-contract.md](references/design-contract.md) — resolve root, layout, hub sync, Inputs, viewport matrix.

| Doc | When to use |
| --- | --- |
| [design-contract.md](references/design-contract.md) | Design root marker, paths, hub sync, Inputs, viewport matrix |
| [creating-design.md](references/creating-design.md) | Create or amend `design.md`; token conventions; parsing foreign guides |
| [creating-design-prompts.md](references/creating-design-prompts.md) | Shared static-handoff prompt folder — README adapters + screen/flow passes |
| [creating-design-previews.md](references/creating-design-previews.md) | Self-contained HTML screen boards — one file per screen, 1:1 frames |

## Templates

- [`assets/index.md`](assets/index.md) — design root marker
- [`assets/design.md`](assets/design.md) — DESIGN.md (YAML + canonical sections, skill token names)
- [`assets/prompts-readme.md`](assets/prompts-readme.md) — task README with scope, chrome rules, handoff deliverable, and platform adapters
- [`assets/design-pass.md`](assets/design-pass.md) — single numbered screen/flow pass prompt
- [`assets/preview-screen.html`](assets/preview-screen.html) — one-screen HTML board (inline CSS, viewport frames)
