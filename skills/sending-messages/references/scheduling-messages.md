# Scheduling Messages

## Overview

**Execution mode.** Plans send times for messages the caller gives (their words and attachments already final), shows the plan, and queues exactly those messages on the user's go. The Worker sends each when due.

## Prerequisites

Per [sending-contract.md](./sending-contract.md) → **Planning**, **Tracking**, **Commands**.

## Guidelines

### 1. Gather the messages

A JSON array per **Commands** → message, from the request or the calling skill. Messages tied to tracking deliveries carry `delivery`. A start the user names ("tomorrow 9 AM") becomes `--start "YYYY-MM-DD HH:MM"` in `timezone`.

### 2. Plan

`node <skill>/scripts/outbox.mjs schedule --file <json> [--start …] [--batch <name>]`. Nothing is queued. Attachments may be left out at this step; the plan needs only the list.

### 3. Show the plan

The sender, the window, the cap, how many go each day, and every message with its local send time.

### 4. Queue on the go

Only on the user's go for exactly these messages: run the same command with `--yes` and the same messages (now with their attachments) and start. Each tied delivery becomes `scheduled`; a refused one is listed and its message cancelled.

### 5. Confirm to the user

How many were queued, the first and last send time, any refused, and that `outbox.mjs list --batch <name>` (or the tracking board) shows each one as it goes.
