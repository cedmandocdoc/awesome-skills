# Rendering Promotions

## Overview

**Execution mode.** Renders the delivered set of promotions that already exist, as they are, into each one's `renders/`: every promotion in the repository, one root's, a few promotions, or only those with nothing rendered yet. It changes no source and makes no paid call. A new ratio, a new cut or a change to a frame or scene is **Make or change a video** or **Make or change a still**. A video's frame-0 cover, caption file and stem stay with [creating-promotion.md](./creating-promotion.md) → **11. Final**.

## Prerequisites

Per [promotion-contract.md](./promotion-contract.md) → **Output layout**, **Resolve promotions root**. The script is [`../scripts/render-promotions.mjs`](../scripts/render-promotions.mjs), run from the repository, `<skill>` being this skill's folder.

## Guidelines

### 1. Resolve the request

| Request | Arguments |
| --- | --- |
| Every promotion | none |
| Only what isn't rendered yet (a fresh clone or worktree) | `--missing` |
| One root | its folder (`promotions/`), or its folder's name (`crew-payroll`) |
| One promotion, or a few | each one's folder, or `<root folder>/<NN-slug>` or its start (`crew-payroll/01`) |
| One format | `--stills` or `--videos` |

Arguments combine: `promotions/ --missing --videos`.

### 2. Render

Run `node <skill>/scripts/render-promotions.mjs <arguments>`, in the background when the plan holds a video. It prints the plan, then renders one promotion after another in its own folder:

| Promotion | Runs | Writes into `renders/` |
| --- | --- | --- |
| Still | `node render-still.mjs frames/*.html --out renders`, the folder's own copy | `<NN>-<ratio>.png` and `.jpg` per frame page, `thumbs/` |
| Video | `npx --yes hyperframes@<the folder's pin> render --quality delivery` on `index.html`, then on each further root composition `<name>.html` | `<NN-slug>-<ratio>.mp4`, `<NN-slug>-<name>-<ratio>.mp4` |

Each output replaces the file of the same name; nothing else in `renders/` is removed. A still whose frames fail the render's checks is still rendered, and the summary lists its issues. A failed video prints the tail of its log, and the run goes on to the next promotion.

### 3. Confirm to the user

- What rendered, per promotion, with the time each took
- What failed and why, and each still's check issues; fixing them is **Make or change a still**
- The shortcut **Setup** → **Render script** added, when it did: `npm run promo:render -- <arguments>`
