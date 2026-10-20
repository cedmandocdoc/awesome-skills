# Creating UI Component

## Overview

Shared presentation-only primitives in `src/ui/`, built on demand from `@rn-primitives` or React Native core components, with the accessibility rules every primitive meets.

## Prerequisites

- [native-app-contract.md](./native-app-contract.md) → **Ownership**, **Requirements**
- [managing-project-structure.md](./managing-project-structure.md) — component naming
- [managing-styling.md](./managing-styling.md) — tokens, `cva`, `className` merging

## Guidelines

### Build

1. Check `src/ui/` for an existing primitive; extend it with a variant before adding a new one.
2. Look the concept up in **Primitives**: build on the listed `@rn-primitives` package, else on `View` / `Text` / `Pressable` / `TextInput`. A concept not in the table is hand-built to its WAI-ARIA Authoring Practices pattern; never browse the library catalog for one.
3. Take its look, states (pressed, disabled, focused, selected), copy, and motion from the requirements.
4. Accept `className` and merge it last per [managing-styling.md](./managing-styling.md).

- Presentation-only: no imports from features, `common`, API, or app state; UI-local state (open, focus, motion) stays inside.
- Features import only `@/ui/*`; `@rn-primitives` is imported only inside `src/ui/`.

### Primitives

Checked 2026-10-20 against `@base-ui/react` 1.9.0 and `@rn-primitives/*` 1.5.2. **Native** names the `@rn-primitives/<package>`; **Portal** marks overlay packages.

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

Not built on native: desktop-only patterns (hover card, menubar, navigation menu, context menu). Route tabs belong to React Navigation per [creating-screen.md](./creating-screen.md).

### Accessibility

Every primitive and screen meets these; a requirement never removes one.

| Concern | Rule |
| --- | --- |
| Labels | Every control has an accessible name: visible label linked by `aria-labelledby`, else `accessibilityLabel` |
| Roles and state | `accessibilityRole` and `accessibilityState` (`disabled`, `selected`, `checked`, `expanded`, `busy`) match the widget |
| Errors | A field's error is linked to its control and announced — [creating-form.md](./creating-form.md) |
| Focus | Moves to the new content after navigation and after a step change; returns to the trigger when an overlay closes |
| Async states | Loading and errors are announced — [creating-async-component.md](./creating-async-component.md) |
| Target size | Pressable targets are at least 44×44 pt, through `hitSlop` when the visual is smaller |
| Contrast | Text 4.5:1, large text and controls 3:1; flag token pairs that miss it to the user |
| Reduced motion | Motion is skipped or reduced when `AccessibilityInfo.isReduceMotionEnabled()` is true |
| Font scaling | Text scales with the system font size; layouts grow instead of clipping |

### Button

`src/ui/Button` takes `loading`: it disables immediately, sets `accessibilityState.busy`, shows an indicator, and keeps its label. Mutation triggers pass `isPending`; `SubmitButton` passes `isSubmitting`.

### Layout

```text
src/ui/
├── Button.tsx          # standalone primitive; import @/ui/Button
├── Dialog/             # several files; index.tsx barrel; import @/ui/Dialog
├── hooks/              # UI-only hooks (useDelayedFlag)
├── Async/              # creating-async-component.md
├── ErrorBoundary.tsx   # managing-errors.md
├── Field/              # creating-form.md
└── Form/               # creating-form.md
```

## Setup

- Install a package when the first primitive that needs it is built: `node ../scripts/run-package.cjs -- expo install @rn-primitives/<package>`. Its shared `hooks`, `slot`, `types`, and `utils` packages come as dependencies.
- With the first Portal package, also install `@rn-primitives/portal`; `src/ui/Portal` re-exports its `PortalHost`, rendered once as the last child of the app root.

## Examples

### Primitive with variants

```tsx
import type { ReactNode } from "react";
import { ActivityIndicator, Pressable } from "react-native";
import { cva, type VariantProps } from "class-variance-authority";

const button = cva("min-h-11 flex-row items-center justify-center gap-2", {
  variants: {
    tone: {
      primary: "bg-primary",
      secondary: "bg-secondary",
    },
  },
  defaultVariants: { tone: "primary" },
});

interface ButtonProps extends VariantProps<typeof button> {
  children: ReactNode;
  className?: string;
  disabled?: boolean;
  loading?: boolean;
  onPress?: () => void;
}

export function Button({ children, className, disabled, loading, onPress, tone }: ButtonProps) {
  return (
    <Pressable
      accessibilityRole="button"
      accessibilityState={{ disabled: disabled || loading, busy: loading }}
      className={button({ tone, className })}
      disabled={disabled || loading}
      onPress={onPress}
    >
      {loading ? <ActivityIndicator /> : null}
      {children}
    </Pressable>
  );
}
```

### Compound parts in a feature

```tsx
<Button loading={save.isPending} onPress={() => save.mutate()}>
  <ButtonIcon>{icon}</ButtonIcon>
  <ButtonText>Save</ButtonText>
</Button>
```

## References

- [React Native Primitives](https://rnprimitives.com/)
- [WAI-ARIA Authoring Practices — Patterns](https://www.w3.org/WAI/ARIA/apg/patterns/)
- [React Native — Accessibility](https://reactnative.dev/docs/accessibility)
