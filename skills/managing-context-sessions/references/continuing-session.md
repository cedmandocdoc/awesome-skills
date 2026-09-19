# Continuing Session

## Overview

**Execution mode.** Loads a session into a short brief, runs the task the user asked for with only the relevant sources, then appends one entry. The task itself follows whichever skill or instructions govern it; this recipe only frames its context and records its result.

## Prerequisites

Per [session-contract.md](./session-contract.md) → **Find a session**, **Reading a session**, **Lifecycle**.

## Guidelines

### 1. Find the session

Per [session-contract.md](./session-contract.md) → **Find a session**. When it is `closed`, create a new session per [creating-session.md](./creating-session.md) with `follows` set to it, and continue with the new session. Its starting map is the closed session's current **Sources**.

### 2. Read the session

Per [session-contract.md](./session-contract.md) → **Reading a session**. Read only the session file and `git log` output in this step.

### 3. Show the brief

Pick the sources and decisions relevant to the requested task. Show at most ~10 lines, omitting empty rows:

```text
Reading:    <pointers to open for this task>
Decided:    <decisions that constrain this task>
Open:       <open questions this task touches>
Recheck:    <sources that may reflect a superseded part>
Unrecorded: <files changed since the last entry>
Skipping:   <sources not needed for this task>
```

Proceed unless the user corrects the brief.

### 4. Run the task

Start from the **Reading** pointers; open other files only when the task requires them. Resolve **Recheck** items that fall inside the task's scope; carry the rest to the entry's **Open**.

### 5. Append the entry

Per [updating-session.md](./updating-session.md). Skip the entry when the request only asked a question and changed no files and settled no decisions. Then close per [closing-session.md](./closing-session.md) when the user asked to close.

### 6. Next task in the same chat

When the user starts another task in the same chat, append the finished task's entry first, then run steps 3–5 for the new request.
