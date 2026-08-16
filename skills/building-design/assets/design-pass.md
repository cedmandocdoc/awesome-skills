# Design pass — [Pass ID]: [Pass Title]

> **How to use:** `design.md` must already be applied on the target platform. Paste **this pass only** into the current generation turn. See the task `README.md` for platform adapters.
>
> Draw a static frame board. Reuse chrome and component names from the README. Do not invent screens outside **In scope**.

---

## Pass metadata

| Field | Value |
| --- | --- |
| **Pass ID** | `[NN]` |
| **Title** | [Short title — e.g. Auth flow, Home, Settings] |
| **Depends on** | [Prior pass IDs, or `none`] |
| **File** | `[NN]-[slug].md` |

---

## Objective

[One or two sentences: which labeled frames this pass must add to the board.]

---

## Viewport

| Platform type | Frames for screens in this pass |
| --- | --- |
| **Desktop / web application** | Desktop `[width × height]` · Tablet `[width × height]` · Mobile `[width × height]` |
| **Mobile-only application** | Mobile `[width × height]` only |

**Active for this handoff:** [Desktop / web | Mobile-only]

---

## In scope (this pass only)

- [Screen, sheet, or flow step from UI specs]

## Out of scope (this pass)

- [Deferred to later passes]
- [PRD/FRD exclusions]
- Do not invent features, routes, or copy beyond this pass

---

## Design system reminder

Use exact values from `design.md`. Do not invent hex, fonts, spacing, radius, or elevation.

**Key do / don't:**

- Do: [1–2 constraints from `design.md`]
- Don't: [1–2 anti-patterns from `design.md`]

**Token references (keys only):** [e.g. `colors.primary`, `typography.text-body-base`, `spacing.space-md`, `rounded.radius-md`]

---

## Chrome

| Shell | Action |
| --- | --- |
| [Auth / App / Modal from README] | Draw the same fixed chrome inside every frame; change **only** the main content region |

---

## Components to use

| Instance | Notes |
| --- | --- |
| [Component/Variant from README] | [selected state, badge, validation, etc.] |

Prefer README component names. Do not create one-off duplicates of shared controls.

---

## Screens / states

### [Screen name]

**Route / ID:** `[routeId]` · **Roles:** [roles]  
**Purpose:** [one sentence]  
**Layout:** [shell + region notes]  
**Content:**

- [Headings, fields, CTAs — exact copy from UI specs]
- [Data displayed]

**Frames to draw:** one frame per viewport in the matrix for each state below.  
**States:** [idle, Loading, Empty, Error, Validation, Offline, …]  
**Affordances (visual only):** [what looks tappable or highlighted — not navigation to implement]

[Repeat for every screen in this pass.]

---

## Content & copy

| Location | Copy |
| --- | --- |
| [Screen / component] | [Exact string, or `[COPY TBD]`] |

---

## Frame steps (this pass only)

1. **[Step]** — Draw labeled frames for [screen · state · viewports]
2. **[Step]** — Draw labeled frames for [screen · state · viewports]
3. [Continue until every in-scope screen and state has frames]

---

## Done checklist (this pass)

- [ ] All **In scope** items drawn as frames
- [ ] Nothing from **Out of scope** generated
- [ ] `design.md` tokens used — no invented values
- [ ] Chrome rules followed
- [ ] README component names reused
- [ ] Viewport matrix satisfied
- [ ] States and copy covered (or `[COPY TBD]`)
- [ ] Ready for the next numbered pass
