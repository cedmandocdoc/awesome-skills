# Creating Component

## Overview

Use this guide to write UI and feature components. Keep reusable UI simple and presentation-only, and prefer compound parts for complex controls.

For naming conventions, see [naming-component.md](./naming-component.md).

## Prerequisites

- [abstracting-component.md](./abstracting-component.md) — `src/ui/` vs feature components, registry-first UI, presentation-only rules
- [adding-registry-components.md](./adding-registry-components.md) — validate with `shadcn view`, run `add-registry-component.js`, manual fallback

## Guidelines

### Component rules

- Use functional components and named exports.
- Prefer `interface` for props.
- Use React Native primitives or `@/ui/*`.
- Keep domain logic out of presentational components.
- Prefer compound parts over components that accept raw string or node unions.

## Examples

Prefer a registry-backed primitive when one exists; see [abstracting-component.md](./abstracting-component.md) and the full flow in [adding-registry-components.md](./adding-registry-components.md). Use hand-written `src/ui/` examples below when there is **no** suitable registry item (validation fails, no equivalent component, or you are composing patterns the registry does not ship).

### Add a registry-backed primitive

Validate the registry URL, then run the add script from the **app project root** (see [adding-registry-components.md](./adding-registry-components.md) for failure cases and `--root`).

```bash
npx shadcn@latest view "https://reactnativereusables.com/r/nativewind/button.json"
node path/to/building-react-native-application/scripts/add-registry-component.js "https://reactnativereusables.com/r/nativewind/button.json"
```

The script vendors files into `src/ui/` (for example `button.tsx`). Import with `@/ui/button` in navigation modules and features.

### Use primitives inside a feature

```ts
import { Button } from "@/ui/button";

export function WorkshopCta() {
  return <Button>Join workshop</Button>;
}
```

### Add a custom `src/ui/` primitive (no registry item)

Use this shape when **no registry primitive fits** (or after you deliberately skip the registry path). Keep the component presentation-only.

```ts
import type { ReactNode } from "react";
import { Pressable, Text } from "react-native";
import { buttonStyles } from "./button.styles";

interface ButtonProps {
  label: string;
  tone?: "primary" | "secondary";
  className?: string;
  children?: ReactNode;
}

export function Button({ tone, className, label }: ButtonProps) {
  return (
    <Pressable className={buttonStyles({ tone, className })}>
      <Text>{label}</Text>
    </Pressable>
  );
}
```

### Split complex controls into parts (custom primitive)

Use explicit parts such as `Button`, `ButtonText`, and `ButtonIcon` instead of switching on `typeof children`. Same as above: prefer registry-backed pieces when they exist; the compound layout below is for a **custom** primitive when the registry does not provide a match.

```ts
import type { ReactNode } from "react";
import { Pressable, Text, View } from "react-native";
import { buttonStyles } from "./button.styles";

interface ButtonRootProps {
  children: ReactNode;
  className?: string;
}

interface ButtonTextProps {
  children: ReactNode;
}

interface ButtonIconProps {
  children: ReactNode;
}

export function Button({ children, className }: ButtonRootProps) {
  return <Pressable className={buttonStyles({ className })}>{children}</Pressable>;
}

export function ButtonText({ children }: ButtonTextProps) {
  return <Text>{children}</Text>;
}

export function ButtonIcon({ children }: ButtonIconProps) {
  return <View>{children}</View>;
}
```

Usage in a screen or feature:

```tsx
<Button>
  <ButtonIcon>{/* icon */}</ButtonIcon>
  <ButtonText>Save</ButtonText>
</Button>
```
