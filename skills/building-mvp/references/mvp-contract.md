# MVP Contract

## Overview

Shared rules for `building-mvp`: the stage map, dependency discovery, stage skill installs, the setup policy, autonomy-gap checks, the session record, and the run-level `AGENTS.md` lines.

## Guidelines

### Stage map

Stack: Vite + React SPA on Cloudflare Workers, Supabase backend (Auth, Postgres, Storage, Edge Functions), pnpm + Turborepo workspace. An idea that needs a surface, host, or backend outside it stops with `Not covered by the stage map: <what>`.

| # | Stage | Skills |
| --- | --- | --- |
| 1 | Specs | building-product-specifications |
| 2 | Design | building-design |
| 3 | Workspace and scaffold | managing-monorepo, building-react-web-application, pnpm, turborepo |
| 4 | Features | building-react-web-application |
| 5 | Tests | building-tests, playwright-cli |
| 6 | Deploy | deploying-supabase-application, deploying-cloudflare-web-application |
| 7 | Walkthroughs | building-walkthroughs |

| Source | Skills |
| --- | --- |
| `cedmandocdoc/awesome-skills` | building-product-specifications, building-design, managing-monorepo, building-react-web-application, building-tests, deploying-supabase-application, deploying-cloudflare-web-application, building-walkthroughs |
| `antfu/skills` | pnpm |
| `vercel/turborepo` | turborepo |
| `microsoft/playwright-cli` | playwright-cli |

### Discover dependency skill

1. Explicit pointers — `AGENTS.md`, the user request, `@`-mentioned skills.
2. Project roots — glob `<root>/<skill-name>/SKILL.md` (`.agents/skills/`, `.cursor/skills/`, `.claude/skills/`, `.codex/skills/`, `.github/skills/`, and the other agent skill directories).
3. User-level roots — same layout under `~/` (for example `~/.cursor/skills/`, `~/.agents/skills/`). Prefer a project copy over a user copy of the same `name`.
4. Custom roots named in `AGENTS.md` or by the user.
5. Read each candidate `SKILL.md` frontmatter. This catalog: accept `name` + `id`; a different `id` → skip; deduplicate by `id` (then `name`). A row without `id` (third-party or legacy): accept a unique `name`.

| Skill | `id` |
| --- | --- |
| building-idea | `c8cd6566-5342-40cd-bca7-f270308159e7` |
| managing-context-sessions | `c1e76cba-3d65-4bfe-82cb-6b3654c08429` |
| delivering-goal | `317e7227-bf0b-42d4-a288-4650802eace5` |

A found skill is followed by opening its `SKILL.md` and running the recipe named by intent.

### Install stage skills

Stage skills install into the project at the latest version of their source, present ones included, one command per source: `npx skills add <source> --skill <a> --skill <b> … -y`.

### Setup policy

The stage skills' **Setup** tables are read from the installed copies at run time; `building-mvp` holds none of their rows.

| Row kind | When | How |
| --- | --- | --- |
| `user` | Up front, one item at a time | The row's Done when is its probe |
| `ask` | Answered up front, applied by the owning skill when it runs | The answer goes to the session's Setup answers |
| `auto`, `static` | When the owning skill runs | Untouched by `building-mvp` |
| Exceptions | Up front | The GitHub repository (deploy skills need `gh repo view`), the Supabase production project (the token probe needs its ref), `phase-deliverer` (a harness loads agents at start) |

### Autonomy-gap checks

Each check that applies becomes a decision in the confirmation table, defaulted from the idea; a decision that needs something only the user can make adds a user item.

| Check | Applies when | Default decision | User item |
| --- | --- | --- | --- |
| Push policy | Always | Push the production branch after each phase from the Deploy stage on, watch the deploy workflows with `gh run watch`, and fix a failed run before the next phase | — |
| Sign-in that needs an inbox | Auth sends magic links, codes, or confirmation mail | Tests sign in against the local Supabase inbox only; no production check signs in | — |
| Mail limits | The app sends auth or product mail | Supabase's built-in mailer, rate-limited, for the MVP | Custom SMTP credentials when the user wants real volume |
| OAuth consent screens | An OAuth provider is **In** | Email sign-in first; the provider moves to **Out** | The provider's app and client secret when the user keeps it |
| DNS and zone ownership | A custom domain | `dig +short NS <zone>` shows Cloudflare nameservers → the Worker custom domain; otherwise `workers.dev` | Adding the zone to the Cloudflare account |
| Browser-only logins | A platform login has no CLI or token path | Drop the integration to **Out** | The login, as its own item |
| Payments | Payments are **In** | Test mode only | The provider's test-mode key |
| Production verification | Always | Production loads, deep links survive a refresh, the app reaches the production Supabase project with no console errors; journeys run locally | — |

### Session record

One managing-context-sessions session per run, named after the product. Intent line: `Build <product> with building-mvp from idea to production at <url>; done when production is live.`

| Section | Item |
| --- | --- |
| Agreed | `Run: building-mvp, step <N> <name>; resume by opening the building-mvp skill and running its Resume recipe` — kept on the current step |
| Agreed | Idea: building-idea's summary **Decisions** table and **MVP scope** in full |
| Agreed | Setup answers: Skill \| Row \| Answer, one row per `ask` row |
| Agreed | Decisions: Check \| Decision, one row per applying autonomy-gap check, plus repository, product name, and production URL |
| Agreed | User prerequisites: Item \| Probe \| Status (`todo`, `ready <YYYY-MM-DD>`) |
| Agreed | Goal → `<goals-root>/<goal-id>/goal.md`, once planned |
| Open | One item per user prerequisite still `todo`, and per blocker the run stopped on |

### Run-level AGENTS.md lines

Written to root `AGENTS.md` (created when missing) and to root `CLAUDE.md` when it exists without importing `AGENTS.md`; removed when the run is done. Each stage skill writes its own standing rule.

```markdown
- building-mvp run: decisions, setup answers, and pre-approvals live in `<session-path>`; read it before starting any skill and answer setup `ask` rows from it.
- Pre-approved during the building-mvp run: delivering-goal phase plans and replans, and the deploy skills' run plans (create the Supabase project, the Worker, the custom domain). Proceed without asking.
- Pre-approved during the building-mvp run: <push policy decision>.
```
