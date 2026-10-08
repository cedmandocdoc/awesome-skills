# Targeting Audience

## Overview

**Planning only.** Phase 2, Target: writes the segment file and the audience — named prospects for direct types, a described audience for broadcast types. Stops at state `targeting`.

## Prerequisites

Per [marketing-contract.md](./marketing-contract.md) → **campaign.md**, **States**. Types: [marketing-types.md](./marketing-types.md).

## Guidelines

### 1. Write the segment

`segments/<slug>.md` from [`../assets/segment.md`](../assets/segment.md) when missing: who exactly (role, organization type and size, location), trigger, where they gather, pain quotes with sources, disqualifiers. Reuse an existing file; add what this campaign learned.

### 2. Choose the market scope

| Situation | Scope |
| --- | --- |
| Market not chosen yet (no campaign concluded for this product) | Test about 3 segments with about 20 prospects each; go deeper where replies come |
| Market chosen | The campaign's one segment |

### 3. Build the audience

Per type in `types`:

| Types | Audience |
| --- | --- |
| `outbound`, `partnerships` | Research named people into `prospects.csv` |
| `referral` | Existing users who showed they like the product, from the user or the app's data |
| `content`, `community`, `paid` | Described audience under **Target**: platforms, accounts and hashtags they follow, groups by name and URL, paid targeting criteria |

`prospects.csv` columns: `id` (`p001`), `name`, `role`, `org`, `location`, `channel`, `contact`, `source_url`, `why`, `status`.

- `why` is one specific, verifiable fact that makes the first line personal (a recent post, an opening, a review of their business).
- `contact` is an address or handle the person or business published; never a guessed address.
- Local businesses: Google Places Text Search, `curl -s -X POST https://places.googleapis.com/v1/places:searchText -H "X-Goog-Api-Key: $GOOGLE_PLACES_API_KEY" -H "X-Goog-FieldMask: places.displayName,places.formattedAddress,places.websiteUri,places.nationalPhoneNumber" -d '{"textQuery":"<segment> in <city>"}'`, then each website for the contact and the `why`.

### 4. Confirm to the user

Write **Target**: the segment link, scope, audience size, sources used. `state: targeting`; update the `index.md` row. Reply with the segment summary, the audience count with 3 sample rows, gaps, and next: _"continue campaign NN"_ runs Roll-out.
