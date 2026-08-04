# Creating Screen Component

## Overview

**Execution mode.** Create route-facing page components exported from a feature module and registered by thin route modules in `src/routes/`.

Start from [creating-component.md → Decision tree](./creating-component.md#decision-tree).

## Prerequisites

- [creating-feature.md](./creating-feature.md) — barrels and export contract
- [creating-route-component.md](./creating-route-component.md) — register pages and wire navigation in `src/routes/`

## Guidelines

### Page responsibilities

- Compose sibling feature components and `@/ui/*` primitives for the route's UI.
- Read path or search params via TanStack Router hooks when needed.
- Wire TanStack Query hooks, mutations, and feature stores for this flow.
- Keep `src/routes/` files thin — import and render the feature export.
- Extract sub-trees to sibling feature components when the file grows.

### Placement

```text
src/features/<feature-name>/components/<Feature>Page.tsx
```

Shared layout wrappers: `src/features/<feature-name>/components/<Feature>Layout.tsx`.

### Naming

- **`*Page`** suffix for route destinations: `WorkshopListPage`, `SettingsPage`.
- **`*Layout`** suffix for structural wrappers shared across routes: `AuthLayout`, `AppLayout`.

## Examples

`src/features/workshop-list/components/WorkshopListPage.tsx`:

```tsx
import { useWorkshops } from "../hooks/useWorkshops";
import { WorkshopListItem } from "./WorkshopListItem";

export function WorkshopListPage() {
  const workshops = useWorkshops();

  if (workshops.isLoading) return <p>Loading…</p>;
  if (workshops.isError) return <p>{workshops.error.message}</p>;

  return (
    <ul>
      {workshops.data?.map((workshop) => (
        <WorkshopListItem key={workshop.id} workshop={workshop} />
      ))}
    </ul>
  );
}
```

`src/routes/_app.workshops.tsx`:

```tsx
import { createFileRoute } from "@tanstack/react-router";
import { WorkshopListPage } from "@/features/workshop-list";

export const Route = createFileRoute("/_app/workshops")({
  component: WorkshopListPage,
});
```

## Related

- [creating-route-component.md](./creating-route-component.md) — layouts, params, and navigation wiring
- [creating-navigation-component.md](./creating-navigation-component.md) — shared layout navigation components
