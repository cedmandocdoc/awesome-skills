# Creating Design

## Overview

**Authoring mode.** Builds or amends a design under one design root; both run the same steps and produce the same output.

## Prerequisites

[design-contract.md](./design-contract.md). [preview-contract.md](./preview-contract.md).

## Guidelines

### 1. Resolve root

Per [design-contract.md](./design-contract.md) → **Resolve design root**. On an amend, read `design.md` and the `.design.ts` files of the surfaces named.

### 2. Fill inputs

Per [design-contract.md](./design-contract.md) → **Inputs**; map a supplied style guide per **Existing guides**.

### 3. Scope

List the features (screens, states, flows), UI blocks (props, presets, motion), and motion primitives in play. Build: everything. Amend: the surfaces and `design.md` sections the change reaches, plus every screen that renders a UI block whose props change. Reuse one UI block wherever the same element appears; derive from an `exact` reference artifact when one exists.

### 4. design.md

Write or edit from [`../assets/design.md`](../assets/design.md): tokens, `## Components` index, `## Motion`, `## Voice`, `## Implementation`, and a `## Decisions` row for each settled choice. Then `npm run tokens`.

### 5. Motion system

In `system/motion.css` and `system/motion.ts`, declare every `--motion-*` token with its `design.md` value and implement each primitive once, marked `@motion <name>`, with its reduced-motion behavior.

### 6. UI blocks

Per block in scope: `<Name>.tsx`, `<name>.css`, `<name>.design.ts` from [`../assets/surface/ui/`](../assets/surface/ui/) per [preview-contract.md](./preview-contract.md).

### 7. Features

Per screen in scope: `<Screen>.tsx`, `<screen>.css`, `<screen>.design.ts`; per feature: `<feature>.design.ts` with its flows; all from [`../assets/surface/feature/`](../assets/surface/feature/). Write copy per [design-contract.md](./design-contract.md) → **Writing copy**; build screen choreography from primitives only. To compare options, add them as presets or states (each reached by a flow); delete the rejected ones once the user picks.

### 8. Sync and confirm

Per [design-contract.md](./design-contract.md) → **Sync** and **Checklist**. Reply with paths (root, `design.md`), how to review (`npm run dev` in the root), what was built or changed, decisions recorded, and gaps (`[FACT?]`, `[TBD]`, defaults used). Ask the user to send changes as surface (feature › flow › step, or UI block › preset) + what to change.
