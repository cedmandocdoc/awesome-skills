# Analyzing Product

## Overview

**Planning only.** Phase 1, Ideation: reads the product, writes or reviews `positioning.md`, and picks the campaign idea with the six questions. Creates the campaign and stops at state `ideation`. Also runs alone to review positioning.

## Prerequisites

Per [marketing-contract.md](./marketing-contract.md) → **Resolve marketing root**, **Output layout**, **Positioning**, **campaign.md**, **States**. Types: [marketing-types.md](./marketing-types.md).

## Guidelines

### 1. Resolve marketing root

Initialize when none exists.

### 2. Position the product

Skip when `positioning.md` exists, its `reviewed` date is under 90 days old, and the user did not ask for a review.

1. Read what exists: the repo (README, landing and onboarding copy, pricing, routes, sign-up and payment code), the live site, and app store listings and reviews.
2. Fill [`../assets/positioning.md`](../assets/positioning.md): what it does, segments per [marketing-contract.md](./marketing-contract.md) → **Positioning**, each with its problem in their own words (quote reviews, posts, support threads with the source), proof, alternatives, differentiator, offer, and the conversion events the code can confirm, each with its file and symbol.
3. Ask once, in one message, for what the sources cannot show: goals, budget, markets, constraints.
4. Set `reviewed` to today.

### 3. Pick the idea

Answer the six questions in order; each answer constrains the next:

| # | Question | Answer from |
| --- | --- | --- |
| 1 | Who exactly — one segment | Positioning's **Segments**; the `follows` campaign's conclusion |
| 2 | Why now — their trigger | Events that make the pain urgent (season, regulation, growth, a launch) |
| 3 | The message — their pain in their words | Positioning quotes |
| 4 | Proof | Positioning proof; a free audit or demo when there is none yet |
| 5 | The channel — where they already are | [marketing-types.md](./marketing-types.md) → **Choosing**; most failures start here |
| 6 | The funnel — how it is counted | One conversion event; a `goal` count |

Propose 2–3 ideas that answer all six; recommend one. Offer broad, aim narrow: the product may serve many segments, but one campaign targets one segment with one problem through one channel. With no users yet, recommend a direct type.

### 4. Write the campaign

Create `campaigns/NN-slug/` and `campaign.md` from [`../assets/campaign.md`](../assets/campaign.md). Fill frontmatter (`segment`, `types`, `conversion`, `goal`, `follows`) and **Idea**: the six answers for the recommended idea, then the alternatives in one line each. The message is locked from here: every asset in the campaign tests it, and only [updating-campaign.md](./updating-campaign.md) changes it. When the app does not record the chosen event yet, note it under **Idea** for [configuring-measurement.md](./configuring-measurement.md).

### 5. Confirm to the user

`state: ideation`; add the `index.md` row. Reply with:

- Paths written (`positioning.md` when new or reviewed, `campaign.md`), and the instruction files the standing rule changed
- The recommended idea in six lines, the alternatives in one line each
- What was assumed and what the user should check
- Next: _"continue campaign NN"_ runs Target, or name a change
