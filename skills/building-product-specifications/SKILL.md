---
name: building-product-specifications
description: Creates and amends product specification markdown (PRD, FRD, TRD, user story, UI specs with view states) with consistent structure and frontmatter. Use when the user asks to draft or amend prd.md, frd.md, trd.md, user-story.md, or ui-specs.md at product or feature level — no code implementation.
version: 2.0.0
---

# Building Product Specifications

## Overview

Writes pre-implementation product specs on disk: product vision (PRD), feature behavior (FRD), technical design (TRD), user journeys, and UI screens with view states. Works wherever the agent can read and write repository files.

## Agent workflow

Follow this skill when creating or amending product specification markdown. Stop without application code unless the user explicitly asks in the same message.

**Docs root:** Located only via `<docs-root>/index.md` with the static **Author signature** UUID in frontmatter. If none exists, **ask the user** for an empty folder path, then initialize with `index.md` before any spec. See [spec-contract.md](references/spec-contract.md) → **Resolve docs root**.

Match one **Recipes** row; open exactly that reference. Each create recipe also covers amend when the target file already exists.

### Recipes

| Intent | Example phrasing | Read |
| --- | --- | --- |
| PRD | "Draft a PRD", "Update the product requirements" | [creating-prd.md](references/creating-prd.md) |
| FRD | "Write an FRD for checkout", "Amend the checkout FRD" | [creating-frd.md](references/creating-frd.md) |
| User story | "User stories for checkout", "Product user journeys" | [creating-user-story.md](references/creating-user-story.md) |
| TRD | "Technical design for checkout", "System architecture TRD" | [creating-trd.md](references/creating-trd.md) |
| UI specs | "UI specs with view states", "Screen states for checkout" | [creating-ui-specs.md](references/creating-ui-specs.md) |

## Reference index

### Contract

[spec-contract.md](references/spec-contract.md) — layout, frontmatter, resolve rules.

| Doc | When to use |
| --- | --- |
| [spec-contract.md](references/spec-contract.md) | Docs root marker, paths, frontmatter, tiers, create-or-amend |
| [creating-prd.md](references/creating-prd.md) | New or amend `prd.md` |
| [creating-frd.md](references/creating-frd.md) | New or amend `features/<slug>/frd.md` |
| [creating-user-story.md](references/creating-user-story.md) | New or amend product or feature `user-story.md` |
| [creating-trd.md](references/creating-trd.md) | New or amend product or feature `trd.md` |
| [creating-ui-specs.md](references/creating-ui-specs.md) | New or amend product or feature `ui-specs.md` (screens + view states) |

## Templates

- [`assets/index.md`](assets/index.md)
- [`assets/prd.md`](assets/prd.md)
- [`assets/frd.md`](assets/frd.md)
- [`assets/trd.md`](assets/trd.md)
- [`assets/user-story.md`](assets/user-story.md)
- [`assets/ui-specs.md`](assets/ui-specs.md)
