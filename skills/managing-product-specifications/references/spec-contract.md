# Spec contract

On-disk layout, naming, frontmatter, and inheritance shared by all `managing-product-specifications` workflows.

**Docs only.** Do not write application code unless the user explicitly asks in the same message.

## Model

| Level | Scope document | Companion documents (same types at that scope) |
| --- | --- | --- |
| **Product** | `prd.md` | `trd`, `user-story`, `ui-specs` |
| **Feature** | `frd.md` | `trd`, `user-story`, `ui-specs` |

**Naming:**

| Pattern | Meaning |
| --- | --- |
| `<type>.md` | Shared / high-level at that scope |
| `<type>-<app>.md` | App-specific detail (`<app>` = kebab-case slug: `web`, `mobile`, `api`) |

`<type>` is one of: `trd`, `user-story`, `ui-specs`.

## Output layout

Default docs root: `docs/` at the repository root. User may override (e.g. `product-docs/`).

```text
<docs-root>/
  prd.md
  trd.md                              # optional: platform / system architecture
  trd-<app>.md                        # app baseline (stack, structure, deploy)
  user-story.md                       # product-level user journeys (overview)
  user-story-<app>.md                 # optional: app-specific product journeys
  ui-specs.md                         # product visual language / design system
  ui-specs-<app>.md                   # optional: app platform UI conventions
  features/
    <feature-slug>/
      frd.md                          # feature hub — behavior + links to siblings
      trd.md                          # optional: cross-app feature technical design
      trd-<app>.md
      user-story.md
      user-story-<app>.md
      ui-specs.md
      ui-specs-<app>.md
```

Templates: [`../assets/`](../assets/).

## Resolve docs root

1. Search for existing specs per **Finding existing specs** below.
2. **One unique root** → use it; no need to ask.
3. **Multiple roots** → ask the user which root to use.
4. **No matches** → default to `docs/`; ask the user to confirm or specify a path.

Do not write spec files outside the resolved root unless the user explicitly overrides.

## Finding existing specs

Search for `*.md` under candidate docs roots whose frontmatter contains `generated_by: managing-product-specifications`.

Also treat these as product-level anchors when present (even without frontmatter): `<docs-root>/prd.md`, `<docs-root>/features/*/frd.md`.

For each `frd.md` match, the docs root is the parent of `features/` (e.g. `docs/features/checkout/frd.md` → root is `docs/`).

## Feature slug

Build from the feature title:

- lowercase, hyphens only, max ~40 chars
- drop filler words when helpful (`implement`, `the`, `a`)
- example: `User profile settings` → `user-profile-settings`

Folder: `<docs-root>/features/<feature-slug>/`.

If the folder already exists and the user asked to **create** (not update), stop and ask whether to overwrite or pick a new slug.

## Path resolution

| Target | Path |
| --- | --- |
| PRD | `<docs-root>/prd.md` |
| Platform TRD | `<docs-root>/trd.md` |
| App baseline TRD | `<docs-root>/trd-<app>.md` |
| Product user story | `<docs-root>/user-story.md` or `user-story-<app>.md` |
| Product UI specs | `<docs-root>/ui-specs.md` or `ui-specs-<app>.md` |
| FRD | `<docs-root>/features/<feature-slug>/frd.md` |
| Feature companion | `<docs-root>/features/<feature-slug>/<type>.md` or `<type>-<app>.md` |

When the user names an app (e.g. "checkout TRD for web"), resolve to the `-<app>` suffix. When they name only the type at feature level, resolve to the shared file (`trd.md`, `user-story.md`, `ui-specs.md`).

## Inheritance (read upstream; do not duplicate)

```text
features/<slug>/ui-specs-<app>.md
  ← features/<slug>/ui-specs.md
  ← ui-specs-<app>.md (product)
  ← ui-specs.md (product)

features/<slug>/trd-<app>.md
  ← features/<slug>/trd.md (if present)
  ← trd-<app>.md (product app baseline)
  ← trd.md (product platform, if present)

features/<slug>/user-story-<app>.md
  ← features/<slug>/user-story.md
  ← user-story-<app>.md (product, optional)
  ← user-story.md (product)
```

App baseline `trd-<app>.md` at product level describes the **whole app** (stack, repo layout, deploy). Feature `trd-<app>.md` describes **that feature in that app** and inherits the baseline.

## Frontmatter (all generated specs)

Every file this skill writes includes YAML frontmatter:

| Field | Required | Purpose |
| --- | --- | --- |
| `doc_type` | yes | `prd`, `frd`, `trd`, `user-story`, `ui-specs` |
| `scope` | yes | `product` or `feature` |
| `feature` | feature scope | Feature slug |
| `apps` | when known | List of app slugs (e.g. `[web, api]`) |
| `app` | per-app files | Single app slug when file is `*-<app>.md` |
| `tier` | on create | `minimal`, `standard`, or `comprehensive` |
| `spec_revision` | yes | Integer; start at `1`, bump on each update |
| `generated_by` | yes | `managing-product-specifications` |
| `depends_on` | when applicable | Relative paths to upstream scope docs |
| `inherits_from` | companions | Relative paths to parent-tier docs at same or product scope |
| `related` | FRD hub | Map of sibling doc paths (see creating-frd.md) |

## Prerequisites by doc type

| Doc | Must read before drafting |
| --- | --- |
| PRD | User brief; optional project README / AGENTS.md |
| FRD | `prd.md` (stub missing sections as TBD if absent and user confirms) |
| Product `trd*.md` | `prd.md` |
| Product `user-story*.md` | `prd.md` |
| Product `ui-specs*.md` | `prd.md` |
| Feature `trd*.md` | `frd.md`; product `trd*.md` chain per inheritance |
| Feature `user-story*.md` | `frd.md`; product `user-story*.md` chain |
| Feature `ui-specs*.md` | `frd.md`; product `ui-specs*.md` chain |

Missing upstream: ask once whether to proceed with TBD sections or create upstream first. Do not invent product facts unsupported by inputs.

## Tier (depth)

| Tier | When | Behavior |
| --- | --- | --- |
| **minimal** | Spike, early idea, user says "keep it short" | Abbreviated sections from template |
| **standard** | Default | Full template sections |
| **comprehensive** | Enterprise, multi-team, user says "full spec" | Standard + appendices, extra diagrams, glossary |

Infer tier from user phrasing; if unclear, default to **standard**.

## FRD hub (`related` block)

`frd.md` is the feature index. When any sibling spec is created or updated, sync `related` in frontmatter and the **Related documents** body section.

Example frontmatter:

```yaml
related:
  user_story: user-story.md
  ui_specs: ui-specs.md
  ui_specs_by_app:
    web: ui-specs-web.md
  trd: trd.md
  trd_by_app:
    web: trd-web.md
    api: trd-api.md
  product_baselines:
    trd_web: ../../trd-web.md
    ui_specs: ../../ui-specs.md
```

Omit keys for files that do not exist yet; add them when those files are created.

## PRD feature index

`prd.md` lists features with links to each `features/<slug>/frd.md`. When creating or updating an FRD, sync the PRD feature index section.

## Changelog on update

Every update bumps `spec_revision` and appends a row to **Spec changelog** (add section if missing):

```markdown
## Spec changelog

| Rev | Date | Summary |
| --- | --- | --- |
| 2 | YYYY-MM-DD | Added API error handling to acceptance criteria |
```

## No auto-spawn

Creating PRD or FRD writes **only** that file. Suggest next docs in the confirmation message; do not create sibling specs unless the user explicitly requests them in the same or a follow-up message.

## Separate repositories

Same layout per repo. Cross-repo links use full URLs or paths the user provides in `depends_on` / `related`. Product PRD in a platform repo links outward to app-repo feature paths.

## Diagrams

Use **Mermaid** in TRD files for architecture, sequence, and data-flow diagrams. Prefer `flowchart`, `sequenceDiagram`, and `C4Context` where appropriate.
