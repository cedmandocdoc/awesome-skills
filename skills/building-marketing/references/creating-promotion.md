# Creating Promotion

## Overview

**Execution mode.** Takes an item from concepts to a finished promotion: proposes concepts the user steers until one fits, plans the chosen one, previews it as a free silent draft when the user wants one, then makes the final with ElevenLabs voiceover and hands it to posting. Continues a promotion from wherever it stands.

## Prerequisites

Per [marketing-contract.md](./marketing-contract.md) → **Output layout**, **Items and promotions**, **plan.md**, **Where a promotion stands**, **Platform rules**, **Honesty rules**, **Media and paid calls**, **Discover dependency skill**.

## Guidelines

### 1. Resolve the item

Per [marketing-contract.md](./marketing-contract.md) → **Resolve marketing root**. No item or no **Study** yet → run [studying-reference.md](./studying-reference.md) first, then continue here.

| Request | Step |
| --- | --- |
| A new promotion, or more variants | 2 |
| Continue a promotion | The step after where it stands per [marketing-contract.md](./marketing-contract.md) → **Where a promotion stands** |
| Change a draft | 5 |
| "Go final" | 6 |
| Change a posted promotion | 3, with a new promotion copied from it |

### 2. Propose concepts

Propose 3 concepts from **Study** and **Message**, each a card:

- Format (below), audience, hook line
- Storyline in 4–6 beats, and the screens or footage it shows
- Music mood

| Format | Flow | Fits |
| --- | --- | --- |
| Demo walkthrough | hook → pain → app on a phone doing the job → offer → CTA | One clear feature that answers the pain |
| Problem → solution | the messy way (notebook, chat) → the same task in the app → result | An audience still on a manual workaround |
| Founder overlay | founder talking + app screens alongside → trust line → CTA | Trust matters more than features; needs the founder's footage |
| Static ad / carousel | hook frame → 2–3 screen frames → offer frame | Feed placements, fast variants |

Render each concept's hook frame as a still in `concepts/` (one composition per concept, `npx hyperframes snapshot --at <t>`) and show the cards with their stills. The user picks one, or steers ("more variants, warmer, show the reminder"): propose 3 new concepts shaped by the feedback, keeping what they liked, and repeat until they pick.

### 3. Plan the chosen concept

Add `### <NN-slug>` under **Promotions** from [`../assets/plan.md`](../assets/plan.md):

1. **Spec**: format, placements, ratios and length per [marketing-contract.md](./marketing-contract.md) → **Platform rules**, audience, hook, must show, label, offer + CTA.
2. **Script**: one row per beat (time, visual, voiceover, on-screen text), timed to the length. Voiceover in the **Brief**'s language, about 2.5 words a second.
3. **Scenes**: per beat, its source per [marketing-contract.md](./marketing-contract.md) → **Media and paid calls**, and the motion (a flow step's tap at its x/y, or on the named control when the mockup gives no coordinates; fields filling; a hold).
4. **Voice**: ElevenLabs voice, model, pace, tone.
5. **Music brief**: mood, tempo, length, and a Pixabay search link (`https://pixabay.com/music/search/<terms>/`).
6. **Sound**: effects per visible action (tap, swipe, success).
7. **Paid calls**: each call and its size (ElevenLabs: voiceover characters, counted from the script).

Show the section, then ask in one message:

- The music: a track downloaded per the brief into `promotions/<NN-slug>/music.<ext>`, or "no music"
- The founder's footage, when the format needs it
- A video: preview a silent draft first (free), or go straight to the final with voiceover (the paid calls above)

Wait for the answers.

### 4. Build

Open hyperframes and build the first ratio in `<promotion>/<ratio>/`, where `<promotion>` is `<marketing-root>/<slug>/promotions/<NN-slug>`:

```bash
npx hyperframes init <promotion>/<ratio> --resolution <preset>
```

Presets: `portrait` for 9x16, `square` for 1x1, `landscape` for 16x9; for 4x5, `portrait` with the composition set to 1080×1350.

- The approved script and scenes are the chosen storyline: skip its storyline pitch.
- Copy the music, the footage, and the mockup screens into the project's `assets/`; time the scenes to the script.
- Sound effects per media-use with `--local-only`.
- Labels, captions, and safe zones per [marketing-contract.md](./marketing-contract.md) → **Platform rules**, **Honesty rules**.
- Its check and review run as hyperframes says.

A static ad or carousel: one composition per frame, `npx hyperframes snapshot --at <t>` per frame into `stills/<NN-slug>-<n>.png`; show the stills, change them on feedback, and go to step 7 once the user approves them.

### 5. Draft

When the user chose a draft: render `renders/<NN-slug>-<ratio>-draft.mp4` with every voiceover line shown as on-screen text where the voice will play. Show it. Feedback (music, effects, pacing, scenes, wording) → change the project or the section, then render the draft again. Repeat until the user says to go final.

### 6. Final

1. Show the **Paid calls**; approval runs them.
2. Per text-to-speech, render the voiceover with its CLI:

   ```bash
   set -a; . ./.env; set +a
   npx -y @elevenlabs/cli@latest text-to-speech convert --voice-id <id> --model-id <model> \
     --text "<voiceover>" --output <promotion>/voiceover.mp3
   ```

   Record the characters used under **Paid calls**. A rejected key (401) → setup-api-key. Longer than the spec's length → tighten the script and ask before paying for another render.
3. Copy `voiceover.mp3` into the project and transcribe it per media-use (`npx hyperframes transcribe`); time the scenes, taps, and captions to its word timings. The words come from the approved script, the timings from the transcript.
4. The user approves the hyperframes preview; render `renders/<NN-slug>-<ratio>.mp4`.
5. Each further ratio starts from a copy of the first project, transcript included, re-lays out for that ratio's size and safe zones, and renders.

### 7. Record

List every final render and still under the promotion's **Files**; update the `index.md` row.

### 8. Hand off to posting

Ask where and when to post it, suggesting the channels where its audience gathers and a time for each; the answer runs [publishing-promotion.md](./publishing-promotion.md). Reply with the promotion id, its files, and the paid calls made.
