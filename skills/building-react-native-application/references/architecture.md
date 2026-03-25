# Architecture

## Overview

Use this guide to organize your React Native app by responsibility. Keep routing, UI, features, API code, and state separate so each layer stays easy to change.

## Guidelines

### Structure

- Keep app code in `src/`.
- Keep `App.tsx` at the project root and import app modules from `src/`.
- Use hyphen-case for feature folders.

| Area                           | Purpose                                  |
| ------------------------------ | ---------------------------------------- |
| `src/screens/`                 | Thin route screens that compose features |
| `src/navigation/`              | Navigator setup and route types          |
| `src/ui/`                      | Flat presentational primitives           |
| `src/features/<feature-name>/` | Domain logic and feature UI              |
| `src/api/`                     | Framework-agnostic HTTP code             |
| `src/stores/`                  | Zustand stores                           |
| `src/theme.css`                | Design tokens                            |
| `src/theme.ts`                 | React Navigation theme objects           |

### Dependency flow

- Let screens compose features, `ui`, API hooks, and stores.
- Let features import other features through their barrel file.
- Keep `src/ui/` free of feature, API, and store imports.
- Keep `src/navigation/` focused on route config.
- Keep `src/api/` independent from React and Zustand.

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

Add `@/*` to `tsconfig.json` and keep your bundler config aligned.

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

## Usage

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
