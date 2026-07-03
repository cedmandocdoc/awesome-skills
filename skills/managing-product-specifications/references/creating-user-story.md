# Creating User Story

## Overview

**Docs only.** Writes product or feature user story.

## Prerequisites

Per [spec-contract.md](./spec-contract.md) → **Resolve docs root**, **Finding docs root**, and **Initialize docs root** when no `index.md` marker exists.

## Guidelines

### 1. Resolve docs root

Per [spec-contract.md](./spec-contract.md) → **Resolve docs root**, **Finding docs root**, and **Initialize docs root** (if needed).

### 2. Resolve target path

Per [spec-contract.md](./spec-contract.md) → **Path resolution**.

| Scope | Examples | Path |
| --- | --- | --- |
| Product overview | "product user journeys" | `<docs-root>/user-story.md` |
| Product per app | "web app user journeys" | `<docs-root>/user-story-<app>.md` |
| Feature shared | "checkout user stories" | `<docs-root>/features/<slug>/user-story.md` |
| Feature per app | "checkout mobile journey" | `<docs-root>/features/<slug>/user-story-<app>.md` |

If file exists → [updating-user-story.md](./updating-user-story.md) unless overwrite confirmed.

### 3. Read prerequisites

| Target | Read first |
| --- | --- |
| Product `user-story*.md` | `prd.md` |
| Feature `user-story*.md` | `frd.md`; product `user-story*.md` chain per inheritance |

Shared `user-story.md` holds outcomes and acceptance criteria. `-<app>` files hold step-by-step journeys specific to that app.

### 4. Choose tier

Default: **standard**.

### 5. Write user story doc

Use [`../assets/user-story.md`](../assets/user-story.md). Required:

- Frontmatter per contract
- **Stories** in As / I want / So that format with testable acceptance criteria
- **User journey** table for `-<app>` files or comprehensive tier
- Alternate and error paths for feature-level docs at standard tier

Do not invent personas or flows unsupported by PRD / FRD.

### 6. Sync FRD hub

If feature-scoped → update `frd.md` `related.user_story` or app-specific keys.

### 7. Confirm to the user

Reply with docs root path, file path, upstream docs read, suggested next docs (typically `ui-specs*.md`).

**Stop without implementing** application code.
