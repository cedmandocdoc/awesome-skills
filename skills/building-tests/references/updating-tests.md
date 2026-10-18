# Updating Tests

## Overview

**Authoring mode.** Keeps tests true after a change to a flow, a state, or a route, or applies a requested edit (a case, a casting, a confirmed draft). Definitions change before implementations.

## Prerequisites

[test-contract.md](./test-contract.md).

## Guidelines

### 1. Resolve root

Per contract → **Resolve tests root**.

### 2. Map the change

From the diff or the request, find the segments whose `covers` match, the states whose build, lookup, or check calls changed, and the properties whose routes changed. A new flow with no segment → [creating-tests.md](./creating-tests.md) for it.

### 3. Edit definitions

- New cases start `pending` until their code exists; a case whose code now exists becomes `ready`.
- A removed flow → delete its segment and implementations, and fix every journey that ran it.
- Keep journey chains intact: a changed Then updates the next step's Given or splits the journey.

### 4. Edit support and implementations

States and personas first, then each affected implementation per contract → **Implementations**.

### 5. Sync

`npm run check`, then run every affected segment, journey, and property; diagnose failures per [executing-tests.md](./executing-tests.md) → **Diagnose a failure**.

### 6. Confirm to the user

Reply with the definitions, states, and implementations changed, cases moved between `pending` and `ready`, run results, and any expectation that changed with its source.
