# Test Contract

## Overview

Shared rules for every recipe: where tests live, the model (states, segments, journeys, properties), where expectations come from, the frontmatter the runner reads, how implementations are written, and how the runner executes them. Definitions are Markdown: their frontmatter is runner data, their body is the readable spec. Implementations are framework-native files beside them. The runner, never the agent, turns definitions into runs.

## Guidelines

### Author signature

Static UUID identifying tests roots created by this skill:

```text
5d56e398-7e61-4ce9-9da5-2f8429285959
```

Every `<tests-root>/index.md` carries this value in frontmatter `author`.

### Output layout

```text
<tests-root>/                         # default: tests/ at the repo root, its own package
  index.md                            # root marker, stack config, coverage block
  package.json  .gitignore            # from assets; framework dependencies added per surface
  runner/                             # copied from assets, never edited
  personas.md                         # who acts
  states/<area>.md                    # named states per area
  support/
    personas.ts                       # persona sessions          (Personas, runner/types.ts)
    states/<area>.ts                  # state build, lookup, check (States, runner/types.ts)
    routes.ts                         # prints routes per surface, for properties
  segments/<area>/<segment>.md        # definition
  segments/<area>/<segment><ext>      # one implementation per surface, ext from index.md surfaces
  journeys/<journey>.md               # definition only; runs existing segments
  properties/<property>.md            # definition
  properties/<property><ext>          # one implementation per surface
```

Areas follow the app's own areas (navigation, feature folders, spec features). Ids are kebab-case and equal the filename.

### Resolve tests root

1. Search the repository for `index.md` files whose frontmatter has `doc_type: tests-index`, `generated_by: building-tests`, and `author` = **Author signature**.
2. One match → use it. Several → ask, listing each path. None → `SKILL.md` → **Setup** creates one on Create; stop and report on other recipes.
3. Write only under the resolved root, except the instruction files in `SKILL.md` → **Setup**, and the test ids and deep links **Implementations** allows in app code.

### Model

| Concept | What it is | Boundaries |
| --- | --- | --- |
| **State** | A named point in the product's lifecycle someone acts on (`shop-open`, `order-priced`) | Has a build, a lookup, and a check (**States**) |
| **Segment** | One actor's uninterrupted intent on one surface, from a Given state to a Then state | Ends where the actor would wait (for another actor or for time) or switch surface; spans as many screens as the intent needs; never contains a hand-off |
| **Journey** | Segments chained in order on one database | Only for the core loop and critical paths; adds no assertions |
| **Property** | A rule that holds on every covered route or screen (accessibility, meta, headers, redirects, no-JS, budgets) | No actor, no state |

- A flow with no hand-off is one segment and needs no journey.
- The actor may be `system` (clock, cron, edge function) on surface `api`.
- **When** is optional: a sees-only segment opens a screen and asserts what is shown.
- Given or Then may be `none` when the app keeps no state for it; then the on-screen assertion is the whole check.

### Inputs

| Need | Source, in order | From code? |
| --- | --- | --- |
| Actors and sign-in | Auth, roles, guards, seed users | Yes |
| Surfaces and how each runs | Package scripts, app config, bundle ids | Yes |
| States: build, lookup, check | Status enums, schema, backend functions, seed | Yes |
| Flows: what each actor gets done | The user's words, then sources the user points to, then routes and screens | Partly |
| Expectations: every Then and case | The user's words, then sources the user points to (specs, stories, tickets, README, any format) | **No** |

- Sources disagree → ask; never pick one silently.
- Code alone gives only a draft: a segment with `status: draft` whose inferred Thens are listed for the user. Drafts are never implemented until the user confirms them.
- Running with no user to ask (a subagent) → a flow without a source for its expectations is a blocker, not a draft.

### Index frontmatter

```yaml
doc_type: tests-index
generated_by: building-tests
author: 5d56e398-7e61-4ce9-9da5-2f8429285959
app: LabadaGo
backend:
  start: pnpm supabase:start                 # brings the stack up
  reset: pnpm supabase db reset              # restores the seed; runs before the suite and each journey
health:                                      # every command must succeed before any run
  - pnpm supabase status
routes: tsx support/routes.ts                # prints {"<surface>": ["/path", …]}; needed by properties
surfaces:
  web:
    ext: .web.spec.ts
    run: pnpm exec playwright test {file} --grep "\[{case}\]"
    requires: pnpm exec playwright --version
  mobile:
    ext: .mobile.yaml
    run: maestro test {envArgs} {file}
    requires: maestro --version
  api:
    ext: .api.test.ts
    run: pnpm exec vitest run {file} -t "\[{case}\]"
```

`run` placeholders: `{file}` (path from the tests root), `{case}` (case id, or the property id), `{envArgs}` (every `TEST_*` and session variable as `-e KEY=value`). Every variable also reaches the process environment.

### Personas

`personas.md` frontmatter lists `personas: [{ id, role, title }]`; the body says how each signs in and where its account comes from (seed, fixture). `role` is what segments name as `actor`. `support/personas.ts` default-exports `Personas` from [`../assets/runner/types.ts`](../assets/runner/types.ts): `session(persona, surface)` returns the environment that signs the persona in on that surface without a one-time code (a storage-state path for a browser, a session token for a deep link). Template: [`../assets/personas.md`](../assets/personas.md).

### States

`states/<area>.md` frontmatter lists `states: [{ id, summary }]`; the body gives each state's meaning, build calls, lookup, and check. `support/states/<area>.ts` default-exports `States` with the same ids: `build(params)` creates it and returns its subject (`{ orderId }`), `lookup(params)` finds the latest matching subject or `null`, `check(subject, params)` confirms it. Build calls go through the backend functions the apps call, as the persona who would act, never raw SQL. Template: [`../assets/state.md`](../assets/state.md).

### Segment file

Template: [`../assets/segment.md`](../assets/segment.md).

| Field | Rule |
| --- | --- |
| `id`, `title` | Title is actor + intent (`Customer approves a proposed price`), never a screen |
| `status` | `ready`, or `draft` while its expectations await the user |
| `actor` | A persona role, or `system` |
| `surfaces` | Every surface with an implementation; a definition names no surface anywhere else |
| `given`, `then` | State ids or `none` |
| `params` | Persona per role and the values builders and lookups need (`customer: olive`, `shop: shop1`) |
| `covers` | Code paths or globs the flow runs through; Update maps diffs through it |
| `cases` | `id`, `status` (`ready` or `pending`), `source` (`user`, `path#heading`, or `draft`); optional `given`, `then`, `params` overrides |

- Cases are the happy path plus variants from acceptance criteria and documented edge cases, sharing the segment's Given unless overridden.
- A case is `pending` until the code it needs exists; the runner skips it.
- Field validation, styling, and copy detail belong to unit tests and design review, never to a case.

### Journey file

Template: [`../assets/journey.md`](../assets/journey.md). Frontmatter `params` (shared by every step) and `steps: [{ segment, surface, case }]`; `surface` is the casting, so changing it re-runs the journey on another platform. Each step's Then equals the next step's Given. In a journey the database resets once, the first step builds its Given, and every later step checks its Given instead of building it. A journey with a `draft` segment or a `pending` case is skipped.

### Property file

Template: [`../assets/property.md`](../assets/property.md). Frontmatter `surfaces`, `covers` (`all` from the `routes` command, or a list), and `except: [{ route, reason }]`. The implementation runs once per surface and loops over `TEST_ROUTES`. New routes are covered with no edit.

### Implementations

Use the surface's framework skill for every framework API. Each file holds only the When and the on-screen Then; the runner owns Given, sign-in, and the Then state.

- Name each implemented case `[<case-id>]` (property: `[<property-id>]`) in a test title. `npm run check` matches these tags.
- A framework that cannot select a test by title (YAML flows) gets one branch per case, run only when `TEST_CASE` equals its id, tagged in a `#` comment above it.
- Read inputs from the environment: `TEST_CASE`, `TEST_SURFACE`, `TEST_PARAMS` (JSON), `TEST_SUBJECT` (JSON), one `TEST_<KEY>` per subject key (`orderId` → `TEST_ORDER_ID`), `TEST_ROUTES` for properties, plus the persona session variables.
- Open the starting screen yourself: a URL or a deep link with the subject id. Never rely on where a previous run left the app.
- Select by stable test ids (`data-testid` on web, `testID` on native) named `<area>:<component>:<element>`. Add missing test ids and deep links to the app code; change nothing else there.
- Wait on what the user would wait for (a visible result), with the framework's bounded waits; never sleep.
- A failing run never edits a Then or a case to pass; an expectation changes only with a source per **Inputs**.

### Runner

From the tests root (`npm run test -- <scope>`, or the package manager's equivalent):

| Scope | Runs |
| --- | --- |
| *(none)* or `all` | `backend.reset`, then every property, segment, and journey |
| `area <area>` | Every segment in that area |
| `segment <id> [--surface <s>] [--case <c>]` | One segment, every surface and ready case unless narrowed |
| `journey <id>` | One journey |
| `property <id>` | One property |

Every run checks `health` first and stops on the first failing command. Per segment case: build the Given → sign the actor's persona in → run the implementation → check the Then. Results print per case and land in `.results/last.json`; exit code 1 on any failure. `npm run check` validates every definition and implementation tag, the journey chains, and state ids against `support/`, then rewrites the coverage block in `index.md`.

### Discover framework skill

For each surface in `index.md`:

1. Explicit pointers: `AGENTS.md`, the user request, `@`-mentioned skills.
2. Project roots: glob `<root>/*/SKILL.md` under `.agents/skills/`, `.cursor/skills/`, `.claude/skills/`, `.codex/skills/`, `.github/skills/`, and the other agent skill directories.
3. User-level roots: the same layout under `~/`. Prefer a project copy over a user copy of the same `name`.
4. Custom roots named in `AGENTS.md` or by the user.
5. Accept a skill whose `description` names the framework in the surface's `run` command. Several → prefer one the user named, else ask.

### Checklist

- [ ] Every segment is one actor on one surface with no hand-off; its title is actor + intent
- [ ] Every Given and Then is a declared state or `none`; no raw SQL in builders
- [ ] Every ready case has a source other than `draft`; drafts are not implemented
- [ ] Every ready case is tagged in each surface's implementation; implementations hold no state setup
- [ ] Journeys chain Then → Given and cover only the core loop and critical paths
- [ ] `npm run check` passes and the coverage block is current

## Related

- [creating-tests.md](./creating-tests.md) — first suite or new tests
- [updating-tests.md](./updating-tests.md) — keep tests true after a change
- [executing-tests.md](./executing-tests.md) — run and diagnose
- [reviewing-coverage.md](./reviewing-coverage.md) — gaps and drafts
