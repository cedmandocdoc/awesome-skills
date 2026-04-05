# Setting Up Tailwind Theme (semantic tokens)

## Overview

After [setting-up-theming.md](./setting-up-theming.md), utilities like `bg-background`, `text-primary`, and `rounded-lg` resolve through the **`@theme inline`** block and CSS variables defined in `globals.css` (per the shadcn manual **Configure styles** section). This file describes **conventions** for using those tokens in components—**do not duplicate** the large variable block here; change tokens in one place (`globals.css`).

## Prerequisites

- [setting-up-theming.md](./setting-up-theming.md)

## Guidelines

### Prefer semantic utilities

- Use **role-based** classes tied to CSS variables: `bg-background`, `text-foreground`, `border-border`, `bg-primary`, `text-primary-foreground`, `text-muted-foreground`, `bg-destructive`, etc.
- Use **radius** tokens (`rounded-md`, `rounded-lg`, …) that map to `--radius` when the theme defines them.
- For charts or sidebars, use the semantic names your theme exports (`chart-1`, `sidebar-*`, …) if present.

### Light and dark

- Dark mode is driven by the **`.dark`** class (or the variant defined in the manual). Components should not hard-code separate light/dark hex pairs unless there is no token; prefer `dark:` variants that still reference semantic tokens when needed.

### Extending the theme

- When adding a new **reused** color or radius, add a CSS variable in `:root` / `.dark`, wire it through `@theme inline` if required by Tailwind v4 setup, then use the generated utility name.
- Keep one-off values as arbitrary utilities only until they repeat.

### Relation to CVA

- Map CVA variants to **semantic utilities** (`primary`, `secondary`, `destructive`, `ghost`, …) that align with your `src/ui` primitives so features do not reintroduce raw palette classes.

## Examples

```tsx
import { cx } from "@/lib/utils";

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

If a utility is missing after editing variables, confirm the `@theme inline` mapping in `globals.css` matches the shadcn manual pattern and that Tailwind content paths include `src/`.
