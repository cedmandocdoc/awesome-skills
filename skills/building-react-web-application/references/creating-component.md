# Creating Component

## Overview

Use this guide to write UI and feature components. Keep reusable UI simple and presentation-only, and prefer compound parts for complex controls.

For naming conventions, see [naming-component.md](./naming-component.md).

## Prerequisites

- [abstracting-component.md](./abstracting-component.md) — `src/ui/` vs feature components, registry-first UI, presentation-only rules
- [adding-registry-components.md](./adding-registry-components.md) — validate with `shadcn view`, run `add-registry-component.js`, manual fallback

## Guidelines

### Component rules

- Use functional components and named exports.
- Prefer `interface` for props.
- Use native HTML elements or `@/ui/*` primitives.
- Keep domain logic out of presentational components.
- Prefer compound parts over components that accept raw string or node unions.
- Keep every component at **200 lines or fewer**.
- If a component would exceed 200 lines, stop and follow [abstracting-component.md](./abstracting-component.md) to split it into smaller components or parts before implementing.

## Examples

Prefer a registry-backed primitive when one exists; see [abstracting-component.md](./abstracting-component.md) and the full flow in [adding-registry-components.md](./adding-registry-components.md). Use hand-written `src/ui/` examples below when there is **no** suitable registry item (validation fails, no equivalent component, or you are composing patterns the registry does not ship).

### Add a registry-backed primitive

Validate the registry name or URL, then run the add script from the **app project root** (see [adding-registry-components.md](./adding-registry-components.md) for failure cases and `--root`).

```bash
npx shadcn@latest view button
node path/to/building-react-web-application/scripts/add-registry-component.js button
```

You can pass a full registry item URL instead of a slug when your registry requires it. The script vendors files into `src/ui/` (for example `button.tsx`). Import with `@/ui/button` in routes and features.

### Use primitives inside a feature

```tsx
import { Button } from "@/ui/button";

export function WorkshopCta() {
  return <Button>Join workshop</Button>;
}
```

### Add a custom `src/ui/` primitive (no registry item)

Use this shape when **no registry primitive fits** (or after you deliberately skip the registry path). Keep the component presentation-only.

```tsx
import type { ReactNode } from "react";
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

interface ButtonProps extends React.ComponentProps<"button"> {
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

### Split complex controls into parts (custom primitive)

Use explicit parts such as `Button`, `ButtonText`, and `ButtonIcon` instead of switching on `typeof children`. Same as above: prefer registry-backed pieces when they exist; the compound layout below is for a **custom** primitive when the registry does not provide a match.

```tsx
import type { ReactNode } from "react";
import { cva, cx } from "class-variance-authority";

const rootVariants = cva("inline-flex items-center gap-2 rounded-md px-4 py-2");

export function Button({ children, className, ...props }: React.ComponentProps<"button">) {
  return (
    <button type="button" className={cx(rootVariants(), className)} {...props}>
      {children}
    </button>
  );
}

export function ButtonText({ children }: { children: ReactNode }) {
  return <span className="font-medium">{children}</span>;
}

export function ButtonIcon({ children }: { children: ReactNode }) {
  return <span className="inline-flex shrink-0">{children}</span>;
}
```

Usage in a route or feature:

```tsx
<Button>
  <ButtonIcon>{/* icon */}</ButtonIcon>
  <ButtonText>Save</ButtonText>
</Button>
```
