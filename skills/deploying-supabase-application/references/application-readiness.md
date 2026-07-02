# Supabase application readiness

Verify the repository has a deployable Supabase app before connecting GitHub integration.

## Required layout

Minimum structure at the Supabase project root:

```
<supabase-root>/
├── config.toml
├── migrations/
│   └── *.sql
└── functions/          # if Edge Functions are used
    └── <function-name>/
```

Optional but common: `seed.sql`, `package.json` with Supabase CLI scripts, `functions/deno.json`.

## Discover the Supabase root

Search the repository for `config.toml` files that include Supabase sections (`[api]`, `[db]`, `[functions.*]`, etc.).

| Layout | Working directory (dashboard) |
| --- | --- |
| `supabase/config.toml` at repo root | `.` |
| `apps/backend/config.toml` (monorepo) | `apps/backend` |
| Nested `apps/foo/supabase/config.toml` | `apps/foo` (parent of the `supabase/` folder) |

**Rule:** Working directory is the repo-relative path to the directory the integration should use as the Supabase project root — the folder that directly contains `config.toml` and `migrations/`.

When the standard layout uses a nested `supabase/` subfolder (e.g. `apps/web/supabase/`), Supabase docs describe the working directory as the **parent** of that folder (`apps/web`). When `config.toml` lives directly in a package directory (e.g. `apps/supabase/config.toml`), use that directory path.

If multiple `config.toml` candidates exist, ask the user which app deploys to the target remote project.

## config.toml checks

Before connect:

1. **`[db.migrations]`** — migrations enabled (default)
2. **`[db]` `major_version`** — matches the remote Postgres major version
3. **`[functions.<name>]`** — every function in `functions/` that should deploy is declared
4. **`[storage.buckets.<name>]`** — buckets that should deploy are declared (if used)

Undeclared functions and buckets are **not** deployed by GitHub integration.

## Local validation

From the Supabase root:

```bash
supabase db start
supabase db reset --local
supabase db lint
```

Prefer `db reset --local` when seeds must be exercised; use `supabase migration up --local` for faster incremental checks.

### Edge Functions (if present)

```bash
# Example — adapt to project scripts
deno check --config functions/deno.json functions/*/index.ts
deno test --config functions/deno.json functions/
```

Many monorepos wrap these in `package.json` scripts (e.g. `functions:check`, `functions:test`).

## Pre-merge checklist

Copy when preparing a release:

```
- [ ] Supabase root identified; working directory documented
- [ ] Migrations apply locally without error
- [ ] supabase db lint passes
- [ ] New/changed functions declared in config.toml
- [ ] Function checks/tests pass (if applicable)
- [ ] Secrets and auth config noted for manual dashboard setup (if needed)
```

## What stays manual

GitHub integration does not replace dashboard configuration for:

- Edge Function secrets (`supabase secrets set` or Project Settings → Edge Functions)
- Auth SMTP, Site URL, redirect allow-list
- Seed data and one-off data jobs

Document these for the user when the app depends on them; they are not blockers for connecting GitHub integration.
