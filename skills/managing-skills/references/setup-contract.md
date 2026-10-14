# Setup Contract

## Overview

What must exist and what must run before a skill's recipes: `SKILL.md` → **Dependencies** and **Setup**, setup kinds, recorded answers, and the explicit **Set up** recipe.

## Guidelines

### Dependencies or Setup

| Section | Holds | Examples |
| --- | --- | --- |
| **Dependencies** | What must exist before the skill runs and that the skill cannot create | Skills, runtimes and CLIs, accounts and sign-ins, repository preconditions (a git repository) |
| **Setup** | One-time steps per project or root, including root initialization | Root path, root marker, copied app, standing rule, deployed service, dashboard connection |

### Dependencies table

No child headings. Mix skills, tools, accounts, and preconditions in the same rows, in the order the user resolves them.

| Column | Content |
| --- | --- |
| Item | Name. Skill rows: GitHub URL on the name. This catalog: then `id` in backticks. Third-party skills: `name` only unless that skill publishes an `id`. |
| Required | `required` or `optional` |
| When | Recipes or entry points that need this row; `via <skill>` for a row repeated from a dependency skill |
| How | Install command, sign-up URL plus sign-in command, or a check that implies how to install. GitHub skills: `npx skills add <owner>/<repo> --skill <name>` |

- Every row has **How**.
- A required dependency skill's own required **Dependencies** rows repeat here with When `via <skill>`, so one table lists everything to install.
- A combined install command may sit under the table when several skills from the **same** repo are the usual path.
- Check a required row before the first recipe its When names: run the check in **How** (`node --version`, `npx wrangler whoami`), or find the skill per **Discover dependency skill**.

| Row state | Do |
| --- | --- |
| Missing required | Stop. Print that row's **How** (for skills: command, GitHub URL, and `id` when present). Do not guess a substitute. |
| Missing optional | Continue. Open or use the item if present. |

### Setup kinds

| Kind | Who acts | User can change it | Examples |
| --- | --- | --- | --- |
| `interactive` | Agent asks the user, once | Yes, by running **Set up** again | Root path, allowed origins, production branch, app purpose |
| `auto` | Agent, from the project's state, without asking | By editing the result | Standing rule, `npm install`, detected package manager |
| `static` | Agent, in the fixed shape the skill's recipes read back | No; only a new skill version changes it | Root marker `index.md`, output layout, copied viewer app |
| `manual` | User, where the agent cannot act | — | Dashboard Git connection, store accounts, DNS |

A step that asks and then creates splits into an `interactive` row (the answer) and the row that uses it.

### Setup table

No child headings. Rows in run order.

| Column | Content |
| --- | --- |
| Item | Name |
| Kind | Per **Setup kinds** |
| Required | `required` or `optional` |
| When | The first recipe or entry that needs this row |
| Done when | An observable check: a file with its marker exists, a line is present, a command succeeds, an answer is recorded |
| How | The step, or a link to the **Set up** recipe section that runs it |

The **Standing rule** row: [invocation-contract.md](./invocation-contract.md) → **Standing rule**.

### Recorded answers

Write each `interactive` answer where later runs read it: the root marker's frontmatter for a skill with a marked root, else the file the answer configures (`wrangler.toml`, `eas.json`). A recorded answer is never asked again; only **Set up** changes it.

### Set up recipe

A Setup table with any row other than `auto` gets an explicit setup step:

| Piece | Rule |
| --- | --- |
| Reference | `references/setting-up-<noun>.md`, **Execution mode.**; holds every Setup row's procedure, root initialization included. Contracts link to it instead of holding init procedures |
| Route | A `Set up` row in **Recipes** ("Set up <thing>"), an **Entry points** row, or the first **Steps** step |

A Setup table with only `auto` rows keeps **How** inline and needs no reference.

The reference runs these steps:

1. **Select rows** — every row on an explicit "set up"; otherwise the rows whose When names the requested recipe.
2. **Skip done rows** — a row whose Done when holds is skipped.
3. **Ask** — every pending `interactive` row in one message; record each answer per **Recorded answers**.
4. **Run** — `auto` and `static` rows in table order.
5. **Hand off** — `manual` rows as numbered user steps with the exact values. Continue when the user reports done and Done when holds; stop while a recipe the user asked for needs a pending row.
6. **Confirm** — rows done, rows skipped as already done, answers recorded and where, files changed (instruction files included), `manual` rows still pending.

### Discover dependency skill

Copy into the requiring skill's contract with its skill dependency rows; keep the skill-root tables there so the skill works after install.

1. Explicit pointers — `AGENTS.md`, the user request, `@`-mentioned skills.
2. Project roots — glob `<root>/<skill-name>/SKILL.md` (`.agents/skills/`, `.cursor/skills/`, `.claude/skills/`, `.codex/skills/`, `.github/skills/`, and the other agent skill directories).
3. User-level roots — same layout under `~/` (for example `~/.cursor/skills/`, `~/.agents/skills/`). Prefer a project copy over a user copy of the same `name`.
4. Custom roots named in `AGENTS.md` or by the user.
5. Read each candidate `SKILL.md` frontmatter. This catalog: accept `name` + `id`; a different `id` → skip; deduplicate by `id` (then `name`). A row without `id` (third-party or legacy): accept a unique `name`.

Example installs (one `npx skills add` per source repo):

```bash
npx skills add cedmandocdoc/awesome-skills --skill composing-react-native-application --skill managing-monorepo
npx skills add antfu/skills --skill pnpm --skill turborepo
```

### Checklist

- [ ] Everything the skill needs but cannot create (skills, runtimes, CLIs, accounts, repository preconditions) is a **Dependencies** row with **How**
- [ ] A required dependency skill's required rows repeat with When `via <skill>`
- [ ] Every one-time step, root initialization included, is a **Setup** row with Kind and Done when
- [ ] A step that asks and creates is split into an `interactive` row and the row that uses it
- [ ] Every `interactive` row has a recorded location
- [ ] Any row other than `auto` → a `setting-up-<noun>.md` reference with the six steps, routed from `SKILL.md`; no contract holds an init procedure

## Related

- [skill-contract.md](./skill-contract.md) — `SKILL.md` sections, independence
- [invocation-contract.md](./invocation-contract.md) — standing rule Setup row
