# Styling preference

## Overview

Prefer the project’s current style guide and *design tokens* over ad hoc colors, spacing, and typography. Tokens keep routes, features, and components consistent and easier to change.

For utilities and `cx` / CVA, see [styling.md](./styling.md). For wiring tokens in CSS, see [setting-up-theming.md](./setting-up-theming.md) and [setting-up-tailwind-theme.md](./setting-up-tailwind-theme.md).

## Guidelines

### Style guide first

- When the repo or team documents layout, components, or tokens, follow that guide before inventing new patterns.
- Reuse primitives in `src/ui/` and established utility patterns before adding one-off styling.

### Design tokens over raw values

- Prefer theme-backed Tailwind classes (for example `bg-primary`, `text-muted-foreground`, spacing scale keys) over arbitrary hex, `rgb()`, or repeated magic numbers.
- Add or extend variables in **`src/theme.css`** (`@theme` / `:root` / `.dark`) when a value repeats; reserve arbitrary utilities and inline styles for genuine one-offs.
- Prefer semantic token names (intent) over literal names (exact shade) when the project defines them.

### When exceptions are reasonable

- Third-party components or a single experimental view may need a targeted exception; keep it local and consider promoting repeated values into tokens later.
