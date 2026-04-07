# Creating Feature

## Overview

Use this guide to write *feature modules* in `src/features/<feature-name>/`.

A feature module packages domain logic with the feature UI, and exposes a small export surface so **navigators** can register those exports as screen components. This keeps reusable primitives in `src/ui/` and keeps data fetching/API code in `src/api/` (usually via feature hooks).

## Guidelines

### Mental model

Feature categorization is intentionally predictable, even though real features can be grouped in different ways.

**Isolated vs grouped features**

- **Isolated features**: one complete "package" that typically exports one primary thing (for example, `WorkshopList`) plus only what the primary thing needs (types/hooks used by the package).
- **Grouped features**: a feature exports multiple related pieces when the pieces are meant to be used together (for example, a navigation-oriented feature exporting route helpers + related screens/components).

This guide favors isolated features first, but it allows grouped features when it improves clarity.

**Per-route is the most common grouping**

- Navigators in `src/navigation/` point `Stack.Screen` (and similar) `component` props at feature exports.
- The feature export should be **route-ready** (read params with React Navigation hooks when needed) so registration stays a one-line import.
- The feature folder owns the behavior so navigator files stay focused on registration and options.

**Isolation is about dependency boundaries**

- Callers use the module through its barrel; the folder layout can change behind that stable surface.
- Other features and navigation modules use the barrel as the only import path for that feature’s public API.

**Respect the team's categorization when it helps**

Some teams categorize features based on product language (e.g. "billing", "onboarding") rather than UI structure. When that makes the app easier to maintain, this guide allows that variation.

### Placement rules

- Place domain-specific behavior and feature UI in `src/features/<feature-name>/`.
- Place shared presentation-only primitives in `src/ui/`.
- Keep HTTP clients and request functions in `src/api/` and call them from feature hooks.

### Grouping rules

- Prefer an isolated feature when callers can use it as a single package.
- Prefer a grouped feature when the exports are inseparable in practice.
- Prefer per-screen feature modules when the logic is primarily owned by one screen flow.

### Module size heuristic

- If a feature folder becomes hard to reason about, split it into smaller feature modules and compose them from the parent feature or from navigation registration.
- When the same pieces are repeatedly composed across multiple screens, that repetition is usually a signal to extract a reusable feature module.

### Export contract

- Each feature folder must expose a barrel (commonly `src/features/<feature-name>/index.ts`). Import it from other modules (`@/features/...`, `@/navigation/...`, app shells) whenever you use that feature from outside its folder.
- An isolated feature should export one primary component/value plus supporting hooks/types.
- A grouped feature should clearly name its exported parts.
- The export contract should stay stable: publish primary components, hooks, and types that belong in the public API.

## Examples

### Isolated feature barrel

```ts
export { WorkshopList } from "./components/WorkshopList";
export { useWorkshops } from "./hooks/useWorkshops";
export type { Workshop } from "./types/workshop";
```

### Grouped feature barrel

```ts
export { WorkshopNavigation } from "./navigation/WorkshopNavigation";
export { getWorkshopRouteParams } from "./navigation/getWorkshopRouteParams";
export type { WorkshopRouteParams } from "./navigation/types";
```
