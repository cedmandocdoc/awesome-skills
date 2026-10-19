# Deploying Application

## Overview

**Execution mode.** Prepares a Supabase app to deploy through GitHub Actions: each push to the production branch applies migrations, the production config, Edge Function secrets, and declared Edge Functions and buckets.

## Guidelines

### 1. Discover

Per [discovering-supabase-root.md](./discovering-supabase-root.md): Supabase root, working directory, production branch, production intent, declared Edge Functions, and storage buckets.

### 2. Check Edge Functions

When the app has Edge Functions: per [discovering-supabase-root.md](./discovering-supabase-root.md) → **Local validation**, from the Supabase root. Fix errors before pushing to the production branch.

### 3. Production block

`config.toml` lacks `[remotes.production]`, or a function secret name is undeclared → run [configuring-remote-project.md](./configuring-remote-project.md).

### 4. Write the workflow

`.github/workflows/deploy-supabase.yml` per [configuring-github-actions.md](./configuring-github-actions.md) → **Workflow file**. An existing workflow that reads `${{ vars.SUPABASE_PROJECT_REF }}` → the Check production block step replaces it; the variable can go after the first green run.

### 5. Secrets

Run [configuring-secrets.md](./configuring-secrets.md).

### 6. Confirm to the user

Reply with:

- Files written, to commit and merge through a PR
- The secrets still to set, from step 5
- After the merge: `gh run list --workflow deploy-supabase.yml` shows success and `supabase functions list --project-ref <ref>` lists the declared functions; then the project's smoke checks. A failure → [troubleshooting-deployment.md](./troubleshooting-deployment.md)
