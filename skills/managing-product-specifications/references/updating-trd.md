# Updating TRD

## Overview

**Docs only.** Amends TRD; flags downstream drift.

## Prerequisites

Per [spec-contract.md](./spec-contract.md) → **Resolve docs root**, **Finding docs root**, and **Initialize docs root** when no `index.md` marker exists.

## Guidelines

### 1. Resolve path

Per [spec-contract.md](./spec-contract.md) → **Resolve docs root**, **Finding docs root**, and **Path resolution**. If missing → [creating-trd.md](./creating-trd.md).

### 2. Read current state

1. Read target TRD and frontmatter `inherits_from` chain — read upstream docs
2. If feature-scoped → read `frd.md`
3. Note dependent feature TRDs or implementation docs the user mentions

### 3. Gather changes

- Stack, architecture, contracts, infra, security, deployment updates
- New Mermaid diagrams or diagram amendments

Ask **at most one** clarifying question if ambiguous.

### 4. Update TRD

1. Bump `spec_revision`; append **Spec changelog**
2. Preserve section order unless restructure requested
3. Update diagrams and tables surgically
4. Refresh `depends_on` / `inherits_from` if upstream paths changed
5. Sync `frd.md` `related` if feature-scoped

### 5. Flag downstream drift

List specs or TRDs that inherit from this file and may need review.

### 6. Confirm to the user

Reply with `spec_revision`, changelog summary, downstream review list.

**Stop without implementing** application code.
