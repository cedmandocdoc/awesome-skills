# Creating Screen Component

## Overview

Create **route-facing page components** exported from a feature module and registered by thin route modules in `src/routes/`. Pages own feature UI for a route; the route file wires params, layout, and navigation components.

Start from [creating-component.md](./creating-component.md). For feature module structure, see [creating-feature.md](./creating-feature.md).

## Prerequisites

- [creating-feature.md](./creating-feature.md) — barrels and export contract
- [creating-feature-component.md](./creating-feature-component.md) — smaller blocks inside the page
- [creating-route-component.md](./creating-route-component.md) — register pages and wire navigation components in `src/routes/`

## Guidelines

### Page responsibilities

- Compose sibling feature components and `@/ui/*` primitives for the route's UI.
- Read path or search params via TanStack Router hooks when needed.
- Wire TanStack Query hooks, mutations, and feature stores for this flow.
- Keep `src/routes/` files thin — import and render the feature export.

### What to avoid

- Defining reusable presentation-only primitives inline — extract to `src/ui/` or feature components.
- Bloating the route file with domain logic that belongs in the feature module.
- Duplicating layout navigation components — wire from `src/routes/` via `@/features/navigation` per [creating-navigation-component.md](./creating-navigation-component.md), unless localized composition is clearer.

### Size and structure

- Keep pages focused; extract sub-trees to sibling feature components in the same `components/` folder when the file grows.

### Placement

Route-facing page files **always** live under the feature's `components/` folder:

```text
src/features/<feature-name>/components/<Feature>Page.tsx
```

Examples: `src/features/workshop-list/components/WorkshopListPage.tsx`, `src/features/settings/components/SettingsPage.tsx`.

Shared layout wrappers exported from a feature (`AuthLayout`, `AppLayout`) also live in `components/`: `src/features/<feature-name>/components/<Feature>Layout.tsx`.

### Naming

- Use the **`Page`** suffix for components rendered as a route destination: `WorkshopListPage`, `SettingsPage`.
- Use **`Layout`** for structural wrappers shared across routes when exported from a feature: `AuthLayout`, `AppLayout`.

## Examples

### Feature page composed by a route

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

`src/features/workshop-list/index.ts`:

```ts
export { WorkshopListPage } from "./components/WorkshopListPage";
export { useWorkshops } from "./hooks/useWorkshops";
```

`src/routes/_app.workshops.tsx`:

```tsx
import { createFileRoute } from "@tanstack/react-router";
import { WorkshopListPage } from "@/features/workshop-list";

export const Route = createFileRoute("/_app/workshops")({
  component: WorkshopListPage,
});
```

URL: `/workshops` under the `_app` pathless shell. For a public list at `/workshops` without the app shell, use `workshops.tsx` instead — see [creating-route-component.md](./creating-route-component.md).

## Related

- [creating-route-component.md](./creating-route-component.md) — layouts, params, and navigation wiring
- [creating-navigation-component.md](./creating-navigation-component.md) — shared layout navigation components
