# Marketing Contract

## Overview

Shared rules for every `building-marketing` recipe: the marketing root and its layout, products and campaigns, `product.md`, `campaign.md`, where a campaign stands, platform rules, honesty rules, media and paid calls, the sound bank, secrets, and discovery of the dependency skills.

## Guidelines

### Author signature

Static UUID identifying files created by this skill:

```text
ce69e630-08ef-4e0c-8e05-32a1c405546b
```

Every `<marketing-root>/index.md`, `product.md` and `campaign.md` carries this value in frontmatter `author`.

### Output layout

```text
<marketing-root>/                      # default: marketing/
  .gitignore                           # from ../assets/marketing.gitignore
  index.md                             # root marker; buffer_channels, media_url
  .concepts/<product>/                 # ignored; one scratch HyperFrames project per product
    compositions/<round>-<n>.html      # one concept's hook
    snapshots/                         # hook stills
    renders/                           # silent concept previews, on request
  <product>/
    product.md                         # Brief, Study, Message
    <NN-slug>/                         # one campaign; the folder is its HyperFrames project
      campaign.md                      # Spec, Script, Scenes, Voice, Music, Sound, Paid calls, Files, Reach
      index.html                       # root composition
      <name>.html                      # a further root composition: the ≤ 15 s cut, or a ratio that needs its own layout
      compositions/                    # the scenes, with the app pieces each shows rebuilt from the source
        components/                    # pieces several scenes share (phone frame, app header); the components path in hyperframes.json
      assets/                          # media files only
        music.<ext>                    # the cut the video plays
        vo/<id>.mp3, vo/words.json     # placed lines and their word times
        vo/raw/                        # takes, alignment JSON, lines.json
        sfx/                           # effects + CREDITS.md
        fonts/                         # every font the video uses, with its licence
        images/                        # the app's logos, icons, photos
      SPEC.md, REVIEW.md, hyperframes.json, package.json, meta.json, AGENTS.md, CLAUDE.md, a build script
      renders/                         # ignored; drafts, finals, crops
      snapshots/                       # ignored; stills
```

- A campaign's HyperFrames project is source: every file it reads to render is committed. Only its outputs (`renders/`, `snapshots/`) and caches stay out of git.
- A campaign keeps only what its video plays (the cut bed, not the full track); full generations live in the **Sound bank**.
- Files reused from another campaign (a series' music, end card, lines) are copied in; git stores identical bytes once.

Templates: [`../assets/index.md`](../assets/index.md), [`../assets/product.md`](../assets/product.md), [`../assets/campaign.md`](../assets/campaign.md).

### Products and campaigns

| Unit | Is | Slug | New one when |
| --- | --- | --- | --- |
| Product | One app, studied from its source with one framing | The mockup folder's name; for a codebase, the app's name in kebab-case from the repo or package name | A different app |
| Campaign | One video: one audience, one feature shown as one task, one concept | `NN-slug`: `NN` = highest in the product + 1; slug names the concept and hook (`01-walkthrough-one-photo`) | A different audience, feature, concept or hook; a change to a posted campaign |

### Resolve marketing root

Search the repository for `index.md` with frontmatter `doc_type: marketing-index`, `generated_by: building-marketing`, and `author` = **Author signature**.

| Matches | Action |
| --- | --- |
| One | Use it |
| Several | Ask which (list each `index.md` path) |
| None, on Study or Set up | `SKILL.md` → **Setup** creates one |
| None, other intents | Stop and report that no marketing root exists |

Resolve a product by `@`-path, slug, or the user's words against `<marketing-root>/*/product.md`; a campaign by `@`-path, id, or the user's words against its product's `*/campaign.md`. Several matches → ask.

### product.md

| Section | Holds | Written by |
| --- | --- | --- |
| Frontmatter | `source` (the mockup folder or codebase path), `studied` (date) | Study |
| **Brief** | What is promoted and how it's framed (sold vs shown), offer, CTA and its destination, markets, language, trust rules | Study |
| **Study** | What it does; audiences; features to show; alternatives and differentiator; proof | Study |
| **Message** | Per audience: core line, anchor phrase, hooks | Study |

Re-study rewrites these sections; each campaign keeps the **Spec** it was made from.

### campaign.md

| Section | Holds | Written by |
| --- | --- | --- |
| **Spec** | Placements, ratios, length, source class, audience and its multipliers, feature, concept, pattern, tone row, clock, core line, anchor phrase, sold vs shown, label, offer and CTA | Make campaign |
| **Script** | Lines with anchors, slots, `[quiet N]` gaps and claim tags; each line's label and caption | Make campaign |
| **Scenes** | One entry per moment, with the fields in [directing-promo-video.md](./directing-promo-video.md) → **HyperFrames brief** | Make campaign |
| **Voice** | The casting record: voice id, model, settings, reason | Make campaign |
| **Music** | The source; the composition plan and seed, or the bank file and its cut; the hit list; the role map | Make campaign |
| **Sound** | The source; the named-change list, each with its file | Make campaign |
| **Paid calls** | The approved spend estimate; each call and its size; what ran, when | Make campaign |
| **Files** | The final renders, and the crop recipe of each cropped ratio | Make campaign |
| **Reach** | One row per post: channel, how (`buffer`, `manual`), when, media URL, Buffer id | Post |

### Where a campaign stands

Read from tracked files only:

| Tracked | Stands at |
| --- | --- |
| `campaign.md` | Planned |
| Scenes in `compositions/` | Built |
| `assets/vo/words.json` | Voiced |
| Every **Sound** row names its file, and **Music** names `assets/music.<ext>` or none | Scored |
| **Files** lists a final | Final made |
| A **Reach** row | Posted; written once the post is queued in Buffer or handed to the user |

Drafts are local and re-rendered free. A posted campaign is never edited; a change makes a new campaign from it.

### Platform rules

| Placement | Ratio and size | Length | Unsafe zones |
| --- | --- | --- | --- |
| Facebook / Instagram Reels, Stories | 9:16, 1080×1920 | 15–60 s | Top 14%, bottom 35%, 6% each side |
| Facebook / Instagram feed | 4:5 1080×1350, or 1:1 1080×1080 | 15–30 s | 6% each side, 5% top and bottom |
| TikTok | 9:16, 1080×1920 | 15–35 s | Its In-Feed safe-zone file; nothing under the right rail |
| YouTube Shorts | 9:16, 1080×1920 | ≤ 60 s | As Reels |
| LinkedIn feed | 1:1 or 4:5 | 15–30 s | As the feed |

- A further ratio is a crop of the render when every label, caption and control sits inside the crop; otherwise it gets its own root composition in the same project (`npx hyperframes render --composition <file>`).
- A post's caption opens with the hook; its CTA matches the destination.

### Honesty rules

- Scenes rebuild the app from its source; the skill never runs it. They show only states, controls, strings and values the source defines, never an unreleased feature as available, and never a speed the app lacks: a slow step shows its working state, then a time cut.
- Mockup frames carry a "Sample app" label in every frame that shows them, and so does every product frame when sold ≠ shown; the **Brief** may extend it (`Sample app by Likhara Studio`). Frames rebuilt from a codebase carry none.
- When sold ≠ shown, the voice also says the relationship by 6.5 s.
- An AI output or transcript on screen is the source's own sample data, labelled "Illustrative".
- A simplified screen hides the rest of the real screen; it never writes new UI copy or recolours the product.
- Claims, numbers, customers and reviews come only from **Study** → **Proof**. A testimonial is a consenting customer's quote, with any material connection disclosed and its result typical or stated as not typical.
- No stock, illustrated or AI person uses or praises the product.
- A named rival appears only with a reproducible benchmark in **Proof**, its test conditions shown, and the user's approval.

### Media and paid calls

| Ingredient | Source |
| --- | --- |
| App screens | Rebuilt in the scenes from the source: a mockup's screen HTML and sample data, or a codebase's components and fixtures |
| Voiceover | ElevenLabs through text-to-speech; paid |
| Music | A **Sound bank** bed, logo or sting (free), ElevenLabs music through the music skill (paid), or none |
| Sound effects | **Sound bank** takes (free), ElevenLabs sound effects through the sound-effects skill (paid), or none |
| Mixing | media-use: volume lanes, ducking, carve, per-element loudness; never its music, effect or voice sourcing |
| Fonts | Files in `assets/fonts/` with their licences; never a system font |
| Registry blocks | Check the block's own licence before using it |

- Never HeyGen services (catalog music, TTS, avatars, image search): free-plan output is for personal, non-commercial use (https://www.heygen.com/terms).
- **Paid calls** opens with a rough spend estimate: voiceover characters, music seconds and effect generations, each in credits (TTS about 1 a character, music 900 a minute, effects 200 a generation; https://elevenlabs.io/pricing). Its approval covers every call it lists. A later call outside it (a changed line, a recompose, the cut's own compose) gets its own estimate first.
- Set `model_id` on every ElevenLabs call; the endpoints default to older models.
- A 402 (`insufficient_credits`) → keep what arrived, stop, and report; a resume makes only what's missing.

### Sound bank

Every paid music and effect generation, kept for every repository on this machine and never committed:

```text
~/.awesome-skills/building-marketing/media/
  sfx/<kind>_<material>_<sha8>.mp3          # one take; <sha8> = first 8 hex of its SHA-256
  sfx/<kind>_<material>_<sha8>.json         # its sidecar
  music/<kind>_<tone>_<sha8>.mp3, .json     # a full composition, logo or sting
```

| Sidecar field | Holds |
| --- | --- |
| `kind` | Effects: `tap`, `result`, `whoosh`, `riser-hit`, `foley`, `ambience`, `keys`. Music: `bed`, `logo`, `sting` |
| `material`, `persp` | Effects: the prompt's object and action (`fingertip-on-glass`); `CU` close or `DST` distant |
| `tone` | The tone row it was made for |
| `seller` | Logos and stings: whose mark it lands on |
| `request` | The body as sent: model, prompt or composition plan, `duration_seconds`, `loop`, `prompt_influence`, `seed` |
| `analysis` | From `npx hyperframes audio <file> --json`: onset, `moments.peak`, tail end, LUFS, true peak; music adds bpm and the plan's section times |
| `licence` | Plan, date made, terms URL |
| `made_for` | The campaign that paid for it |

- **Intake:** each generation goes in as it arrives, picked or not, with its sidecar. Nothing in the bank is edited; a take the user calls flawed is deleted.
- **Effect match**, per named change: the same `kind` and `persp`; an audible length (tail end − onset) close to the change's, a whoosh's peak on its cut, a riser's on the mark with no line over it; true peak ≤ −1 dBTP after its gain; made on Starter or higher; a material and tone that fit the world.
- **Takes:** a set short of the takes [directing-promo-video.md](./directing-promo-video.md) → **Sound effects** asks for gets only its missing ones, made from its `request` and heard beside the set before they're placed; effects take no seed, so they may differ.
- **Music match:** a bed of the same tone that **Re-cut** fits ([directing-promo-video.md](./directing-promo-video.md) → **Music**), or a logo or sting for the same `seller`'s mark; anything else is composed.
- **Into a campaign:** an effect is copied under its bank name into `assets/sfx/`; a bed is cut into `assets/music.<ext>`. `assets/sfx/CREDITS.md` gets one row per file: file, model, plan, date, terms URL, prompt. A reuse is a size-0 **Paid calls** row.
- Voice takes stay in the campaign (`assets/vo/raw/`), never in the bank.

### Secrets

Secrets live in the main worktree's `.env`, so every worktree reads one file:

```bash
env="$(dirname "$(git rev-parse --path-format=absolute --git-common-dir)")/.env"
```

- Never open or print it, and never take a key pasted in chat.
- Load it (`set -a; . "$env"; set +a`) before following an ElevenLabs skill; never run their `onboard init`.

### Discover dependency skill

Locate `hyperframes`, `media-use`, `text-to-speech`, `setup-api-key`, `music` and `sound-effects` (third-party; match by `name`):

1. Explicit pointers — `AGENTS.md`, the user request, `@`-mentioned skills.
2. Project roots — glob `<root>/<skill-name>/SKILL.md` (`.agents/skills/`, `.cursor/skills/`, `.claude/skills/`, `.codex/skills/`, `.github/skills/`, and the other agent skill directories).
3. User-level roots — same layout under `~/` (for example `~/.cursor/skills/`, `~/.agents/skills/`). Prefer a project copy over a user copy of the same `name`.
4. Custom roots named in `AGENTS.md` or by the user.
5. Read each candidate `SKILL.md` frontmatter; accept a unique `name`.

Found → open its `SKILL.md` and follow it by intent.
