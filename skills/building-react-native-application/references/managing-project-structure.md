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
| `src/features/<feature-name>/` | Domain modules — see [creating-feature.md](./creating-feature.md#feature-folder-layout) |
| `src/libs/`                    | Global reusable code (any folder may import via `@/libs/...`)           |
| `src/api/`                     | Framework-agnostic HTTP code — see [creating-api.md](./creating-api.md) |
| `src/assets/`                  | Static assets (images, fonts, Lottie); mostly flat, group by type when helpful |
| `src/theme.css`                | Design tokens                                                           |
| `src/theme.ts`                 | React Navigation theme objects                                          |

### Module internals

Use the owning guide for folder-level detail; this table is the map only.

| Area | Detail in |
| --- | --- |
| `src/features/<feature-name>/` | [creating-feature.md](./creating-feature.md#feature-folder-layout) |
| `src/ui/` | [creating-ui-component.md](./creating-ui-component.md#folder-layout) |
| `src/api/<backend-name>/` | [creating-api.md](./creating-api.md) |
| Feature `env.ts` | [managing-environment.md](./managing-environment.md) |
| Feature hooks and stores | [managing-state.md](./managing-state.md) |

### `src/libs/`

- Keep libs free of React, features, routes, and stores.
- Prefer a single file when the module is small: `src/libs/ApiError.ts`.
- Use a folder with `index.ts` when the module grows: `src/libs/date-utils/index.ts`.
- Import via `@/libs/<name>` regardless of file or folder shape.

### `src/assets/`

- Keep static files under `src/assets/` (or the bundler-supported equivalent).
- Prefer a flat layout for a handful of files.
- Group into subfolders when volume or type warrants it (for example `images/`, `fonts/`, `lottie/`).

### Dependency flow

- Let route modules in `src/routes/` compose features, `ui`, API hooks, and stores.
- Let features import other features through their barrel file.
- Keep `src/ui/` limited to presentation-only primitives; wire features, API hooks, and stores from feature modules and their hooks.
- Keep `src/routes/` focused on route config and navigation component wiring.
- Keep `src/features/navigation/` focused on reusable navigation UI — not domain business logic.
- Keep `src/api/` as plain TypeScript HTTP helpers; React components and Zustand stores call into them from feature code and hooks.
- Keep `src/libs/` free of React, features, routes, and stores; put cross-cutting primitives here (for example `ApiError`) so `src/api/`, `src/features/`, and `src/ui/` can all import them.
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
export { WorkshopListScreen } from "./WorkshopListScreen";
export { useWorkshops } from "./hooks/useWorkshops";
export type { Workshop } from "./types";
```

### Import from module boundaries

```ts
import { WorkshopListScreen } from "@/features/workshop-list";
import { AppHeader } from "@/features/navigation";
import { Button } from "@/ui/Button";
```
