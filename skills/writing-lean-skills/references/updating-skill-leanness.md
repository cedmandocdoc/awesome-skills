# Updating Skill Leanness

## Overview

**Authoring mode.** Rewrites an existing skill into a lean version. Cuts and restructures only — every behavioral instruction in the original survives the rewrite, stated once and in its leanest form.

## Prerequisites

Categories, scope levels, and strategies per [lean-contract.md](./lean-contract.md). When a recent leanness review exists, start from its findings instead of re-scanning.

## Guidelines

### 1. Read and inventory

Read the full skill. List every behavioral instruction it contains — this inventory is the checklist that guards against meaning loss during the rewrite.

### 2. Scan per category

Pass through the document once per finding category and mark cuts: phrase-level deletions, section-level removals, and duplicate instructions to merge into a single location.

### 3. Restructure

Apply the strategy table:

- Extract instructions repeated across sections into one reference (or contract section) and link from each user
- Merge headings so each rule lives in one place; route with tables
- Move global constraints to a mode line or intro; delete per-section repeats
- Convert prose describing steps, options, or branches into numbered lists, tables, or mermaid diagrams
- Rewrite remaining prose in active voice, imperative, present tense

### 4. Rewrite and verify

Write the lean version, then check it against the inventory from step 1: every instruction present exactly once. Re-run the category scan on the result; a lean rewrite yields no findings.

### 5. Confirm to the user

Report per file: line count before → after, cuts grouped by category, instructions relocated (from → to), and confirmation that the inventory is fully covered.

## Related

- [reviewing-skill-leanness.md](./reviewing-skill-leanness.md) — audit-only pass when the user wants findings before edits
