# Mockup Contract

## Overview

Shared rules for every `building-mockup` recipe: the mockup root and its layout, the screen rules, the `flow.md` format, and the compact `design.md`.

## Guidelines

### Author signature

Static UUID identifying files created by this skill:

```text
f487be74-87d9-4e76-8fc3-097325566acb
```

Every `<mockup-root>/index.md` and `flow.md` carries this value in frontmatter `author`.

### Output layout

```text
<mockup-root>/                 # default: mockup/; one app per root
  index.md                     # root marker: app, intention (the flow's one-line job), screen count
  design.md                    # visual language, DESIGN.md format
  flow.md                      # the hero flow, step by step
  screens/NN-<name>.html       # one static screen per step, in flow order
  fonts/                       # font files the screens load with @font-face
  images/                      # photos and logos the screens show
```

Another app gets its own root, wherever the user puts it (`mockup/` in one repo per app by default; `mockups/<app-slug>/` when a repo holds several), never inside another root.

Templates: [`../assets/index.md`](../assets/index.md), [`../assets/design.md`](../assets/design.md), [`../assets/flow.md`](../assets/flow.md), [`../assets/screen.html`](../assets/screen.html).

### Resolve mockup root

Search the repository for `index.md` with frontmatter `doc_type: mockup-index`, `generated_by: building-mockup`, and `author` = **Author signature**.

| Matches | Action |
| --- | --- |
| One | Use it |
| Several | Use the one whose `@`-path, `app` or `intention` matches the request; ask when unclear (list each `index.md` path) |
| None | `SKILL.md` → **Setup** creates one |

Read and write only under the resolved root. Mirror the app name, the flow's one-line job (`intention`) and the screen count into its `index.md` frontmatter on every change.

A root built by 1.x (`doc_type: mockups-index`, one row and one `<app-slug>/` folder per app): split it into one root per app first, each with its own `index.md`.

### Screen rules

- One self-contained HTML file per step: inline `<style>`, no JavaScript, no network requests.
- Exactly 390×844 CSS px (`<body>` fixed to that size, no scroll); content that would scroll is cut where a phone would cut it.
- Phone chrome drawn in HTML: a status bar (`9:41`, signal, battery) and the home indicator.
- Sample data looks real for the audience and market: local names, local currency, plausible dates and counts; never lorem ipsum or `John Doe`.
- A `Sample app` badge sits in the same corner on every screen, clear of the flow's targets.
- Every element `flow.md` acts on has the `id` that `flow.md` names.
- Content colors, type, spacing, and radii come only from `design.md` tokens, written as CSS custom properties in each screen's `:root`; the phone chrome and the badge keep the template's fixed values.
- Fonts load with `@font-face` from `../fonts/` (the system stack when no font file is available); icons are inline SVG; images come from `../images/`.
- Screen N shows the state after step N−1's action and before its own: a fill screen shows its fields empty, and the next screen shows them filled.

### flow.md

Frontmatter: `doc_type: mockup-flow`, `generated_by: building-mockup`, `author` = **Author signature**, `app`, `audience`, `viewport: 390x844`. Body: the job in one line, then one row per step:

| Column | Holds |
| --- | --- |
| `#` | Step number, matching the screen's `NN` |
| Screen | `screens/NN-<name>.html` |
| Action | What happens on this screen: `tap "Book"`, `fields fill: name, date, time`, `swipe left`, `—` on the last step |
| Target | Each acted-on element with its centre as a percentage of 390×844: `#book (x 72%, y 88%)`; `—` on the last step |
| Hold | How long the screen stays before its action, or at the end (`1.5 s`); `—` for no hold |

### design.md

A compact [DESIGN.md](https://github.com/google-labs-code/design.md): the YAML tokens (`colors`, `typography`, `rounded`, `spacing`) and the sections **Overview**, **Colors**, **Typography**, **Layout**, **Shapes**, **Components**, **Do's and Don'ts**, **Voice**. Only tokens the screens use, named as in the template.
