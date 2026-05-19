# Creating API

## Overview

Use this guide to keep API code small, typed, and independent from React. Put HTTP clients and request functions in `src/api/`, then call them from feature hooks.

## Prerequisites

- [setting-up-axios.md](./setting-up-axios.md)
- [managing-api-error.md](./managing-api-error.md)

## Guidelines

### Structure

- Use hyphen-case backend folders under `src/api/`.
- Keep one backend per folder.
- Group request functions by domain.

```text
src/api/<backend-name>/
├── client.ts
├── env.ts
├── utils.ts
├── models/
│   ├── ApiError.ts
│   └── Workshop.ts
└── modules/
    └── workshops.ts
```

### Client rules

- Do not import React, features, or stores inside `src/api/`.
- Use Axios with `createClient` and `responseData`.
- Keep one shared `AxiosInstance` per backend.
- Use explicit return types on exported functions.

### Error handling

- Map failures to **`ApiError`** in `src/api/`; see [managing-api-error.md](./managing-api-error.md).
- Do not parse Axios or invent user-facing copy in feature hooks or components.

## Examples

### Write typed API functions

```ts
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

### Use API code from a feature hook

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

### Keep components unaware of Axios

- Let components use feature hooks.
- Do not call Axios directly from presentational components.
