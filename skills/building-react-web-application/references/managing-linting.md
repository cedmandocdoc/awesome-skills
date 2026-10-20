# Managing Linting

## Overview

**Execution mode.** Configures ESLint and Prettier for the Vite + React TypeScript stack with flat config, including the rules that enforce the project structure and accessibility.

## Prerequisites

- [managing-project-structure.md](./managing-project-structure.md) — layers, barrels
- [creating-page.md](./creating-page.md) — where `routeTree.gen.ts` comes from
- [TanStack Router — Installation with Vite](https://tanstack.com/router/latest/docs/installation/with-vite.md) — official ignore patterns and plugin setup

## Guidelines

### Tool ownership

| Tool | Owns |
| --- | --- |
| Prettier | Formatting and Tailwind class order (`prettier-plugin-tailwindcss`) |
| ESLint | Correctness, React and TypeScript rules, accessibility (`eslint-plugin-jsx-a11y` recommended), structure |

### Structure rules

| Rule | Enforces |
| --- | --- |
| `boundaries/element-types` | The **Layers** table: which layer may import which; a feature never imports another feature |
| `no-restricted-imports` | Deep imports into another module fail (`@/*/*/*`, except `@/common/query/client`); `@base-ui/react` only inside `src/ui/` |
| `@typescript-eslint/consistent-type-definitions` | Props and object types as `interface` |
| `max-lines` | 300 lines per `.ts` / `.tsx`, blank lines and comments skipped, at `error`; a file over it becomes a folder |

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
node ../scripts/install-packages.cjs --dev eslint@^9 prettier prettier-plugin-tailwindcss eslint-plugin-prettier eslint-config-prettier typescript-eslint eslint-plugin-react eslint-plugin-react-hooks eslint-plugin-jsx-a11y eslint-plugin-boundaries eslint-import-resolver-typescript
```

Pin `eslint@^9`: `eslint-plugin-react` does not support ESLint 10.

### Add a Prettier config

```json
{
  "semi": true,
  "singleQuote": true,
  "trailingComma": "all",
  "printWidth": 100,
  "tabWidth": 2,
  "plugins": ["prettier-plugin-tailwindcss"],
  "tailwindStylesheet": "./global.css"
}
```

### Add the ESLint config

```js
const { defineConfig } = require("eslint/config");
const eslintPluginPrettierRecommended = require("eslint-plugin-prettier/recommended");
const boundaries = require("eslint-plugin-boundaries");
const jsxA11y = require("eslint-plugin-jsx-a11y");
const reactPlugin = require("eslint-plugin-react");
const reactHooksPlugin = require("eslint-plugin-react-hooks");
const tseslint = require("typescript-eslint");

const DEEP_IMPORTS = {
  group: ["@/*/*/*", "!@/common/query/client"],
  message: "Import another module through its barrel.",
};

module.exports = defineConfig([
  jsxA11y.flatConfigs.recommended,
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
      "react-hooks": reactHooksPlugin,
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
            { group: ["@base-ui/react", "@base-ui/react/*"], message: "Import primitives from @/ui." },
          ],
        },
      ],
      "max-lines": ["error", { max: 300, skipBlankLines: true, skipComments: true }],
      "@typescript-eslint/consistent-type-definitions": ["error", "interface"],
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
    files: ["src/ui/**/*.{ts,tsx}"],
    rules: {
      "no-restricted-imports": ["error", { patterns: [DEEP_IMPORTS] }],
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

## References

- [eslint-plugin-boundaries](https://github.com/javierbrea/eslint-plugin-boundaries)
- [eslint-plugin-jsx-a11y](https://github.com/jsx-eslint/eslint-plugin-jsx-a11y)
- [ESLint — max-lines](https://eslint.org/docs/latest/rules/max-lines)
- [prettier-plugin-tailwindcss](https://github.com/tailwindlabs/prettier-plugin-tailwindcss)
