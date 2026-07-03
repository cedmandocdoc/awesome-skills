# Creating Style Guide

## Overview

**Authoring mode.** Apply when the user needs a complete visual styling guide — theme, color, typography, spacing, grid, alignment, depth, roundness, and breakpoints.

Produces markdown per [output contract](#output-contract) using [`../assets/style-guide.md`](../assets/style-guide.md).

**Delivery:** Copiable markdown in chat (default). Write a file only when the user asks for a path.

## Prerequisites

Gather or confirm:

1. **Brand direction** — mood, references, light/dark intent
2. **Brand colors** — primary, neutrals, semantic colors, or permission to use shadcn neutral defaults
3. **Typography** — font families, or permission to use default `font-brand` / `font-body` stack
4. **Density and layout** — compact vs spacious, mobile-first vs desktop-first, or permission to use default spacing and breakpoints

If inputs are thin, ask briefly then proceed with convention defaults and note any `[TBD]` values in the delivery summary. Do not invent brand colors without user input unless they explicitly accept defaults.


## Guidelines

### When to use

- User asks for a style guide, design tokens, or visual language document
- User wants to standardize naming before specs or implementation

### Convention selection

**Before generating**, determine inputs and normalize to the canonical token system below.

| Situation | Action |
| --- | --- |
| User provides a custom or foreign style guide | **Parse and normalize** — map values onto canonical token names in [Color](#color-token-convention-shadcn), [Typography](#typography-token-convention), and [Layout](#layout-token-convention) conventions. Record original names in the delivery summary if useful. |
| User names another framework (Material, Tailwind palette) as the **target** output | Map framework roles onto the same canonical structure; use framework names only when the user explicitly requires them as-is. |
| No existing system | Use all defaults in the convention sections below. |

Read the convention sections before filling the template.

### Parsing custom style guides

When the user supplies an existing guide (markdown, Figma tokens, CSS variables, Tailwind config, etc.):

1. **Extract** — colors, type styles, spacing, radii, shadows, breakpoints, and any theme/mood prose.
2. **Map colors** — foreign names → canonical shadcn semantic tokens (`primary`, `muted-foreground`, etc.). Example: `brand-500` / `--color-brand` → `primary`; `text-secondary` → `muted-foreground`.
3. **Map typography** — foreign sizes/weights → `text-{variant}-{size}` + `font-{weight}` + `font-{group}`. Example: `16px/24px regular` → `text-body-base` + `font-body`.
4. **Map layout** — foreign spacing → `space-*`; radii → `radius-*`; shadows → `elevation-*`; breakpoints → `bp-*`.
5. **Preserve theme prose** — mood, references, do/don't → §1 Visual Theme & Atmosphere.
6. **Fill template** — every section in [`style-guide.md`](../assets/style-guide.md); no skipped sections.
7. **Flag unmapped values** — list in delivery summary as `[TBD]` or propose new tokens following the same naming patterns.

### Workflow

1. **Detect existing system** — search user inputs, repo, and linked docs.
2. **Parse and normalize** — if a foreign guide exists, run [Parsing custom style guides](#parsing-custom-style-guides).
3. **Read conventions** — color, typography, and layout sections when defaults apply.
4. **Map brand inputs** — assign colors to semantic roles; fonts to `font-{group}`; density to spacing scale.
5. **Draft per output contract** — fill every row and bullet in [`style-guide.md`](../assets/style-guide.md) with concrete values.
6. **Deliver** — see [Output format](#output-format).

### Color token convention (shadcn)

Default color naming. Based on [shadcn theming](https://ui.shadcn.com/docs/theming.md).

### Principles

1. **Semantic tokens, not palette slots** — name by role (`primary`, `muted-foreground`), not by hue (`blue-500`).
2. **Background / foreground pairs** — each surface token pairs with a `-foreground` token for text and icons on that surface.
3. **Light and dark** — list both values per token when the project supports dark mode.
4. **No raw hex in downstream specs** — reference token names only; values live in §2 of the style guide.

### Token naming pattern

| Pattern | Example | Controls |
| --- | --- | --- |
| `{surface}` | `background`, `card`, `primary` | Surface / fill color |
| `{surface}-foreground` | `foreground`, `card-foreground`, `primary-foreground` | Text and icons on that surface |
| `{role}` (standalone) | `border`, `input`, `ring`, `destructive` | Borders, inputs, focus rings, destructive emphasis |
| `chart-{n}` | `chart-1` … `chart-5` | Chart and data-viz palette |
| `sidebar-*` | `sidebar`, `sidebar-primary`, `sidebar-border` | Sidebar-specific surfaces and accents |

### Standard token catalog

Use the full set unless the project explicitly omits tokens (e.g. no sidebar). See default values in the prior version — light (`:root`) and dark (`.dark`) oklch tables apply when the user has not supplied brand colors:

| Token | Light default | Dark default |
| --- | --- | --- |
| `background` | `oklch(1 0 0)` | `oklch(0.145 0 0)` |
| `foreground` | `oklch(0.145 0 0)` | `oklch(0.985 0 0)` |
| `card` / `card-foreground` | `oklch(1 0 0)` / `oklch(0.145 0 0)` | `oklch(0.205 0 0)` / `oklch(0.985 0 0)` |
| `popover` / `popover-foreground` | same as card light | same as card dark |
| `primary` / `primary-foreground` | `oklch(0.205 0 0)` / `oklch(0.985 0 0)` | `oklch(0.922 0 0)` / `oklch(0.205 0 0)` |
| `secondary` / `secondary-foreground` | `oklch(0.97 0 0)` / `oklch(0.205 0 0)` | `oklch(0.269 0 0)` / `oklch(0.985 0 0)` |
| `muted` / `muted-foreground` | `oklch(0.97 0 0)` / `oklch(0.556 0 0)` | `oklch(0.269 0 0)` / `oklch(0.708 0 0)` |
| `accent` / `accent-foreground` | `oklch(0.97 0 0)` / `oklch(0.205 0 0)` | `oklch(0.269 0 0)` / `oklch(0.985 0 0)` |
| `destructive` | `oklch(0.577 0.245 27.325)` | `oklch(0.704 0.191 22.216)` |
| `border` | `oklch(0.922 0 0)` | `oklch(1 0 0 / 10%)` |
| `input` | `oklch(0.922 0 0)` | `oklch(1 0 0 / 15%)` |
| `ring` | `oklch(0.708 0 0)` | `oklch(0.556 0 0)` |
| `chart-1` … `chart-5` | see shadcn neutral preset | see shadcn neutral preset |
| `sidebar-*` | see shadcn neutral preset | see shadcn neutral preset |

When the user supplies brand hex values, map them onto these semantic roles and record hex (or converted oklch) in the color table.

### Typography token convention

### Token categories

| Category | Pattern | Example |
| --- | --- | --- |
| Type scale | `text-{variant}-{size}` | `text-body-base`, `text-heading-lg` |
| Weight | `font-{weight}` | `font-body-medium`, `font-body-semibold` |
| Family / group | `font-{group}` | `font-body`, `font-brand` |

### Default type scale

| Token | Size | Line height | Letter spacing | Usage |
| --- | --- | --- | --- | --- |
| `text-heading-xl` | 30px | 120% | 0 | Landing hero headline |
| `text-heading-lg` | 24px | 125% | 0 | Step titles, success hero |
| `text-heading-md` | 20px | 130% | 0 | Section group titles |
| `text-body-lg` | 18px | 150% | 0 | Landing value prop body |
| `text-body-base` | 16px | 150% | 0 | Default body, button labels |
| `text-body-sm` | 14px | 143% | 0 | Helper copy, secondary text |
| `text-label` | 14px | 130% | 0 | Field labels |
| `text-label-xs` | 12px | 133% | 0 | Captions, progress labels |

### Default font families

| Token | Family | Fallback | Usage |
| --- | --- | --- | --- |
| `font-brand` | Cherry Bomb One | cursive, sans-serif | Wordmark only |
| `font-body` | Bricolage Grotesque | system-ui, sans-serif | All UI and marketing text except wordmark |

### Default font weights

| Token | Weight | Usage |
| --- | --- | --- |
| `font-body` | 400 | Default UI text (also the family token) |
| `font-body-medium` | 500 | Emphasized body, active nav labels |
| `font-body-semibold` | 600 | Subheadings, button labels, table headers |
| `font-body-bold` | 700 | Strong emphasis within body scale |

### Default pairing rules

| Element | Type scale | Weight | Family |
| --- | --- | --- | --- |
| Page / hero headline | `text-heading-xl` | `font-body-bold` | `font-body` |
| Section title | `text-heading-md` | `font-body-semibold` | `font-body` |
| Body copy | `text-body-base` | `font-body` | `font-body` |
| Field label | `text-label` | `font-body-medium` | `font-body` |
| Caption / metadata | `text-label-xs` | `font-body` | `font-body` |
| Wordmark | `text-heading-lg` or custom | `font-body` | `font-brand` |

### Layout token convention

### Spacing (`space-*`)

| Token | Default | Usage |
| --- | --- | --- |
| `space-1` | 4px | Tight inline gaps |
| `space-2` | 8px | Icon-to-label, compact lists |
| `space-3` | 12px | Form field gaps |
| `space-4` | 16px | Card internal padding (small) |
| `space-6` | 24px | Section gaps |
| `space-8` | 32px | Card padding (default) |
| `space-12` | 48px | Page section margins |
| `space-16` | 64px | Large section breaks |

### Grid defaults

- Page max width: 1280px centered (adjust per product type)
- Content column: 720px for forms; 12-column grid for dashboards
- Gutter: `space-6`
- Section rhythm: `space-12` between major blocks; `space-6` within cards

### Elevation (`elevation-*`)

| Token | Default shadow | Usage |
| --- | --- | --- |
| `elevation-0` | none | Flat surfaces |
| `elevation-1` | `0 1px 2px rgb(0 0 0 / 5%)` | Cards, dropdowns |
| `elevation-2` | `0 4px 6px rgb(0 0 0 / 7%)` | Popovers, sticky headers |
| `elevation-3` | `0 10px 15px rgb(0 0 0 / 10%)` | Modals, drawers |
| `elevation-4` | `0 20px 25px rgb(0 0 0 / 12%)` | Toasts, top-level overlays |

Focus ring: 2px outline using `ring` color token, 2px offset (§7 other depth treatments).

### Roundness (`radius-*`)

| Token | Default | Usage |
| --- | --- | --- |
| `radius-sm` | 4px | Chips, small badges |
| `radius-md` | 6px | Buttons, inputs |
| `radius-lg` | 8px | Cards, panels |
| `radius-xl` | 12px | Modals, large containers |
| `radius-full` | 9999px | Avatars, pills |

### Breakpoints (`bp-*`)

| Token | Default min width | Layout behavior |
| --- | --- | --- |
| `bp-mobile` | 0 | Single column |
| `bp-tablet` | 768px | Collapsible sidebar, 2-column where needed |
| `bp-desktop` | 1024px | Persistent sidebar, multi-column dashboards |
| `bp-wide` | 1280px | Max-width container centered |

Adaptation rules and touch/pointer guidance go in §9 per template.

### Output contract

The markdown must include **all nine sections** from [`style-guide.md`](../assets/style-guide.md) in fixed order:

| § | Section | Required content |
| --- | --- | --- |
| 1 | Visual Theme & Atmosphere | Product feel, aesthetic, mood, references, do/don't |
| 2 | Color Palette & Roles | Full color token table (Token \| Light \| Dark \| Role); optional semantic mapping |
| 3 | Typography | Type scale, font families, font weights, pairing rules tables |
| 4 | Spacing | Full `space-*` table |
| 5 | Grid | Page max width, columns, gutter, section rhythm |
| 6 | Alignment & Density | Alignment and density bullets |
| 7 | Depth & Elevation | `elevation-*` table; focus ring and blur notes |
| 8 | Roundness | Full `radius-*` table |
| 9 | Breakpoints & Responsive Behavior | `bp-*` table; adaptation rules; touch/pointer |

### Formatting rules

- Tabular markdown for all token definitions
- Token names in backticks
- Concrete values in every cell — no `[...]` placeholders in final output
- Color values: hex or oklch (consistent within one document)
- Typography sizes: px; line heights: % or unitless ratio

### Filling rules

1. **Normalize foreign names** — map custom guides onto canonical tokens unless the user explicitly requires foreign names preserved.
2. **Light and dark pairs** — every surface token needs both mode values when dark mode applies.
3. **Separate concerns** — size in `text-*`; weight in `font-{weight}`; family in `font-{group}`; spacing in `space-*`; corners in `radius-*`.
4. **Derive from inputs** — brand values from the user; structural token names from conventions.
5. **No duplicate naming** — one canonical name per token.

### Output format

1. **Summary** — convention used and any normalized mappings from a foreign guide
2. **Copiable markdown** — full document in a single markdown code fence
3. **Gaps** — any `[TBD]` values or unmapped foreign tokens

Do **not** write a file unless the user explicitly asks for one.

### Follow-up updates

When the user revises tokens, output updated markdown using the same [output contract](#output-contract).
