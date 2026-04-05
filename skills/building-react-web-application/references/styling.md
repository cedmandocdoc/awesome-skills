# Styling

## Overview

Use this guide to apply Tailwind utility classes in React via `className`, with **Tailwind CSS v4** and the Vite plugin. Keep styling token-driven; use **CVA** for variants and **`cx`** from `@/lib/utils` for merging classes.

## Prerequisites

- [Tailwind CSS — Using Vite](https://tailwindcss.com/docs/installation/using-vite)
- [setting-up-theming.md](./setting-up-theming.md) for `global.css`, `src/theme.css`, and tokens

## Guidelines

### Structure

- Configure Tailwind as the Vite plugin (`@tailwindcss/vite`) per the official guide.
- Keep **project-root `global.css`** as the only entry: it imports Tailwind (v4), shadcn’s Tailwind imports, then **`./src/theme.css`**. Import `global.css` once from the app entry (e.g. `main.tsx`).
- Prefer **semantic utilities** backed by CSS variables from the theme setup (`bg-background`, `text-foreground`, etc.) when the project defines them.

### The `cx` helper

- Define **`cx`** in `src/lib/utils.ts` using `clsx` + `tailwind-merge` so conflicting utilities resolve predictably.
- Use **`cx`** (not `cn`) for all new code and when adapting shadcn output—see [abstracting-component.md](./abstracting-component.md) and the add-registry script.

### Styling rules

- Use `className` for layout and visuals; avoid inline `style` except for truly dynamic values that utilities cannot express.
- Use **`cva`** for variant-heavy components.
- Use **`cx`** from `@/lib/utils` to merge base classes, variant output, and a consumer `className` prop.
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
import { cx } from "@/lib/utils";

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
import { cx } from "@/lib/utils";

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
