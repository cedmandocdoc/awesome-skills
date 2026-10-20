# Configuring GitHub Actions

## Overview

The deploy workflow and the secrets it reads.

## Prerequisites

Supabase root, working directory, production branch, functions, and buckets from [discovering-supabase-root.md](./discovering-supabase-root.md). Production block per [configuring-remote-project.md](./configuring-remote-project.md) → **Auth config**.

## Guidelines

### Workflow file

`.github/workflows/deploy-supabase.yml`. Pin third-party actions to a commit SHA.

```yaml
name: Deploy Supabase

on:
  push:
    branches: [<production-branch>]
    paths: ["<supabase-root>/**", ".github/workflows/deploy-supabase.yml", "!<supabase-root>/DEPLOYMENT.md"]
  workflow_dispatch:

concurrency: deploy-supabase

permissions:
  contents: read

jobs:
  deploy:
    if: github.ref == 'refs/heads/<production-branch>'
    runs-on: ubuntu-latest
    defaults:
      run:
        working-directory: <working-directory>
    steps:
      - name: Check secrets
        working-directory: .
        env:
          SUPABASE_ACCESS_TOKEN: ${{ secrets.SUPABASE_ACCESS_TOKEN }}
          SMTP_PASS: ${{ secrets.SMTP_PASS }}
          STRIPE_SECRET_KEY: ${{ secrets.STRIPE_SECRET_KEY }}
        run: |
          missing=0
          for name in SUPABASE_ACCESS_TOKEN SMTP_PASS STRIPE_SECRET_KEY; do
            if [ -z "${!name}" ]; then
              echo "::error::Set $name in Settings → Secrets and variables → Actions"
              missing=1
            fi
          done
          exit $missing
      - uses: actions/checkout@v7
      - uses: supabase/setup-cli@v3
        with:
          version: latest
      - name: Check production block
        run: |
          ref=$(sed -n '/^\[remotes\.production\]/,/^\[/s/^project_id *= *"\(.*\)"/\1/p' <config-toml>)
          if [ -z "$ref" ]; then
            echo "::error::Add [remotes.production] with project_id to <config-toml>"
            exit 1
          fi
          echo "SUPABASE_PROJECT_REF=$ref" >> "$GITHUB_ENV"
      - name: Rehearse migrations
        run: |
          supabase db start
          supabase db reset --local
          supabase db lint --local --fail-on error
      - name: Deploy
        env:
          SUPABASE_ACCESS_TOKEN: ${{ secrets.SUPABASE_ACCESS_TOKEN }}
          SMTP_PASS: ${{ secrets.SMTP_PASS }}
          STRIPE_SECRET_KEY: ${{ secrets.STRIPE_SECRET_KEY }}
        run: |
          supabase link --project-ref "$SUPABASE_PROJECT_REF"
          supabase db push
          supabase config diff
          supabase config push --yes
          supabase secrets set
          supabase functions deploy --use-api
          supabase seed buckets --linked
```

| Part | Rule |
| --- | --- |
| `<config-toml>` | Path to `config.toml` from the working directory |
| Secret names | `SUPABASE_ACCESS_TOKEN` plus every `env(NAME)` in `config.toml`, in both the Check secrets loop and the Deploy step's `env` |
| Rehearse migrations | `db start` runs an empty Postgres in Docker on the runner; `db reset --local` replays every migration and `seed.sql` into it; a failure stops the job before `link`. The database is discarded with the runner |
| `db push` | No `SUPABASE_DB_PASSWORD`: the CLI mints a temporary login role with the access token |
| `config push` | Runs after `db push`: config can depend on migrations (`[auth.hook.*]` needs its Postgres function, `[api] schemas` needs the schema) |
| `secrets set` | Sets each `[edge_runtime.secrets]` entry from the step's `env`; drop it when there are none |
| Functions, buckets | Drop the line when `config.toml` declares none |
| GitHub variables | None: the project ref lives in `[remotes.production]` |

### CI access token

The workflow's `SUPABASE_ACCESS_TOKEN`. Local commands use the `supabase login` session.

Permissions: [`../assets/ci-token-permissions.tsv`](../assets/ci-token-permissions.tsv), one row per permission. A row applies when its `when` is `always`, or `api`, `db`, or `storage` and the production block declares that section.

1. The user creates a personal access token at https://supabase.com/dashboard/account/tokens with an expiry they track. It must reach the production project; whether it reaches one project or a whole organization is the user's choice, so one token can serve several repos. Show the applying rows as a Permission | Level table headed by their count.
2. The user sets it as the `SUPABASE_ACCESS_TOKEN` repository secret per [configuring-secrets.md](./configuring-secrets.md).
3. Run **Probe**.

### Probe

From the repository root: `bash <skill-dir>/scripts/probe-ci-token.sh <project-ref> [api] [db] [storage]`, naming each section the production block declares. [`../scripts/probe-ci-token.sh`](../scripts/probe-ci-token.sh) pushes a throwaway branch with one workflow that sends each applying row's request with the secret and prints status codes only, then deletes the run and the branch. A write row's request carries a wrong-typed body or a random missing name, so nothing changes; 401 or 403 means missing, any other 2xx or 4xx granted.

| Exit | Do |
| --- | --- |
| 0 | The token is ready |
| 1 | Show only the missing rows and their count, or that the secret is unset; the user fixes the token and sets the secret again, then probe again |
| 2 | Report the error; the probe did not run |

## Related

- [discovering-supabase-root.md](./discovering-supabase-root.md)
- [configuring-remote-project.md](./configuring-remote-project.md)
- [configuring-secrets.md](./configuring-secrets.md)
- [troubleshooting-deployment.md](./troubleshooting-deployment.md)

## References

- [Deploy with GitHub Actions](https://supabase.com/docs/guides/deployment/managing-environments)
- [Supabase CLI setup action](https://github.com/supabase/setup-cli)
- [Personal access token permissions](https://supabase.com/docs/guides/platform/personal-access-tokens)
