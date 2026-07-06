# Creating Feature

## Overview

Use this guide to write *feature modules* in `src/features/<feature-name>/`.

A feature module packages domain logic with the feature UI, and exposes a small export surface for routes and other features — commonly a page, plus hooks, types, helpers, and components as needed. This keeps reusable primitives in `src/ui/` and keeps data fetching/API code in `src/api/` (usually via feature hooks).

For components inside a feature folder, see [creating-feature-component.md](./creating-feature-component.md). For route-facing pages, see [creating-screen-component.md](./creating-screen-component.md). For navigation components, see [creating-navigation-component.md](./creating-navigation-component.md).

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

### Type-based organization

**First-class strategy.** Organize feature internals by **file type** — not by a fixed folder checklist. Only a few types are common enough to list in examples (`components`, `hooks`, `types`, `utils`, `schemas`, `constants`); add any other type the feature needs using the same file-or-folder pattern.

| Phase | Rule |
| --- | --- |
| Start | One **file** at the feature root, named after the type: `types.ts`, `utils.ts`, `schemas.ts`, `constants.ts`. |
| Multi-file from day one | Use a **folder** immediately when the type naturally has several exports — `components/` and `hooks/` (one export per file). |
| Scale | When a single type file exceeds **~200 lines**, replace it with a **folder** of the same name. Inside the folder, one file per export; each file exports exactly one thing. |

Apply the same scaling rule to every type — `utils`, `types`, `schemas`, `mappers`, `validators`, and any new type you introduce.

### Feature folder layout

The tree below shows **common** types, not an exhaustive list. Add type-named files or folders as the feature grows.

```text
src/features/<feature-name>/
├── index.ts                  # public barrel
├── components/               # domain UI — folder from the start (one component per file)
│   └── <Feature>Page.tsx     # route-facing page (see creating-screen-component.md)
├── hooks/                    # query hooks, stores — folder from the start (one hook per file)
├── types.ts                  # shared types → types/ when > ~200 lines
├── utils.ts                  # shared pure helpers → utils/ when > ~200 lines
├── schemas.ts                # Zod/form schemas → schemas/ when > ~200 lines
├── constants.ts              # shared constants → constants/ when > ~200 lines
└── env.ts                    # when this feature reads env (see managing-environment.md)

# scaled examples (same type name, folder form):
├── types/
│   └── Workshop.ts           # one type per file
├── utils/
│   ├── formatDate.ts         # one helper per file
│   └── mapWorkshop.ts
└── schemas/
    └── workshopFormSchema.ts # one schema per file
```

### Layout rules

- Follow [Type-based organization](#type-based-organization) for every file type — including types not shown in the tree.
- Place the route-facing page in `components/`: `src/features/<feature-name>/components/<Feature>Page.tsx`.
- Place other supporting UI in the same `components/` folder — one component per file.
- Place hooks in `hooks/` — including Zustand stores (`use<Feature>Store.ts`); one hook per file.
- Start `types`, `utils`, `schemas`, `constants`, and other shared types as a single `<type>.ts` file; promote to `<type>/` when the file exceeds **~200 lines**.
- Inside a type folder, name files after what they export; each file exports exactly one thing.
- Add `env.ts` when only this feature reads those variables — see [managing-environment.md](./managing-environment.md).
- Keep internal implementation files off the barrel unless they are part of the public API.

## Examples

### Isolated feature barrel

```ts
export { WorkshopListPage } from "./components/WorkshopListPage";
export { useWorkshops } from "./hooks/useWorkshops";
export type { Workshop } from "./types";
```

### Grouped feature barrel

Exports a page plus related components and helpers — not every feature needs a primary page:

```ts
export { WorkshopListPage } from "./components/WorkshopListPage";
export { WorkshopToolbar } from "./components/WorkshopToolbar";
export { buildWorkshopSearch } from "./utils/buildWorkshopSearch";
export type { WorkshopSearchParams } from "./types";
```
