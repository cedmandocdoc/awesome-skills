# Abstracting Component

## Overview

Use this guide to decide whether a component should be a shared UI primitive in `src/ui/`, a feature component in `src/features/<feature-name>/components/`, or left inline.

## Prerequisites

- [placing-component.md](./placing-component.md)
- [setting-up-theming.md](./setting-up-theming.md) and [structuring-project.md](./structuring-project.md) for `global.css` / `src/theme.css` and `src/ui`

## Guidelines

### When building UI components

- Use **registry-backed primitives first** before creating a custom one from scratch.
  - Check `src/ui/` for an existing shared primitive.
  - If it is missing, follow [adding-registry-components.md](./adding-registry-components.md): validate with `npx shadcn@latest view`, run the add script when the registry item checks out, or create the UI manually when it does not. That flow writes into **`src/ui/`** with **`cx`** and path fixes.

- Keep UI components _presentation-only_.
  - No business logic.
  - No data fetching, mutations, or routing decisions.
  - No feature-specific hooks/state that determine product behavior.
  - Accept props and render UI; move "what to show" decisions to callers.

- Normalize **`cn` → `cx`**: registry snippets often use `cn`. This stack imports **`cx`** from **`class-variance-authority`**; the add script in [adding-registry-components.md](./adding-registry-components.md) rewrites imports and calls when vendoring files.

### When building feature components

- Place feature components in `src/features/<feature-name>/components/`.
- Feature components can import other feature components.
  - Prefer composing smaller feature components over creating one large component.
- Feature components can contain business logic.
  - Feature hooks, derived state, event handlers, and side effects that are specific to the feature are allowed here.
  - Feature components may render shared UI components from `src/ui/`.

### Mental model for categorization and extraction

Use this workflow when building a route or feature:

1. Identify blocks in the UI for the current task.
   - Split the UI being manually composed into the smallest recurring "rendering blocks" that can be named.
2. Check for reuse and presentation-only fit.
   - If a block is likely reusable _and_ can stay presentation-only, categorize it as a **UI component** and place it in `src/ui/`.
   - When the block carries domain behavior, extract inside the feature if a named subcomponent still clarifies the tree.
3. Extract only if it stays reasonably small.
   - Aim for components under ~200 lines when practical.
   - If a candidate is much larger, split it into smaller components or parts.
4. Look for repeated manual composition.
   - If the same rendering structure is repeated in multiple places (or would be in the near future), that pattern is a good candidate for abstraction.
   - When the pattern is still single-use inside one feature, keep it there until reuse appears.
