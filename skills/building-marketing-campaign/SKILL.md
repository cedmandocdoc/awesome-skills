---
name: building-marketing-campaign
id: 8571c2a6-35c2-4404-a68a-ced598ad0224
description: >-
  Builds digital marketing campaigns for any digital product (app, SaaS,
  website, digital service) under marketing/: analyzes the product into
  positioning, then moves each campaign one phase per request — ideation,
  targeting, roll-out, assets (text drafts, videos handed to HyperFrames),
  approved outbox batches the user sends, measurement through UTM links on a
  Cloudflare Worker and D1, and a conclusion that feeds the next idea. Use only
  when the user names this skill (`/building-marketing-campaign`,
  `$building-marketing-campaign`, or "building-marketing-campaign"), or
  references a file under a marked marketing root
  (`@marketing/campaigns/03-clinics-mm/campaign.md`).
version: 4.1.1
---

# Building Marketing Campaign

## Setup

| Item | Kind | Required | When | Done when | How |
| --- | --- | --- | --- | --- | --- |
| Node.js 20+ | user | required | Execution, Check in, Conclude | `node --version` reports 20 or later | https://nodejs.org; Wrangler runs through `npx wrangler` |
| Cloudflare account | user | required | Execution, Check in, Conclude | `npx wrangler whoami` shows an account | https://dash.cloudflare.com/sign-up, then `npx wrangler login` |
| [hyperframes](https://github.com/heygen-com/hyperframes/tree/main/skills/hyperframes) | user | optional | Assets: video | Found per [marketing-contract.md](references/marketing-contract.md) → **Discover dependency skill** | `npx hyperframes skills update` (core skills only; it installs each workflow the first time it routes to one) |
| Google Places API key | user | optional | Target: local businesses | `.env` has `GOOGLE_PLACES_API_KEY` | https://developers.google.com/maps/documentation/places/web-service/get-api-key; store it in `.env` |
| Root path | ask | required | Start a campaign | [marketing-contract.md](references/marketing-contract.md) → **Resolve marketing root** finds a root | Ask for the folder (default `marketing/`); missing or empty → use it, else ask for another path; recorded as the root's location |
| Root marker | static | required | Start a campaign | `<marketing-root>/index.md` carries [marketing-contract.md](references/marketing-contract.md) → **Author signature** | Write `index.md` from [`assets/index.md`](assets/index.md) |
| Standing rule | auto | required | Start a campaign | Root `AGENTS.md` has the line | Add `- When a change alters the product's features, pricing or plans, or the code that confirms a conversion event, run the building-marketing-campaign Refresh positioning recipe in the same work.` to root `AGENTS.md` (create when missing) and to root `CLAUDE.md` when it exists without importing `AGENTS.md`; skip a file that has it |
| App origins and domain | ask | required | Execution | `<marketing-root>/measurement/wrangler.toml` → `ALLOWED_ORIGINS` lists the app's origins | Ask for the app's origins and whether its domain's DNS is on Cloudflare; recorded in that `wrangler.toml` → `ALLOWED_ORIGINS` and `routes` |
| Measurement Worker and D1 | static | required | Execution | `wrangler.toml` has a real `database_id` and the Worker URL answers | [configuring-measurement.md](references/configuring-measurement.md) → steps 1–2 |
| App snippet | auto | required | Execution | The app calls `mkCapture()` on every page load | [configuring-measurement.md](references/configuring-measurement.md) → step 3 |
| Conversion event | auto | required | Execution | The app calls `conversion('<event>')` after the success response for the campaign's `conversion` | [configuring-measurement.md](references/configuring-measurement.md) → steps 4–6 |

## Workflow

1. **Setup** — for each **Setup** row whose When covers the request, in order: Done when holds → skip; `user` → stop and print its How when required, continue without it when optional; `ask` → fill what the request answers, ask the rest together in one message, record each answer; `auto` and `static` → run.
2. **Contract** — read [marketing-contract.md](references/marketing-contract.md).
3. **Recipe** — match one **Recipes** row; open every doc in its Read column.

- Sends and posts nothing.
- One request runs one phase.

## Recipes

| Intent | Example phrasing | Read |
| --- | --- | --- |
| Set up | "Set up measurement", "Add the conversion event", "Is building-marketing-campaign ready?" | **Setup** — run Workflow step 1 for every row, then report each row's state |
| Start a campaign | "Start a campaign for this app", "start a campaign from 02" | [analyzing-product.md](references/analyzing-product.md) |
| Review positioning | "Revisit positioning" | [analyzing-product.md](references/analyzing-product.md) step 2 |
| Refresh positioning | The standing rule after a product change, "refresh positioning" | [updating-positioning.md](references/updating-positioning.md) |
| Continue a campaign | "Continue campaign 01", "next phase", a HyperFrames return line | The recipe for its `state` per [marketing-contract.md](references/marketing-contract.md) → **States** |
| Change a campaign | "Change the message", "new CTA", "make v1 shorter", "move it to LinkedIn" | [updating-campaign.md](references/updating-campaign.md) |
| Approve, record, end, drop | "Approve batch", "sent o014", "o014 replied", "end campaign 01" | [executing-campaign.md](references/executing-campaign.md) |
| Check in | "How is campaign 01 doing?", "check in on campaign 01" | [measuring-campaign.md](references/measuring-campaign.md) |
| Conclude | "Conclude campaign 01" | [concluding-campaign.md](references/concluding-campaign.md) |
