# Composition Contract

## Overview

Slot structure for composing product variants from one Expo core. One working app, many products; extension only through declared slots.

## Guidelines

### Naming

| Thing | Rule |
| --- | --- |
| Role | **Core** — complete Expo app; declares slots; stays runnable |
| Package dir / npm name | Product name, default `core` / `@scope/core`. `@scope/<dir>` aligned with the folder |
| Expo identity | Product `name` / `slug`. Never the role word |
| Task / phase slugs | Product or work, not the role word |

Runtime = Core.

### Structure

| Role | Does |
| --- | --- |
| Core | Owns the working app; declares slots (typed factory arguments with defaults); stays runnable |
| Variant | Fills slots. Does not patch core `src/` |
| Host | Prebuilds and runs the filled app. Wraps toolchain factories. Not a slot |

Variant and host may be the same package or split.

```text
packages/core/          # complete Expo app; declares slots; fills defaults
packages/shop/          # variant library
apps/shop-host/         # thin host
apps/marketplace/       # variant + host
```

Composing is filling slots on one core. It is not sharing a UI library, copying the app and editing files, or adding a screen inside the same package with no factory.

### Terms

| Term | Meaning |
| --- | --- |
| Core | A complete working Expo app exported as a JIT package |
| Slot | A typed extension point the core declares (factory argument). Variants pass values |
| Variant | A package that fills slots |
| Host | The runnable Expo app that prebuilds |

### Product slots

The core ships the working app (owned screens, providers, fonts, tab bar). Variants keep that app and fill slots:

| Slot | Required | Variant provides |
| --- | --- | --- |
| Identity | yes for a host | `name`, `slug`, icon, splash — `createConfig` |
| Home (`Main` tab) | yes | Screen + tab label/icon — tabs factory |
| Theme / fonts | no | Overlays on `createApp` |
| Extra routes | no | Extra tabs/stacks — factory spreads extra screens |

An icon-only host is a valid variant (identity slot only).

New product behavior that is not a slot goes into the core (new slot) or into the variant (shell-only feature). Variants import the core via `exports`. Importing the core’s `src/` by path is the exception to catch.

### Slot kinds

| Presence | Rule |
| --- | --- |
| required | Every host fills it. The core app fills it too so the core stays runnable |
| optional | Core default. Variant overrides when the product differs |

| Shape | Rule |
| --- | --- |
| closed | Named field on the factory config |
| open | Spread `Record<string, …>` — extra tabs/stacks only |

### Not slots

| Leave on | Examples |
| --- | --- |
| Core | Owned tabs, stacks, providers, fonts, chrome |
| Host wrap | Babel, Metro, ESLint, Tailwind, `global.css` |

### Product factories

| Concern | Factory | Lives on |
| --- | --- | --- |
| App shell | `createApp(Root, options?)` | Core package root export |
| Identity | `createConfig({ name, slug, icon, … })` | `exports` subpath e.g. `@scope/core/config` |
| Home / extra tabs | `createTabsNavigator` | Core package root export |
| Extra stacks | `createStackNavigator` | Core package root export |

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
