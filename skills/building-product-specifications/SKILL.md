---
name: building-product-specifications
id: c4912b84-e88f-4515-8c83-e99288abca07
description: Creates and amends product specification markdown — PRD, FRD, TRD, user story, and UI specs (flow, screen structure, view states) — with consistent layout and frontmatter. Use only when the user names this skill (`/building-product-specifications`, `$building-product-specifications`, or "building-product-specifications"), or references a spec file under a marked docs root (`@docs/prd.md`, `@docs/features/checkout/frd.md`) — no code implementation.
version: 2.4.0
---

# Building Product Specifications

## Setup

| Item | Kind | Required | When | Done when | How |
| --- | --- | --- | --- | --- | --- |
| Root path | ask | required | All | [spec-contract.md](references/spec-contract.md) → **Resolve docs root** finds a root | Ask for the folder, relative to the repository root, with no default (`docs/`, `product-docs/`); missing or empty → use it, else ask for another path; recorded as the root's location |
| Root marker | static | required | All | `<docs-root>/index.md` matches [spec-contract.md](references/spec-contract.md) → **Finding docs root** | Write `index.md` from [`assets/index.md`](assets/index.md) |

## Workflow

1. **Setup** — for each **Setup** row whose When covers the request, in order: Done when holds → skip; `user` → stop and print its How when required, continue without it when optional; `ask` → fill what the request answers, ask the rest together in one message, record each answer; `auto` and `static` → run.
2. **Contract** — read [spec-contract.md](references/spec-contract.md).
3. **Recipe** — match one **Recipes** row; open every doc in its Read column.

- Writes no application code unless the user asks for it in the same message.

## Recipes

| Intent | Example phrasing | Read |
| --- | --- | --- |
| Set up | "Set up building-product-specifications", "Is building-product-specifications ready?" | **Setup** — run Workflow step 1 for every row, then report each row's state |
| PRD | "Draft a PRD", "Update the product requirements" | [creating-prd.md](references/creating-prd.md) |
| FRD | "Write an FRD for checkout", "Amend the checkout FRD" | [creating-frd.md](references/creating-frd.md) |
| User story | "User stories for checkout", "Product user journeys" | [creating-user-story.md](references/creating-user-story.md) |
| TRD | "Technical design for checkout", "System architecture TRD" | [creating-trd.md](references/creating-trd.md) |
| UI specs | "UI specs for checkout", "Screen flow and structure", "View states for checkout" | [creating-ui-specs.md](references/creating-ui-specs.md) |
