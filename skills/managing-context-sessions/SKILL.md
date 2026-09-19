---
name: managing-context-sessions
id: c1e76cba-3d65-4bfe-82cb-6b3654c08429
description: >-
  Carries focused context for one piece of work across agent sessions. Creates
  a context session file under sessions/ that declares the work's current state
  — what is agreed, ruled out, and open, with pointers to where each part lives
  — continues it by reading only the pointed sources, running the requested
  task, and editing the state in place, updates it with work done outside a
  continue, and closes it when the work is done. Invoke explicitly by name to
  create, continue, update, or close a context session.
version: 2.0.0
disable-model-invocation: true
---

# Managing Context Sessions

## Overview

One file per piece of work (`<sessions-root>/<NN>-<slug>.md`) that declares its current state: what is agreed, ruled out, and open. Items point to files, sections, or outside items when a source holds the detail; otherwise the session holds it. Each process — ideation, specs, design, implementation, or any other — reads the state, opens only the sources relevant to its task, and edits the state in place. Process-agnostic: the skill never knows or predicts which process comes next. Rules: [session-contract.md](references/session-contract.md).

## Agent workflow

Runs only when the user invokes this skill by name. Once invoked, it stays active for the rest of the chat. Works wherever the agent can read and write repository files. Match one **Recipes** row; open exactly that reference.

### Recipes

| Intent | Example phrasing | Read |
| --- | --- | --- |
| Create | "Create a session: …", "Create a session for saved cards", "new session" | [creating-session.md](references/creating-session.md) |
| Continue | "Continue `sessions/03-…`: build the PRD", "Continue the saved cards session" | [continuing-session.md](references/continuing-session.md) |
| Update | "Update the session", "Update `sessions/03-…` with this work" | [updating-session.md](references/updating-session.md) |
| Close | "Close the session", "Close `sessions/03-…`" | [closing-session.md](references/closing-session.md) |

## Reference index

### Contract

[session-contract.md](references/session-contract.md) — root marker, layout, frontmatter, session body, item and pointer rules, lifecycle, index mirror.

| Doc | When to use |
| --- | --- |
| [session-contract.md](references/session-contract.md) | Resolve root, find a session by name, session body, lifecycle |
| [creating-session.md](references/creating-session.md) | New session file; record state the chat already settled |
| [continuing-session.md](references/continuing-session.md) | Brief from a session, run the task, update the state |
| [updating-session.md](references/updating-session.md) | Edit the state in place for finished work |
| [closing-session.md](references/closing-session.md) | Mark a session closed |

## Templates

- [`assets/index.md`](assets/index.md) — sessions root marker
- [`assets/session.md`](assets/session.md) — session file with state sections
