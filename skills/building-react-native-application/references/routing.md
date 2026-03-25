# Routing

## Overview

Use this guide to set up React Navigation with the static API. Keep navigator files focused on route registration and type your screens from the navigator definition.

## Guidelines

### Structure

```text
src/navigation/
├── MainStack.tsx
├── index.tsx
└── RootStack.tsx
```

- Put screens in `src/screens/`.
- Let navigators register screens and define options only.
- Split stacks into multiple files when the tree grows.

### Navigation rules

- Use `@react-navigation/native-stack`.
- Use `createStaticNavigation` at the root.
- Do not add `NavigationContainer` when you use the static API.
- Prefer navigator `options` over custom headers.

### Typing rules

- Infer the param list with `StaticParamList<typeof MainStack>`.
- Use `StaticScreenProps` in each screen.
- Use `useNavigation()` instead of a `navigation` prop.
- Keep `declare global` in a file that always compiles.

## Setup

### Install React Navigation packages

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

## Usage

### Render navigation once in `App.tsx`

```tsx
export default function App() {
  return <Navigation />;
}
```

### Type screen params

```tsx
import type { StaticScreenProps } from "@react-navigation/native";

type WorkshopDetailProps = StaticScreenProps<{ workshopId: string }>;

export function WorkshopDetailScreen({ route }: WorkshopDetailProps) {
  return null;
}
```

### Navigate with typed route names

```tsx
import { useNavigation } from "@react-navigation/native";

export function HomeScreen() {
  const navigation = useNavigation();
  const open = () =>
    navigation.navigate("WorkshopDetail", { workshopId: "123" });
  return null;
}
```
