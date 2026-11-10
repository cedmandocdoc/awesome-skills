---
# Replace every [...] value.
version: alpha
name: "[App name]"
description: "[One line: feel + aesthetic]"
colors:
  background: "[#FFFFFF]"
  foreground: "[#0F172A]"
  primary: "[brand color]"
  primary-foreground: "[#FFFFFF]"
  muted: "[#F1F5F9]"
  muted-foreground: "[#64748B]"
  border: "[#E2E8F0]"
  success: "[#16A34A]"
typography:
  text-heading-lg: { fontFamily: "[Heading family]", fontSize: 24px, fontWeight: 700, lineHeight: 1.25 }
  text-heading-md: { fontFamily: "[Heading family]", fontSize: 18px, fontWeight: 600, lineHeight: 1.3 }
  text-body-base: { fontFamily: "[Body family]", fontSize: 16px, fontWeight: 400, lineHeight: 1.5 }
  text-body-sm: { fontFamily: "[Body family]", fontSize: 14px, fontWeight: 400, lineHeight: 1.43 }
  text-label: { fontFamily: "[Body family]", fontSize: 14px, fontWeight: 600, lineHeight: 1.3 }
rounded:
  radius-md: 10px
  radius-lg: 16px
  radius-full: 9999px
spacing:
  space-2: 8px
  space-3: 12px
  space-4: 16px
  space-6: 24px
---

# [App name]

## Overview

[Feel and mood (3 keywords), audience, density, brand personality.]

| Token | Family | Fallback | Usage |
| --- | --- | --- | --- |
| `font-brand` | [family] | [fallback] | Headings |
| `font-body` | [family] | [fallback] | Body, labels |

## Colors

- **Primary (`primary`):** [the one action per screen]
- **Success (`success`):** [the done state]

## Typography

- **Headlines:** [`text-heading-*` usage]
- **Body and labels:** [`text-body-*`, `text-label` usage]

## Layout

- 390×844 phone screen, `space-4` side margin, `space-6` between groups; tap targets at least 44 px.

## Shapes

- **Controls:** `radius-md`; **cards and sheets:** `radius-lg`; **avatars and chips:** `radius-full`.

## Components

| Component | Tokens |
| --- | --- |
| Primary button | `primary`, `primary-foreground`, `text-label`, `radius-md` |
| Card | `background`, `border`, `radius-lg` |

## Do's and Don'ts

- Do: one primary action per screen
- Don't: colors, fonts, or radii outside the tokens
- Do: WCAG AA contrast (4.5:1 for body text)

## Voice

[Tone and language of the UI copy, e.g. warm, plain Filipino English; button labels as verbs.]
