# Creating Component

## Overview

Use this guide to write UI and feature components. Keep reusable UI simple and presentation-only, and prefer compound parts for complex controls.

For naming conventions, see [naming-component.md](./naming-component.md).

## Prerequisites

- [abstracting-component.md](./abstracting-component.md) — `src/ui/` vs feature components, registry-first UI, presentation-only rules

## Guidelines

### Component rules

- Use functional components and named exports.
- Prefer `interface` for props.
- Use native HTML elements or `@/ui/*` primitives.
- Keep domain logic out of presentational components.
- Prefer compound parts over components that accept raw string or node unions.

## Examples

### Create a shared primitive

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

### Use primitives inside a feature

```tsx
import { Button } from "@/ui/button";

export function WorkshopCta() {
  return <Button>Join workshop</Button>;
}
```

### Split complex controls into parts

Use explicit parts such as `Button`, `ButtonText`, and `ButtonIcon` instead of switching on `typeof children`.

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
