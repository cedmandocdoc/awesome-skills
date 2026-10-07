---
name: building-marketing-assets
id: 74d80a4e-2346-43f7-b06a-43febe401281
description: >-
  Directs and renders marketing images and videos for a digital product —
  carousels, single images, store screenshots, and short videos built from the
  product's real screens with HyperFrames — as a creative director that proposes
  concepts, rendered style frames, music search terms, and storyboards for the
  user to pick from, and critiques its own frames before showing them. Use only
  when the user names this skill (`/building-marketing-assets`,
  `$building-marketing-assets`, or "building-marketing-assets"), or references a
  file under a marked assets root (`@marketing/assets/03-launch-reel/asset.md`).
version: 1.0.0
---

# Building Marketing Assets

## Overview

One folder per asset under a marketing assets root. The skill derives what it can from the product (positioning, brand, real screens), then walks the user through five picks — concepts → style → track → storyboard → final — each a set of explained options the user can pick, change, or skip. Compositions are HTML rendered by HyperFrames; images are frames of the same compositions. Taste comes from the process: named style directions, banned looks, a beat grid, and a scored self-critique of rendered frames before anything reaches the user.

## Dependencies

Resolve every **required** row before opening a recipe.

| Item | Required | When | How |
| --- | --- | --- | --- |
| Node.js 22+ | required | All recipes | https://nodejs.org |
| FFmpeg | required | All recipes | `brew install ffmpeg`, or https://ffmpeg.org/download.html |
| [HyperFrames skills](https://github.com/heygen-com/hyperframes) | required | Building compositions | `npx skills add heygen-com/hyperframes` |
| Freesound API token | optional | Sound effects | Free account, then https://freesound.org/apiv2/apply; store as `FREESOUND_TOKEN` in `.env` |

## Agent workflow

Follow this skill when the user names it, or references a file under an assets root marked by an `index.md` with this skill's author signature. Works wherever the agent can read and write repository files and run Node and FFmpeg. Resolve every **required** **Dependencies** row, read [asset-contract.md](references/asset-contract.md), then match one **Recipes** row and open exactly that reference.

### Recipes

| Intent | Example phrasing | Read |
| --- | --- | --- |
| Create | "Make a launch video for TikTok", "carousel for campaign 02", "store screenshots" | [creating-asset.md](references/creating-asset.md) |
| Continue or change | "Continue asset 03", "go with concept B", "here's the track", "slower scene 2", "add a 1:1 version" | [continuing-asset.md](references/continuing-asset.md) |

## Reference index

### Contract

[asset-contract.md](references/asset-contract.md) — signature, layout, roots, `asset.md`, states, inputs, brand kit, channel specs.

| Doc | When to use |
| --- | --- |
| [asset-contract.md](references/asset-contract.md) | Shared rules every recipe cites |
| [creating-asset.md](references/creating-asset.md) | Derive inputs, write the brief, propose concepts |
| [continuing-asset.md](references/continuing-asset.md) | Run the next step for the user's pick; apply change requests |
| [managing-style.md](references/managing-style.md) | Style directions, look and motion rules, self-critique |
| [managing-audio.md](references/managing-audio.md) | Track search terms and intake, beats, sound effects, mix |

## Templates

- [`assets/index.md`](assets/index.md) — assets root marker
- [`assets/asset.md`](assets/asset.md) — living asset file
- [`assets/brand.md`](assets/brand.md) — brand kit
