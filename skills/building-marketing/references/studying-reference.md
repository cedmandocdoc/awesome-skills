# Studying Reference

## Overview

**Docs only.** Studies the reference the user gives (a mockup folder, a codebase, a URL, a store listing, or a description) with the framing their prompt sets, and writes the item's `plan.md` through **Brief**, **Study**, and **Message**. Also re-studies an existing item, keeping its **Promotions**, **Reach**, and **Next**.

## Prerequisites

Per [marketing-contract.md](./marketing-contract.md) → **Resolve marketing root**, **Output layout**, **Items and promotions**, **plan.md**, **Honesty rules**.

## Guidelines

### 1. Resolve the item

Per [marketing-contract.md](./marketing-contract.md) → **Resolve marketing root** and **Items and promotions**. A new item: create `<slug>/plan.md` from [`../assets/plan.md`](../assets/plan.md) and add its `index.md` row.

### 2. Read the reference

| Reference | Read |
| --- | --- |
| Mockup folder | Its flow doc (for example `flow.md`), design doc, and every screen: the job each flow does and its sample data |
| Codebase | README, routes, landing and onboarding copy, pricing, the main flows' screens |
| URL | The live site: what it does, offer, pricing, proof |
| Store listing | Description, screenshots, reviews (pain and praise in users' words) |
| Description | The user's words; ask for screenshots when it names an existing app |

Record it in frontmatter `reference`.

### 3. Write the Brief

Fill **Brief** from the prompt's framing ("promote that Likhara can build it for you" markets the builder, with the app as proof). Ask once, in one message, for every **Brief** field they leave out.

### 4. Study the market

1. **Audiences**: 1–3, each one group that shares one problem and is reached the same way:
   - Who exactly (role, business type, size, location)
   - Pain in their words: quotes from where they gather (groups, forums, reviews), each with its source URL
   - Trigger: what makes the pain urgent now
   - Where they gather, with URLs
   - Disqualifiers: who looks like them but isn't
2. **Features to show**: each feature → the pain it answers → why it hooks in 2 s. Only features the reference shows.
3. **Alternatives and differentiator**: what they use today (notebook, chat, spreadsheet, a named tool) and why they would switch.
4. **Proof**: real proof from the user and the sources only; a mockup has none of its own, so proof comes from the framing (the builder's shipped apps, guarantees).

### 5. Write the Message

Per audience: one core message in their words, and 3–5 hooks, each a line that works as the first 2 s of a video.

### 6. Confirm to the user

Set `studied` to today; update the `index.md` row. Reply with:

- The `plan.md` path
- Each audience in one line, its top pain quote, and its best hook
- The features to show
- What was assumed and what the user should check
- Next: "make a promotion" for this item
