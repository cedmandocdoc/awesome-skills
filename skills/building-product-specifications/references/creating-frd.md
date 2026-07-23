# Creating FRD

## Overview

**Docs only.** Creates or amends `<docs-root>/features/<slug>/frd.md`.

## Prerequisites

Per [spec-contract.md](./spec-contract.md) → **Resolve docs root**.

## Guidelines

### 1. Resolve docs root and slug

Per [spec-contract.md](./spec-contract.md) → **Resolve docs root**, **Finding docs root**, **Initialize docs root** (if needed), and **Feature slug**.

### 2. Gather context

| Source | What to extract |
| --- | --- |
| User input | Feature behavior, rules, acceptance criteria |
| `prd.md` | Personas, product scope, feature placement — **read if present** |
| Existing `frd.md` | On amend: preserve structure; apply requested changes |
| Related FRDs | Adjacent features for dependency notes |

If `prd.md` is missing → ask once: create PRD first, or proceed with TBD upstream references.

Ask **at most one** clarifying question if feature scope is ambiguous.

### 3. Choose tier

Per [spec-contract.md](./spec-contract.md) → **Tier**. Default: **standard**.

### 4. Write or amend `frd.md`

Use [`../assets/frd.md`](../assets/frd.md) for new files. Required:

- Frontmatter: `doc_type: frd`, `scope: feature`, `feature`, `depends_on` → `../../prd.md`
- Initialize or sync `related` with sibling paths; mark missing siblings as TBD in **Related documents**
- All template sections per tier
- Platform differences as sections inside this file when needed (see contract → **Platform differences**)

On amend: follow [spec-contract.md](./spec-contract.md) → **Create or amend** and **Spec changelog**.

Do not invent behavior unsupported by user input or PRD.

### 5. Sync PRD feature index

If `prd.md` exists → add or update the Features table row linking to this FRD. If the user did not ask to update PRD, note the suggested PRD edit in the confirmation message.

### 6. Confirm to the user

Reply with:

- Docs root path and path to `frd.md`
- One-line summary; on amend include `spec_revision`
- Suggested next docs in dependency order: `user-story.md` → `ui-specs.md` → `trd.md`

**Stop without implementing** application code.

## Examples

**Create FRD:** User asks for checkout FRD. Resolve docs root via `index.md` → write `<docs-root>/features/checkout/frd.md` → link from PRD feature index.
