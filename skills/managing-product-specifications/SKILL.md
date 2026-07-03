---
name: managing-product-specifications
description: Creates, updates, and reviews product specification markdown (PRD, FRD, TRD, user story, UI specs) with consistent structure, frontmatter, and monorepo app suffixes. Use when the user asks to draft, amend, or review prd.md, frd.md, trd, user-story, or ui-specs at product or feature level — no code implementation.
version: 1.0.0
---

# Managing Product Specifications

## Overview

Skill collection for pre-implementation product specs on disk. Works in any environment where the agent can read and write repository files.

**Contract:** [`references/spec-contract.md`](references/spec-contract.md) — layout, naming, frontmatter, inheritance, tiers.

## Agent workflow

Follow this skill when creating, updating, or reviewing product specification markdown: PRD, FRD, TRD, user story, or UI specs — at product level (`<docs-root>/`) or feature level (`<docs-root>/features/<slug>/`). Stop without application code unless the user explicitly asks in the same message.

**Docs root:** Located only via `<docs-root>/index.md` with the static **Author signature** UUID in frontmatter. If none exists, **ask the user** for an empty folder path, then initialize with `index.md` before any spec. See [spec-contract.md](references/spec-contract.md) → **Resolve docs root**.

Match one **Recipes** cell; open exactly that reference.

### Recipes

| Doc | Create | Update | Review |
| --- | --- | --- | --- |
| **PRD** | [creating-prd.md](references/creating-prd.md) | [updating-prd.md](references/updating-prd.md) | [reviewing-prd.md](references/reviewing-prd.md) |
| **FRD** | [creating-frd.md](references/creating-frd.md) | [updating-frd.md](references/updating-frd.md) | [reviewing-frd.md](references/reviewing-frd.md) |
| **TRD** | [creating-trd.md](references/creating-trd.md) | [updating-trd.md](references/updating-trd.md) | [reviewing-trd.md](references/reviewing-trd.md) |
| **User story** | [creating-user-story.md](references/creating-user-story.md) | [updating-user-story.md](references/updating-user-story.md) | [reviewing-user-story.md](references/reviewing-user-story.md) |
| **UI specs** | [creating-ui-specs.md](references/creating-ui-specs.md) | [updating-ui-specs.md](references/updating-ui-specs.md) | [reviewing-ui-specs.md](references/reviewing-ui-specs.md) |

**Path resolution:** Product companions (`<docs-root>/trd-web.md`, …) and feature companions (`<docs-root>/features/<slug>/trd-api.md`, …) use the same recipe; `<docs-root>` comes from [spec-contract.md](references/spec-contract.md) → **Finding docs root**.

## Reference index

### Contract

[spec-contract.md](references/spec-contract.md) — layout, frontmatter, resolve rules.

| Doc | When to use |
| --- | --- |
| [spec-contract.md](references/spec-contract.md) | Docs root `index.md` marker, author UUID, paths, naming, frontmatter, inheritance, tiers |
| [creating-prd.md](references/creating-prd.md) | New `prd.md` |
| [updating-prd.md](references/updating-prd.md) | Amend `prd.md`; sync feature index |
| [reviewing-prd.md](references/reviewing-prd.md) | Read-only PRD review |
| [creating-frd.md](references/creating-frd.md) | New `features/<slug>/frd.md` hub |
| [updating-frd.md](references/updating-frd.md) | Amend FRD; sync `related` and PRD index |
| [reviewing-frd.md](references/reviewing-frd.md) | Read-only FRD review |
| [creating-trd.md](references/creating-trd.md) | New product or feature TRD (`trd.md`, `trd-<app>.md`) |
| [updating-trd.md](references/updating-trd.md) | Amend TRD; flag downstream drift |
| [reviewing-trd.md](references/reviewing-trd.md) | Read-only TRD review |
| [creating-user-story.md](references/creating-user-story.md) | New product or feature user story |
| [updating-user-story.md](references/updating-user-story.md) | Amend user story |
| [reviewing-user-story.md](references/reviewing-user-story.md) | Read-only user story review |
| [creating-ui-specs.md](references/creating-ui-specs.md) | New product or feature UI specs |
| [updating-ui-specs.md](references/updating-ui-specs.md) | Amend UI specs |
| [reviewing-ui-specs.md](references/reviewing-ui-specs.md) | Read-only UI specs review |

## Templates

- [`assets/index.md`](assets/index.md)
- [`assets/prd.md`](assets/prd.md)
- [`assets/frd.md`](assets/frd.md)
- [`assets/trd.md`](assets/trd.md)
- [`assets/user-story.md`](assets/user-story.md)
- [`assets/ui-specs.md`](assets/ui-specs.md)
