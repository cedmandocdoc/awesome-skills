# Implementing Splash Screen

## Overview

Use this guide to control the native splash screen with [`expo-splash-screen`](https://docs.expo.dev/versions/latest/sdk/splash-screen/). The module hides the splash automatically when the app is ready; use manual control only when loading must finish before first paint.

For assets and sizing, see [Splash screen and app icon](https://docs.expo.dev/develop/user-interface/splash-screen-and-app-icon/#splash-screen) in the Expo docs.

## Prerequisites

- [setting-up-splash-screen.md](./setting-up-splash-screen.md)

## Guidelines

### Default behavior

- Rely on automatic hide unless the first screen depends on async work (fonts, session, critical API).
- When delaying hide, show real UI immediately after `SplashScreen.hide()` so users do not see a blank frame.

### SDK 52 and testing

From SDK 52, Android splash behavior changed. [Expo Go](https://docs.expo.dev/versions/latest/sdk/splash-screen/) shows the app icon instead of the configured splash; development builds may not reflect every config-plugin property. **Verify the splash on a release (standalone) build** before shipping.

### `preventAutoHideAsync`

- Call `SplashScreen.preventAutoHideAsync()` in **global scope** without awaiting (not only inside a component or hook), so it runs before the native splash auto-hides.
- Pair it with `SplashScreen.hide()` or `SplashScreen.hideAsync()` when work completes.

### Configuration

- Prefer the **`expo-splash-screen` config plugin** in `app.json` / `app.config` for image, background, dark mode, and platform-specific options. Plain `splash` / `android.splash` / `ios.splash` app config still works but is treated as legacy relative to the plugin.

### Animation

- Optional fade-out uses `SplashScreen.setOptions({ fade, duration })`. **Fade is iOS-only** in the documented API; set options where the app boots (for example root layout).

## Examples

### Optional fade animation

```tsx
import * as SplashScreen from "expo-splash-screen";

SplashScreen.setOptions({
  duration: 1000,
  fade: true,
});
```

### Delay hide until resources load

Call prevention once at module load; hide when ready.

```tsx
import { Stack } from "expo-router";
import * as SplashScreen from "expo-splash-screen";
import { useEffect, useState } from "react";

SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    async function prepare() {
      try {
        // await fonts, auth restore, critical requests, etc.
      } catch (e) {
        console.warn(e);
      } finally {
        setIsReady(true);
      }
    }
    void prepare();
  }, []);

  useEffect(() => {
    if (isReady) {
      SplashScreen.hide();
    }
  }, [isReady]);

  if (!isReady) {
    return null;
  }

  return <Stack />;
}
```

### API summary

| Method | Role |
| ------ | ---- |
| `preventAutoHideAsync()` | Keeps the native splash up until `hide` / `hideAsync`. |
| `hide()` / `hideAsync()` | Hides the splash immediately. |
| `setOptions(options)` | Sets default fade behavior (`duration`, `fade`). |

For custom animations beyond the built-in fade, see the [with-splash-screen example](https://github.com/expo/examples/tree/master/with-splash-screen) (`npx create-expo-app --example with-splash-screen`).
