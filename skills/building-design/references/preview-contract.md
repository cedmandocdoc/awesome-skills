# Preview Contract

## Overview

Rules for surfaces — the runnable React previews under `ui/` and `features/` — their `.design.ts` spec files, the markers that tie spec to code, and the viewer. Surfaces are React + TypeScript with plain CSS on tokens: no CSS-in-JS, no utility-class framework. Motion is plain CSS; script only detects what CSS cannot (in-view, scroll position).

## Guidelines

### Surfaces

| Kind | Folder | Owns | Refers to |
| --- | --- | --- | --- |
| UI block | `ui/<name>/` | Props, presets, its own motion (hover, enter, exit, prop changes). Presentational only: no business logic, no data fetching | Tokens, primitives |
| Screen | `features/<feature>/` | Screen states, screen choreography (reveal order, scroll-driven changes), content | UI blocks by import |
| Feature | `features/<feature>/` | Flows over its screens | Screens by import |

A screen never restates a UI block's presets or motion. It renders the block with the props its state needs (`submit-error` → `field` with `error`), and names that preset in `shows`.

### Screen or state

| What changed | Is |
| --- | --- |
| The user lands on a different screen | A new screen |
| The same screen changed: error, loading, empty, filled, modal or sheet open | A state of that screen |

The size of the difference never decides it. Hover, focus, and pressed stay live in CSS and are never states or presets.

### Files per surface

| File | Holds |
| --- | --- |
| `<Name>.tsx` | One component. Imports its own CSS and the UI blocks it uses; the viewer loads `system/` CSS |
| `<name>.css` | Rules for this surface only; values via tokens (`var(--color-primary)`), no raw values where a token exists |
| `<name>.design.ts` | Spec — see **Design file** |
| `<feature>.design.ts` | Feature only: title, intent, flows |

Folder, CSS, and spec names are kebab-case; component files are PascalCase. CSS shared by screens of one feature lives in `features/<feature>/<feature>.css`; anything shared across features lives in `system/` or `ui/`, never copied. Light-first; render dark mode only when `design.md` defines it. Templates: [`../assets/surface/`](../assets/surface/).

### States and presets

- A state (screen) or preset (UI block) is a named set of props on one component. Never write a component per state.
- States are end views — what the surface looks like after something happened.
- Motion for a state or prop change plays when props change on the mounted instance: drive it with CSS transitions or animations keyed on attributes the props set (`data-loading`, `data-error`), not by remounting.
- A surface has only the motion the user decided — no default entrance or transition. Entrance motion (`load`, `in-view`) plays on mount; the viewer remounts on replay and on jumps.
- `sample` data for a screen comes in through props (`base` or the state), not hardcoded where the state changes it.

### Flows

A flow is an ordered list of steps; a step is one screen in one state. Happy path, error paths, and conditional paths (a step that only appears after a choice) are each their own flow. Every feature declares at least one flow, and every screen state appears in at least one flow — the viewer lists states no flow reaches.

### Design file

```ts
// ui/field/field.design.ts
export default defineUI(Field, {
  intent: "Single-line input with label and inline error.",
  viewports: ["desktop", "mobile"],          // only when the block itself is responsive
  base: { label: "Email" },                   // props every render needs, no control
  props: { type: ["text", "email"], value: "", error: "" },  // controls: enum (first is default) | boolean | text | number
  presets: { Empty: {}, Error: { value: "ced@mail", error: "Enter a valid email" } },  // first is the default
  motion: [{ id: "field-shake", target: "field-shake", trigger: "state", when: "error appears",
             description: "Input shakes twice; error rises in.", uses: ["shake", "rise"], reduced: "no shake" }],
  content: [{ slot: "field-label", role: "canonical", source: "per screen" }],
});

// features/login/email.design.ts
export default defineScreen(Email, {
  intent: "Collect the email that receives the one-time code.",
  uses: [field, button],
  viewports: ["desktop", "tablet", "mobile"],
  states: {
    default: { props: {}, description: "Empty field." },
    "submit-error": { props: { value: "ced@mail.co", error: "We couldn't find that email" },
                      trigger: "server rejects", description: "Field shakes; error below.", shows: "field#Error" },
  },
  motion: [/* same shape; trigger state → when names the state id */],
  content: [{ slot: "email-title", role: "material", source: "PRD Login intent" }],
});

// features/login/login.design.ts
export default defineFeature({
  title: "Login",
  intent: "Sign in with a one-time code sent by email.",
  flows: {
    "Happy path": [step(email, "default"), step(email, "submitting"), step(otp, "default")],
    "Email error": [step(email, "default"), step(email, "submit-error")],
  },
});
```

`default` is always the first state. Omit empty lists. `title` is optional and defaults to the folder (UI) or file (screen) name. `npm run check` fails on a preset prop, state name, or flow step that does not exist.

### Markers

Write markers literally in the JSX so they can be found without running code. Elements generated from data are covered by their parent's marker.

| Marker | On | Must match |
| --- | --- | --- |
| `data-motion="<id>"` | The element the motion moves, or the parent of a staggered or generated group | A `motion` entry `target` |
| `data-slot="<slot>"` | The element holding a content slot | A `content` entry `slot` |
| `data-component="<name>"` | The root element of a UI block, in its own component | The block's folder name |
| `@motion <name>` | A comment in `system/motion.css` or `system/motion.ts` | A primitive in `design.md` → Motion |

### Triggers

| Trigger | Fires when | `when` names |
| --- | --- | --- |
| `load` | Surface mounts | — |
| `in-view` | Target enters the viewport | Threshold, e.g. `20% visible` |
| `scroll` | Scroll position crosses a point or drives progress | The point or range |
| `hover` | Pointer over target (desktop only) | — |
| `focus` | Keyboard focus reaches target | — |
| `action` | User clicks, taps, submits, or types | The action |
| `state` | A state is entered (screen) or a prop changes (UI block) | The state id, or the prop change |

### Viewer

Copied from [`../assets/app/`](../assets/app/) and never edited: `viewer/`, `system/define.ts`, `index.html`, `package.json`, `vite.config.ts`, `tsconfig.json`. `npm run dev` in the design root opens it. It discovers every `*.design.ts` on its own — there is no surface list to keep in sync.

| View | Feature (one flow) | UI block |
| --- | --- | --- |
| Board | The flow's steps left to right on a pan-and-zoom canvas | Every preset side by side |
| Play | One step at full viewport; stepping keeps the instance so state motion plays; content stays live and never navigates | One live instance, centered; props and presets in the inspector |

The selection lives in the URL hash, so a link reopens the same view.

## Related

- [design-contract.md](./design-contract.md) — layout, inputs, content roles, checklist
- [`../assets/design.md`](../assets/design.md) — Motion tokens and primitives
