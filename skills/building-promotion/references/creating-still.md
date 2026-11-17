# Creating Still

## Overview

**Execution mode.** Makes a still promotion, a single image or a carousel, copy first: from concepts on paper to PNG and JPEG renders. Changes any part of an existing still whenever the user asks.

## Prerequisites

Per [promotion-contract.md](./promotion-contract.md): **Output layout**, **Products and promotions**, **promotion.md**, **Frame sizes and safe zones**, **Honesty rules**, **Disclosure**, **Media and paid calls**.

The craft lives in [choosing-layout.md](./choosing-layout.md), [writing-copy.md](./writing-copy.md) and [directing-still.md](./directing-still.md). The gates live in [checking-still.md](./checking-still.md).

## Guidelines

### 1. Resolve the request

Resolve the promotions root first, per [promotion-contract.md](./promotion-contract.md) → **Resolve promotions root**. When there is no product, or no **Study** yet, run [studying-product.md](./studying-product.md) first, then continue here.

| Request | Step |
| --- | --- |
| A new still, or more concepts | 2 |
| Change the structure, the format or the frame count | 2, then 3 and the steps the change reaches |
| Change what it says | 3, then 5 |
| Change the preset or the look | 4, then 5 |
| Change a frame's picture or layout | 5 |
| A new ratio, or a render | 6 |

Read the promotion's files for what exists, and redo only what the change reaches.

### 2. Propose concepts

1. From **Study**, **Message** and the formats asked (single, carousel, or both), suggest 3 structures per format per [choosing-layout.md](./choosing-layout.md) → **Choosing**.
2. Dress each as a concept card per [choosing-layout.md](./choosing-layout.md) → **Concept cards**.
3. Show the cards. The user picks one or more, mixes them, or steers ("warmer", "show the payslip"). Steering gets 3 new cards that keep what they liked; repeat until they pick.
4. Each pick becomes its own promotion folder, `<promotions-root>/<NN-slug>/`. Write its `promotion.md` from [`../assets/still-promotion.md`](../assets/still-promotion.md), with its **Spec**.

### 3. Frame sheet

1. Fill **Message plan** per [writing-copy.md](./writing-copy.md) → **The jobs on a still**.
2. Write **Frame sheet** per [writing-copy.md](./writing-copy.md) → **The frame sheet**.
3. Run S1 and S2 per [checking-still.md](./checking-still.md), and fix what they find.
4. Show the frame sheet, the words-only read and what the gates found. Wait for the user's approval on paper.

### 4. Style test

1. Copy [`../scripts/render-still.mjs`](../scripts/render-still.mjs) into the folder. Write `styles.css` and frame 1's page in the master ratio, dressed by the picked preset, per [directing-still.md](./directing-still.md).
2. Render it (`node render-still.mjs frames/01-<ratio>.html`) and run S3 on it.
3. Show the render and its thumb. The user approves the style, or picks another preset or look: repeat this step.

### 5. Build

1. Build every frame in the master ratio, then each further ratio as its own page, per [directing-still.md](./directing-still.md) → **Frame pages** and [promotion-contract.md](./promotion-contract.md) → **Disclosure**.
2. Render them all (`node render-still.mjs frames/*.html --sheet`) and run S3. Fix what it finds.
3. The user reviews the renders and the sheet. Feedback → change the pages and run 5.2 again. Repeat until the user approves.

### 6. Final

1. Render the delivered set: a PNG and a JPEG per frame and ratio. List them under **Files** in posting order.
2. Offer S4 per [checking-still.md](./checking-still.md).

### 7. Confirm to the user

Delete the `assets/` files nothing reads. Reply with:

- The promotion folder and its renders, in posting order
- What the gates found
- The image credits, when a photo is used
- Next: posting-content can post the set; the post text carries the CTA's destination and the terms the image leaves out
