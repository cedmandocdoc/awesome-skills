# Concluding Campaign

## Overview

**Authoring mode.** Phase 7, Conclusion: runs after `ended`, freezes the counts in `results.md`, states the verdict, and proposes the next idea. Sets `concluded`.

## Prerequisites

Per [marketing-contract.md](./marketing-contract.md) → **States**. Counts: [measuring-campaign.md](./measuring-campaign.md).

## Guidelines

### 1. Freeze the counts

Run [measuring-campaign.md](./measuring-campaign.md) step 3 with `{{UNTIL}}` = now. Check the conversions against the app's own count of the event between `start` and the cut-off (its database, or ask the user); more than the app counted → fake rows per [marketing-contract.md](./marketing-contract.md) → **Measurement**: say so in `results.md` and judge on the app's count. Write `results.md` from [`../assets/results.md`](../assets/results.md) with that cut-off; later conversions show in reports as late and never change the verdict.

### 2. State the verdict

| Verdict | When |
| --- | --- |
| Worked | Conversions ≥ `goal` |
| Partly | Below `goal`, but one asset, segment, or message converted clearly better than the rest |
| Did not work | Below `goal` with no stand-out row |

Name the likely cause by walking the six questions from the bottom, per [marketing-contract.md](./marketing-contract.md) → **Measurement** → **Where people stop**.

### 3. Propose the next idea

Read **Execution** → **Check-ins** for what was tried. What to keep, what to change, and one next idea framed as the six questions. Add a **Learned** line to the campaign's segment in `positioning.md`; a new segment or pain quote goes there too.

### 4. Confirm to the user

Write **Conclusion**: verdict and a link to `results.md`. `state: concluded`; update the `index.md` row. Reply with the verdict, the three numbers that decided it, and the next idea; _"start a campaign from NN"_ sets `follows`.
