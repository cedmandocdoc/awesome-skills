# Creating User Story

## Overview

**Docs only.** Creates or amends product or feature `user-story.md`. Navigation, screen structure, view states, and transitions belong in `ui-specs.md` — stories name outcomes; UI specs define presentation. Infra: [spec-contract.md](./spec-contract.md) → **Resolve docs root**, **Path resolution**, **Upstream reading**, **Create or amend**, **Hub sync**, **Platform differences**.

## Prerequisites

Per [spec-contract.md](./spec-contract.md) → **Resolve docs root**.

## Guidelines

### 1. Resolve docs root and path

Per [spec-contract.md](./spec-contract.md) → **Resolve docs root** and **Path resolution**. Product phrasing ("product user journeys") → product `user-story.md`; feature phrasing ("checkout user stories") → feature `user-story.md`.

### 2. Read prerequisites

Per [spec-contract.md](./spec-contract.md) → **Upstream reading**.

### 3. Choose tier

Per [spec-contract.md](./spec-contract.md) → **Tier**.

### 4. Write or amend user story

Use [`../assets/user-story.md`](../assets/user-story.md) for new files. Required:

- Frontmatter per contract
- **Stories** in As / I want / So that format with testable acceptance criteria
- **User journey** table at standard tier for feature docs
- Alternate and error paths for feature-level docs at standard tier
- Platform sections when journeys diverge materially

On amend: [spec-contract.md](./spec-contract.md) → **Create or amend**.

### 5. Sync hubs

Feature-scoped: [spec-contract.md](./spec-contract.md) → **Hub sync** (`related.user_story`).

### 6. Confirm to the user

Reply with docs root path, file path, upstream docs read, suggested next docs (typically `ui-specs.md`).

## Examples

**Create feature stories:** Read `frd.md` → write `features/checkout/user-story.md` → sync FRD hub.
