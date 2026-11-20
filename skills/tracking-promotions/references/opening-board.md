# Opening Board

## Overview

**Read-only.** Serves the board on `127.0.0.1`: every promotion with its assets, state and history, and every delivery with its latest status, read from D1 and the promotions roots. The board has no actions besides Reload.

## Prerequisites

Per [tracking-contract.md](./tracking-contract.md) → **index.md fields**, **Resolve promotions roots**, **Statuses**, **Freeze**.

## Guidelines

### 1. Start it

`node <skill>/scripts/board.mjs [--port 4410]` from the repository, in the background. A port in use → reuse the board already serving there, or pass another port.

### 2. What it shows

| View | Shows |
| --- | --- |
| Overview | The figures (posts posted, scheduled ahead, messages sent, reply rate), what needs the user (approved messages waiting for the go, approved posts not scheduled, failures, changed or missing sources, promotions in use that aren't rendered here), what's next, and every promotion with its delivery stages |
| Promotions | Each promotion: thumbnail, state, stages; its sheet holds its assets (zoom, step through frames, play videos), its message plan, and its history |
| Posts | A month calendar and a sortable list; each post's sheet holds its assets, caption, times and link |
| Messages | Approved batches waiting for the go, messages queued to send with their send time, results by batch, and every message; each sheet holds its asset, the fill it went out with, the text and its history |
| Timeline | Every step any promotion or delivery took, newest first |

Every view filters by search, app and dates, plus its own fields; active filters show as removable tags.

### 3. Confirm to the user

The URL, and anything the Overview lists under "Needs you".
