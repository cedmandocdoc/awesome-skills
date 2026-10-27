# Session Contract

## Overview

Shared plumbing for all `managing-context-sessions` recipes: project, sessions root discovery, layout, session frontmatter, finding a session, session body, item, pointer, and outside source rules, reading a session, lifecycle, and the `index.md` mirror.

## Guidelines

### Project

The folder the agent works in: the workspace root.

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

Search the project for `index.md` whose frontmatter has `doc_type: context-sessions-index`, `generated_by: managing-context-sessions`, and `author` = **Author signature**. The root is its parent directory.

| Matches | Action |
| --- | --- |
| One | Use it |
| Several | Ask which root |
| None, on create or set up | `SKILL.md` → **Setup** creates one |
| None, other intents | Stop and report that no sessions root exists |

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
- `(from: <origin>)` after an item, or after the lead item of a group, names the outside source its content came from. The session is complete without it: open an origin only when the user asks to refresh from it.

### Pointer rules

| Target | Pointer |
| --- | --- |
| Markdown | `path#heading-slug` |
| Code | `path` plus symbol (`SavedCardList`, `savePaymentMethod`) |
| Whole file | `path` — only for files the work created |

Every pointer targets a file in the project.

### Outside sources

A source outside the project — a URL, document, Figma frame, ticket, PR, or file elsewhere on the machine, in any format — becomes items without a pointer, marked `(from: <origin>)`, holding what the work needs from it:

- Distill by understanding into the session's sections: the rules, values, decisions, and examples the work relies on, not the source's layout.
- Keep values exact: numbers, codes, names, formats.
- The user reports a new version of an origin → read it and edit the items from it per [updating-session.md](./updating-session.md) step 3.

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
