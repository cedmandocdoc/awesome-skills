# Creating Session

## Overview

**Authoring mode.** Creates a context session file for one piece of work, adds its `index.md` row, and records the state the chat already settled.

## Prerequisites

Per [session-contract.md](./session-contract.md) → **Resolve sessions root**, **Session frontmatter**, **Session body**, **`index.md` mirror**.

## Guidelines

### 1. Resolve sessions root

Per [session-contract.md](./session-contract.md) → **Resolve sessions root**. Initialize when none exists.

### 2. Name the session

1. `name` from the user's words for the work (`Saved cards`).
2. When an `open` row in `index.md` covers the same work, ask whether to continue that session instead.
3. Slug from `name`: lowercase, hyphens, max ~40 chars.
4. `NN` = highest existing number + 1, zero-padded to two digits (`01` when none).

### 3. Write the session file

Copy [`../assets/session.md`](../assets/session.md) to `<sessions-root>/<NN>-<slug>.md`. Fill frontmatter and the intent line; ask the user what done looks like when the chat does not say. Set `follows` when created from a closed session ([continuing-session.md](./continuing-session.md) step 1) and copy its state per [session-contract.md](./session-contract.md) → **Lifecycle**; otherwise `none`.

### 4. Record the settled state

When this chat already did work for the piece (ideation, a spec draft, a design), fill the sections per [updating-session.md](./updating-session.md) steps 2–3. Otherwise remove the placeholder sections; the next process fills them.

### 5. Confirm to the user

Add the `index.md` row. Reply with:

- Session path, `session_id`, and whether the root was newly created
- Item count per section, or that the state is empty
- Suggested follow-up: _"Continue `sessions/03-saved-cards.md`: build the PRD"_
