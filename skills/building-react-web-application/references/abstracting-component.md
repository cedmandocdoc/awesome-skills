# Abstracting Component

## Overview

Use this guide to decide whether a component should be a shared UI primitive in `src/ui/`, a feature component in `src/features/<feature-name>/components/`, or left inline.

## Prerequisites

- [placing-component.md](./placing-component.md)
- [setting-up-theming.md](./setting-up-theming.md) and [structuring-project.md](./structuring-project.md) for `components.json` + `src/ui` alignment

## Guidelines

### When building UI components

- Use **registry / shadcn components first** before creating a custom one from scratch.
  - Check `src/ui/` for an existing shared primitive.
  - If it is missing, add it with the shadcn CLI (`npx shadcn@latest add <name>`) after `components.json` points **`ui`** at `@/ui`, **or** inspect registry output with the skill script (pass a component name such as `button` or `dialog` so the script runs `npx shadcn@latest view <name>`; full registry URLs still work when needed):

    ```bash
    node path/to/building-react-web-application/scripts/add-registry-component.js button
    ```

- Keep UI components _presentation-only_.
  - No business logic.
  - No data fetching, mutations, or routing decisions.
  - No feature-specific hooks/state that determine product behavior.
  - Accept props and render UI; move "what to show" decisions to callers.

- Normalize **`cn` → `cx`**: shadcn snippets often use `cn` from `lib/utils`. This stack uses **`cx`** in `@/lib/utils`; the add-registry script rewrites imports and calls when vendoring files.

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
   - If it is not a UI component, ask whether it is still worth extracting inside the feature.
3. Extract only if it stays reasonably small.
   - Aim for components under 200 lines (not restricted, but recommended).
   - If a candidate is much larger, split it into smaller components or parts.
4. Look for repeated manual composition.
   - If the same rendering structure is repeated in multiple places (or would be in the near future), that pattern is a good candidate for abstraction.
   - If repetition is not happening and the candidate is feature-specific, keep it as a feature component.
