# Creating Feature Component

## Overview

**Execution mode.** Create domain UI components in `src/features/<feature-name>/components/`. These compose `@/ui/*` primitives and may contain feature-specific logic, hooks, and event handlers.

Start from [creating-component.md → Decision tree](./creating-component.md#decision-tree).

## Prerequisites

- [creating-component.md](./creating-component.md) — shared rules and naming baseline
- [creating-ui-component.md](./creating-ui-component.md) — when a shared primitive is missing

## Guidelines

### What belongs here

- Route-facing pages (`*Page.tsx`) — see [creating-screen-component.md](./creating-screen-component.md).
- UI blocks tied to product rules or feature state.
- Event handlers and side effects specific to the feature.
- Composition of `@/ui/*` primitives and sibling feature components.
- HTTP clients and request functions stay in `src/api/` — call from feature hooks.

### Composition

- Prefer smaller feature components over one large file.
- Import shared primitives from `@/ui/<file>` — run the UI registry path first when a primitive is missing.

### Extraction heuristic

Split recurring rendering blocks into named feature components when they clarify the tree and stay under 200 lines. Promote presentation-only blocks reused across features to `src/ui/`.

### Naming

- `<Feature><Entity><Type>` for domain components: `AuthLoginForm`, `CartItemRow`, `OrderSummaryCard`.
- Prefix with the feature when the name only makes sense in that area: `CheckoutButton`, `SearchInput`.
- Related parts share a prefix: `CartItem`, `CartItemImage`, `CartItemPrice`.
- Suffixes: `Card`, `Item` / `Row`, `Form`, `Modal` / `Dialog` — pick one pattern and stay consistent.

## Examples

```tsx
import { Button } from "@/ui/Button";
import { useWorkshopStore } from "../hooks/useWorkshopStore";

export function WorkshopEnrollCta({ workshopId }: { workshopId: string }) {
  const enroll = useWorkshopStore((s) => s.enroll);

  return (
    <Button type="button" onClick={() => enroll(workshopId)}>
      Enroll now
    </Button>
  );
}
```

## Related

- [creating-feature.md](./creating-feature.md) — feature module structure and barrels
- [managing-state.md](./managing-state.md) — query, Zustand, and local state in features
