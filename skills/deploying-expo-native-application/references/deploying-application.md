# Deploying Application

## Overview

**Execution mode.** Prepares a repository to build and submit an Expo app through GitHub Actions: on each push to the production branch, the workflow starts a production EAS build that submits to TestFlight and the Play internal track. Writes repository files only; the **Provision** recipe changes EAS, the stores, and GitHub settings.

## Guidelines

### 1. Discover

Per [discovering-application.md](./discovering-application.md): app package, platforms, bundle ID and package name, Expo project, profiles, runtime variables, store IDs, Expo account, watch paths.

### 2. Validate locally

[discovering-application.md](./discovering-application.md) → **Validate the app config**. Fix errors before the first build.

### 3. Write repository files

1. `<app-package>/eas.json` per [configuring-eas.md](./configuring-eas.md) → **Profiles**.
2. `.nvmrc` with the Node major version the build needs, 22 or later, when missing or older.
3. `.github/workflows/deploy-<app>.yml` per [configuring-github-actions.md](./configuring-github-actions.md) → **Workflow file**.
4. `<app-package>/DEPLOYMENT.md` per **Setup** → Deployment doc, when missing.

### 4. Confirm to the user

Reply with:

- Files written
- The `DEPLOYMENT.md` rows still `todo`, grouped by owner; offer the **Provision** recipe ([configuring-stores.md](./configuring-stores.md)), since a push before it fails the workflow
- After the first run: `gh run list --workflow deploy-<app>.yml` shows success; `eas build:list --limit 2 --json --non-interactive` shows the builds with submissions; the build appears in TestFlight and the Play internal track. A failure → [troubleshooting-deployment.md](./troubleshooting-deployment.md)
