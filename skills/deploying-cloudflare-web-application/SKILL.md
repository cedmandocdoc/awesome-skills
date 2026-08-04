---
name: deploying-cloudflare-web-application
description: Deploy static web applications to Cloudflare via Workers Builds and GitHub dashboard integration — discover the target app, build command, and output path; configure wrangler.toml for static assets and SPA routing; document dashboard build settings. Use when deploying a web app to Cloudflare, connecting a repository to Workers & Pages, setting up wrangler.toml for static hosting, or preparing a monorepo package for Cloudflare Git integration.
version: 1.0.0
---

# Deploying a web application to Cloudflare

## Overview

Deploy static web apps with **Cloudflare Workers Builds**: connect GitHub in the dashboard, run a build command on push, then `npx wrangler deploy`. No separate deploy pipeline in the repository.

## Agent workflow

Run these steps in order before generating or editing deployment files. Works wherever the agent can read and write repository files.

### Steps

1. **Discovery** — Resolve the deploy target, build command, output path, SPA mode, build-time env vars, and monorepo root directory. Ask the user when multiple apps or ambiguous builds exist. Follow [discovering-application.md](references/discovering-application.md).

2. **Validate locally** — Confirm the build produces files in the expected output directory:

   ```bash
   <build-command>
   ls <output-directory>
   ```

3. **Generate or update repository files** — Add or update:

   1. **`wrangler.toml` or `wrangler.jsonc`** at the project root — [configuring-wrangler.md](references/configuring-wrangler.md)
   2. **`wrangler` in `package.json` devDependencies** (pin for reproducible Workers Builds)
   3. **Node version hint** (optional) — `engines` in `package.json` or `.nvmrc`

   Static-only SPA:

   ```toml
   name = "<cloudflare-project-name>"
   compatibility_date = "<YYYY-MM-DD>"

   [assets]
   directory = "./<output-directory>"
   not_found_handling = "single-page-application"
   ```

   `name` must match the Worker name in the Cloudflare dashboard.

4. **Document dashboard settings** — Agent configures repo files; user connects Git in **Workers & Pages → Worker → Settings → Builds**. Provide a filled-in table from [configuring-github-integration.md](references/configuring-github-integration.md).

5. **Post-deploy verification**

   - App loads on the assigned `*.workers.dev` URL or custom domain
   - Deep links and browser refresh work on client-routed paths (if SPA)
   - Build-time public env vars present in the bundle

   Troubleshooting: [troubleshooting-deployment.md](references/troubleshooting-deployment.md).

### Decision tree

```
Deploy web app to Cloudflare?
├─ Static files only (HTML/CSS/JS)?
│  ├─ Client-side routing (SPA)? → not_found_handling = "single-page-application"
│  └─ Static multi-page / file-per-route? → omit not_found_handling or use "404-page"
├─ Static + API in same Worker?
│  └─ Add main Worker script + assets; see configuring-wrangler
└─ Monorepo?
   └─ Set dashboard root directory to package path; install deps from repo root if needed
```

## Reference index

| Doc | When to use |
| --- | --- |
| [discovering-application.md](references/discovering-application.md) | Deploy target, build command, output path, SPA mode, build-time env vars |
| [configuring-wrangler.md](references/configuring-wrangler.md) | `wrangler.toml` / SPA routing / hybrid static + Worker |
| [configuring-github-integration.md](references/configuring-github-integration.md) | Dashboard Git integration settings |
| [troubleshooting-deployment.md](references/troubleshooting-deployment.md) | Build, deploy, and runtime failures |
