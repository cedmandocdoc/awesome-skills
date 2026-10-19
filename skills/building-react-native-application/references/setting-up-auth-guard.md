# Setting Up Auth Guard

## Overview

**Execution mode.** Guards signed-in screens in the route layer: one session provider, static-config groups switched by session state, and a startup that waits for the stored session.

## Prerequisites

- [creating-screen.md](./creating-screen.md) — route layer

## Guidelines

### Session

- One app-level provider in `src/features/auth/` restores the stored session at startup and exposes `useSession()` from the feature barrel, with `status` of `restoring`, `signed-in`, or `signed-out`. The auth SDK comes from the TRD.
- `useIsSignedIn` and `useIsSignedOut` in the same feature derive from `status`.
- Signing out clears the TanStack Query cache with `queryClient.clear()`.

### Guard

- The route layer alone gates access: screens never check auth or navigate to sign-in.
- The root navigator splits screens into groups with `if: useIsSignedIn` and `if: useIsSignedOut`; React Navigation swaps the groups when the session changes, with no redirect.
- Nothing renders while `status` is `restoring`; the splash stays up per [managing-platform-fixes.md](./managing-platform-fixes.md).

## Examples

### Root navigator

```tsx
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { SignInScreen, useIsSignedIn, useIsSignedOut } from "@/features/auth";
import { MainBottomNavigator } from "./MainBottomNavigator";

export const RootStackNavigator = createNativeStackNavigator({
  groups: {
    SignedIn: {
      if: useIsSignedIn,
      screens: { Main: MainBottomNavigator },
    },
    SignedOut: {
      if: useIsSignedOut,
      screens: { SignIn: SignInScreen },
    },
  },
});
```

### Session hooks

```ts
export function useIsSignedIn() {
  return useSession().status === "signed-in";
}

export function useIsSignedOut() {
  return useSession().status === "signed-out";
}

export function useSignOut() {
  const queryClient = useQueryClient();
  const session = useSession();

  return async () => {
    await session.signOut();
    queryClient.clear();
  };
}
```

## References

- [React Navigation — Authentication flows (static)](https://reactnavigation.org/docs/auth-flow.md?config=static)
