# Setting Up Authentication

## Overview

**Execution mode.** Builds the session in `src/common/auth/`: restoring it at startup, the token every API call carries, sign-in and sign-out, and a 401 that ends the session. The mechanism (password, magic link, OAuth, SDK) comes from the TRD.

## Prerequisites

- [managing-data.md](./managing-data.md) — API client, `queryClient`, unauthorized handler

## Guidelines

### Session

- `SessionProvider` restores the stored session at startup and exposes `useSession()` with `status` of `restoring`, `signed-in`, or `signed-out`.
- Nothing renders while `status` is `restoring`; the splash stays per [managing-platform-fixes.md](./managing-platform-fixes.md).
- The session holds identity only: status, user id, and what the SDK needs. The profile is a query.
- The session state lives in a module store in `src/common/auth/` so code outside React (`expire`) can change it; `useSession()` subscribes to it.

### Token

- Each API client declares `setTokenProvider(provider)` and attaches the token it returns to every request; `src/api/` never imports the auth SDK.
- `src/common/auth/` registers the provider before the session restores; cookie auth registers a provider that returns `null`.
- Token refresh, when the SDK does it, happens inside the API client before it maps errors.
- Tokens persist only in Expo SecureStore, never in the query cache or app-written AsyncStorage.

### Sign-in and sign-out

- Sign-in calls the SDK and sets the session; React Navigation swaps the root groups per [setting-up-auth-guard.md](./setting-up-auth-guard.md).
- Sign-out calls the SDK, sets `signed-out`, and calls `queryClient.clear()`.
- `expire()` signs out locally with no server call; `src/common/auth/` registers it with `setUnauthorizedHandler`, so a 401 from any query or mutation ends the session.

## Setup

```bash
node ../scripts/run-package.cjs -- expo install expo-secure-store
```

## Examples

### `src/common/auth/session.ts`

```ts
import { queryClient, setUnauthorizedHandler } from "@/common/query/client";
import { setTokenProvider } from "@/api/app-api";

export type SessionStatus = "restoring" | "signed-in" | "signed-out";

export interface Session {
  status: SessionStatus;
  userId?: string;
}

let session: Session = { status: "restoring" };
const listeners = new Set<() => void>();

export function setSession(next: Session) {
  session = next;
  listeners.forEach((listener) => listener());
}

export const getSession = () => session;

export function subscribe(listener: () => void) {
  listeners.add(listener);
  return () => listeners.delete(listener);
}

export function expire() {
  setSession({ status: "signed-out" });
  queryClient.clear();
}

setTokenProvider(() => authSdk.getAccessToken());
setUnauthorizedHandler(expire);
```

`authSdk` stands for the TRD's SDK; `SessionProvider` restores through it and calls `setSession`, and `useSession()` reads the store with `useSyncExternalStore(subscribe, getSession)`.

### API client token provider

```ts
type TokenProvider = () => Promise<string | null>;

let getToken: TokenProvider = async () => null;

export function setTokenProvider(provider: TokenProvider) {
  getToken = provider;
}

async function headers() {
  const token = await getToken();
  return token ? { Authorization: `Bearer ${token}` } : {};
}
```

## References

- [Expo — SecureStore](https://docs.expo.dev/versions/latest/sdk/securestore/)
