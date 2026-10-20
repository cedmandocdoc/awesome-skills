# Creating UI Component

## Overview

Shared presentation-only primitives in `src/ui/`, built on demand from Base UI parts or semantic HTML, with the accessibility rules every primitive meets.

## Prerequisites

- [web-app-contract.md](./web-app-contract.md) → **Ownership**, **Requirements**
- [managing-project-structure.md](./managing-project-structure.md) — component naming
- [managing-styling.md](./managing-styling.md) — tokens, `cva`, `className` merging

## Guidelines

### Build

1. Check `src/ui/` for an existing primitive; extend it with a variant before adding a new one.
2. Look the concept up in **Primitives**: build on the listed Base UI part, else on semantic HTML. A concept not in the table is hand-built to its WAI-ARIA Authoring Practices pattern; never browse the library catalog for one.
3. Take its look, states (hover, focus-visible, disabled, selected), copy, and motion from the requirements.
4. Accept `className` and merge it last per [managing-styling.md](./managing-styling.md); forward the element's native props.

- Presentation-only: no imports from features, `common`, API, or app state; UI-local state (open, focus, motion) stays inside.
- Features import only `@/ui/*`; `@base-ui/react` is imported only inside `src/ui/`.

### Primitives

Checked 2026-10-20 against `@base-ui/react` 1.9.0 and `@rn-primitives/*` 1.5.2. **Web** names the Base UI part, imported from `@base-ui/react/<part>`; the other columns are the native skill's.

| Concept | Web (Base UI part) | Native | Portal |
| --- | --- | --- | --- |
| Accordion | Accordion | `accordion` | |
| Alert dialog | Alert Dialog | `alert-dialog` | yes |
| Autocomplete | Autocomplete | hand-built | |
| Avatar | Avatar | `avatar` | |
| Button | Button | core `Pressable` | |
| Checkbox | Checkbox | `checkbox` | |
| Checkbox group | Checkbox Group | hand-built from `checkbox` | |
| Collapsible | Collapsible | `collapsible` | |
| Combobox | Combobox | hand-built | |
| Context menu | Context Menu | not built | |
| Dialog | Dialog | `dialog` | yes |
| Drawer | Drawer | hand-built | |
| Dropdown menu | Menu | `dropdown-menu` | yes |
| Field | Field | hand-built — [creating-form.md](./creating-form.md) | |
| Fieldset | Fieldset | hand-built | |
| Hover / preview card | Preview Card | not built | |
| Input | Input | core `TextInput` | |
| Label | `Field.Label` | `label` | |
| Menubar | Menubar | not built | |
| Meter | Meter | hand-built | |
| Navigation menu | Navigation Menu | not built | |
| Number field | Number Field | hand-built | |
| OTP field | OTP Field | hand-built | |
| Popover | Popover | `popover` | yes |
| Progress | Progress | `progress` | |
| Radio group | Radio Group | `radio-group` | |
| Scroll area | Scroll Area | core `ScrollView` | |
| Select | Select | `select` | yes |
| Separator | Separator | `separator` | |
| Slider | Slider | `slider` | |
| Switch | Switch | `switch` | |
| Tabs (in-screen) | Tabs | `tabs` | |
| Toast | Toast | `toast` | yes |
| Toggle | Toggle | `toggle` | |
| Toggle group | Toggle Group | `toggle-group` | |
| Toolbar | Toolbar | `toolbar` | |
| Tooltip | Tooltip | `tooltip` | yes |

### Accessibility

Every primitive and page meets these; a requirement never removes one.

| Concern | Rule |
| --- | --- |
| Labels | Every control has an accessible name: a visible label linked to it, else `aria-label` |
| Semantics | Native elements first (`button`, `a`, `nav`, `main`, headings in order); ARIA only where HTML has none |
| Errors | A field's error is linked to its control and announced — [creating-form.md](./creating-form.md) |
| Focus | Visible focus on every interactive element; moves to the new content after navigation and after a step change; returns to the trigger when an overlay closes |
| Async states | Loading and errors are announced — [creating-async-component.md](./creating-async-component.md) |
| Target size | Pointer targets are at least 24×24 CSS px |
| Contrast | Text 4.5:1, large text and controls 3:1; flag token pairs that miss it to the user |
| Reduced motion | Motion is skipped or reduced under `motion-reduce:` / `prefers-reduced-motion` |
| Font scaling | Text sizes in `rem`; layouts reflow at 200% zoom and 320 CSS px width without clipping |

`eslint-plugin-jsx-a11y` (recommended) checks what lint can per [managing-linting.md](./managing-linting.md).

### Button

`src/ui/Button` on Base UI `Button` takes `loading`: it disables immediately while staying focusable (`focusableWhenDisabled`), sets `aria-busy`, shows an indicator, and keeps its label. Mutation triggers pass `isPending`; `SubmitButton` passes `isSubmitting`.

### Layout

```text
src/ui/
├── Button.tsx          # standalone primitive; import @/ui/Button
├── Dialog/             # several files; index.tsx barrel; import @/ui/Dialog
├── hooks/              # UI-only hooks (useDelayedFlag)
├── Async/              # creating-async-component.md
├── ErrorView.tsx       # managing-errors.md
├── Field/              # creating-form.md
└── Form/               # creating-form.md
```

## Setup

- Install `@base-ui/react` once at scaffold: `node ../scripts/install-packages.cjs @base-ui/react`. It is one tree-shaken package; parts import from `@base-ui/react/<part>`.
- `global.css` gives the app root `isolation: isolate` and `body` `position: relative`, so popups layer above the app and iOS Safari backdrops cover the page.

## Examples

### Primitive with variants

```tsx
import type { ComponentProps } from "react";
import { Button as BaseButton } from "@base-ui/react/button";
import { cva, type VariantProps } from "class-variance-authority";
import { Spinner } from "./Spinner";

const button = cva("inline-flex min-h-6 items-center justify-center gap-2", {
  variants: {
    tone: {
      primary: "bg-primary",
      secondary: "bg-secondary",
    },
  },
  defaultVariants: { tone: "primary" },
});

interface ButtonProps
  extends Omit<ComponentProps<typeof BaseButton>, "className">,
    VariantProps<typeof button> {
  className?: string;
  loading?: boolean;
}

export function Button({ tone, className, loading, disabled, children, ...props }: ButtonProps) {
  return (
    <BaseButton
      className={button({ tone, className })}
      disabled={disabled || loading}
      focusableWhenDisabled
      aria-busy={loading || undefined}
      {...props}
    >
      {loading ? <Spinner /> : null}
      {children}
    </BaseButton>
  );
}
```

### `global.css` additions

```css
#root {
  isolation: isolate;
}

body {
  position: relative;
}
```

## References

- [Base UI — Quick start](https://base-ui.com/react/overview/quick-start)
- [WAI-ARIA Authoring Practices — Patterns](https://www.w3.org/WAI/ARIA/apg/patterns/)
- [WCAG 2.2 — Quick reference](https://www.w3.org/WAI/WCAG22/quickref/)
