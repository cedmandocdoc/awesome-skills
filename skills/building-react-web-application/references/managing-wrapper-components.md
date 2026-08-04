# Managing Wrapper Components

## Overview

Keep layout trees shallow. Prefer a single wrapper with merged Tailwind classes over stacked `div` elements that only hold one utility group each.

For utility merging, see [managing-styling.md](./managing-styling.md). For how primitives accept `className`, see [creating-ui-component.md](./creating-ui-component.md).

## Guidelines

### Prefer one wrapper

- Merge layout, spacing, and visual classes onto one element when they apply to the same box.
- Use `cx` from `class-variance-authority` to combine base styles, variants, and a caller `className` on a single node.

### When extra wrappers are justified

Add another wrapper only when layout or accessibility requires a distinct box:

- Different flex or grid sections where merging would hurt readability.
- Interactive boundaries (`<button>`, `<a>`, focusable regions) wrapping only part of the subtree.
- Scroll containers, sticky headers, or portal targets with their own layout rules.
- Third-party components requiring a specific child structure.

## Examples

### Before / after

```tsx
<div className="flex min-h-screen flex-col">
  <div className="flex-1 bg-background p-4">
    <div className="flex flex-col gap-2">{children}</div>
  </div>
</div>
```

```tsx
<div className="flex min-h-screen flex-col gap-2 bg-background p-4">{children}</div>
```

### Merge variant and override classes on one node

```tsx
import { cx } from "class-variance-authority";

interface CardProps { children: ReactNode; className?: string }

export function Card({ children, className }: CardProps) {
  return (
    <div className={cx("rounded-xl border border-border bg-card p-4 text-card-foreground", className)}>
      {children}
    </div>
  );
}
```
