# Managing Package Scripts

## Overview

Canonical task names live on each package. The root only delegates to `turbo run`. Task logic stays in the package so Turbo can parallelize and cache.

## Prerequisites

[monorepo-contract.md](./monorepo-contract.md) — canonical task names, private root.

## Guidelines

### Graph rules

1. Each participating package defines the script (`typecheck`, `build`, `lint`, `test`, `dev`).
2. Root `package.json` scripts only call `turbo run <task>`.
3. Register the same names in root `turbo.json`. Use `dependsOn: ["^build"]` / `^typecheck` when the task needs workspace dependencies built or checked first.

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

### Framework tasks

`ios`, `android`, `prebuild`, Vite `preview`, and similar stay on the stack package. They are not universal Turbo names in this skill.

If a `turborepo` skill is installed, use it for remote cache, `--filter` / `--affected`, env hashing, and CI. Those topics are not defined here.

## Related

- [managing-imports.md](./managing-imports.md)

## References

- [Turborepo — Configuring tasks](https://turbo.build/repo/docs/crafting-your-repository/configuring-tasks)
