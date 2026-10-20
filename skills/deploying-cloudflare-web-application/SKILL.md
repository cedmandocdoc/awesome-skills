---
name: deploying-cloudflare-web-application
id: 72a302f7-9799-45be-a982-a1ab7ebe6222
description: Deploy a web app to Cloudflare Workers through GitHub Actions — write the wrangler config and a deploy workflow that creates D1/KV/R2, applies D1 migrations, syncs Worker secrets from GitHub, and deploys on every merge; guide the secrets and steps the user owns in DEPLOYMENT.md; re-run or roll back. Use when deploying a web app to Cloudflare, setting up Cloudflare deploys in GitHub Actions, adding Worker secrets, attaching a custom domain, adding Cloudflare resources for an app, or preparing a monorepo package for Cloudflare.
version: 5.2.0
---

# Deploying a web application to Cloudflare

## Setup

| Item | Kind | Required | When | Done when | How |
| --- | --- | --- | --- | --- | --- |
| Node.js 22+ with the project's package manager | user | required | All | `node --version` prints v22 or later and the lockfile's package manager (`npm`, `pnpm`, `yarn`) runs | https://nodejs.org |
| GitHub CLI | user | required | Deploy, Secrets, Run or roll back | `gh auth status` succeeds and `gh repo view` finds the repository | https://cli.github.com, then `gh auth login`; create the GitHub repository and push the project |
| Cloudflare account | user | required | All | `npx wrangler whoami` shows an account | Sign up at https://dash.cloudflare.com/sign-up, then `npx wrangler login` |
| Account ID | ask | required | Deploy | `account_id` is set in the wrangler config | `npx wrangler whoami` lists one account → use it; several → ask which; recorded as `account_id` in the wrangler config |
| CI API token | user | required | Secrets | [configuring-github-actions.md](references/configuring-github-actions.md) → **Probe** reports every permission granted | Per [configuring-github-actions.md](references/configuring-github-actions.md) → **CI API token** |

## Workflow

1. **Setup** — for each **Setup** row whose When covers the request, in order: Done when holds → skip; `user` → stop and print its How when required, continue without it when optional; `ask` → fill what the request answers, ask the rest together in one message, record each answer; `auto` and `static` → run.
2. **Contract** — read [deployment-contract.md](references/deployment-contract.md).
3. **Recipe** — match one **Recipes** row; open every doc in its Read column.

- Writes repository files only; Cloudflare changes run in the deploy workflow on push to the production branch. The CI token probe runs on a throwaway branch it deletes.
- Runs Wrangler locally only to read state, with the `wrangler login` session, never with an exported `CLOUDFLARE_API_TOKEN`.
- Sets no secret and reads only secret names; the user sets every secret in GitHub.

## Recipes

| Intent | Example phrasing | Read |
| --- | --- | --- |
| Set up | "Set up Cloudflare deployment", "Is deploying-cloudflare-web-application ready?" | **Setup** — run Workflow step 1 for every row, then report each row's state |
| Deploy | "Deploy the web app to Cloudflare", "Add the Cloudflare deploy workflow", "Add a D1 database", "Attach the custom domain", "Deploy apps/web from the monorepo" | [deploying-application.md](references/deploying-application.md) |
| Secrets | "Which secrets does the deploy need?", "Add a Worker secret", "Is the Cloudflare deploy ready to merge?" | [configuring-secrets.md](references/configuring-secrets.md) |
| Run or roll back | "Deploy now without pushing", "Roll back the Worker", "Which version is live?" | [executing-direct-deploy.md](references/executing-direct-deploy.md) |
| Troubleshoot | "The Cloudflare deploy workflow fails", "404 on refresh after deploy" | [troubleshooting-deployment.md](references/troubleshooting-deployment.md) |
