# Creating UI Specs

## Overview

**Docs only.** Creates or amends product or feature `ui-specs.md` — screens, view states, and transitions. User stories own journey outcomes; UI specs own presentation. TRD owns technical architecture. Infra: [spec-contract.md](./spec-contract.md) → **Resolve docs root**, **Path resolution**, **Upstream reading**, **Create or amend**, **Hub sync**, **Diagrams**, **Platform differences**.

## Prerequisites

Per [spec-contract.md](./spec-contract.md) → **Resolve docs root**.

## Guidelines

### 1. Resolve docs root and path

Per [spec-contract.md](./spec-contract.md) → **Resolve docs root** and **Path resolution**. Product phrasing ("shared loading patterns", "product UI states") → product `ui-specs.md`; feature phrasing ("checkout UI specs", "view states for checkout") → feature `ui-specs.md`.

### 2. Read prerequisites

Per [spec-contract.md](./spec-contract.md) → **Upstream reading**. Map each story step to screens and state changes.

### 3. Choose tier

Per [spec-contract.md](./spec-contract.md) → **Tier**. Feature docs include screen inventory and state machines at standard tier.

### 4. Write or amend UI specs

Use [`../assets/ui-specs.md`](../assets/ui-specs.md) for new files. Required:

- Frontmatter per contract
- **Screens** with layout/content enough to ground state machines (feature docs)
- **States** and **Transitions** per screen (or **Flow** for multi-screen interactions) at standard tier for feature docs — see below
- **Accessibility** notes tied to states (announcements, focus, error messaging) at standard tier
- Platform sections when layouts or states diverge

On amend: [spec-contract.md](./spec-contract.md) → **Create or amend**.

### Screen and flow state machines

For each screen (and each multi-screen **Flow**) in feature `ui-specs.md`:

| Artifact | Content |
| --- | --- |
| **States** table | Every reachable view state. Typical rows: `idle`, `loading`, `empty`, `validating`, `success`, `error`. Omit unused; add screen-specific states when needed |
| **Transitions** table | `From` → `Event` → `To` → `UI effect` for every material change |
| **Mermaid `stateDiagram-v2`** | When the transition table is hard to scan (multi-branch or multi-screen). Skip for trivial single-path screens |

Minimum coverage at standard tier: loading, empty (when the screen can have no data), validation (when the screen has input), success and error for mutating actions, and the happy-path idle/populated state.

Product-level `ui-specs.md` may document shared cross-cutting state patterns only. Put concrete screen state machines in feature `ui-specs.md`.

### 5. Sync hubs

Feature-scoped: [spec-contract.md](./spec-contract.md) → **Hub sync** (`related.ui_specs`).

### 6. Confirm to the user

Reply with docs root path, file path, upstream docs read, suggested next docs (typically `trd.md`).

## Examples

**Create feature UI specs:** Read `frd.md` and `user-story.md` → write `features/checkout/ui-specs.md` with states + transitions → sync FRD hub.
