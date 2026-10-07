# Managing Style

## Overview

The craft rules every step applies: named style directions to propose, look rules, motion rules, and the self-critique loop that runs before the user sees any frame.

## Guidelines

### Style directions

Propose from this table; adapt colors and type to `brand.md`.

| Direction | Look | Type | Motion | Fits |
| --- | --- | --- | --- | --- |
| Product hero | Real screens as floating cards on a calm field, soft shadow, one accent | Geometric sans, display 700 | Camera push-ins, cards enter `power3.out`, UI morphs between states | App and SaaS demos, launches |
| Kinetic type | Full-bleed type, two colors | Grotesk or condensed display 800–900, tracking −2% | Words land on beats, scale 0.92 → 1, hard cuts | Message-led hooks, pain statements |
| Editorial | Off-white field, wide margins, 3–5% film grain | Serif display, sans UI | Slow 1–1.5 s eases, parallax, blur cross-dissolves | Premium and B2B, considered purchases |
| Data punch | Dark or brand field, one huge number, simple charts | Display with tabular figures | Count-ups, bars grow from the baseline, `back.out(1.2)` | Proof: savings, speed, results |
| Playful | Saturated color blocks, rounded shapes, thick outlines | Rounded sans | `back.out(1.7)` overshoot, squash and stretch, bouncy staggers | Consumer apps, younger segments |
| Testimonial | One real quote large, product screen behind | Serif or sans quote, small attribution | Line-by-line `clip-path` reveals, slow drift | Social proof from reviews |

### Look rules

- One display typeface, one UI typeface, one accent color, unless `brand.md` says otherwise.
- Hook in the first 2 s or on slide 1: the segment's pain in their words, or the payoff. Never the logo or a title card.
- Something new on screen every 2–4 s; no static hold over 3 s.
- On a 1080-wide frame: headlines ≥ 96 px, other text ≥ 42 px, contrast ≥ 4.5:1. Respect the channel's safe zone.
- ≤ 7 words per card, in the segment's words rather than feature names.
- End on a CTA card (action or link, then logo) held ≥ 1.5 s.
- Carousel: slide 1 is the hook alone, one idea per slide, the last slide is the CTA, one grid and a page indicator throughout.
- Store screenshots: a caption of ≤ 5 words naming the benefit above a real screen; the first three tell the story.
- Banned: centered text on a gradient, everything fading in, particle bursts, lens flares, glows on UI, frame borders, corner labels, stock-photo people, invented UI, decorative emoji, drop shadows on text, more than two typefaces.

### Motion rules

| Movement | GSAP ease | Duration |
| --- | --- | --- |
| Entering | `power3.out` or `expo.out` | 0.4–0.7 s |
| Moving on screen | `power2.inOut` | 0.6–1.0 s |
| Exiting | `power2.in` | 0.25–0.4 s |
| Big type or logo landing | `expo.out`, or `back.out(1.2)` | 0.6–0.9 s |
| Playful overshoot | `back.out(1.7)` | 0.4–0.6 s |
| Drift during a hold | `none` | The whole hold |

- Enter from scale 0.9–0.95 with opacity 0, never from scale 0.
- Stagger lists 0.03–0.08 s. Start the next action before the previous one ends (~30% overlap).
- Nothing fully stops: holds drift 1–3% in scale or 10–20 px.
- Animate `transform`, `opacity`, `clip-path`, and filters; leave layout properties still.
- Cuts and major entrances land on beats; smaller moves fall between them.
- One element changing state (button → field → loader → check) beats a cut between screens.
- Randomness comes from a seeded generator, so every render matches.

### Self-critique

Runs before every pick is shown.

1. Render what the step produced: style frames; the storyboard contact sheet; for the final, `snapshot --frames 12` plus a phone strip, `ffmpeg -i <render>.mp4 -vf "fps=1,scale=360:-1,tile=5x3" -frames:v 1 <asset>/review/phone.png`.
2. Look at the images and score each criterion 1–10:

   | Criterion | 8+ means | Steps |
   | --- | --- | --- |
   | Hook | First 2 s or slide 1 shows the pain or the payoff at a glance | All |
   | Readability | Every word legible at 360 px wide | All |
   | Brand | Colors, type, logo, and voice match `brand.md` | All |
   | Composition | One focal point, balanced, inside the safe zone | All |
   | Banned looks | None present (10), any present (1) | All |
   | Variety | Something new every 2–4 s | Storyboard, final |
   | Motion | Eases per **Motion rules**, no dead beats, no static hold over 3 s | Final |
   | Sound | Cuts and hits on beats, music under SFX, loudness on target | Final |

3. Log scores and the three worst problems in `review/round-NN.md`. Fix those three, re-render only what changed, and score again.
4. Stop when every score is 8+, or after 4 rounds; report any score still below 8.
