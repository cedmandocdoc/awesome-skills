# Updating FRD

## Overview

**Docs only.** Amends FRD; syncs `related` and PRD index.

## Prerequisites

Per [spec-contract.md](./spec-contract.md) → **Resolve docs root**, **Finding docs root**, and **Initialize docs root** when no `index.md` marker exists.

## Guidelines

### 1. Resolve feature folder

Per [spec-contract.md](./spec-contract.md) → **Resolve docs root** and **Finding docs root**. Target from user message or search `<docs-root>/features/*/frd.md`.

If missing → direct to [creating-frd.md](./creating-frd.md).

### 2. Read current state

1. Read `frd.md` (frontmatter `related`, `apps`, body)
2. Read `prd.md` if linked
3. Note which sibling specs exist on disk (`user-story*.md`, `ui-specs*.md`, `trd*.md`)

### 3. Gather changes

From the user message:

- New requirements, rules, edge cases, acceptance criteria
- App list changes (`apps` in frontmatter)
- Scope additions or cuts

Ask **at most one** clarifying question if ambiguous.

### 4. Update `frd.md`

1. Bump `spec_revision`; append **Spec changelog**
2. Edit sections; preserve heading order unless restructure requested
3. Update `apps` in frontmatter when scope changes
4. Sync `related` and **Related documents** table to match files on disk
5. If feature renamed → update slug only with user confirmation (implies folder rename and link updates)

### 5. Sync PRD and flag downstream

- Update `prd.md` Features table if feature name or link changed
- List sibling specs that may need review (user story, UI specs, TRD)

### 6. Confirm to the user

Reply with:

- `spec_revision` and changelog summary
- Updated `related` map
- Downstream docs to review

**Stop without implementing** application code.

## Examples

**Update FRD:** User adds acceptance criteria. Bump `spec_revision` → note downstream user-story / TRD docs that may need review.
