# Troubleshooting Deployment

## Overview

**Read-only.** Diagnose local validation failures, deploy workflow failures, and production misbehavior.

## Guidelines

### Local validation fails

| Symptom | Likely cause | Action |
| --- | --- | --- |
| Function check fails | Type or import errors in Edge Functions | Run `deno check` / project scripts; fix and retest |

### Deploy workflow fails

| Symptom | Likely cause | Action |
| --- | --- | --- |
| Check secrets fails | A listed secret is unset in GitHub | Set each per [configuring-secrets.md](./configuring-secrets.md); `gh run rerun <run-id>` |
| Check production block fails | `config.toml` lacks `[remotes.production]` with `project_id` | Run [configuring-remote-project.md](./configuring-remote-project.md) |
| A step answers 401 or 403 | The CI access token expired, or lacks the project or a permission the step needs | Fix or replace it per [configuring-github-actions.md](./configuring-github-actions.md) → **CI access token** |
| `db push`: "IPv6 is not supported on your current network" | The token lacks Connection Pooling: Read, so `link` recorded no pooler URL | Add the permission |
| Rehearse migrations fails | A migration or `seed.sql` fails on an empty database, or `db lint` reports an error; production is untouched | Fix it; merge |
| `db push` fails on SQL | Invalid migration | Fix the migration; push again |
| `config diff` lists changes outside the plan | `[remotes.production]` `project_id` differs from the linked ref | Fix the ref; seed the block per [configuring-remote-project.md](./configuring-remote-project.md) → **Auth config** |
| `secrets set`: no secrets to set | No `[edge_runtime.secrets]` entry, or none resolved | Declare them per [configuring-remote-project.md](./configuring-remote-project.md) → **Edge Function secrets**, or drop the line |
| Functions not updated | Function not declared in `config.toml` | Add `[functions.<name>]` and push again |
| Buckets not created | Bucket not declared in `config.toml` | Add `[storage.buckets.<name>]` and push again |
| Workflow did not run | Push outside the workflow's `paths` or branch | Check `on.push` in `deploy-supabase.yml`; `gh workflow run deploy-supabase.yml` |

### Production behaves wrong

| Symptom | Likely cause | Action |
| --- | --- | --- |
| Reset or invite links point to `localhost` | `site_url` or `uri_allow_list` holds a local value | Set the production origins in `[remotes.production.auth]`; merge |
| Auth emails fail or are rate-limited | Custom SMTP not set; the built-in sender is in use | Add `[remotes.production.auth.email.smtp]` and the `SMTP_PASS` secret; merge |
| Function fails on a missing setting (an `*_unconfigured` error) | Secret not declared or not set | `supabase secrets list`; declare it in `[edge_runtime.secrets]` and set the GitHub secret |

### Local CLI fails

| Symptom | Likely cause | Action |
| --- | --- | --- |
| CLI call answers 401 or 403 | `supabase login` session expired, the account lacks the project's organization, or an exported `SUPABASE_ACCESS_TOKEN` replaces the login | Unset the variable; `supabase login` |

### Debugging deploys

- `gh run list --workflow deploy-supabase.yml`, then `gh run view <run-id> --log-failed`
- Re-run: `gh run rerun <run-id>` after fixing a secret, or push a fix to the production branch
- Remote state: `supabase functions list`, `supabase secrets list` (names and digests), `supabase migration list --linked`

## References

- [Deploy with GitHub Actions](https://supabase.com/docs/guides/deployment/managing-environments)
- [Personal access tokens](https://supabase.com/docs/guides/platform/personal-access-tokens)
