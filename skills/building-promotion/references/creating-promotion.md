# Creating Promotion

## Overview

**Execution mode.** Makes a promotion video script first, from concepts on paper to the final renders, and changes any part of an existing promotion whenever the user asks.

## Prerequisites

Per [promotion-contract.md](./promotion-contract.md): **Output layout**, **Products and promotions**, **promotion.md**, **Frame sizes and safe zones**, **Honesty rules**, **Disclosure**, **Media and paid calls**, **Sound bank**, **Secrets**, **Discover dependency skill**.

The craft lives in these guides:

- [choosing-structure.md](./choosing-structure.md)
- [writing-script.md](./writing-script.md)
- [choosing-style.md](./choosing-style.md)
- [directing-picture.md](./directing-picture.md)
- [directing-sound.md](./directing-sound.md)
- [directing-voice.md](./directing-voice.md)

The gates live in [checking-promotion.md](./checking-promotion.md).

## Guidelines

### 1. Resolve the request

Resolve the promotions root first, per [promotion-contract.md](./promotion-contract.md) → **Resolve promotions root**. When there is no product, or no **Study** yet, run [studying-product.md](./studying-product.md) first, then continue here.

| Request | Step |
| --- | --- |
| A new promotion, or more concepts | 2 |
| Change the structure or the length | 2, then 3–4 and the steps the change reaches |
| Change what it says (lines, captions, beats) | 3 or 4, then the steps the change reaches |
| Change the style or device | 5, then 7–8 |
| Change the track or the cut | 6, then the retime in 8 |
| Change a scene, a move or the end card | 8 |
| Change a voiced line or the casting | 9 |
| Change effects or the mix | 10 |
| A new ratio, the short cut, or a render | 11 |

Read the promotion's files for what exists, and redo only what the change reaches.

### 2. Propose concepts

1. From **Study**, **Message** and the Brief's length, suggest 3 structures per [choosing-structure.md](./choosing-structure.md) → **Choosing**; a hard length is a guard on every suggestion.
2. Dress each as a concept card per [choosing-style.md](./choosing-style.md) → **Concept cards**: its structure, length, voice mode, message and preset.
3. Show the cards. The user picks one or more, mixes dials, swaps the structure or the length, or steers: "warmer", "show the reminder". Steering gets 3 new cards that keep what they liked; repeat until they pick.
4. Each pick becomes its own promotion: run `npx hyperframes init <promotions-root>/<NN-slug> --resolution portrait` before writing anything into the folder, since init refuses a folder that isn't empty. Then write `promotion.md` from [`../assets/promotion.md`](../assets/promotion.md) with its **Spec**: the structure, the length and the voice mode included ([directing-voice.md](./directing-voice.md) → **Coverage**).

### 3. Message plan

Fill **Message plan** per [writing-script.md](./writing-script.md): the seven jobs and the trust beat, in the audience's words from **Study**, each with its source line and the structure's block that owns it.

### 4. Beat sheet

1. Lay the structure's blocks out to the length per [choosing-structure.md](./choosing-structure.md) → **Length**, then write **Beat sheet** per [writing-script.md](./writing-script.md). Each beat gets its slot (in seconds until the track is in, or `bar:beat` on a placeholder 120 BPM grid), its block, its job, its energy (**Energy curve**), the voice line (with syllables and planned seconds), the caption's key phrase, the picture that proves it (which source screen or step, and how it moves), and its effect.
2. Run G1 and G2 per [checking-promotion.md](./checking-promotion.md), and fix what they find.
3. Show the beat sheet with the muted read and what the gates found. Wait for the user's approval of the beat sheet on paper.

### 5. Preset and device

Fit the approved beats to the picked preset per [choosing-style.md](./choosing-style.md) → **Presets**. The preset dresses the beats: their blocks, order and content stay.

Record the preset and the signature device in **Spec**.

### 6. Music

1. Derive 3–5 Pixabay searches from the style, per [directing-sound.md](./directing-sound.md) → **Pixabay searches by style**.
2. Hand the searches to the user with the track test, per **The 30-second track test**.
3. The user downloads the pick into a folder they name. Take it into the **Sound bank**.
4. Map its grid and verify it at the drop, per **The grid**.
5. Plan the cut in bars to the beat sheet's lengths and energy curve, per **Cutting**: the drop on the device, the track's real ending on the mark, inside a hard length.
6. Write **Music**, cut the track into `assets/music/`, re-slot the beat sheet to `bar:beat` on this grid, and run G2's Timing check again ([checking-promotion.md](./checking-promotion.md)).

### 7. Style test

1. Write the grid script into `index.html`, and copy [`../scripts/retime.mjs`](../scripts/retime.mjs) into the folder, per [directing-picture.md](./directing-picture.md) → **Building in HyperFrames**.
2. Build only the first ~10 s: the hook, the drop, and the first app beat. While the track isn't in yet, build on a placeholder 120 BPM grid (`node retime.mjs --bed`) and retime once the track is in.
3. Open the preview with sound (`npx hyperframes preview`). The user approves the style test, or picks another preset or track (back to 5 or 6).

### 8. Build

1. Build the rest on the grid per [directing-picture.md](./directing-picture.md). The app is rebuilt in `compositions/` from the source, and the disclosure follows [promotion-contract.md](./promotion-contract.md) → **Disclosure**.
2. Run `node retime.mjs` after any grid or slot change.
3. Run G3 and the diagnostics per [checking-promotion.md](./checking-promotion.md), and fix what G3 finds.
4. The user reviews in the preview with sound. Feedback → change the project and run step 8.3 again. Repeat until the user approves the picture.

### 9. Voice

1. Skip this step when the Spec's coverage is none. Otherwise the voice rows of `SKILL.md` → **Setup** must pass: a missing one → stop and print its How. The guide is [directing-voice.md](./directing-voice.md).
2. Cast per **Casting**: a cost table for the casting test, then wait for the user's go, then the user picks by ear, unless the user waives the test.
3. Render the takes per **Takes**, with `$env` loaded per [promotion-contract.md](./promotion-contract.md) → **Secrets**. A rejected key (401) → setup-api-key. Record every call under **Paid calls**.
4. Place each pick per **Placement on the grid**. Measure every onset from the audio, and duck the bed under each line.
5. A changed line gets a new take per **Takes**, stitched to its picked neighbours with the `previous_request_ids` / `next_request_ids` or `previous_text` / `next_text` lever (**ElevenLabs model, settings, tags**).

### 10. Sound and mix

1. Place the effects per [directing-sound.md](./directing-sound.md) → **Sound effects**. Take them from the **Sound bank** or a free library first; ElevenLabs effects get a cost table.
2. Mix per **Mix**.
3. Run G3's sound rows, and fix what they find.
4. The user approves the sound in the preview.

### 11. Final

1. Render only what will be delivered: `npx hyperframes render --quality delivery -o renders/<NN-slug>-<ratio>.mp4`, adding `-c <name>.html` for a further root composition.
2. Make each further ratio per [promotion-contract.md](./promotion-contract.md) → **Frame sizes and safe zones**. Make the ≤ 15 s cut as its own root composition when the user asks for it; it is cut on bar lines and keeps the track's ending.
3. With the master, hand over the frame-0 cover still (`npx hyperframes snapshot --at 0`), a caption file (`.srt`) for a voiced film, and a music-and-effects stem with no voice ([directing-sound.md](./directing-sound.md) → **Mix**).
4. Offer G4 per [checking-promotion.md](./checking-promotion.md).

### 12. Confirm to the user

Delete the `assets/` files nothing reads, and list the renders under **Files**. Reply with:

- The promotion folder and its renders
- The paid calls made, and the bank files reused
- What the gates and diagnostics found
- The track's labels: a Content ID Registered track may be claimed or muted once posted
- Next: posting-content can post a render, when the user wants it posted
