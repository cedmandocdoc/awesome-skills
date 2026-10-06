# Design Contract

## Overview

Shared rules for every `building-design` workflow: what a design is, where it lives, what it needs as input, and how its copy is written. One design folder serves one intention (a web app, a mobile app, a marketing site, or one part of an app) and works on its own — nothing is shared between design folders.

## Guidelines

### Author signature

Static UUID identifying design roots created by this skill:

```text
54c9a59c-eb33-4860-bff1-a7fc6ae7abea
```

Every `<design-root>/index.md` carries this value in frontmatter `author`.

### Output layout

```text
<design-root>/                   # default: design/
  index.md                       # root marker — created first
  design.md                      # DESIGN.md: tokens, rules, motion, voice, implementation, decisions
  index.html  package.json  vite.config.ts  tsconfig.json  .gitignore   # viewer app — copied, never edited
  viewer/                        # viewer app — copied, never edited
  system/
    define.ts                    # spec API — copied, never edited
    tokens.css                   # generated from design.md YAML — never hand-edited
    type.css                     # fonts + one class per typography token (not in the export)
    motion.css  motion.ts        # motion tokens + named primitives
  ui/<name>/
    <Name>.tsx  <name>.css  <name>.design.ts
  features/<feature>/
    <feature>.design.ts          # flows
    <Screen>.tsx  <screen>.css  <screen>.design.ts
```

Never read `node_modules/`. Surface files, spec schema, and markers: [preview-contract.md](./preview-contract.md). `design.md` structure, token defaults, and YAML rules: [`../assets/design.md`](../assets/design.md).

### Design roots

A design root is the folder holding a valid `index.md`. Roots never nest.

| Situation | Root |
| --- | --- |
| First design in the repo | `design/`, or the user-named path |
| Several intentions started together (e.g. web + mobile) | `design/<intention>/` each, or one root holding all surfaces when the user asks |
| A root already exists and a new intention arrives | New folder named for the intention; ask for the path when `design/` itself is the existing root |

### Resolve design root

1. Search the repository for `index.md` files whose frontmatter has `doc_type: design-root-index`, `generated_by: building-design`, and `author` = **Author signature**.
2. Pick the root:
   - One match → use it.
   - Several → use the one whose `intention` matches the request; ask when unclear (list each `index.md` path).
   - None → **Initialize design root**.
3. A root without `viewer/` was built by an earlier major version: refactor it to **Output layout** and [preview-contract.md](./preview-contract.md) first, keeping `design.md`, copy, and decided motion.
4. Viewer files (see [preview-contract.md](./preview-contract.md) → **Viewer**) that differ from [`../assets/app/`](../assets/app/): copy them over again and replace `index.md` → **Viewer keys** from [`../assets/index.md`](../assets/index.md).
5. Read and write only under the resolved root.

### Initialize design root

1. Target = user-named folder, else `design/`.
2. Target missing or empty → create it. Target not empty → ask whether to initialize there (keep existing files) or pick another path. A target that already holds `package.json`, `index.html`, or `viewer/` always needs another path.
3. Write `index.md` from [`../assets/index.md`](../assets/index.md): `author` = **Author signature**, `intention` = one short phrase.
4. Copy everything in [`../assets/app/`](../assets/app/), dotfiles included, into the root (`cp -R <skill>/assets/app/. <design-root>/`), then run `npm install` there.

Only this skill creates or replaces `index.md`.

### Inputs

| Need | Required | Enough when |
| --- | --- | --- |
| Surfaces | yes | Features, their screens, and the UI blocks they need (from ui-specs, PRD, or the user) |
| States | yes | End views per screen: empty, error, validation, modal or sheet open, … |
| Flows | yes | Paths through screens and states per feature: happy, error, conditional |
| Section intent | yes | What each section or screen must achieve, e.g. "Hero: what we do, for whom, one way in" |
| Facts | yes | Claims copy may make: names, numbers, clients, features, dates |
| Voice | yes | Audience, tone, rules, banned words — or `## Voice` already in `design.md` |
| Visual direction | new design only | Brand, mood, liked sites, or reference artifacts |
| Platform | yes | Desktop/web or mobile-only (sets the viewport matrix) |
| Roles | if UI differs | Who sees which surfaces or variants |

Fill from the user prompt, attached files, and linked specs. Ask once for every empty required row. Amends need only the rows the change touches.

**Reference artifacts** (an existing page, prototype, or exploration) carry an authority the user states:

| Authority | Meaning |
| --- | --- |
| `exact` | Port its markup, CSS values, motion, and copy; change structure only to fit this layout |
| `indicative` | Take direction from it; values come from `design.md` |

Record each reference and its authority under `## Decisions`.

### Viewport matrix

| Platform | Viewports | Default sizes |
| --- | --- | --- |
| Desktop / web | desktop, tablet, mobile | 1440 · 768 · 390 |
| Mobile-only | mobile | 390 |

### Content roles

Every content slot in a surface has one role, declared in its spec.

| Role | Meaning | Implementer rule |
| --- | --- | --- |
| `sample` | Stands in for runtime data | Match the shape; replace the values |
| `canonical` | Ships as written (CTAs, labels, nav, legal) | Copy verbatim |
| `material` | The design depends on these exact words (headlines, animated or line-broken text) | Copy verbatim; changing it reopens the design |

### Writing copy

This skill writes all `canonical` and `material` copy.

- Write from **section intent + voice + facts**.
- Claim only what the facts state. Mark an unsupported claim `[FACT?]` in place.
- `sample` data is invented, realistic for the domain, and sized like real data (long names, empty lists, many rows).
- Follow `## Voice` in `design.md`.

### Existing guides

When the user supplies a style guide (markdown, Figma tokens, CSS variables, Tailwind config), map its colors, type, spacing, radii, shadows, breakpoints, and motion onto the template's token names. Record original names under `## Decisions`; report unmapped values as `[TBD]`.

### Sync

| Change | Sync |
| --- | --- |
| `design.md` YAML colors, spacing, or radii | `npm run tokens` in the root (writes `system/tokens.css`) |
| `design.md` YAML typography | Matching class in `system/type.css` |
| `design.md` → Motion | `--motion-*` values and `@motion` primitives in `system/motion.*` |
| UI block added, renamed, or removed | `design.md` → Components |
| Screen state added, renamed, or removed | Every flow that reaches it |

Surfaces use the exported names: `--color-*`, `--rounded-*`, `--spacing-*`.

### Checklist

Before confirming a build or amend, verify for every surface touched:

- [ ] `npm run check` passes.
- [ ] Every `data-motion`, `data-slot`, and `data-component` has its spec entry, and every spec entry has its marker.
- [ ] Every motion entry uses primitives listed in `design.md` → Motion and a trigger from [preview-contract.md](./preview-contract.md) → **Triggers**.
- [ ] Every `shows: ui#Preset` names a preset that UI block defines.
- [ ] Every screen state appears in at least one flow.
- [ ] No file the viewer owns was edited (see [preview-contract.md](./preview-contract.md) → **Viewer**).
- [ ] No raw value in surface CSS where a token exists.
- [ ] No `[...]` placeholder left; every `[FACT?]` and `[TBD]` is listed in the reply.

Optional: `npm run lint:design` — report errors; warnings are informational.

## Related

- [preview-contract.md](./preview-contract.md) — surfaces, design files, flows, markers, viewer
- [`../assets/design.md`](../assets/design.md) — `design.md` template with defaults
