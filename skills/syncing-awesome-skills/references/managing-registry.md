# Managing Registry

## Overview

**Execution mode.** Adds, deletes, holds, resumes, or lists registered repos through `registry.mjs`. Touches only the registry file.

## Prerequisites

Per [sync-contract.md](./sync-contract.md) → **Script**, **Registry**.

## Guidelines

### 1. Route the request

| Request | Run |
| --- | --- |
| Add with a path | `node <registry> add <path> …` |
| Add without a path | Ask for the folder holding the repos (default: current directory); `node <registry> add --in <dir> --json`; show candidates numbered; ask which; then `add` the picks |
| Delete | Confirm the name, then `node <registry> delete <name>` |
| Hold | `node <registry> hold <name> --reason "<reason>"` (reason optional) |
| Resume | `node <registry> resume <name>` |
| List | `node <registry> list` |

An unknown name → show `node <registry> list` and ask.

### 2. Confirm to the user

Print the script output, then `node <registry> list`. Mention the user can run `node <registry>` in their own terminal for the interactive menu.
