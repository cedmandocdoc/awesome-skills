# Promotion Contract

## Overview

Shared rules for every `building-promotion` recipe: the promotions root and its layouts, products and promotions, `product.md`, `promotion.md`, frame sizes and safe zones, honesty rules, disclosure, media and paid calls, the sound bank, secrets, and discovery of the dependency skills.

## Guidelines

### Author signature

Static UUID identifying files created by this skill:

```text
d5c5849b-3fed-4204-a7a1-d245dcf86d09
```

Every `<promotions-root>/index.md`, `product.md` and `promotion.md` carries this value in frontmatter `author`.

### Output layout

```text
<promotions-root>/                   # default: promotions/; one app per root
  .gitignore                         # from ../assets/promotions.gitignore
  index.md                           # root marker; intention: the app it promotes
  product.md                         # the app's Brief, Study, Message
  <NN-slug>/                         # one promotion; the folder is its HyperFrames project
```

Another app gets its own root, wherever the user puts it (`promotions/` in one repo per app by default; `promotions/<app>/` when a repo holds several), never inside another root.

A promotion folder:

```text
<NN-slug>/
  promotion.md                       # Spec, Message plan, Beat sheet, Music, Voice, Sound, Paid calls, Files
  index.html                         # root composition; holds <script id="grid"> (BPM, BEATS_PER_BAR, DROP_BAR, …)
  <name>.html                        # a further root composition: the ≤ 15 s cut, or a ratio that needs its own layout
  retime.mjs                         # copied from ../scripts/retime.mjs
  compositions/                      # the scenes, the app rebuilt from the source
    components/                      # pieces several scenes share (phone frame, app header)
  assets/
    music/<cut>.<ext>, music/CREDITS.md
    vo/<id>.mp3, vo/raw/             # placed lines; takes, alignments, lines.json
    sfx/, sfx/CREDITS.md
    fonts/, images/
  SPEC.md, REVIEW.md, hyperframes.json, package.json, meta.json, AGENTS.md, CLAUDE.md
  renders/, snapshots/               # ignored
```

- A promotion's HyperFrames project is source: every file it reads to render is committed. Only its outputs and caches stay out of git.
- A promotion keeps only what its video plays: the cut, not the full track. Full tracks and effect takes live in the **Sound bank**; voice takes stay in `assets/vo/raw/`.
- Files reused from another promotion (an end card, a cut, a take) are copied in.

Templates: [`../assets/index.md`](../assets/index.md), [`../assets/product.md`](../assets/product.md), [`../assets/promotion.md`](../assets/promotion.md).

### Products and promotions

| Unit | Is | Slug | New one when |
| --- | --- | --- | --- |
| Product | One app, studied from its source with one framing: one per root | The mockup folder's name; for a codebase, the app's name in kebab-case | A different app, in a new root |
| Promotion | One video: one audience, one message, one concept | `NN-slug`: `NN` = highest in the root + 1; slug names the concept and hook (`01-one-photo-payroll`) | A different audience, message, concept or hook |

Any part of a promotion changes whenever the user asks.

### Resolve promotions root

Search the repository for `index.md` with frontmatter `doc_type: promotions-index`, `generated_by: building-promotion`, and `author` = **Author signature**.

| Matches | Action |
| --- | --- |
| One | Use it |
| Several | Use the one whose `@`-path or `intention` matches the request; ask when unclear (list each `index.md` path) |
| None, on Study or Set up | `SKILL.md` → **Setup** creates one |
| None, other intents | Stop and report that no promotions root exists |

The root's `product.md` is its product. Resolve a promotion by `@`-path, `NN`, or the user's words against the root's `*/promotion.md`; several matches → ask. Read and write only under the resolved root.

A root built by 1.x (`layout: multi`, with `<app>/` folders): split it into one root per app first, each with its own `index.md` and `.gitignore`.

### product.md

| Section | Holds | Written by |
| --- | --- | --- |
| Frontmatter | `source` (the mockup folder or codebase path), `studied` (date) | Study |
| **Brief** | The inputs the user or a wrapper skill fills: Promote, Sold vs shown, Offer, CTA and destination, Objective, Placement, Length, Who it's for, Markets, Language and address, Trust and proof, Never say, Disclosure wording, Brand kit | Study |
| **Study** | What it does; audiences; features to show; alternatives; proof; structure inputs; context sources | Study |
| **Message** | Per audience: core line, anchor phrase, hooks | Study |

A re-study rewrites these sections; each promotion keeps the **Spec** and **Message plan** it was made from.

### promotion.md

| Section | Holds |
| --- | --- |
| **Spec** | Audience, structure, length (hard or suggested), concept, preset, signature device, energy, clock (`music` or `voice`), voice mode, ratios |
| **Message plan** | The seven jobs and the trust beat, in the audience's words, each with the block that owns it |
| **Beat sheet** | Per beat: slot (seconds, then `bar:beat` once the track is in), block, job, energy, voice line (gloss, syllables, planned seconds), its read (tags, stressed word), caption key phrase, the picture that proves it, the effect |
| **Music** | Title, uploader, page URL, labels, BPM, the grid (downbeat offset, `DROP_BAR`), the cut recipe |
| **Voice** | The casting line; the voice, model and settings, and why; per line, its takes and the pick |
| **Sound** | Per effect: slot, moment, file, source, licence |
| **Paid calls** | The approved cost table; each call, its size, and when it ran |
| **Files** | The renders and each crop's recipe; the cover still, the caption file, the music-and-effects stem |

### Frame sizes and safe zones

| Cut | Ratio and size | Length | Words that must be read sit in |
| --- | --- | --- | --- |
| Master | 9:16, 1080×1920 | The Spec's length | x 65–1015, y 270–1248: clear of Meta's paid Reels zones (top 14 %, bottom 35 %, sides 6 %) |
| Feed | 4:5 1080×1350, or 1:1 1080×1080 | 15–30 s | 6 % each side, 5 % top and bottom |
| Short cut | 9:16 | ≤ 15 s | As the master |
| TikTok | 9:16, 1080×1920 | 15–35 s | Its In-Feed safe-zone template; nothing under the right rail |

- A further ratio is a crop when every read word and control sits inside the crop; otherwise it gets its own root composition.
- These values are a snapshot of the platforms' guides; refresh them when a guide changes.

### Honesty rules

- Scenes rebuild the app from its source; the skill never runs it. They show only states, controls, strings and values the source defines, never an unreleased feature as available.
- Never a speed the app lacks. An AI or slow step shows its working state before its result, even when the beat grid compresses time.
- A mockup line that promises an outcome ("No missed orders on rush days.") is blurred or left out; plain feature rows stay.
- An AI output or transcript on screen is the source's own sample data.
- A simplified screen hides the rest of the real screen; it never writes new UI copy or recolours the product.
- Claims, numbers, customers and reviews come only from **Study** → **Proof**. A testimonial is a consenting customer's quote, with any material connection disclosed and its result typical or stated as not typical.
- No stock, illustrated or AI person uses or praises the product. A real member of the seller's team may speak to camera; an AI voice never claims to be a real person.
- The voice may say seller and offer facts the picture can't show: who builds it, what's free, what happens next. It never says a product fact the picture doesn't show, a sample UI number as a claim, or a speed, outcome or saving.
- Urgency and scarcity come only from a real date or limit.
- A named rival appears only with a reproducible benchmark in **Proof**, its test conditions shown, and the user's approval.
- A chat or notification is a generic UI inside a drawn phone, never a platform's own UI or sound.
- Everything in the Brief's **Never say** stays out of every line, caption, label and card.

### Disclosure

A mockup source, or a promotion where sold ≠ shown, carries:

| Where | What |
| --- | --- |
| Every frame that shows the app | A small "Sample" chip inside the app's own header |
| The app's first appearance | The Brief's disclosure line ("Sample app · built by <Seller>") for ≥ 2 s |
| Every AI result | "Illustrative" |
| End card | The disclosure line again |

Frames rebuilt from a codebase, where sold = shown, carry none.

### Media and paid calls

| Ingredient | Source |
| --- | --- |
| App screens | Rebuilt in the scenes from the source: a mockup's screen HTML and sample data, or a codebase's components and fixtures |
| Voice | ElevenLabs through text-to-speech; paid |
| Music | A Pixabay track the user picks and downloads while logged in, so the licence sits on their account; the agent never downloads it. Or none |
| Sound effects | Free libraries (Kenney and Freesound CC0, Pixabay sound effects, Freesound CC-BY with credit; never CC-BY-NC), the **Sound bank**, ElevenLabs sound effects through sound-effects (paid, optional), or none |
| Mixing | media-use: volume lanes, ducking, carve, loudness; never its music, effect or voice sourcing |
| Fonts | Files in `assets/fonts/` with their licences; never a system font |
| Registry blocks | hyperframes-registry; check each block's own licence |

- Never HeyGen services (catalog music, TTS, avatars, image search): free-plan output is for personal, non-commercial use (https://www.heygen.com/terms).
- Before any paid call, show a cost table (what, model, text or prompt, size, credits: TTS about 1 a character, effects about 200 a generation; https://elevenlabs.io/pricing) and wait for the user's go. Its approval covers every call it lists; a call outside it gets its own table. Never retry a paid call without asking.
- Set `model_id` on every ElevenLabs call; the endpoints default to older models.
- A 402 (`insufficient_credits`) → keep what arrived, stop, and report.

### Sound bank

Every downloaded track and every effect take, kept for every repository on this machine and never committed:

```text
~/.awesome-skills/building-promotion/media/
  sfx/<kind>_<material>_<sha8>.<ext>, .json        # one take; <sha8> = first 8 hex of its SHA-256
  music/<uploader>_<title-slug>_<sha8>.<ext>, .json  # one full track the user downloaded
```

| Sidecar | Fields |
| --- | --- |
| Effect | `kind` (`tap`, `tick`, `pop`, `ping`, `notify`, `stamp`, `foley`, `processing`); `material` and `persp` (`CU` close or `DST` distant); `source` (library and page URL, or the ElevenLabs request); `licence`; `analysis` from `npx hyperframes audio <file> --json` (onset, `moments.peak`, tail end, LUFS, true peak); `made_for` |
| Track | `title`, `uploader`, `page_url`, `labels` as read on the track page (Content ID Registered, AI generated); `licence` (the certificate's path); `bpm`; `downbeat_offset` verified at the drop; `sections` (intro, lift, drop, ending, in seconds); `cuts` (promotion and recipe) |

- **Intake:** each file goes in as it arrives, with its sidecar. Nothing in the bank is edited; a take the user calls flawed is deleted.
- **Into a promotion:** an effect is copied under its bank name into `assets/sfx/`; a track is cut into `assets/music/`. Each folder's `CREDITS.md` gets one row per file: file, source, licence, URL.

### Secrets

Secrets live in the main worktree's `.env`, so every worktree reads one file:

```bash
env="$(dirname "$(git rev-parse --path-format=absolute --git-common-dir)")/.env"
```

- Never open or print it, and never take a key pasted in chat.
- Load it (`set -a; . "$env"; set +a`) before following an ElevenLabs skill; never run their `onboard init`.

### Discover dependency skill

Locate `hyperframes`, `hyperframes-registry`, `media-use`, `text-to-speech`, `setup-api-key` and `sound-effects` (third-party; match by `name`):

1. Explicit pointers — `AGENTS.md`, the user request, `@`-mentioned skills.
2. Project roots — glob `<root>/<skill-name>/SKILL.md` (`.agents/skills/`, `.cursor/skills/`, `.claude/skills/`, `.codex/skills/`, `.github/skills/`, and the other agent skill directories).
3. User-level roots — same layout under `~/` (for example `~/.cursor/skills/`, `~/.agents/skills/`). Prefer a project copy over a user copy of the same `name`.
4. Custom roots named in `AGENTS.md` or by the user.
5. Read each candidate `SKILL.md` frontmatter; accept a unique `name`.

Found → open its `SKILL.md` and follow it by intent.
