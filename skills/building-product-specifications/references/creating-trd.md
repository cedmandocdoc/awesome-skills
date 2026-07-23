# Creating TRD

## Overview

**Docs only.** Creates or amends product or feature `trd.md` (technical design — architecture, stack, contracts). View states and screen presentation belong in `ui-specs.md`, not here.

## Prerequisites

Per [spec-contract.md](./spec-contract.md) → **Resolve docs root**.

## Guidelines

### 1. Resolve docs root and path

Per [spec-contract.md](./spec-contract.md) → **Resolve docs root** and **Path resolution**.

| Scope | Examples | Path |
| --- | --- | --- |
| Product | "system architecture", "platform TRD" | `<docs-root>/trd.md` |
| Feature | "checkout technical design" | `<docs-root>/features/<slug>/trd.md` |

### 2. Read prerequisites

| Target | Read first |
| --- | --- |
| Product `trd.md` | `prd.md` |
| Feature `trd.md` | `frd.md`; product `trd.md` when present |

Do not duplicate product-level stack or deploy detail in a feature TRD — reference the product TRD and extend for the feature.

### 3. Choose tier

Default: **standard**. Use **comprehensive** when the user requests a full architecture package.

### 4. Write or amend TRD

Use [`../assets/trd.md`](../assets/trd.md) for new files. Required:

- Frontmatter: `doc_type: trd`, correct `scope`, `feature` when feature-scoped, `depends_on`
- Mermaid diagrams for architecture and communication flows (minimum one diagram at standard tier)
- Stack table, contracts, security, environments, tradeoffs per tier
- Platform differences as sections (e.g. `## Web`, `## Mobile`, `## API`) when stacks or topologies diverge — one file, not parallel TRDs

On amend: follow [spec-contract.md](./spec-contract.md) → **Create or amend** and **Spec changelog**.

### 5. Sync FRD hub

If feature-scoped and `frd.md` exists → update `related.trd` and **Related documents**.

### 6. Confirm to the user

Reply with:

- Docs root path and file path written
- Upstream docs read
- Diagrams included
- Suggested next docs when relevant

**Stop without implementing** application code.

## Examples

**Create feature TRD:** User asks for checkout technical design. Read `frd.md` and product `trd.md` if present → write `<docs-root>/features/checkout/trd.md`.
