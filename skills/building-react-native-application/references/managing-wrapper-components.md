# Managing Wrapper Components

## Overview

Keep layout trees shallow. Prefer a single wrapper with merged Tailwind classes over stacked `View` components that only hold one utility group each.

## Prerequisites

- [managing-styling.md](./managing-styling.md) — NativeWind utilities and class merging
- [creating-ui-component.md](./creating-ui-component.md) — how primitives accept `className`

## Guidelines

### Default rule

Merge layout, spacing, and visual classes onto one `View` (or primitive) using `cx` from `class-variance-authority`.

### When extra wrappers are justified

| Reason | Example |
| --- | --- |
| Different flex/alignment context | Row vs column sections on one node hurts readability |
| Touch target / hit slop boundary | `Pressable` wrapping a subset of children |
| Scroll or keyboard-avoiding container | Own layout rules required |
| Third-party child structure | Component expects specific children nesting |

### Screens and features

Same rule applies: default to one outer container with merged classes, split only for justified cases above.

## Examples

### Avoid redundant nesting

```tsx
import { View } from "react-native";

// Avoid: three Views only to layer classes
<View className="flex-1">
  <View className="bg-background p-4">
    <View className="gap-2">{children}</View>
  </View>
</View>
```

```tsx
import { View } from "react-native";

// Prefer: one wrapper with merged classes
<View className="flex-1 gap-2 p-4">{children}</View>
```

### Merge variant and override classes on one node

```tsx
import type { ReactNode } from "react";
import { View } from "react-native";
import { cx } from "class-variance-authority";

interface CardProps {
  children: ReactNode;
  className?: string;
}

export function Card({ children, className }: CardProps) {
  return (
    <View className={cx("rounded-xl border border-border bg-card p-4", className)}>
      {children}
    </View>
  );
}
```

### Keep a second wrapper when layout requires it

```tsx
import { Text, View } from "react-native";

<View className="gap-4 p-4">
  <View className="flex-row items-center justify-between gap-2">
    <Text className="text-lg font-semibold">Title</Text>
  </View>
  <View className="gap-2">{children}</View>
</View>
```
