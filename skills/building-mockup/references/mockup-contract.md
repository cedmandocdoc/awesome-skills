# Mockup Contract

## Overview

Shared rules for every `building-mockup` recipe: the forms a mockup takes, the mockup root and its layout, the screen rules, the `flow.md` format, and the compact `design.md`.

## Guidelines

### Author signature

Static UUID identifying files created by this skill:

```text
f487be74-87d9-4e76-8fc3-097325566acb
```

Every `<mockup-root>/index.md` and `flow.md` carries this value in frontmatter `author`.

### Forms

A root mocks up one product in one form: the device its users do the hero flow on.

| Form | Is | Screen | Chrome | Steps | Badge | Template |
| --- | --- | --- | --- | --- | --- | --- |
| `phone` | An app used on a phone | Exactly 390×844 CSS px, no scroll; content that would scroll is cut where a phone would cut it | A status bar (`9:41`, signal, battery) and the home indicator | 3–6 screens | `Sample app` | [`../assets/screen-phone.html`](../assets/screen-phone.html) |
| `desktop` | A web app used at a computer | Exactly 1440×900 CSS px, chrome included, no scroll; content that would scroll is cut where the window would cut it | A neutral browser bar: window dots, back and forward, and an address field showing a path only (`/payroll/runs`), never a domain | 3–6 screens | `Sample app` | [`../assets/screen-desktop.html`](../assets/screen-desktop.html) |
| `website` | A business's public site that does one job for a visitor: book, ask for a quote, or message | One responsive file per page, laid out for 1440 and 390 CSS px wide; its height follows its content, and the page scrolls | None: the page is the content, and a promotion draws the device | 2–4 pages: the home page, then the job's pages to its done state | `Sample website` | [`../assets/screen-website.html`](../assets/screen-website.html) |

A root without `form` in its `index.md` (built by 2.x) is `phone`.

### Output layout

```text
<mockup-root>/                 # default: mockup/; one app or website per root
  index.md                     # root marker: app, form, intention (the flow's one-line job), screen count
  design.md                    # visual language, DESIGN.md format
  flow.md                      # the hero flow, step by step
  screens/NN-<name>.html       # one static screen (a website: one page) per step, in flow order
  fonts/                       # font files the screens load with @font-face, each with its licence file
  images/                      # photos and logos the screens show
  images/credits.md            # one row per photo not made in the root: file, source URL, author, licence
```

Another app or website gets its own root, wherever the user puts it (`mockup/` in one repo per app by default; `mockups/<app-slug>/` when a repo holds several), never inside another root.

Templates: [`../assets/index.md`](../assets/index.md), [`../assets/design.md`](../assets/design.md), [`../assets/flow.md`](../assets/flow.md), and the form's screen template per **Forms**.

### Resolve mockup root

Search the repository for `index.md` with frontmatter `doc_type: mockup-index`, `generated_by: building-mockup`, and `author` = **Author signature**.

| Matches | Action |
| --- | --- |
| One | Use it |
| Several | Use the one whose `@`-path, `app` or `intention` matches the request; ask when unclear (list each `index.md` path) |
| None | `SKILL.md` → **Setup** creates one |

Read and write only under the resolved root. Mirror the app name, the form, the flow's one-line job (`intention`) and the screen count into its `index.md` frontmatter on every change.

A root built by 1.x (`doc_type: mockups-index`, one row and one `<app-slug>/` folder per app): split it into one root per app first, each with its own `index.md`.

### Screen rules

- One self-contained HTML file per step: inline `<style>`, no JavaScript, no network requests.
- The size, chrome, and badge of the root's form, per **Forms**; the chrome and the badge keep the template's fixed values.
- Sample data looks real for the audience and market: local names, local currency, plausible dates and counts; never lorem ipsum or `John Doe`.
- The badge sits in the same place on every screen, clear of the flow's targets.
- Every element `flow.md` acts on has the `id` that `flow.md` names.
- Content colors, type, spacing, and radii come only from `design.md` tokens, written as CSS custom properties in each screen's `:root`.
- Fonts load with `@font-face` from `../fonts/` (the system stack when no font file is available); icons are inline SVG; images come from `../images/`.
- Screen N shows the state after step N−1's action and before its own: a fill screen shows its fields empty, and the next screen shows them filled.

A `website` page also:

- Lays out for both widths with one media query (`max-width: 767px`), with no horizontal scroll at 390.
- Keeps a sticky header with the logo, the business name, the badge, and the job's action, so every viewport-sized view of the page shows the badge.
- Puts each home page section in a `<section id="<name>">`, which `flow.md` names.
- Shows a map, a video, or an embed as a static image or a drawn placeholder.

### flow.md

Frontmatter: `doc_type: mockup-flow`, `generated_by: building-mockup`, `author` = **Author signature**, `app`, `audience`, `form`, `viewport` (`390x844` for phone, `1440x900` for desktop, `1440x900 390x844` for website). Body: the job in one line, then one row per step:

| Column | Holds |
| --- | --- |
| `#` | Step number, matching the screen's `NN` |
| Screen | `screens/NN-<name>.html` |
| Action | What happens on this screen: `tap "Book"`, `fields fill: name, date, time`, `swipe left`, `scroll to #packages`, `—` on the last step |
| Target | Each acted-on element. Phone and desktop: its centre as a percentage of the viewport, `#book (x 72%, y 88%)`. Website: its id and its section, `#pick-ceramic in #packages`, since the page scrolls. `—` on the last step |
| Hold | How long the screen stays before its action, or at the end (`1.5 s`); `—` for no hold |

### design.md

A compact [DESIGN.md](https://github.com/google-labs-code/design.md): the YAML tokens (`colors`, `typography`, `rounded`, `spacing`) and the sections **Overview**, **Colors**, **Typography**, **Layout**, **Shapes**, **Components**, **Do's and Don'ts**, **Voice**. Only tokens the screens use, named as in the template.
