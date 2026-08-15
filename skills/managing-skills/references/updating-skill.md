# Updating Skill

## Overview

**Authoring mode.** Amends an existing skill to match the catalog contract, lean it, or both. Every behavioral instruction in the original survives unless the user asks to drop it.

## Prerequisites

[skill-contract.md](./skill-contract.md). [lean-contract.md](./lean-contract.md). When a recent review exists, start from its findings instead of re-scanning.

## Guidelines

### 1. Resolve target

Per [skill-contract.md](./skill-contract.md) → **Resolve target skill**. Read the skill’s `SKILL.md` and every linked reference. Confirm the amend intent: structure, leanness, or both.

### 2. Inventory

List every behavioral instruction — this inventory guards against meaning loss during the rewrite.

### 3. Apply the amend

| Intent | Do |
| --- | --- |
| Structure | Align files and sections with [skill-contract.md](./skill-contract.md). Add or rename references per **Naming**. Update Recipes and Reference index together. |
| Leanness | Scan per finding category; restructure per [lean-contract.md](./lean-contract.md) → **Lean writing strategies**. |
| Both | Structure first, then leanness. |

Cuts: phrase-level deletions, section-level removals, and duplicate instructions merged into a single location.

### 4. Rewrite and verify

Write the result. Check it against the inventory: every kept instruction present exactly once. Re-run [skill-contract.md](./skill-contract.md) → **Checklist** and the category scan; a finished amend yields no findings.

### 5. Confirm to the user

Report per file: line count before → after, cuts grouped by category, instructions relocated (from → to), structural files added or renamed, and confirmation that the inventory is fully covered.

## Related

- [reviewing-skill.md](./reviewing-skill.md) — audit-only pass when the user wants findings before edits
- [creating-skill.md](./creating-skill.md) — new skill instead of an amend
