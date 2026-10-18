# Creating Tests

## Overview

**Authoring mode.** Writes definitions first, then support code and implementations, for a first suite or for new segments, journeys, or properties in an existing root. For a feature still being built, writes every case and marks the unbuilt ones `pending`.

## Prerequisites

[test-contract.md](./test-contract.md).

## Guidelines

### 1. Resolve root

Per contract → **Resolve tests root**. An existing root → read `index.md`, `personas.md`, `states/`, and the frontmatter of every definition in the requested areas.

### 2. Gather inputs

Per contract → **Inputs**. Read the code for actors, surfaces, and states. Collect expectations from the user's words and every source they point to; note each expectation's source.

### 3. Build the model

Per contract → **Model**, for the requested scope:

1. **States** each flow starts from or reaches, reusing declared ones.
2. **Segments**: cut each flow at every hand-off and surface switch; cases from the sources.
3. **Journeys** for the core loop and critical paths that cross a hand-off.
4. **Properties** for rules every route must keep, when the scope covers routes.
5. **Drafts**: every segment whose expectations come only from code.

### 4. Propose

Send one message: states, segments by area with actor, surfaces, Given → Then, and cases with sources; journeys with ordered steps and casting; properties with covers and exceptions; every draft with its inferred Thens. Write after the user confirms or adjusts. No user to ask → skip this step when every expectation has a source, else stop and report the flows without one.

### 5. Write definitions

`personas.md`, `states/<area>.md`, segments, journeys, and properties from the assets, per contract → **Personas**, **States**, **Segment file**, **Journey file**, **Property file**. Confirmed drafts become `ready` with `source: user`.

### 6. Write support code

`support/personas.ts`, `support/states/<area>.ts`, and `support/routes.ts` when properties exist, implementing [`../assets/runner/types.ts`](../assets/runner/types.ts), per contract → **Personas** and **States**.

### 7. Write implementations

Per surface, per contract → **Implementations**. Add framework dependencies and config to the tests package. Implement only `ready` cases whose code exists; mark the rest `pending`.

### 8. Sync

1. `npm run check`; fix every error.
2. Run each new segment, journey, and property; diagnose failures per [executing-tests.md](./executing-tests.md) → **Diagnose a failure**.

### 9. Confirm to the user

Reply with the root path, segments, journeys, and properties created, cases `ready` and `pending`, drafts awaiting confirmation, run results, the coverage block summary, and the instruction files changed.
