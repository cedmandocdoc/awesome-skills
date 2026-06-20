# Creating API

## Overview

Use this guide to keep API code small, typed, and independent from React. Put HTTP clients and request functions in `src/api/`, then call them from feature hooks.

The transport is not fixed: use Axios, `fetch`, Supabase, or another client. This doc defines **layer boundaries** and a default structure; client-specific setup lives in `client.ts` and optional companion references (for example [setting-up-axios.md](./setting-up-axios.md)).

## Prerequisites

- [managing-api-error.md](./managing-api-error.md)

## Guidelines

### Structure

The layout below is the **default starting point**, not a closed set. Add files or folders when multiple pieces share the same role (for example `interceptors/` for auth refresh logic, or `schemas/` for request validation).

- Use hyphen-case backend folders under `src/api/`.
- Keep one backend per folder.
- Group request functions by domain.

```text
src/libs/
└── ApiError.ts

src/api/<backend-name>/
├── client.ts       # create and export the configured HTTP client
├── env.ts          # parsed env vars for this backend
├── utils.ts        # shared helpers when small (< ~200 lines total)
├── utils/          # one file per helper when utils grow (e.g. toApiError.ts)
├── models/
│   └── Workshop.ts
└── modules/
    └── workshops.ts
```

| File / folder | Role |
| ------------- | ---- |
| `env.ts` | Parse and export environment values for this backend (see [managing-environment.md](./managing-environment.md)). |
| `client.ts` | Create and export one shared client instance for the backend; read options from `env.ts`. |
| `utils.ts` / `utils/` | Shared helpers such as `toApiError` and `FALLBACK_MESSAGE`. |
| `models/` | Request/response types and domain error enums. |
| `modules/` | Typed functions per domain; import and use the shared client from `client.ts`. |

### Layout rules

- Start shared helpers in `utils.ts` (error mappers, response parsers). Split into `utils/<helperName>.ts` when the file exceeds **~200 lines** or helpers are easier to find by name — same rule as [creating-feature.md](./creating-feature.md).
- Start shared types in `models/<Domain>.ts`; add a `models/` subfolder or split files when types grow.
- Add role-based folders (`interceptors/`, `schemas/`, `mappers/`, etc.) when grouping improves clarity.

### Client rules

- Keep `src/api/` free of React, feature modules, and Zustand stores.
- Configure the HTTP client in `client.ts`; export one shared `client` instance per backend (see [managing-environment.md](./managing-environment.md#wire-api-client-to-parsed-env)).
- Module functions import `client` from `client.ts`—do not accept the client as a parameter.
- Use explicit return types on exported functions.

### Error handling

- Import **`ApiError`** from `@/libs/ApiError`; map failures to it in `src/api/` (see [managing-api-error.md](./managing-api-error.md)).
- Map transport-specific errors in `utils.ts`, `utils/`, or module `catch` blocks—not in feature hooks or components.
- Do not invent user-facing copy in feature hooks or components.

## Examples

### Example: Axios module function

When using Axios, see [setting-up-axios.md](./setting-up-axios.md) for `createClient` and `responseData`.

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

### Example: Supabase module function

When using Supabase, configure and export the shared client in `client.ts`; module functions import it the same way.

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

### Use API code from a feature hook

Feature hooks call module functions directly—the shared client stays inside `src/api/`.

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

### Keep components unaware of the HTTP client

- Presentational components use feature hooks; HTTP stays in hooks and `src/api/`.
- Do not call the transport client directly from presentational components.
