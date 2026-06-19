# Creating Feature

## Overview

Use this guide to write *feature modules* in `src/features/<feature-name>/`.

A feature module packages domain logic with the feature UI, and exposes a small export surface for routes and other features — commonly a screen, plus hooks, types, helpers, and components as needed. This keeps reusable primitives in `src/ui/`, navigation components in `src/features/navigation/`, and data fetching/API code in `src/api/` (usually via feature hooks).

For components inside a feature folder, see [creating-feature-component.md](./creating-feature-component.md). For route-facing screens, see [creating-screen-component.md](./creating-screen-component.md). For navigation components, see [creating-navigation-component.md](./creating-navigation-component.md).

## Feature folder layout

The layout below is the **default starting point**, not a closed set. Add folders when multiple files share the same role (for example `schemas/` for Zod form schemas).

```text
src/features/<feature-name>/
├── <Feature>Screen.tsx       # route-facing screen (see creating-screen-component.md)
├── index.ts                  # public barrel
├── components/               # domain UI blocks
├── hooks/                    # query hooks, stores, feature hooks (see managing-state.md)
├── types.ts                  # shared types; split to types/ when large
├── utils.ts                  # shared pure helpers when small (< ~200 lines total)
├── utils/                    # one file per helper when utils grow (e.g. getUser.ts, formatDate.ts)
├── constants.ts              # shared constants
├── env.ts                    # when this feature reads env (see managing-environment.md)
└── schemas/                  # example extension — form-driven features
```

### Layout rules

- Place the route-facing screen at the feature root (`<Feature>Screen.tsx`).
- Place supporting UI in `components/`.
- Place hooks in `hooks/` — including Zustand stores (`use<Feature>Store.ts`).
- Start shared types in `types.ts`; move to `types/<domain>.ts` or a `types/` folder when the file grows.
- Start shared pure helpers in `utils.ts` (formatters, getters, mappers). Split into `utils/<actionName>.ts` when the file exceeds **~200 lines** or helpers are easier to find by name.
- Keep shared constants in `constants.ts`.
- Add `env.ts` when only this feature reads those variables — see [managing-environment.md](./managing-environment.md).
- Add role-based folders (`schemas/`, `mappers/`, etc.) when grouping improves clarity; keep internal files off the barrel unless they are part of the public API.

## Guidelines

### Mental model

Feature categorization is intentionally predictable, even though real features can be grouped in different ways.

**Isolated vs grouped features**

- **Isolated features**: one complete package that typically exports one primary screen (for example, `WorkshopListScreen`) plus the hooks, types, and helpers callers need.
- **Grouped features**: a feature exports multiple related public pieces when they are meant to be used together — for example a screen, a toolbar component, and a search helper.

A feature is **not limited to screen exports**. The barrel may also publish components, hooks, pure functions, types, and constants that belong in the public API.

This guide favors isolated features first, but it allows grouped features when it improves clarity.

**Per-route is the most common grouping**

- Route modules in `src/routes/` map static `screens` entries to feature exports (see [creating-route-component.md](./creating-route-component.md)).
- The feature export should be **route-ready** (read params with React Navigation hooks when needed) so registration stays a one-line import.
- The feature folder owns the behavior so route files stay focused on registration and navigation component wiring.

**Isolation is about dependency boundaries**

- Callers use the module through its barrel; the folder layout can change behind that stable surface.
- Other features and route modules use the barrel as the only import path for that feature's public API.

**Respect the team's categorization when it helps**

Some teams categorize features based on product language (e.g. "billing", "onboarding") rather than UI structure. When that makes the app easier to maintain, this guide allows that variation.

### Placement rules

- Follow [Feature folder layout](#feature-folder-layout) for internal files.
- Place shared navigation components in `src/features/navigation/` — not inside domain feature folders.
- Place shared presentation-only primitives in `src/ui/`.
- Keep HTTP clients and request functions in `src/api/` and call them from feature hooks.

### Grouping rules

- Prefer an isolated feature when callers can use it as a single package.
- Prefer a grouped feature when the exports are inseparable in practice.
- Prefer per-screen feature modules when the logic is primarily owned by one screen flow.

### Module size heuristic

- If a feature folder becomes hard to reason about, split it into smaller feature modules and compose them from the parent feature or from route registration.
- When the same pieces are repeatedly composed across multiple screens, that repetition is usually a signal to extract a reusable feature module.

### Export contract

- Each feature folder must expose a barrel (commonly `src/features/<feature-name>/index.ts`). Import it from other modules (`@/features/...`, `@/routes/...`, app shells) whenever you use that feature from outside its folder.
- Export only what other modules need: screens, components, hooks, pure helpers, types, and constants that form the public API.
- An isolated feature typically exports one primary screen plus supporting hooks and types.
- A grouped feature exports multiple named parts (for example a screen, a component, and a helper function).
- Keep internal implementation files off the barrel.

## Examples

### Isolated feature barrel

```ts
export { WorkshopListScreen } from "./WorkshopListScreen";
export { useWorkshops } from "./hooks/useWorkshops";
export type { Workshop } from "./types";
```

### Grouped feature barrel

Exports a screen plus related components and helpers — not every feature needs a primary screen:

```ts
export { WorkshopListScreen } from "./WorkshopListScreen";
export { WorkshopToolbar } from "./components/WorkshopToolbar";
export { buildWorkshopSearch } from "./search/buildWorkshopSearch";
export type { WorkshopSearchParams } from "./search/types";
```
