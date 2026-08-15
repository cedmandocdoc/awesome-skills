# Creating Slot

## Overview

**Execution mode.** Adds a typed extension point on the runtime so variants can pass a value without patching runtime internals.

## Prerequisites

[composition-contract.md](./composition-contract.md) — terms, product API, **Require managing-monorepo**.

## Guidelines

### 1. Classify the behavior

| Kind | Action |
| --- | --- |
| Several products will pass a different value | New slot on the runtime |
| One product only | Shell-only feature in the variant |

### 2. Add a typed factory argument

Extend the factory config with a named field (required or optional). Keep a runtime default for optional slots. Spread extra keys only when the slot is an open route map (extra tabs/stacks).

```ts
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

### 3. Default in the runtime

The runtime’s own app fills every required slot so it remains a complete working Expo app. Variants override by calling the same factory.

### 4. Export the factory

Add or keep the factory on `package.json` `exports`. Follow companion `managing-monorepo` for the `exports` map. Consumers import `@scope/runtime` or a subpath — not the runtime’s `src/` by path.

### 5. Confirm to the user

Report the factory file, the new argument, whether it is required, the `exports` key, and the runtime default.

## Related

- [creating-variant.md](./creating-variant.md)
