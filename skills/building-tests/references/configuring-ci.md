# Configuring CI

## Overview

**Execution mode.** Writes `.github/workflows/tests.yml`, which runs the suite on GitHub Actions with only the commands in `index.md`: it starts the local stack, installs each surface's runtime, and runs the runner per job. Runs on request, and whenever `backend` or `surfaces` change while the workflow exists.

## Prerequisites

[test-contract.md](./test-contract.md) → **Index frontmatter** and **Runner**.

## Guidelines

### 1. Resolve root

Per contract → **Resolve tests root**. Read `index.md` frontmatter and the repository's lockfile.

### 2. Fill `ci` per surface

For every surface without `ci`, propose `on` and `host`, then `install` and `prepare` from its framework skill; ask the user to confirm or adjust in one message. Defaults: browser and API surfaces `pr` on `linux`; native surfaces `nightly` on `android-emulator`, or no `ci` when the app has no Android build. Record the answers in `index.md`, then `npm run check`.

### 3. Plan jobs

One job per `on` and `host` pair, id `<on>-<host>` (`pr-linux`, `nightly-android-emulator`), running the surfaces with that pair.

| `on` | Job `if` | Workflow trigger it needs |
| --- | --- | --- |
| `pr` | `github.event_name != 'schedule'` | `pull_request` |
| `nightly` | `contains(fromJSON('["schedule", "workflow_dispatch"]'), github.event_name)` | `schedule` at `0 3 * * *` |
| `manual` | `github.event_name == 'workflow_dispatch'` | `workflow_dispatch` (always present) |

A journey whose steps span two jobs is skipped in both; list it for the user.

### 4. Write the workflow

Per **Examples**, with the project's package manager, keeping only the triggers step 3 needs:

- Each job runs, in order: checkout, package manager and Node from the repository, dependency install at the repository root, `backend.install`, `backend.start`, each surface's `install`, then each surface's `prepare` and `npm run test -- all --surface <ids>`.
- The `android-emulator` host enables KVM, sets up Java 17, and runs `prepare` and the runner inside the emulator step's `script`.
- The app reads the local stack's URLs and keys from committed test config or from `prepare`; the workflow sets no secrets.
- Every job uploads `<tests-root>/.results/` even on failure.

### 5. Confirm to the user

Reply with the workflow path, each job with its surfaces and trigger, the `ci` fields recorded in `index.md`, and journeys no job runs.

## Examples

`pr-linux` and `nightly-android-emulator` for the contract's example `index.md`, tests root `tests/`:

```yaml
name: Tests

on:
  pull_request:
  schedule:
    - cron: "0 3 * * *"
  workflow_dispatch:

concurrency:
  group: tests-${{ github.ref }}
  cancel-in-progress: true

jobs:
  pr-linux:
    if: github.event_name != 'schedule'
    runs-on: ubuntu-latest
    timeout-minutes: 30
    defaults:
      run:
        working-directory: tests
    steps:
      - uses: actions/checkout@v7
      - uses: pnpm/action-setup@v6
      - uses: actions/setup-node@v7
        with:
          node-version-file: .nvmrc
          cache: pnpm
      - run: pnpm install --frozen-lockfile
        working-directory: .
      - run: pnpm supabase:start
      - run: pnpm exec playwright install --with-deps chromium
      - run: npm run test -- all --surface web,api
      - uses: actions/upload-artifact@v7
        if: always()
        with:
          name: results-pr-linux
          path: tests/.results/

  nightly-android-emulator:
    if: contains(fromJSON('["schedule", "workflow_dispatch"]'), github.event_name)
    runs-on: ubuntu-latest
    timeout-minutes: 60
    defaults:
      run:
        working-directory: tests
    steps:
      - uses: actions/checkout@v7
      - uses: pnpm/action-setup@v6
      - uses: actions/setup-node@v7
        with:
          node-version-file: .nvmrc
          cache: pnpm
      - run: pnpm install --frozen-lockfile
        working-directory: .
      - run: pnpm supabase:start
      - run: curl -fsSL "https://get.maestro.mobile.dev" | bash && echo "$HOME/.maestro/bin" >> "$GITHUB_PATH"
      - uses: actions/setup-java@v6
        with:
          distribution: temurin
          java-version: 17
      - run: |
          echo 'KERNEL=="kvm", GROUP="kvm", MODE="0666", OPTIONS+="static_node=kvm"' | sudo tee /etc/udev/rules.d/99-kvm4all.rules
          sudo udevadm control --reload-rules
          sudo udevadm trigger --name-match=kvm
      - uses: reactivecircus/android-emulator-runner@v2
        with:
          api-level: 34
          arch: x86_64
          working-directory: tests
          script: |
            pnpm --filter mobile exec expo run:android --variant release --no-bundler
            npm run test -- all --surface mobile
      - uses: actions/upload-artifact@v7
        if: always()
        with:
          name: results-nightly-android-emulator
          path: tests/.results/
```

## References

- [GitHub-hosted runners](https://docs.github.com/en/actions/using-github-hosted-runners/using-github-hosted-runners/about-github-hosted-runners)
- [Android Emulator Runner](https://github.com/ReactiveCircus/android-emulator-runner)
