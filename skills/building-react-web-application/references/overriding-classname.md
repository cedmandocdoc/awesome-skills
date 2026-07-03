# Overriding className

## Overview

Use this guide when a consumer passes Tailwind utilities through a component `className` prop and those utilities overlap with classes the base component already applies.

Mark every conflicting consumer utility with Tailwind's important modifier (`!`) so the override applies reliably. This stack uses **Tailwind CSS v4**: place `!` at the **end** of the class name (for example `text-lg!`, `sm:p-0!`).

## Guidelines

### When to use `!`

- Use this whenever a consumer's `className` includes utilities in the same Tailwind category as the base component (typography, spacing, color, layout, etc.).
- Inspect the base component's default and variant classes to find overlaps; do not wait until a style fails to appear.
- Two utilities conflict when they target the same category—for example `text-sm` vs `text-lg`, or `p-4` vs `p-2`.

### Which utilities get `!`

- Add `!` at the **end** of **every** conflicting consumer utility—not the full `className` string, and not only the first conflict you notice.
- Leave non-conflicting utilities without `!`.

### Variants

Classes like `sm:p-0` and `hover:bg-primary` stack one or more **variants** (responsive, state, `dark:`, etc.) before the utility. When a variant-prefixed utility conflicts with the base, still suffix `!` at the very end of that token:

- `sm:p-0!` — not `sm:!p-0`
- `hover:bg-primary!` — not `hover:!bg-primary`
- `md:hover:bg-primary!` when multiple variants apply

### Component authors

- Keep base classes minimal when a `className` override is part of the component API.
- Prefer dedicated variants (`size`, `variant`, etc.) for standard visual options.

### Consumers

- Read the base component's default `className` and variant output before overriding.
- Apply `!` at the end of each conflicting token (for example `text-lg!`, `p-2!`, `text-primary!`).

### Why `!` is needed

This stack merges classes with **`cx`** from `class-variance-authority`, which concatenates class strings but does **not** deduplicate Tailwind utilities (there is no `tailwind-merge`). When base and consumer classes target the same utility category, both remain in the DOM and CSS source order decides the winner—not the consumer's intent. The `!` modifier forces the consumer utility to win.

## Examples

### Conflicting font size

```tsx
<Button className="text-lg!">Save</Button>
```

### Conflicting padding

```tsx
<Card className="p-2!">Summary</Card>
```

### Multiple conflicts in one `className`

```tsx
<Label className="text-label! font-body-semibold! text-foreground">Name</Label>
```

`text-label` and `font-body-semibold` conflict with defaults on `Label`; `text-foreground` does not, so it stays without `!`.

### Conflicting variant-prefixed utilities

```tsx
<Card className="sm:p-0!">Summary</Card>
<Button className="hover:bg-primary!">Save</Button>
```

### Prefer variants for repeated overrides

```tsx
<Button size="lg">Save</Button>
```
