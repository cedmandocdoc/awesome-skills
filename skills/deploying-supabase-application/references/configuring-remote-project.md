# Configuring Remote Project

## Overview

**Execution mode.** Creates the production project when it is missing and writes what production needs into the repository: the `[remotes.production]` block with Auth and project settings and Edge Function secret declarations, then reports the public values apps read. The deploy workflow applies all of it on merge ([configuring-github-actions.md](./configuring-github-actions.md)).

## Prerequisites

Discovery per [discovering-supabase-root.md](./discovering-supabase-root.md). Run CLI commands with `--workdir <working-directory>`.

## Guidelines

### Auth config

`config.toml` `[auth]` holds local values. Production values live in a `[remotes.production]` block whose `project_id` is the production ref; the CLI overlays it when the linked project matches, and the workflow's `config push` writes the result.

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
| Seed | No block for the ref → `supabase link --project-ref <ref> --workdir <working-directory>`, then `supabase config pull --workdir <working-directory>` writes the live settings into one, so the first push changes only what the plan adds |
| Scope | `config push` writes every remotely managed section the block declares (API, database settings, Auth, Storage) and leaves undeclared settings as they are |
| Secrets | `env(NAME)` for SMTP passwords and OAuth provider secrets; the value is a GitHub secret of the same name |
| Redirect URLs | Keep every current URL; add the missing `https://<host>/**` and `<scheme>://**` entries |
| Shared project | A non-local `site_url` that differs from the TRD belongs to another app → keep it unless the user says otherwise |

### Edge Function secrets

```toml
[edge_runtime.secrets]
STRIPE_SECRET_KEY = "env(STRIPE_SECRET_KEY)"
```

One entry per `Deno.env.get("…")` name under `functions/`, minus `SUPABASE_*` (hosted functions receive those). A name the project marks local-only (a local mail catcher URL, a fake-provider flag) stays out; ask when a name's scope is unclear.

### 1. Discover

| Item | Source |
| --- | --- |
| Project | **Setup** → Production project; new → name, organization (TRD or `supabase orgs list`), and region from the user |
| Auth settings | Per **Auth config**: the TRD's Auth origins, the production mail provider; local values (Mailpit SMTP, `127.0.0.1` URLs) never ship |
| Function secret names | Per **Edge Function secrets** |

### 2. Plan and confirm

Show one table: item, now, after. A new project; the production block's changes (`supabase config diff --workdir <working-directory>` once linked); the function secrets to declare. Apply after the user confirms.

### 3. Apply

1. **Project.** New → `supabase projects create <name> --org-id <org> --region <region> --db-password "$(openssl rand -hex 24)"`. Keep no copy of the password; a dashboard reset recovers database access.
2. **Production block and function secrets.** Write them into `config.toml` per **Auth config** and **Edge Function secrets**.
3. **Public values.** The URL is `https://<ref>.supabase.co`. Read the publishable key with a filter that prints no other key: `supabase projects api-keys --project-ref <ref> -o json | jq -r '[.[] | select(.type == "publishable" or .name == "anon")][0].api_key'`.

### 4. Secrets

Run [configuring-secrets.md](./configuring-secrets.md).

### 5. Confirm to the user

- Applied changes, per the plan table; the files to commit and merge through a PR
- The secrets still to set, from step 4
- Public values for the apps that read this project: the URL and publishable key
- Items left for the user, such as a kept `site_url`

## Related

- [configuring-github-actions.md](./configuring-github-actions.md)
- [configuring-secrets.md](./configuring-secrets.md)
- [troubleshooting-deployment.md](./troubleshooting-deployment.md)

## References

- [Managing secrets](https://supabase.com/docs/guides/functions/secrets)
- [Redirect URLs](https://supabase.com/docs/guides/auth/redirect-urls)
- [Remote config overrides](https://supabase.com/docs/guides/deployment/branching/configuration)
