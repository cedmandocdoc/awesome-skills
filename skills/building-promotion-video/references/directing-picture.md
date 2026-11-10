# Directing Picture

## Overview

How a promotion looks and moves: the top motion rules, looks and worlds, kinetic type, the app on screen and how it moves, transitions, camera, framing, type and colour, the brand kit, how the disclosure looks, frame 0, the end card, the tells to avoid, and the HyperFrames build. Every px value is for a 1080-wide frame; scale other widths by width ÷ 1080.

## Guidelines

### Motion in ten lines

1. **Real pixels, real data.** Use only screens rebuilt from the source and approved assets; near-match UI and placeholder data read as generated.
2. **Ease by role.** Arrivals land on long tails (`expo.out`), camera moves ease both ways (`power2.inOut`), exits accelerate (an `.in` ease). Productive motion takes 70–240 ms, expressive 400–700 ms. One curve on everything reads as generated.
3. **Springs by damping.** 1.0 never overshoots (effects, opacity); 0.6–0.8 may overshoot (position, scale).
4. **Quick, then dead still.** An arrival takes 0.16–0.36 s, then holds still for at least one beat. Landed text never moves; the motion passes to the next element, the camera or the world.
5. **Every transition has a cause on screen** (a tap, an object, a shape). Use 3–5 kinds a film, in one style.
6. **The music is the clock** in a music-led film: every move sits on its grid ([directing-sound.md](./directing-sound.md) → **Music is the clock**).
7. **One signature device**, every other layer in one grammar ([choosing-style.md](./choosing-style.md) → **The dials**).
8. **Readable at 9:16 first.** Read words sit in the read band above the text floor, and the UI fills the frame (**Framing and the read band**). Angle or tilt a screen only after the viewer has read it flat.
9. **Imperfection on purpose.** Grain, stepped timing and jitter read human when they're consistent; random wobble and breathing loops read generated.
10. **Look, don't guess.** Use snapshots, the preview with sound, and the diagnostics ([checking-promotion.md](./checking-promotion.md) → **Diagnostics**).

### Looks and worlds

- **≤ 3 worlds**, such as the old way → the product → the seller's type world. Enter each one through an object: a match cut, a carry, or the object becoming the UI.
- **Two brands.** The product world uses the product's design tokens exactly, status colours and type included. The seller owns the captions, titles, labels, the sold line, the disclosure line and the end card, in one type system across every world.
  - The seller's colour may flood the ground around the app, never the app's own UI.

| Look | What it is | Fit; risk | Build |
| --- | --- | --- | --- |
| Flat brand planes | Solid grounds flooding per chapter, one accent (ink → the seller's colour → white) | The default | Hand-built colour floods |
| Real paper world | The real old-way object (logbook, calculator, sticky note), full-bleed | Problem-first | Hand-built HTML/CSS |
| Paper / cutout collage | Scanned paper, tape, torn edges, a stepped stop-motion cadence | Paper to app, handmade | `paper-collage-reveal`, `torn-paper-rip`, `stop-motion-cadence`; needs photos or cutouts |
| Risograph / halftone | Two overprinted inks, grain, misregistration | A warm print feel | Hand-built CSS inks, multiply and plate offsets + `grain-overlay` (`halftone-field` is an LED dot field, not print) |
| Clay / soft 3D | Matte inflated forms, pastel, soft light | Friendly, health | Needs GLB models or generated stills |
| Liquid glass | Refractive translucent panels over a moving ground | iOS-native premium. Risk: contrast, GPU, an experimental Chrome flag; iOS-coded where most phones are Android | `liquid-glass-*`, `ios26-liquid-glass` |
| Photo + tracked UI | Footage with the UI tracked in, grain | Real-world trust. Risk: needs footage and an external tracker; a real shop implies a client, so use a generic, unbranded setting | External tracker + media treatments (`filmed-screen` simulates filming a monitor; it doesn't track) |
| Editorial / mixed media | Photo + type + texture as a moving poster | Brand story | Hand-built + registry overlays |
| Comic · Y2K chrome · grunge zine | Ben-Day dots and offset plates · chrome, gloss and bubble type · photocopy texture, a raw grid, hard cuts | Youth, maximal, contrarian. Risk: narrow audience fit | Hand-built; `extruded-logo` and sweeps for chrome |
| Neon / cyber | Dark, glow, scanlines | Tech. Risk: glow is a generated-look tell | Registry overlays |
| Character / mascot | A state-driven character | Warmth; a seller mascot. Blocked by the honesty rules when it plays a customer using or praising the app | `lottie-character-walk` (one character); needs Lottie or character art |
| 2D + light 3D | Flat shapes, light extrusion, ambient gradients | Rich but cheap | Hand-built |

### Kinetic type

| Style | Recipe | Fit | Build |
| --- | --- | --- | --- |
| Per-word blur-in | Opacity 0 → 1 and blur 6–8 px → 0 in 0.13–0.16 s `power2.out`, words ~0.07 s apart | Caption plates | Hand-built; `blur-in` |
| Slam | Scale 1.5 → 1 in 0.2–0.3 s `expo.out`, a 3-frame 6–10 px shake; ≤ 1 a bar | Hooks, the offer, numbers | `headline-slam` (strip its drift), `caption-kinetic-slam` |
| Whip-in | x from off-frame with 14–16 px blur → 0 in 0.24 s `power4.out` | The second word of a sequence | Hand-built; `shutter-slam` |
| Glyph scatter → lock | Letters assemble from fixed offsets and rotations in 0.32–0.7 s `power4.out` | An emphasis line | `char-slam-explode` |
| Mask punch-up | Each line rises out of its own clip, yPercent 110 → 0 in 0.22 s `expo.out`, one a beat. Calm variant: 0.6 s, stagger 0.1 s | Stacked lists ("12 CREW. 6 DAYS."); calm, premium | `per-word-rise` |
| Slot roll | One word rolls through options, ~0.1 s a roll; or strike and replace | Callback swaps | `kinetic-type-swap`, `ticker-takeover` |
| Word-by-word karaoke | 1–3 caps words, the active word highlighted | Voiced, sound-off. Risk: a yellow highlight reads as a template | `caption-highlight` (red sweep by default) |
| Swiss grid | Grotesk on a strict grid, moving in grid steps | Orderly products (records, payroll) | Hand-built |
| Variable-font morph | wght / wdth axes animate in place over 0.3–0.5 s | Emphasis without movement | `variable-axis-type`, `weight-wave`; needs a variable `.woff2` |
| Typewriter | 30–60 ms a character, ≤ 20 characters | Chat input | `typing-indicator`, `streaming-text` |
| Scramble / decode | Random glyphs resolve in ~1 s | Totals, IDs | `scramble-reveal` |
| Split-flap | Cells step through characters with a clack | Schedules, queues | Hand-built |
| Outline → fill | The stroke draws in 0.6–1 s, the fill floods in 0.2 s | Handmade products | `outline-draw` |
| Type as texture | One word at 300–600 % as the ground, a slow marquee | The ground behind the app | `mk-emphasis-type` |

### UI treatments

**The UI performs.** Rebuild it live from the source with its sample data, per [promotion-contract.md](./promotion-contract.md) → **Honesty rules**; never move a camera over a frozen screenshot.

- Frame it in a neutral phone, or the phone family the market mostly uses.
- Carry one datum (a name, a number, an item) from the input to the result.

| Treatment | Recipe | Fit; risk | Build |
| --- | --- | --- | --- |
| Phone + push-ins | The phone in frame, pushing to 2–3× crops of the tap | Risk: a small phone on empty ground, zooming in and out, reads as a template; prefer full-bleed UI or a phone filling the frame | `ui-focus-zoom` |
| Exploded / lifted UI | Components lift out of the phone (~1.5×, 0.4 s `expo.out`), play big and snap back; the phone dims behind | 3–4 features fast. Risk: the viewer loses where the pieces came from | Hand-built lift layer |
| Full-bleed UI | No device; the UI is the frame | Best legibility | Rebuild + `ui-focus-zoom` |
| Camera through the product | A virtual camera films the rebuilt screens, one action at a time | Demos | Hand-built |
| Screen-recording style | Auto-zoom to each tap, an enlarged, smoothed finger, cut to the beat | Honest walkthrough | `touch-indicator`, `gesture-tap` (no rings) |
| Tap-led | A finger or tap dot causes every change | "It's this easy" | `touch-indicator` |
| Data-as-type | The number is the hero at 60–90 % of the width; the phone appears briefly as proof | Totals, counts | `number-wheel`, `count-up` (`apple-money-count` is $ and landscape: re-lay it) |
| Object → UI morph | The old-way object becomes the UI element, on a shutter-flash match cut | The strongest concept device | Hand-built |
| Before / after split | Old-way chaos vs the app's order, with a sweeping edge | Problem and solution in one frame | `comparison-split`, `before-after-wipe` |
| Chat / notification flood | Messages pile up faster and faster; the app absorbs them | Businesses run by chat. Risk: ad platforms bar imagery that imitates notifications; keep a generic chat UI inside a drawn phone (**Honesty rules**) | `notification-pileup`, `overwhelm-surround`, `message-thread-reveal` (re-lay) |
| Card stack / rail | Records cascade, shuffle or swipe | Orders arriving | Hand-built; `swipe-rail` (`three-orbiting-cards` is a 3D orbit, not a stack) |
| Macro close-up | 4–8× on one chip, the rest blurred | Punctuation between demos | Hand-built |
| Floating device, orbit, splay | A photoreal phone turns while the camera orbits, or devices tilt and fan out | Premium, multi-role systems. Risk: app-store cliché, a tiny screen, angled text, GPU; off by default | `vfx-iphone-device`, `parallax-device-dive`, CSS 3D |
| Tabletop stage | The phone on a real counter, top-down, props around | A tactile small-business world | Hand-built |
| Filmed screen | Looks filmed off a monitor (depth of field, curvature) | Texture, a "real device" feel | `filmed-screen` |

### How the UI moves

Inside any treatment, each change arrives on a grid slot and then holds (**Motion in ten lines** 4):

| Change | Animate | On the grid | Build |
| --- | --- | --- | --- |
| Cells or rows fill | Each rises out of its clip (yPercent 105 → 0, 0.22 s `expo.out`) or grows from height 0; rows below shift | Row by row on 16th notes | Hand-built |
| A value lands | A number wheel or a count-up; a typed value at 30–60 ms a character | Rolls over 1–2 beats, lands on the beat or the bar | `number-wheel`, `count-up` |
| Chips or rows cascade | Each pops or slides in after the last | On 16ths or 8ths | Hand-built |
| A status flips | The chip's colour and text cross-fade to the product's status token | On the beat | `toggle-flip` |
| A sheet springs up | translateY 100 % → 0, with the product's scrim | Lands on the beat | `sheet-spring-up` |
| A screen changes | The way the source navigates, a modal morph, or skeleton → content | Lands on the beat | `modal-morph`, `match-cut`, `skeleton-reveal` |
| A list scrolls | 0.4 s `power2.inOut` under the pinned header | Starts on the slot | Hand-built |
| A tap | Press 1 → 0.94–0.96 → 1 in ~0.15 s | The 8th before the change it causes | `touch-indicator` |
| Items leave ("sent"), then done | They fly out of the phone on 8ths; a check pops in 0.24 s `expo.out` | The check on the beat | Hand-built; `success-check` |

**An AI or slow step** shows the source's working state for ≥ 0.6 s (at least one beat) before its result. When the real step takes longer, cut the time with a dissolve; never fill it faster than the app can. Its result carries "Illustrative" (**Disclosure on screen**).

### Transitions

- Every in-app seam maps to a flow step or a real data flow: the source's own navigation, or a carry along a path the data really takes.
- ≤ 3 flashes in any one second (shutter flashes, glitches, strobes).

| Transition | Recipe | Fit | Build |
| --- | --- | --- | --- |
| Shutter flash + match cut | White for 2 frames on the drop; the object in the hook = the photo in the app | Old way → app | `editorial-flash-overlay`, hand-built |
| Zoom-through a tapped button | The button scales ~8 % → 250 % in 0.35 s on a strong ease-in; its fill becomes the next frame | Tap → result | `zoom-through-transition` |
| Match cut | On the tap, the new screen arrives at 1.06× and settles in 0.3 s; or a graphic match, shapes lining up across the cut | Screen changes; paper → phone | `match-cut`, `text-match-cut` |
| Colour flood / wipe | The ground changes colour in ~0.4 s `power2.inOut`, or rises from the bottom | Chapter change | Hand-built |
| Dip | Darken ~40 % for 3 frames before a hard cut | Into the callback | Hand-built |
| Dissolve | 0.3–0.5 s | Time passes: an AI wait, the next day | Hand-built |
| Carry across | An object travels between worlds (a paper note → its row in the app) | Ties the old way to the new | Hand-built |
| Whip pan | A smear hides the cut; match speed and direction on both sides | Chapter change | `whip-pan-cut`, `whip-pan` shader |
| Speed ramp | Speeds into the cut and slows out, on beat markers | Hyper-kinetic. Risk: youth-coded | `beat-freeze-cut` |
| Morph | One container reshapes into the next | Card → panel | `modal-morph`, `morph-swap` |
| Iris from the tap | A circle opens from the touch point in 0.15 s | Any tap | `iris-reveal`, `sdf-iris` |
| Light leak / sweep | An organic leak across the seam | Warm, filmic | `light-leak`, `organic-light-leak-overlay` |
| RGB split / glitch | Channel offsets for 4–8 frames | Tech. Risk: dated when overused | `glitch` shader, `rgb-glitch-text` |
| Infinite zoom | Each frame holds the next (shop → phone → record → shop) | Loop endings | Hand-built nested copies |
| Paper tear / curtain | Torn paper, a curl, a curtain | Paper, collage | `torn-paper-rip`, paper and curtain transitions |
| Liquid fill | Fluid floods the frame | Liquid products | Hand-built goo or displacement |

### Camera

| Move | Recipe | Fit |
| --- | --- | --- |
| Pull-back from a match | From the matched object at ~3.3× back to the phone, 0.46 s `power2.inOut` | After the shutter |
| Punch-in | An instant 1.3–2× crop on a beat | Emphasis |
| Shake on impact | 3 frames, 6–16 px | Slams only |
| Zoom-on-action | A spring zoom to the point of action | Walkthroughs |
| Push / dolly | Only while something moves inside the frame; a slow push over a still screen reads dead | Building tension |
| Orbit | 3–5° a second around a stage or device | 3D devices |
| Dolly zoom | The background stretches (`camera-dolly-zoom`) | One "realisation" beat a film |
| Rack focus | Blur 0 ↔ 8–12 px over 0.4 s, paper soft → phone sharp (`rack-focus`) | Two depth planes |
| 2.5D parallax | Near : mid : far ≈ 1 : 0.5 : 0.2 | Photos of real places |
| Beat pulse | Scale 1 → 1.04 on downbeats, 0.1 s decay | Music-led. Risk: reads as a loop when constant |

### Framing and the read band

- **Read band.** Words that must be read sit inside it ([promotion-contract.md](./promotion-contract.md) → **Frame sizes and safe zones**).
- **Full frame.** The app or the old-way object fills most of the frame (a phone at ≥ ~60 % of the width, or full-bleed UI). It continues below the band (below y 1248 on the master), blurred, with no readable words, so the bottom third is never empty: start with an 18–40 px backdrop blur, its top edge feathered over ~26 px.
- **Text floor.** Meaning-bearing text renders ≥ 28 px; aim for 29 px and up. Pick the app's scale so its smallest read string clears it: scale ≥ 29 ÷ that string's source px (a 390-wide mockup screen at 2.56× fills ~1000 px and renders 12 px text at 31 px).
  - A string that can't clear it isn't read: a caption or a label carries its meaning.
  - Text that reads as texture (rolling digits, blurred rows, chat floods) needs no floor.

### Type, sizes, colour, contrast

| Role | 9:16 px | 4:5 px | Per line | Lines |
| --- | --- | --- | --- | --- |
| Title, hook | 96–150 | 84–120 | ≤ 5 words, ≤ 950 px | ≤ 2 |
| Caption (key phrase) | 64–76 | 56–68 | ≤ 5 words, ≤ 24–27 characters | ≤ 2 |
| Label | 44–56 | 44–52 | ≤ 4 words | 1 |
| End card: name · offer · button label · URL | 80–112 · 56–88 · 48–60, on a button ≥ 120 px tall · ≥ 36 | × 0.9 | — | — |

- Size runs title > caption > label ≥ UI text. Older, second-language and low-literacy viewers get the upper sizes and fewer words, never slower cuts.
- Measure line widths in px in the rendered font. Long compounds get soft hyphens with the right `lang`. Scripts without capitals use weight and size where the style says caps.
- Right-to-left languages right-align and mirror the layout, the caption positions and the `--caption-zone` runs.
- **Contrast.** Every read string has ≥ 4.5:1 contrast; 3:1 only at ≥ 72 px. HyperFrames' `check` passes 3:1 from 24 px, so pick each text and ground pair from their hexes.
  - A product string under 4.5:1 in the product's own colours isn't used as proof; a caption or label carries it.
  - Overlay cues use one accent a frame, ≥ 3:1 against both the UI and the ground.
- Words never sit over the change they describe. HyperFrames' default portrait captions sit in the bottom unsafe zone; place captions inside the read band.
- A voiced film ships a caption file (`.srt`) with its render.

### Brand kit

The seller's constants, from the Brief's **Brand kit** ([studying-product.md](./studying-product.md) → **3. Write the Brief**). They are the same in every preset, whatever the device:

| Element | Use |
| --- | --- |
| Mark | A frame-0 cue or an early watermark, seen by ~3–5 s; never a logo card at the open. On the end card it lands on the track's final hit |
| Colours | The seller's grounds, captions and end card; never inside the product's UI. Check each text-on-colour pair once against **Type, sizes, colour, contrast** |
| Type | Every caption, title, label and the end card, in every world |
| Sonic cue | An in-house sound with the mark's early touch, and on the end card after the track's final hit has rung, never on the hit; never a stock track's ending, since the Pixabay licence bars trademark use |
| End-card layout | One layout in every film (**End card**) |

- How often the brand is seen and heard: [writing-script.md](./writing-script.md) → **Brand touches**.
- **Series device** (optional): one scenario, line or character that recurs across a product's promotions. It rides with the kit and never replaces a film's signature device.

### Disclosure on screen

What the disclosure says and where it goes: [promotion-contract.md](./promotion-contract.md) → **Disclosure**. How it looks:

| Element | Look |
| --- | --- |
| "Sample" chip | The app's own chip style (muted ground, muted text) in the app's header, beside the app's name. At the app's scale its text renders 28–32 px. Quiet: never a big dark pill or a badge outside the app |
| Disclosure line | One line of plain text in the seller's type, 28–32 px, weight 600, centred near the top of the read band (y ≈ 300–360) on the ground. It fades in over ≤ 0.15 s, then holds still, running on across scene cuts, for the time **Disclosure** sets |
| "Illustrative" | Muted text at the chip's size, beside the AI result's own chip, on screen as long as the result |
| A sample number outside the app (data-as-type) | A small, quiet tag under the number: "Sample", or "Sample · Illustrative" for an AI result |
| End card | The disclosure line as one of the card's lines, at its secondary size |

### Frame 0 and the cover

- Frame 0 reads in 0.25 s and works as a still: the hook, the audience's world or old-way object, and the brand cue (**Brand kit**). It is never black and never a logo alone. Its words: [writing-script.md](./writing-script.md) → **Hook lines**.
- After it, the picture builds into the drop through 3–6 s, where viewers decide; never a still there. The ≥ 3 visual states by 5 s: [choosing-style.md](./choosing-style.md) → **Energy scale**.
- Frame 0 is the cover: for viewers without autoplay, the still is the ad. Hand it over with the render (`npx hyperframes snapshot --at 0`).

### End card

1. The card enters through the last object (the result shrinks into place) or cuts in on the track's final hit, where the mark lands: scale 1.6 → 1 in ~0.28 s `expo.out`, starting ~60 ms early. The track's real ending plays under it, never a fade ([directing-sound.md](./directing-sound.md) → **Cutting**).
2. Then, a beat or so apart: the offer, the button with the CTA line, the URL, and the disclosure line.
3. ≤ 10 unvoiced words in all; words the voice says are free. Over budget → drop the URL first; the button carries the destination.
4. Hold the card, dead still, until its words can be read ([writing-script.md](./writing-script.md) → **Voice, captions, picture**; `check` asks ≥ 2 s for the film's last line), and through the music after the last spoken word ([directing-voice.md](./directing-voice.md) → **Ending**).

| Layout | Holds | Use |
| --- | --- | --- |
| Brand card | The seller's ground; mark, name, offer, button, URL, disclosure line | The default |
| Product + CTA chip, or a loop | The payoff screen with a CTA chip and the mark, or a return to frame 0 with the CTA | Product-led films; loop endings |
| Lockup | Mark, name, one line, CTA | Pro and developer audiences |
| Store badges | `store-badge-lockup` | Installable apps |

- A callback (the hook frame with the pain struck through) may lead into the card.
- The CTA's words and its button verb: [writing-script.md](./writing-script.md) → **Offer and CTA**.

### Template tells

| Tell | Blocks that ship it | Instead |
| --- | --- | --- |
| Click rings; a camera trailing the cursor | `press-ripple`, `agent-cursor`, `cursor-zoom-follow` | A tap dot or a press (`touch-indicator`, `gesture-tap`) |
| Text that moves while it's read | `hw-callout-circle`, `hw-box-label` | Landed text dead still |
| Idle float; phones floating on gradients | `device-frame-stage`, `multi-device-splay` | Freeze the device on a real ground |
| Feature tours panning screen to screen | `pan-stations`, `sticky-mock-swap`, `screen-flow-carousel` | One flow, each seam a flow step |
| Glow, neon | `logo-outro` | The kit's end card |
| Yellow word-by-word karaoke; word-by-word captions over UI | `caption-highlight` | Key-phrase captions |
| A small whole phone on empty ground; one ease on everything; breathing loops | — | **Full frame**; **Motion in ten lines** 2 and 9 |
| A photoreal phone orbiting | `vfx-iphone-device` | The flat screen first |

### Building in HyperFrames

Follow the hyperframes and hyperframes-registry skills, found per [promotion-contract.md](./promotion-contract.md) → **Discover dependency skill**, in the folder that contract's **Output layout** sets.

1. **Registry first.** For each named move, run `npx hyperframes catalog --query "<the move, in English>" --json`, then `npx hyperframes add <name>`. Take the largest unit that fits and edit it; hand-build only when nothing fits.
   - Most blocks are 1920×1080: re-lay each for 1080×1920 (positions, sizes, the read band) before use, point its colour and font variables at the brand kit, and strip any drift, glow or idle loop.
2. **The grid.** `index.html` holds `<script id="grid">`, the one place every time comes from. Write each constant as `var NAME = <number>;`, the pattern [`retime.mjs`](../scripts/retime.mjs) reads:

   ```html
   <script id="grid">
     window.GRID = (function () {
       var BPM = 120;          // the track's tempo; 120 is the placeholder until the track is in
       var BEATS_PER_BAR = 4;
       var DROP_BAR = 4;       // the bar the drop lands on; bar 0 = the cut's first downbeat (0 s)
       var APP_BARS = 11;      // bars from the drop to the track's ending hit
       var BEAT = 60 / BPM, BAR = BEATS_PER_BAR * BEAT;
       function at(bar, beat) { return bar * BAR + (beat || 0) * BEAT; }
       return { BPM: BPM, BEATS_PER_BAR: BEATS_PER_BAR, DROP_BAR: DROP_BAR, APP_BARS: APP_BARS,
                END_BAR: DROP_BAR + APP_BARS, BEAT: BEAT, BAR: BAR, at: at };
     })();
   </script>
   ```

   - The real BPM and `DROP_BAR` come from [directing-sound.md](./directing-sound.md) → **The grid**.
   - Until the track is in, `node retime.mjs --bed` writes a placeholder click bed to `assets/music/bed.mp3` (needs ffmpeg).
3. **Slots, not seconds.** Scene hosts and sounds carry `data-at="bar:beat"`, and a span also carries `data-at-end` (`<div id="hook" … data-at="0:0" data-at-end="D:0">`, `<audio id="fx-total" … data-at="D+3:0">`).
   - A bar is a number, `D` (`DROP_BAR`), `E` (`END_BAR`), or `D+n`, `D-n`, `E+n`, `E-n`. Beats may be fractional: `D:0.75` is three 16ths after the drop.
   - `node retime.mjs [file.html]` (default `index.html`) writes each `data-start` and `data-duration` from them, always reading the grid from `index.html`. Run it after every grid or slot change.
   - Voice clips carry no `data-at`; they're placed in seconds from measured onsets ([directing-voice.md](./directing-voice.md) → **Placement on the grid**).
4. **Inside a scene,** time every tween from `window.GRID.at(bar, beat)` minus its host's start, so a grid change moves the picture with the sound.
5. **Motion blur.** Put `data-motion-blur="on"` on the root composition of a fast film (it costs ~2–3× the render time), and `data-motion-blur="off"` on a subtree that carries its own blur.
6. **Texture text** (rolling digits, blurred rows, chat floods) carries `data-layout-ignore`; the blur band below the read band carries `data-layout-allow-occlusion` and `data-layout-allow-caption-zone`.
7. **Look at it.**
   - `npx hyperframes check` runs lint, layout, motion and contrast; add `--snapshots` on the first full pass. Run `--caption-zone` once per unsafe zone; the master's are `x0=0;y0=0;x1=1;y1=.14`, `x0=0;y0=.65;x1=1;y1=1`, `x0=0;y0=0;x1=.06;y1=1` and `x0=.94;y0=0;x1=1;y1=1`.
   - `npx hyperframes snapshot --at <t,…>` at each scene's midpoint and each landing; read the PNGs. Judge in the preview with sound; the gates are in [checking-promotion.md](./checking-promotion.md).

## Related

- [promotion-contract.md](./promotion-contract.md) — frame sizes and safe zones, honesty rules, disclosure, output layout
- [choosing-style.md](./choosing-style.md) — the dials, the signature device, presets
- [writing-script.md](./writing-script.md) — hook lines, captions and the reading budget, brand touches, offer and CTA
- [directing-sound.md](./directing-sound.md) — the music clock, the grid, cutting, sound effects
- [directing-voice.md](./directing-voice.md) — placing the voice on the grid
- [checking-promotion.md](./checking-promotion.md) — G3 and the diagnostics

## References

- Carbon motion (productive vs expressive durations): https://carbondesignsystem.com/elements/motion/overview/
- WCAG 2.2, three flashes or below threshold: https://www.w3.org/WAI/WCAG22/Understanding/three-flashes-or-below-threshold.html
- WCAG 2.2, contrast (minimum): https://www.w3.org/WAI/WCAG22/Understanding/contrast-minimum.html
- Meta ad standards, non-existent functionality: https://transparency.meta.com/policies/ad-standards/deceptive-content/non-existent-functionality/
- Pixabay licence summary (no trademark use): https://pixabay.com/service/license-summary/
- HyperFrames docs (motion blur, registry, check): https://hyperframes.heygen.com/llms.txt
