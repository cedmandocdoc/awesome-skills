# Design Contract

## Overview

Shared layout, resolve rules, hub sync, and static-handoff rules for all `building-design` workflows. Recipe bodies cover `design.md`, prompt, and preview content only.

## Guidelines

### Author signature

Static UUID identifying design roots created by this skill:

```text
54c9a59c-eb33-4860-bff1-a7fc6ae7abea
```

Every `<design-root>/index.md` must include this value in frontmatter `author`. Search the repository for that field to locate the design root — do not infer the root from `design.md`, `prompts/`, or `previews/` alone.

### Output layout

Only this skill may establish a design root. The root is always marked by `<design-root>/index.md`. Default folder: `design/`.

```text
<design-root>/                 # default: design/
  index.md                     # design root marker — required; created first
  design.md
  prompts/
    <task>/                    # mvp, checkout-v2, …
      README.md
      01-….md …
  previews/
    <task>/
      <screen>.html …          # login.html, home.html — not numbered
```

Templates: [`../assets/`](../assets/), including [`../assets/index.md`](../assets/index.md) for new design roots.

### Resolve design root

1. Search per **Finding design root**.
2. **Decide location:**
   - **One match** → use that folder.
   - **Multiple matches** → ask which root (list full paths to each `index.md`).
   - **No match** → **Initialize design root** at the user-named path, or `design/` when none was given.
3. Write design artifacts only under the resolved root.

### Finding design root

Search the repository for `index.md` files whose YAML frontmatter contains **all** of:

| Field | Value |
| --- | --- |
| `doc_type` | `design-root-index` |
| `author` | `54c9a59c-eb33-4860-bff1-a7fc6ae7abea` (see **Author signature**) |
| `generated_by` | `building-design` |

The design root is the parent directory of each matching `index.md` (e.g. `design/index.md` → `design/`). After resolving, list and read design files only under that directory.

### Initialize design root

When **no** valid `index.md` exists:

1. **Target** = user-named folder, else `design/`.
2. **Verify empty:**
   - Path does not exist → OK; create the directory.
   - Path exists with no files and no subdirectories → OK.
   - Path exists and is not empty → ask whether to initialize here (write `index.md` only; leave existing files) or pick another empty path.
3. Write `<design-root>/index.md` from [`../assets/index.md`](../assets/index.md) with the **Author signature** in `author`.
4. Proceed with the requested file(s) under that root.

Only this skill may create or replace `index.md`.

### Path resolution

`<task>` is a kebab-case slug (`mvp`, `auth-login`, `checkout-v2`) — do not number the folder. Use the same `<task>` slug when both renderers exist for one slice. A one-screen task still uses a folder.

| Target | Path |
| --- | --- |
| Visual system | `<design-root>/design.md` |
| Prompt task folder | `<design-root>/prompts/<task>/` |
| Preview task folder | `<design-root>/previews/<task>/` |

### Hub sync

| When | Sync |
| --- | --- |
| `design.md` created or amended | Ensure Documents row Visual system → `design.md` |
| Prompt task folder created or amended | Ensure Tasks row for `<task>` with Prompts path |
| Preview task folder created or amended | Ensure Tasks row for `<task>` with Previews path |

Leave Prompts or Previews blank until that folder exists. Do not invent task rows.

### Inputs

Prompt and preview recipes fill this table. `design.md` is an artifact this skill owns. Other rows are facts from the user prompt.

| Need | Required | Enough when |
| --- | --- | --- |
| Visual system | yes | `design.md` exists at `<design-root>/design.md` |
| Screen list | yes | Named screens in this task |
| Screen content | yes | Layout, fields, CTAs, copy or `[COPY TBD]` |
| Screen states | yes | Distinct visual states per screen (idle, empty, error, …) |
| Platform | yes | Desktop/web or mobile-only |
| Scope | yes | In vs out |
| Roles | if UI differs | Who sees which screens / variants |
| Chrome | if shells are shared | Which screens share auth vs app nav |

Fill from the user prompt (including files they attached). When a prompt folder exists, a preview recipe may use it as a hint; filled Inputs win on conflict.

Invent neither screens, flows, roles, features, nor copy. Unspecified copy is `[COPY TBD]`.

### Fill inputs

1. Resolve the design root (skip if already resolved this turn).
2. Confirm `design.md` exists at `<design-root>/design.md`. If not, offer [creating-design.md](creating-design.md) and stop.
3. Collect **Inputs** from the user prompt.
4. Ask for every empty **yes** row. Wait unless the user provided everything at once.
5. Skip Roles or Chrome asks when the UI does not split by role and screens do not share shells.
6. Confirm `<task>` unless already given.

When both prompt and preview recipes run this turn, run steps 1–6 once. Each recipe then continues from its plan/write step.

Visual decisions come from `design.md`. Structural decisions come from filled Inputs.

### Handoff deliverable

Static screen board — not a working app, prototype, or routed product.

- One labeled **frame** per screen × viewport, plus one frame per distinct state (idle, loading, empty, error, …)
- Chrome is drawn **inside** each frame; keep it identical per shell
- Controls are visual only — no routing, live validation, or APIs
- CSS `:hover` / `:focus` is allowed
- Light-first (YAML mode). Add dark frames only when `design.md` defines dark and the user asks

### Viewport matrix

| Platform type | Frames per screen (and per state) | Default sizes |
| --- | --- | --- |
| Desktop / web | Desktop, tablet, mobile | 1440×900 · 768×1024 · 390×844 |
| Mobile-only | Mobile portrait only | 390×844 |

Infer platform from Inputs; confirm when ambiguous.

### Chrome and components

Derive from Inputs and `design.md` — do not invent a parallel inventory.

| Derive | From |
| --- | --- |
| Shells (auth / app / modal) | Chrome input; same chrome on every frame that uses that shell |
| Component names | `design.md` YAML `components:` plus control names in Screen content |
| States to frame | Screen states — extra frames, not toggles |

## Related

- [creating-design.md](creating-design.md) — `design.md` tokens
- [creating-design-prompts.md](creating-design-prompts.md) — third-party paste prompts
- [creating-design-previews.md](creating-design-previews.md) — HTML screen boards
