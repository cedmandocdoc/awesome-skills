# Updating UI Specs

## Overview

**Docs only.** Amends UI specs.

## Prerequisites

Per [spec-contract.md](./spec-contract.md) → **Resolve docs root**, **Finding docs root**, and **Initialize docs root** when no `index.md` marker exists.

## Guidelines

### 1. Resolve path

Per [spec-contract.md](./spec-contract.md) → **Resolve docs root**, **Finding docs root**, and **Path resolution**. If missing → [creating-ui-specs.md](./creating-ui-specs.md).

### 2. Read current state

1. Read target file and inheritance chain (product visual language)
2. Read `frd.md` and `user-story*.md` when feature-scoped
3. Note dependent TRDs or design handoff artifacts

### 3. Gather changes

- Tokens, screens, states, interactions, responsive rules, a11y updates

Ask **at most one** clarifying question if ambiguous.

### 4. Update file

1. Bump `spec_revision`; append **Spec changelog**
2. Preserve section order unless restructure requested
3. Product token changes → flag all feature `ui-specs*.md` that inherit
4. Sync `frd.md` `related` if feature-scoped

### 5. Flag downstream drift

List feature TRDs, Figma prompts, or other `ui-specs-<app>.md` files affected.

### 6. Confirm to the user

Reply with `spec_revision`, changelog summary, downstream review list.

**Stop without implementing** application code.
