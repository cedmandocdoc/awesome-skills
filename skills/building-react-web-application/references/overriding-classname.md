# Overriding `className` on shared components (Web)

## Overview

Use this guide when a consumer passes Tailwind utilities through a component `className` prop and those utilities overlap with classes the base component already applies.

When merge behavior prevents the consumer utility from winning, prefix the conflicting utility with Tailwind's important modifier (`!`) so the override applies reliably.

## Guidelines

### When to use `!`

- Use `!` when both base and consumer classes target the same CSS property (for example `text-sm` vs `text-lg`, `p-4` vs `p-2`).
- Do not add `!` everywhere; use it only for real conflicts that do not resolve through normal merge order.

### Component authors

- Keep base classes minimal when a `className` override is part of the component API.
- Prefer dedicated variants (`size`, `variant`, etc.) for standard visual options.

### Consumers

- If an override is not visible, check for conflicting utility categories in the base component.
- Try the important form (`!text-lg`, `!p-2`, `!text-primary`) only on the conflicting utilities.

## Examples

### Conflicting font size

```tsx
<Button className="!text-lg">Save</Button>
```

### Conflicting padding

```tsx
<Card className="!p-2">Summary</Card>
```

### Prefer variants for repeated overrides

```tsx
<Button size="lg">Save</Button>
```
