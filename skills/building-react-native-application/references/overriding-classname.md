# Overriding `className` on shared components (Native)

## Overview

Use this guide when a consumer passes NativeWind utilities through a component `className` prop and those utilities overlap with classes already applied by the base component.

When a consumer override does not apply because of utility conflicts, prefix the conflicting utility with Tailwind's important modifier (`!`) to force the intended style.

## Guidelines

### When to use `!`

- Use `!` when both base and consumer classes target the same style category (for example `text-sm` vs `text-lg`, `p-4` vs `p-2`).
- Do not use `!` by default; reserve it for concrete conflicts.

### Component authors

- Keep default classes minimal when `className` is part of the public API.
- Prefer explicit variants (`size`, `tone`, `intent`) for common visual choices.

### Consumers

- If a style change is not visible, inspect the base component for conflicting utilities.
- Apply `!` only to conflicting utility tokens rather than the full class string.

## Examples

### Conflicting text size

```tsx
<TextLabel className="!text-lg">Profile</TextLabel>
```

### Conflicting spacing

```tsx
<Surface className="!p-2">Card content</Surface>
```

### Prefer variants for reusable options

```tsx
<TextLabel size="lg">Profile</TextLabel>
```
