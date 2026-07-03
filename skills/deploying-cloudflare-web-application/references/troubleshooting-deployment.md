# Troubleshooting deployment — Cloudflare web

## Build fails

| Symptom | Likely cause | Action |
| --- | --- | --- |
| Build command not found | Wrong root directory or missing install step | Set root directory; prefix with `npm ci` / `pnpm install` |
| Module not found during build | Monorepo deps not installed at root | Install from repo root before package build |
| Node version error | Incompatible Node in build image | Add `engines` in `package.json` or `.nvmrc` |
| Build timeout (20 min) | Heavy build or OOM | Optimize build; split steps |
| Missing env at build | Build variables not set in dashboard | Add `VITE_*` / `NEXT_PUBLIC_*` under Build variables |

## Deploy fails

| Symptom | Likely cause | Action |
| --- | --- | --- |
| Worker name mismatch | `name` in `wrangler.toml` ≠ dashboard Worker | Align names exactly |
| Assets directory empty | Build output path wrong | Fix `assets.directory`; confirm local build output |
| Wrangler not found | No wrangler in project | Add `wrangler` to `devDependencies` |
| `wrangler.toml` not found | Wrong root directory | Point root directory to folder containing config |

## Runtime issues

| Symptom | Likely cause | Action |
| --- | --- | --- |
| 404 on route refresh | SPA mode missing | Set `not_found_handling = "single-page-application"` |
| Blank page / wrong API URL | Build-time env missing or wrong | Fix Build variables; redeploy |
| Old content after deploy | Browser or CDN cache | Hard refresh; check deployment is active |
| Assets 404 | Output path or base URL mismatch | Check framework `base` / `assetPrefix` config |

## Monorepo-specific

| Symptom | Likely cause | Action |
| --- | --- | --- |
| Deploy on unrelated commits | No watch paths | Configure build watch paths |
| Lockfile changes break build | Install not using frozen lockfile | Use `pnpm install --frozen-lockfile` or `npm ci` |

## Debugging deploys

- Cloudflare dashboard → Worker → Deployments → view build log
- Retry build after fixing config (retry uses settings at retry time)
- Local smoke: run build command, then `npx wrangler deploy` (requires `wrangler login`)
