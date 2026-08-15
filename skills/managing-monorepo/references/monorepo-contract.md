# Monorepo Contract

## Overview

Shared layout and field meanings for all `managing-monorepo` workflows: scoped names, public surface, canonical scripts, and how a JIT library aliases its own internals.

## Guidelines

### Resolve workspace root

A folder with a private root `package.json` and a workspace definition (`pnpm-workspace.yaml`, `package.json` `"workspaces"`, or `turbo.json`). Ask when multiple candidates exist.

### Scoped names

| Rule | Detail |
| --- | --- |
| Form | `@scope/<dir>` aligned with the directory (`packages/ui` → `@scope/ui`) |
| Internal packages | `"private": true`, consumed with `"workspace:*"` |
| Public surface | `package.json` `exports` with subpaths |
| Apps | Leaves — other packages do not depend on them |

Subpaths name public entry points. A giant barrel that re-exports the whole package is not the public surface.

### Canonical tasks

Universal script names every participating package defines: `typecheck`, `build`, `lint`, `test`, `dev`.

Root `package.json` is private. Its scripts only delegate: `turbo run <task>`.

Framework tasks (`ios`, `android`, `prebuild`, Vite `preview`) stay in stack skills. This contract does not invent extra universal names.

### JIT vs compiled

The skill does not require JIT vs compiled packages.

| Kind | In-package alias |
| --- | --- |
| JIT (consumed as TypeScript source) | `package.json` `"imports": { "#*": "./src/*" }` |
| Compiled (`dist/`) | Relative imports inside the package; publish `exports` to `dist` |

`compilerOptions.paths` is not a cross-package primitive and is not the JIT in-package alias.

### Out of scope

- Shared config packages and compiler-option catalogs
- Workspace folder layout (`apps/*` vs `packages/*`)
- Expo / Metro / Vite / NativeWind
- Slot-based Expo variants and host toolchain
- pnpm catalogs and CLI
- Turbo remote cache, `--affected`, env hashing
