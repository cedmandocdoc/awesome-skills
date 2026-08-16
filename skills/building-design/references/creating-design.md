# Creating Design

## Overview

**Authoring mode.** Creates or amends `design.md` — the single visual system for this skill. Follows the [DESIGN.md format specification](https://stitch.withgoogle.com/docs/design-md/specification.md) with this skill’s token naming (shadcn semantic colors, `text-*`, `space-*`, `radius-*`). Structure from [`../assets/design.md`](../assets/design.md).

Write `design.md` to disk by default. Paste the full body in chat only when the user asks.

## Prerequisites

Per [design-contract.md](./design-contract.md) → **Resolve design root**. Gather or confirm:

| Input | Required | Notes |
| --- | --- | --- |
| Brand direction | Yes | Mood, references, light/dark intent |
| Brand colors | Yes | Primary, neutrals, semantic — or permission to use shadcn neutral defaults |
| Typography | Yes | Families — or permission to use default `font-brand` / `font-body` |
| Density and layout | Yes | Compact vs spacious, mobile-first vs desktop-first — or defaults |
| Product name | Yes | YAML `name` and document title |
| Component inventory | Optional | When the user names components — enriches `## Components` and YAML `components:` |
| Motion / accessibility | Optional | When the user provides them |

If inputs are thin: ask briefly, proceed with convention defaults, note `[TBD]` in the delivery summary. Ask before inventing brand colors unless the user accepts defaults.

## Guidelines

### 1. Resolve design root

Per [design-contract.md](./design-contract.md) → **Resolve design root**. Initialize when no `index.md` marker exists.

### 2. Detect existing system

Search user inputs, repo, and linked docs for a foreign guide. Treat `<design-root>/design.md` as the owned system when it exists.

| Situation | Action |
| --- | --- |
| Foreign / custom style guide | Parse and normalize onto canonical tokens below; record original names in the delivery summary if useful |
| User names another framework as **target** output | Map framework roles onto the same canonical structure; keep framework names only when the user requires them as-is |
| Existing `<design-root>/design.md` | Amend in place; preserve section order and token naming |
| No existing system | Use all defaults in the convention sections below |

### 3. Parse foreign guides

When the user supplies an existing guide (markdown, Figma tokens, CSS variables, Tailwind config, etc.):

1. **Extract** — colors, type, spacing, radii, shadows, breakpoints, motion, a11y, theme/mood prose
2. **Map colors** → shadcn semantic tokens (`primary`, `muted-foreground`, …)
3. **Map typography** → `text-{variant}-{size}` in YAML; `font-{group}` / `font-{weight}` in Overview tables
4. **Map layout** → `space-*`, `radius-*`, `elevation-*` (prose), `bp-*` (Layout prose)
5. **Preserve theme prose** → Overview and Do's and Don'ts
6. **Fill template** — every required YAML group and all eight `##` sections in [`design.md`](../assets/design.md)
7. **Flag unmapped values** — `[TBD]` or propose tokens matching naming patterns

### 4. Build `design.md`

1. Map brand inputs onto semantic roles, font families, and spacing density
2. Build YAML front matter — concrete values under `colors`, `typography`, `rounded`, `spacing`, `components` using canonical keys
3. Draft markdown body — all eight canonical sections; include dark mode, breakpoints, elevation, motion, and a11y where inputs support them
4. Write `<design-root>/design.md`
5. Sync [design-contract.md](./design-contract.md) → **Hub sync**

Optional validation:

```bash
npx @google/design.md lint design.md
```

### 5. Output contract

| Rule | Detail |
| --- | --- |
| Layers | YAML front matter (`---` delimiters) + markdown body with `##` sections |
| Section order | Overview → Colors → Typography → Layout → Elevation & Depth → Shapes → Components → Do's and Don'ts. Omit only when truly irrelevant; never reorder |
| Tokens | Normative in YAML; prose explains roles. References use `{path.to.token}` |
| Component variants | Separate keys (`button-primary-hover`), not nested objects |
| Valid component properties | `backgroundColor`, `textColor`, `typography`, `rounded`, `padding`, `size`, `height`, `width` |
| Required YAML groups | At least `name`, `colors`, `typography`, `rounded`, `spacing` |
| Naming | Canonical tokens from this recipe — one name per token; unknown names allowed when values are valid |
| Concrete values | No `[...]` placeholders in final output |
| Light-first YAML | Dark mode in Colors prose when both modes exist |
| Concerns | Size in `text-*`; weight/family in Overview + YAML fields; spacing in `space-*`; corners in `radius-*` |
| Component refs | `{colors.*}`, `{typography.*}`, `{rounded.*}` — not raw hex when a color token exists |
| Prompt / preview handoff minimum | `button-primary`, `input-default`, `card-default` when building for design-tool prompts or HTML boards |

### Color token convention (shadcn)

Based on [shadcn theming](https://ui.shadcn.com/docs/theming.md).

| Principle | Practice |
| --- | --- |
| Semantic names | Role (`primary`, `muted-foreground`), not hue (`blue-500`) |
| Surface pairs | Each surface pairs with a `-foreground` token |
| Light and dark | YAML = light (or sole) mode; dark counterparts in `## Colors` when dark mode applies |
| Downstream specs | Token names only; values live in YAML / Colors prose |

| Pattern | Example | Controls |
| --- | --- | --- |
| `{surface}` | `background`, `card`, `primary` | Surface / fill |
| `{surface}-foreground` | `foreground`, `card-foreground` | Text and icons on that surface |
| `{role}` | `border`, `input`, `ring`, `destructive` | Borders, inputs, focus, destructive |
| `chart-{n}` | `chart-1` … `chart-5` | Data-viz palette |
| `sidebar-*` | `sidebar`, `sidebar-primary` | Sidebar surfaces (add when used) |

Use the full set unless the project omits tokens (e.g. no sidebar / charts). Defaults when brand colors are not supplied:

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

Map user-supplied brand hex onto these roles; record hex or converted oklch in YAML.

### Typography token convention

| Category | Pattern | Example | Where |
| --- | --- | --- | --- |
| Type scale | `text-{variant}-{size}` | `text-body-base`, `text-heading-lg` | YAML `typography:` |
| Weight | `font-{weight}` | `font-body-medium` | Overview tables |
| Family / group | `font-{group}` | `font-body`, `font-brand` | Overview tables; resolve into YAML `fontFamily` |

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

| Token | Family | Fallback | Usage |
| --- | --- | --- | --- |
| `font-brand` | Cherry Bomb One | cursive, sans-serif | Wordmark only |
| `font-body` | Bricolage Grotesque | system-ui, sans-serif | All UI and marketing text except wordmark |

| Token | Weight | Usage |
| --- | --- | --- |
| `font-body` | 400 | Default UI text |
| `font-body-medium` | 500 | Emphasized body, active nav labels |
| `font-body-semibold` | 600 | Subheadings, button labels, table headers |
| `font-body-bold` | 700 | Strong emphasis within body scale |

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

**Grid defaults** (Layout prose): page max width 1280px centered; content column 720px for forms / 12-column for dashboards; gutter `space-6` → YAML `spacing.gutter`; section rhythm `space-12` between major blocks, `space-6` within cards.

| Token | Default shadow | Usage |
| --- | --- | --- |
| `elevation-0` | none | Flat surfaces |
| `elevation-1` | `0 1px 2px rgb(0 0 0 / 5%)` | Cards, dropdowns |
| `elevation-2` | `0 4px 6px rgb(0 0 0 / 7%)` | Popovers, sticky headers |
| `elevation-3` | `0 10px 15px rgb(0 0 0 / 10%)` | Modals, drawers |
| `elevation-4` | `0 20px 25px rgb(0 0 0 / 12%)` | Toasts, top-level overlays |

Focus ring: 2px outline using `ring` color token, 2px offset. Elevation lives in Layout / Elevation prose only (no YAML `elevation` group).

| Token | Default | Usage |
| --- | --- | --- |
| `radius-sm` | 4px | Chips, small badges |
| `radius-md` | 6px | Buttons, inputs |
| `radius-lg` | 8px | Cards, panels |
| `radius-xl` | 12px | Modals, large containers |
| `radius-full` | 9999px | Avatars, pills |

| Token | Default min width | Layout behavior |
| --- | --- | --- |
| `bp-mobile` | 0 | Single column |
| `bp-tablet` | 768px | Collapsible sidebar, 2-column where needed |
| `bp-desktop` | 1024px | Persistent sidebar, multi-column dashboards |
| `bp-wide` | 1280px | Max-width container centered |

Adaptation rules and touch/pointer guidance go under `## Layout`.

### Components

Derive from tokens when the user omits component-level detail:

| Component key | Typical mapping |
| --- | --- |
| `button-primary` | `backgroundColor: "{colors.primary}"`, `textColor: "{colors.primary-foreground}"`, `typography: "{typography.text-label}"`, `rounded: "{rounded.radius-md}"` |
| `button-primary-hover` | accent or darkened primary |
| `button-secondary` | secondary tokens |
| `input-default` | background / foreground; `rounded.radius-md`; `text-body-base` |
| `card-default` | `card` / `card-foreground`; `rounded.radius-lg`; padding from `space-8` |

Add keys from product inventory using the property whitelist. Put **Interaction & motion** under `## Components` (Interaction \| Behavior \| Duration). Put expanded accessibility guardrails in `## Do's and Don'ts`.

### 6. Confirm to the user

Reply with:

1. **Paths** — design root (via `index.md`), path to `design.md`, and whether `index.md` was newly created
2. **Summary** — product name, convention used, token counts, normalized mappings
3. **Gaps** — unmapped tokens, missing component variants, `[TBD]` values, lint result if run
4. **Next step** — [creating-design-prompts.md](./creating-design-prompts.md) or [creating-design-previews.md](./creating-design-previews.md)

### Follow-up updates

Amend `<design-root>/design.md` in place under the same output contract. Keep downstream prompt folders and preview HTML aligned with YAML keys.

## Related

- [design-contract.md](./design-contract.md) — design root, layout, static board rules
- [creating-design-prompts.md](./creating-design-prompts.md) — third-party paste prompts gated on this `design.md`
- [creating-design-previews.md](./creating-design-previews.md) — HTML screen boards gated on this `design.md`

## References

- [DESIGN.md format specification](https://stitch.withgoogle.com/docs/design-md/specification.md)
- [shadcn theming](https://ui.shadcn.com/docs/theming.md)
- [`@google/design.md` CLI](https://www.npmjs.com/package/@google/design.md)
