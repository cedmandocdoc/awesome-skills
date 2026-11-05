# Marketing Contract

## Overview

Shared rules for every `building-marketing` recipe: the marketing root and its layout, items and promotions, `plan.md`, statuses, platform rules, honesty rules, media and paid calls, and discovery of the dependency skills.

## Guidelines

### Author signature

Static UUID identifying files created by this skill:

```text
ce69e630-08ef-4e0c-8e05-32a1c405546b
```

Every `<marketing-root>/index.md` and `plan.md` carries this value in frontmatter `author`.

### Output layout

```text
<marketing-root>/                    # default: marketing/
  index.md                           # root marker + one row per item; buffer_channels, media_url
  sender/                            # Buffer sender from ../assets/sender/, for Run marketing
  <slug>/                            # one item
    plan.md                          # the item's whole state
    promotions/<NN-slug>/            # one promotion
      voiceover.mp3                  # ElevenLabs output, shared by every ratio
      music.<ext>                    # the track the user downloaded
      <ratio>/                       # one HyperFrames project per aspect ratio: 9x16, 4x5, 1x1, 16x9
        renders/<NN-slug>-<ratio>.mp4
      stills/<NN-slug>-<n>.png       # static ad and carousel frames
      captions/<channel>.txt         # post copy per channel, organic and manual
      ad-spec.md                     # the Meta ad spec, when the promotion runs as an ad
```

Templates: [`../assets/index.md`](../assets/index.md), [`../assets/plan.md`](../assets/plan.md).

### Items and promotions

| Unit | Is | New one when |
| --- | --- | --- |
| Item | One reference studied with one framing; slug from the reference (`dentist-clinic`) | The reference, the audience, or the framing differs: a salon mockup is a new item |
| Promotion | One asset idea: a format, a hook, a length, its ratios; id `NN-slug`, `NN` = highest in the item + 1, slug names format and hook (`01-walkthrough-notebook`) | A different format, hook, or audience within the item; a change to a promotion already posted |


### Resolve marketing root

Search the repository for `index.md` with frontmatter `doc_type: marketing-index`, `generated_by: building-marketing`, and `author` = **Author signature**.

| Matches | Action |
| --- | --- |
| One | Use it |
| Several | Ask which (list each `index.md` path) |
| None, on Study or Set up | `SKILL.md` → **Setup** creates one |
| None, other intents | Stop and report that no marketing root exists |

Resolve an item by `@`-path, slug, or the user's words against `index.md` rows; several matches → ask. Mirror slug, reference, promotion count, and `studied` into the item's `index.md` row on every change.

### plan.md

| Section | Holds | Written by |
| --- | --- | --- |
| Frontmatter | `reference` (path or URL), `studied` (date) | Study |
| **Brief** | The user's framing: what to promote, offer, CTA and its destination, markets, language, budget, kill rule, trust rules | Study |
| **Study** | What it does; audiences; features to show; alternatives and differentiator; proof | Study |
| **Message** | One core message per audience; hooks | Study |
| **Promotions** | `### <NN-slug>` per promotion: spec, script, scenes, voice, music brief, sound, paid calls, status, files | Make promotion |
| **Reach** | One row per post or ad: promotion, channel, how, when, status, copy file, media URL, Buffer id, numbers | Run marketing |
| **Next** | The next move and why | Run marketing |

`plan.md` and the files on disk are the only record; nothing else logs what went out.

### Statuses

| Thing | Status flow |
| --- | --- |
| Promotion | `planned` → `approved` → `rendered`; a change before it is posted returns it to `planned` |
| Organic post | `planned` → `approved` → `queued` (Buffer id) → `sent`; a Buffer error → back to `approved` with the error |
| Ad | `planned` → `approved` → `live` (the user reports it entered) → `stopped` |
| Manual post | `planned` → `approved` → `sent` (the user reports it) |

A promotion is **posted** once one of its **Reach** rows is `queued`, `live`, or `sent`.

### Platform rules

| Placement | Ratio and size | Length | Notes |
| --- | --- | --- | --- |
| Facebook / Instagram Reels, Stories | 9:16, 1080×1920 | 15–60 s | Keep text and key UI out of the top 14% and bottom 35% |
| Facebook / Instagram feed | 4:5 1080×1350, or 1:1 1080×1080 | 15–30 s | Carousel: 2–10 square frames |
| TikTok | 9:16, 1080×1920 | 15–35 s | Same safe zones as Reels |
| YouTube Shorts | 9:16, 1080×1920 | ≤ 60 s | — |
| LinkedIn feed | 1:1 or 4:5 | 15–30 s | — |

Every video and its post:

- The hook lands in the first 2 s, on screen and in the voiceover.
- Captions are burned in.
- The offer and CTA hold on screen for the last 3 s.
- A caption's first line repeats the hook; the CTA matches the destination (Click-to-Messenger → "Send message").

### Honesty rules

- Screens from a mockup or sample carry a "Sample app" label in every frame that shows them; the **Brief** may extend it (`Sample app by Likhara Studio`).
- Claims, numbers, customers, and reviews come only from **Study** → **Proof**; nothing is invented.

### Media and paid calls

| Ingredient | Source |
| --- | --- |
| App screens, mockup | Each flow step's HTML screen (for example from `flow.md`) as a HyperFrames scene |
| App screens, real app | `npx hyperframes capture <url>`, or recordings and screenshots the user provides (capture can't sign in or open a mobile app) |
| Voiceover | ElevenLabs through text-to-speech; paid |
| Music | A Pixabay track the user downloads, from the promotion's music brief; or the user's own |
| Sound effects | media-use's bundled offline set (`--local-only`) |
| ElevenLabs music or sound effects | Only when the promotion names them; paid |
| Registry blocks | Check the block's own licence before using it in an ad |

- Never HeyGen services (catalog music, TTS, avatars, image search): free-plan output is for personal, non-commercial use (https://www.heygen.com/terms).
- Every paid call is listed in the promotion's **Paid calls** with its size (ElevenLabs: characters of voiceover) before approval; one not listed waits for a new approval.
- Secrets live in the repository's `.env`; never open or print it, and never take a key pasted in chat.

### Discover dependency skill

Locate `hyperframes`, `media-use`, `text-to-speech`, `setup-api-key`, and, when a promotion names them, `music` and `sound-effects` (third-party; match by `name`):

1. Explicit pointers — `AGENTS.md`, the user request, `@`-mentioned skills.
2. Project roots — glob `<root>/<skill-name>/SKILL.md` (`.agents/skills/`, `.cursor/skills/`, `.claude/skills/`, `.codex/skills/`, `.github/skills/`, and the other agent skill directories).
3. User-level roots — same layout under `~/` (for example `~/.cursor/skills/`, `~/.agents/skills/`). Prefer a project copy over a user copy of the same `name`.
4. Custom roots named in `AGENTS.md` or by the user.
5. Read each candidate `SKILL.md` frontmatter; accept a unique `name`.

Found → open its `SKILL.md` and follow it by intent.
