# Managing Linting

## Overview

Use this guide to set up ESLint and Prettier for Expo + React Native TypeScript projects with flat config.

## Guidelines

### Tool ownership

- Let Prettier own formatting.
- Let ESLint own correctness, TypeScript rules, and React Native rules.

### File-type scoped linting

- Use one config block for TypeScript source files (`**/*.{ts,tsx}`) with `@typescript-eslint/parser`.
- Use a separate block for JavaScript and config files (`**/*.{js,cjs,mjs,jsx}`) with lighter rules.
- Keep React Native UI rules primarily in TypeScript app code.

### Usage

### Run checks locally

```bash
npm run lint
npm run lint -- --fix
npm run format
```

### Keep CI and editor behavior aligned

- Run `npm run lint` in CI without `--fix`.
- Optionally run `prettier --check src/` in CI.
- Enable ESLint and Prettier in the editor so local feedback matches CI.

## Setup

### Install dependencies

```bash
npm install --save-dev eslint prettier eslint-plugin-prettier eslint-config-prettier eslint-config-expo @typescript-eslint/eslint-plugin @typescript-eslint/parser eslint-plugin-react eslint-plugin-react-native
```

### Add a Prettier config

```json
{
  "semi": true,
  "singleQuote": true,
  "trailingComma": "all",
  "printWidth": 100,
  "tabWidth": 2
}
```

### Add ESLint rules (example)

```js
const { defineConfig } = require("eslint/config");
const expoConfig = require("eslint-config-expo/flat");
const eslintPluginPrettierRecommended = require("eslint-plugin-prettier/recommended");
const reactPlugin = require("eslint-plugin-react");
const reactNativePlugin = require("eslint-plugin-react-native");
const typescriptEslintPlugin = require("@typescript-eslint/eslint-plugin");

module.exports = defineConfig([
  expoConfig,
  {
    files: ["**/*.{ts,tsx}"],
    languageOptions: {
      parser: require("@typescript-eslint/parser"),
      parserOptions: {
        project: "./tsconfig.json",
      },
    },
    plugins: {
      "@typescript-eslint": typescriptEslintPlugin,
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

### Add package scripts

```json
{
  "scripts": {
    "lint": "eslint .",
    "format": "prettier --write src/"
  }
}
```
