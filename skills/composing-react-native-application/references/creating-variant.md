# Creating Variant

## Overview

**Execution mode.** Fills declared slots on an existing Expo core. An identity-only host is a valid variant. A new home screen is the same mechanism with a larger slot.

## Prerequisites

[composition-contract.md](./composition-contract.md) — **Naming**, **Structure**, **Product slots**, **Require managing-monorepo**.

## Guidelines

### 1. Resolve the core

Find the JIT Expo package that exports the app factory and slot factories. Use its real `name` and path; do not invent `packages/runtime` if the user or repo already named the core. Read those factory types and **Product slots**. Fill existing arguments. A new argument is [creating-slot.md](./creating-slot.md). Confirm `exports` subpaths with dependency `managing-monorepo`.

### 2. Choose package shape

| Case | Layout |
| --- | --- |
| Identity-only product | One host package fills identity |
| New screens or extra routes | Variant fills slots; host is that package or a thin app that depends on it |

### 3. Fill required slots

**Identity** (every host) — call the config factory from `app.config.ts`:

```ts
import "tsx";
import { createConfig } from "@scope/core/config";

export default createConfig({
  name: "Acme",
  slug: "acme",
  icon: "./assets/icon.png",
  splash: { image: "./assets/splash-icon.png" },
});
```

**Home (`Main`)** — pass screen + tab options into the tabs factory.

| Fill lives in | Screen import |
| --- | --- |
| JIT library (`packages/`) | `#features/<feature>` |
| Host leaf (`apps/`) | `@/features/<feature>` |

```ts
import { createTabsNavigator } from "@scope/core";
import { HomeScreen } from "#features/home";

export const TabsNavigator = createTabsNavigator({
  Main: {
    screen: HomeScreen,
    options: { title: "Home" },
  },
});
```

Swap `Main` for an existing core or variant screen the same way. Writing a new screen: follow `building-react-native-application` when that skill is installed.

### 4. Fill optional slots

**Theme / fonts** — overlays on the app factory:

```ts
import { createApp } from "@scope/core";
import { RootStackNavigator } from "./routes/RootStackNavigator";

export default createApp(RootStackNavigator, {
  theme: { light: { primary: "#0a0" } },
}).App;
```

**Extra routes** — spread additional screens into the stack factory. Screen import: same table as **Home**. Host leaf:

```ts
import { createStackNavigator } from "@scope/core";
import { TabsNavigator } from "./TabsNavigator";
import { ExtraDetailScreen } from "@/features/extra";

export const RootStackNavigator = createStackNavigator({
  Tabs: { screen: TabsNavigator },
  ExtraDetail: { screen: ExtraDetailScreen },
});
```

### 5. Wire the host App

```ts
import { createApp } from "@scope/core";
import { RootStackNavigator } from "./routes/RootStackNavigator";

export default createApp(RootStackNavigator).App;
```

If this package prebuilds, follow [managing-shared-config.md](./managing-shared-config.md).

### 6. Confirm to the user

Report the variant/host package path, which slots were filled, and any new `exports` consumers. Offer to declare a new slot when the change does not fit an existing factory argument.

## Examples

### Same `Main` slot, two products

Core-owned tabs stay. Each product passes a different home screen.

`packages/shop` (JIT library):

```ts
import { createTabsNavigator } from "@scope/core";
import { ShopScreen } from "#features/shop";
import { Store } from "lucide-react-native";

export const TabsNavigator = createTabsNavigator({
  Main: {
    screen: ShopScreen,
    options: { title: "Shop", tabBar: { icon: Store } },
  },
});
```

`apps/marketplace` (host leaf):

```ts
import { createTabsNavigator } from "@scope/core";
import { ExploreScreen } from "@/features/explore";
import { MapPin } from "lucide-react-native";

export const TabsNavigator = createTabsNavigator({
  Main: {
    screen: ExploreScreen,
    options: { title: "Explore", tabBar: { icon: MapPin } },
  },
});
```

### Extra stack route

`apps/marketplace` — required `Tabs` stays; extra keys spread:

```ts
import { createStackNavigator } from "@scope/core";
import { TabsNavigator } from "./TabsNavigator";
import { DetailStackNavigator } from "./DetailStackNavigator";

export const RootStackNavigator = createStackNavigator({
  Tabs: { screen: TabsNavigator },
  DetailStack: {
    screen: DetailStackNavigator,
    options: { headerShown: false },
  },
});
```

### Thin host

`apps/shop-host` fills identity and re-exports. `packages/shop` fills slots and exports `App`:

```ts
export { default } from "@scope/shop/App";
```

## Related

- [creating-slot.md](./creating-slot.md)
- [managing-shared-config.md](./managing-shared-config.md)
