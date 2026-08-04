# Creating Feature

## Overview

**Execution mode.** Create feature modules in `src/features/<feature-name>/`.

A feature module packages domain logic with feature UI and exposes a small barrel for routes and other features — commonly a page, plus hooks, types, helpers, and components as needed.

For components inside a feature, see [creating-feature-component.md](./creating-feature-component.md). For route-facing pages, see [creating-screen-component.md](./creating-screen-component.md).

## Guidelines

### Placement

- Follow [Feature folder layout](#feature-folder-layout) for internal files.
- Shared presentation-only primitives live in `src/ui/`.
- HTTP clients and request functions live in `src/api/`; call them from feature hooks.

### Grouping

- Prefer isolated features when callers use the module as a single package.
- Prefer grouped features when exports are inseparable in practice.
- Prefer per-route feature modules when logic is primarily owned by one route flow.

### Export contract

- Each feature exposes a barrel: `src/features/<feature-name>/index.ts`.
- Callers import from `@/features/<feature-name>` only; keep the barrel stable.
- Export only what other modules need: pages, components, hooks, helpers, types, constants.
- Keep internal implementation files off the barrel.

### Type-based organization

Organize feature internals by file type — not a fixed folder checklist.

| Phase | Rule |
| --- | --- |
| Start | One file at the feature root named after the type: `types.ts`, `utils.ts`, `schemas.ts`, `constants.ts`. |
| Multi-file from day one | Use a folder when the type naturally has several exports — `components/` and `hooks/` (one export per file). |
| Scale | When a single type file exceeds ~200 lines, replace with a folder of the same name. One file per export inside. |

### Feature folder layout

```text
src/features/<feature-name>/
├── index.ts                  # public barrel
├── components/               # domain UI (one component per file)
│   └── <Feature>Page.tsx     # route-facing page (see creating-screen-component.md)
├── hooks/                    # query hooks, stores (one hook per file)
├── types.ts                  # shared types → types/ when > ~200 lines
├── utils.ts                  # shared helpers → utils/ when > ~200 lines
├── schemas.ts                # Zod/form schemas → schemas/ when > ~200 lines
├── constants.ts              # shared constants → constants/ when > ~200 lines
└── env.ts                    # when this feature reads env (see managing-environment.md)

# scaled examples (same type name, folder form):
├── types/
│   └── Workshop.ts
├── utils/
│   ├── formatDate.ts
│   └── mapWorkshop.ts
└── schemas/
    └── workshopFormSchema.ts
```

### Layout rules

- Route-facing page: `src/features/<feature-name>/components/<Feature>Page.tsx`.
- Supporting UI in the same `components/` folder — one component per file.
- Hooks in `hooks/` — including Zustand stores (`use<Feature>Store.ts`); one hook per file.
- Start `types`, `utils`, `schemas`, `constants` as a single file; promote to a folder at ~200 lines.
- Inside a type folder, name files after what they export; each file exports one thing.
- Add `env.ts` when only this feature reads those variables — see [managing-environment.md](./managing-environment.md).

## Examples

### Isolated feature barrel

```ts
export { WorkshopListPage } from "./components/WorkshopListPage";
export { useWorkshops } from "./hooks/useWorkshops";
export type { Workshop } from "./types";
```

### Grouped feature barrel

```ts
export { WorkshopListPage } from "./components/WorkshopListPage";
export { WorkshopToolbar } from "./components/WorkshopToolbar";
export { buildWorkshopSearch } from "./utils/buildWorkshopSearch";
export type { WorkshopSearchParams } from "./types";
```
