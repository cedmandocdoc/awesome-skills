# Managing State

## Overview

Use this guide to decide where state belongs. Use TanStack Query for server data, Zustand for feature-owned client state, navigation params for route state, and local React state for UI owned by one component.

## Guidelines

### Structure

- Put Zustand stores in `src/features/<feature-name>/hooks/use<Feature>Store.ts`.
- Put query hooks in `src/features/<feature-name>/hooks/`.
- Keep API calls in `src/api/`.

### Choose the right state tool

1. Use TanStack Query for data fetched from an API.
2. Use Zustand for client-only state owned by a feature (including stores consumed by multiple features, such as auth).
3. Use navigation params for route state that should survive back navigation and deep links.
4. Use `useState` or `useReducer` for local component state.

### State rules

- Derive values in render when possible.
- Do not copy props or query data into local state without a clear reason.
- Store semantic state such as `isOpen` or `step`, not visual output such as `opacity`.
- Use selectors with Zustand to reduce re-renders.
- Name store hooks with the `useXStore` pattern and keep the file name aligned.

## Setup

### Install dependencies

```bash
node ../scripts/install-packages.cjs @tanstack/react-query zustand
```

### Add `QueryClientProvider` at the root

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

- Keep **active step index and step navigation** in the stepper hook (`useXStepper`) when the wizard is scoped to one screen or feature flow.
- Keep **field values and validation** in TanStack Form (see [managing-stepper-form.md](./managing-stepper-form.md)); do not mirror form fields in Zustand.
- Use **Zustand** only when step progress or draft data must survive leaving the screen or be shared across features.
- Use **navigation params** when a step or sub-flow should be deep-linkable or restored after back navigation.
