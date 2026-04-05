# Setting Up Registry Components

## Overview

Mount `@rn-primitives/portal` so overlay primitives (dialogs, sheets, menus) from your `src/ui/` registry render above the app.

## Prerequisites

- [setting-up-theming.md](./setting-up-theming.md)

## Steps

### Install Lucide Icons

```bash
npx expo install lucide-react-native
```

### Add the portal host

Render `PortalHost` as the last child inside your root providers.

```tsx
import { PortalHost } from "@rn-primitives/portal";

<PortalHost />;
```
