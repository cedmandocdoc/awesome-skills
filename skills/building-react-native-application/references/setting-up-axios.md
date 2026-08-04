# Setting Up Axios

## Overview

**Execution mode.** Install Axios and create a small client factory with env-based base URL — one place to grow auth, timeouts, and interceptors.

## Prerequisites

- [managing-environment.md](./managing-environment.md)

## Guidelines

### Install

```bash
node ../scripts/install-packages.cjs axios
```

### Create client factory

Write `src/api/<backend-name>/client.ts`:

```ts
import axios from "axios";
import type { AxiosInstance, AxiosResponse } from "axios";

interface ClientConfig {
  baseURL: string;
  withCredentials?: boolean;
}

export function createClient({
  baseURL,
  withCredentials = true,
}: ClientConfig): AxiosInstance {
  return axios.create({ baseURL, timeout: 30000, withCredentials });
}

export async function responseData<T>(
  promise: Promise<AxiosResponse<T>>,
): Promise<T> {
  return (await promise).data;
}
```

### Environment variables

- Use `EXPO_PUBLIC_*` for public API config only.
- Secrets must not be stored in `EXPO_PUBLIC_*` variables.

```bash
EXPO_PUBLIC_API_URL=http://localhost:3000
```

### Wire client to env

Export the shared `client` instance using parsed env (see [managing-environment.md](./managing-environment.md#wire-api-client-to-parsed-env)).
