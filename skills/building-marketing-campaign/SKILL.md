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
version: 4.0.0
---

# Building Marketing Campaign

## Overview

One marketing root per product holds `positioning.md` (product facts and segments) and one folder per campaign. Every campaign follows seven phases — Ideation → Target → Roll-out → Assets → Execution → Measurement → Conclusion — and stops after each for review; its living `campaign.md` carries the state across chats. The skill writes all text and hands each video to HyperFrames with a facts-only request; it sends and posts nothing — the user sends each approved item by hand. Every link carries four UTMs; a snippet in the app sends landings and the one conversion event the campaign names to the skill's own Cloudflare Worker and D1, so the report is the same query for every product.

## Dependencies

Resolve every **required** row before recipes that need it.

| Item | Required | When | How |
| --- | --- | --- | --- |
| Node.js 20+ and Wrangler | required | Measurement setup, check-ins | https://nodejs.org; Wrangler runs through `npx wrangler` |
| Cloudflare account | required | Measurement setup, check-ins | https://dash.cloudflare.com/sign-up, then `npx wrangler login` |
| [hyperframes](https://github.com/heygen-com/hyperframes/tree/main/skills/hyperframes) | optional | Assets: video | `npx hyperframes skills update` (core skills only; it installs each workflow the first time it routes to one) |
| Google Places API key | optional | Target: local businesses | https://developers.google.com/maps/documentation/places/web-service/get-api-key; store `GOOGLE_PLACES_API_KEY` in `.env` |

## Setup

| Item | Required | When | How |
| --- | --- | --- | --- |
| Standing rule | required | Start a campaign, when it initializes the marketing root | Add `- When a change alters the product's features, pricing or plans, or the code that confirms a conversion event, run the building-marketing-campaign Refresh positioning recipe in the same work.` to root `AGENTS.md` (create when missing) and to root `CLAUDE.md` when it exists without importing `AGENTS.md`; skip a file that has it |
| Measurement Worker, D1, and app snippet | required | Before a campaign's first send; once per product | [configuring-measurement.md](references/configuring-measurement.md) |

## Agent workflow

Follow this skill when the user names it, or references a file under a marketing root marked by an `index.md` with this skill's author signature. Works wherever the agent can read and write repository files and run Node. Read [marketing-contract.md](references/marketing-contract.md) first; resolve **Dependencies** and **Setup** rows when the matched recipe needs them. Match one **Recipes** row and open exactly that reference; one request runs one phase.

### Recipes

| Intent | Example phrasing | Read |
| --- | --- | --- |
| Start a campaign | "Start a campaign for this app", "start a campaign from 02" | [analyzing-product.md](references/analyzing-product.md) |
| Review positioning | "Revisit positioning" | [analyzing-product.md](references/analyzing-product.md) step 2 |
| Refresh positioning | The standing rule after a product change, "refresh positioning" | [updating-positioning.md](references/updating-positioning.md) |
| Continue a campaign | "Continue campaign 01", "next phase", a HyperFrames return line | The recipe for its `state` per [marketing-contract.md](references/marketing-contract.md) → **States** |
| Change a campaign | "Change the message", "new CTA", "make v1 shorter", "move it to LinkedIn" | [updating-campaign.md](references/updating-campaign.md) |
| Approve, record, end, drop | "Approve batch", "sent o014", "o014 replied", "end campaign 01" | [executing-campaign.md](references/executing-campaign.md) |
| Check in | "How is campaign 01 doing?", "check in on campaign 01" | [measuring-campaign.md](references/measuring-campaign.md) |
| Conclude | "Conclude campaign 01" | [concluding-campaign.md](references/concluding-campaign.md) |
| Set up measurement | "Set up measurement", "add the conversion event" | [configuring-measurement.md](references/configuring-measurement.md) |

## Reference index

### Contract

[marketing-contract.md](references/marketing-contract.md) — signature, layout, root, positioning and segments, `campaign.md`, states and routing, outbox items, sending caps, links and UTMs, measurement, videos and the HyperFrames handoff, free media.

| Doc | When to use |
| --- | --- |
| [marketing-contract.md](references/marketing-contract.md) | Shared rules every recipe cites |
| [marketing-types.md](references/marketing-types.md) | Type table, choosing types, writing rules per asset |
| [analyzing-product.md](references/analyzing-product.md) | Phase 1: positioning and the campaign idea |
| [updating-positioning.md](references/updating-positioning.md) | A product change: product facts and the campaigns it reaches |
| [targeting-audience.md](references/targeting-audience.md) | Phase 2: segment and audience |
| [planning-rollout.md](references/planning-rollout.md) | Phase 3: schedule, assets, material, measurement check |
| [creating-assets.md](references/creating-assets.md) | Phase 4: text drafts, video requests, rendered videos, links |
| [executing-campaign.md](references/executing-campaign.md) | Phase 5: batches, approvals, sends and replies the user reports, end, drop |
| [measuring-campaign.md](references/measuring-campaign.md) | Phase 6: check-in — outbox catch-up, report, one recommendation |
| [concluding-campaign.md](references/concluding-campaign.md) | Phase 7: results, verdict, next idea |
| [updating-campaign.md](references/updating-campaign.md) | A change to an earlier phase or a video: what reruns, what goes stale |
| [configuring-measurement.md](references/configuring-measurement.md) | Worker, D1, app snippet, conversion calls |

## Templates

- [`assets/index.md`](assets/index.md) — marketing root marker
- [`assets/positioning.md`](assets/positioning.md)
- [`assets/campaign.md`](assets/campaign.md)
- [`assets/video-request.md`](assets/video-request.md) — the message handed to `/hyperframes`
- [`assets/outbox-item.md`](assets/outbox-item.md)
- [`assets/results.md`](assets/results.md)
- [`assets/measurement/`](assets/measurement/) — Worker (`src/index.js`), `wrangler.toml`, `schema.sql`, `report.sql`, app `snippet.js`
