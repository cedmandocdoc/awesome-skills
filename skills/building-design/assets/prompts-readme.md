# Design prompts — [Product / Feature] ([task-slug])

> **How to use:** Read this README, apply `design.md` on the target platform, then run numbered pass files **in order** — one pass per generation turn.

**Visual source of truth:** `[path-to-design.md]` (default `design/design.md`)  
**Delivery scope:** [e.g. full mobile MVP, checkout slice, landing only]  
**Platform type:** [Desktop / web | Mobile-only]  
**Viewport matrix:** [sizes from platform type]

---

## Pass order

| Pass | File | Purpose |
| --- | --- | --- |
| 01 | `01-[slug].md` | [One flow or screen group] |
| 02 | `02-[slug].md` | [One flow or screen group] |

Run in numerical order. Finish a pass before opening the next. Do not invent screens outside Product Scope.

---

## Product Scope

### In scope

- [Feature or flow from PRD/FRD]

### Out of scope — do not generate

- [Explicit exclusion from PRD/FRD]

---

## User Roles

| Role | Goals | Key screens | Constraints |
| --- | --- | --- | --- |
| [Role name] | [What they accomplish] | [Screen list] | [Permissions, gating] |

### Role-specific UI rules

- [e.g. Guests see AuthShell only]

---

## Information Architecture

### Flow map

```
[Entry] → [Screen A] → [Screen B]
              ↓
         [Alternate / error path]
```

### Primary navigation

| Item | Route / ID | Position | Notes |
| --- | --- | --- | --- |
| [Nav label] | [route] | [tab / sidebar / header] | [badges, nesting] |

### Chrome rules (apply on every screen that uses that shell)

| Shell | Used by | Fixed chrome | Swappable region |
| --- | --- | --- | --- |
| [Auth / App / Modal] | [screen list] | [header, tab bar, sidebar] | [main content only] |

Keep chrome identical across screens that share a shell. Do not redraw navigation per screen.

---

## Component reference (names only)

Use these names consistently. Prefer reuse over one-off controls. Full visual values live in `design.md`.

| Component | Variants / states | Notes |
| --- | --- | --- |
| [Component/Name] | [Primary, Disabled, Error, …] | [size, icon slots] |

---

## Global constraints

- Follow `design.md` for all visual decisions — do not invent colors, fonts, spacing, radius, or elevation
- Do not add screens, flows, or features not listed here or in the pass files
- Do not invent copy; use `[COPY TBD]` only when content is unspecified
- Honor chrome rules and component names above
- [Project-specific constraints]

---

## Platform adapters

Same pass files on every platform. Only setup and turn size differ.

### Claude Design ([claude.ai/design](https://claude.ai/design))

1. Create or open the project.
2. Apply the design system from `design.md` (Design systems setup or equivalent) **before** any pass.
3. Paste **one** numbered pass file per chat turn. Keep the design system applied.
4. Use chat for structural changes; use inline comments for local tweaks.
5. Do not regenerate the whole project to fix one component.

### Google Stitch ([stitch.withgoogle.com](https://stitch.withgoogle.com))

1. Import or attach `design.md` as the project visual system.
2. Run the Generation Plan as **separate prompts**: paste pass `01`, generate; then `02`; and so on.
3. In each Stitch prompt, reference `design.md` token keys — do not paste hex/px values from passes unless editing a single targeted value.
4. For refinements, change **one** screen or component per prompt.
5. Prefer edit/refine over full re-generation when a screen is mostly correct.

### Figma Make ([figma.com/make](https://www.figma.com/make/))

1. Attach `design.md` (and this folder’s pass file) to the Make prompt, or paste the pass contents.
2. Optional: use Plan mode with the pass order table above, then generate.
3. Run **one pass per generation** for multi-flow apps. Small single-flow tasks may use one pass only.
4. Create Figma variables/styles from `design.md` tokens when the pass starts a new file.
5. Use point-and-edit or a single-change follow-up for local fixes — do not regenerate the whole app for one tweak.

---

## Final checklist

- [ ] `design.md` applied on the target platform
- [ ] Passes run in order without skipping
- [ ] Every in-scope screen, state, and role variant covered
- [ ] Chrome consistent per shell rules
- [ ] Out-of-scope items not generated
- [ ] Visual values traceable to `design.md`
