# Managing Shared Config

## Overview

**Execution mode.** Wrap runtime toolchain factories in the host that prebuilds so the filled variant can run without copying config files. Open this after filling slots, when the package is a host.

## Prerequisites

[composition-contract.md](./composition-contract.md) — **Host toolchain**, **Require managing-monorepo**. Identity fill: [creating-variant.md](./creating-variant.md).

## Guidelines

### Host wraps factories

Runtime exports factories. The host calls them and passes host-specific roots.

| Tool | Host file | Pattern |
| --- | --- | --- |
| Babel | `babel.config.js` | `require("@scope/runtime/babel.config.factory.js")()` |
| Metro | `metro.config.js` | `require("@scope/runtime/metro.config.js")({ projectRoot, workspacePackageSrcPaths })` |
| ESLint | `eslint.config.js` | `require("@scope/runtime/eslint.config.js")({ tsconfigRootDir })` |
| Tailwind | `tailwind.config.js` | `presets: [require("@scope/runtime/tailwind.preset")]`; `content` includes host and runtime `src/**/*.{ts,tsx}` |
| Expo config | `app.config.ts` | Identity slot — [creating-variant.md](./creating-variant.md) |
| CSS | `src/global.css` | `@import "@scope/runtime/global.css";` |

Copying those files into the host is not the pattern.

### Metro and JIT source

Metro may receive filesystem `workspacePackageSrcPaths` so it compiles JIT workspace packages. That is bundler config. TypeScript and app imports still use `@scope/runtime` and `exports`, per dependency `managing-monorepo`.

### `tsconfig`

The host may `"extends"` the runtime’s compiler options. `paths` maps `@/*` to **this package’s** `./src/*` only.

```json
{
  "extends": "@scope/runtime/tsconfig.json",
  "compilerOptions": {
    "baseUrl": ".",
    "paths": {
      "@/*": ["./src/*"]
    }
  }
}
```

### Native modules

Each package that runs `expo prebuild` lists every native module it uses as a **direct** `dependencies` entry. JS hoisting is not native linking. Expo autolinking and Fabric codegen read the **host** dependency tree.

Treat a package as native when it has `ios/` / `android`, a `.podspec`, Expo config plugins, or Fabric/codegen components.

Copy versions from the runtime’s `package.json` so the workspace stays aligned.

After changing native deps: `pnpm install` at the repo root, regenerate native projects (`expo prebuild` or `pod install`), then rebuild the dev client. Metro reload is not enough.

### Symptoms

- `Unimplemented component: <NativeViewName>` at runtime
- Works in one Expo app in the workspace but not another host
- Pod in the lockfile but missing from generated Fabric registration

## Examples

### Babel

```js
module.exports = require("@scope/runtime/babel.config.factory.js")();
```

### Metro

```js
const path = require("path");

module.exports = require("@scope/runtime/metro.config.js")({
  projectRoot: __dirname,
  workspacePackageSrcPaths: [
    path.resolve(__dirname, "../../packages/runtime/src"),
  ],
});
```

### Tailwind

```js
const path = require("path");

const runtimeSrc = path.resolve(__dirname, "../../packages/runtime/src");

/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{ts,tsx}", `${runtimeSrc}/**/*.{ts,tsx}`],
  presets: [require("@scope/runtime/tailwind.preset")],
};
```

### CSS

```css
@import "@scope/runtime/global.css";
```

### Host `package.json` native deps

```json
{
  "dependencies": {
    "@scope/runtime": "workspace:*",
    "react-native-gesture-handler": "~2.28.0",
    "react-native-screens": "~4.16.0",
    "react-native-reanimated": "~4.1.7"
  }
}
```

## Related

- [creating-variant.md](./creating-variant.md)

## References

- [Expo — Autolinking](https://docs.expo.dev/modules/autolinking/)
- [Expo — Prebuild](https://docs.expo.dev/workflow/prebuild/)
