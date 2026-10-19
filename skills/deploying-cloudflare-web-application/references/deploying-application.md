# Deploying Application

## Overview

**Execution mode.** Prepares a repository to deploy to Cloudflare Workers through GitHub Actions: on each push to the production branch, the workflow builds the app, creates missing resources, syncs Worker secrets, and runs `wrangler deploy`.

## Guidelines

### 1. Discover

Per [discovering-application.md](./discovering-application.md): deploy target, build command, output path, SPA mode, build-time variables, runtime secrets and bindings, Wrangler root, hosts, and watch paths.

### 2. Validate locally

Confirm the build produces files in the output directory:

```bash
<build-command>
ls <output-directory>
```

### 3. Write repository files

1. `wrangler.toml` or `wrangler.jsonc` at the Wrangler root, with `wrangler` pinned in `devDependencies`, per [configuring-wrangler.md](./configuring-wrangler.md).
2. The app's production env file with the public build values, per [configuring-github-actions.md](./configuring-github-actions.md) → **Values**.
3. `.nvmrc` with the Node major version the build needs, 22 or later, when missing or older.
4. `.github/workflows/deploy-<worker>.yml` per [configuring-github-actions.md](./configuring-github-actions.md) → **Workflow file**. An existing workflow that reads `${{ vars.* }}` → move each value into the committed file it belongs in; the GitHub variables can go after the first green run.

### 4. Secrets

Run [configuring-secrets.md](./configuring-secrets.md).

### 5. Confirm to the user

Reply with:

- Files written, to commit and merge through a PR
- The secrets still to set, from step 4
- Checks after the first run: the app loads on its `*.workers.dev` URL or custom domain; deep links and refresh work on client-routed paths (SPA); build-time public values are in the bundle. A failure → [troubleshooting-deployment.md](./troubleshooting-deployment.md)
