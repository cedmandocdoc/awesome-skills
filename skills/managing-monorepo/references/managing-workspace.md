# Managing Workspace

## Overview

Place packages, add a package, or initialize a pnpm + Turborepo TypeScript workspace.

## Prerequisites

- [monorepo-contract.md](./monorepo-contract.md) — toolchain, folder roles, scoped names, private root
- [managing-scripts.md](./managing-scripts.md) when writing root `turbo.json` or canonical scripts

## Guidelines

### Decision tree

| Situation | Go to |
| --- | --- |
| No workspace yet | **Setup** |
| Add or move a package | **Add package** |
| Where does this live? | Contract **Folder roles**, then **Tree** |

### Tree

```
.
├── apps/
│   └── <app>/
├── packages/
│   └── <lib>/
├── package.json
├── pnpm-workspace.yaml
├── pnpm-lock.yaml
└── turbo.json
```

### Workspace membership

```yaml
packages:
  - "apps/*"
  - "packages/*"
```

When nesting (`packages/config/*`), add that glob.

### Dependency direction

`apps/` → `packages/` → `packages/`. Apps are leaves. A runnable product that other packages import is a library under `packages/`.

### Add package

1. Pick the role from the contract → directory under `apps/` or `packages/`.
2. Name the package `@scope/<dir>`.
3. Set `"private": true`. Consumers depend with `"workspace:*"`.
4. Public surface via `exports` — [managing-imports.md](./managing-imports.md).
5. Canonical scripts — [managing-scripts.md](./managing-scripts.md).
6. Confirm `pnpm-workspace.yaml` covers the folder.

### Confirm to the user

Report the package path, scoped name, and role.

## Setup

### Initialize workspace

1. Private root `package.json` — scripts only `turbo run <task>` ([managing-scripts.md](./managing-scripts.md)).
2. `pnpm-workspace.yaml` with `apps/*` and `packages/*`.
3. `turbo.json` with canonical tasks ([managing-scripts.md](./managing-scripts.md)).
4. Create `apps/` and `packages/`.
5. Pin `packageManager` to the repo’s pnpm version.

### Confirm to the user

Report the workspace root and the files created.

## References

- [pnpm workspaces](https://pnpm.io/workspaces)
- [Turborepo — Structuring a repository](https://turbo.build/repo/docs/crafting-your-repository/structuring-a-repository)
