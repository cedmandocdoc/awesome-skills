---
version: alpha
name: [Product / Project]
description: [One-line design system summary]
colors:
  primary: [hex or oklch]
  primary-foreground: [hex or oklch]
  secondary: [hex or oklch]
  secondary-foreground: [hex or oklch]
  background: [hex or oklch]
  foreground: [hex or oklch]
  muted: [hex or oklch]
  muted-foreground: [hex or oklch]
  accent: [hex or oklch]
  accent-foreground: [hex or oklch]
  destructive: [hex or oklch]
  border: [hex or oklch]
  input: [hex or oklch]
  ring: [hex or oklch]
typography:
  headline-lg:
    fontFamily: [family]
    fontSize: [px]
    fontWeight: [number]
    lineHeight: [unitless or px]
    letterSpacing: [em or px]
  headline-md:
    fontFamily: [family]
    fontSize: [px]
    fontWeight: [number]
    lineHeight: [unitless or px]
    letterSpacing: [em or px]
  body-md:
    fontFamily: [family]
    fontSize: [px]
    fontWeight: [number]
    lineHeight: [unitless or px]
    letterSpacing: [em or px]
  body-sm:
    fontFamily: [family]
    fontSize: [px]
    fontWeight: [number]
    lineHeight: [unitless or px]
    letterSpacing: [em or px]
  label-md:
    fontFamily: [family]
    fontSize: [px]
    fontWeight: [number]
    lineHeight: [unitless or px]
    letterSpacing: [em or px]
rounded:
  sm: [px]
  md: [px]
  lg: [px]
  xl: [px]
  full: 9999px
spacing:
  xs: [px]
  sm: [px]
  md: [px]
  lg: [px]
  xl: [px]
  gutter: [px]
  margin: [px]
components:
  button-primary:
    backgroundColor: "{colors.primary}"
    textColor: "{colors.primary-foreground}"
    typography: "{typography.label-md}"
    rounded: "{rounded.md}"
    padding: [px]
  button-primary-hover:
    backgroundColor: "{colors.accent}"
    textColor: "{colors.accent-foreground}"
  button-secondary:
    backgroundColor: "{colors.secondary}"
    textColor: "{colors.secondary-foreground}"
    typography: "{typography.label-md}"
    rounded: "{rounded.md}"
    padding: [px]
  input-default:
    backgroundColor: "{colors.background}"
    textColor: "{colors.foreground}"
    typography: "{typography.body-md}"
    rounded: "{rounded.md}"
    padding: [px]
  card-default:
    backgroundColor: "{colors.background}"
    textColor: "{colors.foreground}"
    rounded: "{rounded.lg}"
    padding: [px]
---

# [Product / Project]

> **Structure only** — used by [creating-stitch-design.md](../references/creating-stitch-design.md). Filled output follows the [Google Stitch DESIGN.md specification](https://stitch.withgoogle.com/docs/design-md/specification.md).
>
> YAML front matter holds normative token values. Markdown body explains rationale and usage. Token references in prose use backticks; literal values live in front matter only.

## Overview

[Product feel, aesthetic direction, mood keywords, design references, target density, and brand personality — derived from style guide §1 Visual Theme & Atmosphere.]

## Colors

[Prose describing palette roles. Each bullet: **Descriptive name (token):** role and usage. Use light-mode values from the style guide; note dark-mode behavior when applicable.]

- **[Role] (`token-name`):** [usage]

## Typography

[Prose describing font strategy, hierarchy, and pairing rules — derived from style guide §3 Typography.]

- **Headlines:** [family, weight, usage]
- **Body:** [family, size, usage]
- **Labels:** [family, size, casing, usage]

## Layout

[Grid, spacing rhythm, alignment, density, and breakpoints — derived from style guide §4–§6 and §9.]

- **Page structure:** [max width, columns, gutter]
- **Spacing scale:** [base unit and rhythm]
- **Density:** [alignment and touch-target rules]
- **Breakpoints:** [mobile / tablet / desktop behavior summary]

## Elevation & Depth

[Shadow levels, focus rings, blur — derived from style guide §7 Depth & Elevation.]

- **Elevation scale:** [elevation-0 through elevation-4 descriptions]
- **Focus ring:** [outline style using `ring` token]
- **Other depth:** [blur/glass or "not used"]

## Shapes

[Corner radius language — derived from style guide §8 Roundness.]

- **Interactive elements:** [`rounded.sm` / `rounded.md` usage]
- **Containers:** [`rounded.lg` / `rounded.xl` usage]
- **Pills / avatars:** [`rounded.full` usage]

## Components

[Atom styling guidance — derived from style guide tokens and UI spec component inventory when available.]

### Buttons

- **Primary:** [`button-primary` token group; variants and states]
- **Secondary:** [`button-secondary` token group]

### Inputs

- **Text fields:** [`input-default`; focus, error, disabled behavior]

### Cards / containers

- **Default card:** [`card-default`; elevation reference]

[Add ### blocks for other component categories from UI specs.]

## Do's and Don'ts

- Do: [from style guide §1 Do / Don't and cross-cutting rules]
- Don't: [from style guide §1 Do / Don't and cross-cutting rules]
- Do: [WCAG AA contrast; token-only styling in downstream prompts]
- Don't: [invent colors, fonts, or spacing outside defined tokens]
