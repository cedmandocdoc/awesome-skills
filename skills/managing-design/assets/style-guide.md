# Style Guide — [Product / Project]

> **Structure only** — used by [creating-style-guide.md](../references/creating-style-guide.md). Filled output is a complete visual styling guide (chat or file).
>
> Reference token names in specs and prompts — not raw hex, px literals, or ad-hoc font sizes. Values live in this document only.
>
> Section order and table columns are fixed. Token names and row count follow [creating-style-guide.md](../references/creating-style-guide.md).
>
> Source inputs: [brand brief / UI specs / existing design system path]

---

## 1. Visual Theme & Atmosphere

**Product feel:** [e.g. calm productivity SaaS, playful consumer app, clinical enterprise tool]

**Aesthetic direction:** [e.g. modern minimal, glassmorphism, flat material, editorial]

**Mood keywords:** [3–5 adjectives — e.g. trustworthy, spacious, precise]

**Design references (inspiration only):** [e.g. Linear, Stripe, Notion — do not copy; follow tokens below]

**Do / Don't:**

- Do: [e.g. generous whitespace, subtle borders, restrained color accents]
- Don't: [e.g. heavy gradients, decorative illustrations, skeuomorphic chrome]

---

## 2. Color Palette & Roles

Use **token names** everywhere in downstream specs. Never use raw hex in `prompt.md` — reference tokens only.

### Color tokens

| Token | Light | Dark | Role / usage |
| --- | --- | --- | --- |
| [`token-name`] | [value] | [value] | [usage] |

[Add one row per color token from the active convention.]

### Semantic mapping (optional)

| UI role | Token(s) |
| --- | --- |
| [role] | [`token-name`] |

---

## 3. Typography

Use **token names** for all type in downstream specs. Do not use raw font sizes in screen specs.

### Type scale (`text-{variant}-{size}`)

| Token | Size | Line height | Letter spacing | Usage |
| --- | --- | --- | --- | --- |
| [`text-*`] | [value] | [value] | [value] | [usage] |

### Font families (`font-{group}`)

| Token | Family | Fallback | Usage |
| --- | --- | --- | --- |
| [`font-*`] | [family] | [fallback] | [usage] |

### Font weights (`font-{weight}`)

| Token | Weight | Usage |
| --- | --- | --- |
| [`font-*`] | [value] | [usage] |

### Pairing rules

| Element | Type scale | Weight | Family |
| --- | --- | --- | --- |
| [element] | [`text-*`] | [`font-*`] | [`font-*`] |

---

## 4. Spacing

| Token | Value | Usage |
| --- | --- | --- |
| `space-1` | [px] | Tight inline gaps |
| `space-2` | [px] | Icon-to-label, compact lists |
| `space-3` | [px] | Form field gaps |
| `space-4` | [px] | Card internal padding (small) |
| `space-6` | [px] | Section gaps |
| `space-8` | [px] | Card padding (default) |
| `space-12` | [px] | Page section margins |
| `space-16` | [px] | Large section breaks |

---

## 5. Grid

- **Page max width:** [e.g. 1280px centered, full-bleed dashboard]
- **Content column:** [e.g. 720px for forms, 12-column grid for dashboards]
- **Gutter:** [`space-*` token]
- **Section rhythm:** [e.g. `space-12` between major blocks, `space-6` within cards]

---

## 6. Alignment & Density

- [e.g. Left-align form labels; right-align numeric table columns]
- [e.g. Comfortable density — minimum `space-3` between interactive elements]

---

## 7. Depth & Elevation

| Token | Shadow / effect | Usage |
| --- | --- | --- |
| `elevation-0` | none | Flat surfaces, inline elements |
| `elevation-1` | [shadow value] | Cards, dropdowns |
| `elevation-2` | [shadow value] | Popovers, sticky headers |
| `elevation-3` | [shadow value] | Modals, drawers |
| `elevation-4` | [shadow value] | Toasts, top-level overlays |

### Other depth treatments

- [Blur / glass: e.g. backdrop blur on modal scrim — or "not used"]
- [Focus ring: e.g. 2px outline using `ring` color token, 2px offset]

---

## 8. Roundness

| Token | Value | Usage |
| --- | --- | --- |
| `radius-sm` | [px] | Chips, small badges |
| `radius-md` | [px] | Buttons, inputs |
| `radius-lg` | [px] | Cards, panels |
| `radius-xl` | [px] | Modals, large containers |
| `radius-full` | 9999px | Avatars, pills |

---

## 9. Breakpoints & Responsive Behavior

### Breakpoints

| Token | Min width | Layout behavior |
| --- | --- | --- |
| `bp-mobile` | 0 | Single column; bottom nav if applicable |
| `bp-tablet` | [px] | [e.g. collapsible sidebar, 2-column where needed] |
| `bp-desktop` | [px] | [e.g. persistent sidebar, multi-column dashboards] |
| `bp-wide` | [px] | [e.g. max-width container centered] |

### Adaptation rules

- **Navigation:** [e.g. hamburger + drawer on mobile; persistent sidebar on desktop]
- **Tables:** [e.g. horizontal scroll on mobile; full columns on desktop]
- **Forms:** [e.g. single column on mobile; two-column on desktop for short fields]
- **Modals:** [e.g. full-screen sheet on mobile; centered dialog on desktop]
- **Typography:** [e.g. scale down one type step on mobile — specify token mapping]

### Touch & pointer

- **Minimum tap target:** [e.g. 44×44px on mobile]
- **Hover states:** Desktop only; no hover-dependent affordances on touch
