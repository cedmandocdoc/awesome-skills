# Setting Up Auth Guard

## Overview

**Execution mode.** Guards screens in the route layer: ordered gates between signed-in and full access, root navigator groups switched by session and gates, public screens, deep links kept until their screen is available, and authorization at the navigator owning a scope.

## Prerequisites

- [setting-up-authentication.md](./setting-up-authentication.md) — session
- [creating-screen.md](./creating-screen.md) — route layer, `linking`

## Guidelines

### Gates

- Session status stays authentication only; every other access step is a gate.
- `src/common/auth/gates.ts` declares the app's gates in order: each has an `id`, a condition over the gate input (session, plus query data such as the profile), and the root group it resolves to.
- `firstFailingGate(input)` returns the first gate whose condition fails, else `null`.
- A gate input that needs a query uses query options in `src/common/auth/` with a key from `@/common/query`.
- `useIsGate(id)` is true when the session is signed in and `id` is the first failing gate; `useHasFullAccess()` is true when signed in with no failing gate; `useIsSignedOut()` derives from the session.
- `useGateInput()` returns `{ ready, input }`; the splash stays until `ready`, so no group renders on partial input.

### Guarded routes

`RootStackNavigator` declares, in static config:

| Group | `if` | Holds |
| --- | --- | --- |
| `Public` | none | Screens open in both states: legal pages, invite links, the not-found fallback |
| `SignedOut` | `useIsSignedOut` | Sign-in and sign-up |
| One per gate | `useIsGate("<id>")` | The screens that resolve that gate |
| `SignedIn` | `useHasFullAccess` | The app's main navigator |

- React Navigation swaps groups when the session or a gate changes, with no redirect; screens never check auth or navigate to sign-in.
- The root config sets `UNSTABLE_routeNamesChangeBehavior: "lastUnhandled"`, so a deep link to a screen not yet available opens once its group appears (after sign-in or a gate). It is experimental and may change in a minor release.

### Cases

| Case | Structure |
| --- | --- |
| Signed in but not finished (profile setup) | A gate whose condition reads the profile query; its group holds the setup screen |
| Temporary access (invite → set password) | A `Public` screen that checks its own token with a query |
| Open in both states | A `Public` screen |
| Scoped authorization (tenant, role) | The navigator screen owning the scope reads the scope's query through `AsyncView` and renders its navigator only when allowed; never on the session |

What a denied scope shows comes from the requirements.

## Examples

### `src/common/auth/gates.ts`

```ts
import type { Session } from "./session";

export interface GateInput {
  session: Session;
  profile?: { completedAt: string | null };
}

export const GATES = [
  { id: "profile-setup", passes: (input: GateInput) => !!input.profile?.completedAt },
] as const;

export type GateId = (typeof GATES)[number]["id"];

export function firstFailingGate(input: GateInput) {
  return GATES.find((gate) => !gate.passes(input)) ?? null;
}
```

### Root navigator

```tsx
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { useHasFullAccess, useIsGate, useIsSignedOut } from "@/common/auth";
import { InviteScreen } from "@/features/invite";
import { NotFoundScreen } from "@/features/not-found";
import { ProfileSetupScreen } from "@/features/profile-setup";
import { SignInScreen } from "@/features/sign-in";
import { MainBottomNavigator } from "./MainBottomNavigator";

export const RootStackNavigator = createNativeStackNavigator({
  UNSTABLE_routeNamesChangeBehavior: "lastUnhandled",
  groups: {
    Public: {
      screens: {
        Invite: { screen: InviteScreen, linking: "invite/:token" },
        NotFound: { screen: NotFoundScreen, linking: "*" },
      },
    },
    SignedOut: {
      if: useIsSignedOut,
      screens: { SignIn: SignInScreen },
    },
    ProfileSetup: {
      if: () => useIsGate("profile-setup"),
      screens: { ProfileSetup: ProfileSetupScreen },
    },
    SignedIn: {
      if: useHasFullAccess,
      screens: { Main: MainBottomNavigator },
    },
  },
});
```

## References

- [React Navigation — Authentication flows (static)](https://reactnavigation.org/docs/auth-flow.md?config=static)
