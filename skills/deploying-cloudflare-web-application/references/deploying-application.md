# Deploying Application

## Overview

**Execution mode.** Prepares a repository for Cloudflare Workers Builds: on each push to the connected branch, Cloudflare runs the build command, then `npx wrangler deploy`.

## Guidelines

### 1. Discover

Per [discovering-application.md](./discovering-application.md): deploy target, build command, output path, SPA mode, build-time env vars, and dashboard root directory.

### 2. Validate locally

Confirm the build produces files in the output directory:

```bash
<build-command>
ls <output-directory>
```

### 3. Write repository files

1. `wrangler.toml` or `wrangler.jsonc` at the Wrangler project root, with `wrangler` pinned in `devDependencies`, per [configuring-wrangler.md](./configuring-wrangler.md).
2. Optional Node version hint: `engines` in `package.json` or `.nvmrc`.

### 4. Confirm to the user

Reply with:

- Files written
- A filled [configuring-github-integration.md](./configuring-github-integration.md) → **Settings reference** table to enter in **Workers & Pages → Worker → Settings → Builds**, plus the build variables to set
- Checks after the first build: the app loads on its `*.workers.dev` URL or custom domain; deep links and refresh work on client-routed paths (SPA); build-time public env vars are in the bundle. A failure → [troubleshooting-deployment.md](./troubleshooting-deployment.md)
