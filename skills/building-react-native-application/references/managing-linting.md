# Managing Linting

## Overview

**Execution mode.** Set up ESLint and Prettier for Expo + React Native TypeScript projects with flat config.

## Guidelines

### Tool ownership

| Tool | Owns |
| --- | --- |
| Prettier | Formatting |
| ESLint | Correctness, TypeScript rules, React Native rules |

### File-type scoped linting

- One config block for TypeScript source (`**/*.{ts,tsx}`) with the `typescript-eslint` parser.
- Separate block for JavaScript/config files (`**/*.{js,cjs,mjs,jsx}`) with lighter rules.

### CI and editor alignment

- Run `npm run lint` in CI without `--fix`.
- Optionally run `prettier --check src/` in CI.
- Enable ESLint and Prettier in the editor so local feedback matches CI.

## Setup

### Install dependencies

```bash
node ../scripts/install-packages.cjs --dev eslint@^9 prettier eslint-plugin-prettier eslint-config-prettier eslint-config-expo typescript-eslint eslint-plugin-react eslint-plugin-react-native
```

Pin `eslint@^9`: `eslint-plugin-react` and `eslint-plugin-react-native` do not support ESLint 10.

### Add Prettier config

```json
{
  "semi": true,
  "singleQuote": true,
  "trailingComma": "all",
  "printWidth": 100,
  "tabWidth": 2
}
```

### Add package scripts

```json
{
  "scripts": {
    "lint": "eslint .",
    "format": "prettier --write src/"
  }
}
```

## Examples

### ESLint flat config

```js
const { defineConfig } = require("eslint/config");
const expoConfig = require("eslint-config-expo/flat");
const eslintPluginPrettierRecommended = require("eslint-plugin-prettier/recommended");
const reactPlugin = require("eslint-plugin-react");
const reactNativePlugin = require("eslint-plugin-react-native");
const tseslint = require("typescript-eslint");

module.exports = defineConfig([
  expoConfig,
  {
    files: ["**/*.{ts,tsx}"],
    languageOptions: {
      parser: tseslint.parser,
      parserOptions: {
        projectService: true,
      },
    },
    plugins: {
      "@typescript-eslint": tseslint.plugin,
      react: reactPlugin,
      "react-native": reactNativePlugin,
    },
    rules: {
      "react/jsx-no-leaked-render": [
        "error",
        { validStrategies: ["ternary", "coerce"] },
      ],
      "@typescript-eslint/consistent-type-imports": "error",
      "@typescript-eslint/no-unused-vars": [
        "error",
        {
          argsIgnorePattern: "^_",
          varsIgnorePattern: "^_",
        },
      ],
      "react-native/no-inline-styles": "warn",
      "react-native/no-unused-styles": "warn",
      "eol-last": ["error", "always"],
    },
  },
  {
    files: ["**/*.{js,cjs,mjs,jsx}"],
    plugins: {
      react: reactPlugin,
      "react-native": reactNativePlugin,
    },
    rules: {
      "react/jsx-no-leaked-render": "off",
      "react-native/no-inline-styles": "off",
      "react-native/no-unused-styles": "off",
      "eol-last": ["error", "always"],
    },
  },
  eslintPluginPrettierRecommended,
  {
    ignores: ["dist/*", "node_modules/*", ".expo/*"],
  },
]);
```

### Run checks locally

```bash
npm run lint
npm run lint -- --fix
npm run format
```
