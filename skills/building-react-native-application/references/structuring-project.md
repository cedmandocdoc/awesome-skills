# Structuring Project

## Overview

Use this guide to organize the React Native app by responsibility. Keep routing, UI, features, API code, and state separate so each layer stays easy to change.

## Guidelines

### Structure

- Keep app code in `src/`.
- Keep `App.tsx` at the project root and import app modules from `src/`.
- Use kebab-case for feature folders.

| Area                           | Purpose                                                                 |
| ------------------------------ | ----------------------------------------------------------------------- |
| `src/navigation/`              | Navigator setup, route types, and **screen registration** that composes exported feature components |
| `src/ui/`                      | Flat presentational primitives           |
| `src/features/<feature-name>/` | Domain logic and feature UI              |
| `src/api/`                     | Framework-agnostic HTTP code             |
| `src/stores/`                  | Zustand stores                           |
| `src/theme.css`                | Design tokens                            |
| `src/theme.ts`                 | React Navigation theme objects           |

### Dependency flow

- Let navigators (route registration in `src/navigation/`) compose features, `ui`, API hooks, and stores.
- Let features import other features through their barrel file.
- Keep `src/ui/` limited to presentation-only primitives; wire features, API hooks, and stores from feature modules and their hooks.
- Keep `src/navigation/` focused on route config.
- Keep `src/api/` as plain TypeScript HTTP helpers; React components and Zustand stores call into them from feature code and hooks.

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
export { WorkshopList } from "./components/WorkshopList";
export { useWorkshops } from "./hooks/useWorkshops";
export type { Workshop } from "./types/workshop";
```

### Import from module boundaries

```ts
import { WorkshopList } from "@/features/workshop-list";
import { Button } from "@/ui/button";
```
