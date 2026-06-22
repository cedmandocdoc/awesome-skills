# Creating Feature Component

## Overview

Create **domain UI components** in `src/features/<feature-name>/components/`. These compose `@/ui/*` primitives and may contain feature-specific logic, hooks, and event handlers.

Start from [creating-component.md](./creating-component.md). For module barrels and exports, see [creating-feature.md](./creating-feature.md).

## Prerequisites

- [creating-component.md](./creating-component.md) — placement and shared rules
- [creating-ui-component.md](./creating-ui-component.md) — when you need a missing shared primitive first

## Naming

- Use **`<Feature><Entity><Type>`** when the component carries domain meaning: `AuthLoginForm`, `CartItemRow`, `OrderSummaryCard`.
- Prefix with the feature when the name only makes sense in that product area: `CheckoutButton`, `SearchInput`.
- Group related parts with a shared prefix: `CartItem`, `CartItemImage`, `CartItemPrice`, `CartItemQuantity`.
- Suffixes: `Card`, `Item` / `Row`, `Form`, `Modal` / `Dialog` — pick one list pattern and stay consistent.

## Guidelines

### What belongs here

- UI blocks tied to product rules or feature state.
- Event handlers and side effects specific to the feature.
- Composition of `@/ui/*` primitives and other feature components.
- Derived display logic that callers should not duplicate.

### What does not belong here

- Route-facing screens (`*Screen.tsx`) → feature root per [creating-screen-component.md](./creating-screen-component.md), not `components/`.
- Reusable presentation-only primitives → [creating-ui-component.md](./creating-ui-component.md).
- Route registration → `src/routes/` per [creating-route-component.md](./creating-route-component.md).
- HTTP clients and request functions → `src/api/` per [creating-api.md](./creating-api.md).

### Composition

- Prefer smaller feature components over one large file.
- Feature components may import sibling feature components in the same module.
- Import shared primitives from `@/ui/<file>` — run the UI registry path first when a primitive is missing.

### Extraction heuristic

When building a screen, split recurring rendering blocks into named feature components if they clarify the tree and stay under **200 lines**. If a block is presentation-only and reused across features, promote it to `src/ui/` instead.

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
