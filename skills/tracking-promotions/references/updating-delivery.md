# Updating Delivery

## Overview

**Execution mode.** Moves recorded deliveries to their next status (scheduled, sent, failed, replied, bounced, stopped, cancelled) with the time of that step. It sends nothing; it records what happened.

## Prerequisites

Per [tracking-contract.md](./tracking-contract.md) → **Statuses**, **Commands**.

## Guidelines

### 1. Find the deliveries

The ids the request names, or `track.mjs list` filtered by what it says (a `ref`, a `batch`, a `target`'s status). Several matches for one change → ask which.

### 2. Update

One: `node <skill>/scripts/track.mjs update --id <n> --status <status> [--link <post link or message id>] [--error "<why it failed>"] [--note "<note>"] [--planned-for <ISO time>]` (`--planned-for` with `scheduled` only: when it is planned to go out).

Many: `track.mjs update --file <changes>`, a JSON array or JSON lines of `{ "id", "status", "link"?, "error"?, "note"?, "planned_for"? }`.

A status that can't follow the current one (per **Statuses**) is refused and listed; the others apply.

### 3. Confirm to the user

Each delivery's new status, and each change refused with its reason.
