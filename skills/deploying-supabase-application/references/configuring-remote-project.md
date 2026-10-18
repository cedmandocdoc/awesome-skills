# Configuring Remote Project

## Overview

**Execution mode.** Brings the production project to the state the repository and the product TRD declare: the project itself, the GitHub values the deploy workflow reads, Edge Function secrets, and Auth settings from `config.toml`. Each run reads remote state, shows one plan, and applies after the user confirms. Migrations, declared functions, and declared buckets deploy through the workflow ([configuring-github-actions.md](./configuring-github-actions.md)).

## Prerequisites

Discovery per [discovering-supabase-root.md](./discovering-supabase-root.md). Run CLI commands with `--workdir <working-directory>`.

## Guidelines

### Auth config

`config.toml` `[auth]` holds local values. Production values live in a `[remotes.production]` block whose `project_id` is the production ref; the CLI overlays it when the linked project matches, and `supabase config push` writes the result.

```toml
[remotes.production]
project_id = "<ref>"

[remotes.production.auth]
site_url = "https://<host>"
additional_redirect_urls = ["https://<host>/**", "<scheme>://**"]

[remotes.production.auth.email.smtp]
pass = "env(SMTP_PASS)"
```

| Rule | Detail |
| --- | --- |
| Seed | No block for the ref → `supabase config pull --workdir <working-directory>` writes the live settings into one, so a push changes only what the plan adds |
| Scope | `config push` writes every remotely managed section the file declares (API, database settings, Auth, Storage); the block holds the production value of each |
| Secrets | `env(NAME)` for SMTP passwords and OAuth provider secrets; values in `auth.secrets.env` |
| Redirect URLs | Keep every current URL; add the missing `https://<host>/**` and `<scheme>://**` entries |
| Shared project | A non-local `site_url` that differs from the TRD belongs to another app → keep it unless the user says otherwise |

### 1. Discover

| Item | Source |
| --- | --- |
| Project | **Setup** → Production project; new → name, organization (TRD or `supabase orgs list`), and region from the user |
| GitHub values | [configuring-github-actions.md](./configuring-github-actions.md) → **GitHub values** |
| Function secret names | `Deno.env.get("…")` under `functions/`, minus `SUPABASE_*` (hosted functions receive those) |
| Names to unset | Names the project marks local-only (a local mail catcher URL, a fake-provider flag); ask when a name's scope is unclear |
| Auth settings | `[remotes.production]` in `config.toml` per **Auth config**: the TRD's Auth origins, the production mail provider; local values (Mailpit SMTP, `127.0.0.1` URLs) never ship |

### 2. Fill the secrets files

Write missing names with blank values, tell the user where each value comes from, and continue once `grep -c '=$' <file>` returns `0` for each file.

| File | Names |
| --- | --- |
| `<supabase-root>/deploy.secrets.env` | `SUPABASE_DB_PASSWORD`. New project → generate it without printing: `printf 'SUPABASE_DB_PASSWORD=%s\n' "$(openssl rand -hex 24)" >> <file>`. Existing → the user's password (Project Settings → Database → Reset database password when unknown) |
| `<supabase-root>/functions.secrets.env` | Function secret names |
| `<supabase-root>/auth.secrets.env` | Each `env(NAME)` the production block reads (`SMTP_PASS`, OAuth provider secrets) |

### 3. Read remote state

| Item | Check |
| --- | --- |
| Project | `supabase projects list` |
| GitHub values | `gh variable list`, `gh secret list` (names only) |
| Function secrets | `supabase secrets list` (names and digests); compare a local value without printing it: `printf %s "$VALUE" \| shasum -a 256` |
| Config | `( set -a; . <supabase-root>/auth.secrets.env; set +a; supabase config diff --workdir <working-directory> )`; no block for the ref yet → seed it first per **Auth config** |

### 4. Plan and confirm

Show one table: item, remote now, after. Function secrets show as new / changed / unchanged / unset; config shows each `config diff` change. Apply after the user confirms.

### 5. Apply

In this order; skip what already matches.

1. **Project.** New → `supabase projects create <name> --org-id <org> --region <region> --db-password "$SUPABASE_DB_PASSWORD"`, then `supabase link --project-ref <ref> --workdir <working-directory>`.
2. **GitHub values.** `gh variable set` each variable per [configuring-github-actions.md](./configuring-github-actions.md) → **GitHub values**; `gh secret set -f <supabase-root>/deploy.secrets.env`.
3. **Function secrets.**

   ```bash
   supabase secrets set --env-file <supabase-root>/functions.secrets.env --workdir <working-directory>
   supabase secrets unset <NAME> --workdir <working-directory>   # each name to unset
   ```

4. **Config.** `( set -a; . <supabase-root>/auth.secrets.env; set +a; supabase config push --yes --workdir <working-directory> )`.

### 6. Verify

Re-run step 3: every planned item matches.

### 7. Confirm to the user

- Applied changes, per the plan table
- The GitHub values now set, by name; the deploy workflow can run on the next push
- Items left for the user, such as a skipped `site_url`

## Related

- [configuring-github-actions.md](./configuring-github-actions.md)
- [executing-direct-deploy.md](./executing-direct-deploy.md)
- [troubleshooting-deployment.md](./troubleshooting-deployment.md)

## References

- [Managing secrets](https://supabase.com/docs/guides/functions/secrets)
- [Redirect URLs](https://supabase.com/docs/guides/auth/redirect-urls)
- [Remote config overrides](https://supabase.com/docs/guides/deployment/branching/configuration)
