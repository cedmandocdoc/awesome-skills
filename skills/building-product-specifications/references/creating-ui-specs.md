# Creating UI Specs

## Overview

**Docs only.** Creates or amends product or feature `ui-specs.md` focused on **screens**, **view states**, and **transitions**.

## Prerequisites

Per [spec-contract.md](./spec-contract.md) → **Resolve docs root**.

## Guidelines

### 1. Resolve docs root and path

Per [spec-contract.md](./spec-contract.md) → **Resolve docs root** and **Path resolution**.

| Scope | Examples | Path |
| --- | --- | --- |
| Product cross-cutting states | "shared loading patterns", "product UI states" | `<docs-root>/ui-specs.md` |
| Feature screens + states | "checkout UI specs", "view states for checkout" | `<docs-root>/features/<slug>/ui-specs.md` |

### 2. Read prerequisites

| Target | Read first |
| --- | --- |
| Product `ui-specs.md` | `prd.md` |
| Feature `ui-specs.md` | `frd.md`; feature `user-story.md` when present; product `ui-specs.md` when present |

**Ownership:** User story defines journey outcomes and acceptance criteria. UI specs define presentation structure — screen inventory, layout/content for state coverage, view states, and transitions. Map each story step to screens and state changes.

TRD covers technical architecture. UI specs cover what the user sees per state.

### 3. Choose tier

Default: **standard**. Feature docs include screen inventory and state machines at standard tier.

### 4. Write or amend UI specs

Use [`../assets/ui-specs.md`](../assets/ui-specs.md) for new files. Required:

- Frontmatter per contract
- **Screens** with layout and content enough to ground state machines (feature docs)
- **States** and **Transitions** per screen (or **Flow** subsection for multi-screen interactions) at standard tier for feature docs — see below
- **Accessibility** notes tied to states (announcements, focus, error messaging) at standard tier
- Platform differences as sections when layouts or states diverge (e.g. `## Mobile notes`)

On amend: follow [spec-contract.md](./spec-contract.md) → **Create or amend** and **Spec changelog**.

Do not invent flows unsupported by user story / FRD.

### Screen and flow state machines

For each screen (and each multi-screen **Flow**) in feature `ui-specs.md`:

1. **States** table — every reachable view state. Typical rows: `idle`, `loading`, `empty`, `validating`, `success`, `error`. Omit unused rows; add screen-specific states when needed.
2. **Transitions** table — `From` → `Event` → `To` → `UI effect` for every material change (fetch, submit, validate, retry, navigate).
3. **Mermaid `stateDiagram-v2`** when the transition table is hard to scan (multi-branch or multi-screen flows). Skip for trivial single-path screens.

Minimum coverage at standard tier: loading, empty (when the screen can have no data), validation (when the screen has input), success and error for mutating actions, and the happy-path idle/populated state.

Product-level `ui-specs.md` may omit per-feature screen inventories; it may document shared cross-cutting state patterns only. Put concrete screen state machines in feature `ui-specs.md`.

### 5. Sync FRD hub

If feature-scoped and `frd.md` exists → update `related.ui_specs` and **Related documents**.

### 6. Confirm to the user

Reply with docs root path, file path, upstream docs read, suggested next docs (typically `trd.md`).

**Stop without implementing** application code.
