# Creating PRD

## Overview

**Docs only.** Writes `<docs-root>/prd.md`. Stop without creating companion specs unless the user explicitly asks.

## Prerequisites

Per [spec-contract.md](./spec-contract.md) → **Resolve docs root**, **Finding docs root**, and **Initialize docs root** when no `index.md` marker exists.

## Guidelines

### 1. Resolve docs root

Per [spec-contract.md](./spec-contract.md) → **Resolve docs root**, **Finding docs root**, and **Initialize docs root** when no `index.md` marker exists.

If `prd.md` already exists → stop; direct the user to [updating-prd.md](./updating-prd.md) unless they confirm overwrite.

### 2. Gather context

| Source | What to extract |
| --- | --- |
| User input | Product vision, users, goals, constraints |
| `README.md`, `AGENTS.md` | Product name, existing feature names |
| Existing specs | Related PRDs or partial docs in the repo |

Ask **at most one** clarifying question if product scope or audience is ambiguous.

### 3. Choose tier

Per [spec-contract.md](./spec-contract.md) → **Tier**. Default: **standard**.

### 4. Write `prd.md`

Use [`../assets/prd.md`](../assets/prd.md). Required:

- Full YAML frontmatter per contract (`doc_type: prd`, `scope: product`, `spec_revision: 1`)
- All template sections; omit or shorten sections per tier
- **Features** table: link each row to `features/<slug>/frd.md` only for features the user named; use TBD for planned features without FRDs yet
- **Related documents** table for product-level companions (mark TBD if not created)

Do not invent metrics, personas, or features unsupported by user input.

### 5. Confirm to the user

Reply with:

- Docs root path (via `index.md`), path to `prd.md`, and whether `index.md` was newly created
- One-line summary
- Tier used
- Suggested next docs (e.g. `ui-specs.md` for visual language, `trd-web.md` for web baseline, first FRD) — **do not create them**

**Stop without implementing** application code.

## Examples

**Create PRD (new repo):** No `index.md` found → ask user for an empty folder (e.g. `docs/`) → write `docs/index.md` then `docs/prd.md` → suggest `ui-specs.md` or first FRD; stop without auto-creating them.
