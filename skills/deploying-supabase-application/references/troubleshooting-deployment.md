# Troubleshooting Deployment

## Overview

Diagnose local validation failures, deploy failures on merge, and wrong-target integration issues.

## Guidelines

### Local validation fails

| Symptom | Likely cause | Action |
| --- | --- | --- |
| `supabase db reset` fails | Invalid or conflicting migration | Fix SQL; rerun locally before connect |
| `supabase db lint` errors | Schema or policy issues | Resolve lint findings; commit fixes |
| Function check fails | Type or import errors in Edge Functions | Run `deno check` / project scripts; fix and retest |

### Deploy fails on merge

| Symptom | Likely cause | Action |
| --- | --- | --- |
| Deploy fails on merge | Invalid migration or function config | Check integration logs in Supabase dashboard; fix migration; re-merge |
| Functions not updated | Function not declared in `config.toml` | Add `[functions.<name>]` and merge again |
| Buckets not created | Bucket not declared in `config.toml` | Add `[storage.buckets.<name>]` and merge again |
| Migrations not picked up | Incorrect working directory | Confirm path points at folder with `migrations/` |

### Wrong target or no deploy

| Symptom | Likely cause | Action |
| --- | --- | --- |
| Wrong project updated | Wrong repo or working directory | Verify integration settings in Project Settings → Integrations → GitHub |
| No deploy on push | **Deploy to production** disabled | Enable in integration settings |
| No deploy on push | Push to non-production branch | Merge to production branch or adjust branch setting |

### Debugging deploys

- Supabase dashboard → Project Settings → Integrations → GitHub → deployment logs
- GitHub → repository → Checks tab on the merge commit
- Re-run by pushing a fix to the production branch after resolving the failure

### Official docs

- [GitHub integration](https://supabase.com/docs/guides/deployment/branching/github-integration)
- [Deployment overview](https://supabase.com/docs/guides/deployment)
