# Setting Up React Navigation

## Overview

Install React Navigation with the static API and define the root stack navigator for an Expo project.

## Steps

### Install packages

```bash
npx expo install @react-navigation/native @react-navigation/native-stack react-native-screens react-native-safe-area-context
```

### Define the root stack

```tsx
import type { StaticParamList } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { HomeScreen } from "@/screens/HomeScreen";

const MainStack = createNativeStackNavigator({
  initialRouteName: "Home",
  screens: {
    Home: { screen: HomeScreen, options: { title: "Home" } },
  },
});

type MainStackParamList = StaticParamList<typeof MainStack>;

declare global {
  namespace ReactNavigation {
    interface RootParamList extends MainStackParamList {}
  }
}

export { MainStack };
```

### Export the static navigation component

```tsx
import { createStaticNavigation } from "@react-navigation/native";
import { MainStack } from "./MainStack";

export const Navigation = createStaticNavigation(MainStack);
```
