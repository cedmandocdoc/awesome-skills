---
name: deploying-supabase-application
id: 489208cd-16f5-4e4f-92c3-35813f082ce3
description: Deploy a Supabase app to production through GitHub Actions — check Edge Functions locally, create the production project, keep its Auth and project settings in config.toml, and write the deploy workflow that rehearses migrations on a throwaway database, then applies migrations, config, Edge Function secrets, functions, and buckets on every merge; list the GitHub secrets the user sets. Use when deploying Supabase, setting up Supabase deploys in GitHub Actions, creating a hosted Supabase project, adding Supabase secrets or Auth redirect URLs, re-running a Supabase deploy, or validating migrations and Edge Functions before release.
version: 5.0.0
---

# Deploying a Supabase application

## Setup

| Item | Kind | Required | When | Done when | How |
| --- | --- | --- | --- | --- | --- |
| Supabase CLI 2.120+ | user | required | All | `supabase --version` prints 2.120.0 or later | https://supabase.com/docs/guides/local-development/cli/getting-started |
| Deno | user | optional | Deploy, when the app has Edge Functions | `deno --version` succeeds | https://docs.deno.com/runtime/getting_started/installation/ |
| GitHub CLI | user | required | Deploy, Secrets, Run | `gh auth status` succeeds and `gh repo view` finds the repository | https://cli.github.com, then `gh auth login`; create the GitHub repository and push the project |
| Supabase login | user | required | Deploy, Provision, Run, Troubleshoot | `supabase projects list` succeeds | `supabase login` |
| No secrets files | user | required | Deploy, Secrets | `git ls-files '*.secrets.*'` prints nothing and no `<supabase-root>/*.secrets.env` exists | Move each value into a GitHub secret per [configuring-secrets.md](references/configuring-secrets.md), then delete the file; delete a `SUPABASE_DB_PASSWORD` GitHub secret. A tracked file's values are in git history: rotate them |
| Production project | ask | required | Deploy, Provision | `config.toml` has `[remotes.production]` with a `project_id` | The product TRD's **Infrastructure** row names the project → use it; else ask: an existing project from `supabase projects list`, or a new one. Recorded as `[remotes.production] project_id` per [configuring-remote-project.md](references/configuring-remote-project.md) |
| CI access token | user | required | Secrets | `gh secret list` shows `SUPABASE_ACCESS_TOKEN` | Per [configuring-github-actions.md](references/configuring-github-actions.md) → **CI access token** |

## Workflow

1. **Setup** — for each **Setup** row whose When covers the request, in order: Done when holds → skip; `user` → stop and print its How when required, continue without it when optional; `ask` → fill what the request answers, ask the rest together in one message, record each answer; `auto` and `static` → run.
2. **Recipe** — match one **Recipes** row; open every doc in its Read column.

- Writes files only under the Supabase root and `.github/workflows/deploy-supabase.yml`; project changes run in the deploy workflow on push to the production branch. Locally it only creates the production project, after the user confirms, and reads remote state.
- Never runs `db reset` on a local or hosted database.
- Runs the local CLI with the `supabase login` session, never with an exported `SUPABASE_ACCESS_TOKEN`.
- Sets no secret and reads only secret names; the user sets every secret in GitHub.

## Recipes

| Intent | Example phrasing | Read |
| --- | --- | --- |
| Set up | "Set up Supabase deployment", "Is deploying-supabase-application ready?" | **Setup** — run Workflow step 1 for every row, then report each row's state |
| Deploy | "Deploy Supabase to production", "Add the Supabase deploy workflow", "Validate migrations before release" | [deploying-application.md](references/deploying-application.md) |
| Provision | "Create the production Supabase project", "Set the Auth redirect URLs", "Set up custom SMTP", "Add the production config block" | [configuring-remote-project.md](references/configuring-remote-project.md) |
| Secrets | "Which secrets does the deploy need?", "Add an Edge Function secret", "Is the Supabase deploy ready to merge?" | [configuring-secrets.md](references/configuring-secrets.md) |
| Run | "Deploy the functions now", "Re-run the Supabase deploy" | [executing-direct-deploy.md](references/executing-direct-deploy.md) |
| Troubleshoot | "The Supabase deploy workflow failed", "Functions did not update", "Reset emails link to localhost" | [troubleshooting-deployment.md](references/troubleshooting-deployment.md) |
