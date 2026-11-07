# Creating Campaign

## Overview

**Execution mode.** Takes a product from concepts to a finished campaign video: proposes concepts the user steers until they pick, plans each pick with its spend estimate, previews the picture as a free draft, voices it and locks the picture, scores it from the sound bank and ElevenLabs, renders the final and hands it to posting. Continues a campaign from wherever it stands.

## Prerequisites

Per [marketing-contract.md](./marketing-contract.md) → **Output layout**, **Products and campaigns**, **campaign.md**, **Where a campaign stands**, **Platform rules**, **Honesty rules**, **Media and paid calls**, **Sound bank**, **Secrets**, **Discover dependency skill**. The craft per [directing-promo-video.md](./directing-promo-video.md).

## Guidelines

### 1. Resolve the campaign

Per [marketing-contract.md](./marketing-contract.md) → **Resolve marketing root**. No product or no **Study** yet → run [studying-reference.md](./studying-reference.md) first, then continue here.

| Request | Step |
| --- | --- |
| A new campaign, or more concepts | 2 |
| Continue a campaign, or "go final" | The step after where it stands per [marketing-contract.md](./marketing-contract.md) → **Where a campaign stands** |
| Change the picture, holds or wording before the lock | 5 |
| Change a voiced line | 6, for that line |
| Change a posted campaign | 3, with a new campaign copied from it |

A campaign whose clock is `music` runs 5, then 8's music composed from the draft's section lengths, then the picture snapped forward to the plan's section boundaries, then 6, 7 and 8's effects.

### 2. Propose concepts

1. From **Study** and **Message**, write 3 concept cards per [directing-promo-video.md](./directing-promo-video.md) → **Concept and look**, **Tone**, **Timeline**, **Hook**. They differ in device and form, and one is bold. Each card names:
   - audience and feature: the one task, input → ≤ 3 moments → result
   - concept, tone and pattern
   - core line, and the sold-vs-shown beat with when it lands
   - length and worlds
2. Build each card's hook as `compositions/<round>-<n>.html` in `<marketing-root>/.concepts/<product>/` (`npx hyperframes init` it when missing), and snapshot its hook frame into `snapshots/` (`npx hyperframes snapshot --composition <id> --at <t> --output snapshots/<round>-<n>`). A silent preview goes into `renders/` only on request (`npx hyperframes render --composition <file>`).
3. Show the cards with their stills. The user picks one or more, or steers ("warmer, show the reminder"): propose 3 new concepts shaped by the feedback, keeping what they liked, and repeat until they pick. Each pick becomes its own campaign.

### 3. Plan the campaign

1. Make the folder with `npx hyperframes init <marketing-root>/<product>/<NN-slug> --resolution <preset>` before writing anything into it (init refuses a folder that isn't empty). Presets: `portrait` for 9x16, `square` for 1x1, `landscape` for 16x9; for 4x5, `portrait` with the composition set to 1080×1350.
2. Copy in the pick's composition and the assets it uses from `.concepts/<product>/`.
3. Write `campaign.md` from [`../assets/campaign.md`](../assets/campaign.md):
   - **Spec**: placements, ratios and length per [marketing-contract.md](./marketing-contract.md) → **Platform rules** and [directing-promo-video.md](./directing-promo-video.md) → **Timeline**, plus the rest of its fields per [marketing-contract.md](./marketing-contract.md) → **campaign.md**.
   - **Script**: per **Lines**, **Voice, screen and caption**, **Claims**, **Offer and CTA**, with the hook's 3 variants.
   - **Scenes**: per **Moment**, **Framing**, **Camera**, **Cues**, **Holds**, **Shot recipes**, **Seams**, with each moment's hold computed.
   - **Voice**: the casting line and the pace band. **Music**: the role map and the hit list (the reveal, the offer and the mark, each with its time). **Sound**: the named-change list.
4. Run G1 and G2 per [directing-promo-video.md](./directing-promo-video.md) → **Checks** and fix what they find.
5. Show the campaign and ask, in one message, only what the request hasn't already settled:
   - **Music:** ElevenLabs music, a bank bed when one fits, or none
   - **Sound effects:** ElevenLabs effects, bank takes first, or none
   - **Video:** a picture draft first, or straight to the voice

   Nothing is assumed from the tone or a past campaign. Record the picks in **Music** and **Sound**, write the spend estimate at the top of **Paid calls**, and wait for the answers and the estimate's approval.

### 4. Build

Open hyperframes and build in the campaign folder:

- Every app piece a moment shows is rebuilt in its scene in `compositions/` from the source, keeping only the strings the moment needs; pieces several scenes share go in `compositions/components/`.
- Hyperframes gets **Script**, **Scenes** and [directing-promo-video.md](./directing-promo-video.md) → **HyperFrames brief** as the chosen script and storyboard, so it skips its storyline pitch.
- Text, labels and safe zones per [marketing-contract.md](./marketing-contract.md) → **Platform rules**, **Honesty rules** and [directing-promo-video.md](./directing-promo-video.md) → **Type, colour and placement**. Its check and review run as hyperframes says.

### 5. Picture draft

1. Time the lines from the pace band.
2. Run G3 per [directing-promo-video.md](./directing-promo-video.md) → **Checks** and fix what it finds.
3. Render `renders/<NN-slug>-draft.mp4` silent, showing on screen only what the final will and naming no audio file that isn't on disk.
4. Show it with each line and its time, and what the gates found.
5. Feedback (holds, scenes, wording) → change the project or `campaign.md`, run G2 and G3 again, and render again. Repeat until the user approves the picture and pacing.

### 6. Voice

1. Cast the voice per [directing-promo-video.md](./directing-promo-video.md) → **Voice** → **Casting**.
2. Render the takes per **Voice** → **Takes**, with `$env` loaded per [marketing-contract.md](./marketing-contract.md) → **Secrets**. Place them into `assets/vo/<id>.mp3`, and write `assets/vo/words.json` from the alignments, offset by each line's placement. Record the characters used under **Paid calls**. A rejected key (401) → setup-api-key. A script longer than the spec's length → tighten it and ask before paying for more takes.
3. A changed line gets a new take with its current neighbours as `previous_text` and `next_text`, then step 7.

### 7. Lock the picture

1. Re-time the scenes, taps, labels and captions to the words; on a `music` clock, place the lines on the picture instead.
2. Run G3 with its final-only voice rows (anchors, joins, playback rate) and fix what it finds.
3. Render `renders/<NN-slug>-voice.mp4` with the voice only, and show it. Feedback → re-time, or a new take per step 6.3, and render again. The user's approval locks the picture.

### 8. Sound

1. Match each **Sound** row and the music against the bank per [marketing-contract.md](./marketing-contract.md) → **Sound bank**. Place the matches, write their files into **Sound**, and render `renders/<NN-slug>-sound.mp4`. Show it with the reused files and what is still to make, each with the closest bank file that failed and why. The user keeps or drops each match; a drop joins what's left to make.
2. Make the rest: ElevenLabs music per [directing-promo-video.md](./directing-promo-video.md) → **Music** → **Compose**, and ElevenLabs effects per **Sound effects**.
3. Mix per **Mix**. Run G3 with its final-only rows and fix what it finds.
4. The user approves the sound in the hyperframes preview. Feedback → another bank match, a new take, or a new compose.
5. A timing change after this step → re-cut the music per **Music** → **Re-cut** when it still fits, else recompose; move each effect onto its change.

### 9. Final

1. Render `renders/<NN-slug>-<ratio>.mp4`. Make each further ratio per [marketing-contract.md](./marketing-contract.md) → **Platform rules**.
2. Make the ≤ 15 s cut as its own root composition when the placements need it or the user asks. It plays the master's takes and effects, and the master's music cut at bar lines with its tail trimmed and faded after the mark; when no cut lands the mark within 2 frames, it gets its own compose.
3. Offer G4 per [directing-promo-video.md](./directing-promo-video.md) → **Checks**.

### 10. Record

Delete the `assets/` files nothing reads. List every final render and each crop's recipe under **Files**.

### 11. Hand off to posting

Ask where and when to post it, suggesting the channels where its audience gathers and a time for each; the answer runs [posting-campaign.md](./posting-campaign.md). Reply with the campaign id, its files, the paid calls made, the bank files reused, and what the gates found.
