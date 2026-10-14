# Skill Contract

## Overview

Shared layout, naming, and independence rules for skills that follow this catalog's house style. Recipes cite these sections by name. Invocation: [invocation-contract.md](./invocation-contract.md). Dependencies and Setup: [setup-contract.md](./setup-contract.md). Leanness: [lean-contract.md](./lean-contract.md).

## Guidelines

### Directory layout

```
skills/<skill-name>/
├── SKILL.md                 # Required — router and overview
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
| `setting-up-` | One-time setup: a skill's **Set up** recipe, or a stack bootstrap |
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

Same major sections, same order. Skill-specific content goes in **subsections** under the major section it belongs to.

```markdown
# <Human title>

## Overview
## Dependencies       # omit if none
## Setup              # omit if none
## Agent workflow
## Reference index
## Templates          # omit if no assets/
```

| Section | Required | Purpose |
| --- | --- | --- |
| **Overview** | Yes | One short paragraph: outcome, mechanism, or stack. Optional `### Tech stack` when context is needed up front. |
| **Dependencies** | If something the skill cannot create must exist first | [setup-contract.md](./setup-contract.md) → **Dependencies table** |
| **Setup** | If one-time steps must run first | [setup-contract.md](./setup-contract.md) → **Setup table** |
| **Agent workflow** | Yes | Triggers, scope, routing rule, and how the agent proceeds. |
| **Reference index** | Yes | Full catalog of `references/` files. Table: Doc \| When to use (add Purpose or Layer when helpful). |
| **Templates** | If `assets/` exists | Links to copyable templates under `assets/`. |

Scenarios live in reference docs, not an **Examples** section on `SKILL.md`.

### Agent workflow

Intro (one or two sentences before subsections): triggers per [invocation-contract.md](./invocation-contract.md), scope, environment note, then how to proceed — e.g. “Follow this skill for task folders under `<tasks-root>/`. Match one **Recipes** row; open exactly that reference.” When **Dependencies** or **Setup** exists, resolve the rows the recipe needs per [setup-contract.md](./setup-contract.md) before opening it.

Use **only** these subsection names:

| Subsection | Use when |
| --- | --- |
| `### Steps` | Linear end-to-end process (deploy, bootstrap). Numbered steps in order; link to references per step. |
| `### Recipes` | Multiple intents. Table: Intent \| Example phrasing \| Read → reference. Match one row; open that reference. |
| `### Entry points` | Several ways into a large convention set. Table: Entry \| When \| Go to. |
| `### Task types` | Task-shaped bundles of references. Table: Task type \| Docs. |
| `### Decision tree` | Branching ASCII tree when choices are easier to scan as a tree than as steps. |

Combine subsections when the skill needs more than one (e.g. **Steps** + **Decision tree**; **Entry points** + **Task types**). A recipe-only skill may use **Recipes** alone.

### Reference index

| Subsection | Use when |
| --- | --- |
| `### Contract` | Link to `*-contract.md` for shared layout, frontmatter, or on-disk markers. |

**Recipes** routes; **Reference index** catalogs. The recipe table lives only under **Recipes**.

### SKILL.md skeleton

```markdown
# Human title

One paragraph: what this skill achieves and how.

## Dependencies

Resolve every **required** row before recipes that need it.

| Item | Required | When | How |
| --- | --- | --- | --- |
| [other-skill](https://github.com/cedmandocdoc/awesome-skills/tree/main/skills/other-skill) `uuid` | required | All recipes | `npx skills add cedmandocdoc/awesome-skills --skill other-skill` |
| [pnpm](https://github.com/antfu/skills/tree/main/skills/pnpm) | required | via other-skill | `npx skills add antfu/skills --skill pnpm` |
| Node.js 20+ | required | All recipes | https://nodejs.org |

## Setup

| Item | Kind | Required | When | Done when | How |
| --- | --- | --- | --- | --- | --- |
| Root path | interactive | required | Create | A root marker exists | [setting-up-….md](references/setting-up-….md) |
| Root marker | static | required | Create | `<root>/index.md` carries the author signature | [setting-up-….md](references/setting-up-….md) |

## Agent workflow

Follow this skill for … Works wherever the agent can read and write repository files. Resolve **Dependencies** and **Setup** rows the recipe needs, then match one **Recipes** row; open exactly that reference.

### Recipes

| Intent | Example phrasing | Read |
| --- | --- | --- |
| Set up | "Set up …" | [setting-up-….md](references/setting-up-….md) |
| Create | "…" | [creating-….md](references/creating-….md) |

## Reference index

### Contract

[task-contract.md](references/task-contract.md) — layout, frontmatter, resolve rules.

| Doc | When to use |
| --- | --- |
| [creating-….md](references/creating-….md) | New … |
| [task-contract.md](references/task-contract.md) | Paths, fields, discovery |

## Templates

- [`assets/plan.md`](assets/plan.md)
```

### SKILL.md constraints

Stay under **~500 lines**; move detail to `references/`.

### Reference documents

References are recipes or deep dives the agent reads after `SKILL.md` routes to them. Same rule as **SKILL.md body**, with skill-specific `###` subsections mostly under **Guidelines**.

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
| **Prerequisites** | Optional | Recipe-local: contract links, upstream docs, repo paths. Skill-wide items live on `SKILL.md` → **Dependencies** and **Setup**. |
| **Guidelines** | Yes | Procedures, rules, tables, decision trees, checklists, troubleshooting phases, and contract definitions. Use `###` subsections; numbered steps (`### 1.` … `### N.`) for lifecycle recipes. |
| **Setup** | Optional | Bootstrap inside a convention or configuring guide — install packages, minimum config, env vars. Skill-wide one-time steps and root initialization live in the **Set up** recipe per [setup-contract.md](./setup-contract.md). |
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
| Contract | `*-contract.md` | What the contract governs | — | Signatures, layout, fields, resolve rules | — | — | — | — |
| Set up recipe | `setting-up-<noun>` | Mode + rows it runs | Contract link | The six steps of [setup-contract.md](./setup-contract.md) → **Set up recipe** | — | — | — | — |
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
| Discovery | [setup-contract.md](./setup-contract.md) → **Discover dependency skill**; missing rows per **Dependencies table** there |
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
- [ ] `SKILL.md` uses Overview → Dependencies (if any) → Setup (if any) → Agent workflow → Reference index (→ Templates if `assets/`); skill-specific blocks are subsections only
- [ ] No relative path links to other skills under `skills/`. Dependency skills use GitHub URLs; this catalog also uses `name` + `id` discovery
- [ ] Skill dependency rows repeat in the contract with discovery
- [ ] [invocation-contract.md](./invocation-contract.md) → **Checklist** and [setup-contract.md](./setup-contract.md) → **Checklist** pass
- [ ] Each instruction appears once; mode lines carry boundaries; tables route; no noise, filler, or commentary

## Related

- [invocation-contract.md](./invocation-contract.md) — loads, standing rule
- [setup-contract.md](./setup-contract.md) — dependencies, setup kinds, Set up recipe
- [lean-contract.md](./lean-contract.md) — leanness test, finding categories, writing strategies
