# Managing Imports

## Overview

How TypeScript code crosses package boundaries, and how a JIT library aliases its own internals. One consumer rule for library → library and library → app.

## Prerequisites

[monorepo-contract.md](./monorepo-contract.md) — scoped names, `exports`, JIT vs compiled.

## Guidelines

### Cross-package

Import via the package name and `exports` subpaths, with `workspace:*` in the consumer’s `package.json`.

| Direction | Import |
| --- | --- |
| `packages/a` → `packages/b` | `@scope/b` or `@scope/b/subpath` |
| `apps/x` → `packages/b` | identical |
| `packages/b` → `apps/x` | never — apps are leaves |
| Any → another package’s `src/` by relative path or `compilerOptions.paths` | never |

`compilerOptions.paths` never points at another package.

### In-package

| Kind | Rule |
| --- | --- |
| Nearby files | Relative imports (`./foo`, `../bar`) |
| JIT library internals | Node.js subpath imports: `"imports": { "#*": "./src/*" }`, then `import { x } from "#utils/x"` |
| App-only alias | `@/*` → `./src/*` (plus bundler alias) is optional for leaves that nothing else compiles |

TypeScript `paths` inside a JIT library break when a consumer compiles that library as source. Use `"imports"`, not `compilerOptions.paths`, for that alias.

### `exports` shape

```json
{
  "name": "@scope/ui",
  "private": true,
  "exports": {
    ".": "./src/index.ts",
    "./button": "./src/button.ts"
  }
}
```

Consumer:

```json
{
  "dependencies": {
    "@scope/ui": "workspace:*"
  }
}
```

```ts
import { Button } from "@scope/ui/button";
```

### JIT `"imports"`

```json
{
  "imports": {
    "#*": "./src/*"
  }
}
```

## Examples

### Valid

```ts
import { api } from "@scope/api";
import { Button } from "@scope/ui/button";
import { formatDate } from "#utils/date";
import { helper } from "./helper";
```

### Invalid

```ts
import { Button } from "../../packages/ui/src/button";
import { api } from "@scope/web-app";
```

```json
{
  "compilerOptions": {
    "paths": {
      "@scope/ui": ["../ui/src/index.ts"]
    }
  }
}
```

## Related

- [managing-package-scripts.md](./managing-package-scripts.md)
