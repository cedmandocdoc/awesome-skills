# Setting Up Axios

## Overview

**Execution mode.** Sets up Axios with a small client factory and env-based configuration — one place to grow auth, timeouts, and interceptors.

## Guidelines

### Create a client

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

Read base URL and client config through a parsed `env` module per [managing-environment.md](./managing-environment.md). Export the shared `client` instance from `client.ts` using that parsed env.

## Setup

```bash
node ../scripts/install-packages.cjs axios
```
