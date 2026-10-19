# Managing Data

## Overview

The API layer, the normalized error, server and client state placement, and dates at the API boundary.

## Prerequisites

- [managing-environment.md](./managing-environment.md) — `env.ts` per backend

## Guidelines

### API layer

```text
src/libs/ApiError.ts

src/api/<backend-name>/
├── client.ts       # one shared client, configured from env.ts
├── env.ts
├── utils.ts        # toApiError, FALLBACK_MESSAGE → utils/ when > ~200 lines
├── models/         # request/response types, domain error codes
└── modules/        # request functions per domain
```

- `src/api/` imports no React, features, or app state.
- One backend per hyphen-case folder; one shared client per backend; the transport (`fetch`, an SDK) comes from the TRD.
- Module functions import `client` from `client.ts` and declare return types.
- Add role folders (`interceptors/`, `schemas/`) when grouping helps.

### Errors

One `ApiError` class in `src/libs/ApiError.ts`:

| Field | Role |
| --- | --- |
| `code` | Stable app code (`network`, `unknown`, or a domain code from `models/`); always set |
| `message` | Fallback user-facing copy: the backend's safe message, else `FALLBACK_MESSAGE` |
| `status` | HTTP status when there is one |
| `cause` | The original error |

| Layer | Does |
| --- | --- |
| `src/api/` | Maps every failure to `ApiError`: `toApiError(err)` by default; endpoint-specific mapping inline in that function's `catch`; a pre-request check throws `ApiError` before the call |
| Feature hooks | Let `ApiError` propagate; never catch and reword |
| UI | Shows `error.message`, or maps `error.code` to its own copy; never parses transport errors |

### Server state

- TanStack Query owns server data; query and mutation hooks live in `src/features/<feature>/hooks/`.
- `queryFn` / `mutationFn` call module functions directly; keys start with backend and domain: `["app-api", "workshops", "list"]`.
- Server data is never copied into client state; derive from the query instead.

### State placement

| Kind | Lives in |
| --- | --- |
| Data from an API | TanStack Query |
| State shared by link, bookmarked, or restored on refresh | Path params and validated search params |
| UI owned by one component | `useState` / `useReducer` |
| Form values and validation | TanStack Form — [creating-form.md](./creating-form.md) |
| Client state shared across features (session, preferences) | One store owned by a feature, exposed by a hook from its barrel |

- Derive values in render when possible.
- Store semantic state (`isOpen`, `step`), not visual output (`opacity`).

### Dates

- The API and storage exchange ISO 8601 strings; instants are UTC.
- Parse at the API boundary and validate before use; serialize outbound values with `toISOString()`.
- Convert to the user's time zone only for display and input; display helpers live in `src/libs/`.

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

### Module function with inline mapping

```ts
import { ApiError } from "@/libs/ApiError";
import { client } from "../client";
import { ProfileErrorCode, type Profile } from "../models/Profile";
import { toApiError } from "../utils";

export async function updateHandle(handle: string): Promise<Profile> {
  try {
    return await client.patch<Profile>("/profile", { handle });
  } catch (err) {
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
