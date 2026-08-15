# Creating Variant

## Overview

**Execution mode.** Fills declared slots on an existing Expo runtime. An identity-only host is a valid variant. A new home screen is the same mechanism with a larger slot.

## Prerequisites

[composition-contract.md](./composition-contract.md) — terms, product API, **Require managing-monorepo**.

## Guidelines

### 1. Resolve the runtime

Find the JIT Expo package that exports the app factory and slot factories (`createRuntimeApp`, config factory, navigator factories). Confirm `exports` subpaths with dependency `managing-monorepo`.

### 2. Choose package shape

| Case | Layout |
| --- | --- |
| Identity-only product | One host package fills identity and wraps toolchain config |
| New screens or extra routes | Variant fills slots; host is that package or a thin app that depends on it |

### 3. Fill required slots

**Identity** (every host) — call the config factory from `app.config.ts`:

```ts
import { createRuntimeConfig } from "@scope/runtime/config";

export default createRuntimeConfig({
  name: "Acme",
  slug: "acme",
  icon: "./assets/icon.png",
  splash: { image: "./assets/splash-icon.png" },
});
```

**Home (`Main`)** — pass screen + tab options into the tabs factory:

```ts
import { createRuntimeTabsNavigator } from "@scope/runtime";
import { ExploreScreen } from "@/features/explore";

export const TabsNavigator = createRuntimeTabsNavigator({
  Main: {
    screen: ExploreScreen,
    options: { title: "Explore" },
  },
});
```

Swap `Main` for an existing runtime or variant screen the same way. Writing a new screen: follow `building-react-native-application` when that skill is installed.

### 4. Fill optional slots

**Theme / fonts** — overlays on the app factory:

```ts
import { createRuntimeApp } from "@scope/runtime";
import { RootStackNavigator } from "./routes/RootStackNavigator";

export default createRuntimeApp(RootStackNavigator, {
  theme: { light: { primary: "#0a0" } },
}).App;
```

**Extra routes** — spread additional screens into the stack factory:

```ts
import { createRuntimeStackNavigator } from "@scope/runtime";
import { TabsNavigator } from "./TabsNavigator";
import { ExtraDetailScreen } from "@/features/extra";

export const RootStackNavigator = createRuntimeStackNavigator({
  Tabs: { screen: TabsNavigator },
  ExtraDetail: { screen: ExtraDetailScreen },
});
```

### 5. Wire the host App

```ts
import { createRuntimeApp } from "@scope/runtime";
import { RootStackNavigator } from "./routes/RootStackNavigator";

export default createRuntimeApp(RootStackNavigator).App;
```

Wrap toolchain factories when this package prebuilds.

### 6. Confirm to the user

Report the variant/host package path, which slots were filled, and any new `exports` consumers. Offer to declare a new slot when the change does not fit an existing factory argument.

## Related

- [creating-slot.md](./creating-slot.md)
- [managing-shared-config.md](./managing-shared-config.md)
