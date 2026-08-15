---
name: managing-monorepo
id: e0e993e7-a5f9-4bea-9923-166b503df045
description: Defines the workspace contract for a TypeScript monorepo with pnpm and Turborepo — folder roles (`apps/` vs `packages/`), cross-package imports (`exports`, `workspace:*`), and canonical scripts (`typecheck`, `build`, `lint`, `test`, `dev`). Use when adding a package, choosing apps vs packages, wiring an import, or naming a script other packages must run.
version: 1.1.0
---

# Managing Monorepo

## Overview

Workspace contract: folder roles, cross-package imports, and the Turbo task graph.

### Tech stack

| Layer | Choice |
| --- | --- |
| Language | TypeScript |
| Package manager | pnpm (workspaces) |
| Task runner | Turborepo |

## Dependencies

Resolve every **required** row before recipes that need it. Skill discovery and missing-skill stop text: [monorepo-contract.md](./references/monorepo-contract.md) → **Require pnpm and turborepo**.

| Item | Required | When | How |
| --- | --- | --- | --- |
| [pnpm](https://github.com/antfu/skills/tree/main/skills/pnpm) | required | Always | `npx skills add antfu/skills --skill pnpm` |
| [turborepo](https://github.com/antfu/skills/tree/main/skills/turborepo) | required | Always | `npx skills add antfu/skills --skill turborepo` |

Install both: `npx skills add antfu/skills --skill pnpm --skill turborepo`

## Agent workflow

Follow this skill for TypeScript pnpm + Turborepo workspaces. Works wherever the agent can read `package.json`. Match **Entry points**; for a new package or workspace open every **Task types** row that applies.

### Entry points

Use the first matching row; combine when the task spans types.

| Entry | When | Go to |
| --- | --- | --- |
| Workspace / new package | Init workspace, choose `apps/` vs `packages/`, add or move a package | [managing-workspace.md](./references/managing-workspace.md) |
| Cross-package import | Library or app importing another workspace package | [managing-imports.md](./references/managing-imports.md) |
| Change `exports` / scoped name | Editing a package's public surface or `@scope/` name | [managing-imports.md](./references/managing-imports.md) |
| In-package JIT alias | A library consumed as TypeScript source aliases its own internals | [managing-imports.md](./references/managing-imports.md) |
| Canonical script | Adding or renaming `typecheck`, `build`, `lint`, `test`, or `dev` | [managing-scripts.md](./references/managing-scripts.md) |
| Lookup | Known doc name or single reference | **Reference index** |

### Task types

Match every row that applies. Open every local link in **Docs** before coding.

| Task type | Docs |
| --- | --- |
| New workspace | [monorepo-contract.md](./references/monorepo-contract.md), [managing-workspace.md](./references/managing-workspace.md), [managing-scripts.md](./references/managing-scripts.md) |
| New package | [monorepo-contract.md](./references/monorepo-contract.md), [managing-workspace.md](./references/managing-workspace.md), [managing-imports.md](./references/managing-imports.md), [managing-scripts.md](./references/managing-scripts.md) |

## Reference index

### Contract

[monorepo-contract.md](./references/monorepo-contract.md) — toolchain, folder roles, scoped names, `exports`, canonical tasks, JIT vs compiled.

| Doc | When to use |
| --- | --- |
| [monorepo-contract.md](./references/monorepo-contract.md) | Toolchain, roles, names, `exports`, canonical scripts, resolve root |
| [managing-workspace.md](./references/managing-workspace.md) | Layout, globs, add package, initialize workspace |
| [managing-imports.md](./references/managing-imports.md) | Cross-package and in-package import rules |
| [managing-scripts.md](./references/managing-scripts.md) | Root vs package scripts; Turbo graph rules |
