# Creating Slot

## Overview

**Execution mode.** Adds a typed extension point on the runtime so variants can pass a value without patching runtime internals. Same steps declare the first slot set on an app that is becoming a runtime.

## Prerequisites

[composition-contract.md](./composition-contract.md) — **Structure**, **Product slots**, **Slot kinds**, **Require managing-monorepo**.

## Guidelines

### 1. Classify the behavior

Read factory types and **Product slots** before adding a field.

| Kind | Action |
| --- | --- |
| Argument already on a factory type | Fill it — [creating-variant.md](./creating-variant.md) |
| Several products will pass a different value | New slot on the runtime |
| One product only | Shell-only feature in the variant |

### 2. Choose kind

Per **Slot kinds**: required or optional; closed field or open spread. Open spread only for extra tabs/stacks.

### 3. Add a typed factory argument

Extend the factory config with a named field.

```ts
import { OwnedScreen } from "#features/owned";

type TabsConfig = {
  Main: TabConfig;
} & Record<string, TabConfig>;

export function createRuntimeTabsNavigator<const T extends TabsConfig>(config: T) {
  const { Main, ...extraTabs } = config;
  return createBottomTabNavigator({
    screens: {
      OwnedTab: { screen: OwnedScreen },
      Main: { screen: Main.screen, options: Main.options },
      ...Object.fromEntries(
        Object.entries(extraTabs).map(([name, tab]) => [
          name,
          { screen: tab.screen, options: tab.options },
        ]),
      ),
    },
  });
}
```

### 4. Default in the runtime

The runtime’s own app fills every required slot so it remains a complete working Expo app. Variants override by calling the same factory.

### 5. Export the factory

Add or keep the factory on `package.json` `exports`. Follow dependency `managing-monorepo` for the `exports` map.

### 6. Confirm to the user

Report the factory file, the new argument, presence (required/optional), shape (closed/open), the `exports` key, and the runtime default.

## Examples

### Runtime default for `Main`

```ts
import { MainPlaceholderScreen } from "#features/main-placeholder";
import { createRuntimeTabsNavigator } from "./factories/createRuntimeTabsNavigator";
import { LayoutGrid } from "lucide-react-native";

export const TabsNavigator = createRuntimeTabsNavigator({
  Main: {
    screen: MainPlaceholderScreen,
    options: { title: "Main", tabBar: { icon: LayoutGrid } },
  },
});
```

### `exports` surface

```json
{
  "exports": {
    ".": "./src/index.ts",
    "./config": "./src/factories/createRuntimeConfig.ts",
    "./tsconfig.json": "./tsconfig.json",
    "./babel.config.factory.js": "./babel.config.factory.js",
    "./metro.config.js": "./metro.config.factory.js",
    "./eslint.config.js": "./eslint.config.factory.js",
    "./tailwind.preset": "./tailwind.preset.js",
    "./global.css": "./src/global.css"
  }
}
```

## Related

- [creating-variant.md](./creating-variant.md)
