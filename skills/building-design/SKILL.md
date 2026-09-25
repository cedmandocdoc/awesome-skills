---
name: building-design
id: caa2ddd5-c78f-41af-8a9d-1af7973d08ac
description: Builds and amends runnable designs — a DESIGN.md (tokens, motion, voice, implementation rules, decisions) plus plain HTML/CSS/JS previews of every component and page, with switchable states and viewports, spec files, and final copy — so an implementer ports the design instead of interpreting it. Use when the user wants a design, design system, design.md, style guide, design tokens, visual language, motion or animation spec, UI preview, component preview, page preview, or design changes before implementation.
version: 3.0.0
---

# Building Design

## Overview

Produces one self-contained design folder per intention (a web app, a mobile app, a site, or part of one). `design.md` follows the DESIGN.md format with extension sections for motion, voice, implementation rules, and decisions. Components and pages are runnable previews, each with a `.spec.yml` tied to its code by markers. Building and amending follow the same steps and produce the same output.

## Dependencies

| Item | Required | When | How |
| --- | --- | --- | --- |
| Node.js with `npx` | required | Token export | https://nodejs.org |

## Agent workflow

**Authoring mode.** Follow this skill to build a design or amend one marked by an `index.md` with this skill's author signature. Works wherever the agent can read and write repository files. Read [design-contract.md](references/design-contract.md) and [preview-contract.md](references/preview-contract.md) first, then run the steps. An amend runs the same steps limited to what the change reaches.

### Steps

1. **Resolve root** — design-contract → **Resolve design root**; initialize when none exists. On an amend, read `design.md` and the specs of the surfaces named.
2. **Fill inputs** — design-contract → **Inputs**. Ask once for every empty required row the work needs. Map a supplied style guide per **Existing guides**.
3. **Scope** — list the components (variants, states, motion), pages (states, components used), and motion primitives in play. Build: everything. Amend: the surfaces and `design.md` sections the change reaches, plus any page whose component markup contract changes. Reuse one component wherever the same element appears; derive from an `exact` reference artifact when one exists.
4. **design.md** — write or edit from [`assets/design.md`](assets/design.md): tokens, `## Components` index, `## Motion`, `## Voice`, `## Implementation`, and a `## Decisions` row for each settled choice.
5. **Motion system** — in `system/motion.css` and `system/motion.js`, declare every `--motion-*` token with its `design.md` value and implement each primitive once, marked `@motion <name>`, with its reduced-motion behavior.
6. **Components** — per component in scope: `.html` gallery, `.css`, `.js` when it has behavior, `.spec.yml`, from [`assets/surface/`](assets/surface/) per preview-contract.
7. **Pages** — per page in scope: the same four files. Write copy per design-contract → **Writing copy**; build page choreography in the page's JS from primitives only. To compare options, add them as variants or states; delete the rejected ones once the user picks.
8. **Sync and confirm** — design-contract → **Sync** and **Checklist**. Reply with paths (root, `design.md`, `preview.html`), what was built or changed, decisions recorded, and gaps (`[FACT?]`, `[TBD]`, defaults used). Ask the user to review in `preview.html` and send changes as surface + what to change.

## Reference index

### Contract

[design-contract.md](references/design-contract.md) — roots, layout, inputs, content roles, copy, sync, checklist. [preview-contract.md](references/preview-contract.md) — surfaces, spec files, markers, triggers, viewer.

| Doc | When to use |
| --- | --- |
| [design-contract.md](references/design-contract.md) | Resolve or initialize a root; inputs; reference artifacts; content roles; writing copy; sync; checklist |
| [preview-contract.md](references/preview-contract.md) | Surface files, states, spec schema, markers, triggers, viewer |

## Templates

- [`assets/index.md`](assets/index.md) — root marker
- [`assets/design.md`](assets/design.md) — DESIGN.md with default tokens, YAML rules, and extension sections
- [`assets/preview.html`](assets/preview.html) — viewer
- [`assets/system/`](assets/system/) — `preview.js`, `surfaces.js`, `type.css`, `motion.css`, `motion.js`
- [`assets/surface/`](assets/surface/) — `page.html`, `component.html`, `surface.spec.yml`
