# Configuring Secrets

## Overview

**Execution mode.** Matches the secrets the deploy needs against the GitHub repository secrets, keeps the deploy workflow's secret lists in step with `config.toml`, and tells the user which secrets to set and where each value comes from.

## Prerequisites

Production block and function secrets per [configuring-remote-project.md](./configuring-remote-project.md); workflow per [configuring-github-actions.md](./configuring-github-actions.md) → **Workflow file**.

## Guidelines

### 1. Discover

| Item | Source |
| --- | --- |
| Needed names | `SUPABASE_ACCESS_TOKEN` plus every `env(NAME)` in `config.toml` |
| Set names | `gh secret list` |

### 2. Update the workflow

A needed name missing from the workflow's Check secrets loop or the Deploy step's `env` → add it per [configuring-github-actions.md](./configuring-github-actions.md) → **Workflow file**.

### 3. Tell the user what to set

One row per needed name not in `gh secret list`:

| Name | Value comes from | Set it |
| --- | --- | --- |
| `SUPABASE_ACCESS_TOKEN` | [configuring-github-actions.md](./configuring-github-actions.md) → **CI access token** | GitHub → Settings → Secrets and variables → Actions → **New repository secret**, or `gh secret set <NAME>` in the user's own terminal |
| `SMTP_PASS`, an OAuth client secret | The mail or OAuth provider's dashboard | Same |
| A provider's key (`STRIPE_SECRET_KEY`) | The provider's dashboard: a production key with the narrowest access the app needs | Same |
| A value the app defines (`AUTH_SECRET`, an encryption key) | The user's password manager: 32+ random characters, kept there as the only readable copy | Same |

### 4. Confirm to the user

- Workflow changes to commit
- The table from step 3, or "every secret is set"
- A merge before the secrets are set fails at Check secrets with the missing names; after setting them, re-run that run (`gh run rerun <run-id>`)

## Related

- [configuring-github-actions.md](./configuring-github-actions.md)
- [troubleshooting-deployment.md](./troubleshooting-deployment.md)

## References

- [Using secrets in GitHub Actions](https://docs.github.com/en/actions/security-for-github-actions/security-guides/using-secrets-in-github-actions)
