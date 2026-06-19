# Creating Screen Component

## Overview

Create **route-facing page components** exported from a feature module and registered by thin route modules in `src/routes/`. Pages own feature UI for a route; the route file wires params, layout, and navigation components.

Start from [creating-component.md](./creating-component.md). For feature module structure, see [creating-feature.md](./creating-feature.md).

## Prerequisites

- [creating-feature.md](./creating-feature.md) — barrels and export contract
- [creating-feature-component.md](./creating-feature-component.md) — smaller blocks inside the page
- [creating-route-component.md](./creating-route-component.md) — register pages and wire navigation components in `src/routes/`

## Naming

- Use the **`Page`** suffix for components rendered as a route destination: `WorkshopListPage`, `SettingsPage`.
- Use **`Layout`** for structural wrappers shared across routes when exported from a feature: `AuthLayout`, `AppLayout`.
- Page files live at the **feature root**: `src/features/<feature-name>/<Feature>Page.tsx`.

## Guidelines

### Page responsibilities

- Compose feature components from `components/` and `@/ui/*` primitives for the route's UI.
- Read path or search params via TanStack Router hooks when needed.
- Wire TanStack Query hooks, mutations, and feature stores for this flow.
- Keep `src/routes/` files thin — import and render the feature export.

### What to avoid

- Defining reusable presentation-only primitives inline — extract to `src/ui/` or feature components.
- Bloating the route file with domain logic that belongs in the feature module.
- Duplicating layout navigation components — wire from `src/routes/` via `@/features/navigation` per [creating-navigation-component.md](./creating-navigation-component.md), unless localized composition is clearer.

### Size and structure

- Keep pages focused; extract sub-trees to [creating-feature-component.md](./creating-feature-component.md) when the file grows.
- Supporting UI blocks belong in `src/features/<feature-name>/components/`, not beside the page file.

## Examples

### Feature page composed by a route

`src/features/workshop-list/WorkshopListPage.tsx`:

```tsx
import { useWorkshops } from "./hooks/useWorkshops";
import { WorkshopListItem } from "./components/WorkshopListItem";

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

`src/features/workshop-list/index.ts`:

```ts
export { WorkshopListPage } from "./WorkshopListPage";
export { useWorkshops } from "./hooks/useWorkshops";
```

`src/routes/workshops/index.tsx`:

```tsx
import { createFileRoute } from "@tanstack/react-router";
import { WorkshopListPage } from "@/features/workshop-list";

export const Route = createFileRoute("/workshops/")({
  component: WorkshopListPage,
});
```

## Related

- [creating-route-component.md](./creating-route-component.md) — layouts, params, and navigation wiring
- [creating-navigation-component.md](./creating-navigation-component.md) — shared layout navigation components
