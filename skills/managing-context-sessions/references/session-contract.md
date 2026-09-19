# Session Contract

## Overview

Shared plumbing for all `managing-context-sessions` recipes: sessions root discovery, layout, session frontmatter, finding a session, session body, item and pointer rules, reading a session, lifecycle, and the `index.md` mirror.

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

### Find a session

1. `@`-mentioned path or `session_id` → that file.
2. Otherwise match the user's words against `index.md` **Session** and **Intent** columns. Read only `index.md` for this step.

| Result | Action |
| --- | --- |
| One match | Use it |
| Several | Ask which, listing id and intent |
| None | Say so; offer to create a session |

### Session body

The body declares the work's current state, not its history. Every process edits the same sections.

```md
# Session — <name>

<intent: what the work is, why, and what done looks like>

## Agreed
- <statement> → <pointer>

## Ruled out
- <option> — <reason>

## Open
- <unresolved question>
```

| Section | Holds |
| --- | --- |
| Intent line | One line; states done clearly enough to know when to close |
| **Agreed** | What currently holds: decisions the user agreed to, facts the work established, work built |
| **Ruled out** | Options the user rejected, with the reason |
| **Open** | Questions not yet settled, including options still under discussion |

Omit a section while it has no items. Record only what falls within the intent line.

### Item rules

- One statement per item.
- **With a pointer**, the statement summarizes; detail stays in the source.
- **Without a pointer**, the session is the content's only home: the item carries it in full, as sub-bullets or a table under the item.
- `(recheck: <what changed>)` after a pointer marks a source built on an item that has since changed.

### Pointer rules

| Target | Pointer |
| --- | --- |
| Markdown | `path#heading-slug` |
| Code | `path` plus symbol (`SavedCardList`, `savePaymentMethod`) |
| Whole file | `path` — only for files the work created |
| Outside the repository | URL or ID (Figma frame, ticket, PR, store listing) |

### Reading a session

1. Read the session file.
2. **Recheck:** list every pointer marked `(recheck: …)`.

### Lifecycle

| Status | Meaning |
| --- | --- |
| `open` | Work in progress; every process edits the state in place |
| `closed` | Work done; never reopened or edited |

A request to change work from a closed session creates a new session with `follows` set to the closed one. The new session starts with a copy of the closed session's **Agreed**, **Ruled out**, and **Open** items.

### `index.md` mirror

One row per session: `ID` = `session_id`, `Session` = `name`, `Intent` = the intent line, `Status` = frontmatter `status`. Add the row on create; update `Status` on close.
