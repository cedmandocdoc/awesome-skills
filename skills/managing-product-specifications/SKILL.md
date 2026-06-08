---
name: managing-product-specifications
description: Creates, updates, and reviews product specification markdown (PRD, FRD, TRD, user story, UI specs) with consistent structure, frontmatter, and monorepo app suffixes. Use when the user asks to draft, amend, or review prd.md, frd.md, trd, user-story, or ui-specs at product or feature level — no code implementation.
---

# Managing Product Specifications

Skill collection for pre-implementation product specs on disk. Works in any environment where the agent can read and write repository files.

**Contract:** [`references/spec-contract.md`](references/spec-contract.md) — layout, naming, frontmatter, inheritance, tiers.

**Rule:** Read exactly **one** recipe below for the user's intent. Do not load other recipe files unless the user switches intent mid-session.

## When to use

Follow this skill when creating, updating, or reviewing product specification markdown: PRD, FRD, TRD, user story, or UI specs — at product level (`docs/`) or feature level (`docs/features/<slug>/`). No application code unless the user explicitly asks in the same message.

## Spec recipes

| Doc | Create | Update | Review |
| --- | --- | --- | --- |
| **PRD** | [creating-prd.md](references/creating-prd.md) | [updating-prd.md](references/updating-prd.md) | [reviewing-prd.md](references/reviewing-prd.md) |
| **FRD** | [creating-frd.md](references/creating-frd.md) | [updating-frd.md](references/updating-frd.md) | [reviewing-frd.md](references/reviewing-frd.md) |
| **TRD** | [creating-trd.md](references/creating-trd.md) | [updating-trd.md](references/updating-trd.md) | [reviewing-trd.md](references/reviewing-trd.md) |
| **User story** | [creating-user-story.md](references/creating-user-story.md) | [updating-user-story.md](references/updating-user-story.md) | [reviewing-user-story.md](references/reviewing-user-story.md) |
| **UI specs** | [creating-ui-specs.md](references/creating-ui-specs.md) | [updating-ui-specs.md](references/updating-ui-specs.md) | [reviewing-ui-specs.md](references/reviewing-ui-specs.md) |

Load this skill when intent matches any cell, whether the user @-mentions the skill or describes the work in natural language.

**Path resolution:** Product companions (`docs/trd-web.md`, `docs/ui-specs.md`, …) and feature companions (`docs/features/<slug>/trd-api.md`, …) use the same recipe; scope and path come from [spec-contract.md](references/spec-contract.md).

## Reference index

| Doc | When to use |
| --- | --- |
| [spec-contract.md](references/spec-contract.md) | Paths, naming, frontmatter, inheritance, tiers, finding specs |
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

- [`assets/prd.md`](assets/prd.md)
- [`assets/frd.md`](assets/frd.md)
- [`assets/trd.md`](assets/trd.md)
- [`assets/user-story.md`](assets/user-story.md)
- [`assets/ui-specs.md`](assets/ui-specs.md)

## Examples

**Create PRD:** User asks for a PRD for a business app. Follow [creating-prd.md](references/creating-prd.md) → write `docs/prd.md` → suggest `ui-specs.md` or first FRD; do not auto-create them.

**Create FRD:** User asks for checkout FRD (web + api). Follow [creating-frd.md](references/creating-frd.md) → write `docs/features/checkout/frd.md` with `apps: [web, api]` → link from PRD feature index.

**Create feature TRD:** User asks for checkout web TRD. Follow [creating-trd.md](references/creating-trd.md) → read `frd.md` and `docs/trd-web.md` → write `docs/features/checkout/trd-web.md`.

**Update FRD:** User adds acceptance criteria. Follow [updating-frd.md](references/updating-frd.md) → bump `spec_revision` → note downstream user-story / TRD docs that may need review.

**Review UI specs:** User asks to review `ui-specs-mobile.md`. Follow [reviewing-ui-specs.md](references/reviewing-ui-specs.md) → checklist → structured feedback; no file mutations.
