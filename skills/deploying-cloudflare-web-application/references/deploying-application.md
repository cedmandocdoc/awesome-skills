# Deploying Application

## Overview

**Execution mode.** Prepares a repository to deploy to Cloudflare Workers on each push to the production branch.

## Guidelines

### 1. Discover

Run [discovering-application.md](./discovering-application.md).

### 2. Write repository files

1. `wrangler.toml` or `wrangler.jsonc` at the Wrangler root per [configuring-wrangler.md](./configuring-wrangler.md).
2. The app's production env file with the public build values, per [configuring-github-actions.md](./configuring-github-actions.md) → **Values**.
3. `.nvmrc` with the Node major version the build needs, 22 or later, when missing or older.
4. `.github/workflows/deploy-<worker>.yml` per [configuring-github-actions.md](./configuring-github-actions.md) → **Workflow file**.
5. `<wrangler-root>/DEPLOYMENT.md` per [deployment-contract.md](./deployment-contract.md) → **Deployment doc**.

### 3. Secrets

Run [configuring-secrets.md](./configuring-secrets.md).

### 4. Confirm to the user

- Files written, to commit and merge through a PR
- The `DEPLOYMENT.md` report per [deployment-contract.md](./deployment-contract.md) → **Deployment doc**
- Checks after the first run: the app loads on its `*.workers.dev` URL or custom domain; deep links and refresh work on client-routed paths (SPA); build-time public values are in the bundle. A failure → [troubleshooting-deployment.md](./troubleshooting-deployment.md)
