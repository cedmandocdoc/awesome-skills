# Managing Project Structure

## Overview

Where code lives, which layer may import which, and how features and components are named. Rendering runs route → page → feature component → UI primitive.

## Guidelines

### Layers

| Area | Holds |
| --- | --- |
| `src/main.tsx` | Root providers and `RouterProvider` |
| `src/routes/` | File-based routes and layout routes — [creating-page.md](./creating-page.md) |
| `src/routeTree.gen.ts` | Generated route tree; edit route files instead |
| `src/features/<feature-name>/` | Domain modules: pages, feature components, hooks, types |
| `src/features/navigation/` | Shells, sidebars, headers, tab bars, navigation hooks — [creating-page.md](./creating-page.md) |
| `src/ui/` | Presentation-only primitives — [creating-ui-component.md](./creating-ui-component.md) |
| `src/api/<backend-name>/` | HTTP clients and request functions — [managing-data.md](./managing-data.md) |
| `src/libs/` | Internal libraries: wrapped third-party APIs, adapters, shared utilities |
| `global.css`, `src/theme.css` | CSS entry and tokens — [managing-styling.md](./managing-styling.md) |

### Dependency flow

Imports point one way:

| Layer | May import |
| --- | --- |
| `src/routes/` | Features, `ui` |
| `src/features/` | Other features through their barrel, `ui`, `api`, `libs` |
| `src/ui/` | Other `ui` files, `libs`, npm packages |
| `src/api/` | `libs`, npm packages; no React |
| `src/libs/` | Other `libs`, npm packages |

### Feature module

```text
src/features/<feature-name>/
├── index.ts              # public barrel
├── components/           # pages and feature components, one per file
├── hooks/                # query hooks and feature state, one per file
├── types.ts              # → types/ when > ~200 lines
├── utils.ts              # → utils/ when > ~200 lines
├── schemas.ts            # → schemas/ when > ~200 lines
├── constants.ts          # → constants/ when > ~200 lines
└── env.ts                # when the feature reads env — managing-environment.md
```

- Feature folders are kebab-case.
- The barrel exports only what other modules need: pages, components, hooks, helpers, types, constants.
- A type file with several exports from day one starts as a folder, one export per file.

| Grouping | When |
| --- | --- |
| Isolated feature | Callers use it as one package (one page + hooks + types) |
| Grouped feature | Exports are inseparable in practice (page + toolbar + search helper) |
| Per-route module | Logic is owned by one route flow |

Split a feature when its folder is hard to reason about.

### Components

- Functional components with named exports; one component per file; the file name matches the export.
- Compound parts share a root prefix (`Button`, `ButtonText`, `ButtonIcon`) instead of `typeof children` switches.
- Props or `cva` variants encode state, not names (`Button` with `tone`, not `PrimaryButton`).
- Suffixes name the role (`Card`, `Row`, `Form`, `Dialog`); use one list-item suffix (`Item` or `Row`) across the app.

| Scope | Naming |
| --- | --- |
| All | PascalCase singular nouns (`UserCard`) |
| `src/ui/` | Generic: `Button`, `TextInput`, `Dialog` |
| Feature components | `<Feature><Entity><Type>`: `AuthLoginForm`, `CartItemRow`, `OrderSummaryCard` |
| Pages | `<Feature>Page`: `WorkshopListPage`; shared wrappers `<Name>Layout` |

### Recategorizing

| Signal | Move to |
| --- | --- |
| Presentation-only and used across features | `src/ui/` |
| Business logic inside `src/ui/` | Feature `hooks/`; the primitive keeps presentation |
| Navigation UI reused across routes | `src/features/navigation/` |
| Domain behavior used across routes | A new feature module |

Update the barrel exports when moving code.

### Imports

- `@/*` (alias of `./src/*`) across modules; relative imports inside one module.
- A lib is `src/libs/<name>.ts` while small and `src/libs/<name>/index.ts` once it grows; import `@/libs/<name>` either way.
- Import features through their `index.ts`.

## Examples

### Feature barrel

```ts
export { WorkshopListPage } from "./components/WorkshopListPage";
export { useWorkshops } from "./hooks/useWorkshops";
export type { Workshop } from "./types";
```
