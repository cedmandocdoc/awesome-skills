# Writing skills for this repository

This repository is a **catalog of installable agent skills** under `skills/`. Users download or copy a skill into their agent environment (for example `~/.cursor/skills/` or `.cursor/skills/`). Skills here are **not** loaded automatically by this repo.

Each skill installs on its own. In-skill links stay inside that skill’s directory. Installable needs go under **Dependencies**; one-time steps go under **Setup** — see **Skill independence and dependencies**.

---

## Writing strategy

A line earns its place when removing it would change what the agent does.

| Strategy | Practice |
| --- | --- |
| **Extract shared** | Instructions used in more than one place live once (a contract, or one section here) and are linked. |
| **Categorize** | Each rule lives under exactly one heading. Route with tables. |
| **State once** | A mode line or intro carries a constraint. Later sections do not repeat it. |
| **Active voice** | Imperative, present tense. Descriptions in third person. State what to do. Pair a positive with a negative only when the exception is easy to miss or safety-critical. |
| **Represent** | Match the content shape to a format (table below). Prose only for what a structure cannot express. |

| Content shape | Format |
| --- | --- |
| Ordered procedure | Numbered steps |
| Enumerable facts, options, routing | Table |
| Branching decision | Decision tree or mermaid diagram |
| Unordered rules | Bullet list |
| Anything a structure cannot express | Short prose |

| Cut | Signal |
| --- | --- |
| Noise | Background the agent already knows; content outside declared scope |
| Redundancy | Same instruction under two headings; per-section repeat of a global constraint |
| Negative redundancy | A “do not” already excluded by the positive rule |
| Motivational filler | Importance claims with no instruction |
| Commentary | “This section explains…”, authoring rationale |
| Duplicate phrases | Same qualifier on every bullet |

| Prefer | Instead of |
| --- | --- |
| “Read exactly one recipe for the user’s intent.” | “Read exactly one recipe. Do not load other recipes.” |
| “Ask the user when multiple candidates exist.” | “Do not guess when multiple candidates exist.” |
| “Stop without implementing unless the user also asks to implement.” | “Do not write application code unless …” (when the mode line already says **Planning only**) |

**Progressive disclosure:** `SKILL.md` routes. `references/` holds recipes, contracts, and long tables.

**Style:** Short sentences. Backticks for inline code, commands, and paths. Blank lines between sections.

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
- **Verb-led**, describes the capability: `managing-tasks`, `deploying-cloudflare-web-application`
- Max **64 characters** for `name`
- Folder name matches `name` in frontmatter

### Reference files (`references/`)

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
| `discovering-` | Repo inspection and resolution |
| `troubleshooting-` | Failure diagnosis and fixes |
| `*-contract.md` | Shared layout, fields, and conventions for that skill |

### Assets and scripts

- **assets/** — templates users or agents copy (`plan.md`, `design.md`)
- **scripts/** — executable helpers; name by what they do (`add-registry-component.cjs`)

---

## `SKILL.md`

### Frontmatter

```yaml
---
name: skill-name
id: 00000000-0000-4000-8000-000000000000   # UUID v4; stable identity
description: What the skill does and when to use it — third person, includes trigger terms.
version: 1.0.0   # optional but recommended for workflow skills
---
```

| Field | Rules |
| --- | --- |
| `name` | Same as folder name; kebab-case. CLI install identifier (`--skill <name>`). |
| `id` | UUID v4 that identifies **this catalog’s** skill. Generate once (`uuidgen` or `python3 -c "import uuid; print(uuid.uuid4())"`). Never reuse; never change after publish. Distinct from author / subagent signatures. |
| `description` | Non-empty; **what** + **when**; discovery-friendly keywords; third person |
| `version` | Semver when the skill has a defined workflow contract |

### Body

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
| **Dependencies** | If something must be **installed** first | One table of installable gates: Item \| Required \| When \| How. |
| **Setup** | If one-time **steps** must run first | Create agents, init a root, connect a dashboard. Not installs — those live in **Dependencies**. |
| **Agent workflow** | Yes | Triggers, scope, routing rule, and how the agent proceeds. |
| **Reference index** | Yes | Full catalog of `references/` files. Table: Doc \| When to use (add Purpose or Layer when helpful). |
| **Templates** | If `assets/` exists | Links to copyable templates under `assets/`. |

Omit **Dependencies**, **Setup**, and **Templates** when they do not apply. Scenarios live in reference docs, not an **Examples** section on `SKILL.md`.

### Dependencies

No child headings. Mix skills, tools, MCP, or any other installable in the same rows.

| Column | Content |
| --- | --- |
| Item | Name. Skill rows: GitHub URL on the name. This catalog: then `id` in backticks. Third-party skills: `name` only unless that skill publishes an `id`. |
| Required | `required` or `optional` |
| When | Recipes or entry points that need this row |
| How | Install command, docs URL, or check that implies how to install |

Every row has **How**. Skill-row identity, GitHub URL format, and discovery live in **Skill independence and dependencies**. A combined install command may sit under the table when several skills from the **same** repo are the usual path.

### Setup

No required child headings. Table: Item \| Required \| When \| How. Link How to an in-skill recipe when the step is documented there.

### Agent workflow

Intro (one or two sentences before subsections): triggers, scope, environment note, then how to proceed — e.g. “Follow this skill for task folders under `<tasks-root>/`. Match one **Recipes** row; open exactly that reference.” When **Dependencies** or **Setup** exists, resolve every **required** row before opening a recipe.

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

### Skeleton

```markdown
# Human title

One paragraph: what this skill achieves and how.

## Dependencies

Resolve every **required** row before recipes that need it.

| Item | Required | When | How |
| --- | --- | --- | --- |
| [other-skill](https://github.com/cedmandocdoc/awesome-skills/tree/main/skills/other-skill) `uuid` | required | All recipes | `npx skills add cedmandocdoc/awesome-skills --skill other-skill` |
| [pnpm](https://github.com/antfu/skills/tree/main/skills/pnpm) | required | Package and workspace recipes | `npx skills add antfu/skills --skill pnpm` |
| `pnpm` | required | All recipes | https://pnpm.io/installation |

## Setup

| Item | Required | When | How |
| --- | --- | --- | --- |
| Named agents | required | Orchestration recipes | [creating-….md](references/creating-….md) |

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

### Constraints

- Stay under **~500 lines**; move detail to `references/`
- Tables route agents to the **one** reference to open for the current intent

---

## Reference documents

References are recipes or deep dives the agent reads after `SKILL.md` routes to them. Same major sections, same order. Skill-specific content goes in **`###` subsections** under the major section it belongs to — especially under **Guidelines**.

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
| **Prerequisites** | Optional | Recipe-local: contract links, upstream docs, repo paths. Skill-wide installs live on `SKILL.md` → **Dependencies**; skill-wide steps on `SKILL.md` → **Setup**. |
| **Guidelines** | Yes | Procedures, rules, tables, decision trees, checklists, troubleshooting phases, and contract definitions. Use `###` subsections; numbered steps (`### 1.` … `### N.`) for lifecycle recipes. |
| **Setup** | Optional | One-time bootstrap separate from the main procedure — install packages, minimum config, env vars, initialize a root folder. |
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
| `### Confirm to the user` | Final recipe step — paths, summary, follow-up (or use `### N.` for this) |
| Topic headings | Contract fields, troubleshooting phases (`### Build fails`), review checklist groups |

Put **Confirm to the user** as the last `###` under **Guidelines** for mutating recipes.

### Kind map

| Kind | Filename prefix | Overview | Prerequisites | Guidelines | Setup | Examples | Related | References |
| --- | --- | --- | --- | --- | --- | --- | --- | --- |
| Lifecycle recipe | `creating-`, `updating-`, `executing-`, … | Mode + purpose | Contract / path resolve | Numbered steps | — | — | — | — |
| Contract | `*-contract.md` | What the contract governs | — | Signatures, layout, fields, resolve rules | Init procedures (if any) | — | — | — |
| Review | `reviewing-` | Mode + scope | Link to creating doc | Steps + checklist `###` groups | — | Report template | Creating doc | — |
| Discovery | `discovering-` | When to run | — | Numbered discovery phases + checklist | — | Path/command samples | — | — |
| Configuring | `configuring-` | Platform + goal | Dashboard/repo state | Settings tables, field reference | Install, minimum config | Filled settings examples | — | Platform docs |
| Troubleshooting | `troubleshooting-` | When to use | — | Phase groups + symptom tables | — | Debug commands (optional) | — | Platform docs |
| Convention / guide | `managing-`, `creating-*` (framework) | What this guide covers | Required reading | Rules, placement, naming, trees | Install / bootstrap | Code samples | Linked refs | External docs (optional) |

### Cross-links

- Recipe → contract: **Prerequisites** or step 1 in **Guidelines**
- Recipe → asset: `[../assets/plan.md](../assets/plan.md)` from a Guidelines step
- In-skill navigation: **Related**
- External URLs: **References**, or inline where a step needs them (dependency-skill GitHub URLs live in `SKILL.md` **Dependencies** / the contract)
- Links stay **one level deep** and in-skill, plus GitHub URLs to dependency skills

### Skeleton

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

## Skill independence and dependencies

A user may install one skill without the rest of the catalog. In-skill markdown links stay inside that skill’s directory.

**Dependencies** are installable needs (other skills, CLIs, MCP, or any other fetchable), each `required` or `optional`. **Setup** is one-time steps (create agents, init a root).

| Rule | Detail |
| --- | --- |
| Identity | Every skill in **this catalog** has `name` and `id` (UUID). Those dependency rows match **both**. `id` never changes after publish. Third-party skills match `name`; check `id` only if that skill publishes one. |
| Declare | `SKILL.md` → **Dependencies**, one table (Item \| Required \| When \| How). Skill rows include a GitHub URL. This catalog: also `id`. Repeat those rows in the contract with discovery. |
| GitHub URL | Full URL to the skill in its source repo: `https://github.com/<owner>/<repo>/tree/<ref>/skills/<name>`. This catalog: `https://github.com/cedmandocdoc/awesome-skills/tree/main/skills/<name>`. Relative `skills/other-skill/` links break when only one skill is installed. |
| How | Each row carries its own command or docs URL. GitHub skills: `npx skills add <owner>/<repo> --skill <name>`. Other items use that item’s install docs or CLI. |
| Discover skills | Search skill roots (project, then user-level) for `*/SKILL.md`. Same roots as agent discovery, under `skills/` not `agents/`. This catalog: accept when `name` **and** `id` match. Unique `name` with no `id` still counts (third-party or legacy). Different `id` → skip. |
| Missing required | Stop. Print that row’s **How** (for skills: command, GitHub URL, and `id` when present). Do not guess a substitute. |
| Missing optional | Continue. Open or use the item if present. |
| After find (skill) | Open the installed skill’s `SKILL.md`. Follow recipes by **intent name**. Never copy that skill’s file paths into this skill’s docs. |
| Repeat context | If two skills need the same fact, state it briefly in each, or point at external docs from **References**. |
| Third-party skills | Any GitHub skill repo (`owner/repo`). Required or optional. Discover by `name`. Include `id` in the row only if that skill publishes one. |

**Discover dependency skill** (copy into the requiring skill’s contract; keep the skill-root tables there so the skill works after install):

1. Explicit pointers — `AGENTS.md`, the user request, `@`-mentioned skills.
2. Project roots — glob `<root>/<skill-name>/SKILL.md` (`.agents/skills/`, `.cursor/skills/`, `.claude/skills/`, `.codex/skills/`, `.github/skills/`, and the other agent skill directories).
3. User-level roots — same layout under `~/` (for example `~/.cursor/skills/`, `~/.agents/skills/`). Prefer a project copy over a user copy of the same `name`.
4. Custom roots named in `AGENTS.md` or by the user.
5. Read each candidate `SKILL.md` frontmatter. This catalog: accept `name` + `id`; deduplicate by `id` (then `name`). Third-party: accept `name` when the row has no `id`.

Example installs (one `npx skills add` per source repo):

```bash
npx skills add cedmandocdoc/awesome-skills --skill delivering-goal --skill managing-tasks
npx skills add antfu/skills --skill pnpm
```

---

## Checklist before merge

- [ ] `skills/<name>/SKILL.md` has valid frontmatter (`name`, `id`, `description`)
- [ ] `skills/<name>/agents/openai.yaml` present and aligned with `name` / `description`
- [ ] Reference files use kebab-case filenames and verb prefixes; body uses Overview → Prerequisites → Guidelines → Setup → Examples → Related → References (omit empty sections)
- [ ] `SKILL.md` uses Overview → Dependencies (if any) → Setup (if any) → Agent workflow → Reference index (→ Templates if `assets/`); skill-specific blocks are subsections only
- [ ] No relative path links to other skills under `skills/`. Dependency skills use GitHub URLs; this catalog also uses `name` + `id` discovery
- [ ] Required dependencies are under **Dependencies** (one table) in `SKILL.md`; skill rows repeat in the contract with discovery. One-time steps are under **Setup**, not Dependencies.
- [ ] Each instruction appears once; mode lines carry boundaries; tables route; no noise, filler, or commentary
