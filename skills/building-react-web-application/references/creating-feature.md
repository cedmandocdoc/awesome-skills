# Creating Feature

## Overview

Use this guide to write *feature modules* in `src/features/<feature-name>/`.

A feature module packages domain logic with the feature UI, and exposes a small export surface so **route modules** can compose it. This keeps reusable primitives in `src/ui/` and keeps data fetching/API code in `src/api/` (usually via feature hooks).

## Guidelines

### Mental model

Keep feature categories predictable; real features can still be grouped in different ways.

**Isolated vs grouped features**

- **Isolated features**: one complete "package" that typically exports one primary thing (for example, `WorkshopList`) plus only what the primary thing needs (types/hooks used by the package).
- **Grouped features**: a feature exports multiple related pieces when the pieces are meant to be used together (for example, a route-oriented feature exporting helpers + related components).

This guide favors isolated features first, but it allows grouped features when it improves clarity.

**Per-route is a common grouping**

- A route module under `src/routes/` stays thin.
- The route composes one or more feature components to complete its behavior.
- The feature folder owns the behavior that would otherwise bloat the route file.

**Isolation is about dependency boundaries**

- Internal files stay private to the feature; the barrel is the only surface other modules depend on.

**Respect the team's categorization when it helps**

Some teams categorize features based on product language (e.g. "billing", "onboarding") rather than UI structure. When that makes the app easier to maintain, this guide allows that variation.

### Placement rules

- Place domain-specific behavior and feature UI in `src/features/<feature-name>/`.
- Place shared presentation-only primitives in `src/ui/`.
- Keep HTTP clients and request functions in `src/api/` and call them from feature hooks.

### Grouping rules

- Prefer an isolated feature when callers can use it as a single package.
- Prefer a grouped feature when the exports are inseparable in practice.
- Prefer per-route feature modules when the logic is primarily owned by one route flow.

### Module size heuristic

- If a feature folder becomes hard to reason about, split it into smaller feature modules and compose them from the route or a parent feature.
- When the same pieces are repeatedly composed across multiple routes, that repetition is usually a signal to extract a reusable feature module.

### Export contract

- Each feature folder exposes a barrel (commonly `src/features/<feature-name>/index.ts`).
- Callers import from `@/features/<feature-name>` only; keep the barrel stable over time.
- Isolated features: one primary component or value plus the hooks and types callers need. Grouped features: name each exported part clearly. Internal helpers stay off the barrel.

## Examples

### Isolated feature barrel

```ts
export { WorkshopList } from "./components/WorkshopList";
export { useWorkshops } from "./hooks/useWorkshops";
export type { Workshop } from "./types/workshop";
```

### Grouped feature barrel

```ts
export { WorkshopToolbar } from "./components/WorkshopToolbar";
export { buildWorkshopSearch } from "./search/buildWorkshopSearch";
export type { WorkshopSearchParams } from "./search/types";
```
