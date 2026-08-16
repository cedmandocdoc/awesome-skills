# Managing Styling

## Overview

Apply Tailwind utilities through `className` with NativeWind. Prefer design tokens; extend the theme when a value is shared. Follow the team style guide and reuse `src/ui/` primitives before inventing local patterns.

## Prerequisites

- [setting-up-nativewind.md](./setting-up-nativewind.md)

## Guidelines

### Structure

- Keep `tailwind.config.js` and `global.css` at the project root.
- Add shared tokens in `src/theme.css` and `theme.extend`.
- Import only `global.css` from `App.tsx`; import `src/theme.css` from `global.css`.
- Extend `tailwind.config.js`; keep an existing config and add tokens instead of replacing the file.

### Styling rules

- Prefer `className` over inline `style` or `StyleSheet.create`.
- Use `cva` for variant-heavy components; use **`cx`** to merge base classes, variant output, and consumer `className`.
- Prefer shared tokens over arbitrary values; extend the theme when a value repeats.
- Use mobile-first responsive utilities (`sm:`, `md:`, `lg:`, `xl:`) when NativeWind supports them.
- Use `gap` on parents instead of margin chains on children.
- Use `@media ios { }` and `@media android { }` in `global.css` for platform-specific CSS.
- Prefer semantic token names (intent) over literal shade names when the project defines them.
- Keep exceptions (platform quirks, third-party, one experimental screen) local; promote repeated values into tokens.

### Spacing and sizing (4px tolerance)

Tailwind’s default scale is **4px-based** (`1` = 4px). Round specs within a few pixels to the nearest step.

| Spec (example) | Prefer | Avoid |
| --- | --- | --- |
| 15px padding | `p-4` (16px) | `p-[15px]` |
| 22px gap | `gap-5` (20px) or `gap-6` (24px) | `gap-[22px]` |
| 13px font size | `text-sm` (14px) | `text-[13px]` |

Use arbitrary bracket utilities only when the value is truly one-off and cannot use the scale.

### Colors

| Prefer | Avoid |
| --- | --- |
| Semantic utilities (`bg-background`, `text-foreground`, `bg-primary`) | Bracket hex/RGB (`bg-[#1a1a1a]`, `text-[rgb(...)]`) |
| Named palette steps (`bg-neutral-100`, `text-success-700`) | Inline `style` colors when a class exists |
| Add a token to `theme.extend` / `src/theme.css`, then use it | Shipping one-off bracket colors from design |

### Overriding `className`

When consumer utilities overlap shared component classes, prefix conflicting tokens with `!` (for example `!text-lg`, `sm:!p-0`). See [overriding-classname.md](./overriding-classname.md).

## Examples

```tsx
<Pressable className="rounded-lg bg-blue-600 px-4 py-2">
  <Text className="font-semibold text-white">Click me</Text>
</Pressable>
```

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

<View className={cx("rounded-md p-4", isActive && "bg-primary", className)} />;
```

## Related

- [overriding-classname.md](./overriding-classname.md)
- [setting-up-theming.md](./setting-up-theming.md)
- [setting-up-tailwind-theme.md](./setting-up-tailwind-theme.md)
