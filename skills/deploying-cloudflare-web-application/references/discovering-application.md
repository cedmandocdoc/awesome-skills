# Discovering Application

## Overview

Run this before writing `wrangler.toml` or recommending dashboard settings.

## Guidelines

### 1. Find deployable applications

#### Single-package repo

One `package.json` at the root with a `build` (or equivalent) script → that package is the deploy target.

#### Monorepo

Check workspace manifests:

| File | What to read |
| --- | --- |
| `pnpm-workspace.yaml` | Package globs (`apps/*`, `packages/*`) |
| `package.json` `workspaces` | npm/yarn workspace paths |
| `turbo.json` / `nx.json` | Named apps and their build tasks |

For each candidate package, open its `package.json` and note:

- `scripts.build`, `scripts.export`, or framework-specific scripts
- `dependencies` / `devDependencies` that imply a framework (vite, next, expo, astro, etc.)

**If more than one package has a web build script**, list them and ask the user which app to deploy. Do not pick arbitrarily.

#### Existing Cloudflare config

Search for `wrangler.toml`, `wrangler.jsonc`, or `[assets]` / `pages_build_output_dir`. An existing config may already name the target app and output directory — verify it still matches the chosen package.

### 2. Determine build command

#### Preferred order

1. **User-stated command** — use as-is
2. **`package.json` scripts** — `build` is the default; also check `export`, `generate`, `build:web`
3. **Framework docs** — only when scripts are missing or wrappers are required (e.g. monorepo: install at root, build in package)

#### Monorepo build patterns

Build command often needs dependency install at the repo root:

```bash
# pnpm example — adjust for npm/yarn
pnpm install --frozen-lockfile && cd <package-path> && <package-build-script>
```

```bash
# pnpm filter example
pnpm install --frozen-lockfile && pnpm --filter <package-name> build
```

Set the dashboard **root directory** to where `wrangler.toml` lives:

- **Repo root** — when `wrangler.toml` is at root and build command `cd`s into a package
- **Package directory** — when `wrangler.toml` lives next to that package's `package.json`

**If no build script exists**, ask the user for the command. Do not invent one.

### 3. Determine build output path

#### Preferred order

1. **User-stated path**
2. **Framework config**

| Framework | Config file | Key |
| --- | --- | --- |
| Vite | `vite.config.ts` | `build.outDir` (default `dist`) |
| Next.js | `next.config.js` | `distDir`; static export uses `out/` |
| Astro | `astro.config.mjs` | `outDir` (default `dist`) |
| Angular | `angular.json` | `projects.*.architect.build.options.outputPath` |
| Expo | `app.json` / docs | web export → `dist/` |
| SvelteKit (adapter-static) | `svelte.config.js` | adapter output |

3. **Run build locally** and list the directory that contains `index.html` (or the app entry asset)

#### Path in `wrangler.toml`

`assets.directory` is relative to the **Wrangler project root** (the dashboard root directory), not necessarily the git repo root.

Examples:

| Layout | `assets.directory` |
| --- | --- |
| `wrangler.toml` at repo root, build outputs to `apps/web/dist` | `./apps/web/dist` |
| `wrangler.toml` in `apps/web/`, build outputs to `dist/` there | `./dist` |

**If output path is unclear**, ask the user.

### 4. SPA vs static multi-page

| Signal | Likely SPA |
| --- | --- |
| React / Vue / Svelte / Angular client router | Yes → `not_found_handling = "single-page-application"` |
| Single `index.html` entry, all routes client-side | Yes |
| Astro / Hugo / Jekyll with per-page HTML files | No |
| Next.js static export with file-per-route | Usually no (unless app is client-only SPA mode) |

When unsure for a client-rendered app, prefer SPA handling — missing it causes 404 on refresh.

### 5. Build-time environment variables

Scan the app for public env prefixes baked in at build time:

- `VITE_*` (Vite)
- `NEXT_PUBLIC_*` (Next.js)
- `EXPO_PUBLIC_*` (Expo)
- `PUBLIC_*` (SvelteKit, Astro)

List required variables for the user to add under **Workers & Pages → Settings → Builds → Build variables**. These are not runtime Worker secrets unless the app also has a Worker script that reads `env.*`.

### 6. Discovery checklist

Copy and fill before generating files:

```
- [ ] Deploy target: <package name or path>
- [ ] Cloudflare Worker name: <must match wrangler name>
- [ ] Dashboard root directory: <repo root or package path>
- [ ] Build command: <command>
- [ ] Build output directory: <path relative to wrangler root>
- [ ] SPA client routing: yes / no
- [ ] Build-time env vars: <list or none>
- [ ] Monorepo install step required: yes / no
```

#### Common build output paths (hints only)

Use discovery to confirm — do not assume.

| Tooling | Typical output | Typical build command |
| --- | --- | --- |
| Vite | `dist/` | `npm run build` |
| Create React App | `build/` | `npm run build` |
| Next.js (static export) | `out/` | `npm run build` |
| Astro (static) | `dist/` | `npm run build` |
| Expo web | `dist/` | `npx expo export -p web` |
