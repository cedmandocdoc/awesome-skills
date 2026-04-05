# Setting Up NativeWind

## Overview

Install NativeWind, Tailwind CSS, and class utilities for an Expo React Native project. This configures Babel, Metro, and the global stylesheet.

## Steps

### Install NativeWind

```bash
npm install nativewind react-native-reanimated react-native-safe-area-context
npm install --save-dev tailwindcss@^3.4.17 prettier-plugin-tailwindcss@^0.5.11 babel-preset-expo
```

### Install class utilities

Install `class-variance-authority` when you use variants or class merging with `cva` and `cx`.

```bash
npx expo install class-variance-authority clsx tailwind-merge
```

### Create `tailwind.config.js`

```js
/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./App.tsx", "./src/**/*.{ts,tsx}"],
  presets: [require("nativewind/preset")],
  theme: {
    extend: {},
  },
  plugins: [],
};
```

### Create `global.css`

```css
@tailwind base;
@tailwind components;
@tailwind utilities;
```

### Configure Babel and Metro

```js
module.exports = function (api) {
  api.cache(true);
  return {
    presets: [
      ["babel-preset-expo", { jsxImportSource: "nativewind" }],
      "nativewind/babel",
    ],
  };
};
```

```js
const { getDefaultConfig } = require("expo/metro-config");
const { withNativeWind } = require("nativewind/metro");

const config = getDefaultConfig(__dirname);

module.exports = withNativeWind(config, { input: "./global.css" });
```

### Import the stylesheet

```tsx
import "./global.css";
```

### Add NativeWind types if needed

```ts
/// <reference types="nativewind/types" />
```
