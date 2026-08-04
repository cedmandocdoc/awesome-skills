# Creating FRD

## Overview

**Docs only.** Creates or amends `<docs-root>/features/<slug>/frd.md`. Infra: [spec-contract.md](./spec-contract.md) → **Resolve docs root**, **Feature slug**, **Create or amend**, **Hub sync**, **Tier**, **Platform differences**.

## Prerequisites

Per [spec-contract.md](./spec-contract.md) → **Resolve docs root**.

## Guidelines

### 1. Resolve docs root and slug

Per [spec-contract.md](./spec-contract.md) → **Resolve docs root** and **Feature slug**. Initialize when needed.

### 2. Gather context

| Source | What to extract |
| --- | --- |
| User input | Feature behavior, rules, acceptance criteria |
| `prd.md` | Personas, product scope, feature placement — read if present |
| Existing `frd.md` | On amend: preserve structure; apply requested changes |
| Related FRDs | Adjacent features for dependency notes |

Missing `prd.md`: [spec-contract.md](./spec-contract.md) → **Upstream reading**. Ask **at most one** clarifying question if feature scope is ambiguous.

### 3. Choose tier

Per [spec-contract.md](./spec-contract.md) → **Tier**.

### 4. Write or amend `frd.md`

Use [`../assets/frd.md`](../assets/frd.md) for new files. Required:

- Frontmatter: `doc_type: frd`, `scope: feature`, `feature`, `depends_on` → `../../prd.md`
- Initialize or sync `related` with sibling paths; mark missing siblings as TBD in **Related documents**
- All template sections per tier
- Platform sections inside this file when needed

On amend: [spec-contract.md](./spec-contract.md) → **Create or amend**.

### 5. Sync hubs

Per [spec-contract.md](./spec-contract.md) → **Hub sync** (PRD feature index).

### 6. Confirm to the user

Reply with:

- Docs root path and path to `frd.md`
- One-line summary; on amend include `spec_revision`
- Suggested next docs in dependency order: `user-story.md` → `ui-specs.md` → `trd.md`

## Examples

**Create FRD:** Checkout FRD → resolve docs root → write `features/checkout/frd.md` → link from PRD feature index.
