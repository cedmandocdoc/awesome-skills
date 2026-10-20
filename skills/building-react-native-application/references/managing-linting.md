# Managing Linting

## Overview

**Execution mode.** Set up ESLint and Prettier for Expo + React Native TypeScript projects with flat config, including the rules that enforce the project structure.

## Prerequisites

- [managing-project-structure.md](./managing-project-structure.md) — layers, barrels

## Guidelines

### Tool ownership

| Tool | Owns |
| --- | --- |
| Prettier | Formatting and Tailwind class order (`prettier-plugin-tailwindcss`) |
| ESLint | Correctness, TypeScript rules, React Native rules, structure |

### Structure rules

| Rule | Enforces |
| --- | --- |
| `boundaries/element-types` | The **Layers** table: which layer may import which; a feature never imports another feature |
| `no-restricted-imports` | Deep imports into another module fail (`@/*/*/*`, except `@/common/query/client`); `@rn-primitives/*` only inside `src/ui/` |
| `@typescript-eslint/consistent-type-definitions` | Props and object types as `interface` |
| `max-lines` | 300 lines per `.ts` / `.tsx`, blank lines and comments skipped, at `error`; a file over it becomes a folder |

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
node ../scripts/install-packages.cjs --dev eslint@^9 prettier prettier-plugin-tailwindcss eslint-plugin-prettier eslint-config-prettier eslint-config-expo typescript-eslint eslint-plugin-react eslint-plugin-react-native eslint-plugin-boundaries eslint-import-resolver-typescript
```

Pin `eslint@^9`: `eslint-plugin-react` and `eslint-plugin-react-native` do not support ESLint 10.

### Add Prettier config

```json
{
  "semi": true,
  "singleQuote": true,
  "trailingComma": "all",
  "printWidth": 100,
  "tabWidth": 2,
  "plugins": ["prettier-plugin-tailwindcss"]
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
const boundaries = require("eslint-plugin-boundaries");
const reactPlugin = require("eslint-plugin-react");
const reactNativePlugin = require("eslint-plugin-react-native");
const tseslint = require("typescript-eslint");

const DEEP_IMPORTS = {
  group: ["@/*/*/*", "!@/common/query/client"],
  message: "Import another module through its barrel.",
};

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
      boundaries,
      react: reactPlugin,
      "react-native": reactNativePlugin,
    },
    settings: {
      "import/resolver": { typescript: true },
      "boundaries/elements": [
        { type: "routes", pattern: "src/routes" },
        { type: "feature", pattern: "src/features/*", capture: ["name"] },
        { type: "common", pattern: "src/common/*" },
        { type: "ui", pattern: "src/ui" },
        { type: "api", pattern: "src/api" },
        { type: "libs", pattern: "src/libs" },
      ],
    },
    rules: {
      "boundaries/element-types": [
        "error",
        {
          default: "disallow",
          rules: [
            { from: "routes", allow: ["routes", "feature", "common", "ui"] },
            { from: "feature", allow: [["feature", { name: "${from.name}" }], "common", "ui", "api", "libs"] },
            { from: "common", allow: ["common", "ui", "api", "libs"] },
            { from: "ui", allow: ["ui", "libs"] },
            { from: "api", allow: ["api", "libs"] },
            { from: "libs", allow: ["libs"] },
          ],
        },
      ],
      "no-restricted-imports": [
        "error",
        {
          patterns: [
            DEEP_IMPORTS,
            { group: ["@rn-primitives/*"], message: "Import primitives from @/ui." },
          ],
        },
      ],
      "max-lines": ["error", { max: 300, skipBlankLines: true, skipComments: true }],
      "@typescript-eslint/consistent-type-definitions": ["error", "interface"],
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
    files: ["src/ui/**/*.{ts,tsx}"],
    rules: {
      "no-restricted-imports": ["error", { patterns: [DEEP_IMPORTS] }],
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

## References

- [eslint-plugin-boundaries](https://github.com/javierbrea/eslint-plugin-boundaries)
- [ESLint — max-lines](https://eslint.org/docs/latest/rules/max-lines)
- [prettier-plugin-tailwindcss](https://github.com/tailwindlabs/prettier-plugin-tailwindcss)
