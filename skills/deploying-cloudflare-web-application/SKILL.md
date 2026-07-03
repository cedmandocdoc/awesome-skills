---
name: deploying-cloudflare-web-application
description: Deploy static web applications to Cloudflare via Workers Builds and GitHub dashboard integration — discover the target app, build command, and output path; configure wrangler.toml for static assets and SPA routing; document dashboard build settings. Use when deploying a web app to Cloudflare, connecting a repository to Workers & Pages, setting up wrangler.toml for static hosting, or preparing a monorepo package for Cloudflare Git integration.
version: 1.0.0
---

# Deploying a web application to Cloudflare

Deploy static web apps using **Cloudflare Workers Builds**: connect GitHub in the dashboard, run a build command on push, then `npx wrangler deploy`. No separate deploy pipeline in the repository is required.

## Agent workflow

Run these steps **in order** before generating or editing deployment files.

### 1. Discovery (required)

Gather facts from the repository and user. **Do not guess** when multiple apps or ambiguous build setups exist — ask the user.

| Question | How to resolve | If unclear |
| --- | --- | --- |
| **Which app deploys?** | Scan `package.json` files, workspace config (`pnpm-workspace.yaml`, `turbo.json`, `nx.json`), and existing `wrangler.toml` | List candidates; ask user to pick one |
| **Build command** | `package.json` `scripts.build` (or framework-specific: `export`, `generate`, etc.) | Ask user |
| **Build output path** | Framework config (`vite.config` `outDir`, `next.config` `distDir`/`output`, `angular.json` `outputPath`), or run a local build once | Ask user |
| **SPA with client-side routing?** | React Router, Vue Router, TanStack Router, Expo web, etc. | Default to SPA mode unless the app is fully static HTML |
| **Build-time env vars** | `VITE_*`, `NEXT_PUBLIC_*`, `EXPO_PUBLIC_*`, `PUBLIC_*`, or docs in the app | List required vars; user sets them in Cloudflare dashboard |
| **Monorepo root directory** | Path where `wrangler.toml` lives and where the build command should run | Repo root vs package subdirectory |

Full discovery heuristics: [discovering-application.md](references/discovering-application.md).

### 2. Validate locally (recommended)

Before committing deployment config, confirm the build produces files in the expected output directory:

```bash
# From the chosen root directory (repo root or package path)
<build-command>
ls <output-directory>
```

### 3. Generate or update repository files

Minimum files to add or update:

1. **`wrangler.toml` or `wrangler.jsonc`** at the project root (see [configuring-wrangler.md](references/configuring-wrangler.md))
2. **`wrangler` in `package.json` devDependencies** (pin version for reproducible Workers Builds)
3. **Node version hint** (optional) — `engines` in `package.json` or `.nvmrc` if the build needs a specific Node version

Static-only SPA (no Worker script):

```toml
name = "<cloudflare-project-name>"
compatibility_date = "<YYYY-MM-DD>"

[assets]
directory = "./<output-directory>"
not_found_handling = "single-page-application"
```

`name` must match the Worker name in the Cloudflare dashboard.

### 4. Document dashboard settings for the user

The agent configures repo files; the user connects Git in **Workers & Pages → Worker → Settings → Builds**. Provide a filled-in table from [configuring-github-integration.md](references/configuring-github-integration.md).

### 5. Post-deploy verification

- App loads on the assigned `*.workers.dev` URL or custom domain
- Deep links and browser refresh work on client-routed paths (if SPA)
- Build-time public env vars are present in the bundle (smoke one feature that depends on them)

Troubleshooting: [troubleshooting-deployment.md](references/troubleshooting-deployment.md).

## Decision tree

```
Deploy web app to Cloudflare?
├─ Static files only (HTML/CSS/JS)?
│  ├─ Client-side routing (SPA)? → not_found_handling = "single-page-application"
│  └─ Static multi-page / file-per-route? → omit not_found_handling or use "404-page"
├─ Static + API in same Worker?
│  └─ Add main Worker script + assets; see configuring-wrangler reference
└─ Monorepo?
   └─ Set dashboard root directory to package path; install deps from repo root if needed
```

## What this skill covers

| Topic | Reference |
| --- | --- |
| Discovering app, build command, output path | [discovering-application.md](references/discovering-application.md) |
| `wrangler.toml` / SPA routing / hybrid apps | [configuring-wrangler.md](references/configuring-wrangler.md) |
| Dashboard Git integration settings | [configuring-github-integration.md](references/configuring-github-integration.md) |
| Common failures | [troubleshooting-deployment.md](references/troubleshooting-deployment.md) |

## Common build output paths (hints only)

Use discovery to confirm — do not assume.

| Tooling | Typical output | Typical build command |
| --- | --- | --- |
| Vite | `dist/` | `npm run build` |
| Create React App | `build/` | `npm run build` |
| Next.js (static export) | `out/` | `npm run build` |
| Astro (static) | `dist/` | `npm run build` |
| Expo web | `dist/` | `npx expo export -p web` |

## Out of scope

- Cloudflare Pages-only Git integration (legacy path without `wrangler deploy`)
- Custom Git provider CI deploy pipelines
- Runtime Worker bindings (KV, D1, R2) unless the app already uses them
- DNS and custom domain setup beyond noting it as a post-deploy step

## Official docs

- [Workers Builds configuration](https://developers.cloudflare.com/workers/ci-cd/builds/configuration/)
- [Git integration](https://developers.cloudflare.com/workers/ci-cd/builds/git-integration/)
- [Static assets](https://developers.cloudflare.com/workers/static-assets/)
