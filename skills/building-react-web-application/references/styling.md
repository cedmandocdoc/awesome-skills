# Styling

## Overview

Use this guide to apply Tailwind utility classes in React via `className`, with **Tailwind CSS v4** and the Vite plugin. Keep styling token-driven; use **`cva`** and **`cx`** from **`class-variance-authority`** for variants and merging `className` values (no custom `cn` merge file or **`tailwind-merge`**).

## Prerequisites

- [Tailwind CSS — Using Vite](https://tailwindcss.com/docs/installation/using-vite)
- [setting-up-theming.md](./setting-up-theming.md) for `global.css`, `src/theme.css`, and tokens

## Guidelines

### Structure

- Configure Tailwind as the Vite plugin (`@tailwindcss/vite`) per the official guide.
- Keep **project-root `global.css`** as the only entry: it imports Tailwind (v4), shadcn’s Tailwind imports, then **`./src/theme.css`**. Import `global.css` once from the app entry (e.g. `main.tsx`).
- Prefer **semantic utilities** backed by CSS variables from the theme setup (`bg-background`, `text-foreground`, etc.) when the project defines them.

### Styling rules

- Use `className` for layout and visuals; reserve inline `style` for dynamic values that utilities cannot express.
- Use **`cva`** for variant-heavy components.
- Use **`cx`** from **`class-variance-authority`** to merge base classes, variant output, and a consumer `className` prop. Registry snippets often say **`cn`**; this stack standardizes on **`cx`**—see [creating-ui-component.md](./creating-ui-component.md).
- Prefer shared tokens and semantic classes before arbitrary values.
- Use responsive utilities (`sm:`, `md:`, `lg:`, `xl:`) as needed.
- Use `gap` on flex/grid parents instead of margin chains on children.

### Avoid hardcoded values

**Do not** use arbitrary bracket utilities (`p-[15px]`, `text-[#333]`, `rounded-[7px]`) when a configured scale or token exists. Prefer the closest match on the design system; add a token only when no reasonable match exists.

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
- Prefer **semantic** utilities from the theme (`bg-background`, `text-foreground`, `border-border`, `bg-primary`) when defined in [setting-up-theming.md](./setting-up-theming.md).
- Otherwise use **named palette** utilities from the extended theme (`bg-muted`, `text-destructive`), not raw hex or RGB in class names.
- With a linked design (Figma, etc.): pick the **closest** existing token or palette step; if nothing is within ~one step visually, **add the color to the theme first** ([setting-up-theming.md](./setting-up-theming.md), [setting-up-tailwind-theme.md](./setting-up-tailwind-theme.md)), then use the new utility—do not ship one-off bracket colors.

### Overriding `className`

When a consumer passes utilities that overlap classes on a shared component, mark every conflicting token with `!` at the end (for example `text-lg!`, `sm:p-0!`). See [overriding-classname.md](./overriding-classname.md).

## Examples

### Start with utility classes

```tsx
<button
  type="button"
  className="rounded-lg bg-primary px-4 py-2 font-semibold text-primary-foreground"
>
  Click me
</button>
```

### Use variants with `cva`

```tsx
import { cva } from "class-variance-authority";

const pill = cva("rounded-full px-3 py-1", {
  variants: {
    tone: {
      neutral: "bg-muted text-muted-foreground",
      success: "bg-green-100 text-green-800 dark:bg-green-950 dark:text-green-200",
    },
  },
  defaultVariants: { tone: "neutral" },
});
```

### Merge classes with `cx`

```tsx
import type { ComponentProps } from "react";
import { cx } from "class-variance-authority";

export function Card({
  className,
  ...props
}: ComponentProps<"div">) {
  return (
    <div
      className={cx("rounded-xl border border-border bg-card p-4 text-card-foreground", className)}
      {...props}
    />
  );
}
```

### Keep variant helpers in styling code

- Colocate `cva` definitions with the component or a sibling `*.styles.ts` when it helps readability.
- Keep component docs focused on structure and usage.

### Reusable values

- Arbitrary bracket utilities are a last resort after scale, palette, and semantic tokens.
- When a value repeats—or a design token does not map to the scale—add or extend tokens in the global theme CSS (`@theme` / variables) as described in [setting-up-theming.md](./setting-up-theming.md) and [setting-up-tailwind-theme.md](./setting-up-tailwind-theme.md), then reference the new utility.
