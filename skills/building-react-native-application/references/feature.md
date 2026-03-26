# Feature

## Overview

Use this guide to write *feature modules* in `src/features/<feature-name>/`.

A feature module packages domain logic with the feature UI, and exposes a small export surface so screens can compose it. This keeps reusable primitives in `src/ui/` and keeps data fetching/API code in `src/api/` (usually via feature hooks).

## Mental Model

Feature categorization is intentionally predictable, even though real features can be grouped in different ways.

### 1) Isolated vs grouped features

Features fall into two practical export shapes:

- **Isolated features**: one complete “package” that typically exports one primary thing (for example, `WorkshopList`) plus only what the primary thing needs (types/hooks used by the package).
- **Grouped features**: a feature exports multiple related pieces when the pieces are meant to be used together (for example, a navigation-oriented feature exporting route helpers + related screens/components).

This guide favors isolated features first, but it allows grouped features when it improves clarity.

### 2) Per-screen is the most common grouping

Most features are created to support a single screen flow:

- A screen lives in `src/screens/` and stays thin.
- The screen composes one or more feature components to complete its behavior.
- The feature folder owns the behavior that would otherwise bloat the screen file.

### 3) Isolation is about dependency boundaries, not about UI layout

A feature should be “isolated” in the sense that:

- Callers should not need internal knowledge of the module to use it correctly.
- Other features/screens should depend on the feature’s public exports (via the feature’s barrel), not by reaching into internal files.

### 4) Respect the team’s categorization when it helps

Some teams categorize features based on product language (e.g. “billing”, “onboarding”) rather than UI structure (e.g. “settings page”). When that makes the app easier to maintain, the document allows that variation—this guide is a default, not a constraint.

### 5) Promotion changes categorization

When a “feature component” grows into something reusable, the module often needs to be recategorized:

- If it becomes **presentation-only**, it should be promoted to a shared UI primitive in `src/ui/`.
- If it becomes **domain behavior used across multiple screens**, it should be extracted into a new feature module under `src/features/`.
- If it stays tightly coupled to one screen flow, it should remain inside the screen’s feature module.

Promotion should be reflected in folder placement *and* in the feature’s export contract.

## Categorization Rules

This section describes how to decide what “kind” of feature you are writing.

### Feature placement rules

- Place domain-specific behavior and feature UI in `src/features/<feature-name>/`.
- Place shared presentation-only primitives in `src/ui/` (no data fetching, mutations, navigation decisions, or feature-specific state).
- Keep HTTP clients and request functions in `src/api/` and call them from feature hooks.

### Feature grouping rules

- Prefer an isolated feature when callers can use it as a single package.
- Prefer a grouped feature when the exports are inseparable in practice (callers need the set together to get the correct behavior).
- Prefer per-screen feature modules when the logic is primarily owned by one screen flow.

### Module size heuristic

Use the module boundaries to control complexity:

- If a feature folder becomes hard to reason about, split it into smaller feature modules and compose them from the screen feature.
- If you repeatedly compose the same pieces in multiple screens, that repetition is usually a signal to extract a reusable feature module.

## Export Contract

The feature’s public surface is its export contract.

### Where exports live

- Each feature folder must expose a barrel (commonly `src/features/<feature-name>/index.ts`).
- Callers should import from `@/features/<feature-name>` rather than importing internal files directly.

### What a feature exports

- An isolated feature should export one primary component/value (the thing a screen “drops in”), plus any supporting hooks/types that belong to that primary package.
- A grouped feature should clearly name its exported parts so callers know what belongs together.
- The export contract should stay stable: avoid exporting random internal helpers that callers shouldn’t use.

### Example: isolated feature export surface

An isolated list feature typically exports a primary component and its related hook/types:

```ts
export { WorkshopList } from "./components/WorkshopList";
export { useWorkshops } from "./hooks/useWorkshops";
export type { Workshop } from "./types/workshop";
```

### Example: grouped feature export surface

A grouped feature (navigation-oriented or workflow-oriented) can export multiple items when they are intended to be used together:

```ts
export { WorkshopNavigation } from "./navigation/WorkshopNavigation";
export { getWorkshopRouteParams } from "./navigation/getWorkshopRouteParams";
export type { WorkshopRouteParams } from "./navigation/types";
```

## Promotion & Extraction

This section defines how promotion should be categorized.

### When to promote to `src/ui/` (shared primitives)

Promote when the component:

- Is presentation-only.
- Accepts props and renders UI.
- Does not decide navigation, fetch data, or manage feature state.

### When to extract into a new `src/features/` module

Extract when the shared part:

- Encapsulates domain behavior that multiple screens use.
- Includes hooks/state/derived behavior that callers would otherwise duplicate.
- Needs its own feature boundary so it does not leak internal complexity into screens.

### How to keep boundaries consistent after extraction

- Screens compose features; features compose smaller features.
- Internal modules inside `src/features/<feature-name>/` may import each other freely.
- Other modules should import through the feature barrel to avoid coupling to internal file paths.

## Screen Interaction (Typical Flow)

The common flow for “per-screen” features looks like this:

1. `src/screens/<ScreenName>.tsx` stays thin: it reads route params (if any) and composes feature exports.
2. `src/features/<feature-name>/` owns the behavior: hooks, derived state, event handlers, and feature-specific UI composition.
3. `src/ui/` provides shared primitives used by feature components when presentation-only reuse is needed.

If the screen ends up repeating the same composition in multiple places, that repetition usually belongs in a reusable feature module.

## Examples

### Example 1: List-fetch-render (isolated feature)

Goal: show a list of workshops with server data and loading/error handling.

- Feature: `src/features/workshop-list/`
- Exports: `WorkshopList` as the primary component, plus supporting `useWorkshops` and `Workshop` type.
- Screen: `src/screens/WorkshopsScreen.tsx` composes `<WorkshopList />`.

### Example 2: Navigation/workflow grouping (grouped feature)

Goal: keep workshop navigation logic consistent across the app.

- Feature: `src/features/workshop-navigation/`
- Exports: route helpers and a navigation-related component/set that callers need together.
- `src/navigation/` remains the place that registers navigators, while the feature provides the workshop-specific pieces to keep route setup consistent.

### Example 3: Promotion from screen-specific to shared feature

Goal: reuse a UI block + behavior across multiple screens.

- Initially: the block lives inside a per-screen feature module.
- When reuse starts appearing: extract the shared behavior into `src/features/<new-shared-feature>/`.
- If the extracted part is presentation-only, promote it to `src/ui/` instead of keeping it in `src/features/`.

