# Creating Component

## Overview

Start here for **any** component work. This guide routes you to the right deep-dive doc. Read the decision tree first, then open **only** the linked creation guide for your case.

## Decision tree

| You are building… | Go to |
| --- | --- |
| Shared UI primitive (`Button`, `Input`, `Dialog`…) | [creating-ui-component.md](./creating-ui-component.md) |
| Domain UI block (`CartItemRow`, `CheckoutSummary`…) | [creating-feature-component.md](./creating-feature-component.md) |
| Route-facing **page** or **layout** for a feature | [creating-screen-component.md](./creating-screen-component.md) → register in [creating-route-component.md](./creating-route-component.md) |
| Navigation component (`AppShell`, `AppSidebar`…) | [creating-navigation-component.md](./creating-navigation-component.md) → wire in [creating-route-component.md](./creating-route-component.md) |
| Route layer file under `src/routes/` | [creating-route-component.md](./creating-route-component.md) |
| Pre-bound form field / form shell (`*Field`, `FieldShell`) | [creating-form-component.md](./creating-form-component.md) |

**Already built but wrong layer?** Re-run the tree in [Recategorizing](#recategorizing-an-existing-component).

## Placement

| Kind | Location |
| --- | --- |
| Screen / page component | `src/features/<feature-name>/components/*Page.tsx` |
| Feature components | `src/features/<feature-name>/components/` |
| Navigation components | `src/features/navigation/components/` |
| Navigation hooks | `src/features/navigation/hooks/` |
| Route layer | `src/routes/` |
| Shared UI primitives | `src/ui/` (flat unless a subsystem owns a folder) |
| Composition roots | `src/ui/Form/` when multiple related files belong together |
| Design tokens / theme | `src/theme.css`; root `global.css` imports Tailwind + theme |
| Class merging (`cx`) | `class-variance-authority` (with `cva`) |

- Put product rules and domain behavior in `src/features/<feature-name>/` — queries, stores, and domain logic in `hooks/` per [managing-state.md](./managing-state.md).
- Put reusable navigation components in `src/features/navigation/`.
- Put reusable, presentation-only **UI primitives** in `src/ui/`.
- Put route registration and wiring in `src/routes/`.
- Import primitives with `@/ui/<file>`; use relative imports inside `src/ui/`.

## Shared rules

- Use functional components and named exports.
- Prefer `interface` for props.
- Export **one component per file**; name the file after the export (`ProfileCard.tsx` → `ProfileCard`).
- Keep every component at **200 lines or fewer**; split into smaller parts before implementing.
- Prefer compound parts (`Button`, `ButtonText`, `ButtonIcon`) over `typeof children` switches.
- UI primitives (`src/ui/`) are **presentation-only** — no business logic, data fetching, mutations, or routing decisions.

## Naming (baseline)

- PascalCase exports; singular nouns (`UserCard`, not `UsersCard`).
- Match file name to export name.
- **`src/ui/`** — generic names: `Button`, `TextInput`, `Dialog`.
- **`src/features/*/components/`** — feature-prefixed when domain-specific: `CheckoutButton`, `CartItemRow`.
- **`src/features/*/components/*Page.tsx`** — route-facing pages: `WorkshopListPage`, `SettingsPage`.
- Use `<Feature><Entity><Type>` for feature components (`AuthLoginForm`, `OrderSummaryCard`).
- Use props or CVA variants for state — not `PrimaryButton` or `DisabledInput`.
- Related parts share a prefix: `CartItem`, `CartItemImage`, `CartItemPrice`.

Each creation guide adds type-specific naming rules.

## Recategorizing an existing component

When reuse grows, re-run the decision tree:

- **Presentation-only and cross-feature** → move to `src/ui/` per [creating-ui-component.md](./creating-ui-component.md).
- **Business logic, data access, or stores in `src/ui/`** → extract logic to feature `hooks/` per [managing-state.md](./managing-state.md); leave a presentation-only primitive.
- **Navigation components reused across routes** → move to `src/features/navigation/` per [creating-navigation-component.md](./creating-navigation-component.md).
- **Domain behavior used across routes** → extract to a new feature module per [creating-feature.md](./creating-feature.md).
- **Still tied to one route flow** → keep in the current feature.
- **Page at feature root** → move to `src/features/<feature>/components/*Page.tsx` per [creating-screen-component.md](./creating-screen-component.md).

Update folder placement **and** the feature barrel export contract when moving code.

## Related

- [managing-wrapper-components.md](./managing-wrapper-components.md) — shallow wrappers and `cx` merging
- [managing-state.md](./managing-state.md) — queries, stores, and where feature logic lives
- [creating-feature.md](./creating-feature.md) — feature module structure, folder layout, and barrels
- [creating-route-component.md](./creating-route-component.md) — route layer wiring
