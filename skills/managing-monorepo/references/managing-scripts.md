# Managing Scripts

## Overview

Wire each package script as a root runner `<dir>:<script>`, through Turbo only when Turbo adds caching or ordering.

## Prerequisites

[monorepo-contract.md](./monorepo-contract.md) — package runners, scoped names, private root.

## Guidelines

### Sync

When adding, renaming, or removing a package script:

1. Classify the script per **Graph**.
2. Add or rename the matching root runner per **Package runners**, with the body for its class.
3. Register a Turbo task in `turbo.json` when none exists yet.
4. Drop the root runner when the script is gone. Drop the turbo task when no package still runs it as a Turbo task.

Skip `pre*` / `post*` lifecycle hooks. Group root runners by `<dir>`. Replace workspace-wide root aliases (`"build": "turbo run build"`) with per-package runners.

### Graph

Keep task logic in the package. A script is a **Turbo task** when its result can be cached or it needs work on workspace dependencies first.

| Kind | Runner body | `turbo.json` |
| --- | --- | --- |
| Build artifact | `turbo run` | `dependsOn: ["^build"]`, `outputs` matching the package |
| Deterministic check (typecheck, test, lint) | `turbo run` | `{}`, or `dependsOn: ["^<script>"]` when dependencies run it first |
| Needs a task on workspace dependencies first | `turbo run` | `dependsOn: ["^<task>"]`; add `cache: false` when the result is not cacheable, `persistent: true` when the process stays running |
| Anything else — dev server, preview, local services, database or deploy side effects, generators, E2E against a live stack | `pnpm --filter` | none |

To run one Turbo task across every package that defines it, `pnpm turbo run <script>`.

### Confirm to the user

Report runners added, renamed, or removed, and turbo tasks added or dropped.

## Examples

| Path | Package `scripts` | Root runners |
| --- | --- | --- |
| `apps/web` | `dev`, `build`, `lint`, `typecheck` | `web:dev`, `web:build`, `web:lint`, `web:typecheck` |
| `apps/mobile` | `ios`, `android`, `build` | `mobile:ios`, `mobile:android`, `mobile:build` |
| `packages/db` | `start`, `reset` | `db:start`, `db:reset` |

```json
{
  "web:dev": "pnpm --filter @scope/web dev",
  "web:build": "turbo run build --filter=@scope/web",
  "web:typecheck": "turbo run typecheck --filter=@scope/web",
  "mobile:ios": "pnpm --filter @scope/mobile ios",
  "db:start": "pnpm --filter @scope/db start"
}
```

## References

- [Turborepo — Configuring tasks](https://turbo.build/repo/docs/crafting-your-repository/configuring-tasks)
- [pnpm — Filtering](https://pnpm.io/filtering)
