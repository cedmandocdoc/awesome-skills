# Spec Contract

## Overview

Shared layout, frontmatter, resolve rules, and hub sync for all `building-product-specifications` workflows. Recipe bodies cover doc-type content only.

## Guidelines

### Model

| Level | Scope document | Companion documents |
| --- | --- | --- |
| **Product** | `prd.md` | `trd.md`, `user-story.md`, `ui-specs.md` |
| **Feature** | `frd.md` | `trd.md`, `user-story.md`, `ui-specs.md` |

One file per doc type per scope. Platform differences (web, mobile, API) live as sections inside that file — not as separate `*-<app>.md` files.

### Author signature

Static UUID identifying docs roots created by this skill:

```text
7f3a9c2e-1b4d-5e8f-a6c3-2d9e8f1b4c5a
```

Every `<docs-root>/index.md` must include this value in frontmatter `author`. Search the repository for that field to locate the docs root — do not infer the root from `prd.md`, `frd.md`, or other spec paths alone.

### Output layout

Only this skill may establish a docs root. The root is always marked by `<docs-root>/index.md`.

```text
<docs-root>/
  index.md                 # docs root marker — required; created first
  prd.md
  trd.md                   # optional: system / platform architecture
  user-story.md            # optional: product-level journeys
  ui-specs.md              # optional: shared chrome, product navigation, cross-cutting states
  features/
    <feature-slug>/
      frd.md               # feature hub — behavior + links to siblings
      trd.md
      user-story.md
      ui-specs.md           # flow, screen structure, view states for the feature
```

Templates: [`../assets/`](../assets/), including [`../assets/index.md`](../assets/index.md) for new docs roots.

### Resolve docs root

1. Search per **Finding docs root**.
2. **Decide location:**
   - **One match** → use that folder.
   - **Multiple matches** → ask which root (list full paths to each `index.md`).
   - **No match** → ask where to create the specs folder (no default path), then **Initialize docs root**.
3. Write specs only under the resolved root.

### Finding docs root

Search the repository for `index.md` files whose YAML frontmatter contains **all** of:

| Field | Value |
| --- | --- |
| `doc_type` | `docs-root-index` |
| `author` | `7f3a9c2e-1b4d-5e8f-a6c3-2d9e8f1b4c5a` (see **Author signature**) |
| `generated_by` | `building-product-specifications` **or** legacy `managing-product-specifications` |

The docs root is the parent directory of each matching `index.md` (e.g. `docs/index.md` → `docs/`). After resolving, list and read spec files only under that directory.

### Initialize docs root

When **no** valid `index.md` exists:

1. **Ask** for the target folder path (relative to repository root, e.g. `docs/`, `product-docs/`).
2. **Verify empty:**
   - Path does not exist → OK; create the directory.
   - Path exists with no files and no subdirectories → OK.
   - Path exists and is not empty → stop; ask for another path.
3. Write `<docs-root>/index.md` from [`../assets/index.md`](../assets/index.md) with the **Author signature** in `author`.
4. Proceed with the requested spec file(s) under that root.

Only this skill may create or replace `index.md`.

### Feature slug

Build from the feature title:

- lowercase, hyphens only, max ~40 chars
- drop filler words when helpful (`implement`, `the`, `a`)
- example: `User profile settings` → `user-profile-settings`

Folder: `<docs-root>/features/<feature-slug>/`.

### Path resolution

| Target | Path |
| --- | --- |
| PRD | `<docs-root>/prd.md` |
| Product TRD | `<docs-root>/trd.md` |
| Product user story | `<docs-root>/user-story.md` |
| Product UI specs | `<docs-root>/ui-specs.md` |
| FRD | `<docs-root>/features/<feature-slug>/frd.md` |
| Feature companion | `<docs-root>/features/<feature-slug>/<type>.md` |

`<type>` is one of: `trd`, `user-story`, `ui-specs`.

### Create or amend

Every create recipe handles both intents:

| Target file | Action |
| --- | --- |
| Missing | Write from the matching template; set `spec_revision: 1` |
| Exists | Read full file; apply requested changes; bump `spec_revision`; append **Spec changelog** |

Ask once before overwrite when the user said "create" and a file already exists with conflicting content the amend would replace wholesale.

### Upstream reading

| Doc | Read before drafting |
| --- | --- |
| PRD | User brief; optional project README / AGENTS.md |
| FRD | `prd.md` when present |
| Product `trd.md` / `user-story.md` / `ui-specs.md` | `prd.md` |
| Feature `trd.md` / `user-story.md` / `ui-specs.md` | `frd.md`; product companion of the same type when present |

Missing upstream: ask once whether to proceed with TBD sections or create upstream first. Facts only from user input and upstream docs.

### Frontmatter (all generated specs)

| Field | Required | Purpose |
| --- | --- | --- |
| `doc_type` | yes | `docs-root-index`, `prd`, `frd`, `trd`, `user-story`, `ui-specs` |
| `scope` | yes | `product` or `feature` |
| `feature` | feature scope | Feature slug |
| `tier` | on create | `minimal`, `standard`, or `comprehensive` |
| `spec_revision` | yes | Integer; start at `1`, bump on each amend |
| `generated_by` | yes | `building-product-specifications` |
| `author` | `docs-root-index` only | **Author signature** UUID |
| `depends_on` | when applicable | Relative paths to upstream scope docs |
| `related` | FRD hub | Map of sibling doc paths |

### Tier (depth)

| Tier | When | Behavior |
| --- | --- | --- |
| **minimal** | Spike, early idea, user says "keep it short" | Abbreviated sections from template |
| **standard** | Default | Full template sections |
| **comprehensive** | Enterprise, multi-team, user says "full spec" | Standard + appendices, extra diagrams, glossary |

Infer tier from user phrasing; if unclear, default to **standard**. On amend, keep the existing tier unless the user asks to change depth.

### Platform differences

When web, mobile, or API diverge, add a short section inside the same file (e.g. `## Web`, `## Mobile`). Omit sections that do not apply.

### Hub sync

| When | Sync |
| --- | --- |
| Feature companion created/amended and `frd.md` exists | Update `related` in FRD frontmatter and **Related documents** body |
| FRD created/amended and `prd.md` exists | Update PRD **Features** table row linking to this FRD |

```yaml
related:
  user_story: user-story.md
  ui_specs: ui-specs.md
  trd: trd.md
```

Omit keys for files that do not exist yet; add them when those files are created. If the user did not ask to update the PRD, note the suggested PRD edit in the confirmation message.

### Spec changelog

Every amend bumps `spec_revision` and appends a row to **Spec changelog** (add section if missing):

```markdown
### Spec changelog

| Rev | Date | Summary |
| --- | --- | --- |
| 2 | YYYY-MM-DD | Added API error handling to acceptance criteria |
```

### No auto-spawn

Creating or amending one spec writes **only** that file (plus required hub syncs). Suggest next docs in the confirmation; create siblings only when the user requests them.

### Separate repositories

Same layout per repo. Cross-repo links use full URLs or paths the user provides in `depends_on` / `related`.

### Diagrams

| Doc | Format |
| --- | --- |
| TRD | Mermaid `flowchart`, `sequenceDiagram`, `C4Context` for architecture and flows |
| Feature `ui-specs.md` | Mermaid `flowchart` for screen navigation; `stateDiagram-v2` when in-screen transitions are multi-branch; transition tables alone when the in-screen path is linear and short |
| Product `ui-specs.md` | Mermaid `flowchart` when documenting shared shell navigation |
