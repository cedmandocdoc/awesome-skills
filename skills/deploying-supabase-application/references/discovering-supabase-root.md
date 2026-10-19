# Discovering Supabase Root

## Overview

**Read-only.** Locate the Supabase project root, read the production intent from the product TRD, and validate `config.toml`, migrations, and Edge Functions before deploy.

## Guidelines

### Required layout

```
<supabase-root>/
├── config.toml
├── migrations/
│   └── *.sql
└── functions/          # if Edge Functions are used
    └── <function-name>/
```

Optional: `seed.sql`, `package.json` with Supabase CLI scripts, `functions/deno.json`.

### Discovery questions

| Question | How to resolve | If unclear |
| --- | --- | --- |
| Supabase root | Directory containing `config.toml` and `migrations/` | List candidates; ask user |
| Working directory | Repo-relative path the CLI runs from (`--workdir`, the workflow's `working-directory`) | See layout table below |
| Production branch | User's deploy branch (`main`, `master`, `production`, etc.) | Ask user; default `main` only when repo convention is obvious |
| Production intent | Product TRD (`trd.md` with `doc_type: trd`) → **Infrastructure** row for Supabase: an existing project ref and the apps sharing it; **Environments and deployment**: the organization | Ask user |
| Auth origins | Product TRD → **Infrastructure** origins of the web hosts and app schemes that sign in through this project | Ask user |
| Edge Functions | `[functions.*]` entries in `config.toml` | List declared functions |
| Storage buckets | `[storage.buckets.*]` entries in `config.toml` | List declared buckets |

### Discover the Supabase root

Search for `config.toml` files with Supabase sections (`[api]`, `[db]`, `[functions.*]`, etc.).

| Layout | Working directory |
| --- | --- |
| `supabase/config.toml` at repo root | `.` |
| `apps/backend/config.toml` (monorepo) | `apps/backend` |
| Nested `apps/foo/supabase/config.toml` | `apps/foo` (parent of the `supabase/` folder) |

When the standard layout nests a `supabase/` subfolder (e.g. `apps/web/supabase/`), the working directory is the parent (`apps/web`). When `config.toml` lives directly in a package directory, use that directory.

If multiple `config.toml` candidates exist, ask the user which app deploys to the target remote project.

### config.toml checks

1. **`[db.migrations]`** — migrations enabled (default)
2. **`[db]` `major_version`** — matches the remote Postgres major version
3. **`[functions.<name>]`** — every function in `functions/` that should deploy is declared
4. **`[storage.buckets.<name>]`** — buckets that should deploy are declared (if used)

### Local validation

Edge Functions, when present:

```bash
deno check --config functions/deno.json functions/*/index.ts
deno test --config functions/deno.json functions/
```

Adapt to project scripts (e.g. `functions:check`, `functions:test`).

### Pre-push checklist

```
- [ ] Supabase root and working directory identified
- [ ] New/changed functions declared in config.toml
- [ ] Function checks/tests pass (if applicable)
- [ ] Production project, Auth origins, and secret names known
```

### What deploys where

| Deployed by the workflow on push ([configuring-github-actions.md](./configuring-github-actions.md)) | **Provision** ([configuring-remote-project.md](./configuring-remote-project.md)) |
| --- | --- |
| New files in `migrations/` | A new production project |
| `[remotes.production]` Auth and project settings (`config push`) | The `[remotes.production]` block, seeded from the live project |
| `[edge_runtime.secrets]`, from GitHub secrets | The public values apps read, reported to the user |
| Edge Functions and storage buckets declared in `config.toml` | |

Undeclared functions and buckets deploy nowhere.

## Related

- [configuring-github-actions.md](./configuring-github-actions.md)
- [troubleshooting-deployment.md](./troubleshooting-deployment.md)
