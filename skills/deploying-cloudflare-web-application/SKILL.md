---
name: deploying-cloudflare-web-application
id: 72a302f7-9799-45be-a982-a1ab7ebe6222
description: Deploy static web applications to Cloudflare via Workers Builds and GitHub dashboard integration — discover the target app, build command, and output path; configure wrangler.toml for static assets and SPA routing; document dashboard build settings. Use when deploying a web app to Cloudflare, connecting a repository to Workers & Pages, setting up wrangler.toml for static hosting, or preparing a monorepo package for Cloudflare Git integration.
version: 1.1.0
---

# Deploying a web application to Cloudflare

## Setup

| Item | Kind | Required | When | Done when | How |
| --- | --- | --- | --- | --- | --- |
| Node.js with the project's package manager | user | required | Deploy | `node --version` and the lockfile's package manager (`npm`, `pnpm`, `yarn`) run | https://nodejs.org |
| Git repository on GitHub or GitLab | user | required | Deploy | `git remote get-url origin` points to GitHub or GitLab | Create the remote repository and push the project |
| Cloudflare account | user | required | Deploy, Troubleshoot | `npx wrangler whoami` shows an account | Sign up at https://dash.cloudflare.com/sign-up, then `npx wrangler login` |

## Workflow

1. **Setup** — for each **Setup** row whose When covers the request, in order: Done when holds → skip; `user` → stop and print its How when required, continue without it when optional; `ask` → fill what the request answers, ask the rest together in one message, record each answer; `auto` and `static` → run.
2. **Recipe** — match one **Recipes** row; open every doc in its Read column.

- Edits repository files only; the user changes Cloudflare dashboard settings.
- Adds no deploy pipeline to the repository; Workers Builds deploys on push.

## Recipes

| Intent | Example phrasing | Read |
| --- | --- | --- |
| Set up | "Set up Cloudflare deployment", "Is deploying-cloudflare-web-application ready?" | **Setup** — run Workflow step 1 for every row, then report each row's state |
| Deploy | "Deploy the web app to Cloudflare", "Set up wrangler.toml for static hosting", "Deploy apps/web from the monorepo" | [deploying-application.md](references/deploying-application.md) |
| Troubleshoot | "The Cloudflare build fails", "404 on refresh after deploy" | [troubleshooting-deployment.md](references/troubleshooting-deployment.md) |
