# Configuring Routing

## Overview

Use this guide to set up React Navigation with the static API, pick stack, tabs, or drawer by how people move through the app, and keep navigation files focused on routes and options.

## Prerequisites

- [structuring-project.md](./structuring-project.md)
- [React Navigation — Hello React Navigation (static)](https://reactnavigation.org/docs/hello-react-navigation.md?config=static)

## Guidelines

### Structure

```text
src/navigation/
├── MainStack.tsx
├── index.tsx
└── RootStack.tsx
```

- Put screens in `src/screens/`.
- Register routes and screen options in `src/navigation/`.
- Split navigators into more files when the tree grows.

### Choosing navigators

Compose as needed (for example, a stack inside each tab).

| Pattern         | Use it when                                                                                                                                                                                  |
| --------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **Stack**       | Linear flow: list → detail, auth, onboarding, anything that pushes and pops.                                                                                                                 |
| **Bottom tabs** | A few peer sections users switch between often. Native bottom tabs are experimental and mobile-only in the docs; use the classic bottom tab navigator from the same package if web support is required. |
| **Drawer**      | Many destinations, secondary navigation, or a slide-out menu fits the product.                                                                                                               |

Copy setup from each doc’s **Usage** section:

- [Native stack — Usage](https://reactnavigation.org/docs/native-stack-navigator/#usage)
- [Native bottom tabs — Usage](https://reactnavigation.org/docs/native-bottom-tab-navigator/#usage)
- [Drawer — Usage](https://reactnavigation.org/docs/drawer-navigator/#usage)

## Setup

### Install packages

Install `@react-navigation/native` and shared dependencies from [React Navigation — Getting started](https://reactnavigation.org/docs/getting-started). For each navigator in use, follow that navigator’s **Installation** section:

- [Native stack — Installation](https://reactnavigation.org/docs/native-stack-navigator/#installation)
- [Native bottom tabs — Installation](https://reactnavigation.org/docs/native-bottom-tab-navigator/#installation)
- [Drawer — Installation](https://reactnavigation.org/docs/drawer-navigator/#installation)

## Examples

### Render navigation in `App.tsx`

```tsx
export default function App() {
  return <Navigation />;
}
```

### Navigate from a screen

```tsx
import { useNavigation } from "@react-navigation/native";

export function HomeScreen() {
  const navigation = useNavigation();

  const openDetail = () => {
    navigation.navigate("WorkshopDetail", { workshopId: "123" });
  };

  return null;
}
```
