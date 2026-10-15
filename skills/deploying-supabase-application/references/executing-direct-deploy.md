# Executing Direct Deploy

## Overview

**Execution mode.** Deploys functions and migrations to the linked project without a push: through the workflow on demand, or from the local CLI. Run from a checkout of the production branch.

## Prerequisites

Working directory per [discovering-supabase-root.md](./discovering-supabase-root.md). Local migrations need `SUPABASE_DB_PASSWORD` in `<supabase-root>/deploy.secrets.env`.

## Guidelines

### 1. Deploy

Show what deploys (the declared functions; migrations from `db push --dry-run`) and run after the user confirms.

| Path | Command |
| --- | --- |
| Workflow | `gh workflow run deploy-supabase.yml --ref <production-branch>` |
| Local CLI | `supabase functions deploy --use-api --workdir <working-directory>`, then `supabase db push --dry-run --password "$SUPABASE_DB_PASSWORD" --workdir <working-directory>` and the same without `--dry-run` |

`db push` records the migrations in the remote history, so the next workflow run does not apply them again.

### 2. Confirm to the user

Functions and migrations deployed; `supabase functions list` output, or the run from `gh run list --workflow deploy-supabase.yml`.
