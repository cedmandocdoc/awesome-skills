# Creating Promotion

## Overview

**Execution mode.** Plans one promotion in the item's `plan.md` (format, script, scenes, voice, music brief, paid calls), stops for approval, then makes it: ElevenLabs voiceover, the user's music track, HyperFrames video per ratio or stills, and the renders. Also changes a promotion.

## Prerequisites

Per [marketing-contract.md](./marketing-contract.md) → **Output layout**, **Items and promotions**, **plan.md**, **Statuses**, **Platform rules**, **Honesty rules**, **Media and paid calls**, **Discover dependency skill**.

## Guidelines

### 1. Resolve the item

Per [marketing-contract.md](./marketing-contract.md) → **Resolve marketing root**. No item or no **Study** yet → run [studying-reference.md](./studying-reference.md) first, then continue here.

| Request | Route |
| --- | --- |
| A new promotion | Steps 2–9 with the next `NN-slug` |
| Change a promotion not yet posted | Edit its section, then steps 4–9 for what the change touches |
| Change a promotion already posted | A new promotion copied from it, then steps 4–9 |

### 2. Pick the format

| Format | Flow | Fits |
| --- | --- | --- |
| Demo walkthrough | hook → pain → app on a phone doing the job → offer → CTA | One clear feature that answers the pain |
| Problem → solution | the messy way (notebook, chat) → the same task in the app → result | An audience still on a manual workaround |
| Founder overlay | founder talking + app screens alongside → trust line → CTA | Trust matters more than features; needs the founder's footage |
| Static ad / carousel | hook frame → 2–3 screen frames → offer frame | Feed placements, low budget, fast variants |

Use the format the user names; else recommend one per audience from **Study** and **Message**.

### 3. Write the promotion

Add `### <NN-slug>` under **Promotions** from [`../assets/plan.md`](../assets/plan.md), status `planned`:

1. **Spec**: format, placements, ratios and length per [marketing-contract.md](./marketing-contract.md) → **Platform rules**, audience, hook, must show (features and flow steps), label, offer + CTA.
2. **Script**: one row per beat (time, visual, voiceover, on-screen text), timed to the length. Voiceover in the **Brief**'s language, about 2.5 words a second.
3. **Scenes**: per beat, its source per [marketing-contract.md](./marketing-contract.md) → **Media and paid calls**, and the motion (a flow step's tap at its x/y, or on the named control when the mockup gives no coordinates; fields filling; a hold).
4. **Voice**: ElevenLabs voice, model, pace, tone.
5. **Music brief**: mood, tempo, length, and a Pixabay search link (`https://pixabay.com/music/search/<terms>/`).
6. **Sound**: effects per visible action (tap, swipe, success).
7. **Paid calls**: each call and its size (ElevenLabs: voiceover characters, counted from the script).

### 4. Approve

Show the promotion's section. A change edits the section and shows it again. Approval → status `approved`.

### 5. Voiceover

Per text-to-speech, render the script's voiceover with its CLI:

```bash
set -a; . ./.env; set +a
npx -y @elevenlabs/cli@latest text-to-speech convert --voice-id <id> --model-id <model> \
  --text "<voiceover>" --output <marketing-root>/<slug>/promotions/<NN-slug>/voiceover.mp3
```

Record the characters used under **Paid calls**. A rejected key (401) → setup-api-key. Longer than the spec's length → tighten the script and ask before paying for another render.

### 6. Music

Ask the user to download a track per the music brief into `promotions/<NN-slug>/music.<ext>`, or to say "no music"; wait for it.

### 7. Build

Open hyperframes and build the first ratio in `promotions/<NN-slug>/<ratio>/`:

```bash
npx hyperframes init <promotion>/<ratio> --resolution <preset> --audio <promotion>/voiceover.mp3
```

Presets: `portrait` for 9x16, `square` for 1x1, `landscape` for 16x9; for 4x5, `portrait` with the composition set to 1080×1350. `<promotion>` is `<marketing-root>/<slug>/promotions/<NN-slug>`. `--audio` copies the voiceover in and transcribes it locally into word timings; a promotion without voiceover omits it.

- The approved script and scenes are the chosen storyline: skip its storyline pitch.
- Copy the music and the mockup screens into the project's `assets/`.
- Time scenes, taps, and burned-in captions to the transcript's word timings; the words come from the approved script, the timings from the transcript.
- Sound effects per media-use with `--local-only`.
- Labels, captions, and safe zones per [marketing-contract.md](./marketing-contract.md) → **Platform rules**, **Honesty rules**.
- Its check, review, and preview run as hyperframes says; the user approves the preview before the render.
- Render to `renders/<NN-slug>-<ratio>.mp4`. Static ad or carousel: one composition per frame, `npx hyperframes snapshot --at <t>` per frame into `stills/<NN-slug>-<n>.png`.

Each further ratio starts from a copy of the first project, transcript included, and re-lays out for that ratio's size and safe zones.

### 8. Record

List every render and still under the promotion's **Files**; status `rendered`; update the `index.md` row.

### 9. Confirm to the user

Reply with:

- The promotion id, format, and render paths
- Paid calls made and their size
- Next: "run marketing" to post or advertise it
