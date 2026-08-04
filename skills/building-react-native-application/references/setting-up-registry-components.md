# Setting Up Registry Components

## Overview

**Execution mode.** Shell setup for `src/ui/` registry primitives: Lucide icons, NativeWind `inlineRem`, root `PortalHost`, and animation helpers for overlays. Run after [setting-up-theming.md](./setting-up-theming.md) and aligned Tailwind.

## Prerequisites

- [setting-up-theming.md](./setting-up-theming.md)

## Guidelines

### Install Lucide Icons

```bash
node ../scripts/run-package.cjs -- expo install lucide-react-native
```

### Update the default inlined `rem` value

Set `inlineRem` in `metro.config.js`:

```js
withNativeWind(config, { input: "./global.css", inlineRem: 16 });
```

### Add the portal host

Render `PortalHost` as the last child inside the root providers.

```tsx
import { PortalHost } from "@rn-primitives/portal";

<PortalHost />;
```
