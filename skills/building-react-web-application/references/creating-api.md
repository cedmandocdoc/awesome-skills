# Creating API

## Overview

Use this guide to keep API code small, typed, and independent from React. Put HTTP clients and request functions in `src/api/`, then call them from feature hooks.

## Prerequisites

- [setting-up-axios.md](./setting-up-axios.md)

## Guidelines

### Structure

- Use hyphen-case backend folders under `src/api/`.
- Keep one backend per folder.
- Group request functions by domain.

```text
src/api/<backend-name>/
├── client.ts
├── env.ts
├── modules/
│   └── workshops.ts
└── models/
    └── Workshop.ts
```

### Client rules

- Keep `src/api/` free of React, feature modules, and Zustand stores.
- Use Axios with `createClient` and `responseData`.
- Keep one shared `AxiosInstance` per backend.
- Use explicit return types on exported functions.

### Error handling

- Use `axios.isAxiosError(err)` for request errors.
- Read status and payload from `err.response`.
- Add a custom API error type only when the product needs one.

## Examples

### Write typed API functions

```ts
import type { AxiosInstance } from "axios";
import type { Workshop } from "../models/Workshop";
import { responseData } from "../client";

export async function getWorkshops(client: AxiosInstance): Promise<Workshop[]> {
  return responseData(client.get<Workshop[]>("/workshops"));
}
```

### Use API code from a feature hook

```ts
import { useQuery } from "@tanstack/react-query";
import { createClient } from "@/api/app-api/client";
import { env } from "@/api/app-api/env";
import { getWorkshops } from "@/api/app-api/modules/workshops";

const client = createClient({ baseURL: env.VITE_API_URL });

export function useWorkshops() {
  return useQuery({
    queryKey: ["app-api", "workshops", "list"],
    queryFn: () => getWorkshops(client),
  });
}
```

### Keep components unaware of Axios

- Presentational components use feature hooks; HTTP stays in hooks and `src/api/`.
