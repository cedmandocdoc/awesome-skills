# Creating Mockup

## Overview

**Authoring mode.** Writes or amends the root's one app mockup: `design.md`, `flow.md`, and the hero flow's screens. Input: any app description, such as a proposal with its core features and hero flow.

## Prerequisites

Per [mockup-contract.md](./mockup-contract.md) → **Resolve mockup root**, **Output layout**, **Screen rules**, **flow.md**, **design.md**.

## Guidelines

### 1. Resolve the app

Per [mockup-contract.md](./mockup-contract.md) → **Resolve mockup root**. A new app in a root that already holds one → ask for its own root (`SKILL.md` → **Setup**, Root path and intention), never inside this one. An amend runs only the steps it touches (a new look → 3, 6; a new step → 4, 6; a busier screen → 6), then 7–8; ids that `flow.md` names stay unchanged.

### 2. Pick the hero flow

From the input, the one flow that does the app's main job for its audience, in 3–6 steps from entry to the done state (calendar → form → booked). The input names a flow → use it. Otherwise propose the flow in one line per step and wait for the user's confirmation.

### 3. Set the visual language

| Found | Do |
| --- | --- |
| A `design.md` in the root, or one the user points to | Follow it; copy one from elsewhere into the root |
| None | Propose in one message: brand color, type pairing, density, voice (formal or warm, the audience's language); the user confirms or changes; write `design.md` from [`../assets/design.md`](../assets/design.md) |

Fit the audience: a clinic reads calm and trustworthy, a salon warm and stylish, a shop quick and dense.

### 4. Write flow.md

From [`../assets/flow.md`](../assets/flow.md), one row per step per [mockup-contract.md](./mockup-contract.md) → **flow.md**.

### 5. Design for the screenshot

Each screen reads in under 2 seconds in a promo video:

- One primary action per screen in the brand color, a large tap target.
- A clear hierarchy: one heading, the content, the action.
- The done state is the hero moment: a check, the booked slot, a total, in the largest type on screen.
- Real-looking density: a calendar with booked and free slots, a list with 4–6 entries, not one lonely item.

### 6. Write the screens

Copy the `design.md` font files into `fonts/` and the photos and logos into `images/`. Then, from [`../assets/screen.html`](../assets/screen.html), write one file per step per [mockup-contract.md](./mockup-contract.md) → **Screen rules**.

### 7. Check

With Playwright: `npx -y playwright screenshot --viewport-size=390,844 <screen> <tmp>/<NN>.png` per screen, then look at each image. Without it, ask the user to open each screen at 390×844. Fix overflow, unreadable text, a missing badge, and every `flow.md` target id missing from its screen.

### 8. Confirm to the user

Update `index.md`'s `app`, `intention` and `screens`. Reply with:

- The root path and the `flow.md` steps in one line each
- The visual language in one line (color, type, density, voice)
- What was assumed and what the user should check
