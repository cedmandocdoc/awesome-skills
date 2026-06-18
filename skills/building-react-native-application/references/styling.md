# Styling

## Overview

Use this guide to apply Tailwind utilities through `className` with NativeWind. Keep styling token-driven and extend the theme when a value is shared.

## Prerequisites

- [NativeWind — Installation](https://www.nativewind.dev/docs/getting-started/installation)

## Guidelines

### Structure

- Keep `tailwind.config.js` at the project root.
- Keep `global.css` at the project root as the Metro input and app-level CSS import.
- Add shared tokens in `src/theme.css` and `theme.extend`.

### Styling rules

- Use `className` before inline `style` or `StyleSheet.create`.
- Use `cva` for variant-heavy components.
- Use **`cx`** to merge base classes, variant output, and a consumer `className` prop.
- Use shared tokens before arbitrary values.
- Extend `tailwind.config.js` when a value is reused.
- Use mobile-first responsive utilities such as `sm:`, `md:`, `lg:`, and `xl:` when NativeWind supports them.
- Use `gap` on parent layouts instead of margin chains on children.
- Use `@media ios { }` and `@media android { }` in `global.css` when platform-specific CSS is required.
- Keep `global.css` as the only CSS file imported by `App.tsx`.
- Put token layers in `src/theme.css` and import that file from `global.css`.
- Extend `tailwind.config.js`; do not replace an existing config.

### Avoid hardcoded values

**Do not** use arbitrary bracket utilities (`p-[15px]`, `text-[#333]`, `rounded-[7px]`) when a configured scale or token exists. Prefer the closest match on the design system; extend the theme only when no reasonable match exists.

#### Spacing and sizing (4px tolerance)

Tailwind’s default scale is **4px-based** (`1` = 4px). When a spec is off by a few pixels, round to the nearest step instead of an arbitrary value.

| Spec (example) | Prefer | Avoid |
| --- | --- | --- |
| 15px padding | `p-4` (16px) | `p-[15px]` |
| 22px gap | `gap-5` (20px) or `gap-6` (24px) | `gap-[22px]` |
| 13px font size | `text-sm` (14px) | `text-[13px]` |

- Use scale utilities: `p-4`, `gap-2`, `w-64`, `text-sm`, `rounded-lg`.
- Use arbitrary values only when the value is truly one-off **and** cannot be expressed on the scale (document why in a short comment if non-obvious).

#### Colors

- **Never** hardcode colors in utilities (`bg-[#1a1a1a]`, `text-[rgb(...)]`) or inline `style` when a Tailwind class can apply.
- Prefer **semantic** utilities from `src/theme.css` / `theme.extend` (`bg-background`, `text-foreground`, `bg-primary`) when the project defines them.
- Otherwise use **named palette** utilities from `tailwind.config.js` (`bg-neutral-100`, `text-success-700`), not raw hex or RGB in class names.
- With a linked design (Figma, etc.): pick the **closest** existing token or palette step; if nothing is within ~one step visually, **add the color to `theme.extend` or `src/theme.css` first**, then use the new utility—do not ship one-off bracket colors.

### Overriding `className`

When a consumer passes utilities that overlap classes on a shared component, prefix every conflicting token with `!` (for example `!text-lg`, `sm:!p-0`). See [overriding-classname.md](./overriding-classname.md).

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

Use `cx` when combining base classes, variants, and overrides.

```tsx
import { cx } from "class-variance-authority";

<View className={cx("rounded-md p-4", isActive && "bg-primary", className)} />;
```

### Keep variant helpers in styling code

- Put `cva` and `cx` helpers in styling files or style blocks.
- Keep component docs focused on structure and usage.

### Add a reusable token before repeating a raw value

- Arbitrary bracket utilities are a last resort after scale, palette, and semantic tokens.
- When a value repeats—or a design token does not map to the scale—add it to `theme.extend` or `src/theme.css`, then reference the new utility.
