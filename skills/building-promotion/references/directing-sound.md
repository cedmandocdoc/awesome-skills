# Directing Sound

## Overview

How a promotion sounds: the music as the film's clock, finding and testing a Pixabay track, its licence, mapping and verifying its beat grid, cutting it to the beat sheet, the sound effects, and the mix. The voice's casting, takes and placement on the grid are in [directing-voice.md](./directing-voice.md).

## Guidelines

### Music is the clock

The Spec's clock picks how the film is timed:

| Clock | Times the picture | The music |
| --- | --- | --- |
| `music` (default) | The track's bars and beats; every move, line and effect sits on its grid | A Pixabay track the user picks after the beat sheet and the preset; the cut is planned in bars to the beat sheet's lengths |
| `voice` (a person to camera, a teach-first film) | The voice and its pauses | A soft pulse cut to the voice: no busy hi-hats or snare runs, no vocals |

In a music-led film:

- Plan in bars. One 4/4 bar = 240 ÷ BPM s (120 BPM → 2.0 s, 160 BPM → 1.5 s); one beat = 60 ÷ BPM s.
- Every move sits on the grid, and layouts change on the bar line. A move starts 40–190 ms before its hit; the hit itself is a 0 ms set. Slots are written as `bar:beat`, per [directing-picture.md](./directing-picture.md) → **Building in HyperFrames**.
- The drop lands on the signature device or the app reveal, where the beat sheet puts it.
- The track's real ending lands on the mark, per [directing-picture.md](./directing-picture.md) → **End card**.

### Pixabay searches by style

Derive 3–5 searches from the picked preset's own searches ([choosing-style.md](./choosing-style.md) → **Presets**) and this table, and hand them over with **The 30-second track test**.

| Style | Feel, BPM | 20–30 s shape | Searches |
| --- | --- | --- | --- |
| Energetic upbeat | Upbeat pop, corporate or future bass; 120–145 (pop 95–130, future bass 130–160) | Light intro of 2–4 bars → lift on the app reveal → 8–12 bars → a real ending on the mark | `upbeat corporate`, `upbeat pop`, `future bass upbeat`, `corporate startup promo` |
| Calm premium | Minimal electronica, lo-fi; 60–100 | Pad intro, the beat on the reveal, a held last chord | `minimal technology`, `minimal electronica`, `lofi chill` |
| Warm | Inspiring piano, uplifting pop; start at 90–120 | Piano intro; drums lift within 4–8 bars | `inspiring piano corporate`, `inspiring uplifting`, `feel good pop` |
| Playful | Pizzicato, marimba | A short loop with stop-time gags | `quirky`, `marimba happy`. Risk: the explainer-video cliché |
| Hype | Phonk, EDM drop, sport rock; 130–150 | The drop at bar 1; a cut on every hit | `phonk`, `edm drop`, `energetic sport rock`. Risk: too aggressive for an older or conservative audience |
| Cinematic | An inspiring build; free tempo | A long build, one swell on the reveal | `inspiring cinematic build`. Risk: trailer tracks bring big impacts |
| Local flavour | The market's own genre; when Pixabay has little of it, an adjacent groove | A groove from bar 1 | The genre by name, then `tropical house`, `bossa nova`, `city pop` |
| Trend | Jersey club, short-video beats | Loop-ready, the hook in second 1 | `jersey club`, `tiktok` |

- A search is `https://pixabay.com/music/search/<query>/`.
- About 1 track page in 10 carries neither label the test checks. Clean tracks cluster in a few uploaders, so once a clean track turns up, search that uploader's catalog before more keywords. The bank's track sidecars name the uploaders of earlier clean picks; start there.

### The 30-second track test

The user runs it on each candidate, listening on its track page:

| # | Passes when | Fails on |
| --- | --- | --- |
| 1 | A quiet block, then a denser lift within ~20 s | A flat track: the drop has nothing to land on |
| 2 | A real ending in the last ~10 s: a final hit or a held chord | A fade-out |
| 3 | No vocals | Any sung line |
| 4 | The track page shows neither "Content ID Registered" nor "AI generated"; search results don't show these labels | "AI generated" → skip it. "Content ID Registered" → usable, but recorded: it may be claimed or muted once posted (**Licensing**) |
| 5 | Preferred: the artist also publishes short or logo cut-downs of the track | — |

The user downloads the pick while logged in, per [promotion-contract.md](./promotion-contract.md) → **Media and paid calls**; Pixabay's bot check blocks automated downloads, so never work around it. The labels go into the track's sidecar as read on the page.

### Licensing

| Fact | Do |
| --- | --- |
| Pixabay music is free for commercial video, with no credit needed | Still list it in `assets/music/CREDITS.md` |
| It is never redistributed on its own | Ship it only inside a film; never share the track, a cut or a music stem by itself |
| The download certificate proves the licence | Keep it; its path goes in the track's sidecar |
| A "Content ID Registered" track may be claimed or muted on Facebook and Instagram even when the use is legal | Record the label in **Music** and tell the user at the final; prefer an unregistered track |
| The licence bars trademark and service-mark use | Never make a stock track's ending the seller's recurring sonic logo; the Brief's sonic cue is the seller's own |

### The grid

1. **Map.** Run `npx hyperframes audio <file> --only beats,downbeats,bpm,sections --json`. Read `bpm` with `beats.confidence`; accept half or double the style's tempo. A free-tempo track has no reliable beats: cut it on its `sections`, at phrase and energy changes.
2. **Verify at the drop.** Automatic beat tracking often misreads the bar line: off-beat bass, syncopated kicks and quiet intros fool it. Find where the bass or kick enters at the drop, by ear, by the loudness step and by a kick-band phase scan (the low band's energy folded on the beat period), and nudge the downbeat offset until a bar line sits on that entry. Nudges of −700 to +500 ms are normal.
3. **Fit.** Across the cut's bars, the grid sits within ~30 ms of the track's beats.
4. **Record.** The BPM, the verified downbeat offset and the sections (intro, lift, drop, ending, in seconds) go into the track's sidecar and `promotion.md` → **Music**; the BPM and `DROP_BAR` go into the grid script.

### Cutting

- Plan the cut on paper first: source in and out, the bars of each part, the drop bar, the ending, the runtime.
- Cut only on bar lines (a downbeat or a phrase end), at repeating material, in the valley just before the beat. Each join gets a 12–50 ms crossfade; start at 12 ms.
- For the hook, take the bars just before a lift (a breakdown's last 2–4 bars), so the cut lifts into the drop.
- The music is audible from frame 0, with a 12 ms fade-in.
- Join the body into the track's own ending on a bar line, and let its final hit or chord ring out. Never fade a cut out.
- To lengthen, repeat the last 2 bars before the ending; to shorten, remove whole phrases of repeating material.
- To re-align after a grid nudge, move the source start by the nudge; the BPM, bars and length stay, so the picture timing holds.
- The film's cut extends the style test's bars on the same grid. The ≤ 15 s cut is cut from the same grid; an artist's short cut-down helps.
- Check the cut with `npx hyperframes audio <cut> --json`: every section change lands within one beat of its mark, and the ending's downbeat within 2 frames of the mark.
- Keep only the cut in `assets/music/`. Write its recipe in `CREDITS.md`, `promotion.md` → **Music** and the sidecar's `cuts`: source in–out, each join (source time, crossfade), the drop and ending downbeats in film time, length, BPM and bar length, loudness.

### Sound effects

UI sounds on meaningful moments. Take each from the bank first, then a free library, then (optional, paid) ElevenLabs, per [promotion-contract.md](./promotion-contract.md) → **Media and paid calls** and **Sound bank**.

| Kind | On | Energy | Searches |
| --- | --- | --- | --- |
| `tap` | Each press that causes the next change, on the beat | All | `ui click`, `button click` |
| `tick` | Staggered rows filling, chips cascading, visible typing | All | `keyboard typing`, `ui click` |
| `pop` | A number lands; a chip appears | 2–5 | `bubble pop` |
| `ping` | The AI moment; a "saved" | 2–4 | `notification chime`, `bright notification` |
| `notify` | The result ("12 payslips sent"): a notification-style sound, never a real platform tone ([promotion-contract.md](./promotion-contract.md) → **Honesty rules**) | 2–4 | `simple notification` |
| `stamp`, `foley` | The old way's objects (paper, pen, stamp), and a callback to them | All | `paper rustle`, `stamp` |
| `processing` | The AI working state | 3–4 | `data processing` |

- Avoid big stock bass impacts, risers, whooshes, glitches and sparkles; let the music build instead.
- Risk: a cash register on a sales or payroll payoff is a cliché; a soft swish on a panel slide drifts toward a stock whoosh.
- The end card's hit is the track's ending; add no effect on it. The seller's sonic cue: [directing-picture.md](./directing-picture.md) → **Brand kit**.

| Setting | Value |
| --- | --- |
| Hit level | A named hit peaks +3 to +6 dB over the bed's local peak (±120 ms) |
| Texture level | A run of ticks starts −9 to −6 dB under the bed's local peak, the quarter notes accented; tune by ear |
| Under a voice | No texture ticks inside a phrase. Any effect sits ≥ 6 dB under a line it overlaps; a result on a word onset → move the word one 8th late ([directing-voice.md](./directing-voice.md) → **Placement on the grid**), or keep the effect ≥ 6 dB under it |
| Timing | Its peak (`moments.peak` from `npx hyperframes audio <file> --json`) lands 0–1 frame after the picture's hit |
| Spacing | ≤ 2 named hits per moment, starts ≥ 0.5 s apart; ≤ 12 in a master, ≤ 6 in the ≤ 15 s cut. A run of ticks counts as one |
| Takes | One material per kind; one take per use, rotating up to 3 takes |
| ElevenLabs take | One request per take; the prompt names material, size and space ("a soft fingertip tap on phone glass, dry, close"); `duration_seconds` = the change's length (0.5–30 s); `model_id` `eleven_text_to_sound_v3` |

### Mix

Mix with media-use's volume lanes, groups and carve. The Spec's clock picks the column:

| Setting | Music-led | Voice-led |
| --- | --- | --- |
| Voice over the bed (LD: voice minus music + effects) | Start at ≈ 8 LU (≈ 10 LU for older, low-tech or second-language viewers); move it only by ear. Momentary p10 LD ≥ 0 LU | ≥ 10 LU; 13–15 LU for older, low-tech or second-language viewers |
| Duck shape | Down within ≤ 1/16 note (60–100 ms), ending ≥ 20 ms before the onset; up from the last word + 40 ms to the next 8th; merge gaps < 1 beat | Down 0.2 s before the first word; up from 0.3 s after the last word, over 0.8 s; merge gaps < 1.5 s |
| Music alone | Full level wherever no one speaks | +6 dB (4–8) over the bed level, only in voice gaps ≥ 2 s |
| Carve | No `carve.mjs` (it holds the bed down for ~2 bars). A static 2.5 kHz, Q 0.8, −3 dB dip, only when the bed's 1–5 kHz share is above −10 LU | `carve.mjs` on the bed at strength 0.5–0.8; it writes its own duck, so measure each line's LD after it |
| Space | Voice dry, mono, centred; the bed stereo. A 1/8-note slap at −18 dB only at energy 5; tune by ear | Dry |

Both clocks:

- **Inputs:** each voice take and the music cut at −16 LUFS integrated, measured as played (a mono take as dual mono), set with one linear gain; never single-pass `loudnorm`.
- **Duck depth:** the target LD minus the LD measured before ducking; with both inputs at −16 LUFS, ≈ 8 dB for 8 LU. Skip the duck where the LD is already met.
- **Voice chain:** leave the take alone, except a high-pass at 90 Hz (male) or 120 Hz (female); an optional 2:1 compression for 2–3 dB of gain reduction; a de-ess (6.5 kHz, −3 dB) only on a harsh "s"; cutting breaths and mouth clicks that land on hits.
- **Stem:** export a music-and-effects stem with no voice, so another language can be voiced without rebuilding the mix.
- **Master:** −14 ± 1 LUFS integrated (a convention; feeds publish no target); max short-term ≤ integrated + 5 LU; true peak ≤ −1 dBTP on the final AAC; a true-peak limiter last, its ceiling starting at −3 dBTP.

Order:

1. Normalise the takes and the cut (**Inputs**).
2. Set the bed from the measured LD, never by a raw volume number.
3. Write the duck as a `volume` lane on the music and effects groups.
4. Carve, or add the static dip.
5. Add the effects at their levels (**Sound effects**).
6. Put the limiter last.
7. Measure the mixed render with `ffmpeg -i <render> -af ebur128=peak=true -f null -`, and scale every element's `data-volume` by the gap to −14 LUFS.
8. Phone check: at 50 % volume at arm's length, then at the lowest volume, the words are clear without reading, the drop is felt and the tails survive; then a mono sum. A bass-led bed loses ~9 LU on a phone speaker, so its LD can sit at the low end.

## Related

- [promotion-contract.md](./promotion-contract.md) — media and paid calls, the sound bank, honesty rules
- [choosing-style.md](./choosing-style.md) — presets and their searches, the energy scale
- [directing-picture.md](./directing-picture.md) — the grid script and `retime.mjs`, the end card
- [directing-voice.md](./directing-voice.md) — line placement on the grid, the ending
- [creating-promotion.md](./creating-promotion.md) — when the music, effects and mix run
- [checking-promotion.md](./checking-promotion.md) — G3's sound and loudness rows

## References

- Pixabay licence summary: https://pixabay.com/service/license-summary/
- Pixabay terms: https://pixabay.com/service/terms/
- Pixabay FAQ (Content ID): https://pixabay.com/service/faq/
- Voice-over-bed level (Torcoli et al., 2019): https://cris.fau.de/publications/234640600
- EBU R 128 s1: https://tech.ebu.ch/docs/r/r128s1.pdf
