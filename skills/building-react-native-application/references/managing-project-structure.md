# Managing Project Structure

## Overview

Where code lives, which layer may import which, how modules grow, and how features and components are named. Rendering runs route → screen → feature component → UI primitive.

## Guidelines

### Layers

| Layer | Holds | May import |
| --- | --- | --- |
| `src/routes/` | Navigators, root groups, `linking` — [creating-screen.md](./creating-screen.md) | features, common, ui |
| `src/features/<feature>/` | User flows: screens, feature components, queries, mutations, invalidation | common, ui, api, libs; never another feature |
| `src/common/<module>/` | Cross-feature business modules, same shape as a feature | other common modules, ui, api, libs; never features |
| `src/ui/` | Presentation-only primitives; `src/ui/hooks/` for UI-only hooks — [creating-ui-component.md](./creating-ui-component.md) | ui, libs |
| `src/api/<backend>/` | Endpoint calls and Zod models; no React — [managing-data.md](./managing-data.md) | libs |
| `src/libs/` | Pure library wrappers and generic utilities; no business logic | libs |

`App.tsx` holds root providers and `Navigation`; `global.css`, `src/theme.css`, and `src/theme.ts` hold tokens per [managing-styling.md](./managing-styling.md).

| `common` module | Owns |
| --- | --- |
| `auth` | Session, token provider, gates — [setting-up-authentication.md](./setting-up-authentication.md), [setting-up-auth-guard.md](./setting-up-auth-guard.md) |
| `query` | `queryClient`, key factories — [managing-data.md](./managing-data.md) |
| `navigation` | Headers, tab bars, drawer content — [creating-screen.md](./creating-screen.md) |
| `feedback` | `notify()` — [managing-errors.md](./managing-errors.md) |
| `errors` | `reportError` — [managing-errors.md](./managing-errors.md) |
| `theme` | Color scheme preference — [managing-styling.md](./managing-styling.md) |

### Placement

- `common` holds what is global (app-wide setup such as `auth`, `query`, `navigation`, `feedback`, `errors`, `theme`) and what more than one feature uses.
- Code one feature uses stays in that feature; when a second feature needs it, lint blocks the cross-feature import and the code moves to `common`.

### Feature module

`common` modules use the same shape.

```text
src/features/<feature>/
├── index.ts              # public barrel
├── components/           # screens and feature components, one per file
├── hooks/                # query, mutation, and feature-state hooks, one per file
├── types.ts
├── utils.ts
├── schemas.ts            # form schemas — creating-form.md
├── constants.ts
└── env.ts                # when the module reads env — managing-environment.md
```

- Folders are kebab-case.
- The barrel exports only what other modules need.
- A single-file module (`src/libs/<name>.ts`, `src/ui/<Component>.tsx`, `types.ts`) becomes a folder with an `index.ts(x)` barrel when it needs a second file, or when lint's `max-lines` fails; the import path stays the same.

| Grouping | When |
| --- | --- |
| Isolated feature | Callers use it as one package (one screen + hooks + types) |
| Grouped feature | Exports are inseparable in practice (screen + toolbar + search helper) |
| Per-screen module | Logic is owned by one screen flow |

### Components

- Functional components with named exports; one component per file; the file name matches the export.
- Props are an `interface`.
- Compound parts share a root prefix (`Button`, `ButtonText`, `ButtonIcon`) instead of `typeof children` switches.
- Props or `cva` variants encode state, not names (`Button` with `tone`, not `PrimaryButton`).
- Suffixes name the role (`Card`, `Row`, `Form`, `Dialog`); use one list-item suffix (`Item` or `Row`) across the app.

| Scope | Naming |
| --- | --- |
| All | PascalCase singular nouns (`UserCard`) |
| `src/ui/` | Generic: `Button`, `TextInput`, `Dialog` |
| Feature components | `<Feature><Entity><Type>`: `AuthLoginForm`, `CartItemRow`, `OrderSummaryCard` |
| Screens | `<Feature>Screen`: `WorkshopListScreen`; shared wrappers `<Name>Layout` |

### Recategorizing

| Signal | Move to |
| --- | --- |
| Presentation-only and used across features | `src/ui/` |
| Business logic inside `src/ui/` | The owning feature's `hooks/`; the primitive keeps presentation |
| Navigation UI reused across navigators | `src/common/navigation/` |
| Feature code a second feature needs | `src/common/<module>/` |

Update the barrels when moving code.

### Imports

- `@/*` (alias of `./src/*`) across modules; relative imports inside one module.
- Another module is imported through its barrel (`@/features/orders`, `@/common/query`, `@/ui/Async`, `@/api/app-api`); deep imports fail lint, except `@/common/query/client` per [managing-data.md](./managing-data.md).
- Lint enforces the **Layers** table, the barrels, `interface` props, and file length per [managing-linting.md](./managing-linting.md).

## Examples

### Feature barrel

```ts
export { WorkshopListScreen } from "./components/WorkshopListScreen";
export { useWorkshops } from "./hooks/useWorkshops";
export type { Workshop } from "./types";
```
