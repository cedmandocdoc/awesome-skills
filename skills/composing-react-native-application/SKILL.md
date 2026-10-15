---
name: composing-react-native-application
id: aef3864f-fbd4-415a-8540-0e7ef0ea0f9f
description: Extends one Expo core app into product variants through declared slots (identity, home, theme, extra routes). Use when adding a variant to, filling a slot of, or declaring a new slot on an Expo core app that exports app and slot factories. Host toolchain wrap is how a variant that prebuilds stays runnable — not a separate purpose. Requires managing-monorepo for workspace packages and imports.
version: 1.6.1
---

# Composing React Native Application

## Setup

| Item | Kind | Required | When | Done when | How |
| --- | --- | --- | --- | --- | --- |
| [managing-monorepo](https://github.com/cedmandocdoc/awesome-skills/tree/main/skills/managing-monorepo) `e0e993e7-a5f9-4bea-9923-166b503df045` | user | required | All | Found per [composition-contract.md](references/composition-contract.md) → **Discovering project skills** | `npx skills add cedmandocdoc/awesome-skills --skill managing-monorepo` |
| [pnpm](https://github.com/antfu/skills/tree/main/skills/pnpm) skill | user | required | via managing-monorepo | Found per [composition-contract.md](references/composition-contract.md) → **Discovering project skills** | `npx skills add antfu/skills --skill pnpm` |
| [turborepo](https://github.com/antfu/skills/tree/main/skills/turborepo) skill | user | required | via managing-monorepo | Found per [composition-contract.md](references/composition-contract.md) → **Discovering project skills** | `npx skills add antfu/skills --skill turborepo` |
| pnpm | user | required | via managing-monorepo | `pnpm --version` succeeds | https://pnpm.io/installation |
| [building-react-native-application](https://github.com/cedmandocdoc/awesome-skills/tree/main/skills/building-react-native-application) `ddfed93c-f419-4c5f-8832-85acc8f85f00` | user | optional | Create a variant that writes screens, `src/ui`, navigation, or forms | Found per [composition-contract.md](references/composition-contract.md) → **Discovering project skills** | `npx skills add cedmandocdoc/awesome-skills --skill building-react-native-application` |
| Standing rule | auto | required | Create a variant | Root `AGENTS.md` has the line | Add `` - Variants of `<core>` follow composing-react-native-application; load it before adding a variant or slot. `` to root `AGENTS.md` (create when missing) and to root `CLAUDE.md` when it exists without importing `AGENTS.md`; skip a file that has it |

Install the required skills: `npx skills add cedmandocdoc/awesome-skills --skill composing-react-native-application --skill managing-monorepo && npx skills add antfu/skills --skill pnpm --skill turborepo`

## Workflow

1. **Setup** — for each **Setup** row whose When covers the request, in order: Done when holds → skip; `user` → stop and print its How when required, continue without it when optional; `ask` → fill what the request answers, ask the rest together in one message, record each answer; `auto` and `static` → run.
2. **Contract** — read [composition-contract.md](references/composition-contract.md).
3. **Recipe** — match one **Recipes** row; open every doc in its Read column.

## Recipes

| Intent | Example phrasing | Read |
| --- | --- | --- |
| Set up | "Set up composing-react-native-application", "Is composing-react-native-application ready?" | **Setup** — run Workflow step 1 for every row, then report each row's state |
| Create a variant | "Add a shop variant of the core", "Swap the home tab for the catalog screen", "An icon-only product", "Add an extra stack route" | [creating-variant.md](references/creating-variant.md) |
| Declare a slot | "Let every variant pass its own onboarding", "Add a slot to the core" | [creating-slot.md](references/creating-slot.md) |
