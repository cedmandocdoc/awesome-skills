# Creating TRD

## Overview

**Docs only.** Creates or amends product or feature `trd.md` (architecture, stack, contracts). Screen structure, navigation, and view states belong in `ui-specs.md`. Infra: [spec-contract.md](./spec-contract.md) → **Resolve docs root**, **Path resolution**, **Upstream reading**, **Create or amend**, **Hub sync**, **Diagrams**, **Platform differences**.

## Prerequisites

Per [spec-contract.md](./spec-contract.md) → **Resolve docs root**.

## Guidelines

### 1. Resolve docs root and path

Per [spec-contract.md](./spec-contract.md) → **Resolve docs root** and **Path resolution**. Product phrasing ("system architecture", "platform TRD") → product `trd.md`; feature phrasing ("checkout technical design") → feature `trd.md`.

### 2. Read prerequisites

Per [spec-contract.md](./spec-contract.md) → **Upstream reading**. Feature TRDs reference the product TRD for shared stack/deploy and extend only for the feature.

### 3. Choose tier

Per [spec-contract.md](./spec-contract.md) → **Tier**. Use **comprehensive** when the user requests a full architecture package.

### 4. Write or amend TRD

Use [`../assets/trd.md`](../assets/trd.md) for new files. Required:

- Frontmatter: `doc_type: trd`, correct `scope`, `feature` when feature-scoped, `depends_on`
- Mermaid diagrams for architecture and communication flows (minimum one at standard tier)
- Stack table, contracts, security, environments, tradeoffs per tier
- Platform sections when stacks or topologies diverge — one file

On amend: [spec-contract.md](./spec-contract.md) → **Create or amend**.

### 5. Sync hubs

Feature-scoped: [spec-contract.md](./spec-contract.md) → **Hub sync** (`related.trd`).

### 6. Confirm to the user

Reply with docs root path, file path, upstream docs read, diagrams included, and suggested next docs when relevant.

## Examples

**Create feature TRD:** Read `frd.md` and product `trd.md` if present → write `features/checkout/trd.md`.
