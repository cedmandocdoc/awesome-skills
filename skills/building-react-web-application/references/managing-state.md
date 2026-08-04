# Managing State

## Overview

Decides where state belongs. TanStack Query for server data, Zustand for feature-owned client state, TanStack Router params for URL-owned state, local React state for single-component UI.

## Guidelines

### Structure

- Zustand stores: `src/features/<feature-name>/hooks/use<Feature>Store.ts`.
- Query hooks: `src/features/<feature-name>/hooks/`.
- API calls: `src/api/`.

### Choose the right tool

1. **TanStack Query** — data fetched from an API.
2. **Zustand** — client-only state owned by a feature (including cross-feature stores like auth).
3. **Route params and validated search params** — state shareable via URL, bookmarkable, or restored on refresh.
4. **`useState` / `useReducer`** — local component state.

### State rules

- Derive values in render when possible.
- Copy props or query data into local state only with a clear reason.
- Store semantic state (`isOpen`, `step`); handle values like `opacity` with utilities and CVA.
- Use selectors with Zustand to reduce re-renders.
- Name store hooks `useXStore`; keep the file name aligned.

### Stepper and wizard state

Per [managing-stepper-hook.md](./managing-stepper-hook.md) and [managing-stepper-form.md](./managing-stepper-form.md):

- Keep active step index and navigation in the stepper hook (`useXStepper`) when scoped to one route or feature.
- Keep field values and validation in TanStack Form — do not mirror form fields in Zustand.
- Use Zustand only when step progress or draft data must survive leaving the route or be shared across features.
- Use route or search params when a step should be bookmarkable.

## Setup

### Install dependencies

```bash
node ../scripts/install-packages.cjs @tanstack/react-query zustand
```

### Add `QueryClientProvider` at the root

Mount inside the same root tree as the router. Example:

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

### Query hook

Module functions own the shared client; feature hooks import the module function (see [creating-api.md](./creating-api.md)).

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

### Zustand store

`src/features/auth/hooks/useAuthStore.ts`:

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

### Derived values

```tsx
const [raw, setRaw] = useState<string | undefined>(undefined);
const value = raw ?? serverDefault;
```
