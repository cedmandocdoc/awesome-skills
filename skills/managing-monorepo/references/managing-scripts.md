# Managing Scripts

## Overview

Wire each package script as a root runner `<dir>:<script>`.

## Prerequisites

[monorepo-contract.md](./monorepo-contract.md) — package runners, scoped names, private root.

## Guidelines

### Sync

When adding, renaming, or removing a package script:

1. Add or rename the matching root runner per **Package runners**.
2. Register `<script>` in `turbo.json` if no task exists yet — **Graph**.
3. Drop the root runner when the script is gone. Drop the turbo task when no package still defines it.

Skip `pre*` / `post*` lifecycle hooks. Group root runners by `<dir>`. Replace workspace-wide root aliases (`"build": "turbo run build"`) with per-package runners.

### Graph

Keep task logic in the package.

| Kind | `turbo.json` |
| --- | --- |
| Process that stays running | `cache: false`, `persistent: true` |
| Build artifact | `dependsOn: ["^build"]`, `outputs` matching the package |
| Needs the same task on workspace dependencies first | `dependsOn: ["^<script>"]` |
| Isolated one-shot | `{}` |

To run one script name across every package that defines it, `turbo run <script>`.

### Confirm to the user

Report runners added, renamed, or removed.

## Examples

| Path | Package `scripts` | Root runners |
| --- | --- | --- |
| `apps/web` | `dev`, `build`, `lint`, `typecheck` | `web:dev`, `web:build`, `web:lint`, `web:typecheck` |
| `apps/mobile` | `ios`, `android`, `build` | `mobile:ios`, `mobile:android`, `mobile:build` |
| `packages/db` | `start`, `reset` | `db:start`, `db:reset` |

```json
{
  "web:dev": "turbo run dev --filter=@scope/web",
  "mobile:ios": "turbo run ios --filter=@scope/mobile",
  "db:start": "turbo run start --filter=@scope/db"
}
```

## References

- [Turborepo — Configuring tasks](https://turbo.build/repo/docs/crafting-your-repository/configuring-tasks)
