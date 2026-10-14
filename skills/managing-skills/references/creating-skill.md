# Creating Skill

## Overview

**Authoring mode.** Writes a new skill directory that passes all four contracts.

## Prerequisites

[skill-contract.md](./skill-contract.md). [invocation-contract.md](./invocation-contract.md). [setup-contract.md](./setup-contract.md). [lean-contract.md](./lean-contract.md).

## Guidelines

### 1. Gather intent

Confirm with the user: purpose, trigger scenarios, target directory, what a recipe needs first (each a **Setup** row with its kind per [setup-contract.md](./setup-contract.md) → **Setup kinds**), and any verbatim wording to preserve. Settle the **Loads** and **Standing rule** answers per [invocation-contract.md](./invocation-contract.md).

### 2. Name and layout

Per [skill-contract.md](./skill-contract.md) → **Resolve target skill**, **Naming**, **Directory layout**, and the `id` row of **SKILL.md frontmatter**.

### 3. Plan structure first

Before writing prose, outline files and headings: references by [skill-contract.md](./skill-contract.md) → **Kind map**, formats by [lean-contract.md](./lean-contract.md) → **Content shape**. With skill dependencies, plan the contract's copy of [setup-contract.md](./setup-contract.md) → **Discover dependency skill**.

### 4. Write files

Write `SKILL.md`, each reference, and `agents/openai.yaml` from the [skill-contract.md](./skill-contract.md) skeletons, applying the step 1 answers per [invocation-contract.md](./invocation-contract.md) and [lean-contract.md](./lean-contract.md) → **Lean writing strategies**.

### 5. Self-review

Run [skill-contract.md](./skill-contract.md) → **Checklist** and one pass per finding category. Fix findings before delivering.

### 6. Confirm to the user

Report the created paths, `name`, `id`, **Loads** and **Standing rule** answers, **Setup** rows by kind, **Recipes** rows, and where shared instructions were extracted.

## Related

- [reviewing-skill.md](./reviewing-skill.md) — deeper audit of the result
- [updating-skill.md](./updating-skill.md) — amend after create
