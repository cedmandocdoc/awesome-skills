# Creating Component

## Overview

Route to the correct creation guide. Read the decision tree; open the matched guide.

## Guidelines

### Decision tree

| Building… | Go to |
| --- | --- |
| Shared UI primitive (`Button`, `Input`, `Dialog`…) | [creating-ui-component.md](./creating-ui-component.md) |
| Domain UI block (`CartItemRow`, `CheckoutSummary`…) | [creating-feature-component.md](./creating-feature-component.md) |
| Route-facing Screen or Layout | [creating-screen-component.md](./creating-screen-component.md) → register in [creating-route-component.md](./creating-route-component.md) |
| Navigation component (`AppHeader`, tab icon…) | [creating-navigation-component.md](./creating-navigation-component.md) → wire in [creating-route-component.md](./creating-route-component.md) |
| Route layer file under `src/routes/` | [creating-route-component.md](./creating-route-component.md) |
| Pre-bound form field / form shell | [creating-form-component.md](./creating-form-component.md) |
| Server-backed loading / error / list UI | [creating-async-component.md](./creating-async-component.md) |
| Bottom sheet UI | [creating-bottom-sheet-component.md](./creating-bottom-sheet-component.md) |

Wrong layer? See [Recategorizing](#recategorizing-an-existing-component).

### Placement

| Kind | Location |
| --- | --- |
| Screen component | `src/features/<feature>/components/*Screen.tsx` |
| Feature components | `src/features/<feature>/components/` |
| Navigation components | `src/features/navigation/components/` |
| Navigation hooks | `src/features/navigation/hooks/` |
| Route layer | `src/routes/` |
| Shared UI primitives | `src/ui/` (flat unless a subsystem owns a folder) |
| Composition roots | `src/ui/Form/`, `src/ui/Async/`, `src/ui/BottomSheet/` |
| Tokens / theme | `global.css`, `src/theme.css`, `src/theme.ts` |
| Tailwind / NativeWind config | `tailwind.config.js` |

- Domain behavior and product rules live in `src/features/<feature>/` — queries, stores, logic in `hooks/` per [managing-state.md](./managing-state.md).
- Reusable navigation components live in `src/features/navigation/`.
- Reusable presentation-only primitives live in `src/ui/`.
- Route registration and wiring live in `src/routes/`.
- Import primitives with `@/ui/<file>`; use relative imports inside `src/ui/`.

### Shared rules

- Functional components with named exports.
- `interface` for props.
- One component per file; file name matches export (`ProfileCard.tsx` → `ProfileCard`).
- ≤ 200 lines per component; split before implementing.
- Compound parts (`Button`, `ButtonText`, `ButtonIcon`) over `typeof children` switches.
- `src/ui/` is presentation-only — no business logic, data fetching, mutations, or navigation.

### Naming

| Scope | Convention |
| --- | --- |
| All | PascalCase, singular nouns (`UserCard` not `UsersCard`). File matches export. |
| `src/ui/` | Generic: `Button`, `TextInput`, `Modal`. |
| `src/features/*/components/` | Feature-prefixed for domain-specific: `CheckoutButton`, `CartItemRow`. |
| `src/features/*/components/*Screen.tsx` | `<Feature>Screen`: `WorkshopListScreen`, `SettingsScreen`. |
| Feature components | `<Feature><Entity><Type>`: `AuthLoginForm`, `OrderSummaryCard`. |

- Props or CVA variants encode state — not component names (`PrimaryButton` → `Button` with `tone` prop).
- Related parts share a prefix: `CartItem`, `CartItemImage`, `CartItemPrice`.
- Each creation guide adds type-specific naming rules.

### Recategorizing an existing component

Re-run the decision tree when reuse grows:

| Signal | Action |
| --- | --- |
| Presentation-only and cross-feature | Move to `src/ui/` per [creating-ui-component.md](./creating-ui-component.md) |
| Business logic in `src/ui/` | Extract logic to feature `hooks/` per [managing-state.md](./managing-state.md); keep primitive presentation-only |
| Navigation reused across screens | Move to `src/features/navigation/` per [creating-navigation-component.md](./creating-navigation-component.md) |
| Domain behavior used across screens | Extract to a new feature module per [creating-feature.md](./creating-feature.md) |
| Still tied to one screen flow | Keep in current feature |
| Screen at feature root | Move to `src/features/<feature>/components/*Screen.tsx` per [creating-screen-component.md](./creating-screen-component.md) |

Update folder placement **and** barrel export when moving code.

## Related

- [managing-wrapper-components.md](./managing-wrapper-components.md) — flatten `View` trees and merge `className`
- [managing-state.md](./managing-state.md) — queries, stores, feature logic
- [creating-feature.md](./creating-feature.md) — feature module structure, folder layout, barrels
- [creating-route-component.md](./creating-route-component.md) — route layer wiring
- [setting-up-registry-components.md](./setting-up-registry-components.md) — one-time registry shell
