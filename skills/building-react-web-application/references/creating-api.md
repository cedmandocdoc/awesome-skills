# Creating API

## Overview

**Execution mode.** Keeps API code typed and independent from React. HTTP clients and request functions live in `src/api/`; features call them from hooks.

The transport is not fixed (Axios, `fetch`, Supabase, etc.). This doc defines **layer boundaries** and structure; client-specific setup lives in `client.ts` and optional companion references (e.g. [setting-up-axios.md](./setting-up-axios.md)).

## Prerequisites

- [managing-api-error.md](./managing-api-error.md)

## Guidelines

### Structure

Use hyphen-case backend folders under `src/api/`. One backend per folder. Group request functions by domain.

```text
src/libs/
└── ApiError.ts

src/api/<backend-name>/
├── client.ts       # configured HTTP client
├── env.ts          # parsed env vars for this backend
├── utils.ts        # shared helpers (< ~200 lines); split to utils/ when larger
├── models/
│   └── Workshop.ts
└── modules/
    └── workshops.ts
```

| File / folder | Role |
| ------------- | ---- |
| `env.ts` | Parse and export environment values (see [managing-environment.md](./managing-environment.md)). |
| `client.ts` | Export one shared client instance; read options from `env.ts`. |
| `utils.ts` / `utils/` | Shared helpers (`toApiError`, `FALLBACK_MESSAGE`). Split at ~200 lines. |
| `models/` | Request/response types and domain error enums. |
| `modules/` | Typed functions per domain; import the shared client from `client.ts`. |

### Client rules

- `src/api/` stays free of React and Zustand.
- Module functions import `client` from `client.ts`.
- Components use feature hooks — feature hooks call module functions (see [managing-state.md](./managing-state.md)).
- Use explicit return types on exported functions.

### Error handling

- Import `ApiError` from `@/libs/ApiError`; map failures to it in `src/api/` (see [managing-api-error.md](./managing-api-error.md)).
- Map transport-specific errors in `utils.ts`, `utils/`, or module `catch` blocks.

## Examples

### Axios module function

See [setting-up-axios.md](./setting-up-axios.md) for `createClient` and `responseData`.

```ts
import type { Workshop } from "../models/Workshop";
import { client, responseData } from "../client";
import { toApiError } from "../utils";

export async function getWorkshops(): Promise<Workshop[]> {
  try {
    return await responseData(client.get<Workshop[]>("/workshops"));
  } catch (err) {
    throw toApiError(err);
  }
}
```

### Supabase module function

```ts
import type { Workshop } from "../models/Workshop";
import { client } from "../client";
import { toApiError } from "../utils";

export async function getWorkshops(): Promise<Workshop[]> {
  try {
    const { data, error } = await client.from("workshops").select("*");
    if (error) throw error;
    return data ?? [];
  } catch (err) {
    throw toApiError(err);
  }
}
```

## Related

- [managing-state.md](./managing-state.md) — query hooks call module functions from feature hooks
- [managing-api-error.md](./managing-api-error.md) — `ApiError` mapping
- [setting-up-axios.md](./setting-up-axios.md) — Axios client setup
