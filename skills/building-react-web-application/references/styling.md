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

### The `cx` helper

- Import **`cx`** from **`class-variance-authority`** (same merge API as `clsx`). Registry snippets often say **`cn`**; this stack standardizes on **`cx`**—see [abstracting-component.md](./abstracting-component.md) and the add-registry script.

### Styling rules

- Use `className` for layout and visuals; reserve inline `style` for dynamic values that utilities cannot express.
- Use **`cva`** for variant-heavy components.
- Use **`cx`** from **`class-variance-authority`** to merge base classes, variant output, and a consumer `className` prop.
- Prefer shared tokens and semantic classes before arbitrary values.
- Use responsive utilities (`sm:`, `md:`, `lg:`, `xl:`) as needed.
- Use `gap` on flex/grid parents instead of margin chains on children.

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
import { cx } from "class-variance-authority";

export function Card({
  className,
  ...props
}: React.ComponentProps<"div">) {
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

- Use arbitrary bracket utilities for one-offs only.
- When a value repeats, add or extend tokens in the global theme CSS (`@theme` / variables) as described in [setting-up-theming.md](./setting-up-theming.md) and [setting-up-tailwind-theme.md](./setting-up-tailwind-theme.md).
