# Creating UI Component

## Overview

Create **shared presentational primitives** in `src/ui/`. Start from the [creating-component.md](./creating-component.md) decision tree.

**Registry-first:** check `src/ui/` for an existing primitive. If missing, validate with shadcn/ui via `shadcn view` before vendoring. Build manually only when validation fails or no registry item fits.

## Prerequisites

- [creating-component.md](./creating-component.md) — placement and shared rules
- [setting-up-theming.md](./setting-up-theming.md), [managing-project-structure.md](./managing-project-structure.md) — `global.css` / `src/theme.css` and `src/ui` layout
- [managing-wrapper-components.md](./managing-wrapper-components.md) — shallow wrappers and `cx` merging

## Folder layout

`src/ui/` stays **flat and presentation-only** — no business logic, features, API, or stores. The layout below is the default; group files when a subsystem owns multiple related pieces.

```text
src/ui/
├── Button.tsx                # single primitive — one export per file
├── ButtonText.tsx            # compound part (sibling file)
├── hooks/                    # reusable UI-only hooks (e.g. useMediaQuery)
└── Form/                     # composition root — see creating-form-component.md
    ├── index.tsx             # public barrel for the group
    └── InputField.tsx
```

### Layout rules

- Prefer `src/ui/<Component>.tsx` for standalone primitives; import with `@/ui/<Component>`.
- Group related files under `src/ui/<GroupName>/` when the subsystem has multiple files; export the public API from `index.tsx` or `index.ts`.
- Put reusable UI-only hooks in `src/ui/hooks/` — not feature or data hooks.
- Registry-added primitives land as flat files unless the add script creates a group.

## Naming

- Generic, unprefixed names: `Button`, `Input`, `Dialog`, `Card`.
- Compound parts share the root prefix: `Button`, `ButtonText`, `ButtonIcon` — **one export per file**.
- Do not encode variant state in the name (`PrimaryButton` → `Button` with `tone` prop).

## Validate with `shadcn view`

Before running the add script, confirm the registry entry resolves:

1. Run (registry slug or full URL):

   ```bash
   npx shadcn@latest view "${url}"
   ```

2. Confirm exit code **0**.

3. Parse stdout as JSON (strip markdown code fences if present).

4. Expect a **JSON array** with at least one object containing:

   `"$schema": "https://ui.shadcn.com/schema/registry-item.json"`

If validation fails, **do not** run the add script. Build manually per [Manual primitive](#add-a-custom-srcui-primitive-no-registry-item) below.

## Run the add script

From the app **project root**:

```bash
npx shadcn@latest view button
node path/to/building-react-web-application/scripts/add-registry-component.cjs button
```

Pass a full registry item URL when the slug is not enough. Use `--root <project-dir>` when the cwd is not the app root.

The script vendors files into `src/ui/` (for example `Button.tsx`), rewrites `cn` → `cx`, and fixes import paths. Import with `@/ui/Button`.

When the script cannot resolve a dependency, add the component by hand and keep it presentation-only.

## Guidelines

- Use native HTML elements or `@/ui/*` when composing.
- Keep components presentation-only — props in, UI out.
- Normalize **`cn` → `cx`**: import **`cx`** from **`class-variance-authority`** when editing registry output by hand.

## Examples

### Use a vendored primitive in a feature

```tsx
import { Button } from "@/ui/Button";

export function WorkshopCta() {
  return <Button>Join workshop</Button>;
}
```

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

### Split complex controls into parts

Put each part in its own file under `src/ui/`:

`src/ui/Button.tsx`:

```tsx
import type { ComponentProps, ReactNode } from "react";
import { cva, cx } from "class-variance-authority";

const rootVariants = cva("inline-flex items-center gap-2 rounded-md px-4 py-2");

export function Button({ children, className, ...props }: ComponentProps<"button">) {
  return (
    <button type="button" className={cx(rootVariants(), className)} {...props}>
      {children}
    </button>
  );
}
```

`src/ui/ButtonText.tsx` / `src/ui/ButtonIcon.tsx` — same pattern; compose in features:

```tsx
<Button>
  <ButtonIcon>{/* icon */}</ButtonIcon>
  <ButtonText>Save</ButtonText>
</Button>
```

## Related

- [add-registry-component.cjs](../scripts/add-registry-component.cjs) — vendoring script
- [styling.md](./styling.md) — Tailwind utilities and CVA patterns
- [overriding-classname.md](./overriding-classname.md) — targeted `!` overrides on shared components
