---
name: building-walkthroughs
id: 62987084-2733-4959-9c53-0e9ae812a34e
description: Builds and maintains hands-on walkthroughs of an app — one Markdown guide per user journey with exact on-screen steps, expected results, and a journey diagram — plus a metro-map board viewer, so the user can learn and verify the app by using it. Works from the code alone; specs, designs, seeds, and tests sharpen it. Use when the user wants walkthroughs, a guided tour, a manual test guide, user journeys to try by hand, to be walked through a feature live, or walkthroughs updated after a change.
version: 1.0.0
---

# Building Walkthroughs

## Overview

Turns any app into a set of walkthroughs: one Markdown guide per user journey, each starting from a reproducible baseline or another walkthrough's end and declaring the facts true when it finishes. A copied Vite viewer shows them as a metro map — storylines as lines, walkthroughs as stations, alternatives as spurs. Walkthroughs are guides only; re-checking the app automatically belongs to E2E tests.

## Dependencies

| Item | Required | When | How |
| --- | --- | --- | --- |
| Node.js 20.19+ with npm | required | Viewer, `npm run check`, `npm run index` | https://nodejs.org |

## Agent workflow

Follow this skill for walkthroughs under a root marked by an `index.md` with this skill's author signature. Works wherever the agent can read the app's code and write repository files. Read [walkthrough-contract.md](references/walkthrough-contract.md) first, then match one **Recipes** row and open exactly that reference.

### Recipes

| Intent | Example phrasing | Read |
| --- | --- | --- |
| Create | "Create walkthroughs for this app", "Add walkthroughs for billing", "Write a walkthrough for inviting a teammate" | [creating-walkthroughs.md](references/creating-walkthroughs.md) |
| Guide | "Walk me through sending an invoice", "Guide me through sign-up", "Let me try the payment flow" | [guiding-walkthrough.md](references/guiding-walkthrough.md) |
| Update | "Update the walkthroughs for this change", "Split this walkthrough", "Rename the Team line" | [updating-walkthroughs.md](references/updating-walkthroughs.md) |

## Reference index

### Contract

[walkthrough-contract.md](references/walkthrough-contract.md) — root, layout, inputs, frontmatter, lines and branches, cutting, writing rules, sync, viewer, checklist.

| Doc | When to use |
| --- | --- |
| [walkthrough-contract.md](references/walkthrough-contract.md) | Every recipe |
| [creating-walkthroughs.md](references/creating-walkthroughs.md) | No walkthroughs yet, or new journeys to add |
| [guiding-walkthrough.md](references/guiding-walkthrough.md) | Walk the user through one walkthrough live in chat |
| [updating-walkthroughs.md](references/updating-walkthroughs.md) | The app changed, or the user asks to restructure walkthroughs |

## Templates

- [`assets/index.md`](assets/index.md) — root marker and app guide
- [`assets/walkthrough.md`](assets/walkthrough.md) — one walkthrough
- [`assets/app/`](assets/app/) — metro-map viewer, `npm run check`, and `npm run index`, copied whole on init
