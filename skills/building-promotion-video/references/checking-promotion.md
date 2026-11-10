# Checking Promotion

## Overview

The gates a promotion passes before the user sees it, and the diagnostics reported beside them. A G1–G3 failure is fixed before the user sees the beat sheet, the draft or the final; the reply reports what each gate found. Diagnostics never block.

## Guidelines

### When each runs

| Gate | Runs on | When |
| --- | --- | --- |
| G1 Cold read | The beat sheet | Before the user sees it, and before any paid call |
| G2 Script budget | The beat sheet | Same |
| G3 Measured | The style test, every draft, the final | Before each preview the user is shown |
| Diagnostics | A render | With G3, whenever a render exists |
| G4 Real viewers | The final | Offered once; optional |

### G1 Cold read

A fresh subagent sees only the beat sheet's voice lines and captions, in order. It doesn't see the Brief or the Study. Then it sees the hook alone. It answers:

- what is sold, and who sells it;
- who it's for;
- what it does for them;
- what's free or what it costs;
- what to do next.

Its answers must match the **Message plan**. A miss is fixed in the lines or captions that own that job, per [writing-script.md](./writing-script.md).

### G2 Script budget

Each check runs on the beat sheet:

| Check | Passes when |
| --- | --- |
| Lines | Each line fits its slot at the planning rate; each breath group is within [writing-script.md](./writing-script.md) → **Rate and budget** |
| Voice-free windows | No line crosses the drop, the device's first bar, the ending hit, or a key effect |
| Timing | The offer, the builder, the sold line and the brand land within [writing-script.md](./writing-script.md) → **Sold vs shown** and **Brand touches** |
| Claims and offer | Claims within the cap; the offer ≤ 6 words; no terms in the film |
| The muted read | The captions, labels and end card alone, in order, read hook → offer → who builds it → what to tap |
| Honesty scan | [writing-script.md](./writing-script.md) → **Honesty scan for words** finds nothing, and nothing from the Brief's **Never say** appears |

### G3 Measured

| Area | Passes when |
| --- | --- |
| Text | Every word that must be read is ≥ 28 px and sits in the read band. Run `npx hyperframes check --caption-zone` once per unsafe zone from [promotion-contract.md](./promotion-contract.md) → **Frame sizes and safe zones**. Line widths are measured in the rendered font, ≤ 950 px. Contrast ≥ 4.5:1, or 3:1 only for text ≥ 72 px |
| Disclosure and honesty | The chip on every app frame; the disclosure line ≥ 2 s at first sight; "Illustrative" on every AI result; the end card repeats the line; each AI or slow step shows its working state; no outcome-promise line is readable; no platform UI or sound. Per [promotion-contract.md](./promotion-contract.md) → **Disclosure**, **Honesty rules** |
| Flashes | ≤ 3 flashes in any one second |
| End card | ≤ 10 unvoiced words, held for their reading budget; the mark on the track's final hit; ≥ 0.8 s of music after the last spoken word |
| Muted render | Watched with the audio off, at phone size, in 9:16 and inside a centred 4:5 window: the muted read still passes on the picture |
| Voice | Every onset is measured from the audio and sits on its slot; no voice crosses a voice-free window; no time-stretch or playback-rate change; the bed ducks under each line |
| Effects | Each lands 0–1 frame after its change; each sits ≥ 6 dB under any voice it overlaps; the count and spacing per [directing-sound.md](./directing-sound.md) → **Sound effects** |
| Loudness | `ffmpeg -i <render> -af ebur128=peak=true -f null -` reads −15 to −13 LUFS integrated and a true peak ≤ −1.0 dBTP |
| Crops | Every further ratio keeps each read word and control inside its frame |

### Diagnostics

`node <skill>/scripts/measure-film.mjs <render> --bpm <BPM> --offset 0`, where `<skill>` is this skill's folder, the BPM comes from **Music**, and the film's bar 0 sits at 0 s. It reports:

- the share of time moving;
- distinct visual moments a second;
- the longest frozen stretch;
- the share of the frame changing each second;
- mean saturation;
- the quiet-to-loud jump;
- the share of motion onsets on a beat, against chance.

Report the numbers beside G3. Worth a look in the preview: fewer than ~1 distinct moment a second; a freeze over ~3 s, or any full stop in 3–6 s; motion onsets on the beat no more often than chance. The numbers never block; the user's eye decides.

### G4 Real viewers

Offered once after the final, before the user posts it; it never blocks.

1. The skill writes three questions: "What is it offering? Who makes it? What would you do next?". It adds one recall question per key beat.
2. 5–8 people from the audience, who haven't seen the Brief, each watch the film once on their own phone: muted first, then with sound.
3. The user brings back the answers. A beat most of them miss is fixed and re-rendered.
