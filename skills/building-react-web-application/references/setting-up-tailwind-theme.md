# Setting Up Tailwind Theme (semantic tokens)

## Overview

After [setting-up-theming.md](./setting-up-theming.md), utilities like `bg-background`, `text-primary`, and `rounded-lg` resolve through the **`@theme inline`** block and CSS variables defined in **`src/theme.css`** (content aligned with the shadcn manual **Configure styles** section, split from root `global.css`). This file covers **conventions** for using those tokens in components; **edit the variable definitions only in `src/theme.css`** (no second copy of the block here).

## Prerequisites

- [setting-up-theming.md](./setting-up-theming.md)

## Guidelines

### Prefer semantic utilities

- Use **role-based** classes tied to CSS variables: `bg-background`, `text-foreground`, `border-border`, `bg-primary`, `text-primary-foreground`, `text-muted-foreground`, `bg-destructive`, etc.
- Use **radius** tokens (`rounded-md`, `rounded-lg`, …) that map to `--radius` when the theme defines them.
- For charts or sidebars, use the semantic names your theme exports (`chart-1`, `sidebar-*`, …) if present.

### Light and dark

- Dark mode follows the **`.dark`** class (or the variant from the manual). Use semantic tokens with `dark:` variants; reach for separate light/dark hex only when no token covers the case.

### Extending the theme

- When adding a new **reused** color or radius, add a CSS variable in `:root` / `.dark`, wire it through `@theme inline` if required by Tailwind v4 setup, then use the generated utility name.
- Keep one-off values as arbitrary utilities only until they repeat.

### Relation to CVA

- Map CVA variants to **semantic utilities** (`primary`, `secondary`, `destructive`, `ghost`, …) aligned with `src/ui` primitives so features stay on the same token set.

## Examples

```tsx
import { cx } from "class-variance-authority";

export function Panel({ className, ...props }: React.ComponentProps<"section">) {
  return (
    <section
      className={cx(
        "rounded-lg border border-border bg-card p-4 text-card-foreground shadow-sm",
        className,
      )}
      {...props}
    />
  );
}
```

If a utility is missing after editing variables, confirm the `@theme inline` mapping in `src/theme.css` matches the shadcn manual pattern and that Tailwind content paths include `src/`.
