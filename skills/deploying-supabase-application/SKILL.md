---
name: deploying-supabase-application
id: 489208cd-16f5-4e4f-92c3-35813f082ce3
description: Deploy a Supabase app to production through GitHub Actions — validate migrations and Edge Functions locally, write the deploy workflow, create or link the production project, and set GitHub secrets and variables, Edge Function secrets, and Auth settings from config.toml with the Supabase CLI. Use when deploying Supabase, setting up Supabase deploys in GitHub Actions, provisioning a hosted Supabase project, setting Supabase secrets or Auth redirect URLs, deploying functions or migrations from the CLI, or validating migrations and Edge Functions before release.
version: 4.0.0
---

# Deploying a Supabase application

## Setup

| Item | Kind | Required | When | Done when | How |
| --- | --- | --- | --- | --- | --- |
| Supabase CLI 2.120+ | user | required | All | `supabase --version` prints 2.120.0 or later | https://supabase.com/docs/guides/local-development/cli/getting-started |
| Docker | user | required | Deploy | `docker info` succeeds | https://docs.docker.com/get-docker/, then start Docker |
| Deno | user | optional | Deploy, when the app has Edge Functions | `deno --version` succeeds | https://docs.deno.com/runtime/getting_started/installation/ |
| GitHub CLI | user | required | Deploy, Provision | `gh auth status` succeeds and `gh repo view` finds the repository | https://cli.github.com, then `gh auth login`; create the GitHub repository and push the project |
| Secrets files ignored | auto | required | Provision, Direct deploy | `git check-ignore -q <supabase-root>/deploy.secrets.env <supabase-root>/functions.secrets.env` succeeds and `git ls-files '*.secrets.*'` prints nothing | Add `*.secrets.*` to root `.gitignore`. A tracked file → `git rm --cached <file>`, then tell the user its values are in git history and must be rotated |
| Supabase login | user | required | Provision, Direct deploy, Troubleshoot | `supabase projects list` succeeds | `supabase login` |
| Production project | ask | required | Provision, Direct deploy | `<supabase-root>/.temp/project-ref` exists | The product TRD's **Infrastructure** row names the project → use it; else ask: an existing project from `supabase projects list`, or a new one. Existing → recorded by `supabase link --project-ref <ref> --workdir <working-directory>`; new → **Provision** creates and links it |
| CI access token | user | required | Provision | `gh secret list` shows `SUPABASE_ACCESS_TOKEN` | Per [configuring-github-actions.md](references/configuring-github-actions.md) → **CI access token** |

## Workflow

1. **Setup** — for each **Setup** row whose When covers the request, in order: Done when holds → skip; `user` → stop and print its How when required, continue without it when optional; `ask` → fill what the request answers, ask the rest together in one message, record each answer; `auto` and `static` → run.
2. **Recipe** — match one **Recipes** row; open every doc in its Read column.

- Changes the Supabase project and the GitHub repository settings only after the user confirms that run's plan.
- Runs remote commands with the `supabase login` session, never with an exported `SUPABASE_ACCESS_TOKEN`; loads a `*.secrets.env` file only in a subshell, `( set -a; . <file>; set +a; <command> )`. Never prints a secret value.
- Releases deploy through the GitHub Actions workflow on push to the production branch; `supabase db push` and `supabase functions deploy` run locally only on a **Direct deploy** request.

## Recipes

| Intent | Example phrasing | Read |
| --- | --- | --- |
| Set up | "Set up Supabase deployment", "Is deploying-supabase-application ready?" | **Setup** — run Workflow step 1 for every row, then report each row's state |
| Deploy | "Deploy Supabase to production", "Add the Supabase deploy workflow", "Validate migrations before release" | [deploying-application.md](references/deploying-application.md) |
| Provision | "Create the production Supabase project", "Set the Edge Function secrets", "Set the Auth redirect URLs", "Push the Auth config" | [configuring-remote-project.md](references/configuring-remote-project.md) |
| Direct deploy | "Deploy the functions now", "Push the migrations without merging" | [executing-direct-deploy.md](references/executing-direct-deploy.md) |
| Troubleshoot | "The Supabase deploy workflow failed", "Functions did not update", "Reset emails link to localhost" | [troubleshooting-deployment.md](references/troubleshooting-deployment.md) |
