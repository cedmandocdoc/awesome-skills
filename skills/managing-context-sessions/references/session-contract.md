# Session Contract

## Overview

Shared plumbing for all `managing-context-sessions` recipes: sessions root discovery, layout, session frontmatter, finding a session, entry format, pointer rules, supersede handling, lifecycle, and the `index.md` mirror.

## Guidelines

### Author signature

Static UUID identifying sessions roots created by this skill:

```text
d9ef9fb4-39f1-4481-8de7-28722326b064
```

Every `<sessions-root>/index.md` includes this value in frontmatter `author`.

### Output layout

```text
<sessions-root>/
  index.md            # root marker + one row per session
  <NN>-<slug>.md      # one session per piece of work
```

Templates: [`../assets/index.md`](../assets/index.md), [`../assets/session.md`](../assets/session.md).

### Resolve sessions root

Search the repository for `index.md` whose frontmatter has `doc_type: context-sessions-index`, `generated_by: managing-context-sessions`, and `author` = **Author signature**. The root is its parent directory.

| Matches | Action |
| --- | --- |
| One | Use it |
| Several | Ask which root |
| None, on create | **Initialize sessions root** |
| None, other intents | Stop and report that no sessions root exists |

### Initialize sessions root

1. Target `sessions/` at the repository root unless the user names another path.
2. Path missing or empty → create it. Path not empty → ask for another path.
3. Write `<sessions-root>/index.md` from [`../assets/index.md`](../assets/index.md).

### Session frontmatter

| Field | Value |
| --- | --- |
| `doc_type` | `context-session` |
| `generated_by` | `managing-context-sessions` |
| `session_id` | `<NN>-<slug>` |
| `name` | Human name the user uses for the work (e.g. `Saved cards`) |
| `status` | `open` or `closed` |
| `follows` | `<NN>-<slug>` of a closed session this one continues, or `none` |

Body starts with `# Session — <name>` and one line of intent: what the work is and why.

### Find a session

1. `@`-mentioned path or `session_id` → that file.
2. Otherwise match the user's words against `index.md` **Session** and **Intent** columns. Read only `index.md` for this step.

| Result | Action |
| --- | --- |
| One match | Use it |
| Several | Ask which, listing id and intent |
| None | Say so; offer to create a session |

### Entry format

Append-only. Never edit an earlier entry; later entries correct earlier ones through **Supersedes**.

```md
## <n>. <Process> — <YYYY-MM-DD> · <short-sha | uncommitted>
Builds on: <entry numbers | none>
Supersedes: <n> — <exact part replaced>
Decisions:
- <decision or rejected option>
Sources:
- <pointer> — <what is there>
Open:
- <unresolved question>
```

| Field | Rule |
| --- | --- |
| `<n>` | Previous entry number + 1 |
| `<Process>` | Free text naming what was done (`Ideation`, `Product specs`, `Design`, `Bug fix`) |
| Commit | Short `HEAD` hash when this entry's changes are committed; `uncommitted` otherwise. Updating never commits. |
| **Builds on** | Entries this process read as input |
| **Supersedes** | Omit when nothing is replaced. One line per replaced part |
| **Decisions** | Only what no source file records: chat-only decisions, rejected options, answers to earlier **Open** items (`answers open question in <n>`). Omit when empty |
| **Sources** | Only files this process created or changed. Omit when empty |
| **Open** | Questions left unresolved. Omit when empty |

### Pointer rules

| Target | Pointer |
| --- | --- |
| Markdown | `path#heading-slug` |
| Code | `path` plus symbol (`SavedCardList`, `savePaymentMethod`) |
| Whole file | `path` — only for files created by this process |
| Line range | `path:L<start>-L<end>` — only when the entry has a commit hash |

Each pointer carries at most one line on what is there. Point instead of copying content; the note tells a reader whether to open it (`table row only`, `FR-13 only`).

### Reading a session

1. Read the session file.
2. Drop superseded parts: for each **Supersedes**, the named part of the earlier entry no longer holds.
3. **Recheck:** an entry that builds on a superseded part and precedes the superseding entry may reflect the old version. List those entries' sources whose content depends on the replaced part.
4. **Unrecorded work:** when the last entry has a commit hash, `git log --name-only <sha>..HEAD` shows changes made since without an entry.

### Lifecycle

| Status | Meaning |
| --- | --- |
| `open` | Work in progress; continuing appends entries, including when going back to an earlier process |
| `closed` | Work done; never reopened |

A request to change work from a closed session creates a new session with `follows` set to the closed one. The new session starts from the closed session's current **Sources** (after **Reading a session**) as a map to canonical files; it copies no entries.

### `index.md` mirror

One row per session: `ID` = `session_id`, `Session` = `name`, `Intent` = the intent line, `Status` = frontmatter `status`. Add the row on create; update `Status` on close.
