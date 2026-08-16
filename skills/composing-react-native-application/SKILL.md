---
name: composing-react-native-application
id: aef3864f-fbd4-415a-8540-0e7ef0ea0f9f
description: Extends one Expo core app into product variants through declared slots (identity, home, theme, extra routes). Use when adding a variant, filling a slot, or declaring a new slot. Host toolchain wrap is how a variant that prebuilds stays runnable — not a separate purpose. Requires managing-monorepo for workspace packages and imports.
version: 1.4.0
---

# Composing React Native Application

## Overview

Extends one complete Expo **core** app into product variants through **declared slots**. Variants fill those slots; they keep the app rather than forking it. A host that prebuilds wraps the core’s toolchain factories so the filled variant can run. That wrap is host duty, not a slot.

Two unrelated apps that share a UI kit are a library plus `managing-monorepo`, not this skill.

## Dependencies

Resolve every **required** row before composing. Skill discovery and missing-skill stop text: [composition-contract.md](./references/composition-contract.md) → **Require managing-monorepo**.

| Item | Required | When | How |
| --- | --- | --- | --- |
| [managing-monorepo](https://github.com/cedmandocdoc/awesome-skills/tree/main/skills/managing-monorepo) `e0e993e7-a5f9-4bea-9923-166b503df045` | required | Always | `npx skills add cedmandocdoc/awesome-skills --skill managing-monorepo` |
| [building-react-native-application](https://github.com/cedmandocdoc/awesome-skills/tree/main/skills/building-react-native-application) `ddfed93c-f419-4c5f-8832-85acc8f85f00` | optional | Screens, `src/ui`, navigation, forms | `npx skills add cedmandocdoc/awesome-skills --skill building-react-native-application` |

Install both: `npx skills add cedmandocdoc/awesome-skills --skill composing-react-native-application --skill managing-monorepo`

## Agent workflow

Follow this skill when one Expo core app is extended into product variants through slots. Match **Entry points**. When the variant package prebuilds, [creating-variant.md](./references/creating-variant.md) points at host wrap. Core screens and `src/ui` use `building-react-native-application` when that optional skill is installed.

### Entry points

Use the first matching row; combine when the task spans types.

| Entry | When | Go to |
| --- | --- | --- |
| Fill slots / new variant | Identity, home tab, theme, extra routes | [creating-variant.md](./references/creating-variant.md) |
| New slot on the core | Product behavior every variant should be able to pass in | [creating-slot.md](./references/creating-slot.md) |
| Lookup | Known doc name or single reference | **Reference index** |

### Task types

Match every row that applies. Open every local link in **Docs** before coding.

| Task type | Docs |
| --- | --- |
| Identity-only product | [creating-variant.md](./references/creating-variant.md) |
| Swap `Main` for an existing screen | [creating-variant.md](./references/creating-variant.md) |
| New home screen or shell-only feature | [creating-variant.md](./references/creating-variant.md); also `building-react-native-application` when installed |
| Declare a new slot | [creating-slot.md](./references/creating-slot.md) |

## Reference index

### Contract

[composition-contract.md](./references/composition-contract.md) — naming, structure, slots, host toolchain, skill dependencies.

| Doc | When to use |
| --- | --- |
| [composition-contract.md](./references/composition-contract.md) | Naming, structure, product slots, kinds, dependency invoke |
| [creating-variant.md](./references/creating-variant.md) | Fill declared slots |
| [creating-slot.md](./references/creating-slot.md) | Add an extension point on the core |
| [managing-shared-config.md](./references/managing-shared-config.md) | Host wrap after filling slots (prebuild package) |
