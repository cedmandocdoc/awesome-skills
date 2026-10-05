# Creating Skill

## Overview

**Authoring mode.** Writes a new skill directory that passes all three contracts.

## Prerequisites

[skill-contract.md](./skill-contract.md). [invocation-contract.md](./invocation-contract.md). [lean-contract.md](./lean-contract.md).

## Guidelines

### 1. Gather intent

Confirm with the user: purpose, trigger scenarios, target directory, required dependencies, and any verbatim wording to preserve. Settle the **Loads** and **Standing rule** answers per [invocation-contract.md](./invocation-contract.md). Verbatim user text goes in unchanged.

### 2. Name and layout

Per [skill-contract.md](./skill-contract.md) → **Resolve target skill**, **Naming**, **Directory layout**, and the `id` row of **SKILL.md frontmatter**.

### 3. Plan structure first

Before writing prose, outline files and headings: references by [skill-contract.md](./skill-contract.md) → **Kind map**, formats by [lean-contract.md](./lean-contract.md) → **Content shape**. With skill dependencies, plan the contract's copy of [skill-contract.md](./skill-contract.md) → **Discover dependency skill**.

### 4. Write files

Write `SKILL.md`, each reference, and `agents/openai.yaml` from the [skill-contract.md](./skill-contract.md) skeletons, applying the step 1 answers per [invocation-contract.md](./invocation-contract.md) and [lean-contract.md](./lean-contract.md) → **Lean writing strategies**.

### 5. Self-review

Run [skill-contract.md](./skill-contract.md) → **Checklist** and one pass per finding category. Fix findings before delivering.

### 6. Confirm to the user

Report the created paths, `name`, `id`, **Loads** and **Standing rule** answers, section map, and where shared instructions were extracted.

## Related

- [reviewing-skill.md](./reviewing-skill.md) — deeper audit of the result
- [updating-skill.md](./updating-skill.md) — amend after create
