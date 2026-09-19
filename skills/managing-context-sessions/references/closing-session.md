# Closing Session

## Overview

**Authoring mode.** Marks a session `closed` when its work is done. A closed session is never reopened; later changes create a new session that follows it.

## Prerequisites

Per [session-contract.md](./session-contract.md) → **Find a session**, **Lifecycle**, **`index.md` mirror**.

## Guidelines

### 1. Find the session

Per [session-contract.md](./session-contract.md) → **Find a session**; skip when the calling recipe already resolved it. Already `closed` → report and stop.

### 2. Record pending work

When this chat settled work the session does not yet reflect, update it per [updating-session.md](./updating-session.md) first.

### 3. Close

Set frontmatter `status: closed` and the `index.md` row **Status** to `closed`.

### 4. Confirm to the user

Reply with:

- Session path
- Remaining **Open** items
