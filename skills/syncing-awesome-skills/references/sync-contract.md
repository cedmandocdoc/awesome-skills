# Sync Contract

## Overview

Governs the registry, the `registry.mjs` script, how out-of-date skills are detected and applied, how migration complexity is judged, and the branch, commit, and PR conventions every sync uses.

## Guidelines

### Script

`<skill dir>` = the absolute path of this skill's installed folder. `<registry>` = `<skill dir>/scripts/registry.mjs`, run with `node`. Zero dependencies.

| Command | Does |
| --- | --- |
| `init [--source <path>]` | Sets the user's own awesome-skills clone, which is only checked, never moved. No path → clones `cedmandocdoc/awesome-skills` into `~/.cache/awesome-skills`, which `plan` resets to `origin/main` each run |
| `list [--json]` | Registered repos with status |
| `add [path …] [--in <dir>] [--json]` | Registers repos; skips paths that are not git repos or have no awesome-skills lock entries. No path → lists unregistered repos directly under `<dir>` (default: current directory) that use awesome-skills |
| `delete <name>` | Removes a repo from the registry; repo files untouched |
| `hold <name> [--reason <text>]` | Keeps the repo listed, excluded from syncs |
| `resume <name>` | Undoes `hold` |
| `plan [--json]` | Fetches the source and every repo, checks **Eligibility**, and lists each repo's out-of-date skills as committed on its `base` (`origin/<default>`); a repo failing a precondition gets `skip: <reason>`; `eligible` is true only for active, passing repos with out-of-date skills |
| `apply <path> --sha <sha>` | Refuses unless the source is still clean and at `<sha>`; copies every out-of-date awesome-skills skill into `<path>` and updates `skills-lock.json` hashes; prints `{ changed, missing, sourceSha }` |

No arguments in a terminal → interactive menu for the user. The agent always passes a command.

### Registry

File: `~/.config/awesome-skills/sync.json` (override with env `AWESOME_SKILLS_SYNC_CONFIG`).

```json
{
  "source": "/Users/<you>/.cache/awesome-skills",
  "repos": [
    { "name": "web", "path": "/Users/<you>/code/web", "status": "active" },
    { "name": "api", "path": "/Users/<you>/code/api", "status": "hold", "reason": "mid-release" }
  ]
}
```

Change it through the script, never by hand-editing in the agent.

### Out-of-date detection

- A repo's awesome-skills skills = `skills-lock.json` entries with `source: "cedmandocdoc/awesome-skills"`.
- A skill's install folders are every committed `<agent dir>/skills/<name>` folder or symlink — whatever agent dirs the `skills` CLI wrote (`.agents`, `.claude`, `.agent`, `.windsurf`, …), found by name, with no fixed agent list; symlinks resolved.
- A skill is out of date when any real install folder differs from the source's **git-tracked** files under `skills/<name>/`, hashed like the `skills` CLI.
- `apply` rewrites each real install folder in place, keeping the repo's layout (copies stay copies, symlinks stay symlinks), and sets `computedHash` in `skills-lock.json`. Third-party skills are never touched.
- Use `apply`, never `npx skills update` — the CLI also updates third-party skills and rewrites the install layout.
- A lock entry whose skill no longer exists in the source is reported as `missing`; leave it and list it in the PR's **Deferred**.
- Syncs branch from `origin/<default>`; never push or base a sync on the user's local default branch.

### Eligibility

The skill supports one setup and skips everything else instead of handling it.

| Applies to | Precondition | Fails → |
| --- | --- | --- |
| Source | On `main`, no uncommitted tracked changes, no untracked files under `skills/`, HEAD equals `origin/main` | `source.ok` false; stop the sync and print `source.problems` |
| Repo | `origin` remote on GitHub, and `origin/<default>` exists | `skip` |
| Repo | Every awesome-skills skill has at least one install folder on `base` | `skip` |
| Repo | Local default branch is not ahead of `base` | `skip` |
| Repo | No local `chore/sync-awesome-skills-*` branch and no open PR from one | `skip` |
| Repo | `gh` can list the repo's PRs | `skip` |

A skipped repo is fixed by the user, not by the sync.

### Conventions

| Item | Value |
| --- | --- |
| Branch | `chore/sync-awesome-skills-<short sha>` |
| Base | `plan` → repo `base` (`origin/<default>`) |
| Worktree | `<path>/.claude/worktrees/sync-awesome-skills-<short sha>` (Claude Code's worktree location), with `.claude/worktrees/` in the repo's local `info/exclude` (never its `.gitignore`); removed when the subagent finishes |
| Local branch | Deleted after the push; the remote branch carries the PR |
| Commit 1 | `chore(skills): sync awesome-skills to <short sha>` — skill folders and `skills-lock.json` only |
| Commit 1b | `chore(skills): add delivering-goal from awesome-skills <short sha>` — only when **Delivering complex changes** installs it |
| Commit 2 | `refactor: align with awesome-skills <short sha>` — simple implementation changes, only when there are any |
| Delivery commits | delivering-goal's own commits for the goal and each task — only for the **Complex changes** option Deliver |
| Commit trailer | `Co-Authored-By: Claude <noreply@anthropic.com>` |
| PR title | `chore: sync awesome-skills to <short sha>` |

### Implementation scope

Implement everything the updated skills ask of the repo — required changes and larger alignments alike (renamed paths, changed sections or frontmatter, stack, lint, layout, template, and doc rules) — and install any third-party skill a synced skill's **Setup** table requires that the repo lacks (`npx skills add <owner/repo> --skill <name>`, keeping the repo's install layout and leaving other skills untouched). Simple changes are made directly; complex changes follow **Complex changes**.

A change is **complex** when any of these hold:

| Signal | Example |
| --- | --- |
| Needs a product or design decision | Skill now asks for a choice the repo never made |
| Restructures layout across many files or packages | Moving `goals/` to a new tree, renaming a folder convention repo-wide |
| Touches data, migrations, deploy, or CI | New deploy flow, changed Supabase migration rules |
| Cannot be verified by the repo's checks | Behavior change with no test coverage |
| Ambiguous — more than one reasonable reading | Skill text conflicts with a repo-specific rule in `AGENTS.md` |

### Complex changes

The subagent lists every complex change at once and asks the user to pick one option for the repo:

| Option | Does |
| --- | --- |
| Deliver | Makes the simple changes, then delivers the complex ones per **Delivering complex changes** |
| Simple only | Makes the simple changes; lists each complex change with the skill rule that requires it under the PR's **Deferred** — the next sync no longer sees them, since the skills are up to date |
| Abort | Removes the worktree and branch; nothing is pushed |

### Delivering complex changes

1. **Install.** The repo has no `delivering-goal` lock entry from `cedmandocdoc/awesome-skills` → `npx skills add cedmandocdoc/awesome-skills --skill delivering-goal` in the worktree, keeping the repo's install layout and leaving other skills untouched; Commit 1b.
2. **Load.** Read `SKILL.md` from the worktree's delivering-goal install folder by path and follow it — never the Skill tool, which resolves the session's copy, not the repo's.
3. **Goals root.** The repo's marked goals root when it has one, else `goals/` created by delivering-goal's **Setup**. Goal files are committed.
4. **Plan goal.** Write the goal from the impact plan: each complex change, the skill rule behind it, the affected paths, and the repo checks that define done. The phase list goes to the user per syncing-repo **Needs input** before delivery starts.
5. **Phase deliverer.** Satisfy delivering-goal's delivery-agent Setup row without writing an agent file: launch each phase as a general-purpose subagent whose prompt is the body of `<install folder>/assets/agents/phase-deliverer.md` followed by delivering-goal's launch line, with `Skill dir:` set to the worktree install folder.
6. **Halts.** Any question delivering-goal puts to the user, a blocked phase, or a failed phase → syncing-repo **Needs input**; continue the loop after the answer.
