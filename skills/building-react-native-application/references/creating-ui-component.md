# Creating UI Component

## Overview

Create shared presentation-only primitives in `src/ui/`: port the supplied design's component, or hand-build one from React Native primitives when the design has none.

## Prerequisites

- [native-app-contract.md](./native-app-contract.md) → **Porting a design**
- [managing-project-structure.md](./managing-project-structure.md) — component naming
- [managing-styling.md](./managing-styling.md) — tokens, `cva`, `className` merging

## Guidelines

### Build

1. Check `src/ui/` for an existing primitive; extend it with a variant before adding a new one.
2. Port the design's component per **Porting a design**: its parts, states (pressed, disabled, focused, selected), and motion all map to the primitive.
3. With no design component, hand-build from `View`, `Text`, `Pressable`, and `TextInput`.
4. Accept `className` and merge it last per [managing-styling.md](./managing-styling.md).

Presentation-only: no imports from features, API, or app state; UI-local state (open, focus, motion) stays inside.

### Layout

```text
src/ui/
├── Button.tsx
├── ButtonText.tsx
├── hooks/              # UI-only hooks (useMediaQuery)
├── Async/              # creating-async-component.md
└── Form/               # creating-form.md
```

| Pattern | Rule |
| --- | --- |
| Standalone primitive | `src/ui/<Component>.tsx`; import `@/ui/<Component>` |
| Subsystem with several files | `src/ui/<GroupName>/` with an `index.tsx` barrel |

## Examples

### Primitive with variants

```tsx
import type { ReactNode } from "react";
import { Pressable } from "react-native";
import { cva, type VariantProps } from "class-variance-authority";

const button = cva("flex-row items-center justify-center", {
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
  onPress?: () => void;
}

export function Button({ children, className, disabled, onPress, tone }: ButtonProps) {
  return (
    <Pressable
      className={button({ tone, className })}
      disabled={disabled}
      onPress={onPress}
    >
      {children}
    </Pressable>
  );
}
```

### Compound parts in a feature

```tsx
<Button onPress={save}>
  <ButtonIcon>{icon}</ButtonIcon>
  <ButtonText>Save</ButtonText>
</Button>
```
