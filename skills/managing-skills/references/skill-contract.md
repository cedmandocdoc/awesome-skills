# Skill Contract

## Overview

Shared layout, naming, and independence rules for skills that follow this catalog's house style. Recipes cite these sections by name. Invocation: [invocation-contract.md](./invocation-contract.md). Setup: [setup-contract.md](./setup-contract.md). Leanness: [lean-contract.md](./lean-contract.md).

## Guidelines

### Directory layout

```
skills/<skill-name>/
├── SKILL.md                 # Required — setup, workflow, recipes
├── agents/
│   └── openai.yaml          # Required — install/discovery metadata
├── references/              # Detailed workflows (typical)
├── assets/                  # Optional — templates, examples
└── scripts/                 # Optional — helper scripts
```

### Naming

**Skill folder and `name` field**

- **kebab-case**, lowercase letters, numbers, hyphens only
- **Verb-led**, describes the capability: `managing-monorepo`, `deploying-cloudflare-web-application`
- Max **64 characters** for `name`
- Folder name matches `name` in frontmatter

**Reference files** (`references/`)

- **kebab-case** `.md` files
- **`<verb>-<noun>.md`** — action or concern as the prefix
- **Title:** `# <Action>` — title case from the filename (drop `.md`, hyphens → spaces). Preserve acronyms and code terms (`API`, `UI`, `E2E`, `PRD`, `GitHub`, `className`). Example: `managing-project-structure.md` → `# Managing Project Structure`.

| Prefix | Use for |
| --- | --- |
| `creating-` | New artifact or setup |
| `updating-` | Amend existing artifact |
| `reviewing-` | Read-only review workflow |
| `executing-` | Run or continue work |
| `managing-` | Ongoing patterns, structure, state |
| `configuring-` | Platform or tool configuration |
| `setting-up-` | One-time bootstrap of a stack or tool |
| `discovering-` | Repo inspection and resolution |
| `troubleshooting-` | Failure diagnosis and fixes |
| `*-contract.md` | Shared layout, fields, and conventions for that skill |

**Assets and scripts**

- **assets/** — templates users or agents copy (`plan.md`, `design.md`)
- **scripts/** — executable helpers; name by what they do (`add-registry-component.cjs`)

### SKILL.md frontmatter

```yaml
---
name: skill-name
id: 00000000-0000-4000-8000-000000000000
description: What the skill does and when to use it.
version: 1.0.0
---
```

| Field | Rules |
| --- | --- |
| `name` | Same as folder name; kebab-case. CLI install identifier (`--skill <name>`). |
| `id` | UUID v4 that identifies **this catalog’s** skill. Generate once (`uuidgen` or `python3 -c "import uuid; print(uuid.uuid4())"`). Never reuse; never change after publish. Distinct from author / subagent signatures. |
| `description` | Non-empty; **what** + **when**; third person; **when** per [invocation-contract.md](./invocation-contract.md) → **Loads** |
| `disable-model-invocation` | Only for the hard block in [invocation-contract.md](./invocation-contract.md) → **Explicit trigger** |
| `version` | Semver when the skill has a defined workflow contract |

### SKILL.md body

Every `SKILL.md` has the title and three sections in this order, and no others: **Setup** per [setup-contract.md](./setup-contract.md), then **Workflow** and **Recipes** below. Template: **SKILL.md skeleton**.

Invocation lives in frontmatter and `agents/openai.yaml` ([invocation-contract.md](./invocation-contract.md)). Everything else — stack, shared rules, layouts, templates, scenarios — lives in `references/`, usually the skill's `*-contract.md`.

### Workflow

- Copy steps 1 and 3 verbatim from the skeleton. Step 2 links every contract the skill has; omit it when there is none.
- Below the steps, bullets for boundaries every recipe obeys and an agent could miss: what the skill never does (`Sends and posts nothing.`), takeover (`Once invoked, it steers the rest of the chat.`). A rule only some recipes need lives in those recipes or the contract.

### Recipes

- One row per intent or task type. Read lists every doc the row needs, in reading order.
- The **Set up** row comes first when **Setup** has rows, verbatim per [setup-contract.md](./setup-contract.md) → **Set up recipe**.
- A skill with one procedure has one intent row; its steps live in a reference, never in `SKILL.md`.
- Every reference is reachable from a Read cell, Workflow step 2, or a link in another reference. Templates are linked from the reference that copies them.

### SKILL.md skeleton

```markdown
---
name: <name>
id: <uuid>
description: <what>. Use only when the user names this skill (`/<name>`, `$<name>`, or "<name>"), or references a file under a marked <thing> root (`@<root>/<example>`).
version: 1.0.0
---

# <Human title>

## Setup

| Item | Kind | Required | When | Done when | How |
| --- | --- | --- | --- | --- | --- |
| Node.js 20+ | user | required | All | `node --version` succeeds | https://nodejs.org |
| Root path | ask | required | Create | A root marker exists | Ask for the folder (default `<root>/`); recorded as the root's location |
| Root marker | static | required | Create | `<root>/index.md` carries the author signature | [<name>-contract.md](references/<name>-contract.md) → **Initialize root** |

## Workflow

1. **Setup** — for each **Setup** row whose When covers the request, in order: Done when holds → skip; `user` → stop and print its How when required, continue without it when optional; `ask` → fill what the request answers, ask the rest together in one message, record each answer; `auto` and `static` → run.
2. **Contract** — read [<name>-contract.md](references/<name>-contract.md).
3. **Recipe** — match one **Recipes** row; open every doc in its Read column.

## Recipes

| Intent | Example phrasing | Read |
| --- | --- | --- |
| Set up | "Set up <thing>", "Is <name> ready?" | **Setup** — run Workflow step 1 for every row, then report each row's state |
| Create | "Create a …", <a cue such as a file reference or standing rule> | [creating-….md](references/creating-….md) |
```

### SKILL.md constraints

Stay under **~500 lines**; move detail to `references/`.

### Reference documents

References hold the skill's content: recipes, contracts, and guides the agent opens from **Recipes**. Same major sections in the same order; skill-specific `###` subsections mostly under **Guidelines**.

```markdown
# <Action>

## Overview
## Prerequisites
## Guidelines
## Setup
## Examples
## Related
## References
```

Omit optional sections that do not apply. Other top-level sections are not used.

| Section | Required | Purpose |
| --- | --- | --- |
| **Overview** | Yes | What this reference does, when to run it, and the mode boundary. Start with a **mode line** when the doc mutates files or is read-only. One short paragraph; bullets for triggers if needed. |
| **Prerequisites** | Optional | Recipe-local: contract links, upstream docs, repo paths. Skill-wide items are `SKILL.md` → **Setup** rows. |
| **Guidelines** | Yes | Procedures, rules, tables, decision trees, checklists, troubleshooting phases, and contract definitions. Use `###` subsections; numbered steps (`### 1.` … `### N.`) for lifecycle recipes. |
| **Setup** | Optional | Bootstrap inside a convention or configuring guide — install packages, minimum config, env vars — or a contract's root initialization that a `SKILL.md` → **Setup** row links to. |
| **Examples** | Optional | Copy-paste samples: code, config snippets, filled templates, report formats. |
| **Related** | Optional | Links to other references or `assets/` in the **same skill** only. |
| **References** | Optional | External platform or spec URLs (official docs, API docs, third-party specifications). |

### Mode line

First line of **Overview**:

| Mode | Use for |
| --- | --- |
| `**Planning only.**` | Task/spec planning; no implementation |
| `**Docs only.**` | Writes or amends markdown specs only |
| `**Authoring mode.**` | Creates docs, style guides, or design handoff files |
| `**Review mode.**` | Read-only review unless the user asks to apply edits |
| `**Execution mode.**` | Implements the current task step |
| `**Read-only.**` | Status, triage, or check — no file mutations |
| `**Backlog execution mode.**` | Multi-task orchestration loop |

### Guidelines subsections

Use only what the reference needs:

| Subsection | Use for |
| --- | --- |
| `### 1.` … `### N.` | Lifecycle recipes — resolve → gather → act → sync → confirm |
| `### Decision tree` | Routing table before a deep dive |
| `### Confirm to the user` | Last `###` of every mutating recipe — paths, summary, follow-up (or the final `### N.`) |
| Topic headings | Contract fields, troubleshooting phases (`### Build fails`), review checklist groups |

### Kind map

| Kind | Filename prefix | Overview | Prerequisites | Guidelines | Setup | Examples | Related | References |
| --- | --- | --- | --- | --- | --- | --- | --- | --- |
| Lifecycle recipe | `creating-`, `updating-`, `executing-`, … | Mode + purpose | Contract / path resolve | Numbered steps | — | — | — | — |
| Contract | `*-contract.md` | What the contract governs | — | Signatures, layout, fields, resolve rules, shared rules and stack | Init procedures linked from `SKILL.md` → **Setup** | — | — | — |
| Review | `reviewing-` | Mode + scope | Link to creating doc | Steps + checklist `###` groups | — | Report template | Creating doc | — |
| Discovery | `discovering-` | When to run | — | Numbered discovery phases + checklist | — | Path/command samples | — | — |
| Configuring | `configuring-` | Platform + goal | Dashboard/repo state | Settings tables, field reference | Install, minimum config | Filled settings examples | — | Platform docs |
| Troubleshooting | `troubleshooting-` | When to use | — | Phase groups + symptom tables | — | Debug commands (optional) | — | Platform docs |
| Convention / guide | `managing-`, `creating-*` (framework) | What this guide covers | Required reading | Rules, placement, naming, trees | Install / bootstrap | Code samples | Linked refs | External docs (optional) |

### Cross-links

- Recipe → contract: **Prerequisites** or step 1 in **Guidelines**
- Recipe → asset: `[../assets/plan.md](../assets/plan.md)` from a Guidelines step
- In-skill navigation: **Related**
- External URLs: **References**, or inline where a step needs them

### Reference skeleton

```markdown
# Creating Task

## Overview

**Planning only.** Writes `plan.md` and `status.md` for a new task folder.

## Prerequisites

Per [task-contract.md](./task-contract.md) → **Resolve tasks root**.

## Guidelines

### 1. Resolve tasks root
…

### 6. Confirm to the user
…
```

Fill other kinds from the **Kind map**; keep the same section order.

### agents/openai.yaml

Every skill includes `agents/openai.yaml` for install UIs and skill discovery.

```yaml
interface:
  display_name: "Short Human Title"
  short_description: "One line — what the skill does"
  default_prompt: "Use $skill-name when <trigger scenarios>."
```

| Field | Guidance |
| --- | --- |
| `display_name` | Title case; readable in a picker |
| `short_description` | Matches the spirit of `description` in `SKILL.md`; shorter |
| `default_prompt` | Uses `$<name>` from frontmatter; states the same trigger as `description` |
| `policy.allow_implicit_invocation` | `false` only for the hard block in [invocation-contract.md](./invocation-contract.md) → **Explicit trigger** |

Use the `.yaml` extension.

### Skill independence

A user may install one skill without the rest of the catalog. In-skill markdown links stay inside that skill’s directory, one level deep.

| Rule | Detail |
| --- | --- |
| Identity | Every skill in **this catalog** has `name` and `id` (UUID). Those dependency rows match **both**. `id` never changes after publish. Third-party skills match `name`; check `id` only if that skill publishes one. |
| GitHub URL | Full URL to the skill in its source repo: `https://github.com/<owner>/<repo>/tree/<ref>/skills/<name>`. This catalog: `https://github.com/cedmandocdoc/awesome-skills/tree/main/skills/<name>`. Relative `skills/other-skill/` links break when only one skill is installed. |
| Discovery | [setup-contract.md](./setup-contract.md) → **Discover dependency skill** |
| After find (skill) | Open the installed skill’s `SKILL.md`. Follow recipes by **intent name**. Never copy that skill’s file paths into this skill’s docs. |
| Repeat context | If two skills need the same fact, state it briefly in each, or point at external docs from **References**. |

### Resolve target skill

1. User `@`-mention or path → that folder.
2. Else glob `skills/<name>/SKILL.md` in the current repo, then project and user skill roots (same roots as [setup-contract.md](./setup-contract.md) → **Discover dependency skill**).
3. One match → use it. Multiple → ask. None on **create** → write `skills/<name>/` when that catalog layout exists; otherwise ask for the target directory. None on **update** or **review** → stop and report.

### Checklist

- [ ] `skills/<name>/SKILL.md` has valid frontmatter (`name`, `id`, `description`)
- [ ] `skills/<name>/agents/openai.yaml` present and aligned with `name` / `description`
- [ ] Reference files use kebab-case filenames and verb prefixes; body uses Overview → Prerequisites → Guidelines → Setup → Examples → Related → References (omit empty sections)
- [ ] `SKILL.md` has exactly **Setup** → **Workflow** → **Recipes** under the title; no other sections or subsections
- [ ] **Workflow** steps 1 and 3 are verbatim; step 2 links every contract; boundaries hold for every recipe
- [ ] Every reference is reachable from **Recipes**, Workflow step 2, or another reference
- [ ] No relative path links to other skills under `skills/`. Dependency skills use GitHub URLs; this catalog also uses `name` + `id` discovery
- [ ] Skill dependency rows repeat in the contract with discovery
- [ ] [invocation-contract.md](./invocation-contract.md) → **Checklist** and [setup-contract.md](./setup-contract.md) → **Checklist** pass
- [ ] Each instruction appears once; mode lines carry boundaries; tables route; no noise, filler, or commentary

## Related

- [invocation-contract.md](./invocation-contract.md) — loads, standing rule
- [setup-contract.md](./setup-contract.md) — Setup table, kinds, Set up recipe
- [lean-contract.md](./lean-contract.md) — leanness test, finding categories, writing strategies
