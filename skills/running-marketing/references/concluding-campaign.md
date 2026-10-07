# Concluding Campaign

## Overview

**Authoring mode.** Phase 7, Conclusion: runs after `ended`, freezes the counts in `results.md`, states the verdict, and proposes the next idea. Sets `concluded`.

## Prerequisites

Per [marketing-contract.md](./marketing-contract.md) → **States**. Counts: [measuring-campaign.md](./measuring-campaign.md).

## Guidelines

### 1. Freeze the counts

Run [measuring-campaign.md](./measuring-campaign.md) steps 1–2 with `{{UNTIL}}` = now. Write `results.md` from [`../assets/results.md`](../assets/results.md) with that cut-off; later conversions show in reports as late and never change the verdict.

### 2. State the verdict

| Verdict | When |
| --- | --- |
| Worked | Conversions ≥ `goal` |
| Partly | Below `goal`, but one asset, segment, or message converted clearly better than the rest |
| Did not work | Below `goal` with no stand-out row |

Name the likely cause by walking the six questions from the bottom: no clicks → channel or message; clicks without conversions → the landing or the offer; replies without conversions → proof or trigger.

### 3. Propose the next idea

What to keep, what to change, and one next idea framed as the six questions. Positioning changes (a new segment, a new pain quote) go into `positioning.md` and the segment file.

### 4. Confirm to the user

Write **Conclusion**: verdict and a link to `results.md`. `state: concluded`; update the `index.md` row. Reply with the verdict, the three numbers that decided it, and the next idea; _"start a campaign from NN"_ sets `follows`.
