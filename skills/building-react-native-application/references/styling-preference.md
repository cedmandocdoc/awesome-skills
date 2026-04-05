# Styling preference

## Overview

Prefer the project’s current style guide and *design tokens* over ad hoc colors, spacing, and typography. Tokens keep screens and components consistent and easier to change.

For how to wire tokens and utilities with NativeWind, see [styling.md](./styling.md). For theme extension and navigation theming, see the **Theming** row in the skill’s references table.

## Guidelines

### Style guide first

- When the repo or team documents layout, components, or tokens, follow that guide before inventing new patterns.
- Reuse existing primitives in `src/ui/` and established utility patterns instead of one-off styling.

### Design tokens over raw values

- Use theme-backed Tailwind classes (for example `bg-primary`, `text-muted-foreground`, spacing scale keys) instead of arbitrary hex, `rgb()`, or repeated magic numbers.
- Add or extend tokens in `theme.extend` and `src/theme.css` when a value repeats; reserve bracket utilities and inline styles for genuine one-offs.
- Prefer semantic token names (intent) over literal names (exact shade) when the project defines them.

### When exceptions are reasonable

- Platform quirks, third-party components, or a single experimental screen may need a targeted exception; keep it local and consider promoting repeated values into tokens later.
