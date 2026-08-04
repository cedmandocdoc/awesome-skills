# Discovering Supabase Root

## Overview

**Read-only.** Locate the Supabase project root, validate `config.toml` and migrations, and confirm the dashboard working directory before GitHub integration.

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
| Working directory | Repo-relative path to the Supabase root (used in dashboard) | See layout table below |
| Production branch | User's deploy branch (`main`, `master`, `production`, etc.) | Ask user; default `main` only when repo convention is obvious |
| Edge Functions | `[functions.*]` entries in `config.toml` | List declared functions |
| Storage buckets | `[storage.buckets.*]` entries in `config.toml` | List declared buckets |

### Discover the Supabase root

Search for `config.toml` files with Supabase sections (`[api]`, `[db]`, `[functions.*]`, etc.).

| Layout | Working directory (dashboard) |
| --- | --- |
| `supabase/config.toml` at repo root | `.` |
| `apps/backend/config.toml` (monorepo) | `apps/backend` |
| Nested `apps/foo/supabase/config.toml` | `apps/foo` (parent of the `supabase/` folder) |

Working directory is the repo-relative path the integration uses as the Supabase project root — the folder that directly contains `config.toml` and `migrations/`. When the standard layout nests a `supabase/` subfolder (e.g. `apps/web/supabase/`), use the parent (`apps/web`). When `config.toml` lives directly in a package directory, use that directory.

If multiple `config.toml` candidates exist, ask the user which app deploys to the target remote project.

### config.toml checks

1. **`[db.migrations]`** — migrations enabled (default)
2. **`[db]` `major_version`** — matches the remote Postgres major version
3. **`[functions.<name>]`** — every function in `functions/` that should deploy is declared
4. **`[storage.buckets.<name>]`** — buckets that should deploy are declared (if used)

Undeclared functions and buckets are not deployed by GitHub integration.

### Local validation

```bash
supabase db start
supabase db reset --local
supabase db lint
```

Prefer `db reset --local` when seeds must be exercised; use `supabase migration up --local` for faster incremental checks.

#### Edge Functions (if present)

```bash
deno check --config functions/deno.json functions/*/index.ts
deno test --config functions/deno.json functions/
```

Adapt to project scripts (e.g. `functions:check`, `functions:test`).

### Pre-merge checklist

```
- [ ] Supabase root identified; working directory documented
- [ ] Migrations apply locally without error
- [ ] supabase db lint passes
- [ ] New/changed functions declared in config.toml
- [ ] Function checks/tests pass (if applicable)
- [ ] Secrets and auth config noted for manual dashboard setup (if needed)
```

### What stays manual

- Edge Function secrets (`supabase secrets set` or Project Settings → Edge Functions)
- Auth SMTP, Site URL, redirect allow-list
- Seed data and one-off data jobs

Document these when the app depends on them; they are not blockers for connecting GitHub integration.

## Related

- [configuring-github-integration.md](./configuring-github-integration.md)
- [troubleshooting-deployment.md](./troubleshooting-deployment.md)
