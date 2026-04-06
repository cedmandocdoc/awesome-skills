# Adding Registry Components

## Overview

Use this guide before vendoring a *registry item* (for example shadcn/ui or another registry that exposes `registry-item.json` URLs) into `src/ui/`. Validate output with `npx shadcn@latest view`, then run **add-registry-component.js**—or skip the script and build the UI manually when validation fails.

## Prerequisites

- [abstracting-component.md](./abstracting-component.md) — when to prefer `src/ui/` primitives
- [creating-component.md](./creating-component.md) — manual UI when the registry path is unavailable
- [setting-up-theming.md](./setting-up-theming.md), [structuring-project.md](./structuring-project.md)

## Validate with `shadcn view`

Before running the add script, confirm the registry entry resolves as a valid registry item:

1. Run (replace `url` with the registry URL or slug the registry documents for `view`):

   ```bash
   npx shadcn@latest view "${url}"
   ```

2. Confirm the command succeeds (exit code **0**, no error that indicates failure).

3. Parse stdout as JSON. `shadcn` may wrap JSON in a markdown code fence; strip fences if present, then parse.

4. Expect a **JSON array** whose elements are registry item objects. At least one object includes:

   `"$schema": "https://ui.shadcn.com/schema/registry-item.json"`

If the command fails, stdout is not valid JSON, the payload is not a JSON array, or no element includes that `$schema`, **do not** run the add script for that component. Skip it and implement the UI manually per [creating-component.md](./creating-component.md).

## Run the add script

From the app **project root**, run [add-registry-component.js](../scripts/add-registry-component.js). Pass a registry name or URL, as supported by `shadcn view`.

```bash
node path/to/building-react-web-application/scripts/add-registry-component.js button
node path/to/building-react-web-application/scripts/add-registry-component.js "https://ui.shadcn.com/r/styles/new-york/button.json"
```

Use `--root <project-dir>` when the current working directory is not the app root.

## Manual fallback

When validation fails or the script cannot resolve a dependency (for example namespaced registry IDs without a URL), add the component under `src/ui/` by hand per [creating-component.md](./creating-component.md), keeping UI presentation-only per [abstracting-component.md](./abstracting-component.md).
