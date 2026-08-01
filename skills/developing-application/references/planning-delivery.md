# Planning Delivery

## Overview

**Planning only.** Orients once per delivery. Reads the goal, HOW docs, and current codebase; creates `<delivery-root>/<delivery-name>/` and writes `delivery-map.md` as an **index** of ordered waves (titles, deps, sources — not full briefs). Wave briefs live in `waves/NN-slug.md` when decided.

Returns a **one-line** handoff when run as `delivery-planner`. Stops without creating tasks or wave files unless the user also asked to continue into the delivery loop.

## Prerequisites

Per [delivery-contract.md](./delivery-contract.md) → **Require managing-tasks**, **Require goal**, **Resolve delivery name**, **Require HOW documents**, **Resolve delivery map**.

## Guidelines

### 1. Fail-early checks

1. Require `managing-tasks`.
2. Require a clear goal (ask once if missing — subagent: `Failed delivery plan: missing goal`).
3. Resolve `<delivery-name>` per contract (user name or derive from goal — subagent: `Failed delivery plan: missing delivery name` if still ambiguous).
4. Require HOW documents. On failure → `Failed delivery plan: missing HOW — <paths>` (do not spike).

### 2. Survey current implementation

Short pass: layout empty vs existing; obvious shared libraries; prior deliveries/maps. Record **Current state** on the map. Greenfield is valid.

### 3. Discover governing skills

Per [delivery-contract.md](./delivery-contract.md) → **Discovering project skills**. Honor **Skills to prefer** from the parent prompt. List on the map.

### 4. Derive wave index

From goal + HOW + survey, produce an **ordered** list of wave rows (vertical slices; bootstrap first if no app). For each row:

| Field | Content |
| --- | --- |
| Id | e.g. `01-scaffold` (matches future filename without `.md`) |
| Title | Short name |
| Status | `pending` |
| Depends on | Prior wave ids or `none` |
| Outcome | One-line outcome (Slice Brief Q1 at wave grain) |
| Primary Sources | Paths only |
| Wave file | `none` until decide |
| Task ids | `none` |

If a wave cannot be named without inventing HOW → fail early; do not leave TBD architecture rows.

### 5. Write delivery folder + `delivery-map.md`

1. Resolve `<delivery-root>`: from parent prompt (`Delivery root:`), existing deliveries’ parent, or ask once (e.g. `docs/delivery/`). Subagent without it → `Failed delivery plan: missing delivery root`.
2. Create `<delivery-dir>` = `<delivery-root>/<delivery-name>/` and `<delivery-dir>/waves/` if new. If `<delivery-dir>` already has a map and the user did not ask to continue/replan → `Skipped delivery plan: delivery <delivery-name> already exists`.
3. Copy [`../assets/delivery-map.md`](../assets/delivery-map.md); set frontmatter `delivery: <delivery-name>` and `goal`; fill sources, skills, current state, **Waves** index table, verification smoke, changelog.
4. Continuing the same delivery → update rows carefully, bump `map_revision`, changelog line. Do not delete wave files that are `done` / `ready` unless the user asked to replan.

### 6. Confirm to the user

| Outcome | Reply |
| --- | --- |
| Success | `Planned delivery: <path-to-delivery-dir>/delivery-map.md` |
| Failure | `Failed delivery plan: <reason>` |
| Skip | `Skipped delivery plan: <reason>` |

Do not return the wave index body, Sources lists, or Current state prose to the parent.

When run **inline** (user asked plan-only, not via subagent), the same one-liner plus a one-sentence “next: execute delivery / decide next wave” is enough — still no document dump.

## Related

- [executing-delivery.md](./executing-delivery.md)
- [deciding-next-wave.md](./deciding-next-wave.md)
