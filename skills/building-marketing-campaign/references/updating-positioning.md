# Updating Positioning

## Overview

**Authoring mode.** Brings `positioning.md`'s product facts in line with a product change, in the same work as the change, and lists the campaigns the change reaches. Runs from the standing rule in `SKILL.md` → **Setup**, or on "refresh positioning".

## Prerequisites

Per [marketing-contract.md](./marketing-contract.md) → **Resolve marketing root**, **Positioning**, **States**.

## Guidelines

### 1. Read the change

The work's diff, or the files the user names. No change to what the product does, its pricing or plans, or the code that confirms a conversion event → stop without edits.

### 2. Update the product facts

| Section | Edit |
| --- | --- |
| **What it does** | Rewrite the sentence when the outcome changed |
| **Offer** | Pricing, plans, free tier, trial as the code now has them |
| **Conversion events** | Each event's `path#symbol`; a moved or renamed handler keeps its `conversion('<event>')` call after the success response per [configuring-measurement.md](./configuring-measurement.md); a removed event is marked removed |

**Proof** and **Alternatives and differentiator** claims the change makes untrue → list them for the user. Market sections and `reviewed` stay as they are.

### 3. Check the campaigns

Per campaign not `concluded` or `dropped`, compare **Idea** (message, proof, offer, CTA) and `conversion` with the updated facts. Campaigns stay unedited; a mismatch is fixed through [updating-campaign.md](./updating-campaign.md) when the user asks.

### 4. Confirm to the user

Reply with the sections changed, untrue claims, and per mismatched campaign its id, state, and what no longer matches; a removed conversion event on a `live` campaign comes first, since its conversions stop counting.
