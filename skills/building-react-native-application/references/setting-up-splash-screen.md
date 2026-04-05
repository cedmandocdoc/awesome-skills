# Setting Up Splash Screen

## Overview

Install `expo-splash-screen` and configure the config plugin for image, background color, and dark mode support.

## Steps

### Install

```bash
npx expo install expo-splash-screen
```

In an existing bare React Native app, install [Expo modules](https://docs.expo.dev/bare/installing-expo-modules) first if the project is not already Expo-enabled. For native project edits without CNG, see the [package README](https://github.com/expo/expo/tree/main/packages/expo-splash-screen#-installation-in-bare-react-native-projects).

### Config plugin (recommended)

```json
{
  "expo": {
    "plugins": [
      [
        "expo-splash-screen",
        {
          "backgroundColor": "#232323",
          "image": "./assets/splash-icon.png",
          "dark": {
            "image": "./assets/splash-icon-dark.png",
            "backgroundColor": "#000000"
          },
          "imageWidth": 200
        }
      ]
    ]
  }
}
```

Common plugin options:

| Property | Default | Notes |
| -------- | ------- | ----- |
| `backgroundColor` | `#ffffff` | Hex background. |
| `image` | — | Path to logo or icon art. |
| `imageWidth` | `100` | Logical width of the image. |
| `resizeMode` | — | `contain`, `cover`, or `native`. |
| `dark` | — | Same shape for dark mode. |
| `android` / `ios` | — | Platform-specific overrides. |
| `enableFullScreenImage_legacy` | `false` | iOS only; migration helper; avoid for new work. |

Rebuild the native app after changing plugin output.
