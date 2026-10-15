# Deploying Application

## Overview

**Execution mode.** Prepares a Supabase app to deploy through GitHub Actions: once the workflow and its GitHub values exist, each push to the production branch applies migrations and deploys declared Edge Functions and buckets. Writes repository files only; the **Provision** recipe changes the project and GitHub settings.

## Guidelines

### 1. Discover

Per [discovering-supabase-root.md](./discovering-supabase-root.md): Supabase root, working directory, production branch, production intent, declared Edge Functions, and storage buckets.

### 2. Validate locally

Per [discovering-supabase-root.md](./discovering-supabase-root.md) → **Local validation**, from the Supabase root. Fix errors before pushing to the production branch.

### 3. Write the workflow

`.github/workflows/deploy-supabase.yml` per [configuring-github-actions.md](./configuring-github-actions.md) → **Workflow file**.

### 4. Confirm to the user

Reply with:

- Files written
- The **Provision** items still missing per [discovering-supabase-root.md](./discovering-supabase-root.md) → **What deploys where**, including the GitHub values the workflow reads; offer to run **Provision**, since a push before it fails the workflow
- After the push: `gh run list --workflow deploy-supabase.yml` shows success and `supabase functions list --project-ref <ref>` lists the declared functions; then the project's smoke checks. A failure → [troubleshooting-deployment.md](./troubleshooting-deployment.md)
