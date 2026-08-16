# Creating Design Prompts

## Overview

**Authoring mode.** Generates a shared static-handoff prompt folder from `design.md` and filled Inputs per [handoff-contract.md](handoff-contract.md). The same passes run on Claude Design, Google Stitch, and Figma Make; platform differences live only in README adapters.

Produces screen/flow passes that describe a static frame board. Chrome rules and component names sit in the README; each pass lists frames to draw. This recipe writes markdown only — it does not write HTML or into Claude Design, Stitch, or Figma.

## Prerequisites

Per [handoff-contract.md](handoff-contract.md) → **Inputs**, **Fill inputs**, **Paths**. Templates: [`../assets/prompts-readme.md`](../assets/prompts-readme.md), [`../assets/design-pass.md`](../assets/design-pass.md).

## Guidelines

### 1. Fill inputs and confirm paths

Per [handoff-contract.md](handoff-contract.md) → **Fill inputs**, **Paths**, and **Viewport matrix**. If Inputs were already filled this turn, skip collect/ask; confirm this recipe’s paths only.

Confirm design root and task slug. On follow-ups ("add settings screen to prompts"), edit the existing task folder unless the user asks for a new path.

### 2. Extract and plan passes

Map filled Inputs, then plan one pass per major flow or screen group from the screen list only — invent neither screens nor kit-only / empty-shell passes.

| From | Maps to |
| --- | --- |
| Scope | README → Objective, Product Scope; every pass Out of scope |
| Screen list | README IA; numbered passes |
| Screen content | Pass Screens / Content & copy; README component names |
| Screen states | Pass extra frames per state |
| Platform | README + pass Viewport |
| Roles | README → User Roles; pass role notes (omit when unused) |
| Chrome | README → Chrome rules (omit when unused) |
| Visual system | README visual source; pass design-system reminder and token lines |

Include when Inputs support them: role-gated UI, live/instrument screens as their own pass when they invert chrome.

### 3. Fill and write

```text
design/prompts/<task>/
├── README.md
├── 01-<flow>.md
└── 02-<flow>.md …
```

| File | Role |
| --- | --- |
| `README.md` | Product scope, roles, IA, chrome rules, component names, platform adapters, pass index, handoff deliverable |
| `01-*.md` … `NN-*.md` | Numbered screen/flow passes in strict order |

**Filling rules:**

1. Replace every `[...]` placeholder with concrete names from inputs; ship unresolved brackets only as intentional `[COPY TBD]`
2. Passes reference `design.md` token **keys** and short do/don't reminders — not full hex/px tables
3. One major flow or tightly related screen group per pass
4. Chrome rules and component names belong in the README; passes list real screens that apply those rules
5. Each pass lists prior pass IDs it assumes complete
6. List every in-scope screen, sheet, state, and role variant from inputs by name across the pass set
7. README and every pass include out-of-scope bullets from Scope
8. Viewport matrix matches platform type (three frames desktop/web; one mobile-only)
9. Keep the three README adapter sections (Claude Design, Google Stitch, Figma Make); adjust only paths and scope wording
10. Use hierarchical component names (`Button/Primary`), screen names, and exact copy from Screen content
11. `design.md` is source of truth for visuals — reference keys, not vague adjectives
12. Every role with distinct behavior gets explicit coverage in the relevant passes
13. Each pass is self-contained for one paste with `design.md` already applied — point tools at the pass, not upstream notes
14. Structure output as a static frame board per [handoff-contract.md](handoff-contract.md) → **Handoff deliverable**. Figma Components/Screens showcase only when the user asks for that deliverable

Write README and pass files as plain markdown on disk. In chat, return paths, summary, gaps, and usage only — nested markdown breaks inside fences.

### 4. Confirm to the user

1. **Paths** — `design.md` and prompt task folder
2. **Summary** — platform type, task slug, pass count
3. **Gaps** — `[COPY TBD]` or empty Input rows
4. **Usage** — open `README.md` → apply `design.md` on the chosen platform → run `01` → `02` → … in order (one pass per generation turn)

### Follow-up updates

1. Read the existing folder at the agreed path
2. Add/edit numbered passes; update the README pass-order table
3. If `design.md` changed, confirm the README path and refresh do/don't reminders. If the README lacks **Handoff deliverable**, add it from [`../assets/prompts-readme.md`](../assets/prompts-readme.md)
4. Overwrite in the same folder unless the user asks for a new path or task slug

## Related

- [handoff-contract.md](handoff-contract.md) — static board rules, Inputs, paths
- [creating-design.md](creating-design.md) — prerequisite visual tokens
- [creating-design-previews.md](creating-design-previews.md) — HTML boards from the same Inputs; not a gate

## Examples

**Missing design.md:** Stop → offer [creating-design.md](creating-design.md) → resume after tokens exist.

**Mobile MVP:** Confirm `design/prompts/mvp/` → README + one pass per in-scope flow; mobile-only viewport matrix.

**Desktop SaaS slice:** Confirm `design/prompts/checkout-v2/` → three viewports; chrome rules in README; passes list checkout frames only.

**Update:** "Add settings screen" → next numbered pass → update README pass-order → overwrite in place.
