# Setting Up Tailwind Theme

## Overview

Conventions for using theme tokens in components after [setting-up-theming.md](./setting-up-theming.md). Edit variable definitions only in **`src/theme.css`**.

## Prerequisites

- [setting-up-theming.md](./setting-up-theming.md)

## Guidelines

### Prefer semantic utilities

- Use **role-based** classes: `bg-background`, `text-foreground`, `border-border`, `bg-primary`, `text-primary-foreground`, `text-muted-foreground`, `bg-destructive`, etc.
- Use **radius** tokens (`rounded-md`, `rounded-lg`, …) that map to `--radius` when defined.
- For charts or sidebars, use the semantic names the theme exports (`chart-1`, `sidebar-*`, …) if present.

### Light and dark

Dark mode follows the **`.dark`** class. Use semantic tokens with `dark:` variants; separate light/dark hex only when no token covers the case.

### Extending the theme

- For a new **reused** color or radius: add a CSS variable in `:root` / `.dark`, wire through `@theme inline` if required, then use the generated utility.
- Keep one-off values as arbitrary utilities only until they repeat.

### Relation to CVA

Map CVA variants to **semantic utilities** (`primary`, `secondary`, `destructive`, `ghost`, …) aligned with `src/ui` primitives.

## Examples

```tsx
import type { ComponentProps } from "react";
import { cx } from "class-variance-authority";

export function Panel({ className, ...props }: ComponentProps<"section">) {
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

If a utility is missing after editing variables, confirm the `@theme inline` mapping in `src/theme.css` and that Tailwind content paths include `src/`.

## Related

- [managing-styling.md](./managing-styling.md)
- [setting-up-theming.md](./setting-up-theming.md)
