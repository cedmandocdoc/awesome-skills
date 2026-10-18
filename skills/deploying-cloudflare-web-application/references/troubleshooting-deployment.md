# Troubleshooting Deployment

## Overview

**Read-only.** Diagnose build, deploy, and runtime failures for a Cloudflare Worker deployed through GitHub Actions.

## Guidelines

### Build fails

| Symptom | Likely cause | Action |
| --- | --- | --- |
| Build command not found | Wrong working directory or missing install step | Fix the workflow's build step; install before building |
| Module not found during build | Monorepo deps not installed at root | Install from repo root before package build |
| Node version error | `.nvmrc` missing or below 22 (Wrangler 4's minimum) | Set the Node major in `.nvmrc` |
| Missing env at build | GitHub variable not set or not mapped | `gh variable list`; map it in the build step's `env` |
| Lockfile changes break build | Install not using frozen lockfile | Use `pnpm install --frozen-lockfile` or `npm ci` |

### Deploy fails

| Symptom | Likely cause | Action |
| --- | --- | --- |
| Authentication error or 403 | `CLOUDFLARE_API_TOKEN` secret missing, expired, or lacking a permission (D1, the zone for a custom domain) | `gh secret list`; add the permission the error names, or replace the token, per [configuring-github-actions.md](./configuring-github-actions.md) → **CI API token** |
| Wrong account | `CLOUDFLARE_ACCOUNT_ID` variable differs from `account_id` | Set the variable to the config's `account_id` |
| Assets directory empty | Build output path wrong | Fix `assets.directory`; confirm local build output |
| Deploy lists missing required secrets | A `secrets.required` name is unset on the Worker | Fill `worker.secrets.env`; run **Provision** |
| Wrangler not found | No wrangler in project | Add `wrangler` to `devDependencies` |
| `wrangler.toml` not found | Wrong `workingDirectory` | Point it to the folder containing the config |

### Runtime issues

| Symptom | Likely cause | Action |
| --- | --- | --- |
| 404 on route refresh | SPA mode missing | Set `not_found_handling = "single-page-application"` |
| Blank page / wrong API URL | Build-time variable missing or wrong | Fix the GitHub variable; re-run the workflow |
| Old content after deploy | Browser or CDN cache | Hard refresh; check deployment is active |
| Assets 404 | Output path or base URL mismatch | Check framework `base` / `assetPrefix` config |

### Provision fails

| Symptom | Likely cause | Action |
| --- | --- | --- |
| Wrangler fails or targets the wrong account after `wrangler login` worked | `CLOUDFLARE_API_TOKEN` exported in the shell replaces the login | Unset it |
| Custom domain deploy fails | Conflicting `A`, `AAAA`, or `CNAME` on the host, or zone in another account | Delete the record; deploy from the zone's account |

### Workflow did not run

| Symptom | Likely cause | Action |
| --- | --- | --- |
| No run on push | Push outside the workflow's `paths` or branch | Check `on.push`; `gh workflow run deploy-<worker>.yml` |
| Run on unrelated commits | `paths` too broad | Narrow the watch paths |

### Debugging deploys

- `gh run list --workflow deploy-<worker>.yml`, then `gh run view <run-id> --log-failed`
- Runtime errors: `npx wrangler tail <worker>`
- Bad release: [executing-direct-deploy.md](./executing-direct-deploy.md)
- Local check: run the build command, then `npx wrangler deploy --dry-run`

## Related

- [configuring-wrangler.md](./configuring-wrangler.md)
- [configuring-github-actions.md](./configuring-github-actions.md)
