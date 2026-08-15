---
name: composing-react-native-application
id: aef3864f-fbd4-415a-8540-0e7ef0ea0f9f
description: Composes product variants from one complete Expo runtime via declared slots (identity, home, theme) and shared toolchain factories (Metro, Babel, ESLint, Tailwind, app.config). Use when adding a product variant, filling or declaring slots, or wiring a host that reuses the runtime’s config. Requires managing-monorepo for workspace packages and imports.
version: 1.1.0
---

# Composing React Native Application

## Overview

A complete Expo app ships as a JIT runtime package. Variants fill **declared slots**; they keep that app rather than forking it. Hosts wrap the runtime’s toolchain factories (Babel, Metro, ESLint, Tailwind, `app.config`) instead of copying config files. Dependency [`managing-monorepo`](https://github.com/cedmandocdoc/awesome-skills/tree/main/skills/managing-monorepo) owns workspace layout, `exports`, and cross-package imports — the runtime lives in `packages/`; variants import it by package name and `exports` subpaths.

Two unrelated apps that share a UI kit are a library plus `managing-monorepo`, not this skill.

## Dependencies

Resolve every **required** row before composing. Skill discovery and missing-skill stop text: [composition-contract.md](./references/composition-contract.md) → **Require managing-monorepo**.

| Item | Required | When | How |
| --- | --- | --- | --- |
| [managing-monorepo](https://github.com/cedmandocdoc/awesome-skills/tree/main/skills/managing-monorepo) `e0e993e7-a5f9-4bea-9923-166b503df045` | required | Always | `npx skills add cedmandocdoc/awesome-skills --skill managing-monorepo` |
| [building-react-native-application](https://github.com/cedmandocdoc/awesome-skills/tree/main/skills/building-react-native-application) `ddfed93c-f419-4c5f-8832-85acc8f85f00` | optional | Screens, `src/ui`, navigation, forms | `npx skills add cedmandocdoc/awesome-skills --skill building-react-native-application` |

Install both: `npx skills add cedmandocdoc/awesome-skills --skill composing-react-native-application --skill managing-monorepo`

## Agent workflow

Follow this skill when one Expo runtime is extended into product variants, or when a host reuses the runtime’s toolchain. Match **Entry points**. Runtime-internal UI uses `building-react-native-application` when that optional skill dependency is installed.

### Entry points

Use the first matching row; combine when the task spans types.

| Entry | When | Go to |
| --- | --- | --- |
| Fill slots / new variant | Identity, home tab, theme, extra routes | [creating-variant.md](./references/creating-variant.md) |
| New slot on the runtime | Product behavior every variant should be able to pass in | [creating-slot.md](./references/creating-slot.md) |
| Share toolchain / host config | Metro, Babel, ESLint, Tailwind, `app.config`, native deps | [managing-shared-config.md](./references/managing-shared-config.md) |
| Lookup | Known doc name or single reference | **Reference index** |

### Task types

Match every row that applies. Open every local link in **Docs** before coding.

| Task type | Docs |
| --- | --- |
| Identity-only product | [creating-variant.md](./references/creating-variant.md), [managing-shared-config.md](./references/managing-shared-config.md) |
| Swap `Main` for an existing screen | [creating-variant.md](./references/creating-variant.md) |
| New home screen or shell-only feature | [creating-variant.md](./references/creating-variant.md); also `building-react-native-application` when installed |
| Declare a new slot | [creating-slot.md](./references/creating-slot.md) |
| Wrap Metro / Babel / ESLint / Tailwind / `app.config` | [managing-shared-config.md](./references/managing-shared-config.md) |

## Reference index

### Contract

[composition-contract.md](./references/composition-contract.md) — runtime, slot, variant, host; skill dependencies; factory surface.

| Doc | When to use |
| --- | --- |
| [composition-contract.md](./references/composition-contract.md) | Terms, what composing is, dependency invoke |
| [creating-variant.md](./references/creating-variant.md) | Fill declared slots |
| [creating-slot.md](./references/creating-slot.md) | Add an extension point on the runtime |
| [managing-shared-config.md](./references/managing-shared-config.md) | Toolchain factories, host wrap, native deps |
