# Creating API

## Overview

Keep API code small, typed, and independent from React. Put HTTP clients and request functions in `src/api/`, then call them from feature hooks.

The transport is not fixed (Axios, `fetch`, Supabase, etc.). This doc defines layer boundaries and a default structure; client-specific setup lives in `client.ts` and companion references (e.g. [setting-up-axios.md](./setting-up-axios.md)).

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
├── utils.ts        # shared helpers (< ~200 lines)
├── utils/          # one file per helper when utils grow
├── models/
│   └── Workshop.ts
└── modules/
    └── workshops.ts
```

| File / folder | Role |
| --- | --- |
| `env.ts` | Parse and export environment values (see [managing-environment.md](./managing-environment.md)). |
| `client.ts` | Create and export one shared client instance; read options from `env.ts`. |
| `utils.ts` / `utils/` | Shared helpers (`toApiError`, `FALLBACK_MESSAGE`). |
| `models/` | Request/response types and domain error enums. |
| `modules/` | Typed functions per domain; import the shared client from `client.ts`. |

### Layout rules

- Start shared helpers in `utils.ts`. Split into `utils/<helperName>.ts` when the file exceeds ~200 lines — same rule as [creating-feature.md](./creating-feature.md).
- Start shared types in `models/<Domain>.ts`; split files when types grow.
- Add role-based folders (`interceptors/`, `schemas/`, etc.) when grouping improves clarity.

### Client rules

- Do not import React, features, or stores inside `src/api/`.
- Configure the HTTP client in `client.ts`; export one shared `client` instance per backend (see [managing-environment.md](./managing-environment.md#wire-api-client-to-parsed-env)).
- Module functions import `client` from `client.ts` — do not accept the client as a parameter.
- Use explicit return types on exported functions.

### Error handling

- Import `ApiError` from `@/libs/ApiError`; map failures to it in `src/api/` (see [managing-api-error.md](./managing-api-error.md)).
- Map transport-specific errors in `utils.ts`, `utils/`, or module `catch` blocks — not in feature hooks or components.

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

### Feature hook usage

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
