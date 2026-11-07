# Studying Reference

## Overview

**Docs only.** Studies an app's source (a mockup folder or a codebase) with the framing the user's prompt sets, and writes the product's `product.md`: **Brief**, **Study**, and **Message**. Also re-studies an existing product, keeping its campaigns.

## Prerequisites

Per [marketing-contract.md](./marketing-contract.md) → **Resolve marketing root**, **Output layout**, **Products and campaigns**, **product.md**, **Honesty rules**. Fields and choices per [directing-promo-video.md](./directing-promo-video.md) → **Message**, **Tone**, **Holds**.

## Guidelines

### 1. Resolve the product

Per [marketing-contract.md](./marketing-contract.md) → **Resolve marketing root** and **Products and campaigns**. A new product: create `<product>/product.md` from [`../assets/product.md`](../assets/product.md).

### 2. Read the source

| Source | Read |
| --- | --- |
| Mockup folder | Its flow doc (for example `flow.md`), design doc, and every screen: the job each flow does and its sample data |
| Codebase | README, routes, landing and onboarding copy, pricing, the main flows' screens and their fixtures |

The skill never runs the app. A URL, store listing, description, recording or footage is not a source: ask for the mockup folder or codebase. Record the path in frontmatter `source`.

### 3. Write the Brief

Fill **Brief** from the prompt's framing ("promote that Likhara can build it for you" sells a build, with the app as the sample) and set the sold-vs-shown row. Ask once, in one message, for every **Brief** field the prompt leaves out.

### 4. Study the market

1. **Audiences**: 1–3, each one group that shares one problem and is reached the same way:
   - Who exactly (role, business type, size, location), and their own label for themselves
   - Pain in their words: quotes from where they gather (groups, forums, reviews), each with its source URL
   - Trigger: what makes the pain urgent now
   - The old way and its medium (a notebook, a chat, a spreadsheet), which becomes the problem world
   - Awareness (unaware, problem-aware, solution-aware); digital literacy; age band; the language they speak and read; risk class (money, health, legal, records, or none)
   - Where they gather, with URLs
   - Disqualifiers: who looks like them but isn't
2. **Features to show**: each feature as one task, input → result, with the screens it uses, the datum carried through, and the pain it answers. Only features the source shows.
3. **Alternatives and differentiator**: what they use today and why they would switch.
4. **Proof**: real proof from the user and the sources only. A mockup has none of its own, so proof comes from the framing (the builder's shipped apps, guarantees).

### 5. Write the Message

Per audience: the core line in their words, its anchor phrase, and 3 hooks of different types.

### 6. Confirm to the user

Set `studied` to today. Reply with:

- The `product.md` path
- Each audience in one line, its top pain quote, and its best hook
- The features to show
- What was assumed and what the user should check
- Next: "make a campaign" proposes concepts for this product
