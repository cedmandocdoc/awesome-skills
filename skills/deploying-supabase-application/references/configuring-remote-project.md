# Configuring Remote Project

## Overview

**Execution mode.** Brings the production project to the state the repository and the product TRD declare: the project itself, the GitHub values the deploy workflow reads, Edge Function secrets, and Auth settings. Each run reads remote state, shows one plan, and applies after the user confirms. Migrations, declared functions, and declared buckets deploy through the workflow ([configuring-github-actions.md](./configuring-github-actions.md)).

## Prerequisites

Discovery per [discovering-supabase-root.md](./discovering-supabase-root.md). Run CLI commands with `--workdir <working-directory>`.

## Guidelines

### 1. Discover

| Item | Source |
| --- | --- |
| Project | **Setup** → Production project; new → name, organization (TRD or `supabase orgs list`), and region from the user |
| GitHub values | [configuring-github-actions.md](./configuring-github-actions.md) → **GitHub values** |
| Function secret names | `Deno.env.get("…")` under `functions/`, minus `SUPABASE_*` (hosted functions receive those) |
| Names to unset | Names the project marks local-only (a local mail catcher URL, a fake-provider flag); ask when a name's scope is unclear |
| Auth settings | `config.toml` `[auth]` with production values: the TRD's Auth origins, the production mail provider; local values (Mailpit SMTP, `127.0.0.1` URLs) never ship |

### 2. Fill the secrets files

Write missing names with blank values, tell the user where each value comes from, and continue once `grep -c '=$' <file>` returns `0` for each file.

| File | Names |
| --- | --- |
| `<supabase-root>/deploy.secrets.env` | `SUPABASE_DB_PASSWORD`. New project → generate it without printing: `printf 'SUPABASE_DB_PASSWORD=%s\n' "$(openssl rand -hex 24)" >> <file>`. Existing → the user's password (Project Settings → Database → Reset database password when unknown) |
| `<supabase-root>/functions.secrets.env` | Function secret names |
| `<supabase-root>/auth.secrets.env` | `SMTP_PASS`, when SMTP is set |

### 3. Read remote state

| Item | Check |
| --- | --- |
| Project | `supabase projects list` |
| GitHub values | `gh variable list`, `gh secret list` (names only) |
| Function secrets | `supabase secrets list` (names and digests); compare a local value without printing it: `printf %s "$VALUE" \| shasum -a 256` |
| Auth | `curl -sf -H "Authorization: Bearer $SUPABASE_ACCESS_TOKEN" https://api.supabase.com/v1/projects/<ref>/config/auth \| jq '{site_url, uri_allow_list, disable_signup, mailer_autoconfirm, password_min_length, smtp_host, smtp_admin_email}'` |

### 4. Plan and confirm

Show one table: item, remote now, after. Function secrets show as new / changed / unchanged / unset. Auth merges into the current settings:

- `uri_allow_list` keeps every current URL and adds the missing `https://<host>/**` and `<scheme>://**` entries.
- A non-local `site_url` that differs from the plan belongs to another app on a shared project → keep it unless the user says otherwise.

Apply after the user confirms.

### 5. Apply

In this order; skip what already matches.

1. **Project.** New → `supabase projects create <name> --org-id <org> --region <region> --db-password "$SUPABASE_DB_PASSWORD"`, then `supabase link --project-ref <ref> --workdir <working-directory>`.
2. **GitHub values.** `gh variable set` each variable per [configuring-github-actions.md](./configuring-github-actions.md) → **GitHub values**; `gh secret set -f <supabase-root>/deploy.secrets.env`.
3. **Function secrets.**

   ```bash
   supabase secrets set --env-file <supabase-root>/functions.secrets.env --workdir <working-directory>
   supabase secrets unset <NAME> --workdir <working-directory>   # each name to unset
   ```

4. **Auth.** Build the payload with `jq` from the planned values, `--arg smtp_pass "$SMTP_PASS"` with `auth.secrets.env` also loaded, and `PATCH` only the changed fields:

   ```bash
   jq -n --arg smtp_pass "$SMTP_PASS" '{site_url: "…", uri_allow_list: "…", smtp_pass: $smtp_pass}' \
     | curl -sf -X PATCH https://api.supabase.com/v1/projects/<ref>/config/auth \
         -H "Authorization: Bearer $SUPABASE_ACCESS_TOKEN" -H "Content-Type: application/json" --data @- > /dev/null
   ```

   | `config.toml` | API field |
   | --- | --- |
   | `auth.site_url` | `site_url`, no trailing slash |
   | `auth.additional_redirect_urls` | `uri_allow_list`, comma-separated |
   | `auth.enable_signup` | `disable_signup`, inverted |
   | `auth.email.enable_confirmations` | `mailer_autoconfirm`, inverted |
   | `auth.email.secure_password_change` | `security_update_password_require_reauthentication` |
   | `auth.minimum_password_length` | `password_min_length` |
   | `auth.email.smtp.*` | `smtp_host`, `smtp_port` (string), `smtp_user`, `smtp_pass`, `smtp_admin_email`, `smtp_sender_name` |


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
- [Management API: auth config](https://supabase.com/docs/reference/api/v1-update-auth-service-config)
