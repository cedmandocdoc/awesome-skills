# Managing Package Installs

## Overview

**Execution mode.** Installs dependencies and runs one-off CLIs using the consumer project's package manager. Run from the **Expo app project root**, not the skill directory.

## Guidelines

### Detection order

[`detect-pm.cjs`](../scripts/detect-pm.cjs) resolves the package manager in this order:

1. `--pm` override on the script
2. `package.json#packageManager`
3. Lockfiles: `pnpm-lock.yaml` → `yarn.lock` → `bun.lock` / `bun.lockb`
4. Default `npm`

Scripts log the resolved manager to stderr (for example `[install-packages] package manager: pnpm`).

### Install packages

Use [`install-packages.cjs`](../scripts/install-packages.cjs) for plain JS dependencies and dev tooling.

```bash
node <path-to-skill>/scripts/install-packages.cjs [options] <pkg> [more...]
```

| Flag | Purpose |
| --- | --- |
| `--root <dir>` | Project root when cwd is not the app |
| `--pm npm\|pnpm\|yarn\|bun` | Override detection |
| `--dev` | Save as devDependency |
| `--dry-run` | Print `{ pm, file, args }` without executing |

Examples:

```bash
node ../scripts/install-packages.cjs axios
node ../scripts/install-packages.cjs --dev eslint prettier eslint-config-expo
node ../scripts/install-packages.cjs @date-fns/tz
```

### Run a package (dlx / npx)

Use [`run-package.cjs`](../scripts/run-package.cjs) for one-off runners and Expo SDK-pinned installs.

```bash
node <path-to-skill>/scripts/run-package.cjs [options] -- <pkg> [args...]
```

Yarn 1 (no `.yarnrc.yml`) uses `npx` for dlx-style runs; `install-packages.cjs` still uses `yarn add`.

Examples:

```bash
node ../scripts/run-package.cjs -- shadcn@latest view "https://reactnativereusables.com/r/nativewind/button.json"
node ../scripts/run-package.cjs -- expo install tailwindcss-animate
node ../scripts/run-package.cjs -- expo install lucide-react-native @gorhom/bottom-sheet
```

`expo install` is just another runner invocation — Expo picks SDK-compatible versions and uses the project's package manager internally.

### Registry components

[`add-registry-component.cjs`](../scripts/add-registry-component.cjs) uses the same detection and command helpers for registry dependency installs and `shadcn view`.

### Agent workflow

When a reference lists packages to install:

1. Resolve the app project root.
2. Run `run-package.cjs -- expo install …` for Expo-pinned native packages.
3. Run `install-packages.cjs` for plain JS packages (`--dev` when the reference says devDependency).
4. Run `run-package.cjs -- …` when the step is inspect-only (`shadcn view`).
5. Skip hand-written `npm install` / `npx expo install` unless the scripts are unavailable.

## Related

- [setting-up-theming.md](./setting-up-theming.md)
- [setting-up-registry-components.md](./setting-up-registry-components.md)
- [managing-linting.md](./managing-linting.md)
- [add-registry-component.cjs](../scripts/add-registry-component.cjs)
