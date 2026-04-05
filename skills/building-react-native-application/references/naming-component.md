# Naming Component

## Overview

Use this guide to name components consistently across `src/ui/` and `src/features/<feature-name>/components/`. A clear name tells readers what a component does without opening the file.

## Guidelines

### Core rules

- Use PascalCase for all component exports.
- Name based on purpose, not implementation.
- Prefer singular nouns (`UserCard`, not `UsersCard`).
- Match file name to component name (`UserCard.tsx` exports `UserCard`).

### Feature-first naming pattern

Use `<Feature><Entity><Type>` when the component includes feature-specific behavior or domain meaning.

| Example | Pattern |
| --- | --- |
| `AuthLoginForm` | Feature + Entity + Type |
| `CartItemRow` | Feature + Entity + Type |
| `OrderSummaryCard` | Feature + Entity + Type |

### Type suffixes

Use consistent suffixes to signal the component's role:

| Suffix | Role |
| --- | --- |
| `Page` | Route-level / screen-level component |
| `Layout` | Structural wrapper used across routes |
| `Card` | Grouped content |
| `Item` / `Row` | List element |
| `Form` | Form |
| `Modal` / `Dialog` | Overlay |
| `Button`, `Input`, `Select` | UI primitive |

### UI vs feature components

| Layer | Location | Naming |
| --- | --- | --- |
| UI (presentation-only) | `src/ui/` | Generic: `Button`, `TextInput`, `Modal` |
| Feature (domain behavior) | `src/features/*/components/` | Prefixed: `CheckoutButton`, `SearchInput`, `DeleteUserModal` |

If the component contains business logic or domain meaning that only makes sense inside a feature, prefix it with the feature.

### Grouping related parts

When a feature splits UI into smaller parts, keep naming grouped with a shared prefix:

- `CartItem.tsx`, `CartItemImage.tsx`, `CartItemPrice.tsx`, `CartItemQuantity.tsx`

### Hooks and utilities

- Hooks: `useAuth`, `useCart`
- Utilities: `formatCurrency`, `calculateDiscount`

### Do not encode state in names

Use props or CVA variants for state, not separate component names.

| Bad | Good | Why |
| --- | --- | --- |
| `PrimaryButton` | `Button` with `tone="primary"` | State belongs in props |
| `DisabledInput` | `Input` with `disabled` | State belongs in props |

## Anti-patterns

| Anti-pattern | Example |
| --- | --- |
| Naming based on styling | `RedBox`, `FlexDiv` |
| Implementation-based names | `DivWrapper`, `StyledBox`, `FlexContainer` |
| Generic wrappers | `Wrapper`, `Container` (use `PageLayout`, `AuthGuard`) |
| Redundant words | `UserUserCard`, `ProductProductItem` |
| Overly long names | `UserProfileDetailedInformationCard` |
| Abbreviations | `UsrCard`, `PrdItm` |
| Inconsistent suffix usage | Mixing `Item` and `Row` for the same concept |
