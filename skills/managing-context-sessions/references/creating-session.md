# Creating Session

## Overview

**Authoring mode.** Creates a context session file for one piece of work, adds its `index.md` row, and writes the first entry when the chat already did work for it.

## Prerequisites

Per [session-contract.md](./session-contract.md) → **Resolve sessions root**, **Session frontmatter**, **`index.md` mirror**.

## Guidelines

### 1. Resolve sessions root

Per [session-contract.md](./session-contract.md) → **Resolve sessions root**. Initialize when none exists.

### 2. Name the session

1. `name` from the user's words for the work (`Saved cards`).
2. When an `open` row in `index.md` covers the same work, ask whether to continue that session instead.
3. Slug from `name`: lowercase, hyphens, max ~40 chars.
4. `NN` = highest existing number + 1, zero-padded to two digits (`01` when none).

### 3. Write the session file

Copy [`../assets/session.md`](../assets/session.md) to `<sessions-root>/<NN>-<slug>.md`. Fill frontmatter and the intent line. Set `follows` when created from a closed session ([continuing-session.md](./continuing-session.md) step 1); otherwise `none`.

### 4. Write the first entry

When this chat already did work for the piece (ideation, a spec draft, an idea file), write entry 1 per [updating-session.md](./updating-session.md) steps 2–3. Otherwise remove the entry skeleton; the next process writes entry 1.

### 5. Confirm to the user

Add the `index.md` row. Reply with:

- Session path, `session_id`, and whether the root was newly created
- Entry 1 heading, or that the session has no entries yet
- Suggested follow-up: _"Continue `sessions/03-saved-cards.md`: build the PRD"_
