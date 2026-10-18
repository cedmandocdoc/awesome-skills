# Reviewing Coverage

## Overview

**Read-only.** Reports what the suite covers and what it misses. Rewrites only the coverage block in `index.md`.

## Prerequisites

[test-contract.md](./test-contract.md).

## Guidelines

### 1. Check

Run `npm run check` from the tests root.

### 2. Compare with sources

List flows and acceptance criteria in the user's sources with no segment or case, and routes outside every property's `covers` or listed in `except`.

### 3. Confirm to the user

Reply with check errors, the coverage block (segments × surfaces with `ready` and `pending` counts), drafts awaiting confirmation, journeys skipped and why, uncovered flows and criteria with their source, and uncovered routes.
