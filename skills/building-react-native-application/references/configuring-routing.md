# Configuring Routing

## Overview

Use this guide to configure React Navigation with the static API. Keep navigator files focused on route registration and type your screens from the navigator definition.

## Prerequisites

- [setting-up-react-navigation.md](./setting-up-react-navigation.md)

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

## Examples

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
