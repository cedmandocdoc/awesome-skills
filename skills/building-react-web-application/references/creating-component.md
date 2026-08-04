# Creating Component

## Overview

Start here for any component work. Read the decision tree, then open the linked guide for the matching case.

## Guidelines

### Decision tree

| You are building… | Go to |
| --- | --- |
| Shared UI primitive (`Button`, `Input`, `Dialog`…) | [creating-ui-component.md](./creating-ui-component.md) |
| Domain UI block (`CartItemRow`, `CheckoutSummary`…) | [creating-feature-component.md](./creating-feature-component.md) |
| Route-facing page or layout for a feature | [creating-screen-component.md](./creating-screen-component.md) → register in [creating-route-component.md](./creating-route-component.md) |
| Navigation component (`AppShell`, `AppSidebar`…) | [creating-navigation-component.md](./creating-navigation-component.md) → wire in [creating-route-component.md](./creating-route-component.md) |
| Route layer file under `src/routes/` | [creating-route-component.md](./creating-route-component.md) |
| Pre-bound form field / form shell | [creating-form-component.md](./creating-form-component.md) |

Already built but wrong layer? See [Recategorizing](#recategorizing-an-existing-component).

### Placement

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

- Product rules and domain behavior live in `src/features/<feature-name>/` — queries, stores, and domain logic in `hooks/` per [managing-state.md](./managing-state.md).
- Reusable navigation components live in `src/features/navigation/`.
- Presentation-only UI primitives live in `src/ui/`.
- Route registration and wiring live in `src/routes/`.
- Import primitives with `@/ui/<file>`; use relative imports inside `src/ui/`.

### Shared rules

- Functional components and named exports.
- `interface` for props.
- One component per file; file name matches the export (`ProfileCard.tsx` → `ProfileCard`).
- 200 lines or fewer per component; split before implementing.
- Compound parts (`Button`, `ButtonText`, `ButtonIcon`) over `typeof children` switches.
- UI primitives (`src/ui/`) are presentation-only — no business logic, data fetching, mutations, or routing decisions.

### Naming (baseline)

- PascalCase exports; singular nouns (`UserCard`, not `UsersCard`).
- File name matches export name.
- **`src/ui/`** — generic names: `Button`, `TextInput`, `Dialog`.
- **`src/features/*/components/`** — domain-prefixed: `CheckoutButton`, `CartItemRow`.
- **`src/features/*/components/*Page.tsx`** — route-facing pages: `WorkshopListPage`, `SettingsPage`.
- Pattern: `<Feature><Entity><Type>` for feature components (`AuthLoginForm`, `OrderSummaryCard`).
- Props or CVA variants for state — not `PrimaryButton` or `DisabledInput`.
- Related parts share a prefix: `CartItem`, `CartItemImage`, `CartItemPrice`.

Each creation guide adds type-specific naming rules.

### Recategorizing an existing component

Re-run the decision tree when reuse grows:

- **Presentation-only and cross-feature** → move to `src/ui/` per [creating-ui-component.md](./creating-ui-component.md).
- **Business logic or data access in `src/ui/`** → extract logic to feature `hooks/` per [managing-state.md](./managing-state.md); leave a presentation-only primitive.
- **Navigation reused across routes** → move to `src/features/navigation/` per [creating-navigation-component.md](./creating-navigation-component.md).
- **Domain behavior used across routes** → extract to a new feature module per [creating-feature.md](./creating-feature.md).
- **Still tied to one route flow** → keep in the current feature.
- **Page at feature root** → move to `src/features/<feature>/components/*Page.tsx` per [creating-screen-component.md](./creating-screen-component.md).

Update folder placement and the feature barrel export when moving code.

## Related

- [managing-wrapper-components.md](./managing-wrapper-components.md) — shallow wrappers and `cx` merging
- [managing-state.md](./managing-state.md) — queries, stores, feature logic placement
- [creating-feature.md](./creating-feature.md) — feature module structure and barrels
- [creating-route-component.md](./creating-route-component.md) — route layer wiring
