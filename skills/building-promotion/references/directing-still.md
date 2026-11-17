# Directing Still

## Overview

How a still looks and is built: the presets, what a still keeps from a video's picture rules, type and contrast at still sizes, the brand on a still, template tells, and the frame pages and their render. The structure is in [choosing-layout.md](./choosing-layout.md); the words in [writing-copy.md](./writing-copy.md).

## Guidelines

### Presets

Each preset is one look around one focal device; every other choice stays plain. Take it whole or swap any dial. The seller's brand kit rides unchanged over every preset.

| # | Preset | Focal device | Structures | Look · type · UI | Fits |
| --- | --- | --- | --- | --- | --- |
| 1 | **Swiss Grid** | One large line of type on a strict grid, with hairlines and mono labels | Statement, Range, Listicle, How it works, Range tour | Flat brand planes; a carousel alternates the seller's grounds frame by frame · a heavy grotesk, tight tracking, mono labels · UI cropped into grid cells | The seller's own message; professional and SME audiences |
| 2 | **Product Hero** | The app's key screen, large, its result standing out of it | Hero screen, Result shown, Anatomy | A flat ground in the seller's colour · grotesk · a phone ≥ 60 % of the frame's height, or full-bleed UI | A category known by name |
| 3 | **Paper Desk** | The old-way artifact, top-down, full-bleed | Pain call-out, Before / After, Problem → Solution | A real paper world built in HTML/CSS · handwriting only inside the artifact, the seller's type outside it · the app enters as a phone laid on the desk | A pain kept on paper |
| 4 | **Split** | A hard seam: the old way on one side, the app on the other, the same task in both | Before / After, Before / After per task | Paper against a flat plane · grotesk labels · on 9:16 the seam runs across | Fewer-steps stories |
| 5 | **Data Hero** | A number from the viewer's own work as the picture | Result shown, Listicle | Flat planes · the number at 60–90 % of the width · the screen small, as its proof; a sample number keeps its "Sample" tag | Totals and counts the viewer already keeps |
| 6 | **Exploded UI** | The app's pieces lifted out of the screen, large, over the dimmed phone | Feature trio, Anatomy | Flat planes · grotesk · lifted cards at one shadow depth | 3–4 features of one flow |
| 7 | **Editorial Quote** | The pain in the audience's words as a pull quote | Pain call-out, Statement | A plain ground with room · the quote at the top size · the app small, as the answer | Problem-aware; the words carry the pain |
| 8 | **Notes-app Lo-fi** | A phone-native note or list | Listicle, Pain call-out | A native UI look with no device frame, in licensed font files · the app's proof in the last frame or a corner | Ad-resistant viewers |
| 9 | **Offer Block** | The offer, large, on the seller's colour | Offer card | Flat colour · heavy type · one app crop | Warm, retargeted only |

### What a still keeps from a video

These sections of [directing-picture.md](./directing-picture.md) apply as written: **Looks and worlds** (≤ 2 worlds in a single, ≤ 3 in a carousel; the two-brands rule), **UI treatments** that hold still (phone, full-bleed UI, exploded, data-as-type, before / after split, card stack, macro close-up, tabletop stage), **Brand kit** and **Disclosure on screen**. Motion, camera, transitions and sound don't apply.

- **The UI is the app's own.** Each screen comes from the source's HTML and sample data, per [promotion-contract.md](./promotion-contract.md) → **Honesty rules**. A crop shows a real part of a real screen.
- Carry one datum (a name, a number, an item) from the input to the result when a frame or a carousel shows both.

### Type and contrast

| Role | 4:5 and 1:1 px | 9:16 px | Lines |
| --- | --- | --- | --- |
| Headline | 84–140 | 96–150 | ≤ 3, each ≤ 950 px wide |
| Subline | 40–56 | 44–60 | ≤ 2 |
| Label, callout, CTA strip | 30–48 | 32–52 | 1 |
| Disclosure line | 26–32 | 28–32 | 1 |

- Every read word is ≥ 26 px at 1080 px wide. The Sample chip stays in the app's own header at the app's scale; a frame whose chip renders under 18 px also carries the disclosure line.
- Contrast is ≥ 4.5:1 for every read word, 3:1 only at ≥ 72 px. Pick each text and ground pair from their hexes. A product string under 4.5:1 isn't used as proof; a label carries it.
- Words sit inside the ratio's read area ([promotion-contract.md](./promotion-contract.md) → **Frame sizes and safe zones**) and never over the detail they describe.

### Brand on a still

- The mark sits in the same corner of every frame, its symbol 48–72 px tall (a stacked lockup's name adds to that), inside the read area.
- A single closes on a CTA strip along the bottom of the read area: the offer, the CTA's verb and channel, and the disclosure line, in the seller's type.
- A carousel's last frame is the end card: the mark, the sold line or the seller's name, the offer, the CTA as a button, and the disclosure line, ≤ 20 words ([directing-picture.md](./directing-picture.md) → **End card**, Brand card layout).

### Template tells

| Tell | Instead |
| --- | --- |
| A small whole phone floating on a gradient | A phone filling the frame, or full-bleed UI, on a real ground |
| Everything centred and the same size | One focal point; a grid with a clear read order |
| Stock icons, emoji, 3D blobs as decoration | The app's own screens, the old-way artifact, the mark |
| More than 2 typefaces; handwriting for read words | The seller's type system |
| Glow, neon, stacked shadows | Flat grounds, one shadow depth |
| A "swipe →" sticker as the only carousel cue | An element running across the edge, or "1/5" |
| A headline naming the category ("Payroll software for SMEs") | The pain or the result, in their words |

### Frame pages

Each frame is one HTML page at its exact pixel size, in the still's folder per [promotion-contract.md](./promotion-contract.md) → **Output layout**:

| Rule | How |
| --- | --- |
| Size | `<body data-size="1080x1350">`; `html, body` set to that size, `margin: 0`, `overflow: hidden` |
| Read words | Every read word's element carries `data-read`, set to its role (`headline`, `subline`, `label`, `cta`, `disclosure`); the app's UI text doesn't |
| App | Each app screen's container carries `data-app`; the Sample chip inside it carries `data-chip`, or is found by its text "Sample" |
| Shared look | `styles.css` holds the seller's tokens, type and shared pieces; the product's tokens stay inside its screens |
| Fonts | `@font-face` from `assets/fonts/`, with their licences; never a system or a network font |
| Screens | Each screen a frame shows is copied into `assets/screens/` with the files it reads, then shown in an `<iframe>` scaled and cropped in place, or rebuilt in the page from the same markup |
| Offline | Every file the page reads is in the folder |
| Ratio | A further ratio is its own page, `<NN>-<ratio>.html`, laid out for that frame |

### Rendering

`node render-still.mjs <page.html…> [--sheet] [--jpeg-quality 90]`, run in the still's folder:

- writes `renders/<NN>-<ratio>.png` and `.jpg` at exactly the page's size, after its fonts, images and frames load; pages from several stills in one call are prefixed with their still's folder (`<still>--<NN>-<ratio>`);
- writes `renders/thumbs/<NN>-<ratio>.png` at ⅓ of the width, for the thumb read;
- with `--sheet`, writes `renders/sheet-<ratio>.png`: the frames side by side, in the order given, one row per still when the pages come from several;
- prints the S3 measures as JSON per page and exits non-zero when one fails ([checking-still.md](./checking-still.md) → **S3 Measured**).
