---
name: composing-react-native-application
description: Composes product variants from one complete Expo runtime via declared slots (identity, home, theme) and shared toolchain factories (Metro, Babel, ESLint, Tailwind, app.config). Use when adding a product variant, filling or declaring slots, or wiring a host that reuses the runtime’s config. Requires managing-monorepo for cross-package imports.
version: 1.0.0
---

# Composing React Native Application

## Overview

A complete Expo app ships as a JIT runtime package. Variants fill **declared slots**; they keep that app rather than forking it. Hosts wrap the runtime’s toolchain factories (Babel, Metro, ESLint, Tailwind, `app.config`) instead of copying config files. Named companion `managing-monorepo` owns `exports` and cross-package imports — variants import the runtime by package name and `exports` subpaths.

## Agent workflow

Follow this skill when one Expo runtime is extended into product variants, or when a host reuses the runtime’s toolchain. Discover `managing-monorepo` (hard); open that skill’s `SKILL.md` and follow its entry points by name for `exports` and imports. Match **Entry points**. When the variant writes screens, `src/ui`, navigation internals, or forms, also discover `building-react-native-application` (optional). Runtime-internal UI uses that sibling when it is installed.

Two unrelated apps that share a UI kit are a library plus `managing-monorepo`, not this skill.

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

[composition-contract.md](./references/composition-contract.md) — runtime, slot, variant, host; companion require; factory surface.

| Doc | When to use |
| --- | --- |
| [composition-contract.md](./references/composition-contract.md) | Terms, what composing is, companion invoke |
| [creating-variant.md](./references/creating-variant.md) | Fill declared slots |
| [creating-slot.md](./references/creating-slot.md) | Add an extension point on the runtime |
| [managing-shared-config.md](./references/managing-shared-config.md) | Toolchain factories, host wrap, native deps |
