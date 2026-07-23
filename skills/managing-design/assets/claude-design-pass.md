# Claude Design Pass — [Pass ID]: [Pass Title]

> **How to use:** Design system from `00-design-system.md` must already be applied in this Claude Design project. Paste **this pass only** into the current chat turn. Do not paste other pass files in the same turn.
>
> Keep the Design system applied. Reuse components and shells from prior passes listed under **Depends on**. Do not redraw chrome or invent screens outside **In scope**.

---

## Pass metadata

| Field | Value |
| --- | --- |
| **Pass ID** | `[NN]` |
| **Title** | [Short title — e.g. UI kit, Layout shells, Home flow] |
| **Depends on** | [Prior pass IDs — e.g. `00`, `01` — or `none` for design-system pass] |
| **File** | `[NN]-[slug].md` |

---

## Objective

[One or two sentences: what this pass alone must produce. No other flows.]

---

## Viewport

| Platform type | Frames for screens in this pass |
| --- | --- |
| **Desktop / web application** | Desktop `[width × height]` · Tablet `[width × height]` · Mobile `[width × height]` |
| **Mobile-only application** | Mobile `[width × height]` only |

**Active for this handoff:** [Desktop / web | Mobile-only] — match the guide.

---

## In scope (this pass only)

- [Artifact, component category, shell, or screen from UI specs]
- [Artifact, component category, shell, or screen from UI specs]

## Out of scope (this pass)

- [Screens or components deferred to later passes]
- [Explicit PRD/FRD exclusions]
- Do not invent features, routes, or copy beyond this pass

---

## Design system reminder

Use exact values from pass `00` / the project Design system. Do not invent hex, fonts, spacing, radius, or elevation.

**Key do / don't (short):**

- Do: [1–2 constraints from `design.md` Overview / Do's and Don'ts]
- Don't: [1–2 anti-patterns from `design.md`]

[For pass `00` only: replace this short reminder with full embedded token tables — colors, typography, spacing, radius, elevation, breakpoints, component recipes — copied from `design.md`. Later passes keep this section short.]

---

## Components to use or build

### If this is the UI kit pass

| Component | Variants | States | Spec | Notes |
| --- | --- | --- | --- | --- |
| [Component/Name] | [variant props] | [Default, Pressed, Disabled, Loading, …] | [token refs or recipe] | [size, icon slots] |

[One category block until the full UI-spec inventory for this handoff is covered.]

### If this is a shell or screen pass

| Instance | From kit | Where used | Notes |
| --- | --- | --- | --- |
| [Component/Variant] | [yes — kit pass id] | [screen / region] | [selected state, badge, etc.] |

**Reuse rule:** Use kit instances. Do not create one-off duplicates of shared controls. Do not redraw tab bars, headers, or sidebars defined in the shell pass.

---

## Screens / layouts / states

[Omit this section for pure design-system or pure kit passes when no screens are in scope.]

### [Layout or Screen name]

**Route / ID:** `[routeId or template]` · **Roles:** [roles]  
**Purpose:** [one sentence]  
**Layout:** [Duplicate `Layout/[ShellName]` | build new shell | full-bleed instrument]  
**Content:**

- [Headings, fields, CTAs — exact copy from UI specs]
- [Data displayed]

**States:** [Default, Loading, Empty, Error, Validation, Offline, …]  
**Interactions:** [only if UI specs define them — navigation, side effects]

[Repeat for every layout or screen in this pass.]

---

## Content & copy

| Location | Copy |
| --- | --- |
| [Screen / component] | [Exact string from UI specs, or `[COPY TBD]`] |

---

## Interaction notes

[Omit when UI specs do not define interactions for this pass.]

| Interaction | Behavior | Notes |
| --- | --- | --- |
| [e.g. Tab switch] | [behavior] | [duration / feedback if specified] |

---

## Build steps (this pass only)

1. **[Step]** — [concrete action]
2. **[Step]** — [concrete action]
3. [Continue until every in-scope artifact for this pass has a numbered step]

**Shell / screen passes:** Duplicate the designated layout shell; swap only the main content region. Chrome stays identical across screens that share a shell.

---

## Done checklist (this pass)

- [ ] All **In scope** items built
- [ ] Nothing from **Out of scope** generated
- [ ] Design system tokens from `00` used — no invented values
- [ ] Prior-pass dependencies satisfied ([Depends on](#pass-metadata))
- [ ] Kit reuse / shell duplicate-and-swap followed when applicable
- [ ] Viewport matrix for this pass satisfied
- [ ] States and copy covered (or marked `[COPY TBD]`)
- [ ] Ready for the next numbered pass
