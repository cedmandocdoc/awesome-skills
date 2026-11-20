---
name: tracking-promotions
id: 1f308488-2ec0-4a45-aaf5-a9fa2af7d03b
description: >-
  Tracks where promotions made by building-promotion went: records each
  delivery the user approved (a post on a channel, or a one-to-one message)
  in Cloudflare D1 with its latest status and a time per step, freezes a
  promotion's source with a fingerprint at its first delivery, and serves a
  view-only local board of every promotion's assets (its own renders) and
  deliveries. Renders, posts and sends nothing. Use only when the user names
  this skill (`/tracking-promotions`, `$tracking-promotions`, or
  "tracking-promotions"), or references a file under a marked tracking root
  (`@tracking/index.md`).
version: 1.1.0
---

# Tracking Promotions

## Setup

| Item | Kind | Required | When | Done when | How |
| --- | --- | --- | --- | --- | --- |
| Root path | ask | required | Set up, Record | [tracking-contract.md](references/tracking-contract.md) → **Resolve tracking root** finds a root | Ask for the folder (default `tracking/`); missing or empty → use it, else ask for another path; recorded as the root's location |
| Root marker | static | required | Set up, Record | `<tracking-root>/index.md` carries [tracking-contract.md](references/tracking-contract.md) → **Author signature** | Write `index.md` from [`assets/index.md`](assets/index.md) |
| Node.js 22+ | user | required | All | `node --version` reports 22 or later | https://nodejs.org |
| Promotions root | user | required | Record, Open the board | [tracking-contract.md](references/tracking-contract.md) → **Resolve promotions roots** finds one | Make a promotion with [building-promotion](https://github.com/cedmandocdoc/awesome-skills/tree/main/skills/building-promotion) |
| Cloudflare account | user | required | All | `npx wrangler whoami` shows an account | https://dash.cloudflare.com/sign-up, then `npx wrangler login` |
| Account | ask | required | Set up | `index.md` frontmatter `account_id` is an account id, not `none` | Ask which account `npx wrangler whoami` lists to use (one → use it); recorded as `account_id` |
| Database name | ask | required | Set up | `index.md` frontmatter `database` names a database, not `none` | Ask for the D1 database name (default `promotion-tracking`); recorded as `database` |
| Database | auto | required | Set up, Record, Update a status, Look up, Open the board | `node <skill>/scripts/track.mjs check` exits 0 | `node <skill>/scripts/track.mjs setup` |
| Board look | ask | optional | Set up, Open the board | `index.md` frontmatter has `board_brand` | Ask for the board's brand name, its stylesheets, the folder their fonts load from, and a logo (default `none` each); recorded per [tracking-contract.md](references/tracking-contract.md) → **index.md fields** |

## Workflow

1. **Setup** — for each **Setup** row whose When covers the request, in order: Done when holds → skip; `user` → stop and print its How when required, continue without it when optional; `ask` → fill what the request answers, ask the rest together in one message, record each answer; `auto` and `static` → run.
2. **Contract** — read [tracking-contract.md](references/tracking-contract.md).
3. **Recipe** — match one **Recipes** row; open every doc in its Read column.

- Records only deliveries the user approved; renders, posts and sends nothing.
- Reads promotion folders and never writes into them.

## Recipes

| Intent | Example phrasing | Read |
| --- | --- | --- |
| Set up | "Set up tracking-promotions", "Is tracking-promotions ready?" | **Setup** — run Workflow step 1 for every row, then report each row's state |
| Record | "Record this approved post", "track these 12 approved messages", a JSON of deliveries | [creating-delivery.md](references/creating-delivery.md) |
| Update a status | "Delivery 12 went out", "mark it scheduled with this link", "they replied", "cancel 14" | [updating-delivery.md](references/updating-delivery.md) |
| Look up | "Which deliveries went to this ref?", "list the approved messages in batch X", "which promotions are frozen?" | [tracking-contract.md](references/tracking-contract.md) → **Commands** (`list`, `promotions`) |
| Open the board | "Open the board", "show me where the promotions stand" | [opening-board.md](references/opening-board.md) |
| Back up | "Back up the tracking database" | [tracking-contract.md](references/tracking-contract.md) → **Commands** (`backup`) |
