# Managing Data

## Overview

The API layer and its response models, the normalized error, the one query client and its keys, queries and mutations in features, state placement, and dates at the API boundary.

## Prerequisites

- [managing-environment.md](./managing-environment.md) — `env.ts` per backend

## Guidelines

### API layer

```text
src/libs/ApiError.ts

src/api/<backend>/
├── index.ts        # barrel: module functions, model schemas and types, setTokenProvider
├── client.ts       # one shared client, configured from env.ts
├── env.ts
├── utils.ts        # toApiError, parseResponse, FALLBACK_MESSAGE
├── models/         # Zod schemas per domain, domain error codes
└── modules/        # endpoint functions per domain
```

- One backend per kebab-case folder; one shared client per backend; the transport (`fetch`, an SDK) comes from the TRD.
- The client declares `setTokenProvider(provider)` and attaches the token per [setting-up-authentication.md](./setting-up-authentication.md).
- Every module function parses its response with a Zod schema from `models/` through `parseResponse`; types come from `z.infer`. A response that fails its schema throws `ApiError` with `code: "invalid-response"`.
- Date fields stay ISO strings (`z.iso.datetime()`).

### Errors

One `ApiError` class in `src/libs/ApiError.ts`:

| Field | Role |
| --- | --- |
| `code` | Stable app code (`network`, `unknown`, `invalid-response`, or a domain code from `models/`); always set |
| `message` | Fallback user-facing copy: the backend's safe message, else `FALLBACK_MESSAGE` |
| `status` | HTTP status when there is one |
| `cause` | The original error |

| Layer | Does |
| --- | --- |
| `src/api/` | Maps every failure to `ApiError`: `toApiError(err)` by default; endpoint-specific mapping inline in that function's `catch`; a pre-request check throws `ApiError` before the call |
| Feature hooks | Let `ApiError` propagate; never catch and reword |
| UI | Shows `error.message`, or maps `error.code` to its own copy; never parses transport errors |

### Query client

`src/common/query/client.ts` holds the one `queryClient`:

| Option | Value |
| --- | --- |
| `queries.retry` | No retry for an `ApiError` with a 4xx status; others up to 2 |
| `queries.staleTime` | 30 seconds |
| `mutations.retry` | None |
| `QueryCache` / `MutationCache` `onError` | 401 → the unauthorized handler per [setting-up-authentication.md](./setting-up-authentication.md); other unexpected errors → `reportError` per [managing-errors.md](./managing-errors.md) |

- React code reaches it through `useQueryClient()`. Only `App.tsx` and code outside React (sign-out, cache handlers) import `@/common/query/client`.
- `src/common/query/` augments TanStack Query's `Register` with `defaultError: ApiError` and typed `queryMeta` / `mutationMeta`.
- `src/common/query/` wires `focusManager` to `AppState` and `onlineManager` to `expo-network`.

### Query keys

- `src/common/query/keys/<domain>.ts` holds each domain's key factory, built from one `all` prefix `["<backend>", "<domain>"]`; `@/common/query` re-exports them.
- Every `queryKey` and every invalidation uses a factory, never an inline array.

### Queries and mutations

- Features own `useQuery` and `useMutation` in their `hooks/`; `queryFn` / `mutationFn` call module functions directly.
- The feature that owns a mutation decides which keys it invalidates; `onSuccess` returns the `invalidateQueries` promise so `isPending` covers the refetch.
- `useSuspenseQuery` is not used; surfaces render states per [creating-async-component.md](./creating-async-component.md).
- Whether a mutation's success or failure notifies the user comes from the requirements, through `notify()` per [managing-errors.md](./managing-errors.md).

### State placement

| Kind | Lives in |
| --- | --- |
| Data from an API | TanStack Query; never copied into client state |
| Route state that survives back navigation and deep links | Navigation params |
| UI owned by one component | `useState` / `useReducer` |
| Form values and validation | TanStack Form — [creating-form.md](./creating-form.md) |
| Client state shared across features (session, preferences) | One store in a `common` module, exposed by a hook from its barrel |

- Derive values in render when possible.
- Store semantic state (`isOpen`, `step`), not visual output (`opacity`).

### Dates

- The API and storage exchange ISO 8601 strings; instants are UTC.
- Serialize outbound values with `toISOString()`.
- Convert to the user's time zone only for display and input; display helpers live in `src/libs/`.

## Setup

```bash
node ../scripts/install-packages.cjs @tanstack/react-query zod
node ../scripts/run-package.cjs -- expo install expo-network
```

## Examples

### `ApiError`

```ts
export class ApiError extends Error {
  readonly code: string;
  readonly status?: number;

  constructor(init: { code: string; message: string; status?: number; cause?: unknown }) {
    super(init.message);
    this.name = "ApiError";
    this.code = init.code;
    this.status = init.status;
    this.cause = init.cause;
  }
}
```

### `parseResponse`

```ts
import type { z } from "zod";
import { ApiError } from "@/libs/ApiError";

export function parseResponse<T extends z.ZodType>(schema: T, data: unknown): z.infer<T> {
  const result = schema.safeParse(data);
  if (!result.success) {
    throw new ApiError({ code: "invalid-response", message: FALLBACK_MESSAGE, cause: result.error });
  }
  return result.data;
}
```

### Module function with inline mapping

```ts
import { ApiError } from "@/libs/ApiError";
import { client } from "../client";
import { ProfileErrorCode, ProfileSchema, type Profile } from "../models/profile";
import { parseResponse, toApiError } from "../utils";

export async function updateHandle(handle: string): Promise<Profile> {
  try {
    return parseResponse(ProfileSchema, await client.patch("/profile", { handle }));
  } catch (err) {
    if (err instanceof ApiError) throw err;
    const error = toApiError(err);
    if (error.status === 409) {
      throw new ApiError({
        code: ProfileErrorCode.HandleTaken,
        message: "This handle is already taken.",
        status: 409,
        cause: err,
      });
    }
    throw error;
  }
}
```

### `src/common/query/client.ts`

```ts
import { MutationCache, QueryCache, QueryClient } from "@tanstack/react-query";
import { reportError } from "@/common/errors";
import { ApiError } from "@/libs/ApiError";

let onUnauthorized = () => {};

export function setUnauthorizedHandler(handler: () => void) {
  onUnauthorized = handler;
}

const isClientError = (error: unknown) =>
  error instanceof ApiError && error.status !== undefined && error.status >= 400 && error.status < 500;

function handleError(error: unknown) {
  if (error instanceof ApiError && error.status === 401) onUnauthorized();
  else if (!isClientError(error)) reportError(error);
}

export const queryClient = new QueryClient({
  queryCache: new QueryCache({ onError: handleError }),
  mutationCache: new MutationCache({ onError: handleError }),
  defaultOptions: {
    queries: {
      staleTime: 30_000,
      retry: (failureCount, error) => !isClientError(error) && failureCount < 2,
    },
    mutations: { retry: false },
  },
});
```

### `src/common/query/register.ts`

```ts
import type { ApiError } from "@/libs/ApiError";

export interface QueryMeta extends Record<string, unknown> {}
export interface MutationMeta extends Record<string, unknown> {}

declare module "@tanstack/react-query" {
  interface Register {
    defaultError: ApiError;
    queryMeta: QueryMeta;
    mutationMeta: MutationMeta;
  }
}
```

### `src/common/query/managers.ts`

```ts
import { focusManager, onlineManager } from "@tanstack/react-query";
import * as Network from "expo-network";
import { AppState, Platform } from "react-native";

onlineManager.setEventListener((setOnline) => {
  const subscription = Network.addNetworkStateListener((state) => setOnline(!!state.isConnected));
  return () => subscription.remove();
});

AppState.addEventListener("change", (status) => {
  if (Platform.OS !== "web") focusManager.setFocused(status === "active");
});
```

`src/common/query/index.ts` imports `./managers` and `./register` once.

### Key factory

```ts
export const workshopKeys = {
  all: ["app-api", "workshops"] as const,
  list: () => [...workshopKeys.all, "list"] as const,
  detail: (id: string) => [...workshopKeys.all, "detail", id] as const,
};
```

### Query and mutation hooks

```ts
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { createWorkshop, getWorkshops } from "@/api/app-api";
import { workshopKeys } from "@/common/query";

export function useWorkshops() {
  return useQuery({ queryKey: workshopKeys.list(), queryFn: getWorkshops });
}

export function useCreateWorkshop() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: createWorkshop,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: workshopKeys.all }),
  });
}
```

## References

- [TanStack Query — React Native](https://tanstack.com/query/latest/docs/framework/react/react-native)
- [TanStack Query — TypeScript: registering types](https://tanstack.com/query/latest/docs/framework/react/typescript#registering-a-global-error)
