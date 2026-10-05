---
doc_type: walkthroughs-index
generated_by: building-walkthroughs
author: 2f1b6e9a-e16d-4361-93a9-bccb7508bc90
app: "[App name]"
baselines:
  "[baseline-id]":
    title: "[Fresh install | Demo workspace | …]"
    setup: "[command that reaches it, e.g. npm run db:reset]"
areas:
  - id: "[area-id]"
    title: "[Area as the app's navigation names it, e.g. Invoices]"
    summary: "[One line, optional: what people do here]"
actors:
  - id: "[actor-id]"
    title: "[Role title, e.g. Studio owner]"
journeys:
  - id: "[journey-id]"
    title: "[Goal in the actor's words, e.g. Bill a client and get paid]"
    actors: ["[actor-id]"]
    goal: "[One line: what the actor has when the journey ends]"
    walkthroughs: ["[walkthrough-id]", "[walkthrough-id]"]
lenses:
  - id: "[lens-id, e.g. surface]"
    title: "[Lens title, e.g. Surface]"
    values:
      - { id: "[value-id]", title: "[Value title]" }
      - { id: "[value-id]", title: "[Value title]" }
surfaces:
  - { id: "[route pattern or screen name, e.g. /invoices/:id]", title: "[Screen title]", area: "[area-id]" }
  - { id: "[…]", title: "[…]", area: "[area-id]", gap: "[needs-setup | internal | not-built]: [what, in one line]" }
---

# Walkthroughs — [App name]

View the map: `npm install` once, then `npm run dev` in this folder.

## What this app does

[Two or three sentences: what the app is for, who uses it, and what the first journey shows.]

## Run it locally

### Start the app

1. [Install and run commands]
2. Open [URL, simulator, or device]

### Baselines

| Baseline | Reach it with | What is true |
| --- | --- | --- |
| [Title] | `[command]` | [Accounts, data, and settings that exist] |

### Accounts

Seed or dev credentials only.

| Account | Login | Password | Actor |
| --- | --- | --- | --- |
| [Name] | [email or username] | [password] | [actor title] |

## Journeys

<!-- walkthroughs:journeys:start -->
<!-- walkthroughs:journeys:end -->

## Walkthroughs

<!-- walkthroughs:list:start -->
<!-- walkthroughs:list:end -->

## Coverage

<!-- walkthroughs:coverage:start -->
<!-- walkthroughs:coverage:end -->
