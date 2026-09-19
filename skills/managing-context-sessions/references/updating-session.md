# Updating Session

## Overview

**Authoring mode.** Edits an open session's state in place to reflect finished work. Used by create and continue, and directly when work happened without continuing the session.

## Prerequisites

Per [session-contract.md](./session-contract.md) → **Find a session**, **Session body**, **Item rules**, **Pointer rules**.

## Guidelines

### 1. Find the session

Per [session-contract.md](./session-contract.md) → **Find a session**; skip when the calling recipe already resolved it. A `closed` session takes no edits: stop and offer a new session that follows it.

### 2. Collect what the work settled

Sort it into the sections per [session-contract.md](./session-contract.md) → **Session body**. **Agreed** items point to the files, sections, or outside items this work created or changed.

### 3. Edit the state

Change only the items this work affected; keep every other item word for word.

| Work did | Edit |
| --- | --- |
| New decision, fact, or built work | Add an **Agreed** item |
| Changed an agreed item | Rewrite that item; mark `(recheck: …)` on other items' pointers whose sources were built on the old version and this work did not update |
| Reversed an agreed item | Remove it; add the old option to **Ruled out** with the reason |
| Answered an **Open** item | Remove it; add the answer to **Agreed** |
| Updated a source marked `(recheck: …)` | Remove the marker |

Confirm each `#heading` and symbol exists in the current file.

### 4. Confirm to the user

Reply with:

- Session path
- Items added and changed, per section
- Every item removed, with why
