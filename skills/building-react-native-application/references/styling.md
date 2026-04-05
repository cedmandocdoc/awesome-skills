# Styling

## Overview

Use this guide to apply Tailwind utilities through `className` with NativeWind. Keep styling token-driven and extend the theme when a value is shared.

## Prerequisites

- [setting-up-nativewind.md](./setting-up-nativewind.md)

## Guidelines

### Structure

- Keep `tailwind.config.js` at the project root.
- Keep `global.css` at the project root as the Metro input and app-level CSS import.
- Add shared tokens in `src/theme.css` and `theme.extend`.

### Styling rules

- Use `className` before inline `style` or `StyleSheet.create`.
- Use `cva` for variant-heavy components.
- Use `cx` from `class-variance-authority` for class merging.
- Use shared tokens before arbitrary values.
- Extend `tailwind.config.js` when a value is reused.
- Use mobile-first responsive utilities such as `sm:`, `md:`, `lg:`, and `xl:` when NativeWind supports them.
- Use `gap` on parent layouts instead of margin chains on children.
- Use `@media ios { }` and `@media android { }` in `global.css` when you need platform-specific CSS.
- Keep `global.css` as the only CSS file imported by `App.tsx`.
- Put token layers in `src/theme.css` and import that file from `global.css`.
- Extend `tailwind.config.js`; do not replace an existing config.

## Examples

### Start with utility classes

```tsx
<Pressable className="rounded-lg bg-blue-600 px-4 py-2">
  <Text className="font-semibold text-white">Click me</Text>
</Pressable>
```

### Use variants with `cva`

```tsx
import { cva, cx } from "class-variance-authority";

const pill = cva("rounded-full px-3 py-1", {
  variants: {
    tone: {
      neutral: "bg-neutral-100 text-neutral-700",
      success: "bg-success-50 text-success-700",
    },
  },
  defaultVariants: { tone: "neutral" },
});
```

### Merge classes with `cx`

Use `cx` when you combine base classes, variants, and overrides.

```tsx
import { cx } from "class-variance-authority";

<View className={cx("rounded-md p-4", isActive && "bg-primary", className)} />;
```

### Keep variant helpers in styling code

- Put `cva` and `cx` helpers in styling files or style blocks.
- Keep component docs focused on structure and usage.

### Add a reusable token before repeating a raw value

- Use bracket utilities for one-off values only.
- Move repeated colors, spacing, or radius values into `theme.extend`.
