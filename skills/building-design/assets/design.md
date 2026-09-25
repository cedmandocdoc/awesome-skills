---
# DESIGN.md front matter — normative tokens. Values below are defaults (shadcn neutral);
# replace with brand values. Ask before inventing brand colors unless the user accepts defaults.
# Rules: concrete values only; light (or sole) mode here, dark values in ## Colors;
# no motion here (it lives in ## Motion); references use {group.token}.
version: alpha
name: [Product / Project]
description: [One-line design summary — feel + aesthetic]
colors:
  # Semantic roles, not hues. Every fill pairs with -foreground.
  background: oklch(1 0 0)
  foreground: oklch(0.145 0 0)
  card: oklch(1 0 0)
  card-foreground: oklch(0.145 0 0)
  popover: oklch(1 0 0)
  popover-foreground: oklch(0.145 0 0)
  primary: oklch(0.205 0 0)
  primary-foreground: oklch(0.985 0 0)
  secondary: oklch(0.97 0 0)
  secondary-foreground: oklch(0.205 0 0)
  muted: oklch(0.97 0 0)
  muted-foreground: oklch(0.556 0 0)
  accent: oklch(0.97 0 0)
  accent-foreground: oklch(0.205 0 0)
  destructive: oklch(0.577 0.245 27.325)
  border: oklch(0.922 0 0)
  input: oklch(0.922 0 0)
  ring: oklch(0.708 0 0)
  # add chart-1…chart-5 and sidebar-* only when used
typography:
  # text-{variant}-{size}; unitless line heights. Add text-display-* when the design needs display sizes.
  text-heading-xl: { fontFamily: "[font-body]", fontSize: 30px, fontWeight: 700, lineHeight: 1.2, letterSpacing: 0em }
  text-heading-lg: { fontFamily: "[font-body]", fontSize: 24px, fontWeight: 700, lineHeight: 1.25, letterSpacing: 0em }
  text-heading-md: { fontFamily: "[font-body]", fontSize: 20px, fontWeight: 600, lineHeight: 1.3, letterSpacing: 0em }
  text-body-lg: { fontFamily: "[font-body]", fontSize: 18px, fontWeight: 400, lineHeight: 1.5, letterSpacing: 0em }
  text-body-base: { fontFamily: "[font-body]", fontSize: 16px, fontWeight: 400, lineHeight: 1.5, letterSpacing: 0em }
  text-body-sm: { fontFamily: "[font-body]", fontSize: 14px, fontWeight: 400, lineHeight: 1.43, letterSpacing: 0em }
  text-label: { fontFamily: "[font-body]", fontSize: 14px, fontWeight: 500, lineHeight: 1.3, letterSpacing: 0em }
  text-label-xs: { fontFamily: "[font-body]", fontSize: 12px, fontWeight: 400, lineHeight: 1.33, letterSpacing: 0em }
rounded:
  radius-sm: 4px
  radius-md: 6px
  radius-lg: 8px
  radius-xl: 12px
  radius-full: 9999px
spacing:
  space-1: 4px
  space-2: 8px
  space-3: 12px
  space-4: 16px
  space-6: 24px
  space-8: 32px
  space-12: 48px
  space-16: 64px
  gutter: 24px
  margin: 1280px
components:
  # One key per variant (button-primary-hover), never nested.
  # Properties: backgroundColor, textColor, typography, rounded, padding, size, height, width.
  button-primary:
    backgroundColor: "{colors.primary}"
    textColor: "{colors.primary-foreground}"
    typography: "{typography.text-label}"
    rounded: "{rounded.radius-md}"
    padding: 12px
  button-primary-hover:
    backgroundColor: "{colors.accent}"
    textColor: "{colors.accent-foreground}"
  button-secondary:
    backgroundColor: "{colors.secondary}"
    textColor: "{colors.secondary-foreground}"
    typography: "{typography.text-label}"
    rounded: "{rounded.radius-md}"
    padding: 12px
  input-default:
    backgroundColor: "{colors.background}"
    textColor: "{colors.foreground}"
    typography: "{typography.text-body-base}"
    rounded: "{rounded.radius-md}"
    padding: 12px
  card-default:
    backgroundColor: "{colors.card}"
    textColor: "{colors.card-foreground}"
    rounded: "{rounded.radius-lg}"
    padding: 32px
---

# [Product / Project]

> Valid [DESIGN.md](https://github.com/google-labs-code/design.md): the eight canonical sections in this order (omit one only when it has nothing to say), then the extension sections Motion, Voice, Implementation, Decisions (always present). Replace every `[...]` before delivering.
>
> Source inputs: [PRD / ui-specs / brand brief / reference artifacts]

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
| `bp-tablet` | 768px | [behavior] |
| `bp-desktop` | 1024px | [behavior] |
| `bp-wide` | 1280px | [behavior] |

- **Adaptation:** navigation, tables, forms, modals, typography scale on small viewports
- **Touch & pointer:** minimum tap target; hover desktop-only

## Elevation & Depth

[Shadow / tonal hierarchy. No YAML `elevation` group in the DESIGN.md schema — keep values here; reference by name in component prose.]

| Token | Shadow / effect | Usage |
| --- | --- | --- |
| `elevation-0` | none | Flat surfaces |
| `elevation-1` | 0 1px 2px rgb(0 0 0 / 5%) | Cards, dropdowns |
| `elevation-2` | 0 4px 6px rgb(0 0 0 / 7%) | Popovers, sticky headers |
| `elevation-3` | 0 10px 15px rgb(0 0 0 / 10%) | Modals, drawers |
| `elevation-4` | 0 20px 25px rgb(0 0 0 / 12%) | Toasts, overlays |

- **Focus ring:** 2px outline in `ring`, 2px offset
- **Other depth:** [blur / glass or "not used"]

## Shapes

[Corner radius language — YAML `rounded.radius-*`.]

- **Interactive elements:** [`radius-sm` / `radius-md`]
- **Containers:** [`radius-lg` / `radius-xl`]
- **Pills / avatars:** [`radius-full`]

## Components

[Index of component previews. YAML `components:` holds normative property tokens; variants are separate keys (`button-primary-hover`). States and motion live in each component's `.spec.yml`.]

| Component | Preview | Variants | YAML keys |
| --- | --- | --- | --- |
| [button] | [components/button.html](components/button.html) | [primary, secondary, ghost] | [`button-primary`, `button-primary-hover`] |

## Do's and Don'ts

- Do: [from brand direction — e.g. generous whitespace, restrained accents]
- Don't: [e.g. heavy gradients, decorative chrome outside tokens]
- Do: Reference token keys only — in surfaces and specs
- Don't: Invent colors, fonts, spacing, or radii outside defined tokens
- Do: Maintain WCAG AA contrast (4.5:1 normal text); visible focus via `ring`
- Don't: Rely on color alone for state; hover-only affordances on touch
- Do: [accessibility — labels, hit targets, reduced-motion preference when motion is defined]
- Don't: Mix sharp and heavily rounded corners in the same view without a token rule

## Motion

### Tokens

Names are `motion-*`; `system/motion.css` declares each as `--motion-*` with the same value.

| Token | Value | Usage |
| --- | --- | --- |
| `motion-dur` | [e.g. 240ms] | [default UI transition] |
| `motion-ease-out` | [e.g. cubic-bezier(.2, .7, .2, 1)] | [entrances] |

### Primitives

One row per named effect, implemented once in `system/` and marked there with `@motion <name>`. A one-off effect is still a named primitive.

| Primitive | Effect | Timing | Source |
| --- | --- | --- | --- |
| [`reveal-rise`] | [fade in + rise 5px] | [`motion-dur` `motion-ease-out`] | [system/motion.css] |

### Triggers and reduced motion

- Triggers: `load`, `in-view`, `scroll`, `hover`, `focus`, `action`, `state`.
- Reduced motion: [per primitive — e.g. every transform becomes an instant opacity change]

## Voice

- **Audience:** [who reads this, what they know]
- **Tone:** [3–5 traits]
- **Rules:** [sentence length, person, tense, jargon]
- **Never:** [banned words and framings]
- **Language:** [e.g. English only]

| Before | After |
| --- | --- |
| [generic line] | [line in this voice] |

## Implementation

- Surfaces under `components/` and `pages/` are source code to port, not pictures to interpret.
- Allowed to change: component boundaries, framework idioms, data binding, routing, `sample` content.
- Keep: CSS values and effective cascade, motion tokens, primitives and triggers, `canonical` and `material` copy.
- Every `data-motion`, `data-slot`, and spec state maps to a place in the implementation.
- [Design-specific rules]

## Decisions

Reference artifacts and their authority, original names from an imported guide, and every settled choice.

| Date | Decision | Rejected | Why |
| --- | --- | --- | --- |
| [YYYY-MM-DD] | [chosen] | [alternatives] | [reason] |
