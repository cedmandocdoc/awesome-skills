---
name: deploying-supabase-application
id: 489208cd-16f5-4e4f-92c3-35813f082ce3
description: Prepare a Supabase app for production deploy and connect it to a remote project via Supabase GitHub integration — discover the working directory, validate migrations and functions locally, and document dashboard settings (production branch, deploy to production). Use when deploying Supabase, connecting a repository to Supabase GitHub integration, setting up backend auto-deploy on merge, or validating migrations and Edge Functions before production release.
version: 1.1.0
---

# Deploying a Supabase application

## Setup

| Item | Kind | Required | When | Done when | How |
| --- | --- | --- | --- | --- | --- |
| Supabase CLI | user | required | Deploy | `supabase --version` succeeds | https://supabase.com/docs/guides/local-development/cli/getting-started |
| Docker | user | required | Deploy | `docker info` succeeds | https://docs.docker.com/get-docker/, then start Docker |
| Deno | user | optional | Deploy, when the app has Edge Functions | `deno --version` succeeds | https://docs.deno.com/runtime/getting_started/installation/ |
| Git repository on GitHub | user | required | Deploy | `git remote get-url origin` points to GitHub | Create the GitHub repository and push the project |
| Remote Supabase project | user | required | Deploy | The user confirms the project to deploy to | Create one at https://supabase.com/dashboard/new |

## Workflow

1. **Setup** — for each **Setup** row whose When covers the request, in order: Done when holds → skip; `user` → stop and print its How when required, continue without it when optional; `ask` → fill what the request answers, ask the rest together in one message, record each answer; `auto` and `static` → run.
2. **Recipe** — match one **Recipes** row; open every doc in its Read column.

- Edits repository files only; the user changes Supabase dashboard and GitHub settings.
- Runs no `supabase link`, `supabase db push`, or `supabase functions deploy`; merges to the production branch deploy.

## Recipes

| Intent | Example phrasing | Read |
| --- | --- | --- |
| Set up | "Set up Supabase deployment", "Is deploying-supabase-application ready?" | **Setup** — run Workflow step 1 for every row, then report each row's state |
| Deploy | "Deploy Supabase to production", "Connect the repo to Supabase GitHub integration", "Validate migrations before release" | [deploying-application.md](references/deploying-application.md) |
| Troubleshoot | "The Supabase deploy failed on merge", "Functions did not update" | [troubleshooting-deployment.md](references/troubleshooting-deployment.md) |
