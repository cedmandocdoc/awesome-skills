---
name: building-design
id: caa2ddd5-c78f-41af-8a9d-1af7973d08ac
description: Builds and amends runnable designs — a DESIGN.md (tokens, motion, voice, implementation rules, decisions) plus React previews of every UI block and feature screen, with presets, states, flows, spec files, and final copy, reviewed in a board-and-play viewer — so an implementer ports the design instead of interpreting it. Use only when the user names this skill (`/building-design`, `$building-design`, or "building-design"), or references a file under a marked design root (`@design/design.md`, a `.design.ts` file).
version: 4.1.0
---

# Building Design

## Overview

Produces one self-contained design folder per intention (a web app, a mobile app, a site, or part of one). `design.md` follows the DESIGN.md format with extension sections for motion, voice, implementation, and decisions. UI blocks and feature screens are runnable React previews, each with a `.design.ts` spec tied to its code by markers; features group screens into flows. A copied Vite viewer shows every flow and UI block as a Board and in Play. Building and amending follow the same steps and produce the same output.

## Dependencies

| Item | Required | When | How |
| --- | --- | --- | --- |
| Node.js 20.19+ with npm | required | Viewer, type check, token export | https://nodejs.org |

## Agent workflow

**Authoring mode.** Follow this skill when the user names it, or references a file under a design root marked by an `index.md` with this skill's author signature, to build or amend a design. Works wherever the agent can read and write repository files and run npm. Read [design-contract.md](references/design-contract.md) and [preview-contract.md](references/preview-contract.md) first, then run the steps. An amend runs the same steps limited to what the change reaches.

### Steps

1. **Resolve root** — design-contract → **Resolve design root**; initialize when none exists. On an amend, read `design.md` and the `.design.ts` files of the surfaces named.
2. **Fill inputs** — design-contract → **Inputs**. Ask once for every empty required row the work needs. Map a supplied style guide per **Existing guides**.
3. **Scope** — list the features (screens, states, flows), UI blocks (props, presets, motion), and motion primitives in play. Build: everything. Amend: the surfaces and `design.md` sections the change reaches, plus every screen that renders a UI block whose props change. Reuse one UI block wherever the same element appears; derive from an `exact` reference artifact when one exists.
4. **design.md** — write or edit from [`assets/design.md`](assets/design.md): tokens, `## Components` index, `## Motion`, `## Voice`, `## Implementation`, and a `## Decisions` row for each settled choice. Then `npm run tokens`.
5. **Motion system** — in `system/motion.css` and `system/motion.ts`, declare every `--motion-*` token with its `design.md` value and implement each primitive once, marked `@motion <name>`, with its reduced-motion behavior.
6. **UI blocks** — per block in scope: `<Name>.tsx`, `<name>.css`, `<name>.design.ts` from [`assets/surface/ui/`](assets/surface/ui/) per preview-contract.
7. **Features** — per screen in scope: `<Screen>.tsx`, `<screen>.css`, `<screen>.design.ts`; per feature: `<feature>.design.ts` with its flows; all from [`assets/surface/feature/`](assets/surface/feature/). Write copy per design-contract → **Writing copy**; build screen choreography from primitives only. To compare options, add them as presets or states (each reached by a flow); delete the rejected ones once the user picks.
8. **Sync and confirm** — design-contract → **Sync** and **Checklist**. Reply with paths (root, `design.md`), how to review (`npm run dev` in the root), what was built or changed, decisions recorded, and gaps (`[FACT?]`, `[TBD]`, defaults used). Ask the user to send changes as surface (feature › flow › step, or UI block › preset) + what to change.

## Reference index

### Contract

[design-contract.md](references/design-contract.md) — roots, layout, inputs, content roles, copy, sync, checklist. [preview-contract.md](references/preview-contract.md) — surfaces, screen or state, flows, design files, markers, triggers, viewer.

| Doc | When to use |
| --- | --- |
| [design-contract.md](references/design-contract.md) | Resolve or initialize a root; inputs; reference artifacts; content roles; writing copy; sync; checklist |
| [preview-contract.md](references/preview-contract.md) | Surface kinds and files, states and presets, flows, design file schema, markers, triggers, viewer |

## Templates

- [`assets/index.md`](assets/index.md) — root marker
- [`assets/design.md`](assets/design.md) — DESIGN.md with default tokens, YAML rules, and extension sections
- [`assets/app/`](assets/app/) — viewer app and `system/` (`define.ts`, `type.css`, `motion.css`, `motion.ts`), copied whole on init
- [`assets/surface/ui/`](assets/surface/ui/) — `Component.tsx`, `component.css`, `component.design.ts`
- [`assets/surface/feature/`](assets/surface/feature/) — `Screen.tsx`, `screen.css`, `screen.design.ts`, `feature.design.ts`
