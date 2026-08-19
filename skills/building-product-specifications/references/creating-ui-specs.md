# Creating UI Specs

## Overview

**Docs only.** Creates or amends product or feature `ui-specs.md` — navigation flow, screen structure, view states, and transitions. User stories own journey outcomes; UI specs own presentation. TRD owns technical architecture. Infra: [spec-contract.md](./spec-contract.md) → **Resolve docs root**, **Path resolution**, **Upstream reading**, **Create or amend**, **Hub sync**, **Diagrams**, **Platform differences**.

## Prerequisites

Per [spec-contract.md](./spec-contract.md) → **Resolve docs root**.

## Guidelines

### 1. Resolve docs root and path

Per [spec-contract.md](./spec-contract.md) → **Resolve docs root** and **Path resolution**. Product phrasing ("shared chrome", "product navigation", "shared loading patterns") → product `ui-specs.md`; feature phrasing ("checkout UI specs", "screen flow for checkout") → feature `ui-specs.md`.

### 2. Read prerequisites

Per [spec-contract.md](./spec-contract.md) → **Upstream reading**. Map each story step to screens, navigation edges, and state changes.

### 3. Choose tier

Per [spec-contract.md](./spec-contract.md) → **Tier**.

### 4. Write or amend UI specs

Use [`../assets/ui-specs.md`](../assets/ui-specs.md) for new files. Required:

- Frontmatter per contract
- **Flow** — mermaid `flowchart` of screens, sheets, and navigation events (push, back, tab, modal, deep link). Feature docs at standard; product docs when documenting shared shell navigation. Each node names a **Screens** heading
- **Screens** — each modal, sheet, or stepper step is its own screen
- Per screen at standard for feature docs: **Job**, **UI structure**, **States**, **Transitions** — see below
- **Accessibility** notes tied to states (announcements, focus, error messaging) at standard tier
- Platform sections when structure, flow, or states diverge

Product-level `ui-specs.md` holds shared chrome and cross-cutting state patterns. Concrete screens live in feature `ui-specs.md`. Flow is screen-to-screen; **Transitions** are in-screen; journeys stay in `user-story.md`.

On amend: [spec-contract.md](./spec-contract.md) → **Create or amend**.

### Screen contract

| Artifact | Content |
| --- | --- |
| **Job** | One line: what this screen is for |
| **UI structure** | Placement drawing and fill — both required |
| **States** | Every reachable view state as a delta from the canonical structure. Columns: State · Composition change · Copy / sample. Typical rows: `idle`, `loading`, `empty`, `validating`, `success`, `error`. Omit unused; add screen-specific states when needed |
| **Transitions** | `From` → `Event` → `To` → `UI effect` for every material change |
| **Mermaid `stateDiagram-v2`** | When the transition table is hard to scan (multi-branch). Skip for trivial single-path screens |

**Placement** — ASCII zone drawing of the canonical idle/populated view. Name every region. Required on every screen, including stacked layouts.

**Fill** — ordered region tree matching those names. Quote every visible string. Fill user/system fields with realistic sample data. `[COPY TBD]` only when the user did not supply the words. Include enabled/disabled actions in the fill. Color, type, and spacing tokens are out of scope.

When a state changes region placement, add a placement drawing for that state in **States**. Composition change includes affordances. Copy / sample is `—` when unchanged.

Minimum coverage at standard tier: loading, empty (when the screen can have no data), validation (when the screen has input), success and error for mutating actions, and the happy-path idle/populated state.

### 5. Sync hubs

Feature-scoped: [spec-contract.md](./spec-contract.md) → **Hub sync** (`related.ui_specs`).

### 6. Confirm to the user

Reply with docs root path, file path, upstream docs read, suggested next docs (typically `trd.md`).

## Examples

**Create feature UI specs:** Read `frd.md` and `user-story.md` → write `features/checkout/ui-specs.md` with Flow, structure, states, and transitions → sync FRD hub.
