# Writing skills for this repository

This repository is a **catalog of installable agent skills** under `skills/`. Users download or copy a skill into their agent environment (for example `~/.cursor/skills/` or `.cursor/skills/`). Skills here are **not** loaded automatically by this repo.

Each skill installs on its own. In-skill links stay inside that skill’s directory.

When creating, updating, or reviewing a skill under `skills/`, follow [managing-skills](skills/managing-skills/SKILL.md). Match one **Recipes** row; open that recipe, [skill-contract.md](skills/managing-skills/references/skill-contract.md), and [lean-contract.md](skills/managing-skills/references/lean-contract.md).

A line earns its place when removing it would change what the agent does. Scan every edited skill file against the finding categories before delivering.
