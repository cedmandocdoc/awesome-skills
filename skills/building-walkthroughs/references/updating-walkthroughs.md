# Updating Walkthroughs

## Overview

**Authoring mode.** Keeps walkthroughs true and coverage complete after the app changes, or applies a change the user asks for (rename, split, merge, move to another area, reorder a journey). Each task keeps one walkthrough, edited in place.

## Prerequisites

[walkthrough-contract.md](./walkthrough-contract.md).

## Guidelines

### 1. Resolve root

Per contract → **Resolve walkthroughs root**. Read `index.md` and every walkthrough's frontmatter. When the root's viewer files differ from [`../assets/app/`](../assets/app/), copy it over the root (`cp -R <skill>/assets/app/. <walkthroughs-root>/`) and run `npm install` there. Run `npm run check`; its findings join step 2.

### 2. Map the change

From the diff (staged and unstaged, or the commits the user names), match changed paths and doc sections against each walkthrough's `covers`, and changed routes or screens against `index.md` → `surfaces`. A user-requested change maps to the walkthroughs it names.

| Finding | Do |
| --- | --- |
| A covered task changed | Rewrite the steps, cases, and diagram that no longer match |
| A new route or screen | Declare the surface, then cover it in a new or existing walkthrough, or mark the gap per contract → **Coverage** |
| A route or screen removed | Remove the surface and drop it from every walkthrough's `surfaces` |
| A new task or variation | Write it per [creating-walkthroughs.md](./creating-walkthroughs.md) → steps 4 and 7 |
| A gap's reason no longer holds | Cover the surface and drop the gap |
| A new area, actor, or journey | Add it per contract → **Sync** |
| A task left the app | Move the file to `retired/` |
| `npm run check` flags a command or a missing start link in **Before you start** | Rewrite the section in plain words per contract → **Writing a walkthrough** |
| `npm run check` flags an unknown section, such as a leftover **Something looks wrong?** | Delete it, or move what it holds into an allowed section |
| Nothing a user would notice changed | Leave the walkthroughs as they are |

### 3. Edit

Edit per contract → **Writing a walkthrough**, **Step format**, and **Expected values**, tracing changed steps through the code. Then apply contract → **Sync** for every changed `ends_with`, surface, retired or renamed walkthrough, area, actor, journey, and lens.

### 4. Dry run (optional)

Per [creating-walkthroughs.md](./creating-walkthroughs.md) → step 8, on the walkthroughs edited.

### 5. Sync

Run `npm run index`, then `npm run check`, then contract → **Checklist**.

### 6. Confirm to the user

Reply with the walkthroughs rewritten, added, and retired (with the change that caused each), surfaces added or removed, coverage N/M with any new gaps, dependents re-pointed, areas, actors, journeys, lenses, or checkpoints changed, and whether the viewer was refreshed. When nothing changed, say so in one line.
