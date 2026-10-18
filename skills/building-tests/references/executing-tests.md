# Executing Tests

## Overview

**Execution mode.** Runs the tests a task, phase, or user names and reports the result. Edits files only to fix a failure inside the requested scope.

## Prerequisites

[test-contract.md](./test-contract.md) → **Runner**.

## Guidelines

### 1. Pick the scope

The command a task names, else the narrowest scope covering the request: a segment (with `--surface` and `--case` while iterating), an area, a journey, a property, or `all`.

### 2. Run

From the tests root. A failing `health` command → run `backend.start` once and run again; still failing → stop and report the command and its output.

### 3. Diagnose a failure

1. Read the failing definition and the framework's artifacts (trace, screenshot, log).
2. Classify:

| Cause | Do |
| --- | --- |
| Given or Then state does not hold | Check the state's support code against its definition |
| The implementation targets the wrong element or screen | Fix the implementation |
| The app breaks the expectation | Fix the app when the work in progress owns that code; else report it |
| The expectation itself looks wrong | Ask the user |

3. Drive the app by hand only when the artifacts cannot locate the cause.
4. Re-run the failing scope after each fix.

### 4. Confirm to the user

Reply with the command, passed, failed, and skipped counts (`pending`, `draft`), each failure's cause and fix, and artifact paths for screenshots.
