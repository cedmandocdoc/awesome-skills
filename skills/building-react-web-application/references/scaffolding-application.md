# Scaffolding Application

## Overview

**Execution mode.** Creates a Vite + React TypeScript app at a resolved target path and bootstraps the fixed stack; on an existing app, runs only the steps whose result is missing. Done when typecheck and lint pass.

## Prerequisites

- [managing-package-installs.md](./managing-package-installs.md)

## Guidelines

### 1. Resolve target path

| Prompt signal | `target_path` |
| --- | --- |
| Explicit path (`apps/web`, …) | That path |
| Scaffold here / `.` | `.` |
| Workspace detected, path not stated | Ask |

### 2. Resolve create cwd

Use the directory that contains `target_path` as a relative child (monorepo root, or the empty folder when `target_path` is `.`). Pass it as `--root` on `run-package.cjs` when it differs from cwd.

### 3. Scaffold

```bash
node <path-to-skill>/scripts/run-package.cjs [--root <create-cwd>] -- create-vite@latest <target_path> --template react-ts --eslint --no-interactive --no-immediate
```

### 4. Workspace membership

If the repo is a workspace, confirm `target_path` is covered by a packages glob (for example `apps/*`) before install. Extend the workspace config only when the path is outside current globs and the user wants membership.

### 5. Install template dependencies

```bash
node <path-to-skill>/scripts/install-packages.cjs --root <resolved-app-path>
```

`<resolved-app-path>` is `target_path` resolved against create cwd. No package args (lockfile install).

### 6. Bootstrap the stack

| Piece | How |
| --- | --- |
| Tailwind CSS v4 | Install `tailwindcss` and `@tailwindcss/vite`; register the plugin per [Tailwind CSS — Using Vite](https://tailwindcss.com/docs/installation/using-vite); entry CSS per [managing-styling.md](./managing-styling.md) |
| TanStack Router | Install `@tanstack/react-router` and `@tanstack/router-plugin`; register the plugin before `@vitejs/plugin-react` (**Examples**); routes per [creating-page.md](./creating-page.md) |
| TanStack Query | Install `@tanstack/react-query`; `QueryClientProvider` above `RouterProvider` (**Examples**) |
| TypeScript | `strict` and the `@/*` alias in `tsconfig.app.json`, mirrored in `vite.config.ts` `resolve.alias` (**Examples**); folders per [managing-project-structure.md](./managing-project-structure.md) |
| Typed env | [managing-environment.md](./managing-environment.md), when the app reads env |
| Lint | [managing-linting.md](./managing-linting.md) |

### 7. Verify

Run `run-package.cjs -- tsc -b` and `run-package.cjs -- eslint .` at the app root; fix every error.

### 8. Confirm to the user

Report `target_path`, the stack pieces installed, the verify result, and the instruction files changed.

## Examples

### `src/main.tsx`

```tsx
import "../global.css";
import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { createRouter, RouterProvider } from "@tanstack/react-router";
import { routeTree } from "./routeTree.gen";

const queryClient = new QueryClient();
const router = createRouter({ routeTree });

declare module "@tanstack/react-router" {
  interface Register {
    router: typeof router;
  }
}

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <QueryClientProvider client={queryClient}>
      <RouterProvider router={router} />
    </QueryClientProvider>
  </StrictMode>,
);
```

### `vite.config.ts`

```ts
import { fileURLToPath, URL } from "node:url";
import tailwindcss from "@tailwindcss/vite";
import { tanstackRouter } from "@tanstack/router-plugin/vite";
import react from "@vitejs/plugin-react";
import { defineConfig } from "vite";

export default defineConfig({
  plugins: [
    tanstackRouter({ target: "react", routesDirectory: "src/routes" }),
    react(),
    tailwindcss(),
  ],
  resolve: {
    alias: { "@": fileURLToPath(new URL("./src", import.meta.url)) },
  },
});
```

### `tsconfig.app.json`

```json
{
  "compilerOptions": {
    "strict": true,
    "paths": { "@/*": ["./src/*"] }
  }
}
```

## References

- [Vite — Getting Started](https://vite.dev/guide/)
- [TanStack Router — Installation with Vite](https://tanstack.com/router/latest/docs/installation/with-vite.md)
