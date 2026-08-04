# Creating PRD

## Overview

**Docs only.** Creates or amends `<docs-root>/prd.md`. Infra: [spec-contract.md](./spec-contract.md) → **Resolve docs root**, **Initialize docs root**, **Create or amend**, **Tier**, **No auto-spawn**.

## Prerequisites

Per [spec-contract.md](./spec-contract.md) → **Resolve docs root**.

## Guidelines

### 1. Resolve docs root

Per [spec-contract.md](./spec-contract.md) → **Resolve docs root**. Initialize when no `index.md` marker exists.

### 2. Gather context

| Source | What to extract |
| --- | --- |
| User input | Product vision, users, goals, constraints |
| `README.md`, `AGENTS.md` | Product name, existing feature names |
| Existing `prd.md` | On amend: preserve structure; apply requested changes |

Ask **at most one** clarifying question if product scope or audience is ambiguous.

### 3. Choose tier

Per [spec-contract.md](./spec-contract.md) → **Tier**.

### 4. Write or amend `prd.md`

Use [`../assets/prd.md`](../assets/prd.md) for new files. Required:

- Full YAML frontmatter per contract (`doc_type: prd`, `scope: product`)
- All template sections; omit or shorten sections per tier
- **Features** table: link each row to `features/<slug>/frd.md` only for features the user named; use TBD for planned features without FRDs yet
- **Related documents** table for product-level companions (mark TBD if not created)

On amend: [spec-contract.md](./spec-contract.md) → **Create or amend**. Preserve heading order unless the user requests restructure.

### 5. Confirm to the user

Reply with:

- Docs root path (via `index.md`), path to `prd.md`, and whether `index.md` was newly created
- One-line summary; on amend include `spec_revision` and changelog summary
- Tier used
- Suggested next docs (e.g. first FRD, product `user-story.md`, `trd.md`)

## Examples

**Create PRD (new repo):** No `index.md` → ask for empty folder → write `index.md` then `prd.md` → suggest first FRD.
