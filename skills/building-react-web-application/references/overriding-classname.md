# Overriding className

## Overview

When a consumer passes Tailwind utilities through a `className` prop that overlap classes the base component already applies, mark every conflicting consumer utility with Tailwind’s important modifier (`!`). This stack uses **Tailwind CSS v4**: place `!` at the **end** of the class name (for example `text-lg!`, `sm:p-0!`).

`cx` concatenates class strings and does not dedupe Tailwind utilities. Suffix `!` on conflicting consumer tokens so they win.

## Guidelines

### When to use `!`

- Use when a consumer’s `className` includes utilities in the same Tailwind category as the base (typography, spacing, color, layout, etc.).
- Inspect the base component’s default and variant classes for category overlap before shipping overrides.
- Two utilities conflict when they target the same category—for example `text-sm` vs `text-lg`, or `p-4` vs `p-2`.

### Which utilities get `!`

- Add `!` at the **end** of **every** conflicting consumer utility—not the full `className` string.
- Leave non-conflicting utilities without `!`.

### Variants

When a variant-prefixed utility conflicts, still suffix `!` at the very end of that token:

- `sm:p-0!` — not `sm:!p-0`
- `hover:bg-primary!` — not `hover:!bg-primary`
- `md:hover:bg-primary!` when multiple variants apply

### Authors and consumers

- Keep base classes minimal when `className` override is part of the API; prefer dedicated variants (`size`, `variant`) for standard options.
- Consumers: read the base default `className` and variant output before overriding; apply `!` at the end of each conflicting token.

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
