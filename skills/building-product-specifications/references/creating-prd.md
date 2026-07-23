# Creating PRD

## Overview

**Docs only.** Creates or amends `<docs-root>/prd.md`. Stop without creating companion specs unless the user explicitly asks.

## Prerequisites

Per [spec-contract.md](./spec-contract.md) → **Resolve docs root**.

## Guidelines

### 1. Resolve docs root

Per [spec-contract.md](./spec-contract.md) → **Resolve docs root**, **Finding docs root**, and **Initialize docs root** when no `index.md` marker exists.

### 2. Gather context

| Source | What to extract |
| --- | --- |
| User input | Product vision, users, goals, constraints |
| `README.md`, `AGENTS.md` | Product name, existing feature names |
| Existing `prd.md` | On amend: preserve structure; apply requested changes |

Ask **at most one** clarifying question if product scope or audience is ambiguous.

### 3. Choose tier

Per [spec-contract.md](./spec-contract.md) → **Tier**. Default: **standard**. On amend, keep the existing tier unless the user asks to change depth.

### 4. Write or amend `prd.md`

Use [`../assets/prd.md`](../assets/prd.md) for new files. Required:

- Full YAML frontmatter per contract (`doc_type: prd`, `scope: product`)
- All template sections; omit or shorten sections per tier
- **Features** table: link each row to `features/<slug>/frd.md` only for features the user named; use TBD for planned features without FRDs yet
- **Related documents** table for product-level companions (mark TBD if not created)

On amend: follow [spec-contract.md](./spec-contract.md) → **Create or amend** and **Spec changelog**. Preserve heading order unless the user requests restructure.

Do not invent metrics, personas, or features unsupported by user input.

### 5. Confirm to the user

Reply with:

- Docs root path (via `index.md`), path to `prd.md`, and whether `index.md` was newly created
- One-line summary; on amend include `spec_revision` and changelog summary
- Tier used
- Suggested next docs (e.g. first FRD, product `user-story.md`, `trd.md`) — **do not create them**

**Stop without implementing** application code.

## Examples

**Create PRD (new repo):** No `index.md` found → ask user for an empty folder (e.g. `docs/`) → write `docs/index.md` then `docs/prd.md` → suggest first FRD; stop without auto-creating it.
