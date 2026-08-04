# Overriding className

## Overview

Use this guide when a consumer passes NativeWind utilities through a component `className` prop and those utilities overlap with classes already applied by the base component.

Prefix every conflicting consumer utility with Tailwind's important modifier (`!`) so the override applies reliably. This is necessary because `cx` concatenates classes without deduplication — `!` forces the consumer utility to win.

## Guidelines

### When to use `!`

- Use whenever a consumer's `className` includes utilities in the same Tailwind category as the base component (typography, spacing, color, layout, etc.).
- Inspect the base component's default and variant classes to find overlaps before a style fails to appear.
- Two utilities conflict when they target the same category — for example `text-sm` vs `text-lg`, or `p-4` vs `p-2`.

### Which utilities get `!`

- Prefix `!` on **every** consumer utility that conflicts with the base — not the full `className` string, and not only the first conflict.
- Leave non-conflicting utilities unprefixed.

### Variants

Classes like `sm:p-0` and `hover:bg-primary` stack one or more **variants** (responsive, state, `ios:`, `dark:`, etc.) before the utility. Place `!` **after** the variant(s) and **before** the utility:

| Input | Correct | Incorrect |
| --- | --- | --- |
| Responsive padding | `sm:!p-0` | `!sm:p-0`, `sm:p-0!` |
| Hover background | `hover:!bg-primary` | `hover:bg-primary!` |
| Multiple variants | `md:hover:!bg-primary` | `!md:hover:bg-primary` |

### Component authors

- Keep default classes minimal when `className` is part of the public API.
- Prefer explicit variants (`size`, `tone`, `intent`) for common visual choices.

### Consumers

- Read the base component's default `className` and variant output before overriding.
- Apply `!` to each conflicting token (for example `!text-lg`, `!p-2`, `!text-primary`).

## Examples

### Conflicting text size

```tsx
<TextLabel className="!text-lg">Profile</TextLabel>
```

### Conflicting spacing

```tsx
<Surface className="!p-2">Card content</Surface>
```

### Multiple conflicts in one `className`

```tsx
<Label className="!text-label !font-body-semibold text-foreground">Name</Label>
```

`text-label` and `font-body-semibold` conflict with defaults on `Label`; `text-foreground` does not, so it stays unprefixed.

### Conflicting variant-prefixed utilities

```tsx
<Surface className="sm:!p-0">Card content</Surface>
<Pressable className="hover:!bg-primary">Save</Pressable>
```

### Prefer variants for reusable options

```tsx
<TextLabel size="lg">Profile</TextLabel>
```
