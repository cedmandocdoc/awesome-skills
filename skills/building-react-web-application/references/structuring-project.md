# Structuring Project

## Overview

Use this guide to organize the Vite + React SPA by responsibility. Keep routing, UI, features, API code, and state separate so each layer stays easy to change.

## Guidelines

### Structure

- Keep app code in `src/`.
- Keep Vite entry (`main.tsx`) at the project root (or `src/` per Vite template) and import global CSS once.
- Use kebab-case for feature folders.

| Area                           | Purpose                                                                  |
| ------------------------------ | ------------------------------------------------------------------------ |
| `src/routes/`                  | TanStack Router file-based route modules (see configuring-routing.md)   |
| `src/routeTree.gen.ts`         | Generated route tree (do not edit by hand)                               |
| `src/ui/`                      | Flat presentational primitives (shadcn-style registry output)          |
| `src/features/<feature-name>/` | Domain logic and feature UI                                            |
| `src/api/`                     | Framework-agnostic HTTP code                                            |
| `src/stores/`                  | Zustand stores                                                          |
| `src/lib/`                     | Shared utilities (e.g. `utils.ts` with `cx`)                            |
| `src/styles/globals.css`     | Tailwind import + design tokens (see setting-up-theming.md)             |

### `components.json` and `src/ui`

shadcn defaults target `@/components/ui`. To keep primitives in **`src/ui`**, set aliases in `components.json` (and mirror them in `tsconfig.json` paths), for example:

```json
{
  "aliases": {
    "components": "@/ui",
    "ui": "@/ui",
    "lib": "@/lib",
    "utils": "@/lib/utils",
    "hooks": "@/hooks"
  }
}
```

Align `"tailwind": { "css": "src/styles/globals.css" }` with where your global stylesheet lives.

### Root providers

Wire cross-cutting providers once, above the router:

1. **`QueryClientProvider`** (TanStack Query) — see [managing-state.md](./managing-state.md).
2. **`RouterProvider`** — from TanStack Router, using the generated route tree (see [configuring-routing.md](./configuring-routing.md)).
3. **Theme / document class** — if using class-based dark mode (e.g. `.dark` on `<html>`), set it from a small root component or layout route effect; keep token CSS in `globals.css` per [setting-up-theming.md](./setting-up-theming.md).

Typical shape: `main.tsx` imports `./src/styles/globals.css`, creates `queryClient`, renders `QueryClientProvider` → `RouterProvider`.

### Dependency flow

- Let route modules compose features, `ui`, API hooks, and stores.
- Let features import other features through their barrel file.
- Keep `src/ui/` free of feature, API, and store imports.
- Keep route files focused on routing concerns (layouts, loaders where used); avoid bloating them with domain logic—delegate to features.
- Keep `src/api/` independent from React and Zustand.

### Imports

- Use `@/*` for cross-module imports (map to `./src/*`).
- Use relative imports inside the same module.
- Import features through `index.ts`.
- Keep this import order:

  1. `import type`
  2. `react`
  3. `react-dom` (when needed)
  4. external packages
  5. internal `@/...`

## Setup

### Configure the path alias

Add `@/*` → `./src/*` in `tsconfig.json` and keep `vite.config.ts` `resolve.alias` aligned if required.

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

### Global CSS entry

Import the global stylesheet from `main.tsx` (or the Vite entry file):

```tsx
import "./styles/globals.css";
```

Ensure `index.html` references the JS entry; Vite injects CSS from that import.

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
