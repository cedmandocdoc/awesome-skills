# Linting

## Overview

Use this guide for **TanStack Router** specifics in this stack: keep the generated route tree out of ESLint and Prettier so tooling leaves generated code unchanged. For **baseline** ESLint, Prettier, React rules, and React Hooks, follow the companion skill doc linked below.

## Prerequisites

- [linting.md](../../building-react-application/references/linting.md) in **building-react-application** (ESLint, Prettier, Vite + React web setup)
- [configuring-routing.md](./configuring-routing.md) for where `routeTree.gen.ts` comes from
- [TanStack Router — Installation with Vite](https://tanstack.com/router/latest/docs/installation/with-vite.md) for official ignore patterns and plugin setup

## Guidelines

### Generated route tree

- `routeTree.gen.ts` (typical path: `src/routeTree.gen.ts`) is **generated** from `src/routes/`; edits belong in route modules, not this file.
- **Lint / format ignore:** exclude it from ESLint and Prettier (or Biome) so generated code stays untouched. The TanStack doc links patterns for [Prettier ignore](https://prettier.io/docs/en/ignore.html#ignoring-files) and [ESLint ignore](https://eslint.org/docs/latest/use/configure/ignore#ignoring-files).
- **VS Code:** optionally mark the file readonly and exclude from search/watch, as recommended in the installation doc, for quieter diffs after renames.

## Setup

### Ignore generated routes

In `eslint.config` or `.eslintignore`, exclude `**/routeTree.gen.ts`. Add the same pattern to `.prettierignore`.

## Usage

### CI and editors

- Apply the same ignore patterns in CI as locally so `npm run lint` and Prettier skip the generated file.
- After changing route files, regenerate (or let the dev server regenerate) and confirm the generated file stays ignored.
