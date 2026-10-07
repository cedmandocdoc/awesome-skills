# Creating Asset

## Overview

**Authoring mode.** Starts a new asset: derives its inputs, writes the brief, and proposes concepts for the user to pick. Stops at state `concepts`; [continuing-asset.md](./continuing-asset.md) runs every later step.

## Prerequisites

Per [asset-contract.md](./asset-contract.md) → **Resolve assets root**, **Output layout**, **asset.md**, **Inputs**, **Brand kit**, **Channel specs**.

## Guidelines

### 1. Resolve assets root

Per [asset-contract.md](./asset-contract.md) → **Resolve assets root**; initialize when none exists.

### 2. Gather inputs

Walk [asset-contract.md](./asset-contract.md) → **Inputs** top to bottom, reading each source in order and stopping at the first that answers.

- Live product: when `capture/<host>/` is missing or stale, run `npx hyperframes capture <url> -o <assets-root>/capture/<host> --json`. Read `dropped`, the warnings, and the contact sheets; a thin capture means falling back to repo screenshots.
- Brand: no `brand/brand.md` → write it from the capture's design tokens with `source: derived`.
- Ask once, in one message, only for the minimum inputs that no source answers.

### 3. Write the asset

Create `<assets-root>/NN-slug/` and `asset.md` from [`../assets/asset.md`](../assets/asset.md). Fill frontmatter (`kind`, `channels`, `formats` from the purpose when it fixes them, else after the concept pick) and **Brief**: product, audience and their pain, message, proof, CTA and link, channel. List every derived or defaulted value under **Assumptions**.

### 4. Propose concepts

Write 2–4 concepts under **Concepts**, labeled A–D, and mark one **Recommended**. When the purpose does not fix the kind, mix kinds (a video, a carousel, an image). Each concept states:

| Field | Content |
| --- | --- |
| Kind and format | `video 1080×1920, 20 s`, `carousel 1080×1350, 6 slides` |
| Hook | What the first 2 s or the first slide shows: the segment's pain in their words, or the payoff |
| Story | 3–5 beats, one line each |
| Proof | Which real screens, numbers, or quotes appear |
| Why it fits | The segment, channel, and message it serves |
| Effort | S, M, or L, with what drives it |

Every concept carries one message and follows [managing-style.md](./managing-style.md) → **Look rules**.

### 5. Set state

`state: concepts`; add the `index.md` row.

### 6. Confirm to the user

Reply with:

- Asset path and code
- The concepts as a short list (letter, one-line pitch, effort), the recommendation and why
- **Assumptions**, so the user can correct any
- The ask: pick a letter, combine ("A's hook with B's story"), or say "go" for the recommendation. Several picks become one asset each, sharing this brief.
