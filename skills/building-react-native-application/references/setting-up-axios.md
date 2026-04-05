# Setting Up Axios

## Overview

Axios for Expo via a small client factory and env-based base URL and options—one place to grow auth, timeouts, and interceptors.

## Steps

### Install Axios

```bash
npm install axios
```

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

### Add environment variables

- Use `EXPO_PUBLIC_*` for public API config only.
- Do not store secrets in `EXPO_PUBLIC_*` variables.

```bash
EXPO_PUBLIC_API_URL=http://localhost:3000
```
