# Creating UI Component

## Overview

**Execution mode.** Create shared presentational primitives in `src/ui/`. Start from the [creating-component.md → Decision tree](./creating-component.md#decision-tree).

**Registry-first:** check `src/ui/` for an existing primitive. If missing, validate with shadcn/ui via `shadcn view` before vendoring. Build manually only when validation fails or no registry item fits.

## Prerequisites

- [creating-component.md](./creating-component.md) — shared rules (functional/named export, one component/file, ≤200 lines, presentation-only, naming baseline)
- [managing-styling.md](./managing-styling.md), [setting-up-theming.md](./setting-up-theming.md) — `global.css` / `src/theme.css` and `src/ui` layout
- [managing-wrapper-components.md](./managing-wrapper-components.md) — shallow wrappers and `cx` merging
- [discovering-registry-components.md](./discovering-registry-components.md) — intent-to-component lookup

## Guidelines

- Compose with native HTML elements or `@/ui/*`.
- Normalize `cn` → `cx`: import `cx` from `class-variance-authority`.

### Folder layout

```text
src/ui/
├── Button.tsx                # single primitive — one export per file
├── ButtonText.tsx            # compound part (sibling file)
├── hooks/                    # reusable UI-only hooks (e.g. useMediaQuery)
└── Form/                     # composition root — see creating-form-component.md
    ├── index.tsx
    └── InputField.tsx
```

- `src/ui/<Component>.tsx` for standalone primitives; import with `@/ui/<Component>`.
- `src/ui/<GroupName>/` when the subsystem has multiple files; export via `index.tsx`.
- `src/ui/hooks/` for reusable UI-only hooks.
- Registry-added primitives land as flat files unless the add script creates a group.

### Naming

- Generic, unprefixed: `Button`, `Input`, `Dialog`, `Card`.
- Compound parts share the root prefix: `Button`, `ButtonText`, `ButtonIcon` — one export per file.
- Encode variant state via props, not names (`Button` with `tone` prop, not `PrimaryButton`).

### Registry lookup

Map the request to candidates with [discovering-registry-components.md](./discovering-registry-components.md), then validate below.

### Validate with `shadcn view`

```bash
node ../scripts/run-package.cjs -- shadcn@latest view "${slug_or_url}"
```

1. Confirm exit code 0.
2. Parse stdout as JSON (strip markdown code fences if present).
3. Expect a JSON array with at least one object containing `"$schema": "https://ui.shadcn.com/schema/registry-item.json"`.

If validation fails, build manually per [Custom primitive](#add-a-custom-srcui-primitive-no-registry-item).

### Run the add script

```bash
node ../scripts/run-package.cjs -- shadcn@latest view button
node ../scripts/add-registry-component.cjs button
```

Pass a full registry item URL when the slug is not enough. Use `--root <project-dir>` when cwd is not the app root.

The script vendors files into `src/ui/`, rewrites `cn` → `cx`, and fixes import paths. Import with `@/ui/Button`.

## Examples

### Add a custom `src/ui/` primitive (no registry item)

```tsx
import type { ComponentProps, ReactNode } from "react";
import { cva, cx } from "class-variance-authority";

const buttonVariants = cva(
  "inline-flex items-center justify-center rounded-md font-medium transition-colors",
  {
    variants: {
      tone: {
        primary: "bg-primary text-primary-foreground hover:bg-primary/90",
        secondary: "bg-secondary text-secondary-foreground hover:bg-secondary/80",
      },
    },
    defaultVariants: { tone: "primary" },
  },
);

interface ButtonProps extends ComponentProps<"button"> {
  tone?: "primary" | "secondary";
  children: ReactNode;
}

export function Button({ tone, className, children, ...props }: ButtonProps) {
  return (
    <button type="button" className={cx(buttonVariants({ tone }), className)} {...props}>
      {children}
    </button>
  );
}
```

## Related

- [add-registry-component.cjs](../scripts/add-registry-component.cjs) — vendoring script
- [managing-styling.md](./managing-styling.md) — Tailwind utilities and CVA patterns
- [overriding-classname.md](./overriding-classname.md) — targeted `!` overrides on shared components
