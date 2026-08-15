# Managing Scripts

## Overview

Wire canonical tasks into the Turbo graph.

## Prerequisites

[monorepo-contract.md](./monorepo-contract.md) — canonical task names, private root.

## Guidelines

### Graph rules

Canonical names and root `turbo run`: [monorepo-contract.md](./monorepo-contract.md) → **Canonical tasks**.

1. Register the same names in root `turbo.json`. Use `dependsOn: ["^build"]` / `^typecheck` when the task needs workspace dependencies built or checked first.
2. Keep task logic in the package so Turbo can parallelize and cache.

### Root

```json
{
  "private": true,
  "scripts": {
    "build": "turbo run build",
    "typecheck": "turbo run typecheck",
    "lint": "turbo run lint",
    "test": "turbo run test",
    "dev": "turbo run dev"
  }
}
```

### Package

```json
{
  "scripts": {
    "typecheck": "tsc --noEmit",
    "build": "tsc",
    "lint": "eslint .",
    "test": "vitest run",
    "dev": "vite"
  }
}
```

A package that has no build artifact still defines `typecheck` (and `lint` / `test` when it participates). Omit `build` only when nothing in the graph depends on compiled output from that package.

### `turbo.json`

```json
{
  "tasks": {
    "build": {
      "dependsOn": ["^build"],
      "outputs": ["dist/**"]
    },
    "typecheck": {
      "dependsOn": ["^typecheck"]
    },
    "lint": {},
    "test": {
      "dependsOn": ["build"]
    },
    "dev": {
      "cache": false,
      "persistent": true
    }
  }
}
```

## References

- [Turborepo — Configuring tasks](https://turbo.build/repo/docs/crafting-your-repository/configuring-tasks)
