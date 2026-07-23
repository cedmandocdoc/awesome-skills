# Claude Design Guide — [Product / Feature Name]

> **How to use in Claude Design ([claude.ai/design](https://claude.ai/design)):**
>
> 1. Open Claude Design and create or select the project.
> 2. Paste **`00-design-system.md`** into Design systems setup (or the equivalent design-system chat turn) **before** any UI pass.
> 3. Run numbered passes **in order** — one pass per chat turn (or sequential message). Paste only that pass file.
> 4. Keep the design system from `00` applied for the whole project. Do not regenerate the entire project to fix one component.
>
> Do not reinterpret, simplify, or invent flows. Follow this guide and each pass exactly.

---

## Objective

Generate the **[product / feature name]** UI in Claude Design via ordered passes:

- **Design system** (`00`) — tokens, theme, do/don't
- **UI kit** (`01`) — component inventory with states
- **Layout shells** (`02`) — auth / app chrome templates
- **Feature screens** (`03+`) — one major flow or archetype per pass

**Product context:** [One paragraph from PRD — audience, problem, MVP boundaries]

**Delivery scope:** [e.g. full mobile MVP, admin dashboard slice, onboarding flow only]

---

## Viewport matrix

| Platform type | Frames to generate per screen |
| --- | --- |
| **Desktop / web application** | Desktop `[width × height]` · Tablet `[width × height]` · Mobile `[width × height]` |
| **Mobile-only application** | Mobile `[width × height]` only |

**Active platform for this handoff:** [Desktop / web | Mobile-only]

**Frame naming:** `Screen/<Name>`, `Sheet/<Name>`, `Layout/<Name>`, `Component/<Category>/<Name>`

---

## Pass order

Run in strict numerical order. Each pass file is self-contained for one Claude Design turn.

| Pass | File | Purpose |
| --- | --- | --- |
| 00 | `00-design-system.md` | Create/update Design system — embed exact tokens |
| 01 | `01-ui-kit.md` | Build component inventory + states |
| 02 | `02-shells.md` | Auth shell + app chrome (duplicate-and-swap base) |
| [NN] | `[NN]-[slug].md` | [One-line purpose — one flow or archetype] |

[Add one row per pass file in this folder. Do not invent rows beyond UI specs.]

---

## Claude Design Execution Rules

- **Design system first** — create or update the Design system from `00-design-system.md` before any UI pass.
- **One pass at a time** — run files in numerical order; finish a pass (and its Done checklist) before opening the next.
- **Prefer chat for structural changes** — use inline comments for local tweaks; do not regenerate the whole project for a single component fix.
- **Viewport matrix** — follow the active platform type above (desktop/web three-frame matrix vs mobile-only portrait).
- **Exact tokens** — use values from the Design system (`00`); do not invent hex, fonts, spacing, radius, or elevation.
- **Out of scope** — honor explicit out-of-scope bullets on every pass and in Product Scope below.
- **Reuse after kit** — after `01`, use UI kit components; after `02`, duplicate shells and swap only the main content region — do not redraw chrome.
- **Live / instrument screens** — if any screen inverts visual weight or hides chrome, give it its own numbered pass (do not fold into a generic feature pass).

---

## Product Scope

### In scope

- [Feature or flow from PRD/FRD]
- [Feature or flow from PRD/FRD]

### Out of scope — do not generate

- [Explicit exclusion from PRD/FRD]
- [Feature the user or spec marked deferred]

---

## User Roles

| Role | Goals | Key screens | Constraints |
| --- | --- | --- | --- |
| [Role name] | [What they accomplish] | [Screen list] | [Permissions, gating] |

### Role-specific UI rules

- [e.g. Unauthenticated users see AuthShell only — no app navigation]
- [e.g. Admin role sees audit log; Member does not]

---

## Information Architecture

### Flow map summary

```
[Entry] → [Screen A] → [Screen B]
              ↓
         [Alternate / error path]
```

### Primary navigation

| Item | Route / ID | Position | Notes |
| --- | --- | --- | --- |
| [Nav label] | [route] | [tab / sidebar / header] | [badges, nesting] |

### Layout shells (built in pass 02)

| Shell | Used by | Chrome |
| --- | --- | --- |
| `Layout/[ShellName]` | [screen list] | [header / tab bar / sidebar rules] |

---

## Global Constraints & Content Rules

- Do not add screens, flows, or features not listed in this guide or the pass files
- Do not invent copy beyond UI specs; use `[COPY TBD]` only when content is genuinely unspecified
- Do not use colors, fonts, spacing, elevation, or radius outside the Design system from `00`
- Do not redesign shell chrome per screen — duplicate layout shells only
- [Project-specific constraints from PRD/FRD]

---

## Final Deliverable Checklist

- [ ] Design system created/updated from `00` with all design.md tokens
- [ ] UI kit pass complete — every component set, variants, and states from specs
- [ ] Layout shells built before feature screens
- [ ] Every feature screen duplicates the correct shell — only content region changes
- [ ] Screen UIs reuse UI kit components — no one-off redraws of shared controls
- [ ] Viewport matrix satisfied — [desktop + tablet + mobile | mobile only] per platform type
- [ ] All in-scope screens, sheets, and state variants covered across passes
- [ ] Loading, empty, error, validation, and offline states as defined
- [ ] Passes executed in numerical order without skipping
- [ ] Out-of-scope items not generated
