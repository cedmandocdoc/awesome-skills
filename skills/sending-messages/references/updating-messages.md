# Updating Messages

## Overview

**Execution mode.** Looks up queued and sent messages, and cancels queued ones before they go. Sends nothing.

## Prerequisites

Per [sending-contract.md](./sending-contract.md) → **Outbox**, **Tracking**, **Commands**.

## Guidelines

### 1. Look up

`node <skill>/scripts/outbox.mjs list [--batch <name>] [--status queued,sent,failed,cancelled,skipped]`.

### 2. Cancel

`node <skill>/scripts/outbox.mjs cancel --ids <a,b>` or `--batch <name>`: each queued message becomes `cancelled`, its files leave KV, and a tied delivery becomes `cancelled` in tracking-promotions. A message already sent or failed can't be cancelled; it is listed as `not_queued`.

### 3. Confirm to the user

Per status: the count and each message (address, local time, error for a failure); for a cancel, what was cancelled and what wasn't.
