# Managing Wrapper Components

## Overview

Use this guide to keep layout trees shallow. Prefer a single wrapper with merged Tailwind classes over stacked `View` components that only exist to hold one utility group each.

For utility merging, see [styling.md](./styling.md). For how primitives accept `className`, see [creating-component.md](./creating-component.md).

## Guidelines

### Prefer one wrapper

- Merge layout, spacing, and visual classes onto one `View` (or primitive) when they apply to the same box.
- Use `cx` from `class-variance-authority` (or the project’s class-merge helper) to combine base styles, variants, and a caller `className` prop on that single node.
- Avoid a chain of nested `View` elements whose only job is to attach separate `className` strings.

### When extra wrappers are justified

Add another wrapper only when the layout or platform behavior requires a distinct box, for example:

- Different flex or alignment contexts (e.g. row vs column sections that cannot be expressed on one node without hurting readability).
- Touch targets, hit slop, or `Pressable` boundaries that must wrap a subset of children.
- Scroll or keyboard-avoiding containers that need their own layout rules.
- Third-party components that require a specific child structure.

### Screens and features

- Apply the same rule in screens and feature components: default to one outer container with merged classes, then split only for the cases above.

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
<View className="flex-1 gap-2 bg-background p-4">{children}</View>
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

// Row for actions, column for content — intentional split
<View className="gap-4 p-4">
  <View className="flex-row items-center justify-between gap-2">
    <Text className="text-lg font-semibold">Title</Text>
    {/* trailing actions */}
  </View>
  <View className="gap-2">{children}</View>
</View>
```
