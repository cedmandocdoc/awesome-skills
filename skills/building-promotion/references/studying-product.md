# Studying Product

## Overview

**Authoring mode.** Studies an app from its source into `product.md`: the Brief (the inputs a wrapper skill or the user fills), the audiences in their own words, the features to show, alternatives and proof, and a message per audience. A re-study rewrites the same sections.

## Prerequisites

Per [promotion-contract.md](./promotion-contract.md) → **Output layout**, **Products and promotions**, **Resolve promotions root**, **product.md**, **Honesty rules**.

## Guidelines

### 1. Resolve the product

Per [promotion-contract.md](./promotion-contract.md) → **Resolve promotions root**. A new app in a root that already has a product → ask for its own root (`SKILL.md` → **Setup**, Root path and intention), never inside this one. A new product: create its `product.md` from [`../assets/product.md`](../assets/product.md), and set the root's `intention` to the app.

### 2. Read the source

| Source | Read |
| --- | --- |
| Mockup folder | Its flow doc (for example `flow.md`), design doc, and every screen: the job each flow does and its sample data |
| Codebase | README, routes, landing and onboarding copy, pricing, the main flows' screens and their fixtures |

The skill never runs the app. A URL, store listing, description, recording or footage is not a source: ask for the mockup folder or codebase. Record the path in frontmatter `source`.

### 3. Write the Brief

Fill each field from the request's framing ("promote that we can build an app like this for you" sells a build, with the app as the sample) or from the wrapper skill that steers this one. Ask once, in one message, for every field still empty.

| Field | Holds |
| --- | --- |
| Promote | What is promoted and how it's framed |
| Sold vs shown | What is sold / what is shown, per [writing-script.md](./writing-script.md) → **Sold vs shown** |
| Offer | The words the film says, ≤ 6 words; terms and conditions go to the conversation |
| CTA and destination | The action and where it lands: a message, a site, a store, a sign-up |
| Who it's for | The cue that selects the right viewer ("for the owner of a …"); needed when the trade's own customers might read the film as being for them |
| Markets | Where it runs |
| Language and address | The language and code-switch of voice and captions, the UI language, the form of address, who checks the script natively |
| Trust and proof | Real proof (shipped work, named), and what is never claimed |
| Never say | Words, offers and topics kept out of every line, caption and card |
| Disclosure wording | The sample line and the end card's disclosure, per [promotion-contract.md](./promotion-contract.md) → **Disclosure** |
| Brand kit | The seller's mark, colours, type, end-card layout and sonic cue, per [directing-picture.md](./directing-picture.md) → **Brand kit** |

### 4. Study the audience

1–3 audiences, each one group that shares one problem:

- **Who exactly:** role, business type, size, location, and their own label for themselves.
- **Pain in their own words:** quotes written or spoken by the audience itself (their posts, comments, reviews, forum threads, or interviews the user supplies), each with its source URL. Vendor, academic and news sources go under **Context**. None found → say so; the hooks are then the skill's wording and the user is told.
- **Trigger:** what makes the pain urgent now.
- **The old way and its artifact:** the notebook, chat, spreadsheet or paper that becomes the film's problem world.
- **Awareness:** unaware, problem-aware or solution-aware; digital literacy; age band; the language they speak and read; risk class (money, health, legal, records, or none).
- **Objections:** what would stop them acting ("what's the catch?", "who are these people?"); the film answers them with its trust beat, never with terms.
- **Who sees vs who decides:** whether the viewer is the buyer, or forwards it to one.
- **Disqualifiers:** who looks like them but isn't; they shape **Who it's for**.

### 5. Features to show, alternatives and proof

1. **Features to show:** each as one task, input → result, with the screens it uses, the datum carried through, and the pain it answers. Only features the source shows.
2. **Alternatives:** what they use today, doing nothing included, and why they would switch.
3. **Proof:** real proof from the user and the sources only. A mockup has none of its own; its proof comes from the Brief.

### 6. Write the Message

Per audience: the core line in their words, its anchor phrase, and 3 hooks of different types, per [writing-script.md](./writing-script.md) → **Core line, anchor phrase, value frame** and [choosing-style.md](./choosing-style.md) → **Hook types**.

### 7. Confirm to the user

Set `studied` to today. Reply with:

- The `product.md` path
- Each audience in one line, its top pain quote (or "no own-words quote found"), and its best hook
- The features to show
- What was assumed and what the user should check
- Next: "make a promotion" proposes concepts for this product
