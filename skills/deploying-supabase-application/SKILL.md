---
name: deploying-supabase-application
description: Prepare a Supabase app for production deploy and connect it to a remote project via Supabase GitHub integration — discover the working directory, validate migrations and functions locally, and document dashboard settings (production branch, deploy to production). Use when deploying Supabase, connecting a repository to Supabase GitHub integration, setting up backend auto-deploy on merge, or validating migrations and Edge Functions before production release.
version: 1.0.0
---

# Deploying a Supabase application

Deploy backend changes using **Supabase GitHub integration**: connect Git in the dashboard, then merge to the production branch to apply migrations and deploy declared Edge Functions. No `supabase link` or manual `db push` is required for the default workflow.

## Agent workflow

Run these steps **in order**.

### 1. Discovery (required)

Locate the Supabase project root in the repository. **Do not guess** when multiple candidates exist — ask the user.

| Question | How to resolve | If unclear |
| --- | --- | --- |
| **Supabase root** | Directory containing `config.toml` and `migrations/` | List candidates; ask user to pick one |
| **Working directory** | Repo-relative path to the Supabase root (used in dashboard) | See [discovering-supabase-root.md](references/discovering-supabase-root.md) |
| **Production branch** | User's deploy branch (`main`, `master`, `production`, etc.) | Ask user; default `main` only when repo convention is obvious |
| **Edge Functions** | `[functions.*]` entries in `config.toml` | List declared functions |
| **Storage buckets** | `[storage.buckets.*]` entries in `config.toml` | List declared buckets |

Full discovery heuristics: [discovering-supabase-root.md](references/discovering-supabase-root.md).

### 2. Validate locally (required before first connect)

From the Supabase root:

```bash
supabase db start
supabase db reset --local   # or: supabase migration up --local
supabase db lint
```

If the project has Edge Functions, run any project-specific checks (e.g. `deno check`, `deno test` under `functions/`).

Fix migration or function errors **before** connecting GitHub or merging to the production branch.

### 3. Document dashboard settings for the user

The agent validates repo readiness; the user connects Git in **Project Settings → Integrations → GitHub**. Provide a filled-in table from [configuring-github-integration.md](references/configuring-github-integration.md).

Minimum settings:

| Setting | Value |
| --- | --- |
| Git repository | User selects repo |
| Working directory | Discovered Supabase root path |
| Production branch | User's branch |
| Deploy to production | **Enabled** |

### 4. Post-connect verification

After the user enables integration and merges (or pushes) to the production branch:

- Confirm deploy succeeded in the Supabase dashboard (integration logs / deployment status)
- For schema or function behavior changes, run project-specific smoke checks

First merge to the production branch populates a new remote project — no separate bootstrap deploy is needed.

Troubleshooting: [troubleshooting-deployment.md](references/troubleshooting-deployment.md).

## What GitHub integration deploys

| Deployed on merge to production branch | Not deployed automatically |
| --- | --- |
| New files in `migrations/` | Seed files (`seed.sql`, etc.) |
| Edge Functions declared in `config.toml` | Undeclared functions |
| Storage buckets declared in `config.toml` | Edge Function secrets |
| | Auth, SMTP, Site URL, API settings in `config.toml` |

Configure secrets and auth in the Supabase dashboard after deploy.

## Decision tree

```
Deploy Supabase backend?
├─ Locate config.toml + migrations/ → working directory for dashboard
├─ Migrations apply + db lint pass locally?
│  └─ No → fix before connect or merge
├─ User connects GitHub integration + enables Deploy to production
└─ Merge to production branch → verify in dashboard
```

## What this skill covers

| Topic | Reference |
| --- | --- |
| Supabase root, working directory, local validation | [discovering-supabase-root.md](references/discovering-supabase-root.md) |
| Dashboard GitHub integration settings | [configuring-github-integration.md](references/configuring-github-integration.md) |
| Common failures | [troubleshooting-deployment.md](references/troubleshooting-deployment.md) |
