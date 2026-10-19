# Scaffolding Application

## Overview

**Execution mode.** Creates an Expo app at a resolved target path and bootstraps the fixed stack; on an existing app, runs only the steps whose result is missing. Done when typecheck and lint pass.

## Prerequisites

- [managing-package-installs.md](./managing-package-installs.md)

## Guidelines

### 1. Resolve target path

| Prompt signal | `target_path` |
| --- | --- |
| Explicit path (`apps/mobile`, …) | That path |
| Scaffold here / `.` | `.` |
| Workspace detected, path not stated | Ask |

### 2. Resolve create cwd

Use the directory that contains `target_path` as a relative child (monorepo root, or the empty folder when `target_path` is `.`). Pass it as `--root` on `run-package.cjs` when it differs from cwd.

### 3. Scaffold

```bash
node <path-to-skill>/scripts/run-package.cjs [--root <create-cwd>] -- create-expo-app@latest <target_path> --template blank-typescript --no-install --no-agents-md --yes
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
| NativeWind | [setting-up-nativewind.md](./setting-up-nativewind.md) |
| React Navigation | [React Navigation — Getting started](https://reactnavigation.org/docs/getting-started.md); root navigator per [creating-screen.md](./creating-screen.md) |
| TanStack Query | Install `@tanstack/react-query`; `QueryClientProvider` at the root (**Examples**) |
| TypeScript | `strict`, `moduleResolution: "bundler"`, and the `@/*` alias (**Examples**); folders per [managing-project-structure.md](./managing-project-structure.md) |
| Typed env | [managing-environment.md](./managing-environment.md), when the app reads env |
| Lint | [managing-linting.md](./managing-linting.md) |

### 7. Verify

Run `run-package.cjs -- tsc --noEmit` and `run-package.cjs -- eslint .` at the app root; fix every error.

### 8. Confirm to the user

Report `target_path`, the stack pieces installed, the verify result, and the instruction files changed.

## Examples

### `App.tsx`

```tsx
import "./global.css";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Navigation } from "@/routes";

const queryClient = new QueryClient();

export default function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <Navigation />
    </QueryClientProvider>
  );
}
```

### `tsconfig.json`

```json
{
  "extends": "expo/tsconfig.base",
  "compilerOptions": {
    "strict": true,
    "moduleResolution": "bundler",
    "paths": { "@/*": ["./src/*"] }
  }
}
```

## References

- [create-expo](https://docs.expo.dev/more/create-expo/)
