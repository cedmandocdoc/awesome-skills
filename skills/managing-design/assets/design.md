---
version: alpha
name: [Product / Project]
description: [One-line design system summary — product feel + aesthetic]
colors:
  background: [hex or oklch]
  foreground: [hex or oklch]
  card: [hex or oklch]
  card-foreground: [hex or oklch]
  popover: [hex or oklch]
  popover-foreground: [hex or oklch]
  primary: [hex or oklch]
  primary-foreground: [hex or oklch]
  secondary: [hex or oklch]
  secondary-foreground: [hex or oklch]
  muted: [hex or oklch]
  muted-foreground: [hex or oklch]
  accent: [hex or oklch]
  accent-foreground: [hex or oklch]
  destructive: [hex or oklch]
  border: [hex or oklch]
  input: [hex or oklch]
  ring: [hex or oklch]
  chart-1: [hex or oklch]
  chart-2: [hex or oklch]
  chart-3: [hex or oklch]
  chart-4: [hex or oklch]
  chart-5: [hex or oklch]
typography:
  text-heading-xl:
    fontFamily: [family]
    fontSize: [px]
    fontWeight: [number]
    lineHeight: [unitless]
    letterSpacing: [em or px]
  text-heading-lg:
    fontFamily: [family]
    fontSize: [px]
    fontWeight: [number]
    lineHeight: [unitless]
    letterSpacing: [em or px]
  text-heading-md:
    fontFamily: [family]
    fontSize: [px]
    fontWeight: [number]
    lineHeight: [unitless]
    letterSpacing: [em or px]
  text-body-lg:
    fontFamily: [family]
    fontSize: [px]
    fontWeight: [number]
    lineHeight: [unitless]
    letterSpacing: [em or px]
  text-body-base:
    fontFamily: [family]
    fontSize: [px]
    fontWeight: [number]
    lineHeight: [unitless]
    letterSpacing: [em or px]
  text-body-sm:
    fontFamily: [family]
    fontSize: [px]
    fontWeight: [number]
    lineHeight: [unitless]
    letterSpacing: [em or px]
  text-label:
    fontFamily: [family]
    fontSize: [px]
    fontWeight: [number]
    lineHeight: [unitless]
    letterSpacing: [em or px]
  text-label-xs:
    fontFamily: [family]
    fontSize: [px]
    fontWeight: [number]
    lineHeight: [unitless]
    letterSpacing: [em or px]
rounded:
  radius-sm: [px]
  radius-md: [px]
  radius-lg: [px]
  radius-xl: [px]
  radius-full: 9999px
spacing:
  space-1: [px]
  space-2: [px]
  space-3: [px]
  space-4: [px]
  space-6: [px]
  space-8: [px]
  space-12: [px]
  space-16: [px]
  gutter: [px]
  margin: [px]
components:
  button-primary:
    backgroundColor: "{colors.primary}"
    textColor: "{colors.primary-foreground}"
    typography: "{typography.text-label}"
    rounded: "{rounded.radius-md}"
    padding: [px]
  button-primary-hover:
    backgroundColor: "{colors.accent}"
    textColor: "{colors.accent-foreground}"
  button-secondary:
    backgroundColor: "{colors.secondary}"
    textColor: "{colors.secondary-foreground}"
    typography: "{typography.text-label}"
    rounded: "{rounded.radius-md}"
    padding: [px]
  input-default:
    backgroundColor: "{colors.background}"
    textColor: "{colors.foreground}"
    typography: "{typography.text-body-base}"
    rounded: "{rounded.radius-md}"
    padding: [px]
  card-default:
    backgroundColor: "{colors.card}"
    textColor: "{colors.card-foreground}"
    rounded: "{rounded.radius-lg}"
    padding: [px]
---

# [Product / Project]

> **Structure only** — used by [creating-design.md](../references/creating-design.md). Filled output follows the [DESIGN.md format specification](https://stitch.withgoogle.com/docs/design-md/specification.md): YAML front matter (normative tokens) + markdown body (rationale).
>
> Token names follow this skill’s conventions (shadcn semantic colors, `text-*` type scale, `space-*`, `radius-*`). Reference token keys in specs and prompts — not raw hex, px literals, or ad-hoc font sizes.
>
> Source inputs: [brand brief / product specs / existing design system]

## Overview

[Product feel, aesthetic direction, mood keywords (3–5), design references (inspiration only), target density, audience, and brand personality.]

**Font families (`font-{group}`):**

| Token | Family | Fallback | Usage |
| --- | --- | --- | --- |
| `font-brand` | [family] | [fallback] | [usage] |
| `font-body` | [family] | [fallback] | [usage] |

**Font weights (`font-{weight}`):**

| Token | Weight | Usage |
| --- | --- | --- |
| `font-body` | 400 | Default UI text |
| `font-body-medium` | 500 | Emphasized body, active nav |
| `font-body-semibold` | 600 | Subheadings, button labels |
| `font-body-bold` | 700 | Strong emphasis |

**Pairing rules:** map elements → `text-*` + `font-{weight}` + `font-{group}` (values live in YAML `typography:`).

## Colors

[Palette roles. Light-mode values are normative in YAML. Document dark-mode counterparts here when the product supports dark mode.]

- **[Role] (`token-name`):** [usage]

**Dark mode (when applicable):**

| Token | Dark value | Notes |
| --- | --- | --- |
| [`token`] | [value] | [usage delta vs light] |

**Semantic mapping (optional):**

| UI role | Token(s) |
| --- | --- |
| [role] | [`token-name`] |

## Typography

[Hierarchy and pairing narrative. Reference YAML keys such as `text-heading-xl`, `text-body-base`.]

- **Headlines:** [`text-heading-*`; family, weight, usage]
- **Body:** [`text-body-*`; family, size, usage]
- **Labels / captions:** [`text-label`, `text-label-xs`; casing, usage]

## Layout

[Grid, spacing rhythm, alignment, density, breakpoints, and responsive adaptation.]

- **Page structure:** [max width, content column, gutter → `spacing.gutter` / `space-*`]
- **Spacing scale:** [rhythm using `space-1` … `space-16`]
- **Alignment & density:** [e.g. left-align labels; comfortable density — min `space-3` between controls]
- **Breakpoints (`bp-*`):**

| Token | Min width | Layout behavior |
| --- | --- | --- |
| `bp-mobile` | 0 | [behavior] |
| `bp-tablet` | [px] | [behavior] |
| `bp-desktop` | [px] | [behavior] |
| `bp-wide` | [px] | [behavior] |

- **Adaptation:** navigation, tables, forms, modals, typography scale on small viewports
- **Touch & pointer:** minimum tap target; hover desktop-only

## Elevation & Depth

[Shadow / tonal hierarchy. No YAML `elevation` group in the DESIGN.md schema — keep values here; reference by name in component prose.]

| Token | Shadow / effect | Usage |
| --- | --- | --- |
| `elevation-0` | none | Flat surfaces |
| `elevation-1` | [value] | Cards, dropdowns |
| `elevation-2` | [value] | Popovers, sticky headers |
| `elevation-3` | [value] | Modals, drawers |
| `elevation-4` | [value] | Toasts, overlays |

- **Focus ring:** [e.g. 2px outline using `ring`, 2px offset]
- **Other depth:** [blur / glass or "not used"]

## Shapes

[Corner radius language — YAML `rounded.radius-*`.]

- **Interactive elements:** [`radius-sm` / `radius-md`]
- **Containers:** [`radius-lg` / `radius-xl`]
- **Pills / avatars:** [`radius-full`]

## Components

[Atom styling. YAML `components:` holds normative property tokens. Variants are separate keys (`button-primary-hover`), not nested objects.]

### Buttons

- **Primary:** [`button-primary`; hover / disabled]
- **Secondary:** [`button-secondary`]

### Inputs

- **Text fields:** [`input-default`; focus, error, disabled]

### Cards / containers

- **Default card:** [`card-default`; elevation reference]

### Interaction & motion

| Interaction | Behavior | Duration |
| --- | --- | --- |
| [e.g. button press] | [easing / feedback] | [ms] |
| [e.g. modal open] | [enter / exit] | [ms] |

[Omit unused rows. Keep motion restrained and consistent with Overview density.]

[Add `###` blocks for chips, lists, checkboxes, etc. from product inventory.]

## Do's and Don'ts

- Do: [from brand direction — e.g. generous whitespace, restrained accents]
- Don't: [e.g. heavy gradients, decorative chrome outside tokens]
- Do: Reference token keys only in downstream specs and prompts
- Don't: Invent colors, fonts, spacing, or radii outside defined tokens
- Do: Maintain WCAG AA contrast (4.5:1 normal text); visible focus via `ring`
- Don't: Rely on color alone for state; hover-only affordances on touch
- Do: [accessibility — labels, hit targets, reduced-motion preference when motion is defined]
- Don't: Mix sharp and heavily rounded corners in the same view without a token rule
