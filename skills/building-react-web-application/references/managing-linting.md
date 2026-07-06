# Managing Linting

## Overview

Use this guide to set up ESLint and Prettier for this Vite + React TypeScript stack with flat config.

## Prerequisites

- [creating-route-component.md](./creating-route-component.md) for where `routeTree.gen.ts` comes from
- [TanStack Router — Installation with Vite](https://tanstack.com/router/latest/docs/installation/with-vite.md) for official ignore patterns and plugin setup

## Guidelines

### Tool ownership

- Let Prettier own formatting.
- Let ESLint own correctness, React rules, and TypeScript rules.

### File-type scoped linting

- Use one config block for TypeScript source files (`**/*.{ts,tsx}`) with `@typescript-eslint/parser`.
- Use a separate block for JavaScript and config files (`**/*.{js,cjs,mjs,jsx}`) with lighter rules.
- Keep React Hooks and strict TypeScript rules in TypeScript app code.

### Generated route tree

- `routeTree.gen.ts` (typical path: `src/routeTree.gen.ts`) is **generated** from `src/routes/`; edits belong in route modules, not this file.
- **Lint / format ignore:** exclude it from ESLint and Prettier (or Biome) so generated code stays untouched. The TanStack doc links patterns for [Prettier ignore](https://prettier.io/docs/en/ignore.html#ignoring-files) and [ESLint ignore](https://eslint.org/docs/latest/use/configure/ignore#ignoring-files).
- **VS Code:** optionally mark the file readonly and exclude from search/watch, as recommended in the installation doc, for quieter diffs after renames.

### Usage

### CI and editors

- Apply the same ignore patterns in CI as locally so `npm run lint` and Prettier skip the generated file.
- After changing route files, regenerate (or let the dev server regenerate) and confirm the generated file stays ignored.
- Run `npm run lint` in CI without `--fix`.
- Optionally run `prettier --check src/` in CI.

## Setup

### Install dependencies

```bash
node ../scripts/install-packages.cjs --dev eslint prettier eslint-plugin-prettier eslint-config-prettier @typescript-eslint/eslint-plugin @typescript-eslint/parser eslint-plugin-react eslint-plugin-react-hooks
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
const eslintPluginPrettierRecommended = require("eslint-plugin-prettier/recommended");
const reactPlugin = require("eslint-plugin-react");
const reactHooksPlugin = require("eslint-plugin-react-hooks");
const typescriptEslintPlugin = require("@typescript-eslint/eslint-plugin");

module.exports = defineConfig([
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
      "react-hooks": reactHooksPlugin,
    },
    rules: {
      "react/jsx-no-leaked-render": [
        "error",
        { validStrategies: ["ternary", "coerce"] },
      ],
      "react-hooks/rules-of-hooks": "error",
      "react-hooks/exhaustive-deps": "warn",
      "@typescript-eslint/consistent-type-imports": "error",
      "@typescript-eslint/no-unused-vars": [
        "error",
        {
          argsIgnorePattern: "^_",
          varsIgnorePattern: "^_",
        },
      ],
      "eol-last": ["error", "always"],
    },
  },
  {
    files: ["**/*.{js,cjs,mjs,jsx}"],
    plugins: {
      react: reactPlugin,
      "react-hooks": reactHooksPlugin,
    },
    rules: {
      "react/jsx-no-leaked-render": "off",
      "react-hooks/rules-of-hooks": "off",
      "react-hooks/exhaustive-deps": "off",
      "eol-last": ["error", "always"],
    },
  },
  eslintPluginPrettierRecommended,
  {
    ignores: ["dist/*", "node_modules/*", "**/routeTree.gen.ts"],
  },
]);
```

### Ignore generated routes

In `eslint.config` or `.eslintignore`, exclude `**/routeTree.gen.ts`. Add the same pattern to `.prettierignore`.

### Add package scripts

```json
{
  "scripts": {
    "lint": "eslint .",
    "format": "prettier --write src/"
  }
}
```
