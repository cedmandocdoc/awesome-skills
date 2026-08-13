# Managing Package Installs

## Overview

**Execution mode.** Installs dependencies and runs one-off CLIs using the consumer project's package manager. Target the **app package root**, not the skill directory.

## Guidelines

### App package vs workspace root

| Root | Role |
| --- | --- |
| App package (`--root`) | `cwd` for install and dlx; where dependencies are added (often `apps/<name>`) |
| Workspace / repo root | Often holds the lockfile and `packageManager` field |

Pass `--root <app-package-dir>` when cwd is not the app. Detection walks up from `--root`; install and run `cwd` stay on the app package.

### Detection order

[`detect-pm.cjs`](../scripts/detect-pm.cjs) resolves the package manager in this order:

1. `--pm` override on the script
2. Walking **up** from `--root` / cwd: nearest `package.json#packageManager`, then lockfiles (`pnpm-lock.yaml` → `yarn.lock` → `bun.lock` / `bun.lockb`)
3. Default `npm`

Scripts log the resolved manager to stderr (for example `[install-packages] package manager: pnpm`).

### Install packages

Use [`install-packages.cjs`](../scripts/install-packages.cjs) for dependencies listed in setup and managing references.

```bash
node <path-to-skill>/scripts/install-packages.cjs [options] [<pkg> ...]
```

| Flag | Purpose |
| --- | --- |
| `--root <dir>` | App package root when cwd is not the app |
| `--pm npm\|pnpm\|yarn\|bun` | Override detection |
| `--dev` | Save as devDependency (add only) |
| `--dry-run` | Print `{ pm, file, args }` without executing |

No package args runs `pnpm install` / `yarn install` / `bun install` / `npm install` at `--root`.

Examples:

```bash
node ../scripts/install-packages.cjs --root apps/web
node ../scripts/install-packages.cjs axios
node ../scripts/install-packages.cjs --dev eslint prettier
node ../scripts/install-packages.cjs @tanstack/react-query zustand
```

### Run a package (dlx / npx)

Use [`run-package.cjs`](../scripts/run-package.cjs) for one-off runners such as `shadcn view`. On Expo apps, SDK-pinned installs use the same script with `expo install` args.

```bash
node <path-to-skill>/scripts/run-package.cjs [options] -- <pkg> [args...]
```

Yarn Berry (nearest `.yarnrc.yml` walking up from `--root`) uses `yarn dlx`; Yarn 1 uses `npx` for dlx-style runs. Installs still use `yarn add`.

Examples:

```bash
node ../scripts/run-package.cjs -- shadcn@latest view button
node ../scripts/run-package.cjs -- expo install tailwindcss-animate
```

### Registry components

[`add-registry-component.cjs`](../scripts/add-registry-component.cjs) uses the same detection and command helpers for registry dependency installs and `shadcn view`.

### Agent workflow

When a reference lists packages to install:

1. Resolve the app package root.
2. Run `install-packages.cjs` with no package args for a lockfile install, or with packages / `--dev` as the reference specifies (`--root` when cwd is not the app).
3. Run `run-package.cjs` when the step is a one-off CLI (`shadcn view`, create tools).
4. Skip hand-written `npm install` / `npx` commands unless the script is unavailable.

## Related

- [setting-up-theming.md](./setting-up-theming.md)
- [managing-linting.md](./managing-linting.md)
- [add-registry-component.cjs](../scripts/add-registry-component.cjs)
