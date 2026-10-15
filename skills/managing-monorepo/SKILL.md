---
name: managing-monorepo
id: e0e993e7-a5f9-4bea-9923-166b503df045
description: Defines the workspace contract for a TypeScript monorepo with pnpm and Turborepo — folder roles (`apps/` vs `packages/`), cross-package imports (`exports`, `workspace:*`), package runners (`<dir>:<script>`, e.g. `pnpm web:dev`), and root `.gitignore`. Use in a workspace with `pnpm-workspace.yaml` and `turbo.json`, or when initializing one, for adding a package, choosing apps vs packages, wiring an import, adding a package script or root runner, or initializing `.gitignore`.
version: 2.3.1
---

# Managing Monorepo

## Setup

| Item | Kind | Required | When | Done when | How |
| --- | --- | --- | --- | --- | --- |
| [pnpm](https://github.com/antfu/skills/tree/main/skills/pnpm) skill | user | required | All | Found per [monorepo-contract.md](references/monorepo-contract.md) → **Discovering project skills** | `npx skills add antfu/skills --skill pnpm` |
| [turborepo](https://github.com/vercel/turborepo/tree/main/skills/turborepo) skill | user | required | All | Found per [monorepo-contract.md](references/monorepo-contract.md) → **Discovering project skills** | `npx skills add vercel/turborepo --skill turborepo` |
| pnpm | user | required | All | `pnpm --version` succeeds | https://pnpm.io/installation |
| Workspace | static | required | All | [monorepo-contract.md](references/monorepo-contract.md) → **Resolve workspace root** finds a root | At the repository root, per [managing-workspace.md](references/managing-workspace.md) → **Initialize workspace** |
| Standing rule | auto | required | Set up, or a request whose Workspace row ran | Root `AGENTS.md` has the line | Add `- This workspace follows managing-monorepo; load it before adding a package, a cross-package import, or a package script.` to root `AGENTS.md` (create when missing) and to root `CLAUDE.md` when it exists without importing `AGENTS.md`; skip a file that has it |

Install both skills: `npx skills add antfu/skills --skill pnpm && npx skills add vercel/turborepo --skill turborepo`

## Workflow

1. **Setup** — for each **Setup** row whose When covers the request, in order: Done when holds → skip; `user` → stop and print its How when required, continue without it when optional; `ask` → fill what the request answers, ask the rest together in one message, record each answer; `auto` and `static` → run.
2. **Contract** — read [monorepo-contract.md](references/monorepo-contract.md).
3. **Recipe** — match one **Recipes** row; open every doc in its Read column.

## Recipes

| Intent | Example phrasing | Read |
| --- | --- | --- |
| Set up | "Set up the monorepo", "Initialize a pnpm + Turborepo workspace", "Is managing-monorepo ready?" | **Setup** — run Workflow step 1 for every row, then report each row's state |
| Add or move a package | "Add a UI kit package", "Does this go in apps or packages?", "Move packages/api" | [managing-workspace.md](references/managing-workspace.md), [managing-imports.md](references/managing-imports.md), [managing-scripts.md](references/managing-scripts.md) |
| Cross-package import | "Use @scope/ui in the web app", "Change the exports of @scope/ui", "Alias the library's internals" | [managing-imports.md](references/managing-imports.md) |
| Package runner | "Add a test script to packages/db", "Wire `pnpm web:dev`" | [managing-scripts.md](references/managing-scripts.md) |
| Gitignore | "Initialize .gitignore", "Fix the root .gitignore" | [managing-workspace.md](references/managing-workspace.md) |
