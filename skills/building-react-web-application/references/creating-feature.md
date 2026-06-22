# Creating Feature

## Overview

Use this guide to write *feature modules* in `src/features/<feature-name>/`.

A feature module packages domain logic with the feature UI, and exposes a small export surface for routes and other features — commonly a page, plus hooks, types, helpers, and components as needed. This keeps reusable primitives in `src/ui/` and keeps data fetching/API code in `src/api/` (usually via feature hooks).

For components inside a feature folder, see [creating-feature-component.md](./creating-feature-component.md). For route-facing pages, see [creating-screen-component.md](./creating-screen-component.md). For navigation components, see [creating-navigation-component.md](./creating-navigation-component.md).

## Feature folder layout

The layout below is the **default starting point**, not a closed set. Add folders when multiple files share the same role (for example `schemas/` for Zod form schemas).

```text
src/features/<feature-name>/
├── <Feature>Page.tsx         # route-facing page (see creating-screen-component.md)
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

- Place the route-facing page at the feature root: `src/features/<feature-name>/<Feature>Page.tsx` — never in `components/`.
- Place supporting UI in `components/` — not route-facing pages.
- Place hooks in `hooks/` — including Zustand stores (`use<Feature>Store.ts`).
- Start shared types in `types.ts`; move to `types/<domain>.ts` or a `types/` folder when the file grows.
- Start shared pure helpers in `utils.ts` (formatters, getters, mappers). Split into `utils/<actionName>.ts` when the file exceeds **~200 lines** or helpers are easier to find by name.
- Keep shared constants in `constants.ts`.
- Add `env.ts` when only this feature reads those variables — see [managing-environment.md](./managing-environment.md).
- Add role-based folders (`schemas/`, `mappers/`, etc.) when grouping improves clarity; keep internal files off the barrel unless they are part of the public API.

## Guidelines

### Mental model

Keep feature categories predictable; real features can still be grouped in different ways.

**Isolated vs grouped features**

- **Isolated features**: one complete package that typically exports one primary page (for example, `WorkshopListPage`) plus the hooks, types, and helpers callers need.
- **Grouped features**: a feature exports multiple related public pieces when they are meant to be used together — for example a page, a toolbar component, and a search helper.

A feature is **not limited to page exports**. The barrel may also publish components, hooks, pure functions, types, and constants that belong in the public API.

This guide favors isolated features first, but it allows grouped features when it improves clarity.

**Per-route is a common grouping**

- A route module under `src/routes/` stays thin — see [creating-route-component.md](./creating-route-component.md).
- The route registers the feature page and optionally wires navigation components from `src/features/navigation/`.
- The feature folder owns the behavior that would otherwise bloat the route file.

**Isolation is about dependency boundaries**

- Internal files stay private to the feature; the barrel is the only surface other modules depend on.

**Respect the team's categorization when it helps**

Some teams categorize features based on product language (e.g. "billing", "onboarding") rather than UI structure. When that makes the app easier to maintain, this guide allows that variation.

### Placement rules

- Follow [Feature folder layout](#feature-folder-layout) for internal files.
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
- Export only what other modules need: pages, components, hooks, pure helpers, types, and constants that form the public API.
- An isolated feature typically exports one primary page plus supporting hooks and types.
- A grouped feature exports multiple named parts (for example a page, a component, and a helper function).
- Keep internal implementation files off the barrel.

## Examples

### Isolated feature barrel

```ts
export { WorkshopListPage } from "./WorkshopListPage";
export { useWorkshops } from "./hooks/useWorkshops";
export type { Workshop } from "./types";
```

### Grouped feature barrel

Exports a page plus related components and helpers — not every feature needs a primary page:

```ts
export { WorkshopListPage } from "./WorkshopListPage";
export { WorkshopToolbar } from "./components/WorkshopToolbar";
export { buildWorkshopSearch } from "./search/buildWorkshopSearch";
export type { WorkshopSearchParams } from "./search/types";
```
