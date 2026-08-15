# Monorepo Contract

## Overview

Shared layout and field meanings for all `managing-monorepo` workflows. Requires TypeScript, pnpm workspaces, and Turborepo.

## Guidelines

### Require pnpm and turborepo

Required skill dependencies. Discover by `name` (these skills publish no `id`).

| `name` | Owns | Source | Install |
| --- | --- | --- | --- |
| `pnpm` | Catalogs, CLI, workspace protocol | https://github.com/antfu/skills/tree/main/skills/pnpm | `npx skills add antfu/skills --skill pnpm` |
| `turborepo` | Remote cache, `--filter` / `--affected`, env hashing, CI | https://github.com/antfu/skills/tree/main/skills/turborepo | `npx skills add antfu/skills --skill turborepo` |

1. Discover and accept per **Discovering project skills** (`name` from the table).
2. If a required row is missing → stop. Print that row’s Install and Source:

```text
Install pnpm before managing-monorepo (catalogs, CLI, and workspace protocol require it).

npx skills add antfu/skills --skill pnpm

Source: https://github.com/antfu/skills/tree/main/skills/pnpm
```

```text
Install turborepo before managing-monorepo (remote cache, --filter / --affected, env hashing, and CI require it).

npx skills add antfu/skills --skill turborepo

Source: https://github.com/antfu/skills/tree/main/skills/turborepo
```

3. Open that skill’s `SKILL.md`. Follow it by intent for the **Owns** column.

### Discovering project skills

Each skill is `<skill-name>/SKILL.md`.

1. **Explicit pointers** — `AGENTS.md`, the user request, `@`-mentioned skills
2. **Project skill roots** — glob `<root>/<skill-name>/SKILL.md`:

| Root | Tool / environment |
| --- | --- |
| `.agents/skills/` | Agent Skills (portable / multi-agent) |
| `.claude/skills/` | Claude Code |
| `.cursor/skills/` | Cursor |
| `.codex/skills/` | OpenAI Codex |
| `.windsurf/skills/` | Windsurf |
| `.gemini/skills/` | Gemini CLI |
| `.github/skills/` | GitHub Copilot (project skills) |
| `.agent/skills/` | Google Antigravity |
| `.cline/skills/` | Cline |
| `.continue/skills/` | Continue |
| `.roo/skills/` | Roo Code |

3. **User-level skill roots** — same folder names under `~/` (for example `~/.cursor/skills/`, `~/.agents/skills/`, `~/.claude/skills/`). Prefer a project copy over a user copy of the same `name`.
4. **Custom roots** — paths named in `AGENTS.md` or by the user

**Deduplicate** — one copy per skill `name`; prefer project roots over user-level.

**Accept a dependency skill** when frontmatter `name` matches the row.

### Resolve workspace root

A folder with a private root `package.json`, `pnpm-workspace.yaml`, and `turbo.json`. Ask when multiple candidates exist.

### Folder roles

| Role | Lives in | Others depend on it? | Examples |
| --- | --- | --- | --- |
| App / host | `apps/` | No | Vite SPA, Expo host, docs site |
| Library | `packages/` | Yes | UI kit, API client, utils |
| Imported runtime | `packages/` | Yes | Complete Expo runtime that variants import |
| Config package | `packages/` | Yes | `typescript-config`, `eslint-config` |

Root is the orchestrator: no app `src/`. Each package declares its own dependencies. Pin `packageManager` to the repo’s pnpm version.

### Scoped names

| Rule | Detail |
| --- | --- |
| Form | `@scope/<dir>` aligned with the directory (`packages/ui` → `@scope/ui`) |
| Internal packages | `"private": true`, consumed with `"workspace:*"` |
| Public surface | `package.json` `exports` subpaths, not a giant barrel |

### Canonical tasks

Universal names every participating package defines: `typecheck`, `build`, `lint`, `test`, `dev`.

Root `package.json` is private. Its scripts only delegate: `turbo run <task>`.

Framework tasks (`ios`, `android`, `prebuild`, Vite `preview`) stay in stack skills.

### JIT vs compiled

Consumption mode does not change folder role.

| Kind | In-package alias |
| --- | --- |
| JIT (consumed as TypeScript source) | `package.json` `"imports": { "#*": "./src/*" }` |
| Compiled (`dist/`) | Relative imports inside the package; publish `exports` to `dist` |

`compilerOptions.paths` is neither a cross-package primitive nor the JIT in-package alias.

### Out of scope

- Compiler-option catalogs (tsconfig contents)
- Expo / Metro / Vite / NativeWind
- Slot-based Expo variants and host toolchain
- pnpm catalogs and CLI
- Turbo remote cache, `--affected`, env hashing
