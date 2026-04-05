# Managing Wrapper Components

## Overview

Use this guide to keep layout trees shallow. Prefer a single wrapper with merged Tailwind classes over stacked `div` elements that only exist to hold one utility group each.

For utility merging, see [styling.md](./styling.md). For how primitives accept `className`, see [creating-component.md](./creating-component.md).

## Guidelines

### Prefer one wrapper

- Merge layout, spacing, and visual classes onto one element when they apply to the same box.
- Use **`cx`** from **`class-variance-authority`** to combine base styles, variants, and a caller `className` prop on that single node.
- Merge classes onto one node instead of nesting `div` elements that only carry separate `className` strings.

### When extra wrappers are justified

Add another wrapper only when layout or accessibility requires a distinct box, for example:

- Different flex or grid sections where merging would hurt readability.
- Interactive boundaries (`<button>`, `<a>`, focusable regions) that must wrap only part of the subtree.
- Scroll containers, sticky headers, or portal targets that need their own layout rules.
- Third-party components that require a specific child structure.

### Routes and features

- Apply the same rule in route components and feature components: default to one outer container with merged classes, then split only for the cases above.

## Examples

### Shallow tree example

```tsx
// Three divs only to layer classes — prefer merging
<div className="flex min-h-screen flex-col">
  <div className="flex-1 bg-background p-4">
    <div className="flex flex-col gap-2">{children}</div>
  </div>
</div>
```

```tsx
// Prefer: one wrapper with merged classes
<div className="flex min-h-screen flex-col gap-2 bg-background p-4">{children}</div>
```

### Merge variant and override classes on one node

```tsx
import type { ReactNode } from "react";
import { cx } from "class-variance-authority";

interface CardProps {
  children: ReactNode;
  className?: string;
}

export function Card({ children, className }: CardProps) {
  return (
    <div className={cx("rounded-xl border border-border bg-card p-4 text-card-foreground", className)}>
      {children}
    </div>
  );
}
```

### Keep a second wrapper when layout requires it

```tsx
// Row for actions, column for content — layout needs two boxes
<div className="flex flex-col gap-4 p-4">
  <div className="flex flex-row items-center justify-between gap-2">
    <h2 className="text-lg font-semibold">Title</h2>
    {/* trailing actions */}
  </div>
  <div className="flex flex-col gap-2">{children}</div>
</div>
```
