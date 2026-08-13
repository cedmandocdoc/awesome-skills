# Managing Package Installs

## Overview

**Execution mode.** Install dependencies and run one-off CLIs using the consumer project's package manager. Target the **Expo app package root**, not the skill directory.

## Guidelines

### App package vs workspace root

| Root | Role |
| --- | --- |
| App package (`--root`) | `cwd` for install, dlx, and `expo install`; where dependencies are added (often `apps/<name>`) |
| Workspace / repo root | Often holds the lockfile and `packageManager` field |

Pass `--root <app-package-dir>` when cwd is not the app. Detection walks up from `--root`; install and run `cwd` stay on the app package.

### Detection order

[`detect-pm.cjs`](../scripts/detect-pm.cjs) resolves the package manager:

1. `--pm` override
2. Walking **up** from `--root` / cwd: nearest `package.json#packageManager`, then lockfiles (`pnpm-lock.yaml` → `yarn.lock` → `bun.lock` / `bun.lockb`)
3. Default `npm`

Scripts log the resolved manager to stderr.

### Install packages

Use [`install-packages.cjs`](../scripts/install-packages.cjs) for plain JS dependencies and dev tooling.

```bash
node <path-to-skill>/scripts/install-packages.cjs [options] [<pkg> ...]
```

| Flag | Purpose |
| --- | --- |
| `--root <dir>` | App package root when cwd differs |
| `--pm npm\|pnpm\|yarn\|bun` | Override detection |
| `--dev` | Save as devDependency (add only) |
| `--dry-run` | Print `{ pm, file, args }` without executing |

No package args runs `pnpm install` / `yarn install` / `bun install` / `npm install` at `--root`.

### Run a package (dlx / npx)

Use [`run-package.cjs`](../scripts/run-package.cjs) for one-off runners and Expo SDK-pinned installs.

```bash
node <path-to-skill>/scripts/run-package.cjs [options] -- <pkg> [args...]
```

Yarn Berry (nearest `.yarnrc.yml` walking up from `--root`) uses `yarn dlx`; Yarn 1 uses `npx` for dlx-style runs. `install-packages.cjs` still uses `yarn add`.

### Registry components

[`add-registry-component.cjs`](../scripts/add-registry-component.cjs) uses the same detection and command helpers for registry dependency installs and `shadcn view`.

### Agent workflow

1. Resolve the Expo app package root.
2. Run `install-packages.cjs` with no package args for a lockfile install.
3. Run `run-package.cjs -- expo install …` for Expo-pinned native packages (`--root` when cwd is not the app).
4. Run `install-packages.cjs` for plain JS packages (`--dev` when the reference says devDependency).
5. Run `run-package.cjs -- …` for one-off CLIs (`shadcn view`, create tools).
6. Skip hand-written `npm install` / `npx expo install` unless the scripts are unavailable.

## Examples

```bash
node ../scripts/install-packages.cjs --root apps/mobile
node ../scripts/install-packages.cjs axios
node ../scripts/install-packages.cjs --dev eslint prettier eslint-config-expo
node ../scripts/install-packages.cjs @date-fns/tz
node ../scripts/run-package.cjs -- shadcn@latest view "https://reactnativereusables.com/r/nativewind/button.json"
node ../scripts/run-package.cjs -- expo install tailwindcss-animate
node ../scripts/run-package.cjs -- expo install lucide-react-native @gorhom/bottom-sheet
```

## Related

- [setting-up-theming.md](./setting-up-theming.md)
- [setting-up-registry-components.md](./setting-up-registry-components.md)
- [managing-linting.md](./managing-linting.md)
- [add-registry-component.cjs](../scripts/add-registry-component.cjs)
