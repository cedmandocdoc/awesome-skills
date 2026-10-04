# Updating Walkthroughs

## Overview

**Authoring mode.** Keeps walkthroughs true after the app changes, or applies a change the user asks for (rename, split, merge, move to another line). Each journey keeps one walkthrough, edited in place.

## Prerequisites

[walkthrough-contract.md](./walkthrough-contract.md).

## Guidelines

### 1. Resolve root

Per contract → **Resolve walkthroughs root**. Read `index.md` and every walkthrough's frontmatter.

### 2. Map the change

From the diff (staged and unstaged, or the commits the user names), match changed paths and spec sections against each walkthrough's `covers`. Also note routes or screens with no walkthrough and walkthroughs whose code is gone. A user-requested change maps to the walkthroughs it names.

| Finding | Do |
| --- | --- |
| A covered journey changed | Rewrite the steps, cases, and diagram that no longer match |
| A new journey | Write it per [creating-walkthroughs.md](./creating-walkthroughs.md) → steps 3–5 |
| A journey left the app | Move the file to `retired/` |
| Nothing a user would notice changed | Leave the walkthroughs as they are |

### 3. Edit

Edit per contract → **Writing a walkthrough** and **Expected values**, tracing changed steps through the code. Then apply contract → **Sync** for every changed `ends_with`, retired or renamed walkthrough, and line.

### 4. Dry run (optional)

Per [creating-walkthroughs.md](./creating-walkthroughs.md) → step 6, on the walkthroughs edited.

### 5. Sync

Run `npm run index`, then `npm run check`, then contract → **Checklist**.

### 6. Confirm to the user

Reply with the walkthroughs rewritten, added, and retired (with the change that caused each), dependents re-pointed, and checkpoints changed. When nothing changed, say so in one line.
