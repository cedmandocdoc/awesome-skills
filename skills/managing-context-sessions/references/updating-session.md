# Updating Session

## Overview

**Authoring mode.** Appends one entry for finished work to an open session. Used by create and continue, and directly when work happened without continuing the session.

## Prerequisites

Per [session-contract.md](./session-contract.md) → **Find a session**, **Entry format**, **Pointer rules**.

## Guidelines

### 1. Find the session

Per [session-contract.md](./session-contract.md) → **Find a session**; skip when the calling recipe already resolved it. A `closed` session takes no entries: stop and offer a new session that follows it.

### 2. Collect what the work did

| Item | Source |
| --- | --- |
| Changed files | Files this chat created or edited; plus `git status --porcelain` and, when the last entry has a hash, `git log --name-only <sha>..HEAD` |
| Changed sections | Headings or symbols touched in each changed file |
| Decisions | Chat decisions and rejected options that no changed file records |
| Builds on | Entries read as input |
| Supersedes | Parts of earlier entries this work replaced |
| Open | Questions still unresolved, including **Recheck** items left outside the task's scope |

### 3. Append the entry

Write it per [session-contract.md](./session-contract.md) → **Entry format** and **Pointer rules**. Confirm each `#heading` and symbol exists in the current file.

### 4. Confirm to the user

Reply with:

- Session path and the new entry heading
- Sources recorded and any **Supersedes** line
