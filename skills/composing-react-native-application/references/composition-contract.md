# Composition Contract

## Overview

Shared terms and factory surface for slot-based Expo composition. One working runtime, many products.

## Guidelines

### Terms

| Term | Meaning |
| --- | --- |
| Runtime | A complete working Expo app exported as a JIT package |
| Slot | A typed extension point the runtime declares (factory argument). Variants pass values |
| Variant | A package that fills slots |
| Host | The runnable Expo app that prebuilds. Variant and host may be the same package or split |

Composing is filling slots on one runtime. It is not sharing a UI library, copying the app and editing files, or adding a screen inside the same package with no factory.

### Product API

The runtime ships the working app (owned screens, providers, fonts, tab bar). Variants keep that app and fill slots:

| Slot | Required | Variant provides |
| --- | --- | --- |
| Identity | yes for a host | `name`, `slug`, icon, splash — config factory |
| Home (`Main` tab) | yes | Screen + tab label/icon — tabs factory |
| Theme / fonts | no | Overlays on the app factory |
| Extra routes | no | Extra tabs/stacks — factory spreads extra screens |

An icon-only host is a valid variant (identity slot only). Runtime-owned tabs and stacks are not slots.

New product behavior that is not a slot goes into the runtime (new slot) or into the variant (shell-only feature). Variants import the runtime via `exports`. Importing the runtime’s `src/` by path is the exception to catch.

### Factory surface

| Kind | Examples | Lives on |
| --- | --- | --- |
| App | `createRuntimeApp(Root, options?)` | Runtime package root export |
| Identity | `createRuntimeConfig({ name, slug, icon, … })` | `exports` subpath e.g. `@scope/runtime/config` |
| Navigation | `createRuntimeTabsNavigator`, `createRuntimeStackNavigator` | Runtime package root export |
| Toolchain | `createRuntimeBabelConfig`, `createRuntimeMetroConfig`, `createRuntimeEslintConfig`, Tailwind preset | `exports` subpaths |

Hosts wrap toolchain factories. Copying those files into the host is not the pattern.

### Require managing-monorepo

Named companion (hard). Discover by frontmatter `name` only.

1. Search skill roots for `managing-monorepo/SKILL.md` (`.agents/skills/`, `.cursor/skills/`, `.claude/skills/`, and other agent skill directories).
2. Accept when frontmatter `name` is `managing-monorepo`.
3. If missing → stop:

```text
Install managing-monorepo before composing Expo variants (exports and cross-package imports require it).
```

4. Open that skill’s `SKILL.md`. Follow its entry points by name for `exports` and imports.

### Optional building-react-native-application

Discover by `name` when the variant writes screens, `src/ui`, navigation internals, or forms. If present, open that skill’s `SKILL.md` and follow its task types. If absent, still compose slots; write screens in the variant package.
