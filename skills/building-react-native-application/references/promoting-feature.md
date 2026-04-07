# Promoting Feature

## Overview

Use this guide to decide when and how to recategorize a feature component — either promoting it to `src/ui/` or extracting it into a new feature module.

## Guidelines

### Promotion changes categorization

When a "feature component" grows into something reusable, the module often needs to be recategorized:

- If it becomes **presentation-only**, promote it to a shared UI primitive in `src/ui/`.
- If it becomes **domain behavior used across multiple screens (or route entries)**, extract it into a new feature module under `src/features/`.
- If it stays tightly coupled to one screen flow, keep it inside the screen's feature module.

Promotion should be reflected in folder placement *and* in the feature's export contract.

### When to promote to `src/ui/`

Promote when the component:

- Is presentation-only.
- Accepts props and renders UI.
- Leaves navigation, data fetching, and feature state to parents, hooks, or sibling feature code.

### When to extract into a new `src/features/` module

Extract when the shared part:

- Encapsulates domain behavior that multiple screens (or route entries) use.
- Includes hooks/state/derived behavior that callers would otherwise duplicate.
- Benefits from its own feature boundary so callers interact with a small, stable surface.

### How to keep boundaries consistent after extraction

- Navigators map routes to feature-exported screen components; those exports compose smaller features internally.
- Internal modules inside `src/features/<feature-name>/` may import each other freely.
- Other modules import through the feature barrel so they track the published API as it evolves.

### Route interaction (typical flow)

1. `src/navigation/` registers routes with `component={...}` pointing at feature exports. Keep that wiring thin—only param bridges or options belong here.
2. `src/features/<feature-name>/` owns the behavior: hooks, derived state, event handlers, and feature-specific UI composition (including reading route params inside the exported component when needed).
3. `src/ui/` provides shared primitives used by feature components when presentation-only reuse is needed.

If the same composition repeats across multiple routes or screen flows, consolidate it in a reusable feature module shared by those registrations.

## Examples

### List-fetch-render (isolated feature)

- Feature: `src/features/workshop-list/`
- Exports: `WorkshopList` as the primary component, plus supporting `useWorkshops` and `Workshop` type.
- Navigation: `MainStack.tsx` (or equivalent) registers `<Stack.Screen name="Workshops" component={WorkshopList} />`.

### Navigation/workflow grouping (grouped feature)

- Feature: `src/features/workshop-navigation/`
- Exports: route helpers and a navigation-related component set that callers need together.
- `src/navigation/` remains the place that registers navigators, while the feature provides the workshop-specific pieces.

### Promotion from screen-specific to shared feature

- Initially: the block lives inside a per-screen feature module.
- When reuse starts appearing: extract the shared behavior into `src/features/<new-shared-feature>/`.
- If the extracted part is presentation-only, promote it to `src/ui/` as a shared primitive.
