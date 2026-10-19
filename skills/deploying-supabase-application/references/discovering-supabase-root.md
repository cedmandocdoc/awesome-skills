# Discovering Supabase Root

## Overview

**Read-only.** Resolves the Supabase root and the values the production block and the deploy workflow need, then confirms them with the user.

## Guidelines

### 1. Resolve

| Item | Usually from |
| --- | --- |
| Supabase root | The directory holding `config.toml` and `migrations/` |
| Working directory | Where the CLI runs (`--workdir`, the workflow's `working-directory`): the parent of a `supabase/` folder, else the root itself |
| Production branch | The branch the repo deploys from |
| Auth origins | The production web hosts and app schemes that sign in through this project, from the apps' config in the repo |
| Edge Functions, buckets | `[functions.*]` and `[storage.buckets.*]` in `config.toml`; only declared ones deploy |

Anything the repo does not make explicit → ask.

### 2. Check config.toml

1. `[db]` `major_version` matches the remote Postgres major version.
2. Every function under `functions/` that should deploy has `[functions.<name>]`.
3. Every bucket that should deploy has `[storage.buckets.<name>]`.

### 3. Confirm

Show the resolved values in one table; the user corrects any before files are written.

## Related

- [configuring-github-actions.md](./configuring-github-actions.md)
- [configuring-remote-project.md](./configuring-remote-project.md)
