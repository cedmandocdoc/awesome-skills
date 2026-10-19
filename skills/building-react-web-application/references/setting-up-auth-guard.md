# Setting Up Auth Guard

## Overview

**Execution mode.** Guards signed-in pages in the route layer: one session provider passed to the router as context, a pathless layout route that redirects by session state, and a startup that waits for the stored session.

## Prerequisites

- [creating-page.md](./creating-page.md) — route files and layouts

## Guidelines

### Session

- One app-level provider in `src/features/auth/` restores the stored session at startup and exposes `useSession()` from the feature barrel, with `status` of `restoring`, `signed-in`, or `signed-out`. The auth SDK comes from the TRD.
- The root passes the session to `RouterProvider` as router context; `__root.tsx` declares its type with `createRootRouteWithContext`.
- Signing in or out calls `router.invalidate()` so guards run again; signing out also clears the TanStack Query cache with `queryClient.clear()`.

### Guard

- The route layer alone gates access: pages never check auth or navigate to sign-in.
- Signed-in pages sit under the pathless `_app` layout; its `beforeLoad` redirects a signed-out visitor to the sign-in route with the current `location.href` in a `redirect` search param.
- The sign-in route validates `redirect` with Zod; its `beforeLoad` sends a signed-in visitor to `redirect`, else to the app's home, and the page navigates the same way after signing in.
- Nothing renders while `status` is `restoring`.

## Examples

### `src/main.tsx` root

```tsx
function App() {
  const session = useSession();

  if (session.status === "restoring") return null;
  return <RouterProvider router={router} context={{ session }} />;
}
```

`App` renders inside `SessionProvider`; `createRouter({ routeTree, context: { session: undefined! } })` declares the context it fills in.

### `src/routes/__root.tsx`

```tsx
import { createRootRouteWithContext, Outlet } from "@tanstack/react-router";
import type { Session } from "@/features/auth";

export const Route = createRootRouteWithContext<{ session: Session }>()({
  component: Outlet,
});
```

### `src/routes/_app.tsx`

```tsx
import { createFileRoute, Outlet, redirect } from "@tanstack/react-router";
import { AppShell } from "@/features/navigation";

export const Route = createFileRoute("/_app")({
  beforeLoad: ({ context, location }) => {
    if (context.session.status !== "signed-in") {
      throw redirect({ to: "/sign-in", search: { redirect: location.href } });
    }
  },
  component: () => (
    <AppShell>
      <Outlet />
    </AppShell>
  ),
});
```

## References

- [TanStack Router — Authenticated routes](https://tanstack.com/router/latest/docs/framework/react/guide/authenticated-routes.md)
- [TanStack Router — Router context](https://tanstack.com/router/latest/docs/framework/react/guide/router-context.md)
