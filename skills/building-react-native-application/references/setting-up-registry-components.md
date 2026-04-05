# Setting Up Registry Components

## Overview

Shell setup for `src/ui/` registry primitives: Lucide, NativeWind `inlineRem`, root `PortalHost`, and animation helpers for overlays. After [setting-up-theming.md](./setting-up-theming.md) and aligned Tailwind.

## Prerequisites

- [setting-up-theming.md](./setting-up-theming.md)

## Steps

### Install Lucide Icons

```bash
npx expo install lucide-react-native
```

### Update the default inlined `rem` value

Change the default rem value by setting `inlineRem` in your `metro.config.js`:

```js
withNativeWind(config, { input: "./global.css", inlineRem: 16 });
```

### Add the portal host

Render `PortalHost` as the last child inside your root providers.

```tsx
import { PortalHost } from "@rn-primitives/portal";

<PortalHost />;
```
