# Writing skills for this repository

This repository is a **catalog of installable agent skills** under `skills/`. Users download or copy a skill into their own agent environment (for example `~/.cursor/skills/` or `.cursor/skills/`). Skills here are **not** loaded automatically by this repo.

Each skill is **self-contained**. A skill may link only to files inside its own directory. Do not reference other skills in this catalog.

---

## Documentation strategy

Follow the same standards as the **writing-documentation** skill:

| Principle | Practice |
| --- | --- |
| **Clarity** | Main ideas obvious on first read. |
| **Conciseness** | Brief, precise language; omit filler. |
| **Structure** | Logical headings; scannable bullets and tables. |
| **Consistency** | Same terms, formatting, and tone within a skill. |

**Style:** Active voice, present tense, third person. Short sentences. Backticks for inline code, commands, and paths. Blank lines between sections.

**Progressive disclosure:** Keep `SKILL.md` focused. Put step-by-step detail, contracts, and long tables in `references/`. Link from `SKILL.md` to references; keep links **one level deep** (from `SKILL.md` → reference file, not reference → reference → reference).

**Phrasing:** State what to do directly. Avoid pairing a positive rule with a redundant negative (“Do not …”) unless the exception is easy to miss or safety-critical.

| Prefer | Instead of |
| --- | --- |
| “Read exactly one recipe for the user’s intent.” | “Read exactly one recipe. Do not load other recipes.” |
| “Ask the user when multiple candidates exist.” | “Do not guess when multiple candidates exist.” |
| “Stop without implementing unless the user also asks to implement.” | “Do not write application code unless …” (when the mode line already says **Planning only**) |

Use **mode lines** at the top of reference docs (`**Planning only.**`, `**Docs only.**`, `**Review mode.**`) instead of repeating the same constraint in every section.

---

## Skill directory layout

```
skills/<skill-name>/
├── SKILL.md                 # Required — router and overview
├── agents/
│   └── openai.yaml          # Required — install/discovery metadata
├── references/              # Detailed workflows (typical)
├── assets/                  # Optional — templates, examples
└── scripts/                 # Optional — helper scripts
```

---

## Naming

### Skill folder and `name` field

- **kebab-case**, lowercase letters, numbers, hyphens only
- **Verb-led**, describes the capability: `managing-tasks`, `deploying-cloudflare-web-application`, `building-react-web-application`
- Max **64 characters** for `name`
- Folder name matches `name` in frontmatter

### Reference files (`references/`)

- **kebab-case** `.md` files
- **`<verb>-<noun>.md`** — action or concern as the prefix

| Prefix | Use for |
| --- | --- |
| `creating-` | New artifact or setup |
| `updating-` | Amend existing artifact |
| `reviewing-` | Read-only review workflow |
| `executing-` | Run or continue work |
| `managing-` | Ongoing patterns, structure, state |
| `configuring-` | Platform or tool configuration |
| `discovering-` | Repo inspection and resolution |
| `troubleshooting-` | Failure diagnosis and fixes |
| `*-contract.md` | Shared layout, fields, and conventions for that skill |

Examples: `creating-task.md`, `discovering-application.md`, `task-contract.md`.

### Assets and scripts

- **assets/** — templates users or agents copy (`plan.md`, `style-guide.md`)
- **scripts/** — executable helpers; name by what they do (`add-registry-component.cjs`)

---

## `SKILL.md` structure

### YAML frontmatter (required)

```yaml
---
name: skill-name
description: What the skill does and when to use it — third person, includes trigger terms.
version: 1.0.0   # optional but recommended for workflow skills
---
```

| Field | Rules |
| --- | --- |
| `name` | Same as folder name; kebab-case |
| `description` | Non-empty; **what** + **when**; discovery-friendly keywords; third person |
| `version` | Semver when the skill has a defined workflow contract |

### Body — one structure for every skill

Every `SKILL.md` uses the **same major sections in the same order**. Skill-specific content goes in **subsections** under the major section it belongs to — not as extra top-level headings.

```markdown
# <Human title>

## Overview
## Agent workflow
## Reference index
## Templates          # omit section entirely if no assets/
```

#### Major sections

| Section | Required | Purpose |
| --- | --- | --- |
| **Overview** | Yes | One short paragraph: outcome, mechanism, or stack. Optional `### Tech stack` subsection when context is needed up front. |
| **Agent workflow** | Yes | Triggers, scope, routing rule, and how the agent proceeds. Always the routing hub — absorbs what would otherwise be a separate “when to use” section. |
| **Reference index** | Yes | Full catalog of `references/` files. Single table: Doc \| When to use (add Purpose or Layer columns when helpful). |
| **Templates** | If `assets/` exists | Links to copyable templates under `assets/`. |

Omit **Templates** when the skill has no `assets/`. Do not add **Examples** sections to `SKILL.md` — put scenarios in reference docs; put platform URLs in the reference doc **References** section or inline where a step needs them.

#### Subsections under **Agent workflow**

Pick the subsections the skill needs. Use **only** these names for consistency:

| Subsection | Use when |
| --- | --- |
| `### Steps` | Linear end-to-end process (deploy, bootstrap). Numbered steps in order; link to references per step. |
| `### Recipes` | Multiple intents. Table: Intent \| Example phrasing \| Read → reference. Include the routing rule here: match one row, open that reference. |
| `### Entry points` | Several ways into a large convention set. Table: Entry \| When \| Go to. |
| `### Task types` | Task-shaped bundles of references. Table: Task type \| Docs. |
| `### Decision tree` | Branching ASCII tree when choices are easier to scan as a tree than as steps. |

A skill may combine subsections (e.g. **Steps** + **Decision tree** for deploy; **Entry points** + **Task types** for framework skills). A recipe-only skill may use **Recipes** alone with no **Steps**.

Put the **routing rule** in **Agent workflow** intro (one or two sentences before subsections): triggers, scope, environment note, then how to proceed — e.g. “Follow this skill for task folders under `<tasks-root>/`. Match one **Recipes** row; open exactly that reference.”

#### Subsections under **Reference index**

| Subsection | Use when |
| --- | --- |
| `### Contract` | Link to `*-contract.md` for shared layout, frontmatter, or on-disk markers. |

Do not duplicate the recipe table here — **Recipes** routes; **Reference index** catalogs.

#### Mapping current skills → unified structure

| Skill type | Agent workflow subsections | Notes |
| --- | --- | --- |
| Deploy / linear workflow | Steps, Decision tree | Former “What this skill covers” merges into Reference index |
| Recipe collection | Recipes | Contract under Reference index |
| Framework / conventions | Entry points, Task types | Tech stack under Overview |

#### Minimal skeleton

```markdown
# Human title

One paragraph: what this skill achieves and how.

## Agent workflow

Follow this skill for … Works wherever the agent can read and write repository files. Match one **Recipes** row; open exactly that reference.

### Recipes

| Intent | Example phrasing | Read |
| --- | --- | --- |
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

### `SKILL.md` constraints

- Stay under **~500 lines**; move detail to `references/`
- Tables route agents to the **one** reference to open for the current intent
- Link only to files under the same skill directory

---

## Reference document structure

References are **recipes or deep dives** the agent reads after `SKILL.md` routes to them. Every reference uses the **same major sections in the same order**. Skill-specific content goes in **`###` subsections** under the major section it belongs to — especially under **Guidelines**.

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

Omit optional sections when they do not apply. Do not add other top-level sections.

### Major sections

| Section | Required | Purpose |
| --- | --- | --- |
| **Overview** | Yes | What this reference does, when to run it, and the mode boundary. Start with a **mode line** when the doc mutates files or is read-only (see below). One short paragraph; bullets for triggers if needed. |
| **Prerequisites** | Optional | What must be resolved or read first — contract links, upstream docs, repo paths, dashboard access, prerequisite files. |
| **Guidelines** | Yes | **Main content.** Procedures, rules, tables, decision trees, checklists, troubleshooting phases, and contract definitions. Use `###` subsections; numbered steps (`### 1.` … `### N.`) for lifecycle recipes. |
| **Setup** | Optional | One-time bootstrap separate from the main procedure — install packages, minimum config, env vars, initialize a root folder. |
| **Examples** | Optional | Copy-paste samples: code, config snippets, filled templates, report formats. |
| **Related** | Optional | Links to other references or `assets/` in the **same skill** only. |
| **References** | Optional | External platform or spec URLs (official docs, API docs, third-party specifications). |

**Why this scales:** recipe docs put numbered steps in **Guidelines**; contract docs put every field and layout rule in **Guidelines**; framework docs put decision trees and placement rules in **Guidelines**; troubleshooting puts phase groups and symptom tables in **Guidelines**. **Related** and **References** stay separate so in-skill navigation and external URLs do not mix with procedural content.

### Mode line (in Overview)

Place the mode line as the **first line** of **Overview**:

| Mode | Use for |
| --- | --- |
| `**Planning only.**` | Task/spec planning; no implementation |
| `**Docs only.**` | Writes or amends markdown specs only |
| `**Authoring mode.**` | Creates docs, style guides, or design handoff files |
| `**Review mode.**` | Read-only review unless the user asks to apply edits |
| `**Execution mode.**` | Implements the current task step |
| `**Read-only.**` | Status, triage, or check — no file mutations |
| `**Backlog execution mode.**` | Multi-task orchestration loop |

### Common `###` subsections under Guidelines

Use only what the reference needs:

| Subsection | Use for |
| --- | --- |
| `### 1.` … `### N.` | Lifecycle recipes — resolve → gather → act → sync → confirm |
| `### Decision tree` | Routing table before a deep dive |
| `### Confirm to the user` | Final recipe step — paths, summary, follow-up (or use `### N.` for this) |
| Topic headings | Contract fields, troubleshooting phases (`### Build fails`), review checklist groups |

### Mapping reference kinds → sections

| Kind | Filename prefix | Overview | Prerequisites | Guidelines | Setup | Examples | Related | References |
| --- | --- | --- | --- | --- | --- | --- | --- | --- |
| Lifecycle recipe | `creating-`, `updating-`, `executing-`, … | Mode + purpose | Contract / path resolve | Numbered steps | — | — | — | — |
| Contract | `*-contract.md` | What the contract governs | — | Signatures, layout, fields, resolve rules | Init procedures (if any) | — | — | — |
| Review | `reviewing-` | Mode + scope | Link to creating doc | Steps + checklist `###` groups | — | Report template | Creating doc | — |
| Discovery | `discovering-` | When to run | — | Numbered discovery phases + checklist | — | Path/command samples | — | — |
| Configuring | `configuring-` | Platform + goal | Dashboard/repo state | Settings tables, field reference | Install, minimum config | Filled settings examples | — | Platform docs |
| Troubleshooting | `troubleshooting-` | When to use | — | Phase groups + symptom tables | — | Debug commands (optional) | — | Platform docs |
| Convention / guide | `managing-`, `creating-*` (framework) | What this guide covers | Required reading | Rules, placement, naming, trees | Install / bootstrap | Code samples | Linked refs | External docs (optional) |

### Title and filename

- **Filename:** kebab-case with verb prefix (`creating-task.md`, `discovering-application.md`).
- **Title:** `# <Action>` — title case with spaces. Derive from the filename: drop `.md`, replace hyphens with spaces, capitalize each word. Preserve acronyms and code terms (`API`, `UI`, `E2E`, `PRD`, `GitHub`, `className`). Example: `managing-project-structure.md` → `# Managing Project Structure`.

### Cross-links

- Recipe → contract: link from **Prerequisites** or step 1 in **Guidelines**
- Recipe → asset: `[../assets/plan.md](../assets/plan.md)` from a Guidelines step
- In-skill navigation: **Related** section — not mixed into **Guidelines**
- External URLs: **References** section — not mixed into **Guidelines**
- Keep links **flat** — same skill only; no reference → reference → reference chains

### Minimal skeletons

**Framework guide** (matches building-react references):

```markdown
# Creating Component

## Overview

Start here for any component work. Read the decision tree, then open only the linked guide for your case.

## Prerequisites

- [managing-project-structure.md](./managing-project-structure.md) when folder placement is unclear

## Guidelines

### Decision tree
…

### Placement
…

### Shared rules
…

## Related

- [creating-ui-component.md](./creating-ui-component.md)
- [managing-state.md](./managing-state.md)
```

**Lifecycle recipe:**

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

**Contract:**

```markdown
# Task Contract

## Overview

Shared layout and field meanings for all managing-tasks workflows.

## Guidelines

### Author signature
…

### Output layout
…

### Resolve tasks root
…
```

**Review:**

```markdown
# Reviewing PRD

## Overview

**Review mode.** Read-only unless the user asks to apply edits.

## Prerequisites

Authoring standards: [creating-prd.md](./creating-prd.md).

## Guidelines

### Workflow
1. Read the full `prd.md`.
2. Run the checklist below.
3. Deliver feedback using the examples template.

### Checklist — structure
…

## Examples

### Report template
…

## Related

- [creating-prd.md](./creating-prd.md)
```

**Configuring:**

```markdown
# Configuring GitHub Integration

## Overview

Dashboard settings after local validation passes.

## Guidelines

### Settings reference
…

## Setup

### Connect repository
…

## Examples

### Working directory examples
…

## References

- [GitHub integration](https://supabase.com/docs/guides/deployment/branching/github-integration)
```

### Reference constraints

- Prefer tables and bullets over long prose
- Put **Confirm to the user** as the last `###` under **Guidelines** for mutating recipes
- Mode line in **Overview** carries the boundary; avoid repeating it in every step

---

## `agents/openai.yaml`

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
| `default_prompt` | Uses `$<name>` from frontmatter; lists when to invoke |

Use `.yaml` extension (existing convention in this repo). Content is the same if your tooling expects `.yml`.

---

## Skill independence

| Rule | Detail |
| --- | --- |
| No cross-skill links | Do not link to `skills/other-skill/...` or tell the agent to load another catalog skill |
| Repeat minimal context | If two skills need the same fact, state it briefly in each skill or link from **References** to external docs |
| External skills | May mention third-party or user-installed skills only as optional context, not as dependencies |

A user may install one skill without the rest of the catalog. Each skill must stand alone.

---

## Checklist before merge

- [ ] `skills/<name>/SKILL.md` has valid frontmatter (`name`, `description`)
- [ ] `skills/<name>/agents/openai.yaml` present and aligned with `name` / `description`
- [ ] Reference files use kebab-case filenames and verb prefixes; body uses Overview → Prerequisites → Guidelines → Setup → Examples → Related → References (omit empty sections)
- [ ] `SKILL.md` uses Overview → Agent workflow → Reference index (→ Templates if `assets/`); skill-specific blocks are subsections only
- [ ] No links to other skills under `skills/`
- [ ] Active voice, concise tables, mode lines instead of repeated negatives
