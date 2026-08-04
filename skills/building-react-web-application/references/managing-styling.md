# Managing Styling

## Overview

Apply Tailwind utility classes via `className` with **Tailwind CSS v4** and the Vite plugin. Prefer design tokens and the project style guide; use **`cva`** and **`cx`** from **`class-variance-authority`** for variants and merging (no custom `cn` file or **`tailwind-merge`**).

## Prerequisites

- [Tailwind CSS — Using Vite](https://tailwindcss.com/docs/installation/using-vite)
- [setting-up-theming.md](./setting-up-theming.md) for `global.css`, `src/theme.css`, and tokens

## Guidelines

### Style guide first

- Follow the repo or team style guide before inventing new patterns.
- Reuse `src/ui/` primitives and established utility patterns before one-off styling.

### Structure

- Configure Tailwind as the Vite plugin (`@tailwindcss/vite`) per the official guide.
- CSS entry and tokens: [setting-up-theming.md](./setting-up-theming.md).
- Prefer **semantic utilities** from the theme (`bg-background`, `text-foreground`, etc.).

### Styling rules

- Use `className` for layout and visuals; reserve inline `style` for values utilities cannot express.
- Use **`cva`** for variant-heavy components; colocate definitions with the component or a sibling `*.styles.ts`.
- Use **`cx`** to merge base classes, variant output, and consumer `className`. Registry snippets often say **`cn`**; this stack uses **`cx`**.
- Use responsive utilities (`sm:`, `md:`, `lg:`, `xl:`) as needed.
- Use `gap` on flex/grid parents instead of margin chains on children.
- Third-party or experimental one-offs may stay local; promote repeated values into tokens.

### Design tokens over raw values

Prefer theme-backed scale and semantic classes. Use arbitrary bracket utilities only when the value is truly one-off and cannot be expressed on the scale.

#### Spacing and sizing (4px tolerance)

Tailwind’s default scale is **4px-based** (`1` = 4px). Round near-miss specs to the nearest step.

| Spec (example) | Prefer | Avoid |
| --- | --- | --- |
| 15px padding | `p-4` (16px) | `p-[15px]` |
| 22px gap | `gap-5` (20px) or `gap-6` (24px) | `gap-[22px]` |
| 13px font size | `text-sm` (14px) | `text-[13px]` |

#### Colors

- Prefer **semantic** utilities (`bg-background`, `text-foreground`, `border-border`, `bg-primary`) when defined.
- Otherwise use **named palette** utilities from the theme (`bg-muted`, `text-destructive`), not hex or RGB in class names.
- With a linked design: pick the closest existing token; if nothing is close, **add the color to the theme** ([setting-up-theming.md](./setting-up-theming.md), [setting-up-tailwind-theme.md](./setting-up-tailwind-theme.md)), then use the new utility.
- Prefer semantic token names (intent) over literal shade names when the project defines them.

### Overriding `className`

When a consumer passes utilities that overlap classes on a shared component, mark every conflicting token with `!` at the end (for example `text-lg!`, `sm:p-0!`). See [overriding-classname.md](./overriding-classname.md).

### Reusable values

When a value repeats—or a design token does not map to the scale—extend tokens in `src/theme.css` per [setting-up-theming.md](./setting-up-theming.md) and [setting-up-tailwind-theme.md](./setting-up-tailwind-theme.md), then use the new utility.

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

## Related

- [setting-up-theming.md](./setting-up-theming.md)
- [setting-up-tailwind-theme.md](./setting-up-tailwind-theme.md)
- [overriding-classname.md](./overriding-classname.md)
- [creating-ui-component.md](./creating-ui-component.md)
