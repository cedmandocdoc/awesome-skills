# Managing State

## Overview

Use this guide to decide where state belongs. Use TanStack Query for server data, Zustand for feature-owned client state, **TanStack Router** path and search params for URL-owned state, and local React state for UI owned by one component.

## Guidelines

### Structure

- Put Zustand stores in `src/features/<feature-name>/hooks/use<Feature>Store.ts`.
- Put query hooks in `src/features/<feature-name>/hooks/`.
- Keep API calls in `src/api/`.

### Choose the right state tool

1. Use TanStack Query for data fetched from an API.
2. Use Zustand for client-only state owned by a feature (including stores consumed by multiple features, such as auth).
3. Use **route params and validated search params** for state that should be shareable via URL, bookmarkable, or restored on refresh—see TanStack Router docs.
4. Use `useState` or `useReducer` for local component state.

### State rules

- Derive values in render when possible.
- Copy props or query data into local state only when there is a clear reason.
- Store semantic state such as `isOpen` or `step`; handle values like `opacity` with utilities and CVA unless interaction logic truly needs them in JS.
- Use selectors with Zustand to reduce re-renders.
- Name store hooks with the `useXStore` pattern and keep the file name aligned.

## Setup

### Install dependencies

```bash
node ../scripts/install-packages.cjs @tanstack/react-query zustand
```

### Add `QueryClientProvider` at the root

Mount **inside** the same root tree as the router (typically wrapping `RouterProvider` or wrapped by it—pick one order and keep it consistent). Example:

```tsx
import type { ReactNode } from "react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60 * 5,
      retry: 2,
    },
  },
});

export function AppProviders({ children }: { children: ReactNode }) {
  return <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>;
}
```

## Examples

### Create a query hook

Module functions own the shared client; feature hooks import only the module function (see [creating-api.md](./creating-api.md)).

```ts
import { useQuery } from "@tanstack/react-query";
import { getWorkshops } from "@/api/app-api/modules/workshops";

export function useWorkshops() {
  return useQuery({
    queryKey: ["app-api", "workshops", "list"],
    queryFn: getWorkshops,
  });
}
```

### Create a Zustand store

Example path: `src/features/auth/hooks/useAuthStore.ts`

```ts
import { create } from "zustand";

interface AuthState {
  token: string | null;
  login: (token: string) => void;
  logout: () => void;
}

export const useAuthStore = create<AuthState>((set) => ({
  token: null,
  login: (token) => set({ token }),
  logout: () => set({ token: null }),
}));
```

### Prefer derived values

```tsx
const [raw, setRaw] = useState<string | undefined>(undefined);
const value = raw ?? serverDefault;
```

### Stepper and wizard state

For multi-step flows built with Stepperize (see [managing-stepper-hook.md](./managing-stepper-hook.md)):

- Keep **active step index and step navigation** in the stepper hook (`useXStepper`) when the wizard is scoped to one route or feature flow.
- Keep **field values and validation** in TanStack Form (see [managing-stepper-form.md](./managing-stepper-form.md)); do not mirror form fields in Zustand.
- Use **Zustand** only when step progress or draft data must survive leaving the route or be shared across features.
- Use **route or search params** when a step or sub-flow should be bookmarkable or restored on refresh.
