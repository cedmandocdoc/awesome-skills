# Creating Design

## Overview

**Authoring mode.** Creates or amends `design.md` — the single visual system document for this skill.

Follows the [DESIGN.md format specification](https://stitch.withgoogle.com/docs/design-md/specification.md) (YAML front matter + canonical markdown sections) while using this skill’s token naming (shadcn semantic colors, `text-*`, `space-*`, `radius-*`). Structure from [`../assets/design.md`](../assets/design.md).

**Delivery:** Write `design.md` to disk by default. Paste the full body in chat only when the user asks for in-chat delivery.

## Prerequisites

Gather or confirm:

1. **Brand direction** — mood, references, light/dark intent
2. **Brand colors** — primary, neutrals, semantic colors, or permission to use shadcn neutral defaults
3. **Typography** — font families, or permission to use default `font-brand` / `font-body` stack
4. **Density and layout** — compact vs spacious, mobile-first vs desktop-first, or permission to use default spacing and breakpoints
5. **Product name** — for YAML `name` and document title
6. **Component inventory** (optional) — from UI specs or user input; enriches `## Components` and YAML `components:`
7. **Motion / accessibility notes** (optional) — from product specs when present

If inputs are thin, ask briefly then proceed with convention defaults and note any `[TBD]` values in the delivery summary. Do not invent brand colors without user input unless they explicitly accept defaults.

## Guidelines

### When to use

- User asks for a style guide, design tokens, visual language, or `design.md`
- Design prompts (Claude Design, Stitch, Figma Make) need a visual system file
- User supplies a foreign guide to normalize into DESIGN.md format

### Official spec compliance

Follow the [DESIGN.md format specification](https://stitch.withgoogle.com/docs/design-md/specification.md):

- **Two layers:** YAML front matter (`---` delimiters) + markdown body with `##` sections
- **Section order:** Overview → Colors → Typography → Layout → Elevation & Depth → Shapes → Components → Do's and Don'ts. Omit only when truly irrelevant; never reorder
- **Tokens are normative** in YAML; prose explains roles and usage
- **Token references** in YAML use `{path.to.token}` (e.g. `{colors.primary}`, `{rounded.radius-md}`)
- **Component variants** are separate keys (`button-primary`, `button-primary-hover`), not nested objects
- **Valid component properties:** `backgroundColor`, `textColor`, `typography`, `rounded`, `padding`, `size`, `height`, `width`
- **Unknown token names** are allowed when values are valid — use this skill’s naming conventions below

Optional validation after write:

```bash
npx @google/design.md lint design.md
```

### Convention selection

**Before generating**, determine inputs and normalize to the canonical token system below.

| Situation | Action |
| --- | --- |
| User provides a custom or foreign style guide | **Parse and normalize** — map values onto canonical token names in [Color](#color-token-convention-shadcn), [Typography](#typography-token-convention), and [Layout](#layout-token-convention). Record original names in the delivery summary if useful. |
| User names another framework (Material, Tailwind palette) as the **target** output | Map framework roles onto the same canonical structure; use framework names only when the user explicitly requires them as-is. |
| Existing `design.md` on disk | Amend in place; preserve section order and token naming. |
| No existing system | Use all defaults in the convention sections below. |

### Parsing foreign guides

When the user supplies an existing guide (markdown, Figma tokens, CSS variables, Tailwind config, etc.):

1. **Extract** — colors, type styles, spacing, radii, shadows, breakpoints, motion, a11y notes, and theme/mood prose.
2. **Map colors** — foreign names → canonical shadcn semantic tokens (`primary`, `muted-foreground`, etc.).
3. **Map typography** — foreign sizes/weights → `text-{variant}-{size}` in YAML; record `font-{group}` / `font-{weight}` in Overview tables.
4. **Map layout** — foreign spacing → `space-*`; radii → `radius-*`; shadows → `elevation-*` (prose); breakpoints → `bp-*` (Layout prose).
5. **Preserve theme prose** — mood, references, do/don't → Overview and Do's and Don'ts.
6. **Fill template** — every required YAML group and all eight `##` sections in [`design.md`](../assets/design.md).
7. **Flag unmapped values** — list in delivery summary as `[TBD]` or propose new tokens following the same naming patterns.

### Workflow

1. **Detect existing system** — search user inputs, repo, and linked docs for an existing `design.md` or foreign guide.
2. **Parse and normalize** — if a foreign guide exists, run [Parsing foreign guides](#parsing-foreign-guides).
3. **Read conventions** — color, typography, and layout sections when defaults apply.
4. **Map brand inputs** — assign colors to semantic roles; fonts to families; density to spacing scale.
5. **Build YAML front matter** — concrete values under `colors`, `typography`, `rounded`, `spacing`, `components` using canonical keys.
6. **Draft markdown body** — fill canonical sections; include dark mode, breakpoints, elevation, motion, and a11y where inputs support them.
7. **Write file** — save as `design.md` at the agreed path. **Always ask** before writing unless the user already gave a path. Default: `design/design.md`.
8. **Summarize in chat** — path, one-line summary, unmapped tokens, lint result if run.

### Color token convention (shadcn)

Default color naming. Based on [shadcn theming](https://ui.shadcn.com/docs/theming.md).

#### Principles

1. **Semantic tokens, not palette slots** — name by role (`primary`, `muted-foreground`), not by hue (`blue-500`).
2. **Background / foreground pairs** — each surface token pairs with a `-foreground` token for text and icons on that surface.
3. **Light and dark** — YAML holds light-mode (or sole-mode) values; dark counterparts go in `## Colors` prose when dark mode applies.
4. **No raw hex in downstream specs** — reference token names only; values live in YAML / Colors prose.

#### Token naming pattern

| Pattern | Example | Controls |
| --- | --- | --- |
| `{surface}` | `background`, `card`, `primary` | Surface / fill color |
| `{surface}-foreground` | `foreground`, `card-foreground`, `primary-foreground` | Text and icons on that surface |
| `{role}` (standalone) | `border`, `input`, `ring`, `destructive` | Borders, inputs, focus rings, destructive emphasis |
| `chart-{n}` | `chart-1` … `chart-5` | Chart and data-viz palette |
| `sidebar-*` | `sidebar`, `sidebar-primary`, `sidebar-border` | Sidebar-specific surfaces (add to YAML when used) |

#### Standard token catalog

Use the full set unless the project explicitly omits tokens (e.g. no sidebar / charts). Defaults when the user has not supplied brand colors:

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

When the user supplies brand hex values, map them onto these semantic roles and record hex (or converted oklch) in YAML.

### Typography token convention

#### Token categories

| Category | Pattern | Example | Where |
| --- | --- | --- | --- |
| Type scale | `text-{variant}-{size}` | `text-body-base`, `text-heading-lg` | YAML `typography:` |
| Weight | `font-{weight}` | `font-body-medium`, `font-body-semibold` | Overview tables |
| Family / group | `font-{group}` | `font-body`, `font-brand` | Overview tables; resolve into YAML `fontFamily` |

#### Default type scale (YAML keys)

| Token | Size | Line height | Letter spacing | Usage |
| --- | --- | --- | --- | --- |
| `text-heading-xl` | 30px | 1.2 | 0 | Landing hero headline |
| `text-heading-lg` | 24px | 1.25 | 0 | Step titles, success hero |
| `text-heading-md` | 20px | 1.3 | 0 | Section group titles |
| `text-body-lg` | 18px | 1.5 | 0 | Landing value prop body |
| `text-body-base` | 16px | 1.5 | 0 | Default body, button labels |
| `text-body-sm` | 14px | 1.43 | 0 | Helper copy, secondary text |
| `text-label` | 14px | 1.3 | 0 | Field labels |
| `text-label-xs` | 12px | 1.33 | 0 | Captions, progress labels |

Convert line-height percentages to unitless ratios in YAML (e.g. 150% → `1.5`).

#### Default font families

| Token | Family | Fallback | Usage |
| --- | --- | --- | --- |
| `font-brand` | Cherry Bomb One | cursive, sans-serif | Wordmark only |
| `font-body` | Bricolage Grotesque | system-ui, sans-serif | All UI and marketing text except wordmark |

#### Default font weights

| Token | Weight | Usage |
| --- | --- | --- |
| `font-body` | 400 | Default UI text |
| `font-body-medium` | 500 | Emphasized body, active nav labels |
| `font-body-semibold` | 600 | Subheadings, button labels, table headers |
| `font-body-bold` | 700 | Strong emphasis within body scale |

#### Default pairing rules

| Element | Type scale | Weight | Family |
| --- | --- | --- | --- |
| Page / hero headline | `text-heading-xl` | `font-body-bold` | `font-body` |
| Section title | `text-heading-md` | `font-body-semibold` | `font-body` |
| Body copy | `text-body-base` | `font-body` | `font-body` |
| Field label | `text-label` | `font-body-medium` | `font-body` |
| Caption / metadata | `text-label-xs` | `font-body` | `font-body` |
| Wordmark | `text-heading-lg` or custom | `font-body` | `font-brand` |

Resolve each YAML typography entry’s `fontFamily` and `fontWeight` from pairing rules.

### Layout token convention

#### Spacing (`space-*` in YAML `spacing:`)

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

Also set `gutter` and `margin` from grid defaults when defined.

#### Grid defaults (Layout prose)

- Page max width: 1280px centered (adjust per product type)
- Content column: 720px for forms; 12-column grid for dashboards
- Gutter: `space-6` → YAML `spacing.gutter`
- Section rhythm: `space-12` between major blocks; `space-6` within cards

#### Elevation (`elevation-*` — Layout / Elevation prose only)

| Token | Default shadow | Usage |
| --- | --- | --- |
| `elevation-0` | none | Flat surfaces |
| `elevation-1` | `0 1px 2px rgb(0 0 0 / 5%)` | Cards, dropdowns |
| `elevation-2` | `0 4px 6px rgb(0 0 0 / 7%)` | Popovers, sticky headers |
| `elevation-3` | `0 10px 15px rgb(0 0 0 / 10%)` | Modals, drawers |
| `elevation-4` | `0 20px 25px rgb(0 0 0 / 12%)` | Toasts, top-level overlays |

Focus ring: 2px outline using `ring` color token, 2px offset.

#### Roundness (`radius-*` in YAML `rounded:`)

| Token | Default | Usage |
| --- | --- | --- |
| `radius-sm` | 4px | Chips, small badges |
| `radius-md` | 6px | Buttons, inputs |
| `radius-lg` | 8px | Cards, panels |
| `radius-xl` | 12px | Modals, large containers |
| `radius-full` | 9999px | Avatars, pills |

#### Breakpoints (`bp-*` — Layout prose)

| Token | Default min width | Layout behavior |
| --- | --- | --- |
| `bp-mobile` | 0 | Single column |
| `bp-tablet` | 768px | Collapsible sidebar, 2-column where needed |
| `bp-desktop` | 1024px | Persistent sidebar, multi-column dashboards |
| `bp-wide` | 1280px | Max-width container centered |

Adaptation rules and touch/pointer guidance go under `## Layout`.

### Components

Derive from tokens when UI specs do not define component-level detail:

| Component key | Typical mapping |
| --- | --- |
| `button-primary` | `backgroundColor: "{colors.primary}"`, `textColor: "{colors.primary-foreground}"`, `typography: "{typography.text-label}"`, `rounded: "{rounded.radius-md}"` |
| `button-primary-hover` | accent or darkened primary |
| `button-secondary` | secondary tokens |
| `input-default` | background / foreground; `rounded.radius-md`; `text-body-base` |
| `card-default` | `card` / `card-foreground`; `rounded.radius-lg`; padding from `space-8` |

Add keys from product inventory (chips, lists, checkboxes, etc.) using the property whitelist.

Put **Interaction & motion** under `## Components` (table: Interaction \| Behavior \| Duration). Put expanded **accessibility** guardrails in `## Do's and Don'ts`.

### Output contract

The file must include:

1. Valid YAML front matter with at least `name`, `colors`, `typography`, `rounded`, `spacing`
2. All eight canonical `##` sections in order (content may be brief but present)
3. Canonical token names from this recipe — not ad-hoc aliases
4. No duplicate `##` headings
5. Concrete values — no `[...]` placeholders in final output

### Filling rules

1. **Normalize foreign names** — map onto canonical tokens unless the user explicitly requires foreign names preserved.
2. **Light-first YAML** — dark mode documented in Colors prose when both modes exist.
3. **Separate concerns** — size in `text-*`; weight/family documented in Overview and resolved into YAML fields; spacing in `space-*`; corners in `radius-*`.
4. **Reference syntax** — component YAML uses `{colors.*}`, `{typography.*}`, `{rounded.*}`; not raw hex in component tokens when a color token exists.
5. **Components before handoff** — ensure `button-primary`, `input-default`, and `card-default` at minimum when building for design-tool prompts.
6. **No duplicate naming** — one canonical name per token.

### Output format

1. **Path** — repo-relative path to `design.md`
2. **Summary** — product name, token counts, any normalized mappings
3. **Gaps** — unmapped tokens, missing component variants, `[TBD]` values, lint warnings
4. **Lint** — note if `@google/design.md lint` was run and result

### Confirm to the user

Reply with file path, convention used, upstream inputs read, and suggested next step ([creating-design-prompts.md](./creating-design-prompts.md), or feature `ui-specs.md` for view states when product specs are in progress).

### Follow-up updates

When the user revises visual tokens, update `design.md` in place using the same output contract. Keep downstream design prompt folders consistent with YAML keys.

## Related

- [creating-design-prompts.md](./creating-design-prompts.md) — shared application-design prompts gated on this `design.md`

## References

- [DESIGN.md format specification](https://stitch.withgoogle.com/docs/design-md/specification.md)
- [shadcn theming](https://ui.shadcn.com/docs/theming.md)
- [`@google/design.md` CLI](https://www.npmjs.com/package/@google/design.md)
