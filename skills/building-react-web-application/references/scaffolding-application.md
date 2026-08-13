# Scaffolding Application

## Overview

**Execution mode.** Creates a minimal Vite + React TypeScript app (`react-ts`) at a resolved target path. Installs template deps via [managing-package-installs.md](./managing-package-installs.md). Run stack setup references only when the user asks.

## Prerequisites

- [managing-package-installs.md](./managing-package-installs.md)

## Guidelines

### 1. Resolve target path

| Prompt signal | `target_path` |
| --- | --- |
| Explicit path (`apps/web`, …) | That path |
| Scaffold here / `.` | `.` |
| Workspace detected, path not stated | Ask — do not guess `apps/<name>` |

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

### 6. Confirm to the user

Report `target_path`, template `react-ts`, and that template deps are installed.

## Related

- [managing-project-structure.md](./managing-project-structure.md)
- [managing-linting.md](./managing-linting.md)
- [managing-environment.md](./managing-environment.md)
- [setting-up-theming.md](./setting-up-theming.md)
- [creating-route-component.md](./creating-route-component.md)

## References

- [Vite — Getting Started](https://vite.dev/guide/)
- [create-vite](https://github.com/vitejs/vite/tree/main/packages/create-vite)
