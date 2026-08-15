---
name: managing-monorepo
description: Defines how TypeScript packages in a workspace import each other and name shared scripts (`exports`, `workspace:*`, canonical `typecheck` / `build` / `lint` / `test` / `dev`). Use when adding a package, choosing import style, naming a package, or adding a script other packages must run.
version: 1.0.0
---

# Managing Monorepo

## Overview

Packages import each other by scoped name and `exports` subpaths. Root scripts only delegate to `turbo run`. Each package that participates defines `typecheck`, `build`, `lint`, `test`, and `dev`.

## Agent workflow

Follow this skill for TypeScript workspace packages that import each other or share task names. Works wherever the agent can read `package.json`. Match **Entry points**; for a new package open every **Task types** row that applies.

If a `turborepo` skill is installed, use it for cache, `--filter`, and CI. This skill repeats only the script-graph rules those tasks need.

### Entry points

Use the first matching row; combine when the task spans types.

| Entry | When | Go to |
| --- | --- | --- |
| Cross-package import | Library or app importing another workspace package | [managing-imports.md](./references/managing-imports.md) |
| In-package JIT alias | A library consumed as TypeScript source aliases its own internals | [managing-imports.md](./references/managing-imports.md) |
| Canonical script | Adding or renaming a task other packages must run | [managing-package-scripts.md](./references/managing-package-scripts.md) |
| Lookup | Known doc name or single reference | **Reference index** |

### Task types

Match every row that applies. Open every local link in **Docs** before coding.

| Task type | Docs |
| --- | --- |
| New package | [monorepo-contract.md](./references/monorepo-contract.md), [managing-imports.md](./references/managing-imports.md), [managing-package-scripts.md](./references/managing-package-scripts.md) |
| Change `exports` / scoped name | [managing-imports.md](./references/managing-imports.md) |
| Add `typecheck` / `build` / `lint` / `test` / `dev` | [managing-package-scripts.md](./references/managing-package-scripts.md) |

## Reference index

### Contract

[monorepo-contract.md](./references/monorepo-contract.md) — scoped names, `private` / `workspace:*`, `exports`, canonical task names, JIT vs compiled aliasing.

| Doc | When to use |
| --- | --- |
| [monorepo-contract.md](./references/monorepo-contract.md) | Names, `exports`, canonical scripts, workspace resolve |
| [managing-imports.md](./references/managing-imports.md) | Cross-package and in-package import rules |
| [managing-package-scripts.md](./references/managing-package-scripts.md) | Root vs package scripts; Turbo graph rules |
