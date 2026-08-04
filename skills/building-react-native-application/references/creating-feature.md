# Creating Feature

## Overview

Write feature modules in `src/features/<feature-name>/`. A feature packages domain logic with feature UI and exposes a small barrel surface for routes and other features.

For components inside a feature folder, see [creating-feature-component.md](./creating-feature-component.md). For screens, see [creating-screen-component.md](./creating-screen-component.md). For navigation, see [creating-navigation-component.md](./creating-navigation-component.md).

## Guidelines

### Placement

| What | Where |
| --- | --- |
| Feature domain logic + UI | `src/features/<feature>/` |
| Shared navigation components | `src/features/navigation/` |
| Presentation-only primitives | `src/ui/` |
| HTTP clients and request functions | `src/api/` (called from feature hooks) |

### Grouping

| Strategy | When |
| --- | --- |
| Isolated feature | Callers use it as a single package (one screen + hooks + types) |
| Grouped feature | Exports are inseparable in practice (screen + toolbar + search helper) |
| Per-screen module | Logic primarily owned by one screen flow |

Split into smaller modules when the folder is hard to reason about. Repeated composition across screens signals a reusable module.

### Export contract

- Each feature exposes a barrel: `src/features/<feature>/index.ts`.
- Export only what other modules need: screens, components, hooks, helpers, types, constants.
- Keep internal implementation off the barrel.
- Route modules in `src/routes/` map static `screens` entries to feature exports per [creating-route-component.md](./creating-route-component.md). Feature exports are route-ready (read params via React Navigation hooks) so registration stays a one-line import.

### Type-based organization

Organize internals by file type, not a fixed folder checklist.

| Phase | Rule |
| --- | --- |
| Start | One file at feature root: `types.ts`, `utils.ts`, `schemas.ts`, `constants.ts` |
| Multi-file from day one | Folder immediately when the type has several exports — `components/`, `hooks/` (one export per file) |
| Scale | When a type file exceeds ~200 lines, replace with a folder of the same name; one file per export inside |

### Feature folder layout

```text
src/features/<feature-name>/
├── index.ts              # public barrel
├── components/           # domain UI (one component per file)
│   └── <Feature>Screen.tsx
├── hooks/                # query hooks, stores (one hook per file)
├── types.ts              # → types/ when > ~200 lines
├── utils.ts              # → utils/ when > ~200 lines
├── schemas.ts            # → schemas/ when > ~200 lines
├── constants.ts          # → constants/ when > ~200 lines
└── env.ts                # when this feature reads env (see managing-environment.md)
```

## Examples

### Isolated feature barrel

```ts
export { WorkshopListScreen } from "./components/WorkshopListScreen";
export { useWorkshops } from "./hooks/useWorkshops";
export type { Workshop } from "./types";
```

### Grouped feature barrel

```ts
export { WorkshopListScreen } from "./components/WorkshopListScreen";
export { WorkshopToolbar } from "./components/WorkshopToolbar";
export { buildWorkshopSearch } from "./utils/buildWorkshopSearch";
export type { WorkshopSearchParams } from "./types";
```
