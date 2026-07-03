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

Omit **Templates** when the skill has no `assets/`. Do not add **Examples** or **Official docs** sections to `SKILL.md` — put scenarios in reference docs; put platform URLs in references (e.g. troubleshooting or configuring docs) or inline where a step needs them.

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

References are **recipes or deep dives** the agent reads after `SKILL.md` routes to them.

### Title line

```markdown
# <Action> — <topic>
```

Subtitle after an em dash: `# Discovering application — target app, build command, output path`.

### Opening block

1. **Mode line** (when applicable): `**Planning only.**`, `**Docs only.**`, `**Review mode.**`
2. **One sentence** — when to run this reference

### Common section patterns

Use only the sections the doc needs:

| Section | Typical use |
| --- | --- |
| Numbered steps (`## 1. …`) | Sequential workflows |
| Resolution / discovery | How to find paths, roots, or candidates in the repo |
| Tables | Options, fields, symptom → cause → action |
| Checklists | Copy-paste verification before proceeding |
| Code blocks | Commands, config snippets, templates |
| Confirm to the user | What to report before stopping |

### Contract references (`*-contract.md`)

Shared by all recipes in a skill:

- Author or domain signatures (UUIDs) when the skill owns on-disk markers
- Output layout and file tree
- Frontmatter field tables
- Resolve / find / initialize procedures

### Troubleshooting references

- Group by phase (build, deploy, runtime)
- **Symptom | Likely cause | Action** tables
- Short debugging steps; link to official logs when relevant

### Configuring / discovering references

- Prerequisites stated up front
- Minimum viable example first, then variants
- Field tables for config keys
- “Preferred order” for resolution (user input → repo files → ask)

### Review references

- Point to the creating doc for standards
- Checklist aligned with those standards
- Fixed output format (Summary, Strengths, Issues, Next steps)

### Cross-links inside a skill

- Recipe → contract: `[task-contract.md](./task-contract.md)`
- Recipe → asset: `[../assets/plan.md](../assets/plan.md)`
- Keep references **flat** — avoid chains of reference-only links

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
| Repeat minimal context | If two skills need the same fact, state it briefly in each skill or link to **official external docs** |
| External skills | May mention third-party or user-installed skills only as optional context, not as dependencies |

A user may install one skill without the rest of the catalog. Each skill must stand alone.

---

## Checklist before merge

- [ ] `skills/<name>/SKILL.md` has valid frontmatter (`name`, `description`)
- [ ] `skills/<name>/agents/openai.yaml` present and aligned with `name` / `description`
- [ ] Reference files use kebab-case and consistent verb prefixes
- [ ] `SKILL.md` uses Overview → Agent workflow → Reference index (→ Templates if `assets/`); skill-specific blocks are subsections only
- [ ] No links to other skills under `skills/`
- [ ] Active voice, concise tables, mode lines instead of repeated negatives
