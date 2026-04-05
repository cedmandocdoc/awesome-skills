# Creating Component

## Overview

Use this guide to write UI and feature components. Keep reusable UI simple and presentation-only, and prefer compound parts for complex controls.

For naming conventions, see [naming-component.md](./naming-component.md).

## Guidelines

### Component rules

- Use functional components and named exports.
- Prefer `interface` for props.
- Use React Native primitives or `@/ui/*`.
- Keep domain logic out of presentational components.
- Prefer compound parts over components that accept raw string or node unions.

## Examples

### Create a shared primitive

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

### Use primitives inside a feature

```ts
import { Button } from "@/ui/button";

export function WorkshopCta() {
  return <Button label="Join workshop" />;
}
```

### Split complex controls into parts

Use explicit parts such as `Button`, `ButtonText`, and `ButtonIcon` instead of switching on `typeof children`.

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
