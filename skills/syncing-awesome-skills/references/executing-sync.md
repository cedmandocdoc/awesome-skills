# Executing Sync

## Overview

**Orchestration mode.** Asks which registered repos to sync, runs one subagent per repo per [syncing-repo.md](./syncing-repo.md), relays any subagent that needs the user, and reports the outcome. The orchestrator itself only runs `registry.mjs`, spawns and messages subagents, and reads.

## Prerequisites

Per [sync-contract.md](./sync-contract.md).

## Guidelines

### 1. Plan

Run `node <registry> plan --json`.

- `source.ok` false → print `source.problems` and stop.
- Print a numbered table: `#`, repo, status, out-of-date skills (or `up to date`, `held — <reason>`, `skip: <reason>`, `error: …`).

### 2. Pick repos

| Request | Selection |
| --- | --- |
| Names or numbers given (`web api`, `1,3`) | Those repos; a held one only when the user confirms |
| None given | Ask one question: **All eligible (recommended)** — the repos with `eligible` true — or type numbers/names |

Drop every selected repo that has `skip`, `error`, or no out-of-date skills, and say why. Nothing left → report and stop.

### 3. Run subagents

For each selected repo, spawn one background subagent (general-purpose) with this prompt, filled from the plan:

```text
Sync one repo to awesome-skills. Follow <skill dir>/references/syncing-repo.md exactly, with
<skill dir>/references/sync-contract.md as the contract. Skill dir: <skill dir>.
repo: <name>   path: <path>   base: <base>
source: <source.path> @ <source.sha>   branch: <branch>
expected out-of-date skills: <stale>   missing from source: <missing>
```

Run at most 4 at once; start the next as one finishes.

### 4. Relay needs-input

A subagent ending with `status: needs-input` → tell the user right away: **`<repo>` needs your input** — its question and state, unedited (a phase plan in full). Pass the user's replies to that subagent with SendMessage until it reports `succeeded` or `failed`; one subagent may ask several times (complex-change options, delivering-goal's phase plan, a blocked phase). What to do (deliver, simple only, abort, push through, clean up) is the user's call with the subagent.

### 5. Report

When every subagent has reported `succeeded` or `failed`:

```markdown
| Repo | Result | Details |
| --- | --- | --- |
| web | succeeded | https://github.com/<owner>/web/pull/27 |
| api | failed | user aborted: migration rules need a design pass |
```

One row per selected repo, from its report's `status` and `result`.
