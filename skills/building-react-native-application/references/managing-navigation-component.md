# Managing Navigation Component

## Overview

Use React Navigation navigator options to provide shared navigation UI such as header, drawer, and bottom tabs. Avoid manually rendering these navigation components inside each screen.

## Prerequisites

- [configuring-routing.md](./configuring-routing.md)
- [Native Stack Navigator](https://reactnavigation.org/docs/native-stack-navigator.md)
- [Native Bottom Tabs Navigator](https://reactnavigation.org/docs/native-bottom-tab-navigator.md)
- [React Navigation — Drawer Navigator](https://reactnavigation.org/docs/drawer-navigator.md)

## Guidelines

### Prefer navigator-owned navigation UI

- Configure header, tab bar, and drawer content at the navigator level.
- Keep screen components focused on feature UI and behavior.
- Use shared navigator options to keep navigation chrome consistent.

### Header

- Use `screenOptions` or per-screen `options` on stack navigators.
- Reuse `header` renderers across all screens in a stack.
- Do not copy the same custom header component into each screen.

### Drawer

- Use drawer navigator options for drawer labels, icons, and behavior.
- Use `drawerContent` for custom drawer layout.
- Keep drawer actions in navigation config, not in screen-local layout.

### Bottom tabs

- Configure `tabBarIcon`, `tabBarLabel`, and style through tab navigator options.
- Use shared tab options for consistent spacing, colors, and behavior.
- Avoid manual tab bars in screen trees unless building a non-navigation surface.

## Example

### Reuse one custom stack header for all stack screens

```tsx
import { createStaticNavigation } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";

type RootStackParamList = {
  Home: undefined;
  Details: undefined;
};

const AppStack = createNativeStackNavigator<RootStackParamList>({
  screenOptions: {
    header: (props) => <AppHeader {...props} />,
  },
  screens: {
    Home: HomeScreen,
    Details: DetailsScreen,
  },
});

export const Navigation = createStaticNavigation(AppStack);
```

This keeps header behavior centralized in the navigator and avoids duplicating header rendering inside each screen component.
