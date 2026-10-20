---
name: syncing-awesome-skills
id: 6697e357-b751-42ae-a893-5ec49eddf936
description: Syncs project repos to the latest awesome-skills main — keeps a registry of repos (add, delete, hold, resume), asks which repos to sync, then runs one subagent per repo that copies the updated skills, makes the implementation changes the skill diff requires, and opens a PR — pausing to ask the user when a change is complex (deliver it with the repo's delivering-goal, sync only the simple changes, or abort) or a step fails. Use only when the user names this skill (`/syncing-awesome-skills`, `$syncing-awesome-skills`, or "syncing-awesome-skills").
version: 1.0.0
---

# Syncing Awesome Skills

## Setup

| Item | Kind | Required | When | Done when | How |
| --- | --- | --- | --- | --- | --- |
| Node.js 20+ | user | required | All | `node --version` succeeds | https://nodejs.org |
| Git CLI | user | required | All | `git --version` succeeds | https://git-scm.com/downloads |
| GitHub CLI | user | required | Sync | `gh auth status` succeeds | `brew install gh`, then `gh auth login` |
| Subagents | user | required | Sync | The harness offers a subagent tool | Run in Claude Code |
| Source path | ask | required | All | `node <registry> list` prints a `source` line | Ask for your own awesome-skills clone (default: none — a managed clone); none → `node <registry> init`, a path → `node <registry> init --source <path>`; recorded in the registry file per [sync-contract.md](references/sync-contract.md) → **Registry** |
| Registered repos | ask | required | Sync | `node <registry> list --json` has at least one repo | Ask for the folder holding the repos (default: current directory); run `node <registry> add --in <dir> --json`, show the candidates, ask which to add, then `node <registry> add <path> …` |

## Workflow

1. **Setup** — for each **Setup** row whose When covers the request, in order: Done when holds → skip; `user` → stop and print its How when required, continue without it when optional; `ask` → fill what the request answers, ask the rest together in one message, record each answer; `auto` and `static` → run.
2. **Contract** — read [sync-contract.md](references/sync-contract.md).
3. **Recipe** — match one **Recipes** row; open every doc in its Read column.

- Supports one setup — repos on GitHub with skills installed by the `skills` CLI in any agent dir (`.agents`, `.claude`, `.agent`, …) — and skips any repo that fails a precondition, with the reason.
- Writes to project repos only inside sync worktrees under each repo's `.claude/worktrees/`; never edits files in a repo's own checkout.

## Recipes

| Intent | Example phrasing | Read |
| --- | --- | --- |
| Set up | "Set up syncing-awesome-skills", "Is syncing-awesome-skills ready?" | **Setup** — run Workflow step 1 for every row, then report each row's state |
| Sync | "/syncing-awesome-skills", "/syncing-awesome-skills web api", "sync all" | [executing-sync.md](references/executing-sync.md) |
| Manage registry | "add ~/code/web", "hold api mid-release", "resume api", "delete docs", "list repos" | [managing-registry.md](references/managing-registry.md) |
