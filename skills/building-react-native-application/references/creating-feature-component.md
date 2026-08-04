# Creating Feature Component

## Overview

Create domain UI components in `src/features/<feature>/components/`. These compose `@/ui/*` primitives and may contain feature-specific logic, hooks, and event handlers.

## Prerequisites

- [creating-component.md](./creating-component.md) — placement, shared rules, naming baseline
- [creating-ui-component.md](./creating-ui-component.md) — when a shared primitive is missing

## Guidelines

### Placement

| Belongs here | Does not belong here |
| --- | --- |
| UI blocks tied to product rules or feature state | Reusable presentation-only primitives → `src/ui/` |
| Event handlers and side effects for this feature | Route registration → `src/routes/` |
| Composition of `@/ui/*` and sibling feature components | HTTP clients → `src/api/` |
| Derived display logic callers should not duplicate | |
| Route-facing screens (`*Screen.tsx`) — see [creating-screen-component.md](./creating-screen-component.md) | |

### Composition

- Prefer smaller feature components over one large file.
- Feature components may import siblings in the same module.
- Import shared primitives from `@/ui/<file>` — run registry path first when a primitive is missing.

### Extraction heuristic

Split recurring rendering blocks into named feature components when they clarify the tree. If a block is presentation-only and reused across features, promote to `src/ui/`.

### Naming

- **`<Feature><Entity><Type>`** for domain meaning: `AuthLoginForm`, `CartItemRow`, `OrderSummaryCard`.
- Feature prefix when name only makes sense in that product area: `CheckoutButton`, `SearchInput`.
- Related parts share a prefix: `CartItem`, `CartItemImage`, `CartItemPrice`, `CartItemQuantity`.
- Suffixes: `Card`, `Item`/`Row`, `Form`, `Modal`/`Dialog` — pick one list pattern, stay consistent.

## Examples

### Feature component composing UI primitives

```tsx
import { Button } from "@/ui/Button";
import { useWorkshopStore } from "../hooks/useWorkshopStore";

export function WorkshopEnrollCta({ workshopId }: { workshopId: string }) {
  const enroll = useWorkshopStore((s) => s.enroll);

  return (
    <Button onPress={() => enroll(workshopId)}>
      Enroll now
    </Button>
  );
}
```

### Grouped sub-parts

```text
src/features/cart/components/
  CartItem.tsx
  CartItemImage.tsx
  CartItemPrice.tsx
  CartItemQuantity.tsx
```

## Related

- [creating-feature.md](./creating-feature.md) — feature module structure and barrels
- [managing-state.md](./managing-state.md) — Query, Zustand, and local state in features
