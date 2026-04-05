# Linting

## Overview

Use this guide to set up ESLint and Prettier for Expo and React Native TypeScript projects. Let ESLint catch correctness issues and let Prettier handle formatting.

## Guidelines

### Structure

- Keep ESLint and Prettier config at the project root.
- Point scripts at the real source directory, usually `src/`.
- Use the same file extensions in scripts and editor tooling.

### Tool ownership

- Let Prettier own formatting.
- Let ESLint own correctness, React rules, and TypeScript rules.
- Do not duplicate Prettier rules in ESLint.

### Baseline rules

- Enable `react/jsx-no-leaked-render`.
- Enforce `@typescript-eslint/consistent-type-imports`.
- Ignore intentionally unused arguments with a leading `_`.
- Use `react-native/no-inline-styles` and `react-native/no-unused-styles` as warnings.

## Setup

### Install dependencies

```bash
npm install --save-dev eslint prettier @typescript-eslint/eslint-plugin @typescript-eslint/parser eslint-plugin-react eslint-plugin-react-native
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

### Add ESLint rules

```json
{
  "rules": {
    "react/jsx-no-leaked-render": [
      "error",
      { "validStrategies": ["ternary", "coerce"] }
    ],
    "@typescript-eslint/consistent-type-imports": "error",
    "@typescript-eslint/no-unused-vars": [
      "error",
      { "argsIgnorePattern": "^_" }
    ],
    "react-native/no-inline-styles": "warn",
    "react-native/no-unused-styles": "warn"
  }
}
```

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
