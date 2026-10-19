# Managing Linting

## Overview

**Execution mode.** Configures ESLint and Prettier for the Vite + React TypeScript stack with flat config.

## Prerequisites

- [creating-page.md](./creating-page.md) — where `routeTree.gen.ts` comes from
- [TanStack Router — Installation with Vite](https://tanstack.com/router/latest/docs/installation/with-vite.md) — official ignore patterns and plugin setup

## Guidelines

### Tool ownership

- Prettier owns formatting.
- ESLint owns correctness, React rules, and TypeScript rules.

### File-type scoped linting

- One config block for TypeScript source files (`**/*.{ts,tsx}`) with the `typescript-eslint` parser.
- A separate block for JavaScript and config files (`**/*.{js,cjs,mjs,jsx}`) with lighter rules.
- Keep React Hooks and strict TypeScript rules in TypeScript app code.

### Ignoring generated files

`routeTree.gen.ts` (typical path: `src/routeTree.gen.ts`) is generated from `src/routes/`; edits belong in route modules (see [creating-page.md](./creating-page.md)). Exclude it from ESLint and Prettier so generated code stays untouched. Optionally mark it readonly in VS Code and exclude from search/watch for quieter diffs.

### CI and editors

- Apply the same ignore patterns in CI as locally so `npm run lint` and Prettier skip generated files.
- Run `npm run lint` in CI without `--fix`.
- Optionally run `prettier --check src/` in CI.

## Setup

### Install dependencies

```bash
node ../scripts/install-packages.cjs --dev eslint@^9 prettier eslint-plugin-prettier eslint-config-prettier typescript-eslint eslint-plugin-react eslint-plugin-react-hooks
```

Pin `eslint@^9`: `eslint-plugin-react` does not support ESLint 10.

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
const tseslint = require("typescript-eslint");

module.exports = defineConfig([
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

### Add package scripts

```json
{
  "scripts": {
    "lint": "eslint .",
    "format": "prettier --write src/"
  }
}
```
