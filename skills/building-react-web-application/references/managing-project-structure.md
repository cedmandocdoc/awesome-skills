# Managing Project Structure

## Overview

Use this guide to organize the Vite + React SPA by responsibility. Keep routing, UI, features, API code, and state separate so each layer stays easy to change.

## Guidelines

### Structure

- Keep app code in `src/`.
- Keep Vite entry (`main.tsx`) at the project root or under `src/` per your Vite template and import **one** root stylesheet.
- Use kebab-case for feature folders.

| Area                           | Purpose                                                                         |
| ------------------------------ | ------------------------------------------------------------------------------- |
| `global.css`                   | Project root: Tailwind + shadcn Tailwind imports; `@import` of `theme.css`      |
| `src/theme.css`                | Design tokens and `@theme` / `:root` / `.dark` (see setting-up-theming.md)      |
| `src/routes/`                  | TanStack Router file-based routes — flat filenames map to URLs (see creating-route-component.md) |
| `src/routeTree.gen.ts`         | Generated route tree (from `src/routes/`; edit route modules)                   |
| `src/ui/`                      | Presentation-only primitives — see [creating-ui-component.md](./creating-ui-component.md#folder-layout) |
| `src/features/navigation/`     | Reusable navigation components (headers, shells, sidebars) and navigation hooks     |
| `src/features/<feature-name>/` | Domain modules — pages, screens, and supporting UI in `components/` — see [creating-feature.md](./creating-feature.md#feature-folder-layout) |
| `src/libs/`                    | Internal library modules — wrapped third-party logic or from-scratch utilities (imported elsewhere via `@/libs/...`) |
| `src/api/`                     | Framework-agnostic HTTP code — see [creating-api.md](./creating-api.md#structure)         |
| `tests/`                       | Playwright E2E tests (see [creating-e2e-testing.md](./creating-e2e-testing.md)) |

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

### Registry and `src/ui`

Primitives are added with **[`add-registry-component.cjs`](../scripts/add-registry-component.cjs)** (or [`run-package.cjs`](../scripts/run-package.cjs) for `shadcn view` inspection). The script writes under **`src/ui/`**, rewrites imports for that layout, and normalizes **`cn` → `cx`** from **`class-variance-authority`**. Stock shadcn docs assume **`@/components/ui`** and a **`cn`** utility; this stack standardizes on **`src/ui/`** and **`cx`**.

### Root providers

Wire cross-cutting providers once, above the router:

1. **`QueryClientProvider`** (TanStack Query) — see [managing-state.md](./managing-state.md).
2. **`RouterProvider`** — from TanStack Router, using the generated route tree (see [creating-route-component.md](./creating-route-component.md)).
3. **Theme / document class** — if using class-based dark mode (e.g. `.dark` on `<html>`), set it from a small root component or layout route effect; keep tokens in **`src/theme.css`** per [setting-up-theming.md](./setting-up-theming.md).

Typical shape: `main.tsx` imports **`../global.css`** (or the correct relative path), creates `queryClient`, renders `QueryClientProvider` → `RouterProvider`.

### Dependency flow

- Let route modules compose features, `ui`, API hooks, and stores.
- Let features import other features through their barrel file.
- Keep `src/ui/` free of feature, API, and store imports.
- Keep route files focused on routing concerns (layouts, loaders where used); delegate domain logic to features.
- Keep `src/api/` independent from React and Zustand.
- Keep `src/libs/` isolated from other app folders; put shared library code here (for example `ApiError`) so `src/api/`, `src/features/`, and `src/ui/` can import it via `@/libs/...`.
- Keep Zustand stores inside feature hooks (`src/features/<feature-name>/hooks/use<Feature>Store.ts`), even when other features consume them.

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
export { WorkshopListPage } from "./components/WorkshopListPage";
export { useWorkshops } from "./hooks/useWorkshops";
export type { Workshop } from "./types";
```

### Import from module boundaries

```ts
import { WorkshopListPage } from "@/features/workshop-list";
import { Button } from "@/ui/Button";
```
