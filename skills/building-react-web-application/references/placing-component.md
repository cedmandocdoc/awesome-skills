# Placing Component

## Overview

Use this guide to place components in the right layer. Put domain-specific UI in features, and keep shared primitives flat in `src/ui/`.

## Guidelines

### Structure

| Kind                              | Location                                                                 |
| --------------------------------- | ------------------------------------------------------------------------ |
| Feature components                | `src/features/<feature-name>/components/`                               |
| Shared UI components (primitives) | `src/ui/`                                                                |
| Design tokens and theme wiring    | `src/theme.css`; root `global.css` imports Tailwind + theme (see setting-up-theming.md) |
| Utilities (`cx`, etc.)            | `src/lib/utils.ts`                                                       |

### Placement rules

- Put product rules and domain behavior in `src/features/<feature-name>/` (including `components/` for feature components).
- Put reusable, presentation-only primitives in `src/ui/`.
- Keep `src/ui/` flat unless a tool requires a nested structure.
- Import primitives with `@/ui/<file>`.
- Use relative imports between files inside `src/ui/`.
