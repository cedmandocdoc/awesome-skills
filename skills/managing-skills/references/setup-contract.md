# Setup Contract

## Overview

Rules for `SKILL.md` → **Setup**: one table of everything a recipe needs first — what the user provides, what the agent asks, and what the agent creates — with a check per row.

## Guidelines

### Setup kinds

| Kind | Who acts | Holds | User can change the result |
| --- | --- | --- | --- |
| `user` | The user, where the agent cannot act | Runtimes and CLIs, skills, accounts and sign-ins, harness capabilities beyond reading and writing files (shell, subagents), dashboard connections | — |
| `ask` | The agent asks once and records the answer | Root path, production branch, allowed origins | Yes, by running **Set up** again |
| `auto` | The agent, from the project's state | Standing rule, `npm install`, detected package manager | Yes, by editing the result |
| `static` | The agent, in the fixed shape the recipes read back | Root marker, output layout, copied viewer app | No; only a new skill version changes it |

A step that asks and then creates splits into an `ask` row and the row that uses the answer.

### Setup table

Columns in this order:

| Column | Content |
| --- | --- |
| Item | Name. Skill rows: GitHub URL on the name; this catalog adds `id` in backticks; third-party skills: `name` only unless that skill publishes an `id` |
| Kind | Per **Setup kinds** |
| Required | `required` or `optional` |
| When | `All`, or the recipes that need the row; `via <skill>` for a row repeated from a dependency skill |
| Done when | An observable check: a command succeeds (`node --version`, `npx wrangler whoami`), a skill is found per **Discover dependency skill**, a file with its marker exists, a line is present |
| How | `user`: install command (`npx skills add <owner>/<repo> --skill <name>` for skills), sign-up URL plus sign-in command, or exact steps. `ask`: the question, its default, and where the answer is recorded. `auto` and `static`: the step, or a link to the reference section that runs it |

- Rows in run order: a row comes after the rows it needs.
- No rows → the section reads `None.`
- A required dependency skill's required `user` rows repeat with When `via <skill>`; its other rows run when that skill runs.
- A combined install command may sit under the table when several skills from the **same** repo are the usual path.
- Root initialization is Setup: an `ask` row for the path and a `static` row for the marker, whose How links to the contract's init procedure.
- The **Standing rule** row: [invocation-contract.md](./invocation-contract.md) → **Standing rule**.

### Recorded answers

Write each `ask` answer where later runs read it: the root marker's frontmatter for a skill with a marked root, else the file the answer configures (`wrangler.toml`, `eas.json`). The row's Done when checks that place.

### Set up recipe

A skill with Setup rows routes setup through the first **Recipes** row. The Read cell is verbatim; Example phrasing may add the skill's own setup requests ("Set up measurement"):

```markdown
| Set up | "Set up <thing>", "Is <name> ready?" | **Setup** — run Workflow step 1 for every row, then report each row's state |
```

### Discover dependency skill

Copy into the requiring skill's contract with its skill rows, skill-root list included.

1. Explicit pointers — `AGENTS.md`, the user request, `@`-mentioned skills.
2. Project roots — glob `<root>/<skill-name>/SKILL.md` (`.agents/skills/`, `.cursor/skills/`, `.claude/skills/`, `.codex/skills/`, `.github/skills/`, and the other agent skill directories).
3. User-level roots — same layout under `~/` (for example `~/.cursor/skills/`, `~/.agents/skills/`). Prefer a project copy over a user copy of the same `name`.
4. Custom roots named in `AGENTS.md` or by the user.
5. Read each candidate `SKILL.md` frontmatter. This catalog: accept `name` + `id`; a different `id` → skip; deduplicate by `id` (then `name`). A row without `id` (third-party or legacy): accept a unique `name`.

### Checklist

- [ ] Everything a recipe needs first is a **Setup** row: what the user provides (`user`), what the agent asks (`ask`), what it creates (`auto`, `static`), root initialization included
- [ ] Every row has a Done when check and a How
- [ ] A step that asks and creates is split into an `ask` row and the row that uses it
- [ ] Every `ask` row's How names where the answer is recorded
- [ ] A required dependency skill's required `user` rows repeat with When `via <skill>`
- [ ] With rows, the first **Recipes** row is **Set up recipe** verbatim; without rows, **Setup** reads `None.`

## Related

- [skill-contract.md](./skill-contract.md) — `SKILL.md` sections, Workflow step 1
- [invocation-contract.md](./invocation-contract.md) — standing rule row
