# Managing Platform Fixes

## Overview

Fixes every Expo app applies for native platform behavior. Each rule is this skill's; the **References** links cover API mechanics.

## Guidelines

### Fixes

| Fix | Rule |
| --- | --- |
| Screen background | The navigation theme paints every screen: screen roots and wrappers carry no background class; backgrounds go only on surfaces that differ (cards, sheets, panels, modals) and on roots rendered outside the navigator |
| Navigation theme | `src/theme.ts` maps React Navigation's six colors (`primary`, `background`, `card`, `text`, `border`, `notification`) to token values; with no design the agent defines those tokens first; a dark theme exists only when the tokens define dark values; `Navigation` receives the theme for the active color scheme |
| Keyboard | The focused input is never covered: `KeyboardProvider` wraps the app, forms in scroll views use `KeyboardAwareScrollView`, and other keyboard handling uses `react-native-keyboard-controller` components instead of React Native's `KeyboardAvoidingView` |
| Fonts | Fonts load at startup before first render; each loaded font file is its own Tailwind `fontFamily` token (`font-body`, `font-body-semibold`), since `fontWeight` does not select between custom font files |
| Splash | The splash stays until fonts, the theme, and the stored session are ready |

## Setup

```bash
node ../scripts/run-package.cjs -- expo install react-native-keyboard-controller expo-font expo-splash-screen
```

Add the peers the keyboard controller's **Installation** page lists.

## Examples

### `src/theme.ts`

```ts
import { DarkTheme, DefaultTheme, type Theme } from "@react-navigation/native";

export const NAV_THEME: Record<"light" | "dark", Theme> = {
  light: {
    ...DefaultTheme,
    colors: {
      primary: "hsl(221 83% 53%)",
      background: "hsl(0 0% 100%)",
      card: "hsl(0 0% 100%)",
      text: "hsl(0 0% 4%)",
      border: "hsl(0 0% 90%)",
      notification: "hsl(0 84% 60%)",
    },
  },
  dark: {
    ...DarkTheme,
    colors: {
      primary: "hsl(217 91% 60%)",
      background: "hsl(0 0% 4%)",
      card: "hsl(0 0% 4%)",
      text: "hsl(0 0% 98%)",
      border: "hsl(0 0% 15%)",
      notification: "hsl(0 72% 51%)",
    },
  },
};
```

### `App.tsx`

```tsx
import "./global.css";
import { useEffect } from "react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { useFonts } from "expo-font";
import * as SplashScreen from "expo-splash-screen";
import { useColorScheme } from "nativewind";
import { KeyboardProvider } from "react-native-keyboard-controller";
import { SessionProvider, useSession } from "@/features/auth";
import { Navigation } from "@/routes";
import { NAV_THEME } from "@/theme";

void SplashScreen.preventAutoHideAsync();

const queryClient = new QueryClient();

export default function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <KeyboardProvider>
        <SessionProvider>
          <Root />
        </SessionProvider>
      </KeyboardProvider>
    </QueryClientProvider>
  );
}

function Root() {
  const [fontsLoaded] = useFonts({
    Inter: require("./assets/fonts/Inter-Regular.ttf"),
    "Inter-SemiBold": require("./assets/fonts/Inter-SemiBold.ttf"),
  });
  const { status } = useSession();
  const { colorScheme } = useColorScheme();
  const ready = fontsLoaded && status !== "restoring";

  useEffect(() => {
    if (ready) void SplashScreen.hideAsync();
  }, [ready]);

  if (!ready) return null;
  return <Navigation theme={NAV_THEME[colorScheme ?? "light"]} />;
}
```

### Font tokens

```js
theme: {
  extend: {
    fontFamily: {
      body: ["Inter"],
      "body-semibold": ["Inter-SemiBold"],
    },
  },
},
```

## References

- [React Navigation — Themes](https://reactnavigation.org/docs/themes.md)
- [Keyboard controller — Installation](https://kirillzyusko.github.io/react-native-keyboard-controller/docs/installation)
- [Keyboard controller — Components](https://kirillzyusko.github.io/react-native-keyboard-controller/docs/guides/components-overview.md)
- [Expo — Fonts](https://docs.expo.dev/develop/user-interface/fonts/index.md)
- [Expo — SplashScreen](https://docs.expo.dev/versions/latest/sdk/splash-screen.md)
