# Linting

## Overview

Use this guide to set up ESLint and Prettier for **Vite + React** TypeScript projects. Let ESLint catch correctness issues and let Prettier handle formatting.

## Guidelines

### Structure

- Keep ESLint and Prettier config at the project root.
- Point scripts at the real source directory, usually `src/`.
- Use the same file extensions in scripts and editor tooling.

### Generated files

- **Ignore** TanStack Router’s generated route tree (for example `src/routeTree.gen.ts`) in ESLint and Prettier so tooling does not rewrite generated code. See [TanStack Router — Installation with Vite](https://tanstack.com/router/latest/docs/installation/with-vite.md) for links to ignore patterns.

### Tool ownership

- Let Prettier own formatting.
- Let ESLint own correctness, React rules, and TypeScript rules.
- Do not duplicate Prettier rules in ESLint.

### Baseline rules

- Enable `react/jsx-no-leaked-render`.
- Enforce `@typescript-eslint/consistent-type-imports`.
- Ignore intentionally unused arguments with a leading `_`.
- Add `eslint-plugin-react-hooks` and enforce the rules of hooks.

## Setup

### Install dependencies

```bash
npm install --save-dev eslint prettier @typescript-eslint/eslint-plugin @typescript-eslint/parser eslint-plugin-react eslint-plugin-react-hooks
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

```json
{
  "rules": {
    "react/jsx-no-leaked-render": [
      "error",
      { "validStrategies": ["ternary", "coerce"] }
    ],
    "react-hooks/rules-of-hooks": "error",
    "react-hooks/exhaustive-deps": "warn",
    "@typescript-eslint/consistent-type-imports": "error",
    "@typescript-eslint/no-unused-vars": [
      "error",
      { "argsIgnorePattern": "^_" }
    ]
  }
}
```

### Ignore generated routes

In `eslint.config` or `.eslintignore`, exclude `**/routeTree.gen.ts`. Add the same pattern to `.prettierignore`.

### Add package scripts

```json
{
  "scripts": {
    "lint": "eslint src/ --ext .ts,.tsx",
    "format": "prettier --write src/"
  }
}
```

## Usage

### Run checks locally

```bash
npm run lint
npm run lint -- --fix
npm run format
```

### Use the same rules in CI and editors

- Run `npm run lint` in CI without `--fix`.
- Optionally add `prettier --check src/` to CI.
- Enable ESLint and Prettier in the editor so local behavior matches CI.
