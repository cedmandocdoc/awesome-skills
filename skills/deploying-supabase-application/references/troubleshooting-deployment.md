# Troubleshooting Deployment

## Overview

**Read-only.** Diagnose local validation failures, deploy workflow failures, and provisioning errors.

## Guidelines

### Local validation fails

| Symptom | Likely cause | Action |
| --- | --- | --- |
| `supabase db reset` fails | Invalid or conflicting migration | Fix SQL; rerun locally before pushing |
| `supabase db lint` errors | Schema or policy issues | Resolve lint findings; commit fixes |
| Function check fails | Type or import errors in Edge Functions | Run `deno check` / project scripts; fix and retest |

### Deploy workflow fails

| Symptom | Likely cause | Action |
| --- | --- | --- |
| `supabase link` fails | `SUPABASE_PROJECT_REF` variable or `SUPABASE_ACCESS_TOKEN` secret missing | `gh variable list`, `gh secret list`; run **Provision** |
| A step answers 401 or 403 | The CI access token expired, or lacks the project or a permission the step needs | Fix or replace it per [configuring-github-actions.md](./configuring-github-actions.md) → **CI access token** |
| `db push` fails on authentication | `SUPABASE_DB_PASSWORD` secret wrong | Fix it in `deploy.secrets.env`; `gh secret set -f <supabase-root>/deploy.secrets.env` |
| `db push` fails on SQL | Invalid migration | Fix the migration; push again |
| Functions not updated | Function not declared in `config.toml` | Add `[functions.<name>]` and push again |
| Buckets not created | Bucket not declared in `config.toml` | Add `[storage.buckets.<name>]` and push again |
| Workflow did not run | Push outside the workflow's `paths` or branch | Check `on.push` in `deploy-supabase.yml`; `gh workflow run deploy-supabase.yml` |

### Provision fails

| Symptom | Likely cause | Action |
| --- | --- | --- |
| CLI call answers 401 or 403 | `supabase login` session expired, the account lacks the project's organization, or an exported `SUPABASE_ACCESS_TOKEN` replaces the login | Unset the variable; `supabase login` |
| `config diff` lists changes outside the plan | `[remotes.production]` missing, or its `project_id` differs from the linked ref | Seed the block per [configuring-remote-project.md](./configuring-remote-project.md) → **Auth config** |
| Reset or invite links point to `localhost` | `site_url` or `uri_allow_list` holds a local value | Run **Provision**; its config step pushes the production origins |
| Auth emails fail or are rate-limited | Custom SMTP not set; the built-in sender is in use | Set SMTP through **Provision** |
| Function fails on a missing setting (an `*_unconfigured` error) | Secret missing on the project | `supabase secrets list`; fill `functions.secrets.env`; run **Provision** |

### Debugging deploys

- `gh run list --workflow deploy-supabase.yml`, then `gh run view <run-id> --log-failed`
- Re-run: `gh run rerun <run-id>` after fixing a secret, or push a fix to the production branch
- Remote state: `supabase functions list`, `supabase secrets list`, `supabase migration list` (asks for the database password)

## References

- [Deploy with GitHub Actions](https://supabase.com/docs/guides/deployment/managing-environments)
- [Personal access tokens](https://supabase.com/docs/guides/platform/personal-access-tokens)
