# Abstracting Component

## Overview

Use this guide to decide whether a component should be a shared UI primitive in `src/ui/`, a feature component in `src/features/<feature-name>/components/`, or left inline.

## Prerequisites

- [placing-component.md](./placing-component.md)

## Guidelines

### When building UI components

- Use registry components first before creating a custom one.
  - Check `src/ui/` for an existing shared primitive.
  - If it is missing, add it from the registry:

```bash
node path/to/react-native/scripts/add-registry-component.js "https://reactnativereusables.com/r/nativewind/button.json"
```

- Keep UI components *presentation-only*.
  - No business logic.
  - No data fetching, mutations, or navigation decisions.
  - No feature-specific hooks/state that determine product behavior.
  - Accept props and render UI; move "what to show" decisions to callers.

### When building feature components

- Place feature components in `src/features/<feature-name>/components/`.
- Feature components can import other feature components.
  - Prefer composing smaller feature components over creating one large component.
- Feature components can contain business logic.
  - Feature hooks, derived state, event handlers, and side effects that are specific to the feature are allowed here.
  - Feature components may render shared UI components from `src/ui/`.

### Mental model for categorization and extraction

Use this workflow when you are building a screen or feature:

1. Identify blocks in the UI for the current task.
   - Split the UI you are manually composing into the smallest recurring "rendering blocks" you can name.
2. Check for reuse and presentation-only fit.
   - If a block is likely reusable *and* can stay presentation-only, categorize it as a **UI component** and place it in `src/ui/`.
   - If it is not a UI component, ask whether it is still worth extracting inside the feature.
3. Extract only if it stays reasonably small.
   - Aim for components under 200 lines (not restricted, but recommended).
   - If a candidate is much larger, split it into smaller components or parts.
4. Look for repeated manual composition.
   - If the same rendering structure is repeated in multiple places (or would be in the near future), that pattern is a good candidate for abstraction.
   - If repetition is not happening and the candidate is feature-specific, keep it as a feature component.
