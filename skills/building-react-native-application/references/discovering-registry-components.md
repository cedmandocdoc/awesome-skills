# Discovering Registry Components

## Overview

**Read-only.** Use this reference to map a UI request to candidate React Native registry components before validation and vendoring.

Source registry folder: [react-native-reusables nativewind components](https://github.com/founded-labs/react-native-reusables/tree/main/packages/registry/src/nativewind/components/ui).

## Guidelines

### Parsing contract

- Each `.tsx` filename in the source folder is a registry component candidate.
- `slug` = filename without `.tsx`.
- `description` summarizes the UI purpose for routing.
- `labels` are retrieval tags for decision procedures (intent, form, navigation, feedback, overlays, layout).

### Component lookup

| Slug | Description | Labels |
| --- | --- | --- |
| `accordion` | Expand/collapse stacked sections for progressive disclosure. | `disclosure`, `layout`, `content` |
| `alert-dialog` | Blocking confirm dialog for destructive or high-risk actions. | `overlay`, `confirm`, `destructive` |
| `alert` | Inline status block for success/warn/error information. | `feedback`, `status`, `inline` |
| `aspect-ratio` | Ratio-preserving container for media and thumbnails. | `layout`, `media`, `responsive` |
| `avatar` | User/profile avatar with fallback content support. | `identity`, `media`, `list` |
| `badge` | Compact metadata/status pill label. | `status`, `label`, `content` |
| `button` | Primary action trigger control. | `action`, `form`, `core` |
| `card` | Grouped content surface with title/body/action structure. | `layout`, `surface`, `content` |
| `checkbox` | Multi-select boolean control for forms/settings. | `form`, `selection`, `boolean` |
| `collapsible` | Toggleable content section that expands/collapses inline. | `disclosure`, `content`, `layout` |
| `context-menu` | Contextual action menu anchored to an element. | `menu`, `actions`, `overlay` |
| `dialog` | Modal dialog overlay for focused workflows. | `overlay`, `form`, `interaction` |
| `dropdown-menu` | Triggered action/options menu with grouped items. | `menu`, `actions`, `overlay` |
| `hover-card` | Supplemental preview/info card (where hover/focus semantics apply). | `overlay`, `preview`, `content` |
| `icon` | Shared icon wrapper for consistent sizing/styling. | `iconography`, `utility`, `content` |
| `input` | Single-line text/value input control. | `form`, `input`, `core` |
| `label` | Form label and control-association primitive. | `form`, `a11y`, `text` |
| `menubar` | Horizontal menu system with nested actions. | `navigation`, `menu`, `desktop-like` |
| `native-only-animated-view` | Native-only animated container utility for motion composition. | `animation`, `utility`, `native` |
| `popover` | Anchored floating panel for lightweight interaction content. | `overlay`, `picker`, `menu` |
| `progress` | Progress indicator bar for determinate tasks. | `feedback`, `loading`, `status` |
| `radio-group` | Single-select option group control. | `form`, `selection`, `single-choice` |
| `select` | Selection control with trigger/value/options presentation. | `form`, `selection`, `picker` |
| `separator` | Visual divider between sections/items. | `layout`, `divider`, `content` |
| `skeleton` | Placeholder loading blocks for pending content. | `loading`, `feedback`, `placeholder` |
| `switch` | Binary on/off setting control. | `form`, `boolean`, `settings` |
| `tabs` | Segmented view switcher for related content panels. | `navigation`, `layout`, `content` |
| `text` | Text primitive wrapper with style/variant consistency. | `typography`, `content`, `utility` |
| `textarea` | Multi-line text input control. | `form`, `input`, `text` |
| `toggle-group` | Grouped toggle controls for segmented choices. | `form`, `selection`, `controls` |
| `toggle` | Pressable toggle button with selected state. | `form`, `boolean`, `controls` |
| `tooltip` | Context hint bubble for helper information. | `a11y`, `help`, `overlay` |

### Decision usage

1. Normalize request intent (`date picker`, `confirm delete`, `settings toggle`, `menu`).
2. Match by `labels` first, then by exact `slug`.
3. Prefer exact semantic component (`alert-dialog`, `select`, `tabs`) before composition.
4. For composite requests, pick a primary component then supporting pieces (example: confirm flow -> `alert-dialog` + `button`).
5. Validate candidates with `shadcn view` URL before running add script.

