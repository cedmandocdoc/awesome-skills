# Managing Project Structure

## Overview

Use this guide to organize the React Native app by responsibility. Keep routing, UI, features, API code, and state separate so each layer stays easy to change.

## Guidelines

### Structure

- Keep app code in `src/`.
- Keep `App.tsx` at the project root and import app modules from `src/`.
- Use kebab-case for feature folders.

| Area                           | Purpose                                                                 |
| ------------------------------ | ----------------------------------------------------------------------- |
| `src/routes/`                  | Route layer: navigator setup, route types, registration, and navigation component wiring |
| `src/ui/`                      | Presentation-only primitives — see [creating-ui-component.md](./creating-ui-component.md#folder-layout) |
| `src/features/navigation/`     | Reusable navigation components (headers, tab icons, drawer) and navigation hooks |
| `src/features/<feature-name>/` | Domain modules — screens and supporting UI in `components/` — see [creating-feature.md](./creating-feature.md#feature-folder-layout) |
| `src/libs/`                    | Internal library modules — wrapped third-party logic or from-scratch utilities (imported elsewhere via `@/libs/...`) |
| `src/api/`                     | Framework-agnostic HTTP code — see [creating-api.md](./creating-api.md#structure) |
| `src/theme.css`                | Design tokens                                                           |
| `src/theme.ts`                 | React Navigation theme objects                                          |

### Module internals

Use the owning guide for folder-level detail; this table is the map only.

| Area | Detail in |
| --- | --- |
| `src/features/<feature-name>/` | [creating-feature.md](./creating-feature.md#feature-folder-layout) |
| `src/ui/` | [creating-ui-component.md](./creating-ui-component.md#folder-layout) |
| `src/api/<backend-name>/` | [creating-api.md](./creating-api.md#structure) |
| Feature `env.ts` | [managing-environment.md](./managing-environment.md) |
| Feature hooks and stores | [managing-state.md](./managing-state.md) |

### `src/libs/`

- Treat each lib as an internal library: wrapped third-party APIs, adapters, or from-scratch utilities shared across the app.
- Libs may depend on any npm package when the abstraction needs it.
- Do not import from other app folders (`src/api/`, `src/features/`, `src/routes/`, `src/ui/`, etc.); depend only on npm packages and other files under `src/libs/`.
- Prefer a single file when the module is small: `src/libs/ApiError.ts`.
- Use a folder with `index.ts` when the module grows: `src/libs/date-utils/index.ts`.
- Import from app code via `@/libs/<name>` regardless of file or folder shape.

### Dependency flow

- Let route modules in `src/routes/` compose features, `ui`, API hooks, and stores.
- Let features import other features through their barrel file.
- Keep `src/ui/` limited to presentation-only primitives; wire features, API hooks, and stores from feature modules and their hooks.
- Keep `src/routes/` focused on route config and navigation component wiring.
- Keep `src/features/navigation/` focused on reusable navigation UI — not domain business logic.
- Keep `src/api/` as plain TypeScript HTTP helpers; React components and Zustand stores call into them from feature code and hooks.
- Keep `src/libs/` isolated from other app folders; put shared library code here (for example `ApiError`) so `src/api/`, `src/features/`, and `src/ui/` can import it via `@/libs/...`.
- Keep Zustand stores inside feature hooks (`src/features/<feature-name>/hooks/use<Feature>Store.ts`), even when other features consume them.

### Imports

- Use `@/*` for cross-module imports.
- Use relative imports inside the same module.
- Import features through `index.ts`.
- Keep this import order:
  1. `import type`
  2. `react`
  3. `react-native`
  4. external packages
  5. internal `@/...`

## Setup

### Configure the path alias

Add `@/*` to `tsconfig.json` and keep the bundler config aligned.

```json
{
  "compilerOptions": {
    "baseUrl": ".",
    "paths": {
      "@/*": ["./src/*"]
    }
  }
}
```

## Examples

### Export a feature barrel

```ts
export { WorkshopListScreen } from "./components/WorkshopListScreen";
export { useWorkshops } from "./hooks/useWorkshops";
export type { Workshop } from "./types";
```

### Import from module boundaries

```ts
import { WorkshopListScreen } from "@/features/workshop-list";
import { AppHeader } from "@/features/navigation";
import { Button } from "@/ui/Button";
```
