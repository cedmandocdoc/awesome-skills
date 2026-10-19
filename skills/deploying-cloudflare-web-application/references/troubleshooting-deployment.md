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
| Missing env at build | Value missing from the production env file, or the file is gitignored | Add the value; `git check-ignore <file>` prints nothing |
| Lockfile changes break build | Install not using frozen lockfile | Use `pnpm install --frozen-lockfile` or `npm ci` |

### Deploy fails

| Symptom | Likely cause | Action |
| --- | --- | --- |
| Check secrets fails | A listed secret is unset in GitHub | Set each per [configuring-secrets.md](./configuring-secrets.md); `gh run rerun <run-id>` |
| Authentication error or 403 | `CLOUDFLARE_API_TOKEN` expired, or lacking a permission (D1, KV, R2, the zone for a custom domain) | `gh secret list`; add the permission the error names, or replace the token, per [configuring-github-actions.md](./configuring-github-actions.md) → **CI API token** |
| "Skipping automatic provisioning" | The token cannot read KV or R2 | Add the permission per [configuring-github-actions.md](./configuring-github-actions.md) → **CI API token** |
| Assets directory empty | Build output path wrong | Fix `assets.directory`; confirm local build output |
| Deploy lists missing required secrets | A `secrets.required` name is missing from the wrangler-action `secrets:` input | Run [configuring-secrets.md](./configuring-secrets.md) |
| Wrangler not found | No wrangler in project | Add `wrangler` to `devDependencies` |
| `wrangler.toml` not found | Wrong `workingDirectory` | Point it to the folder containing the config |
| Custom domain deploy fails | Conflicting `A`, `AAAA`, or `CNAME` on the host, or zone in another account | Delete the record; use the zone's account as `account_id` |

### Runtime issues

| Symptom | Likely cause | Action |
| --- | --- | --- |
| 404 on route refresh | SPA mode missing | Set `not_found_handling = "single-page-application"` |
| Blank page / wrong API URL | Build-time variable missing or wrong | Fix the production env file; merge |
| Old content after deploy | Browser or CDN cache | Hard refresh; check deployment is active |
| Assets 404 | Output path or base URL mismatch | Check framework `base` / `assetPrefix` config |

### Local Wrangler fails

| Symptom | Likely cause | Action |
| --- | --- | --- |
| Wrangler fails or targets the wrong account after `wrangler login` worked | `CLOUDFLARE_API_TOKEN` exported in the shell replaces the login | Unset it |

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
