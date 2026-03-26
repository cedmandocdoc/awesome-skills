# Component Naming Convention Guidelines

A solid component naming convention improves readability, scalability, and team collaboration.

These guidelines target this skill's TypeScript + React Native architecture:

- Shared UI primitives live in `src/ui/`.
- Feature-specific UI and behavior live in `src/features/<feature-name>/components/`.
- Hooks live separately (for example under `src/features/<feature-name>/hooks/` or adjacent folders).

---

## 1. Use PascalCase for Components

Component exports should always use `PascalCase`.

Good:

- `UserProfile`
- `ProductCard`
- `CheckoutForm`

Bad:

- `userProfile`
- `product-card`
- `checkout_form`

---

## 2. Name Based on Purpose, Not Implementation

Name components based on what they represent, not how they are built.

Good:

- `LoginForm`
- `UserAvatar`

Bad:

- `DivWrapper`
- `StyledBox`
- `FlexContainer`

---

## 3. Follow a Feature-First Naming Pattern

Use business/domain context in naming.

Default pattern:

`<Feature><Entity><Type>`

Examples:

- `AuthLoginForm`
- `CartItemRow`
- `OrderSummaryCard`

In this skill, prefer the feature prefix when the component includes feature-specific behavior or domain meaning.

---

## 4. Use Suffixes for Component Types

Common suffixes (and how they map in this skill):

- `Page` (route-level / screen-level component)
- `Layout` (structural wrappers used across routes)
- `Card` (grouped content)
- `Item` / `Row` (list elements)
- `Form` (forms)
- `Modal` / `Dialog` (overlays)
- `Button`, `Input`, `Select` (UI primitives)

Examples:

- `DashboardPage`
- `MainLayout`
- `ProductCard`
- `UserListItem`
- `PaymentForm`

---

## 5. Distinguish UI vs Feature Components

UI components are reusable and presentation-focused. Feature components carry domain meaning and/or feature behavior.

UI (reusable / `src/ui/`):

- `Button`
- `TextInput`
- `Modal`

Feature (domain behavior or feature-specific meaning, often in `src/features/<feature-name>/components/`):

- `CheckoutButton`
- `SearchInput`
- `DeleteUserModal`

Rule:

If the component contains business logic, feature behavior, or domain meaning that only makes sense inside a feature, prefix it with the feature.

---

## 6. Avoid Redundant Words

Avoid repeating the same word because it is already implied by the type or category.

Bad:

- `UserUserCard`
- `ProductProductItem`

Good:

- `UserCard`
- `ProductItem`

---

## 7. Use Singular Nouns

Prefer singular nouns for components.

Good:

- `UserCard`
- `OrderItem`

Bad:

- `UsersCard`
- `OrdersItem`

---

## 8. Do Not Encode State in Names

Do not put transient UI state or variations into the component name.

Bad:

- `PrimaryButton`
- `DisabledInput`

Good:

- `Button` with props like `tone="primary"`
- `Input` with props like `disabled`

If a component needs variants, encode them as props (or CVA variants when using class-variance-authority), not as separate component names.

---

## 9. Avoid Generic Names Like "Wrapper" or "Container"

Names should explain intent, not just how the component is composed.

Bad:

- `Wrapper`
- `Container`

Better:

- `PageLayout`
- `CenteredContent`
- `AuthGuard`

---

## 10. Match File Name = Component Name

Ensure file names match the exported component name.

Example:

- `UserCard.tsx` should export `UserCard`

---

## 11. Group Related Components with Prefixes

When a feature splits a UI into smaller parts, keep their naming grouped with a shared prefix.

Example (same prefix indicates shared intent):

- `CartItem.tsx`
- `CartItemImage.tsx`
- `CartItemPrice.tsx`
- `CartItemQuantity.tsx`

---

## 12. Use Separate Naming for Hooks and Utilities

- Hooks: `useAuth`, `useCart`
- Utilities: `formatCurrency`, `calculateDiscount`

This keeps component files focused and makes imports predictable.

---

## Anti-Patterns to Avoid

- Naming based on styling (`RedBox`, `FlexDiv`)
- Overly long names (`UserProfileDetailedInformationCard`)
- Abbreviations (`UsrCard`, `PrdItm`)
- Inconsistent suffix usage

---

## Rule of Thumb

If someone can understand what a component does just by reading its name, the naming is effective.

