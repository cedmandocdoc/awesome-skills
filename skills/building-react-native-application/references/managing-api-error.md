# Managing API Error

## Overview

Use this guide to keep **user-facing error copy** in `src/api/` and keep TanStack Query and UI layers thin. Every failed API call throws the same error type; hooks pass it through; screens and async wrappers only decide **where** and **when** to show `error.message`.

## Prerequisites

- [creating-api.md](./creating-api.md)
- [setting-up-axios.md](./setting-up-axios.md)

## Error contract

The project uses a single **`ApiError`** class that **extends `Error`**.

| Field / behavior | Role |
| ---------------- | ---- |
| `message` | **Always** the user-facing copy. UI reads this string only. |
| `name` | `"ApiError"` (set in the constructor). |
| `status` | Optional HTTP status (for logging, branching in the API layer, or analytics—not for inventing new UI copy in components). |
| `code` | Optional **app-level** code (usually a domain enum member). Not raw transport/Supabase strings in UI. |
| `cause` | Optional original error (Axios, Supabase, network, etc.) for debugging. |

**Why not a plain `Error` only?** A bare `Error` works for `message`, but the API layer also needs a stable place for app codes and status while keeping `instanceof Error` true for TanStack Query.

**Why not many error classes?** One `ApiError` keeps every `queryFn` and mutation handler consistent.

### Folder layout

```text
src/api/<backend-name>/
├── client.ts       # Axios instance, Supabase client, or fetch wrapper
├── env.ts          # validated env for this backend
├── utils.ts        # toApiError, isApiError, responseData, shared helpers
├── models/         # Zod schemas / interfaces; ApiError; domain error enums
│   ├── ApiError.ts
│   ├── Profile.ts  # Profile model + ProfileError enum (example)
│   └── Workshop.ts
└── modules/        # one exported function per endpoint call
    ├── profile.ts
    └── workshops.ts
```

- **`models/ApiError.ts`** — shared `ApiError` class and `isApiError`.
- **`models/<Domain>.ts`** — domain types; add **`<Domain>Error` enum** only when that domain needs app codes for rare UI branching.
- **`utils.ts`** — `toApiError(err)` for the default path (most endpoints).
- **`modules/<domain>.ts`** — endpoint functions; **inline** custom mapping in the function `catch` when this call needs it (no separate `*.errors.ts` files).

```ts
// src/api/app-api/models/ApiError.ts
export class ApiError extends Error {
  readonly status?: number;
  readonly code?: string;

  constructor(
    message: string,
    options?: { status?: number; code?: string; cause?: unknown },
  ) {
    super(message, options?.cause != null ? { cause: options.cause } : undefined);
    this.name = "ApiError";
    this.status = options?.status;
    this.code = options?.code;
  }
}

export function isApiError(error: unknown): error is ApiError {
  return error instanceof ApiError;
}
```

```ts
// src/api/app-api/models/Profile.ts
export type Profile = { id: string; displayName: string };

/** App-level codes for profile flows. Map transport/BE codes to these in modules/profile.ts. */
export enum ProfileError {
  NotFound = "PROFILE_NOT_FOUND",
  HandleTaken = "PROFILE_HANDLE_TAKEN",
}
```

## Responsibilities

| Layer | Owns | Does not own |
| ----- | ---- | ------------- |
| **`src/api/`** | Catching transport/service failures, mapping to `ApiError`, choosing **user-facing `message`** (reuse backend copy when valid; otherwise a safe fallback). | React, navigation, toasts vs inline layout. |
| **Feature hooks** (`useQuery` / `useMutation`) | Calling API functions; letting failures propagate. | Rewriting error messages for display. |
| **Screens / async UI** | Passing `query.error` into wrappers; showing `error.message` (or a dedicated error slot) on initial failure. | Parsing Axios, reading `response.data`, or duplicating fallback strings. |

## Mapping rules (API layer)

Implement a single helper (for example `toApiError(err: unknown): ApiError`) and use it at the boundary of every exported API function (or inside `responseData` if the project centralizes there).

1. **Reuse backend user copy** when the endpoint or downstream service already returns a safe, human-readable message (for example `response.data.message` or a documented `error` field). Do not paraphrase it in the UI.
2. **Map only when needed** — unknown status, missing payload, network offline, or non-user-facing technical text. Substitute a short, generic fallback (for example “Something went wrong. Please try again.”).
3. **Always throw `ApiError`** from exported API functions on failure. Do not throw raw Axios errors or opaque `unknown` values to TanStack Query.
4. **Success path** returns typed data only; no error object on success.
5. **Rare custom rules** — inline in that endpoint’s `modules/*.ts` function; still throw `ApiError` (see [Custom mapping (per endpoint)](#custom-mapping-per-endpoint)).

### Default path: `utils.toApiError`

Keep transport parsing in **`utils.ts`**. Most module functions only need `catch { throw toApiError(err) }`.

```ts
// src/api/app-api/utils.ts
import axios from "axios";
import { ApiError } from "./models/ApiError";

type ErrorBody = { message?: string; error?: string; code?: string };

const FALLBACK_MESSAGE = "Something went wrong. Please try again.";

export function toApiError(err: unknown): ApiError {
  if (err instanceof ApiError) return err;

  if (axios.isAxiosError<ErrorBody>(err)) {
    const status = err.response?.status;
    const body = err.response?.data;
    const fromServer = body?.message ?? body?.error;
    const message =
      typeof fromServer === "string" && fromServer.trim().length > 0
        ? fromServer.trim()
        : FALLBACK_MESSAGE;

    return new ApiError(message, {
      status,
      code: typeof body?.code === "string" ? body.code : undefined,
      cause: err,
    });
  }

  if (err instanceof Error && err.message.trim().length > 0) {
    return new ApiError(err.message, { cause: err });
  }

  return new ApiError(FALLBACK_MESSAGE, { cause: err });
}
```

```ts
// src/api/app-api/modules/workshops.ts
import type { AxiosInstance } from "axios";
import type { Workshop } from "../models/Workshop";
import { responseData } from "../client";
import { toApiError } from "../utils";

export async function getWorkshops(client: AxiosInstance): Promise<Workshop[]> {
  try {
    return await responseData(client.get<Workshop[]>("/workshops"));
  } catch (err) {
    throw toApiError(err);
  }
}
```

Adjust `ErrorBody` in `utils.ts` to match the backend contract. When the transport changes (for example Supabase → REST), update **`utils.ts` and the rare inline maps** in `modules/`—not feature hooks or screens.

### App codes vs transport codes

| | Transport (Supabase, REST, etc.) | App (`models` + `ApiError.code`) |
| --- | --- | --- |
| **Where parsed** | Inside `modules/<domain>.ts` when handling `catch` | Set on `new ApiError(…, { code: ProfileError.… })` |
| **Stability** | Changes when BE changes | Stays stable for UI when you remap |
| **UI usage** | Never branch on raw transport strings | Branch on domain enum **only** when layout/flow differs; otherwise use `message` |

## Custom mapping (per endpoint)

Custom mapping is **uncommon**. Use it only when `toApiError` cannot produce the right `message` or app `code` for **that** endpoint.

**Placement:** inside the **same** `modules/*.ts` function body—in the `catch` block or immediately before `throw`. Do **not** add separate `*.errors.ts` files or shared `mapXxxError` helpers unless several endpoints share identical logic (still prefer a small helper in `utils.ts` over a new file).

### When to inline custom mapping

| Situation | Approach |
| --------- | -------- |
| Safe user copy already on the payload | `throw toApiError(err)` only. |
| Transport code/message is not user-facing | Inline: map transport → `ProfileError` + user `message`, then `throw new ApiError(…)`. |
| Pre-request validation (missing id, bad args) | `throw new ApiError("…", { code: ProfileError.… })` before the network call. |
| UI needs a stable app code for a rare flow | Set `code` from the domain enum in `models/<Domain>.ts`; branch in UI only when needed. |

### Example: inline mapping in the endpoint function

```ts
// src/api/app-api/modules/profile.ts
import type { AxiosInstance } from "axios";
import axios from "axios";
import { ApiError } from "../models/ApiError";
import { ProfileError, type Profile } from "../models/Profile";
import { responseData } from "../client";
import { toApiError } from "../utils";

type ProfileErrorBody = { code?: string; message?: string };

export async function updateProfileHandle(
  client: AxiosInstance,
  handle: string,
): Promise<Profile> {
  try {
    return await responseData(
      client.patch<Profile>("/profiles/me", { handle }),
    );
  } catch (err) {
    if (axios.isAxiosError<ProfileErrorBody>(err) && err.response?.status === 409) {
      throw new ApiError("This handle is already taken.", {
        status: 409,
        code: ProfileError.HandleTaken,
        cause: err,
      });
    }
    throw toApiError(err);
  }
}
```

### Example: pre-request validation

```ts
export async function getProfile(
  client: AxiosInstance,
  profileId: string | undefined,
): Promise<Profile> {
  if (!profileId) {
    throw new ApiError("Profile not found.", { code: ProfileError.NotFound });
  }

  try {
    return await responseData(client.get<Profile>(`/profiles/${profileId}`));
  } catch (err) {
    throw toApiError(err);
  }
}
```

### Rules for custom mapping

1. **Output is always `ApiError`** — never throw strings, plain `Error`, or transport errors to TanStack Query.
2. **`message` is final user copy** — set in the module function; UI does not reword.
3. **`code` uses domain enums from `models/`** when the product needs a stable app code; map transport values inline in that endpoint’s `catch`.
4. **Fall back to `toApiError(err)`** when no special case matches.
5. **Do not map in feature hooks** — endpoint functions own all copy and code translation.

## TanStack Query

`queryFn` and `mutationFn` call API functions directly. Do not wrap or remap errors in the hook unless the hook adds **non-HTTP** failure modes that also produce `ApiError`.

```ts
import { useQuery } from "@tanstack/react-query";
import { createClient } from "@/api/app-api/client";
import { env } from "@/api/app-api/env";
import { getWorkshops } from "@/api/app-api/modules/workshops";

const client = createClient({ baseURL: env.EXPO_PUBLIC_API_URL });

export function useWorkshops() {
  return useQuery({
    queryKey: ["app-api", "workshops", "list"],
    queryFn: () => getWorkshops(client),
  });
}
```

On failure, `query.error` (and `mutation.error`) is **`ApiError`** in normal operation. Type it in UI code with `isApiError` when narrowing from `unknown`.

| Concern | Rule |
| ------- | ---- |
| **Initial load error** | Treat `query.isError` as failed first fetch; display `query.error.message` in async wrappers (see [managing-async-view.md](./managing-async-view.md)). |
| **Pull-to-refresh / background refetch** | Do not replace the whole screen with a new message; keep showing cached data (see managing-async-view). Optional toast is a **placement** choice, not a new copy source. |
| **Mutations** | Show `mutation.error.message` next to the submit control or in a toast; still do not re-map Axios in the component. |
| **Retries** | `retry` in `QueryClient` defaults is fine; the last failure still surfaces as `ApiError`. |

### Wiring async UI

Pass the query error through unchanged; read the message at the leaf that renders text:

```tsx
const workshops = useWorkshops();

<AsyncView
  isLoading={workshops.isLoading}
  error={workshops.isError ? workshops.error : undefined}
  reload={() => void workshops.refetch()}
>
  {/* ... */}
</AsyncView>
```

```tsx
import { isApiError } from "@/api/app-api/models/ApiError";

function ErrorMessage({ error }: { error: unknown }) {
  const message = isApiError(error)
    ? error.message
    : "Something went wrong. Please try again.";
  return <Text className="text-center text-destructive">{message}</Text>;
}
```

Use the fallback in `ErrorMessage` only as a last resort for unexpected non-API failures; the API layer should prevent those in query paths.

## Checklist

- [ ] Backend folder uses `client.ts`, `env.ts`, `utils.ts`, `models/`, `modules/`.
- [ ] `ApiError` and `isApiError` live in `models/ApiError.ts`.
- [ ] `toApiError` lives in `utils.ts`; most endpoints use it in `catch`.
- [ ] Domain error enums live in `models/<Domain>.ts` only when needed.
- [ ] Rare custom mapping is inline in the endpoint’s `modules/*.ts` function, not in separate mapper files.
- [ ] Every exported module function throws `ApiError` on failure.
- [ ] Endpoint-specific copy and transport → app code mapping stay in `modules/`, not hooks or components.
- [ ] User-facing copy is finalized in the API layer; backend messages are reused when present.
- [ ] Feature `queryFn` / `mutationFn` do not catch and reword errors for display.
- [ ] UI and async wrappers use `error.message` (with `isApiError` when narrowing), not Axios types or `response.data`.
