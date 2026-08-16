# Setting Up NativeWind

## Overview

**Execution mode.** Set up NativeWind. On pnpm isolated installs, add `react-native-css-interop` as a direct dependency.

## Prerequisites

- [NativeWind — Installation](https://www.nativewind.dev/docs/getting-started/installation)
- [managing-package-installs.md](./managing-package-installs.md)

## Guidelines

### Install

Use NativeWind's docs for config. Add packages with the install scripts, not NativeWind's `npm install`.

### pnpm isolated JSX runtime

When the manager is pnpm and `node-linker` is isolated (pnpm default; skip if the nearest `.npmrc` sets `node-linker=hoisted`):

- Add `react-native-css-interop` as a direct `dependencies` entry, not a devDependency.
- Pin the version NativeWind declares (read `nativewind`'s `dependencies`; e.g. NativeWind 4.2.6 → `react-native-css-interop@0.2.6`).
- Add it on every package Metro compiles JSX for (the Expo app; if a host compiles a JIT workspace runtime's source, both the runtime and each host).
- Do not switch `node-linker` to `hoisted`.
- After install: Metro reload or `expo start --clear`. No prebuild, no pod install.

```bash
node ../scripts/install-packages.cjs react-native-css-interop@<nativewind-declared-version>
```

If Metro reports `Unable to resolve module react-native-css-interop/jsx-runtime`, apply this section.
