---
name: running-marketing
id: 8571c2a6-35c2-4404-a68a-ced598ad0224
description: >-
  Runs digital marketing for any digital product (app, SaaS, website, digital
  service) as campaigns under marketing/: analyzes the product into positioning,
  then moves each campaign one phase per request — ideation, targeting,
  roll-out, assets, approved sends, measurement through UTM links on a
  Cloudflare Worker and D1, and a conclusion that feeds the next idea. Use only
  when the user names this skill (`/running-marketing`, `$running-marketing`, or
  "running-marketing"), or references a file under a marked marketing root
  (`@marketing/campaigns/03-clinics-mm/campaign.md`).
version: 1.0.0
---

# Running Marketing

## Overview

One marketing root per product holds `positioning.md`, segments, and one folder per campaign. Every campaign follows seven phases — Ideation → Target → Roll-out → Assets → Execution → Measurement → Conclusion — and stops after each for review; its living `campaign.md` carries the state across chats. Nothing is sent without the user's approval of its batch. Every link goes through the skill's own Cloudflare Worker, which counts clicks, first landings, and the one conversion event the campaign names, so the report is the same query for every product.

## Dependencies

Resolve every **required** row before recipes that need it.

| Item | Required | When | How |
| --- | --- | --- | --- |
| Node.js 20+ and Wrangler | required | Measurement, links, reports | https://nodejs.org; Wrangler runs through `npx wrangler` |
| Cloudflare account | required | Measurement, links, reports | https://dash.cloudflare.com/sign-up, then `npx wrangler login` |
| [building-marketing-assets](https://github.com/cedmandocdoc/awesome-skills/tree/main/skills/building-marketing-assets) `74d80a4e-2346-43f7-b06a-43febe401281` | optional | Assets: images and video | `npx skills add cedmandocdoc/awesome-skills --skill building-marketing-assets` |
| Resend account with a warmed sending subdomain | optional | Execution: email | https://resend.com/docs; store `RESEND_API_KEY` in `.env` |
| Buffer MCP server | optional | Execution: posting to the project's own accounts | `claude mcp add --transport http buffer https://mcp.buffer.com/mcp`, then OAuth through `/mcp` |
| Google Places API key | optional | Target: local businesses | https://developers.google.com/maps/documentation/places/web-service/get-api-key; store `GOOGLE_PLACES_API_KEY` in `.env` |

## Setup

| Item | Required | When | How |
| --- | --- | --- | --- |
| Measurement Worker, D1, and app snippet | required | Before a campaign's first send; once per product | [configuring-measurement.md](references/configuring-measurement.md) |

## Agent workflow

Follow this skill when the user names it, or references a file under a marketing root marked by an `index.md` with this skill's author signature. Works wherever the agent can read and write repository files and run Node. Read [marketing-contract.md](references/marketing-contract.md) first; resolve **Dependencies** and **Setup** rows when the matched recipe needs them. Match one **Recipes** row and open exactly that reference; one request runs one phase.

### Recipes

| Intent | Example phrasing | Read |
| --- | --- | --- |
| Start a campaign | "Start a campaign for this app", "start a campaign from 02" | [analyzing-product.md](references/analyzing-product.md) |
| Review positioning | "Revisit positioning" | [analyzing-product.md](references/analyzing-product.md) step 2 |
| Continue a campaign | "Continue campaign 01", "next phase" | The recipe for its `state` per [marketing-contract.md](references/marketing-contract.md) → **States** |
| Approve, send, record, end, drop | "Approve batch", "o014 replied", "end campaign 01" | [executing-campaign.md](references/executing-campaign.md) |
| Measure | "How is campaign 01 doing?" | [measuring-campaign.md](references/measuring-campaign.md) |
| Conclude | "Conclude campaign 01" | [concluding-campaign.md](references/concluding-campaign.md) |
| Set up measurement | "Set up measurement", "add the conversion event" | [configuring-measurement.md](references/configuring-measurement.md) |

## Reference index

### Contract

[marketing-contract.md](references/marketing-contract.md) — signature, layout, root, `campaign.md`, states and routing, outbox items, sending caps, links and UTMs, assets skill discovery.

| Doc | When to use |
| --- | --- |
| [marketing-contract.md](references/marketing-contract.md) | Shared rules every recipe cites |
| [marketing-types.md](references/marketing-types.md) | Type table, choosing types, writing rules per asset |
| [analyzing-product.md](references/analyzing-product.md) | Phase 1: positioning and the campaign idea |
| [targeting-audience.md](references/targeting-audience.md) | Phase 2: segment and audience |
| [planning-rollout.md](references/planning-rollout.md) | Phase 3: schedule, assets, links, measurement check |
| [creating-assets.md](references/creating-assets.md) | Phase 4: outbox drafts, visual assets, links |
| [executing-campaign.md](references/executing-campaign.md) | Phase 5: batches, sends, replies, end, drop |
| [measuring-campaign.md](references/measuring-campaign.md) | Phase 6: report |
| [concluding-campaign.md](references/concluding-campaign.md) | Phase 7: results, verdict, next idea |
| [configuring-measurement.md](references/configuring-measurement.md) | Worker, D1, app snippet, adding links |

## Templates

- [`assets/index.md`](assets/index.md) — marketing root marker
- [`assets/positioning.md`](assets/positioning.md)
- [`assets/segment.md`](assets/segment.md)
- [`assets/campaign.md`](assets/campaign.md)
- [`assets/outbox-item.md`](assets/outbox-item.md)
- [`assets/results.md`](assets/results.md)
- [`assets/measurement/`](assets/measurement/) — Worker (`src/index.js`), `wrangler.toml`, `schema.sql`, `report.sql`, app `snippet.js`
