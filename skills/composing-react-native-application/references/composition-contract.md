# Composition Contract

## Overview

Slot structure for composing product variants from one Expo runtime. One working app, many products; extension only through declared slots.

## Guidelines

### Structure

| Role | Does |
| --- | --- |
| Runtime | Owns the working app; declares slots (typed factory arguments with defaults); stays runnable |
| Variant | Fills slots. Does not patch runtime `src/` |
| Host | Prebuilds and runs the filled app. Wraps toolchain factories. Not a slot |

Variant and host may be the same package or split.

```text
packages/runtime/     # complete Expo app; declares slots; fills defaults
packages/shop/        # variant library; fills Main
apps/shop-host/       # thin host; identity + wrap; re-exports @scope/shop App
apps/marketplace/     # variant and host in one package
```

Composing is filling slots on one runtime. It is not sharing a UI library, copying the app and editing files, or adding a screen inside the same package with no factory.

### Terms

| Term | Meaning |
| --- | --- |
| Runtime | A complete working Expo app exported as a JIT package |
| Slot | A typed extension point the runtime declares (factory argument). Variants pass values |
| Variant | A package that fills slots |
| Host | The runnable Expo app that prebuilds |

### Product slots

The runtime ships the working app (owned screens, providers, fonts, tab bar). Variants keep that app and fill slots:

| Slot | Required | Variant provides |
| --- | --- | --- |
| Identity | yes for a host | `name`, `slug`, icon, splash — `createRuntimeConfig` |
| Home (`Main` tab) | yes | Screen + tab label/icon — tabs factory |
| Theme / fonts | no | Overlays on `createRuntimeApp` |
| Extra routes | no | Extra tabs/stacks — factory spreads extra screens |

An icon-only host is a valid variant (identity slot only).

New product behavior that is not a slot goes into the runtime (new slot) or into the variant (shell-only feature). Variants import the runtime via `exports`. Importing the runtime’s `src/` by path is the exception to catch.

### Slot kinds

| Presence | Rule |
| --- | --- |
| required | Every host fills it. The runtime app fills it too so the runtime stays runnable |
| optional | Runtime default. Variant overrides when the product differs |

| Shape | Rule |
| --- | --- |
| closed | Named field on the factory config |
| open | Spread `Record<string, …>` — extra tabs/stacks only |

### Not slots

| Leave on | Examples |
| --- | --- |
| Runtime | Owned tabs, stacks, providers, fonts, chrome |
| Host wrap | Babel, Metro, ESLint, Tailwind, `global.css` |

### Product factories

| Concern | Factory | Lives on |
| --- | --- | --- |
| App shell | `createRuntimeApp(Root, options?)` | Runtime package root export |
| Identity | `createRuntimeConfig({ name, slug, icon, … })` | `exports` subpath e.g. `@scope/runtime/config` |
| Home / extra tabs | `createRuntimeTabsNavigator` | Runtime package root export |
| Extra stacks | `createRuntimeStackNavigator` | Runtime package root export |

### Host toolchain

Hosts wrap these factories. Procedure: [managing-shared-config.md](./managing-shared-config.md).

| Factory | Lives on |
| --- | --- |
| Babel, Metro, ESLint, Tailwind preset | `exports` subpaths |
| `global.css` | `exports` subpath |

### Require managing-monorepo

Required skill dependency. [`managing-monorepo`](https://github.com/cedmandocdoc/awesome-skills/tree/main/skills/managing-monorepo) owns workspace layout, `exports`, and cross-package imports.

| Field | Value |
| --- | --- |
| `name` | `managing-monorepo` |
| `id` | `e0e993e7-a5f9-4bea-9923-166b503df045` |
| Source | https://github.com/cedmandocdoc/awesome-skills/tree/main/skills/managing-monorepo |
| Install | `npx skills add cedmandocdoc/awesome-skills --skill managing-monorepo` |
| With this skill | `npx skills add cedmandocdoc/awesome-skills --skill composing-react-native-application --skill managing-monorepo` |

1. Discover skills per **Discovering project skills**.
2. Accept a candidate `SKILL.md` when `name` is `managing-monorepo` **and** `id` is `e0e993e7-a5f9-4bea-9923-166b503df045`. Unique `name` match with no `id` still counts (legacy install). Skip when `name` matches but `id` is present and different.
3. If missing → stop:

```text
Install managing-monorepo before composing Expo variants (workspace packages, exports, and imports require it).

npx skills add cedmandocdoc/awesome-skills --skill managing-monorepo

Source: https://github.com/cedmandocdoc/awesome-skills/tree/main/skills/managing-monorepo
Id: e0e993e7-a5f9-4bea-9923-166b503df045
```

4. Open that skill’s `SKILL.md`. Follow its entry points by name for workspace placement, `exports`, and imports.

### Optional building-react-native-application

| Field | Value |
| --- | --- |
| `name` | `building-react-native-application` |
| `id` | `ddfed93c-f419-4c5f-8832-85acc8f85f00` |
| Source | https://github.com/cedmandocdoc/awesome-skills/tree/main/skills/building-react-native-application |
| Install | `npx skills add cedmandocdoc/awesome-skills --skill building-react-native-application` |

Discover when the variant writes screens, `src/ui`, navigation internals, or forms. Accept `name` + `id` (legacy unique `name` with no `id` still counts). If present, open that skill’s `SKILL.md` and follow its task types. If absent, still compose slots; write screens in the variant package.

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

3. **User-level skill roots** — same folder names under `~/` (for example `~/.cursor/skills/`, `~/.agents/skills/`, `~/.claude/skills/`). Use when the skill is not in a project root.
4. **Custom roots** — paths named in `AGENTS.md` or by the user

**Deduplicate** — one copy per skill `id` (then `name`); prefer project roots over user-level.

**Accept a dependency skill** when frontmatter `name` **and** `id` match. Unique `name` with no `id` still counts (legacy install). Skip when `name` matches but `id` is present and different.
