# Deploying Application

## Overview

**Execution mode.** Prepares a repository to deploy to Cloudflare Workers through GitHub Actions: on each push to the production branch, the workflow builds the app, then runs `wrangler deploy`. Writes repository files only; the **Provision** recipe changes Cloudflare and GitHub settings.

## Guidelines

### 1. Discover

Per [discovering-application.md](./discovering-application.md): deploy target, build command, output path, SPA mode, build-time variables, Wrangler root, hosts, and watch paths.

### 2. Validate locally

Confirm the build produces files in the output directory:

```bash
<build-command>
ls <output-directory>
```

### 3. Write repository files

1. `wrangler.toml` or `wrangler.jsonc` at the Wrangler root, with `wrangler` pinned in `devDependencies`, per [configuring-wrangler.md](./configuring-wrangler.md).
2. `.nvmrc` with the Node major version the build needs, when missing.
3. `.github/workflows/deploy-<worker>.yml` per [configuring-github-actions.md](./configuring-github-actions.md) → **Workflow file**.

### 4. Confirm to the user

Reply with:

- Files written
- Resources, runtime secrets, and GitHub values the app still needs; offer the **Provision** recipe ([configuring-resources.md](./configuring-resources.md)), since a push before it fails the workflow
- Checks after the first run: the app loads on its `*.workers.dev` URL or custom domain; deep links and refresh work on client-routed paths (SPA); build-time public values are in the bundle. A failure → [troubleshooting-deployment.md](./troubleshooting-deployment.md)
