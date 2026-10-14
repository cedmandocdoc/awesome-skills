# Deploying Application

## Overview

**Execution mode.** Prepares a Supabase app for **Supabase GitHub integration**: once the user connects the repository, each merge to the production branch applies migrations and deploys declared Edge Functions and buckets.

## Guidelines

### 1. Discover

Per [discovering-supabase-root.md](./discovering-supabase-root.md): Supabase root, dashboard working directory, production branch, declared Edge Functions, and storage buckets.

### 2. Validate locally

Per [discovering-supabase-root.md](./discovering-supabase-root.md) → **Local validation**, from the Supabase root. Fix errors before the user connects GitHub or merges to the production branch.

### 3. Confirm to the user

Reply with:

- A filled [configuring-github-integration.md](./configuring-github-integration.md) → **Settings reference** table (repository, working directory, production branch, **Deploy to production** enabled) to enter in **Project Settings → Integrations → GitHub**
- The manual items the app depends on, per [discovering-supabase-root.md](./discovering-supabase-root.md) → **What deploys on merge**
- After the user enables the integration and merges: confirm the deploy in the Supabase dashboard, then run the project's smoke checks for changed schema or functions. The first merge populates a new remote project. A failure → [troubleshooting-deployment.md](./troubleshooting-deployment.md)
