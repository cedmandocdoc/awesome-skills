---
name: deploying-supabase-application
description: Prepare a Supabase app for production deploy and connect it to a remote project via Supabase GitHub integration — discover the working directory, validate migrations and functions locally, and document dashboard settings (production branch, deploy to production). Use when deploying Supabase, connecting a repository to Supabase GitHub integration, setting up backend auto-deploy on merge, or validating migrations and Edge Functions before production release.
version: 1.0.0
---

# Deploying a Supabase application

## Overview

Deploy backend changes with **Supabase GitHub integration**: connect Git in the dashboard, then merge to the production branch to apply migrations and deploy declared Edge Functions. No `supabase link` or manual `db push` for the default workflow.

| Deployed on merge to production branch | Not deployed automatically |
| --- | --- |
| New files in `migrations/` | Seed files (`seed.sql`, etc.) |
| Edge Functions declared in `config.toml` | Undeclared functions |
| Storage buckets declared in `config.toml` | Edge Function secrets; Auth, SMTP, Site URL, API settings in `config.toml` |

Configure secrets and auth in the Supabase dashboard after deploy.

## Agent workflow

Run these steps in order. Works wherever the agent can read and write repository files.

### Steps

1. **Discovery** — Locate the Supabase root (`config.toml` + `migrations/`), dashboard working directory, production branch, declared Edge Functions, and storage buckets. Ask the user when multiple candidates exist. Default production branch to `main` only when repo convention is obvious. Follow [discovering-supabase-root.md](references/discovering-supabase-root.md).

2. **Validate locally** — From the Supabase root, before first connect:

   ```bash
   supabase db start
   supabase db reset --local   # or: supabase migration up --local
   supabase db lint
   ```

   If Edge Functions exist, run project-specific checks (e.g. `deno check`, `deno test` under `functions/`). Fix errors before connecting GitHub or merging to the production branch.

3. **Document dashboard settings** — User connects Git in **Project Settings → Integrations → GitHub**. Provide a filled-in table from [configuring-github-integration.md](references/configuring-github-integration.md):

   | Setting | Value |
   | --- | --- |
   | Git repository | User selects repo |
   | Working directory | Discovered Supabase root path |
   | Production branch | User's branch |
   | Deploy to production | **Enabled** |

4. **Post-connect verification** — After the user enables integration and merges to the production branch:

   - Confirm deploy succeeded in the Supabase dashboard
   - Run project-specific smoke checks for schema or function behavior changes

   First merge to the production branch populates a new remote project. Troubleshooting: [troubleshooting-deployment.md](references/troubleshooting-deployment.md).

### Decision tree

```
Deploy Supabase backend?
├─ Locate config.toml + migrations/ → working directory for dashboard
├─ Migrations apply + db lint pass locally?
│  └─ No → fix before connect or merge
├─ User connects GitHub integration + enables Deploy to production
└─ Merge to production branch → verify in dashboard
```

## Reference index

| Doc | When to use |
| --- | --- |
| [discovering-supabase-root.md](references/discovering-supabase-root.md) | Supabase root, working directory, local validation |
| [configuring-github-integration.md](references/configuring-github-integration.md) | Dashboard GitHub integration settings |
| [troubleshooting-deployment.md](references/troubleshooting-deployment.md) | Local validation, deploy, and integration failures |
