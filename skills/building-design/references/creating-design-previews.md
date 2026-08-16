# Creating Design Previews

## Overview

**Authoring mode.** Writes static HTML screen boards from `design.md` and product specs per [handoff-contract.md](handoff-contract.md). Each file is self-contained (inline CSS, no JavaScript). Prompts are not required.

Does not scaffold an application.

## Prerequisites

Per [handoff-contract.md](handoff-contract.md) → **Sources of truth**, **Gate and gather**, **Paths**. Template: [`../assets/preview-screen.html`](../assets/preview-screen.html).

## Guidelines

### 1. Gate, gather, and confirm paths

Per [handoff-contract.md](handoff-contract.md) → **Gate and gather**, **Paths**, and **Viewport matrix**.

Confirm design root, `<task>` slug, and which screens are in this preview. On follow-ups ("add settings screen"), edit the existing `previews/<task>/` folder unless the user asks for a new path.

### 2. Plan screen files

One HTML file per **screen** from UI specs. Combine screens into one file only when the user asks.

| From | Maps to |
| --- | --- |
| UI specs screen | `<screen>.html` kebab slug (`login.html`, `home.html`). Colliding names → more specific slug (`account-settings.html`) |
| Viewport matrix | One 1:1 frame per viewport in that file |
| Each distinct state | Extra frame row under that screen |
| `design.md` YAML | `:root` custom properties in that file’s `<style>` |
| Chrome | Drawn inside every `.frame-canvas` that uses that shell |

A one-screen task is still `previews/<task>/<screen>.html`. Do not number preview files and do not write `index.html`.

### 3. Fill and write

Copy [`../assets/preview-screen.html`](../assets/preview-screen.html) per screen. Fill `:root` from `design.md`; draw frames from specs.

| Rule | Detail |
| --- | --- |
| Self-contained | All CSS in `<style>`. No sibling `.css` / `.js`. No `<script>` |
| Tokens | Product values only in `:root` and inside `.frame-canvas`. Pattern: `colors.primary` → `--color-primary`; `typography.text-body-base` → `--text-body-base-*`; `rounded.radius-md` → `--radius-md`; `spacing.space-4` → `--space-4`. No raw hex/px in canvas rules when a token exists |
| Board vs canvas | Board chrome (page backdrop, captions, gaps) is reviewer UI — system font, neutral canvas. Product tokens apply only inside `.frame-canvas` |
| Frames | Width/height = viewport pixels. Caption outside the canvas. `overflow: hidden` and `pointer-events: none` on `.frame-canvas` |
| Layout | One horizontal row per state (desktop · tablet · mobile). Page scrolls sideways at 1:1. Mobile-only: one frame per state |
| Fonts | `<link>` to a hosted family allowed when `design.md` names one |
| Copy | Exact strings from UI specs; `[COPY TBD]` when missing |
| Combined file | User asked to combine: stack screen groups vertically; each group keeps its viewport rows |

Write HTML to disk. In chat, return paths, summary, and gaps only.

### 4. Confirm to the user

1. **Paths** — `design.md` and preview task folder
2. **Summary** — platform type, task slug, screen file count
3. **Gaps** — `[COPY TBD]` or missing spec detail
4. **Usage** — open `<screen>.html` in a browser; scroll horizontally for viewports

### Follow-up updates

1. Read the existing folder at the agreed path
2. Add or overwrite `<screen>.html` files in that folder
3. If `design.md` changed, refresh `:root` in every HTML in that folder
4. Overwrite in the same folder unless the user asks for a new path or task slug

## Related

- [handoff-contract.md](handoff-contract.md) — static board rules, sources, paths
- [creating-design.md](creating-design.md) — prerequisite visual tokens
- [creating-design-prompts.md](creating-design-prompts.md) — optional third-party prompts; not a gate

## Examples

**Missing design.md:** Stop → offer [creating-design.md](creating-design.md) → resume after tokens exist.

**One screen:** Confirm `design/previews/auth-login/` → `login.html` with idle + error rows.

**Desktop SaaS slice:** Confirm `design/previews/checkout-v2/` → `checkout.html`, `review.html`, … — one file per screen; three 1:1 frames per state row.

**Update:** "Add settings screen" → write `settings.html` in the same folder.
