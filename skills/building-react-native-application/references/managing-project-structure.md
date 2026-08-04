# Managing Project Structure

## Overview

Organize the React Native app by responsibility. Keep routing, UI, features, API code, and state separate so each layer stays easy to change.

## Guidelines

### Structure

| Area | Purpose |
| --- | --- |
| `src/routes/` | Navigator setup, route types, registration, navigation component wiring |
| `src/ui/` | Presentation-only primitives — see [creating-ui-component.md](./creating-ui-component.md#folder-layout) |
| `src/features/navigation/` | Reusable navigation components (headers, tab icons, drawer) and navigation hooks |
| `src/features/<feature-name>/` | Domain modules — screens and supporting UI in `components/` — see [creating-feature.md](./creating-feature.md#feature-folder-layout) |
| `src/libs/` | Internal library modules — wrapped third-party logic or from-scratch utilities (imported via `@/libs/...`) |
| `src/api/` | Framework-agnostic HTTP code — see [creating-api.md](./creating-api.md#structure) |
| `src/theme.css` | Design tokens |
| `src/theme.ts` | React Navigation theme objects |

- Keep `App.tsx` at the project root; import app modules from `src/`.
- Use kebab-case for feature folders.

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

- Treat each lib as an internal library: wrapped third-party APIs, adapters, or shared utilities.
- Libs may depend on any npm package.
- Libs must not import from other app folders (`src/api/`, `src/features/`, `src/routes/`, `src/ui/`); depend only on npm packages and other files under `src/libs/`.
- Single file when small: `src/libs/ApiError.ts`. Folder with `index.ts` when it grows.
- Import via `@/libs/<name>` regardless of shape.

### Dependency flow

`src/routes/` → features, `ui`, API hooks, stores
`src/features/` → other features (via barrel), `ui`, `libs`, `api`
`src/ui/` → presentation only; no features, API hooks, or stores
`src/api/` → plain TypeScript HTTP helpers; React components call in from feature code
`src/libs/` → isolated; `api`, `features`, and `ui` import from it
Zustand stores → live inside feature hooks (`src/features/<name>/hooks/use<Feature>Store.ts`)

### Imports

- Use `@/*` for cross-module imports; relative imports inside the same module.
- Import features through `index.ts`.
- Import order: `import type` → `react` → `react-native` → external packages → internal `@/...`

## Setup

### Configure the path alias

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

### Feature barrel

```ts
export { WorkshopListScreen } from "./components/WorkshopListScreen";
export { useWorkshops } from "./hooks/useWorkshops";
export type { Workshop } from "./types";
```

### Cross-module imports

```ts
import { WorkshopListScreen } from "@/features/workshop-list";
import { AppHeader } from "@/features/navigation";
import { Button } from "@/ui/Button";
```
