---
name: building-mvp
id: dbed14fc-005c-4a17-a515-c2f6bb67a91e
description: >-
  Takes an application idea to a deployed MVP with as few user prompts as
  possible — settles the idea with building-idea, installs the stage skills,
  answers every setup question from the idea up front, walks the user through
  each credential one at a time and probes it, then runs delivering-goal from
  specs to production on one fixed stack (Vite + React SPA on Cloudflare
  Workers, Supabase backend). Saves progress in a context session so a later
  chat resumes where it stopped. Use only when the user names this skill
  (`/building-mvp`, `$building-mvp`, or "building-mvp").
version: 1.0.0
disable-model-invocation: true
---

# Building MVP

## Setup

| Item | Kind | Required | When | Done when | How |
| --- | --- | --- | --- | --- | --- |
| [building-idea](https://github.com/cedmandocdoc/awesome-skills/tree/main/skills/building-idea) `c8cd6566-5342-40cd-bca7-f270308159e7` | user | required | All | Found per [mvp-contract.md](references/mvp-contract.md) → **Discover dependency skill** | `npx skills add cedmandocdoc/awesome-skills -g --skill building-idea` |
| [managing-context-sessions](https://github.com/cedmandocdoc/awesome-skills/tree/main/skills/managing-context-sessions) `c1e76cba-3d65-4bfe-82cb-6b3654c08429` | user | required | All | Found per [mvp-contract.md](references/mvp-contract.md) → **Discover dependency skill** | `npx skills add cedmandocdoc/awesome-skills -g --skill managing-context-sessions` |
| [delivering-goal](https://github.com/cedmandocdoc/awesome-skills/tree/main/skills/delivering-goal) `317e7227-bf0b-42d4-a288-4650802eace5` | user | required | All | Found per [mvp-contract.md](references/mvp-contract.md) → **Discover dependency skill** | `npx skills add cedmandocdoc/awesome-skills -g --skill delivering-goal` |
| Git CLI | user | required | via delivering-goal | `git --version` succeeds | https://git-scm.com/downloads |
| GitHub CLI | user | required | All | `gh auth status` succeeds | https://cli.github.com, then `gh auth login` |

All four skills at once: `npx skills add cedmandocdoc/awesome-skills -g --skill building-mvp --skill building-idea --skill managing-context-sessions --skill delivering-goal`

## Workflow

1. **Setup** — for each **Setup** row whose When covers the request, in order: Done when holds → skip; `user` → stop and print its How when required, continue without it when optional; `ask` → fill what the request answers, ask the rest together in one message, record each answer; `auto` and `static` → run.
2. **Contract** — read [mvp-contract.md](references/mvp-contract.md).
3. **Recipe** — match one **Recipes** row; open every doc in its Read column.

- Once invoked, it steers the rest of the chat.
- Never handles a secret value; the user sets every token and secret.

## Recipes

| Intent | Example phrasing | Read |
| --- | --- | --- |
| Set up | "Set up building-mvp", "Is building-mvp ready?" | **Setup** — run Workflow step 1 for every row, then report each row's state |
| Build | "/building-mvp a potluck planner", "/building-mvp" | [executing-mvp-build.md](references/executing-mvp-build.md) |
| Resume | "Continue the session", "/building-mvp continue @sessions/08-potlucky.md" | [executing-mvp-build.md](references/executing-mvp-build.md) |
