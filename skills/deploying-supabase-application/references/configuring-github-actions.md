# Configuring GitHub Actions

## Overview

The deploy workflow and the GitHub secrets and variables it reads. On each push to the production branch that touches the Supabase root, the workflow links the project, applies new migrations, deploys declared Edge Functions, and creates declared buckets.

## Prerequisites

Supabase root, working directory, production branch, functions, and buckets from [discovering-supabase-root.md](./discovering-supabase-root.md).

## Guidelines

### Workflow file

`.github/workflows/deploy-supabase.yml`; drop the steps for functions or buckets the app does not declare.

```yaml
name: Deploy Supabase

on:
  push:
    branches: [<production-branch>]
    paths: ["<supabase-root>/**", ".github/workflows/deploy-supabase.yml"]
  workflow_dispatch:

concurrency: deploy-supabase

jobs:
  deploy:
    runs-on: ubuntu-latest
    env:
      SUPABASE_ACCESS_TOKEN: ${{ secrets.SUPABASE_ACCESS_TOKEN }}
      SUPABASE_DB_PASSWORD: ${{ secrets.SUPABASE_DB_PASSWORD }}
    defaults:
      run:
        working-directory: <working-directory>
    steps:
      - uses: actions/checkout@v7
      - uses: supabase/setup-cli@v3
        with:
          version: latest
      - run: supabase link --project-ref "${{ vars.SUPABASE_PROJECT_REF }}"
      - run: supabase db push
      - run: supabase functions deploy --use-api
      - run: supabase seed buckets --linked
```

### GitHub values

| Rule | Detail |
| --- | --- |
| Needed names | Every `${{ vars.<NAME> }}` and `${{ secrets.<NAME> }}` in `.github/workflows/*.yml`, minus `gh variable list` and `gh secret list` |
| Public value | `gh variable set <NAME> --body "<value>"` |
| Secret value | Its name with a blank value in a `*.secrets.env` file the user fills; `gh secret set -f <file>` |
| Names | A value another platform reads starts with its platform: `SUPABASE_*`, `CLOUDFLARE_*`, `EXPO_*`; an app-only value keeps the name the app reads |
| Owner | The platform's skill sets a name; other skills only read it |

This skill sets:

| Name | Kind | Value |
| --- | --- | --- |
| `SUPABASE_PROJECT_REF` | variable | Production project ref |
| `SUPABASE_URL` | variable | `https://<ref>.supabase.co` |
| `SUPABASE_PUBLISHABLE_KEY` | variable | The publishable key, or the `anon` key when the project has none, piped so other keys never print: `supabase projects api-keys --project-ref <ref> -o json \| jq -r '[.[] \| select(.type == "publishable" or .name == "anon")][0].api_key' \| gh variable set SUPABASE_PUBLISHABLE_KEY` |
| `SUPABASE_ACCESS_TOKEN` | secret | Set by the user per **CI access token** |
| `SUPABASE_DB_PASSWORD` | secret | From `<supabase-root>/deploy.secrets.env` |

### CI access token

The workflow's `SUPABASE_ACCESS_TOKEN`: a personal access token limited to the production project, used only by GitHub Actions. Local commands use the `supabase login` session.

1. The user creates it at https://supabase.com/dashboard/account/tokens with access to the production project only, an expiry they track, and only these permissions:

   | Permission | Level | Used by |
   | --- | --- | --- |
   | Project Settings | Read | `supabase link` |
   | API Keys | Read | `supabase link` |
   | API Key Secrets | Read | `supabase link` |
   | Edge Functions | Read-write | `supabase functions deploy` |
   | Storage | Read-write | `supabase seed buckets` |

   `db push` authenticates with `SUPABASE_DB_PASSWORD`, so the token needs no Database permission.
2. The user runs `gh secret set SUPABASE_ACCESS_TOKEN` and pastes the token at the prompt. It is never written to a file.

### Ongoing releases

1. Push or merge backend changes to the production branch.
2. `gh run list --workflow deploy-supabase.yml` shows the run succeeded.
3. Run smoke tests if schema or function behavior changed.

## Related

- [discovering-supabase-root.md](./discovering-supabase-root.md)
- [configuring-remote-project.md](./configuring-remote-project.md)
- [troubleshooting-deployment.md](./troubleshooting-deployment.md)

## References

- [Deploy with GitHub Actions](https://supabase.com/docs/guides/deployment/managing-environments)
- [Supabase CLI setup action](https://github.com/supabase/setup-cli)
