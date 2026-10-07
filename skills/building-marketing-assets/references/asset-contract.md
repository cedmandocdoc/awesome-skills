# Asset Contract

## Overview

Shared rules for every `building-marketing-assets` recipe: what an asset is, where it lives, its living `asset.md`, its states, what the skill needs as input and where it finds it, the brand kit, and channel specs.

## Guidelines

### Author signature

Static UUID identifying files created by this skill:

```text
4815de07-f081-465f-af11-103e250718e3
```

Every `<assets-root>/index.md` and `asset.md` carries this value in frontmatter `author`.

### Output layout

```text
marketing/
  brand/                         # brand kit, beside the assets root
    brand.md                     # from ../assets/brand.md
    logo.svg  fonts/  photos/
  assets/                        # <assets-root>
    index.md                     # root marker + one row per asset
    capture/<host>/              # `npx hyperframes capture` of the live product, reused by every asset
    NN-slug/
      asset.md                   # living file: state, brief, picks, decisions
      style/                     # a.png b.png c.png: rendered style frames
      project/                   # HyperFrames project: index.html, compositions/, media/, audio/, beats/
      review/                    # contact sheets, round-NN.md critique logs
      out/                       # deliverables: <code>-<w>x<h>.mp4 | -NN.png, poster.png
```

Templates: [`../assets/index.md`](../assets/index.md), [`../assets/asset.md`](../assets/asset.md), [`../assets/brand.md`](../assets/brand.md).

- Asset id `NN-slug`: `NN` = highest existing + 1, two digits; slug lowercase, hyphens, ~30 chars.
- Asset `code` = `a` + `NN` (`a07`). It is the `utm_content` of every link that promotes this asset; it never changes.
- Recapture `capture/<host>/` when the user says the product changed or the capture is over 30 days old.

### Resolve assets root

Search the repository for `index.md` with frontmatter `doc_type: marketing-assets-index`, `generated_by: building-marketing-assets`, and `author` = **Author signature**.

| Matches | Action |
| --- | --- |
| One | Use it |
| Several | Ask which (list each `index.md` path) |
| None, on create | **Initialize assets root** |
| None, on continue | Stop and report that no assets root exists |

Resolve an asset by `@`-path, id (`03-launch-reel`), code (`a03`), or name words against `index.md` rows; several matches → ask.

### Initialize assets root

1. Target = user-named folder, else `marketing/assets/`.
2. Target missing or empty → create it. Not empty → ask for another path.
3. Write `index.md` from [`../assets/index.md`](../assets/index.md).

### asset.md

Frontmatter:

| Field | Value |
| --- | --- |
| `doc_type` | `marketing-asset` |
| `generated_by` | `building-marketing-assets` |
| `author` | **Author signature** |
| `id` / `code` | `NN-slug` / `aNN` |
| `name` | Human name (`Launch reel`) |
| `kind` | `video`, `carousel`, `image`, or `screenshots` |
| `channels` | Platforms it is posted to (`tiktok`, `instagram`, `linkedin`, …) |
| `formats` | Output sizes (`1080x1920`, `1080x1350`) from **Channel specs** |
| `campaign` | Campaign id when made for one (`03-clinics-mm`), else `none` |
| `state` | Per **States** |

Body sections, each filled by the step that owns it: **Brief** (with **Assumptions**), **Concepts**, **Style**, **Track**, **Storyboard**, **Deliverables**, **Decisions**. A step rewrites only its own section; **Decisions** collects every user pick and change request, one dated line each.

Mirror `id`, `name`, `kind`, `campaign`, `state` into the `index.md` row on every state change.

### States

`state` names the step whose options wait on the user.

| State | Waiting on | Next |
| --- | --- | --- |
| `concepts` | Pick a concept | `style` |
| `style` | Pick a style frame | `track` (video with music), else `storyboard` |
| `track` | Add a music file, or choose no music | `storyboard` |
| `storyboard` | Approve the storyboard contact sheet | `final` |
| `final` | Approve the renders | `done` |
| `done` | — | A change request reopens the earliest affected step |
| `dropped` | — | Never edited |

### Inputs

Minimum to run: **the product** (repo or live URL) and **the purpose** (a campaign brief, or one line like "launch video for TikTok"). Derive the rest in source order; record every derived or defaulted value under **Brief** → **Assumptions**.

| Input | Source, first found | Missing |
| --- | --- | --- |
| What it does, for whom | `positioning.md` beside the assets root → repo (README, landing copy, app strings) → live site | Required |
| Segment and their pain in their words | Campaign brief or `segments/<slug>.md` → app store reviews | General audience |
| Message, proof, CTA, link | Campaign brief | Proposed from positioning |
| Channel and format | Campaign roll-out → the purpose line | Best channel for the segment, proposed |
| Brand: logo, colors, fonts, voice | `brand/brand.md` → a `building-design` `design.md` → `capture/<host>/` design tokens | Starter look, proposed at the style step |
| Real product screens | `capture/<host>/` screenshots → repo screenshots | Ask for screenshots |
| References, music, things to avoid | User, optional | Own style directions; Pixabay search terms |

A campaign brief is the `campaign.md` the user or calling skill names; read its idea, segment, message, proof, conversion, channel, and links.

| The agent | Covers |
| --- | --- |
| Decides alone | Craft: easing, timing, layout, type scale, safe zones, export specs, self-critique |
| Proposes options | Concepts, style, track search terms, storyboard |
| Asks | Approvals, and the two minimum inputs when they cannot be found |

### Brand kit

`brand/` sits beside the assets root. `brand.md` holds colors (hex), display and UI fonts with files or Google Fonts names, logo files, voice rules, and banned words. When no source exists, write `brand.md` from the captured tokens with `source: derived` in its frontmatter; the style step shows it for confirmation and sets `source: confirmed`.

### Channel specs

| Channel | Kind | Size | Length | Notes |
| --- | --- | --- | --- | --- |
| TikTok, Instagram Reels, YouTube Shorts | video | 1080×1920 | 15–30 s | Safe zone: keep text out of the top 250 px, bottom 450 px, and right 160 px |
| Instagram, Facebook feed | image, carousel, video | 1080×1350 | ≤ 30 s; ≤ 10 slides | |
| LinkedIn feed | image, carousel, video | 1080×1350 or 1080×1080 | 15–45 s | |
| X | image, video | 1080×1080 or 1920×1080 | ≤ 45 s | |
| YouTube, landing page | video | 1920×1080 | 30–90 s | |
| App Store (iPhone 6.9") | screenshots | 1320×2868 | 3–10 shots | First 3 carry the message |
| Google Play (phone) | screenshots | 1080×1920 | 2–8 shots | |

Every video plays muted first: the message reads from on-screen text alone, and captions carry any spoken line.

## Related

- [managing-style.md](./managing-style.md) — style directions, look and motion rules, self-critique
- [managing-audio.md](./managing-audio.md) — music and sound effects
