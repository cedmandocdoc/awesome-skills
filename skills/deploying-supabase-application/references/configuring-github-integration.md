# Configuring GitHub Integration

## Overview

Dashboard settings after local validation passes.

## Guidelines

### Setup steps

1. Open the **remote** Supabase project in the dashboard.
2. Go to **Project Settings → Integrations → GitHub**.
3. Click **Authorize GitHub** and approve the Supabase GitHub app.
4. Select the **Git repository**.
5. Set **Working directory** to the discovered Supabase root path (see [discovering-supabase-root.md](discovering-supabase-root.md)).
6. Set **Production branch** (e.g. `main`).
7. Enable **Deploy to production**.
8. Click **Enable integration** (or save).

### Settings reference

| Setting | Required | Notes |
| --- | --- | --- |
| Git repository | Yes | User selects repo |
| Working directory | Yes | Repo-relative path to Supabase root |
| Production branch | Yes | Branch that triggers production deploy |
| Deploy to production | Yes | Must be enabled for auto-deploy on merge |
| Automatic branching | No | Pro plan — preview DB per Git branch |
| Supabase changes only | No | Only create branches when Supabase files change |

### Recommended follow-ups

| Action | Why |
| --- | --- |
| Required check on production branch | Block merges when migration checks fail (GitHub repo settings) |
| Deploy failure notifications | Supabase branch email notifications in integration settings |

### Working directory examples

| Repository layout | Working directory |
| --- | --- |
| `supabase/config.toml` at root | `.` |
| `apps/api/config.toml` | `apps/api` |
| `packages/backend/supabase/config.toml` | `packages/backend` |

### Ongoing releases

1. Merge backend changes to the production branch.
2. Confirm deploy succeeded in the Supabase dashboard or GitHub checks.
3. Run smoke tests if schema or function behavior changed.

Day-to-day releases do **not** require `supabase db push` or `supabase functions deploy` from a developer machine.

Troubleshooting: [troubleshooting-deployment.md](troubleshooting-deployment.md).

### Official docs

- [GitHub integration](https://supabase.com/docs/guides/deployment/branching/github-integration)
- [Deployment overview](https://supabase.com/docs/guides/deployment)
