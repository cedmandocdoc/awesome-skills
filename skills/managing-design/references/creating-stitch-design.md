# Creating Stitch design.md

**Authoring mode.** Apply when generating or updating `design.md` for Google Stitch from a style guide.

Produces a [DESIGN.md](https://stitch.withgoogle.com/docs/design-md/specification.md) file: YAML front matter (normative tokens) plus markdown body (rationale and usage). Structure from [`../assets/design.md`](../assets/design.md).

**Input:** A complete style guide — either produced by [creating-style-guide.md](creating-style-guide.md) or read from an existing file that follows [`../assets/style-guide.md`](../assets/style-guide.md).

**Delivery:** Write `design.md` to disk (default for Stitch handoff). Do not paste the full body in chat unless the user asks.

## When to use

- User asks for `design.md` for Google Stitch
- [creating-stitch-prompts.md](creating-stitch-prompts.md) needs visual tokens for a handoff
- User has a style guide and wants the official Stitch format

Do **not** use this recipe for standalone style guides in chat — use [creating-style-guide.md](creating-style-guide.md) instead.

## Relationship to style guide

The style guide is the **authoring format** (internal, shadcn-oriented tokens, nine fixed sections). `design.md` is the **Stitch handoff format** (official spec, YAML + eight canonical sections).

| Style guide § | DESIGN.md target |
| --- | --- |
| 1. Visual Theme & Atmosphere | `## Overview` prose; Do/Don't bullets → `## Do's and Don'ts` |
| 2. Color Palette & Roles | YAML `colors:` + `## Colors` prose |
| 3. Typography | YAML `typography:` + `## Typography` prose |
| 4. Spacing | YAML `spacing:` + `## Layout` prose |
| 5. Grid | `## Layout` prose |
| 6. Alignment & Density | `## Layout` prose |
| 7. Depth & Elevation | `## Elevation & Depth` prose |
| 8. Roundness | YAML `rounded:` + `## Shapes` prose |
| 9. Breakpoints & Responsive Behavior | `## Layout` prose (breakpoints subsection) |

[creating-style-guide.md](creating-style-guide.md) is unchanged — it still owns token conventions, parsing foreign guides, and the nine-section output contract.

## Prerequisites

1. **Complete style guide** — all nine sections filled with concrete values (from [creating-style-guide.md](creating-style-guide.md) or an existing file).
2. **Product name** — for YAML `name` and document title.
3. **Component inventory** (optional) — from UI specs; enriches `## Components` and YAML `components:`.

If the style guide is missing or thin, run [creating-style-guide.md](creating-style-guide.md) first (or its gap-filling flow via [creating-stitch-prompts.md](creating-stitch-prompts.md)).

## Official spec compliance

Follow the [DESIGN.md format specification](https://stitch.withgoogle.com/docs/design-md/specification.md):

- **Two layers:** YAML front matter (`---` delimiters) + markdown body with `##` sections.
- **Section order:** Overview → Colors → Typography → Layout → Elevation & Depth → Shapes → Components → Do's and Don'ts. Omit only when truly irrelevant; never reorder.
- **Tokens are normative** in YAML; prose explains roles and usage with descriptive names tied to token keys.
- **Token references** in YAML use `{path.to.token}` syntax (e.g. `{colors.primary}`, `{rounded.md}`).
- **Component variants** are separate keys (`button-primary`, `button-primary-hover`), not nested objects.
- **Valid component properties:** `backgroundColor`, `textColor`, `typography`, `rounded`, `padding`, `size`, `height`, `width`.

Optional validation after write:

```bash
npx @google/design.md lint design.md
```

## Workflow

1. **Obtain style guide** — generate via [creating-style-guide.md](creating-style-guide.md) or read existing file at agreed path.
2. **Parse sections** — extract tables and prose from all nine style guide sections.
3. **Build YAML front matter** — map tokens per [Token mapping](#token-mapping) below.
4. **Draft markdown body** — fill canonical sections from parsed content; use [`design.md`](../assets/design.md) as skeleton.
5. **Derive components** — map common atoms (buttons, inputs, cards) from color, typography, and rounded tokens.
6. **Write file** — save as `design.md` at agreed path.
7. **Summarize in chat** — path, one-line summary, unmapped tokens, lint result if run.

## Token mapping

### YAML metadata

| Field | Source |
| --- | --- |
| `version` | `alpha` (current spec version) |
| `name` | Product / project name from style guide title or user input |
| `description` | One line from §1 product feel or aesthetic direction |

### Colors (`colors:`)

Map every row from style guide §2 color token table into YAML. Use **light-mode values** as the primary YAML value.

| Style guide token | YAML key | Notes |
| --- | --- | --- |
| `background` | `background` | |
| `foreground` | `foreground` | |
| `primary` / `primary-foreground` | same | Keep shadcn names — spec accepts unknown token names |
| `secondary` / `secondary-foreground` | same | |
| `muted` / `muted-foreground` | same | |
| `accent` / `accent-foreground` | same | |
| `destructive` | `destructive` or `error` | Prefer `destructive` if style guide uses it |
| `border`, `input`, `ring` | same | |
| `card`, `popover`, `sidebar-*`, `chart-*` | same keys | Include when present in §2 |

Use hex or oklch strings exactly as in the style guide. For dual light/dark tables, document dark values in `## Colors` prose; YAML holds light defaults unless the product is dark-only.

### Typography (`typography:`)

Map style guide §3 type scale rows to semantic typography keys:

| Style guide token | YAML key | Fields |
| --- | --- | --- |
| `text-heading-xl` | `headline-xl` or `display` | fontFamily from pairing rules §3 |
| `text-heading-lg` | `headline-lg` | |
| `text-heading-md` | `headline-md` | |
| `text-body-lg` | `body-lg` | |
| `text-body-base` | `body-md` | |
| `text-body-sm` | `body-sm` | |
| `text-label` | `label-md` | |
| `text-label-xs` | `label-sm` or `caption` | |

For each entry set: `fontFamily`, `fontSize`, `fontWeight`, `lineHeight`, `letterSpacing`. Resolve `fontFamily` from §3 font families table via pairing rules. Resolve `fontWeight` from the weight token in pairing rules (e.g. `font-body-semibold` → `600`).

Convert line height percentages to unitless ratios (e.g. 150% → `1.5`) when possible.

### Spacing (`spacing:`)

Map style guide §4 `space-*` tokens:

| Style guide | YAML key |
| --- | --- |
| `space-1` | `xs` |
| `space-2` | `sm` |
| `space-3` | (optional `sm-md` or fold into prose) |
| `space-4` | `md` |
| `space-6` | `gutter` |
| `space-8` | `lg` |
| `space-12` | `xl` |
| `space-16` | `2xl` or `margin` |

Add `gutter` and `margin` from §5 Grid when defined. Include grid column counts as unitless numbers if useful (e.g. `columns: 12`).

### Rounded (`rounded:`)

| Style guide | YAML key |
| --- | --- |
| `radius-sm` | `sm` |
| `radius-md` | `md` |
| `radius-lg` | `lg` |
| `radius-xl` | `xl` |
| `radius-full` | `full` |

### Components (`components:`)

Derive from style guide tokens when UI specs do not define component-level detail:

| Component key | Typical mapping |
| --- | --- |
| `button-primary` | `backgroundColor: "{colors.primary}"`, `textColor: "{colors.primary-foreground}"`, `typography: "{typography.label-md}"`, `rounded: "{rounded.md}"`, `padding` from `spacing.sm` or `12px` |
| `button-primary-hover` | accent or darkened primary |
| `button-secondary` | secondary tokens |
| `input-default` | `background`, `foreground`, `border` behavior in prose; `rounded.md`, body typography |
| `card-default` | `background`, `rounded.lg`, padding from `spacing.lg` |

Add keys from UI spec component inventory (chips, lists, checkboxes, etc.) using the same property whitelist.

### Elevation

The official YAML schema has no `elevation` group. Put shadow values from §7 in `## Elevation & Depth` prose. Reference elevation levels by name (`elevation-1`, etc.) in component prose when needed.

### Breakpoints

No YAML group required. Summarize §9 breakpoint table and adaptation rules under `## Layout`.

## Prose sections

Write human-readable rationale in each `##` section. Follow spec examples:

- **Overview** — mood, density, audience, aesthetic philosophy (from §1).
- **Colors** — bullet per palette role: `**Role (`token`):** usage` with descriptive color names.
- **Typography** — narrative hierarchy; reference YAML keys.
- **Layout** — grid, spacing rhythm, alignment, density, breakpoints (§4–§6, §9).
- **Elevation & Depth** — tonal layers or shadow scale (§7).
- **Shapes** — corner radius philosophy (§8).
- **Components** — atom guidance; reference YAML component keys.
- **Do's and Don'ts** — guardrails from §1 Do/Don't plus token discipline rules.

## Output contract

The file must include:

1. Valid YAML front matter between `---` fences with at least `name`, `colors`, `typography`, `rounded`, `spacing`.
2. All eight canonical `##` sections in order (content may be brief but present).
3. No duplicate `##` headings.
4. Concrete values — no `[...]` placeholders in final output.

## Filling rules

1. **Style guide is source** — do not invent tokens absent from the style guide unless filling a required YAML key with a documented default.
2. **Preserve values** — hex/oklch from §2 pass through unchanged.
3. **Reference syntax** — component YAML uses `{colors.*}`, `{typography.*}`, `{rounded.*}`; not raw hex in component tokens when a color token exists.
4. **Light-first YAML** — dark mode documented in prose when both modes exist.
5. **Components before handoff** — ensure `button-primary`, `input-default`, and `card-default` at minimum.

## Output format

1. **Path** — repo-relative path to `design.md`.
2. **Summary** — product name, token counts, any normalized mappings.
3. **Gaps** — unmapped style guide tokens, missing component variants, lint warnings.
4. **Lint** — note if `@google/design.md lint` was run and result.

## Follow-up updates

When the user revises visual tokens:

1. Update the style guide (via [creating-style-guide.md](creating-style-guide.md)) or edit `design.md` directly if the user specifies token-only changes.
2. Re-run this transformation when the style guide changes materially.
3. Keep `prompt.md` token references consistent with YAML keys in `design.md`.
