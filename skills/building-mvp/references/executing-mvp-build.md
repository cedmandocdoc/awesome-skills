# Executing MVP Build

## Overview

**Backlog execution mode.** Runs one idea from conversation to a live production MVP. The user is asked only where a step says so; every finished step is saved to the session, so a later chat resumes at the step that stopped.

## Prerequisites

[mvp-contract.md](./mvp-contract.md). Each dependency skill is found per its **Discover dependency skill**.

## Guidelines

### 1. Start or resume

| Request | Do |
| --- | --- |
| Resume | Find the session per managing-context-sessions → Continue; its `Run: building-mvp` item names the step; go there |
| Build, with an idea in the request or chat | Step 2 with that idea |
| Build, no idea | Step 2; building-idea asks for it |

### 2. Idea

1. Run building-idea → Build an idea. At **Platform and stack**, suggest the **Stage map** stack; a user decision outside it stops per **Stage map**.
2. Done when its summary is printed with every branch resolved or parked.
3. Create the session per managing-context-sessions → Create (root `sessions/` when none exists) with the Idea item and `Run: … step 3 Ask to build`, per [mvp-contract.md](./mvp-contract.md) → **Session record**.

### 3. Ask to build

Ask `The idea is settled. Start building?` and wait. No → stop; the session keeps step 3.

### 4. Agent setup

1. Install the stage skills per [mvp-contract.md](./mvp-contract.md) → **Install stage skills**.
2. Read the **Setup** table of every stage skill and of delivering-goal and managing-context-sessions. Answer each `ask` row from the idea, the row's default, and read-only commands (`npx wrangler whoami`, `supabase orgs list`, `gh api user`); default the product name, a private repository named after it, and the production URL.
3. Default each applying check in [mvp-contract.md](./mvp-contract.md) → **Autonomy-gap checks**.
4. Show one table of every answer and decision and ask the user to confirm or change any row. Record the result in the session (Setup answers, Decisions).
5. Act on the **Setup policy** exceptions, each skipped when it already holds:
   - Repository: delivering-goal's Local repository row, then `gh repo create <owner>/<name> --private --source . --push`.
   - `phase-deliverer`: run delivering-goal → Set up.
6. Set `Run: … step 5 User setup`.

### 5. User setup

1. List the user items in order: runtimes and CLIs, logins, Docker, tokens and secrets, then autonomy-gap user items. Sources: every `user` row of the stage skills, with the deploy skills' CI token rows taking their permission rows from the confirmed answers. Write them to User prerequisites; add each `todo` one to **Open**.
2. For each item in order: Done when holds → `ready`. Otherwise send one message with the item and its How (a token with its Permission | Level table headed by the count), wait for the user's reply, run the Done when, and on failure show only what failed and ask again. Record `ready <YYYY-MM-DD>` and drop it from **Open**.
3. Before the Supabase CI token item, when the answer is a new project: run deploying-supabase-application → Provision for project creation only, and record the ref in Setup answers.
4. Set `Run: … step 6 Deliver`.
5. `phase-deliverer` was created in this run and the harness loads agents only at start → ask the user to restart the agent, then say "continue the session".

### 6. Deliver

1. Write the run-level lines per [mvp-contract.md](./mvp-contract.md) → **Run-level AGENTS.md lines**; commit them with the session.
2. Fill [`../assets/goal-statement.md`](../assets/goal-statement.md): `{{STAGES}}` as one numbered line per **Stage map** row (`<stage> — <skills>`), `{{PRODUCTION_CHECKS}}` from the Production verification decision. Run delivering-goal → Deliver or continue with it, and record the Goal item.
3. `task_blocked` or `plan_blocked` → add the blocker to **Open**, show it to the user, and once they resolve it run Deliver or continue again with `Blocker resolved: yes`.

### 7. Done

When the goal completes and its **Verification** holds:

1. Remove the run-level lines and commit.
2. Set `Run: building-mvp, done`; close the session per managing-context-sessions → Close.
3. Reply with the production URL, the goal path, and the session path.
