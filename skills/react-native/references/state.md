# State

## Overview

Use this guide to decide where state belongs. Use TanStack Query for server data, Zustand for shared client state, navigation params for route state, and local React state for UI owned by one component.

## Guidelines

### Structure

- Put shared stores in `src/stores/`.
- Put query hooks in `src/features/<feature-name>/hooks/`.
- Keep API calls in `src/api/`.

### Choose the right state tool

1. Use TanStack Query for data fetched from an API.
2. Use Zustand for shared client-only state.
3. Use navigation params for route state that should survive back navigation and deep links.
4. Use `useState` or `useReducer` for local component state.

### State rules

- Derive values in render when possible.
- Do not copy props or query data into local state without a clear reason.
- Store semantic state such as `isOpen` or `step`, not visual output such as `opacity`.
- Use selectors with Zustand to reduce re-renders.

## Setup

### Install dependencies

```bash
npm install @tanstack/react-query zustand
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

## Usage

### Create a query hook

```ts
import { useQuery } from "@tanstack/react-query";
import { createClient } from "@/api/app-api/client";
import { getWorkshops } from "@/api/app-api/modules/workshops";

const client = createClient({ baseURL: process.env.EXPO_PUBLIC_API_URL! });

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
