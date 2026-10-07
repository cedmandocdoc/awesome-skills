# Continuing Asset

## Overview

**Authoring mode.** Applies the user's pick or change request to an asset, runs the step that follows, and stops at the next pick. One step per request.

## Prerequisites

Per [asset-contract.md](./asset-contract.md) → **Resolve assets root**, **asset.md**, **States**, **Channel specs**. Craft rules: [managing-style.md](./managing-style.md). Sound: [managing-audio.md](./managing-audio.md). Composition authoring follows the HyperFrames skills (`/hyperframes-core`).

## Guidelines

### 1. Find the asset

Per [asset-contract.md](./asset-contract.md) → **Resolve assets root**. A `dropped` asset takes no edits. Read `asset.md`.

### 2. Record the input

Add one dated **Decisions** line: the pick, or the change request in the user's words. "Go" or "skip" means the recommended option.

| Input | Run |
| --- | --- |
| Pick for the current state | The next step per [asset-contract.md](./asset-contract.md) → **States** |
| Change to the current step | That step again, changed |
| Change to an earlier step | Set `state` to that step and run it; keep later picks as defaults where they still fit |
| New format on a `done` asset | **Final** for that format only; stay `done` |
| "Drop it" | `state: dropped`; stop |

### 3. Style

1. Set `kind`, `channels`, `formats` from the picked concept. Scaffold once: `npx hyperframes init <asset>/project --resolution <portrait|square|landscape> --non-interactive`; for 1080×1350 set `data-width`/`data-height` on the root.
2. Pick 2–3 directions from [managing-style.md](./managing-style.md) → **Style directions** that fit the concept and brand. When the user attached references, one direction follows them; write what it takes (palette, type, pacing, texture) and what it leaves (subject).
3. Per direction, compose the concept's hook moment as a 1-second composition (`compositions/style-<letter>.html`) and render it: `npx hyperframes render -c compositions/style-<letter>.html --format png-sequence --fps 1 -o review/style-<letter>`; copy the frame to `style/<letter>.png`.
4. Self-critique per [managing-style.md](./managing-style.md) → **Self-critique** (look criteria only).
5. Write **Style**: per frame, the direction name, one-line rationale, and path; mark one **Recommended**. When `brand.md` has `source: derived`, show it for confirmation.
6. `state: style`.

### 4. Track

Videos only; an image or carousel goes from **Style** to **Storyboard**. Per [managing-audio.md](./managing-audio.md) → **Music search**, write **Track** with 2–3 search links and the minimum length. `state: track`.

### 5. Storyboard

1. Music file present → [managing-audio.md](./managing-audio.md) → **Track intake** and **Beats**.
2. Write **Storyboard** as a shot list (video) or slide list (carousel, screenshots); an image skips to **Final**:

   | Field | Content |
   | --- | --- |
   | When | Time range on the beat grid (`0.00–1.95`), or slide number |
   | Screen | What is visible; which real screen or capture asset |
   | Text | On-screen words, ≤ 7 per card |
   | Motion | Entrances, camera, transition into the next shot |
   | Sound | SFX cue or musical hit it lands on |

3. Build each shot as a still in the project at its key moment, snapshot it (`npx hyperframes snapshot <asset>/project --at <t1>,<t2>,… --no-end -o <asset>/review/storyboard`), and tile the frames: `ffmpeg -pattern_type glob -i '<asset>/review/storyboard/*.png' -vf "scale=360:-1,tile=<cols>x<rows>" <asset>/review/storyboard.png`.
4. Self-critique to 8+.
5. `state: storyboard`.

### 6. Final

1. Animate per [managing-style.md](./managing-style.md) → **Motion rules**; place sound effects per [managing-audio.md](./managing-audio.md) → **Sound effects**.
2. `npx hyperframes lint` and `npx hyperframes check`; fix every error.
3. Self-critique on `npx hyperframes snapshot <asset>/project --frames 12` until every score is 8+.
4. Render each format into `out/`: video `npx hyperframes render -o <asset>/out/<code>-<w>x<h>.mp4 --quality high`, then the loudness pass per [managing-audio.md](./managing-audio.md) → **Mix**; carousel and screenshots one PNG per slide (`<code>-<w>x<h>-NN.png`); `poster.png` from the strongest frame. Each extra aspect ratio gets its own composition laid out for that frame, not a crop.
5. Write **Deliverables**: file, format, channel, code. `state: final`.

On approval: `state: done`.

### 7. Confirm to the user

Mirror the state into `index.md`. Reply with:

- What changed and the files to open (style frames, contact sheet, renders), plus `npx hyperframes preview <asset>/project` for videos
- The options with a one-line explanation each and the recommendation
- Critique scores below 9 and what was traded off
- The ask for the next pick; at `done`, the asset code for campaign links
