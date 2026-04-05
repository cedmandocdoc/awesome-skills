# Structuring Project

## Overview

Use this guide to organize the Vite + React SPA by responsibility. Keep routing, UI, features, API code, and state separate so each layer stays easy to change.

## Guidelines

### Structure

- Keep app code in `src/`.
- Keep Vite entry (`main.tsx`) at the project root or under `src/` per your Vite template and import **one** root stylesheet.
- Use kebab-case for feature folders.

| Area                           | Purpose                                                                  |
| ------------------------------ | ------------------------------------------------------------------------ |
| `global.css`                   | Project root: Tailwind + shadcn Tailwind imports; `@import` of `theme.css` |
| `src/theme.css`                | Design tokens and `@theme` / `:root` / `.dark` (see setting-up-theming.md) |
| `src/routes/`                  | TanStack Router file-based route modules (see configuring-routing.md)   |
| `src/routeTree.gen.ts`         | Generated route tree (do not edit by hand)                               |
| `src/ui/`                      | Flat presentational primitives (registry output from the add script)     |
| `src/features/<feature-name>/` | Domain logic and feature UI                                            |
| `src/api/`                     | Framework-agnostic HTTP code                                            |
| `src/stores/`                  | Zustand stores                                                          |
| `src/lib/`                     | Shared utilities (`utils.ts` with `cx`)                                 |

### Registry and `src/ui` (no `components.json`)

Primitives are added with **[`add-registry-component.js`](../scripts/add-registry-component.js)** (or `npx shadcn@latest view` for inspection). The script writes under **`src/ui/`**, rewrites imports for that layout, and normalizes **`cn` → `cx`** to match **`src/lib/utils.ts`**. You do **not** maintain **`components.json`** for this workflow—the default shadcn install paths (`@/components/ui`, root `lib/utils`) are intentionally not used.

### Root providers

Wire cross-cutting providers once, above the router:

1. **`QueryClientProvider`** (TanStack Query) — see [managing-state.md](./managing-state.md).
2. **`RouterProvider`** — from TanStack Router, using the generated route tree (see [configuring-routing.md](./configuring-routing.md)).
3. **Theme / document class** — if using class-based dark mode (e.g. `.dark` on `<html>`), set it from a small root component or layout route effect; keep tokens in **`src/theme.css`** per [setting-up-theming.md](./setting-up-theming.md).

Typical shape: `main.tsx` imports **`../global.css`** (or the correct relative path), creates `queryClient`, renders `QueryClientProvider` → `RouterProvider`.

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

Import the root stylesheet from `main.tsx` (or the Vite entry file):

```tsx
import "../global.css";
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
