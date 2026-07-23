# Creating User Story

## Overview

**Docs only.** Creates or amends product or feature `user-story.md`.

## Prerequisites

Per [spec-contract.md](./spec-contract.md) → **Resolve docs root**.

## Guidelines

### 1. Resolve docs root and path

Per [spec-contract.md](./spec-contract.md) → **Resolve docs root** and **Path resolution**.

| Scope | Examples | Path |
| --- | --- | --- |
| Product | "product user journeys" | `<docs-root>/user-story.md` |
| Feature | "checkout user stories" | `<docs-root>/features/<slug>/user-story.md` |

### 2. Read prerequisites

| Target | Read first |
| --- | --- |
| Product `user-story.md` | `prd.md` |
| Feature `user-story.md` | `frd.md`; product `user-story.md` when present |

View states and transitions (loading, empty, validating, success, error) belong in `ui-specs.md`, not in the user story. Alternate and error paths here name outcomes; UI specs define how the interface moves between those presentations.

### 3. Choose tier

Default: **standard**.

### 4. Write or amend user story

Use [`../assets/user-story.md`](../assets/user-story.md) for new files. Required:

- Frontmatter per contract
- **Stories** in As / I want / So that format with testable acceptance criteria
- **User journey** table at standard tier for feature docs
- Alternate and error paths for feature-level docs at standard tier
- Platform differences as sections when journeys diverge materially

On amend: follow [spec-contract.md](./spec-contract.md) → **Create or amend** and **Spec changelog**.

Do not invent personas or flows unsupported by PRD / FRD.

### 5. Sync FRD hub

If feature-scoped and `frd.md` exists → update `related.user_story` and **Related documents**.

### 6. Confirm to the user

Reply with docs root path, file path, upstream docs read, suggested next docs (typically `ui-specs.md`).

**Stop without implementing** application code.
