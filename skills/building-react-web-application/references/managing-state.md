# Managing State

## Overview

Use this guide to decide where state belongs. Use TanStack Query for server data, Zustand for shared client state, **TanStack Router** path and search params for URL-owned state, and local React state for UI owned by one component.

## Guidelines

### Structure

- Put shared stores in `src/stores/`.
- Put query hooks in `src/features/<feature-name>/hooks/`.
- Keep API calls in `src/api/`.

### Choose the right state tool

1. Use TanStack Query for data fetched from an API.
2. Use Zustand for shared client-only state.
3. Use **route params and validated search params** for state that should be shareable via URL, bookmarkable, or restored on refresh—see TanStack Router docs.
4. Use `useState` or `useReducer` for local component state.

### State rules

- Derive values in render when possible.
- Copy props or query data into local state only when there is a clear reason.
- Store semantic state such as `isOpen` or `step`, not visual output such as `opacity`.
- Use selectors with Zustand to reduce re-renders.

## Setup

### Install dependencies

```bash
npm install @tanstack/react-query zustand
```

### Add `QueryClientProvider` at the root

Mount **inside** the same root tree as the router (typically wrapping `RouterProvider` or wrapped by it—pick one order and keep it consistent). Example:

```tsx
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60 * 5,
      retry: 2,
    },
  },
});

export function AppProviders({ children }: { children: React.ReactNode }) {
  return <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>;
}
```

## Examples

### Create a query hook

Read the API base URL from that backend’s parsed `env` export (see [managing-environment.md](./managing-environment.md)); feature hooks import that `env` module.

```ts
import { useQuery } from "@tanstack/react-query";
import { createClient } from "@/api/app-api/client";
import { env } from "@/api/app-api/env";
import { getWorkshops } from "@/api/app-api/modules/workshops";

const client = createClient({ baseURL: env.VITE_API_URL });

export function useWorkshops() {
  return useQuery({
    queryKey: ["app-api", "workshops", "list"],
    queryFn: () => getWorkshops(client),
  });
}
```

### Create a Zustand store

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
