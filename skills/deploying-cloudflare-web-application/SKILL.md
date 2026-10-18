---
name: deploying-cloudflare-web-application
id: 72a302f7-9799-45be-a982-a1ab7ebe6222
description: Deploy web applications to Cloudflare Workers through GitHub Actions — discover the target app, build command, and output path; configure wrangler.toml or wrangler.jsonc for static assets, SPA routing, bindings, and custom domains; write the deploy workflow; provision with Wrangler and the GitHub CLI (D1/KV/R2 resources, runtime secrets, GitHub secrets and variables, first deploy, rollback). Use when deploying a web app to Cloudflare, setting up Cloudflare deploys in GitHub Actions, setting Worker secrets, attaching a custom domain, creating Cloudflare resources for an app, or preparing a monorepo package for Cloudflare.
version: 4.0.0
---

# Deploying a web application to Cloudflare

## Setup

| Item | Kind | Required | When | Done when | How |
| --- | --- | --- | --- | --- | --- |
| Node.js 22+ with the project's package manager | user | required | All | `node --version` prints v22 or later and the lockfile's package manager (`npm`, `pnpm`, `yarn`) runs | https://nodejs.org |
| GitHub CLI | user | required | Deploy, Provision | `gh auth status` succeeds and `gh repo view` finds the repository | https://cli.github.com, then `gh auth login`; create the GitHub repository and push the project |
| Cloudflare account | user | required | All | `npx wrangler whoami` shows an account | Sign up at https://dash.cloudflare.com/sign-up, then `npx wrangler login` |
| Account ID | ask | required | Provision, Direct deploy | `account_id` is set in the wrangler config | The product TRD's **Environments and deployment** names the account → use it; else `npx wrangler whoami` lists one account → use it; several → ask which; recorded as `account_id` in the wrangler config |
| Secrets files ignored | auto | required | Provision | `git check-ignore -q <wrangler-root>/worker.secrets.env` succeeds and `git ls-files '*.secrets.*'` prints nothing | Add `*.secrets.*` to root `.gitignore`. A tracked file → `git rm --cached <file>`, then tell the user its values are in git history and must be rotated |
| CI API token | user | required | Provision | `gh secret list` shows `CLOUDFLARE_API_TOKEN` | Per [configuring-github-actions.md](references/configuring-github-actions.md) → **CI API token** |

## Workflow

1. **Setup** — for each **Setup** row whose When covers the request, in order: Done when holds → skip; `user` → stop and print its How when required, continue without it when optional; `ask` → fill what the request answers, ask the rest together in one message, record each answer; `auto` and `static` → run.
2. **Recipe** — match one **Recipes** row; open every doc in its Read column.

- Changes Cloudflare and the GitHub repository settings only after the user confirms that run's plan.
- Runs Wrangler with the `wrangler login` session, never with an exported `CLOUDFLARE_API_TOKEN`; loads a `*.secrets.env` file only in a subshell, `( set -a; . <file>; set +a; <command> )`. Never prints a secret value.
- Releases deploy through the GitHub Actions workflow on push; `wrangler deploy` runs locally only to create a missing Worker or on a **Direct deploy** request.

## Recipes

| Intent | Example phrasing | Read |
| --- | --- | --- |
| Set up | "Set up Cloudflare deployment", "Is deploying-cloudflare-web-application ready?" | **Setup** — run Workflow step 1 for every row, then report each row's state |
| Deploy | "Deploy the web app to Cloudflare", "Add the Cloudflare deploy workflow", "Deploy apps/web from the monorepo" | [deploying-application.md](references/deploying-application.md) |
| Provision | "Create the Worker", "Set the Worker secrets", "Create the D1 database", "Attach the custom domain" | [configuring-resources.md](references/configuring-resources.md) |
| Direct deploy | "Deploy now without pushing", "Roll back the Worker", "Deploy the second account's copy" | [executing-direct-deploy.md](references/executing-direct-deploy.md) |
| Troubleshoot | "The Cloudflare deploy workflow fails", "404 on refresh after deploy" | [troubleshooting-deployment.md](references/troubleshooting-deployment.md) |
