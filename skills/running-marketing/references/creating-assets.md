# Creating Assets

## Overview

**Authoring mode.** Phase 4, Assets: writes every text asset as outbox drafts, hands each visual asset to `building-marketing-assets`, and creates the campaign's links. Sets state `assets`; repeat runs advance pending visual assets until all are `done`.

## Prerequisites

Per [marketing-contract.md](./marketing-contract.md) → **Outbox items**, **Sending caps**, **Links and UTMs**, **Discover dependency skill**. Writing rules: [marketing-types.md](./marketing-types.md) → **Writing rules per asset**. Links into D1: [configuring-measurement.md](./configuring-measurement.md) → **Add links**.

## Guidelines

### 1. Route the run

| Campaign | Run |
| --- | --- |
| `state: rollout` | Steps 2–5 |
| `state: assets`, a visual asset not `done` | Step 3 for that asset only, then step 5 |

### 2. Write text assets

Per outbox set in **Roll-out** → **Assets**, one outbox item per person and touch from [`../assets/outbox-item.md`](../assets/outbox-item.md), status `draft`, numbered in send order. Touch 1 personalizes from the prospect's `why`; touches 2–3 carry `send_if: no reply`. Posts get their planned date in `scheduled`.

### 3. Hand off visual assets

Per [marketing-contract.md](./marketing-contract.md) → **Discover dependency skill**. Missing → replace each visual asset with a text post and say so.

Found → run its Create recipe for each planned visual asset with this campaign's `campaign.md` as the brief and the asset's kind, channel, and format; then its Continue recipe on later runs. Relay its options to the user unchanged and pass their picks back. Add each asset id to frontmatter `assets`.

### 4. Create links

Per [marketing-contract.md](./marketing-contract.md) → **Links and UTMs**: one link per outbox item that carries a link, and one per visual asset per platform once the asset has its code. Write `links.md`, insert the rows per [configuring-measurement.md](./configuring-measurement.md) → **Add links**, and put the short URL in each item's body or the post's link field.

### 5. Confirm to the user

Write **Assets**: outbox counts per set, visual asset ids and states, link count. `state: assets`; update the `index.md` row. Reply with:

- 2 sample outbox items in full, and the path to the rest
- Each visual asset's current pick, relayed from the assets skill
- Next: a pick for a pending visual asset, or once all are `done`, _"continue campaign NN"_ to approve the first batch
