# Syncing Repo

## Overview

**Execution mode.** One subagent syncs one repo: worktree, `apply`, impact plan, simple changes, complex changes per the user's pick, checks, commits, PR. Works only in its worktree under the repo's `.claude/worktrees/`; never edits files in the repo's own checkout and never touches other repos.

## Prerequisites

Per [sync-contract.md](./sync-contract.md) → **Conventions**, **Out-of-date detection**, **Implementation scope**, **Complex changes**, **Delivering complex changes**. Inputs come from the orchestrator prompt.

## Guidelines

### Needs input

When the impact plan has a complex change, delivering-goal halts, or any step fails or hits something unexpected (branch already exists, conflict, push or PR creation fails), stop where you are, leave the worktree as is, and end your turn with:

```text
repo: <name>
status: needs-input
question: <what you need decided, with the options you see — for complex changes, every complex change and the options from Complex changes; for a phase plan, the phases in full>
state: <worktree path, branch, commits made so far>
```

When the user answers, carry out their decision — continue, skip, clean up, or anything else — then pick up where you stopped. A run may need input several times.

### 1. Create the worktree

1. `git -C <path> fetch origin`.
2. `git -C <path> check-ignore -q .claude/worktrees/x` fails → append `.claude/worktrees/` to `$(git -C <path> rev-parse --path-format=absolute --git-common-dir)/info/exclude`.
3. `git -C <path> worktree add -b <branch> <worktree> <base>`.

All later steps run inside `<worktree>`.

### 2. Apply skills

1. `node <registry> apply <worktree> --sha <source sha>`. It refuses when the source moved or is dirty → **Needs input**.
2. `changed` empty → remove the worktree and branch (`git -C <path> worktree remove <worktree>`, `git -C <path> branch -D <branch>`), report `succeeded` with `already up to date`, stop.
3. Commit 1 per **Conventions**, staging the changed skill folders and `skills-lock.json`.

### 3. Plan the impact

1. `git diff HEAD~1 -- <changed skill folders>` (the real install folders `apply` reported in `changed`). Note every rule, path, section, or command that changed meaning.
2. For each change, search the repo (excluding skill folders, `node_modules`, `.git`) for code, docs, or config that follows the old rule: file names and paths, frontmatter fields, section headings, script names, folder layouts, `AGENTS.md`/`CLAUDE.md` lines the skills write.
3. Sort each impact per [sync-contract.md](./sync-contract.md) → **Implementation scope**. Include missing third-party skills from each synced skill's **Setup** table. Any complex → **Needs input** with the **Complex changes** options.
4. User picks Abort → `git -C <path> worktree remove --force <worktree>`, `git -C <path> branch -D <branch>`, report `failed` with `user aborted: <reason>`, stop.

### 4. Make the simple changes

1. Make the simple changes and install missing third-party skills.
2. Commit 2 per **Conventions** when there are changes.

### 5. Deliver complex changes

Only when the user picked Deliver: follow [sync-contract.md](./sync-contract.md) → **Delivering complex changes** until delivering-goal reports the goal complete.

### 6. Run checks

1. `package.json` present → install with the repo's package manager (`pnpm install --frozen-lockfile` when `pnpm-lock.yaml` exists).
2. Run each root script that exists among `lint`, `typecheck`, `test` (`<pm> run <script>`), once. Record each result for the PR body as-is; do not diagnose whether a failure predates the sync — the reviewer decides.

### 7. Publish

- `git push -u origin <branch>`, then `gh pr create --base <base without origin/> --head <branch> --title "<PR title>" --body-file <file>`. Body:

  ```markdown
  ## Skill changes
  - `<skill>` — <one line per meaningful change>

  ## Implementation changes
  - <file> — <what and which skill rule required it>  (or "None required")
  - `<goals root>/<goal>/` — delivered with delivering-goal: <one line per phase>  (Deliver only)

  ## Checks
  - lint ✅ / typecheck ❌ <first lines of the error> / test — (no script)

  ## Deferred
  - `<skill>` — <complex change skipped under Simple only, and the rule that requires it>
  - `<skill>` — missing from source  (or "None")

  Source: cedmandocdoc/awesome-skills@<sha>

  🤖 Generated with [Claude Code](https://claude.com/claude-code)
  ```

- Clean up: `git -C <path> worktree remove --force <worktree>`, then `git -C <path> branch -D <branch>` (the pushed branch carries the PR).

### 8. Report

End with exactly:

```text
repo: <name>
status: succeeded | failed
result: <PR URL | "already up to date" | why it failed or was dropped>
```
