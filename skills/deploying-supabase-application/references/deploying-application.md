# Deploying Application

## Overview

**Execution mode.** Prepares a Supabase app to deploy on each push to the production branch.

## Guidelines

### 1. Discover

Run [discovering-supabase-root.md](./discovering-supabase-root.md).

### 2. Check Edge Functions

When the app has Edge Functions, from the Supabase root (or the project's own check and test scripts):

```bash
deno check --config functions/deno.json functions/*/index.ts
deno test --config functions/deno.json functions/
```

Fix errors before merging.

### 3. Production block

`config.toml` lacks `[remotes.production]`, or a function secret name is undeclared → run [configuring-remote-project.md](./configuring-remote-project.md).

### 4. Write repository files

1. `.github/workflows/deploy-supabase.yml` per [configuring-github-actions.md](./configuring-github-actions.md) → **Workflow file**.
2. `<supabase-root>/DEPLOYMENT.md` per [deployment-contract.md](./deployment-contract.md) → **Deployment doc**.

### 5. Secrets

Run [configuring-secrets.md](./configuring-secrets.md).

### 6. Confirm to the user

- Files written, to commit and merge through a PR
- The `DEPLOYMENT.md` report per [deployment-contract.md](./deployment-contract.md) → **Deployment doc**
- After the merge: `gh run list --workflow deploy-supabase.yml` shows success and `supabase functions list --project-ref <ref>` lists the declared functions; then the project's smoke checks. A failure → [troubleshooting-deployment.md](./troubleshooting-deployment.md)
