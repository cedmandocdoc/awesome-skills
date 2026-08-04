# Managing State

## Overview

Decide where state belongs. Use TanStack Query for server data, Zustand for feature-owned client state, navigation params for route state, and local React state for UI owned by one component.

## Guidelines

### Structure

- Zustand stores: `src/features/<feature-name>/hooks/use<Feature>Store.ts`
- Query hooks: `src/features/<feature-name>/hooks/`
- API calls: `src/api/`

### Choose the right state tool

| Kind | Tool |
| --- | --- |
| Data fetched from an API | TanStack Query |
| Client-only state owned by a feature (including cross-feature stores like auth) | Zustand |
| Route state surviving back navigation and deep links | Navigation params |
| UI owned by one component | `useState` / `useReducer` |

### State rules

- Derive values in render when possible.
- Store semantic state (`isOpen`, `step`), not visual output (`opacity`).
- Use selectors with Zustand to reduce re-renders.
- Name store hooks `useXStore`; keep the file name aligned.

### Stepper and wizard state

See [managing-stepper-hook.md](./managing-stepper-hook.md) and [managing-stepper-form.md](./managing-stepper-form.md).

- Keep step index and navigation in the stepper hook (`useXStepper`).
- Keep field values and validation in TanStack Form; do not mirror form fields in Zustand.
- Use Zustand only when step progress or draft data must survive leaving the screen.

## Setup

```bash
node ../scripts/install-packages.cjs @tanstack/react-query zustand
```

### `QueryClientProvider` at the root

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

export default function App() {
  return (
    <QueryClientProvider client={queryClient}>{/* app */}</QueryClientProvider>
  );
}
```

## Examples

### Query hook

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

Path: `src/features/auth/hooks/useAuthStore.ts`

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
