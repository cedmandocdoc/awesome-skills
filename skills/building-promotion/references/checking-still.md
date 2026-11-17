# Checking Still

## Overview

The gates a still passes before the user sees it. An S1–S3 failure is fixed before the user sees the frame sheet, the style test or the renders; the reply reports what each gate found.

## Guidelines

### When each runs

| Gate | Runs on | When |
| --- | --- | --- |
| S1 Cold read | The frame sheet | Before the user sees it |
| S2 Copy budget | The frame sheet | Same |
| S3 Measured | The style test and every render | Before each render the user is shown |
| S4 Real viewers | The final | Offered once; optional |

### S1 Cold read

A fresh subagent sees only the frame sheet's read words and picture descriptions, frame by frame. It doesn't see the Brief or the Study. Then it sees frame 1 alone; a single gets a 1-second glance instead. It answers:

- who it's for, and what problem of theirs it is about;
- how the app helps with it;
- what is sold, and who sells it;
- what's free or what it costs;
- what to do next.

On frame 1 alone, or the glance, it answers only the first, and why it would look closer or swipe. Its answers must match the **Message plan**. A miss is fixed in the frame or zone that owns that job, per [writing-copy.md](./writing-copy.md).

### S2 Copy budget

| Check | Passes when |
| --- | --- |
| Structure | Every zone or frame of the structure is present, in order; a carousel's frame count is within its range ([choosing-layout.md](./choosing-layout.md)) |
| Focal point | Each frame names one |
| Words | Within [writing-copy.md](./writing-copy.md) → **Word budgets** |
| Jobs in place | The promise in the headline or frame 1; the builder and the sold line where [writing-script.md](./writing-script.md) → **Sold vs shown** puts them; the offer never in a headline, except in Offer card |
| Claims and offer | Within the cap; the offer ≤ 6 words; no terms on the image |
| Words-only read | [writing-copy.md](./writing-copy.md) → **The words-only read** passes |
| Honesty scan | [writing-script.md](./writing-script.md) → **Honesty scan for words** finds nothing, and nothing from the Brief's **Never say** appears |

### S3 Measured

`render-still.mjs` measures each page ([directing-still.md](./directing-still.md) → **Rendering**):

| Area | Passes when |
| --- | --- |
| Size | The render is exactly the page's `data-size` |
| Fonts | Every `data-read` element's font is an `@font-face` loaded from the folder; no fallback |
| Read area | Every `data-read` element sits inside the ratio's read area, no ancestor clips it, and no two overlap |
| Type | Every `data-read` element is ≥ 26 px as rendered |
| Contrast | Every `data-read` element on a solid ground is ≥ 4.5:1, or 3:1 at ≥ 72 px; one over an image is listed for the eye check |
| Disclosure | Every `data-app` container shows its Sample chip inside its visible area; a chip under 18 px has the disclosure line on the same frame |
| Files | No request left the folder and none failed |

Then, by eye, on the renders:

| Area | Passes when |
| --- | --- |
| Thumb read | At the thumb, the focal point and the headline still read |
| Disclosure and honesty | The disclosure line on the first frame that shows the app, and on a carousel's last frame; "Illustrative" on every AI result; no outcome-promise line readable; no platform UI. Per [promotion-contract.md](./promotion-contract.md) → **Disclosure**, **Honesty rules** |
| Listed contrast | Each pair the script listed reads against its image |
| Carousel | Frame 1 works alone; the swipe cue shows; the grid, type and mark position hold across frames; no word crosses a frame edge |
| Ratios | Each further ratio keeps every read word inside its read area and the same read order |

### S4 Real viewers

Offered once after the final, before the user posts it; it never blocks.

1. The skill writes four questions: "What problem is it about? What is it offering? Who makes it? What would you do next?"
2. 5–8 people from the audience, who haven't seen the Brief, each see the still once on their own phone at feed size, swiping a carousel through.
3. The user brings back the answers. A frame most of them miss is fixed and re-rendered.
