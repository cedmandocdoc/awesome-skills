---
name: managing-context-sessions
id: c1e76cba-3d65-4bfe-82cb-6b3654c08429
description: >-
  Carries focused context for one piece of work across chats. Creates
  a context session file under sessions/ that declares the work's current state
  — what is agreed, ruled out, and open, with pointers to where each part lives
  and the content of every outside source it relies on — continues it by reading
  only the pointed sources, running the requested task, and editing the state
  in place, updates it with work done outside a
  continue, and closes it when the work is done. Use only when the user names
  this skill (`/managing-context-sessions`, `$managing-context-sessions`, or
  "managing-context-sessions"), or references a session file under the
  sessions root with a task ("continue @sessions/03-saved-cards.md by building
  the PRD").
version: 3.0.0
---

# Managing Context Sessions

## Setup

| Item | Kind | Required | When | Done when | How |
| --- | --- | --- | --- | --- | --- |
| Root path | ask | required | Create | [session-contract.md](references/session-contract.md) → **Resolve sessions root** finds a root | Ask for the folder (default `sessions/`); missing or empty → use it, else ask for another path; recorded as the root's location |
| Root marker | static | required | Create | `<sessions-root>/index.md` carries [session-contract.md](references/session-contract.md) → **Author signature** | Write `index.md` from [`assets/index.md`](assets/index.md) |

## Workflow

1. **Setup** — for each **Setup** row whose When covers the request, in order: Done when holds → skip; `user` → stop and print its How when required, continue without it when optional; `ask` → fill what the request answers, ask the rest together in one message, record each answer; `auto` and `static` → run.
2. **Contract** — read [session-contract.md](references/session-contract.md).
3. **Recipe** — match one **Recipes** row; open every doc in its Read column.

- Once loaded, it stays active for the rest of the chat.
- Never predicts which process comes next.

## Recipes

| Intent | Example phrasing | Read |
| --- | --- | --- |
| Set up | "Set up managing-context-sessions", "Is managing-context-sessions ready?" | **Setup** — run Workflow step 1 for every row, then report each row's state |
| Create | "Create a session: …", "Create a session for saved cards", "new session" | [creating-session.md](references/creating-session.md) |
| Continue | "Continue @sessions/03-… by building the PRD", "Continue the saved cards session" | [continuing-session.md](references/continuing-session.md) |
| Update | "Update the session", "Update `sessions/03-…` with this work" | [updating-session.md](references/updating-session.md) |
| Close | "Close the session", "Close `sessions/03-…`" | [closing-session.md](references/closing-session.md) |
