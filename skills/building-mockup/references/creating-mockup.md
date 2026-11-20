# Creating Mockup

## Overview

**Authoring mode.** Writes or amends the root's one mockup, of an app or a website in the root's form: `design.md`, `flow.md`, and the hero flow's screens. Input: any app or website description, such as a proposal with its core features and hero flow.

## Prerequisites

Per [mockup-contract.md](./mockup-contract.md) → **Forms**, **Resolve mockup root**, **Output layout**, **Screen rules**, **flow.md**, **design.md**.

## Guidelines

### 1. Resolve the app

Per [mockup-contract.md](./mockup-contract.md) → **Resolve mockup root**; its form is the root's `form`. A new app or website in a root that already holds one → ask for its own root (`SKILL.md` → **Setup**, Root path and intention), never inside this one. Another form of the same product is another root. An amend runs only the steps it touches (a new look → 3, 6; a new step → 4, 6; a busier screen → 6), then 7–8; ids that `flow.md` names stay unchanged.

### 2. Pick the hero flow

From the input, the one flow that does the main job for its audience, from entry to the done state, in the form's steps ([mockup-contract.md](./mockup-contract.md) → **Forms**):

| Form | Flow |
| --- | --- |
| `phone`, `desktop` | The app's main job in 3–6 screens (calendar → form → booked) |
| `website` | The visitor's path to the site's one job: the home page, then the job's pages (home → booking form → booked) |

The input names a flow → use it. Otherwise propose the flow in one line per step, and for a website the home page's sections in one line each, and wait for the user's confirmation.

### 3. Set the visual language

| Found | Do |
| --- | --- |
| A `design.md` in the root, or one the user points to | Follow it; copy one from elsewhere into the root |
| None | Propose in one message: brand color, type pairing, density, voice (formal or warm, the audience's language); the user confirms or changes; write `design.md` from [`../assets/design.md`](../assets/design.md) |

Fit the audience: a clinic reads calm and trustworthy, a salon warm and stylish, a shop quick and dense; a website leads with the trade's own photos and a display headline.

### 4. Write flow.md

From [`../assets/flow.md`](../assets/flow.md), one row per step per [mockup-contract.md](./mockup-contract.md) → **flow.md**.

### 5. Design for the screenshot

Each screen, and each viewport-sized view of a website page, reads in under 2 seconds in a promo video:

- One primary action per screen in the brand color, a large target.
- A clear hierarchy: one heading, the content, the action.
- The done state is the hero moment: a check, the booked slot, a total, in the largest type on screen.
- Real-looking density: a calendar with booked and free slots, a list with 4–6 entries, not one lonely item; on desktop, a table with 8–12 rows beside its navigation.

A website's home page answers the questions a visitor asks before acting, one section each, in the order they ask:

| Section | Answers |
| --- | --- |
| Hero | What this is, for whom, and the job's action, over the trade's best photo |
| Offer | What it costs: packages or services with their prices |
| Proof | Does it work: a gallery or before-and-after, and reviews from sample customers |
| How it works | What happens after the action, in 3–4 steps |
| Visit | Where and when: hours, area, a static map, how to reach them |
| Action | The job's action again, with what the visitor needs ready |

Drop a section the trade's buyers don't ask about, and add one they do (a FAQ, the team). Each section reads alone as a 1440×900 or 390×844 view: a heading that names it, then its content.

### 6. Write the screens

Copy the `design.md` font files with their licence files into `fonts/`, and the photos and logos into `images/`, with a `credits.md` row for each photo not made in the root. Then, from the form's template ([mockup-contract.md](./mockup-contract.md) → **Forms**), write one file per step per [mockup-contract.md](./mockup-contract.md) → **Screen rules**.

### 7. Check

With Playwright, screenshot each screen and look at each image:

| Form | Command per screen |
| --- | --- |
| `phone` | `npx -y playwright screenshot --viewport-size=390,844 <screen> <tmp>/<NN>.png` |
| `desktop` | `npx -y playwright screenshot --viewport-size=1440,900 <screen> <tmp>/<NN>.png` |
| `website` | `npx -y playwright screenshot --full-page --viewport-size=1440,900 <screen> <tmp>/<NN>-desktop.png`, and again with `--viewport-size=390,844` to `<tmp>/<NN>-phone.png` |

Without Playwright, ask the user to open each screen at the form's sizes. Fix overflow, a horizontal scroll at 390, unreadable text, a missing badge, and every `flow.md` target id missing from its screen.

### 8. Confirm to the user

Update `index.md`'s `app`, `form`, `intention` and `screens`. Reply with:

- The root path, its form, and the `flow.md` steps in one line each
- The visual language in one line (color, type, density, voice)
- What was assumed and what the user should check
