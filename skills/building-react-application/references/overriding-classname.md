# Overriding `className` on shared components

## Overview

Use this guide when a **consumer** passes Tailwind utilities through a component’s `className` (or equivalent) prop and those utilities **overlap** with classes the **base component** already applies. In merged class strings, the same utility family (for example `text-sm` vs `text-lg`) can fail to win at the consumer without raising the declaration’s priority.

When that happens, the consumer should prefix the conflicting utilities with Tailwind’s **important modifier** (`!`) so the override applies reliably.

This stack assumes **Tailwind CSS** and merged class names (for example via `cx()` helper). The `!` prefix compiles to CSS `!important` on that utility’s declarations.

## Guidelines

### When to use `!`

- Use `!` on a consumer-supplied class when it **targets the same CSS property** as a class still present on the base component (for example both sides set font size, padding, or color).
- Do **not** sprinkle `!` on every override; use it only where merge order or duplicate utilities prevent the consumer class from taking effect.

### Component authors

- If a prop is documented as a `className` override, keep base classes minimal or use design tokens so consumers need fewer `!` overrides.
- Prefer **variants** or dedicated props (for example `size`, `variant`) when the design system encodes allowed looks; reserve `className` for layout and one-off tweaks.

### Consumers

- If an override does not visually apply, check whether the base component uses the same Tailwind utility **category**; if so, try the `!` form of the consumer utility (for example `!text-lg` instead of `text-lg`).

## Examples

### Conflicting font size

Base `Button` always includes `text-sm`. The screen needs a larger label.

```tsx
<Button className="!text-lg">Save</Button>
```

Without `!`, `text-lg` may lose to `text-sm` depending on how classes are concatenated and merged.

### Conflicting padding

Base `Card` applies `p-4`. The consumer needs tighter padding on one instance.

```tsx
<Card className="!p-2">Summary</Card>
```

### Prefer variants when the override is standard

If every usage needs `!text-lg`, consider extending the component API instead of repeating important modifiers.

```tsx
// Prefer when it is a first-class design option
<Button size="lg">Save</Button>
```
