# Setting Up Auth Guard

## Overview

**Execution mode.** Guards pages in the route layer: ordered gates between signed-in and full access, layout routes that redirect by session and gates, public routes, a `redirect` back to the requested URL, and authorization at the layout owning a scope.

## Prerequisites

- [setting-up-authentication.md](./setting-up-authentication.md) — session, router context
- [creating-page.md](./creating-page.md) — route files and layouts

## Guidelines

### Gates

- Session status stays authentication only; every other access step is a gate.
- `src/common/auth/gates.ts` declares the app's gates in order: each has an `id`, a condition over the gate input (session, plus query data such as the profile), and the route that resolves it.
- `firstFailingGate(input)` returns the first gate whose condition fails, else `null`.
- A gate input that needs a query uses query options in `src/common/auth/` with a key from `@/common/query`, loaded with `queryClient.ensureQueryData` in `beforeLoad`: the one exception to route loaders not fetching.

### Guarded routes

| Route | `beforeLoad` |
| --- | --- |
| `_app.tsx` and its children | Signed out → sign-in with `redirect` set to `location.href`; a failing gate → that gate's route |
| `_gate.tsx` and its children (gate pages) | Signed out → sign-in with `redirect`; each gate page redirects on to `redirect`, else home, once its gate passes |
| `sign-in.tsx` | Signed in → `redirect`, else home; the page navigates the same way after signing in |
| Any other route | None: open in both states |

- `redirect` is a search param validated with Zod as an internal path (starts with `/`, not `//`), else home.
- Pages never check auth or navigate to sign-in.

### Cases

| Case | Structure |
| --- | --- |
| Signed in but not finished (profile setup) | A gate whose condition reads the profile query; its page sits under `_gate` |
| Temporary access (invite → set password) | A route outside `_app` that checks its own token with a query |
| Open in both states | A route outside `_app` and `_gate` |
| Scoped authorization (tenant, role) | The layout route owning the scope reads the scope's query through `AsyncView` and renders `<Outlet />` only when allowed; never on the session |

What a denied scope shows comes from the requirements.

## Examples

### `src/common/auth/gates.ts`

```ts
import type { Session } from "./session";

export interface GateInput {
  session: Session;
  profile?: { completedAt: string | null };
}

export const GATES = [
  {
    id: "profile-setup",
    passes: (input: GateInput) => !!input.profile?.completedAt,
    route: "/profile-setup",
  },
] as const;

export type GateId = (typeof GATES)[number]["id"];

export function firstFailingGate(input: GateInput) {
  return GATES.find((gate) => !gate.passes(input)) ?? null;
}
```

### `src/routes/_app.tsx`

```tsx
import { createFileRoute, Outlet, redirect } from "@tanstack/react-router";
import { firstFailingGate, profileQueryOptions } from "@/common/auth";
import { AppShell } from "@/common/navigation";
import { queryClient } from "@/common/query/client";

export const Route = createFileRoute("/_app")({
  beforeLoad: async ({ context, location }) => {
    if (context.session.status !== "signed-in") {
      throw redirect({ to: "/sign-in", search: { redirect: location.href } });
    }
    const profile = await queryClient.ensureQueryData(profileQueryOptions());
    const gate = firstFailingGate({ session: context.session, profile });
    if (gate) throw redirect({ to: gate.route, search: { redirect: location.href } });
  },
  component: () => (
    <AppShell>
      <Outlet />
    </AppShell>
  ),
});
```

### `src/routes/sign-in.tsx`

```tsx
import { createFileRoute, redirect } from "@tanstack/react-router";
import { z } from "zod";
import { SignInPage } from "@/features/sign-in";

const SearchSchema = z.object({
  redirect: z
    .string()
    .refine((path) => path.startsWith("/") && !path.startsWith("//"))
    .catch("/"),
});

export const Route = createFileRoute("/sign-in")({
  validateSearch: SearchSchema,
  beforeLoad: ({ context, search }) => {
    if (context.session.status === "signed-in") throw redirect({ to: search.redirect });
  },
  head: () => ({ meta: [{ title: "Sign in" }] }),
  component: SignInPage,
});
```

## References

- [TanStack Router — Authenticated routes](https://tanstack.com/router/latest/docs/framework/react/guide/authenticated-routes.md)
- [TanStack Router — Router context](https://tanstack.com/router/latest/docs/framework/react/guide/router-context.md)
