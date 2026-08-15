# Creating Skill

## Overview

**Authoring mode.** Writes a new skill directory that matches [skill-contract.md](./skill-contract.md) and passes the leanness test in [lean-contract.md](./lean-contract.md).

## Prerequisites

Layout, sections, and independence: [skill-contract.md](./skill-contract.md). Categories and strategies: [lean-contract.md](./lean-contract.md).

## Guidelines

### 1. Gather intent

Confirm with the user: purpose, trigger scenarios, target directory, required dependencies, and any verbatim wording to preserve. Verbatim user text goes in unchanged.

### 2. Name and layout

Per [skill-contract.md](./skill-contract.md) → **Resolve target skill**, **Naming**, and **Directory layout**. Generate `id` once (`uuidgen` or `python3 -c "import uuid; print(uuid.uuid4())"`). Folder name matches `name`.

### 3. Plan structure first

Before writing prose, outline files and headings. Content shape → format per [lean-contract.md](./lean-contract.md) → **Content shape**. Place each rule under exactly one heading. Put instructions needed by multiple sections in the contract (or one section) and link.

| File | Contents |
| --- | --- |
| `SKILL.md` | Required sections; Recipes, Steps, or Entry points rows |
| `references/*.md` | One file per recipe or contract; kind from [skill-contract.md](./skill-contract.md) → **Kind map** |
| `agents/openai.yaml` | `display_name`, `short_description`, `default_prompt` |

When the skill has skill dependencies, copy **Discover dependency skill** into that skill’s contract.

### 4. Write files

Fill from [skill-contract.md](./skill-contract.md) skeletons:

1. `SKILL.md` — frontmatter, Overview, Dependencies/Setup if needed, Agent workflow, Reference index, Templates if `assets/`
2. Each reference — Overview (mode line when mutating), Prerequisites, Guidelines; omit empty sections
3. `agents/openai.yaml`

### 5. Write lean

Per [lean-contract.md](./lean-contract.md) → **Lean writing strategies**. Keep `SKILL.md` under ~500 lines; move detail to references linked one level deep.

### 6. Self-review

Run [skill-contract.md](./skill-contract.md) → **Checklist** and one pass per finding category. Fix findings before delivering.

### 7. Confirm to the user

Report the created paths, `name`, `id`, section map, and where shared instructions were extracted.

## Related

- [reviewing-skill.md](./reviewing-skill.md) — deeper audit of the result
- [updating-skill.md](./updating-skill.md) — amend after create
