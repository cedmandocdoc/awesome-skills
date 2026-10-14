# Updating Skill

## Overview

**Authoring mode.** Amends an existing skill to match the contracts, lean it, or both. Leanness is always in scope. Every behavioral instruction in the original survives unless the user asks to drop it.

## Prerequisites

[skill-contract.md](./skill-contract.md). [invocation-contract.md](./invocation-contract.md). [setup-contract.md](./setup-contract.md). [lean-contract.md](./lean-contract.md). When a recent review exists, start from its findings instead of re-scanning.

## Guidelines

### 1. Resolve target

Per [skill-contract.md](./skill-contract.md) → **Resolve target skill**. Read the skill’s `SKILL.md` and every linked reference. Confirm whether structure work is needed.

### 2. Inventory

List every behavioral instruction.

### 3. Apply the amend

| Intent | Do |
| --- | --- |
| Structure | Align files and sections with [skill-contract.md](./skill-contract.md), [invocation-contract.md](./invocation-contract.md), and [setup-contract.md](./setup-contract.md). Add or rename references per **Naming**. |
| Leanness | Scan per finding category; restructure per [lean-contract.md](./lean-contract.md) → **Lean writing strategies**. |

A `SKILL.md` in an older layout maps onto **Setup**, **Workflow**, **Recipes**:

| Old | Goes to |
| --- | --- |
| **Overview**, `### Tech stack` | Rules and stack → the contract; a rule for every recipe → **Workflow** boundary; a summary → dropped |
| **Dependencies** | **Setup** `user` rows |
| Agent workflow intro | Trigger → dropped; environment needs ("can run npm") → `user` rows; boundaries → **Workflow** bullets |
| **Steps**, **Entry points**, **Task types**, **Decision tree** | **Recipes** rows; procedure steps → a reference |
| Root initialization in a contract | **Setup** `ask` and `static` rows whose How links to it |
| **Reference index**, **Templates** | Dropped once every reference and template is reachable per [skill-contract.md](./skill-contract.md) → **Recipes** |

### 4. Rewrite and verify

Write the result. Check it against the inventory: every kept instruction present exactly once. Re-run [skill-contract.md](./skill-contract.md) → **Checklist** and the category scan on every edited file; a finished amend yields no findings.

### 5. Confirm to the user

Report per file: line count before → after, cuts grouped by category, instructions relocated (from → to), structural files added or renamed, and confirmation that the inventory is fully covered.

## Related

- [reviewing-skill.md](./reviewing-skill.md) — audit-only pass when the user wants findings before edits
- [creating-skill.md](./creating-skill.md) — new skill instead of an amend
