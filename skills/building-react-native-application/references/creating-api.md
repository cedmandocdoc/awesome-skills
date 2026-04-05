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
├── modules/
│   └── workshops.ts
└── models/
    └── Workshop.ts
```

### Client rules

- Do not import React, features, or stores inside `src/api/`.
- Use Axios with `createClient` and `responseData`.
- Keep one shared `AxiosInstance` per backend.
- Use explicit return types on exported functions.

### Error handling

- Use `axios.isAxiosError(err)` for request errors.
- Read status and payload from `err.response`.
- Do not create a custom API error class unless the app needs one.

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
