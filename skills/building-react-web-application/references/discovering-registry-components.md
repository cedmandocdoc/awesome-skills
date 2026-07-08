# Discovering Registry Components

## Overview

**Read-only.** Use this reference to map a UI request to candidate web registry components before validation and vendoring.

Source registry folder: [shadcn-ui/ui base-luma](https://github.com/shadcn-ui/ui/tree/main/apps/v4/styles/base-luma/ui).

## Guidelines

### Parsing contract

- Each `.tsx` filename in the source folder is a registry component candidate.
- `slug` = filename without `.tsx`.
- `description` summarizes the UI purpose for routing.
- `labels` are retrieval tags for decision procedures (search by intent, behavior, layout, form, feedback, navigation).

### Component lookup

| Slug | Description | Labels |
| --- | --- | --- |
| `accordion` | Expand/collapse sections for progressive disclosure. | `disclosure`, `layout`, `content` |
| `alert-dialog` | Blocking confirmation modal for destructive or critical actions. | `overlay`, `confirm`, `destructive` |
| `alert` | Inline status message block for success, warning, or error context. | `feedback`, `status`, `inline` |
| `aspect-ratio` | Container that preserves fixed media ratio (image/video/embed). | `layout`, `media`, `responsive` |
| `attachment` | File attachment chip/row presentation for uploaded or linked files. | `file`, `input`, `content` |
| `avatar` | User/profile image with fallback initials or placeholder. | `identity`, `media`, `list` |
| `badge` | Compact status/category pill for metadata emphasis. | `status`, `label`, `content` |
| `breadcrumb` | Hierarchical navigation trail showing current location path. | `navigation`, `hierarchy`, `header` |
| `bubble` | Message bubble container for chat-style conversational UI. | `chat`, `content`, `layout` |
| `button-group` | Grouped actions with shared spacing and alignment rules. | `action`, `controls`, `layout` |
| `button` | Primary interactive trigger for actions and submissions. | `action`, `form`, `core` |
| `calendar` | Date grid picker and date navigation surface. | `date`, `form`, `picker` |
| `card` | Surface container for grouped content and actions. | `layout`, `content`, `surface` |
| `carousel` | Horizontal/looping item scroller for featured content. | `media`, `navigation`, `content` |
| `chart` | Data visualization wrapper primitives for charts and legends. | `data`, `analytics`, `visualization` |
| `checkbox` | Boolean multi-select control for lists/forms. | `form`, `selection`, `boolean` |
| `collapsible` | Show/hide content region with retained layout context. | `disclosure`, `content`, `layout` |
| `combobox` | Searchable input + option list selection control. | `form`, `selection`, `search` |
| `command` | Command palette/search command list interaction surface. | `search`, `actions`, `overlay` |
| `context-menu` | Right-click/long-press contextual action menu. | `menu`, `actions`, `overlay` |
| `dialog` | Modal overlay for focused tasks and forms. | `overlay`, `form`, `interaction` |
| `direction` | Directionality helper wrapper (LTR/RTL aware layout behavior). | `i18n`, `layout`, `utility` |
| `drawer` | Slide-in panel from edge for contextual content/actions. | `overlay`, `navigation`, `panel` |
| `dropdown-menu` | Triggered action/options menu anchored to a control. | `menu`, `actions`, `overlay` |
| `empty` | Empty state block with guidance and optional actions. | `feedback`, `empty-state`, `content` |
| `field` | Standardized form field shell (label/control/help/error). | `form`, `composition`, `validation` |
| `hover-card` | Hover/focus preview card for supplementary details. | `overlay`, `preview`, `content` |
| `input-group` | Structured input with prefix/suffix/addon composition. | `form`, `input`, `composition` |
| `input-otp` | One-time passcode segmented input control. | `auth`, `form`, `verification` |
| `input` | Single-line text/value input control. | `form`, `input`, `core` |
| `item` | Generic list/item row primitive for composable lists. | `list`, `layout`, `content` |
| `kbd` | Keyboard shortcut keycap display element. | `docs`, `shortcut`, `label` |
| `label` | Form control label text and accessibility pairing primitive. | `form`, `a11y`, `text` |
| `marker` | Inline marker/highlight indicator in text or lists. | `content`, `annotation`, `status` |
| `menubar` | Horizontal application menu bar and nested menu patterns. | `navigation`, `menu`, `desktop` |
| `message-scroller` | Scroll container tuned for chat/message feeds. | `chat`, `scroll`, `content` |
| `message` | Chat/message item wrapper for sender/content metadata. | `chat`, `content`, `list` |
| `native-select` | Native `<select>` based dropdown for simple form selection. | `form`, `selection`, `native` |
| `navigation-menu` | Structured navigation menu for site/app sections. | `navigation`, `menu`, `header` |
| `pagination` | Page navigation controls for large datasets/lists. | `navigation`, `data`, `list` |
| `popover` | Anchored floating panel for lightweight interactions. | `overlay`, `picker`, `menu` |
| `progress` | Progress bar indicator for task completion state. | `feedback`, `loading`, `status` |
| `radio-group` | Single-choice option group control. | `form`, `selection`, `single-choice` |
| `resizable` | Split-pane layout with draggable resize handles. | `layout`, `interaction`, `workspace` |
| `scroll-area` | Styled custom scrollbar region for overflow content. | `layout`, `scroll`, `content` |
| `select` | Custom select trigger/content/value pattern. | `form`, `selection`, `picker` |
| `separator` | Visual divider line between sections/items. | `layout`, `content`, `divider` |
| `sheet` | Side/bottom sheet overlay for secondary workflows. | `overlay`, `panel`, `navigation` |
| `sidebar` | Persistent or collapsible side navigation/content rail. | `navigation`, `layout`, `app-shell` |
| `skeleton` | Placeholder loading shape that mimics final UI blocks. | `loading`, `feedback`, `placeholder` |
| `slider` | Range selection control with draggable thumb. | `form`, `input`, `range` |
| `sonner` | Toast notification presenter for transient messages. | `feedback`, `toast`, `status` |
| `spinner` | Indeterminate loading indicator animation. | `loading`, `feedback`, `status` |
| `switch` | Binary toggle control for settings/preferences. | `form`, `boolean`, `settings` |
| `table` | Structured tabular data layout primitives. | `data`, `list`, `layout` |
| `tabs` | Segmented content navigation within the same view. | `navigation`, `layout`, `content` |
| `textarea` | Multi-line text input control. | `form`, `input`, `text` |
| `toggle-group` | Multi/single segmented toggle buttons as grouped options. | `form`, `selection`, `controls` |
| `toggle` | Pressable on/off style button state control. | `form`, `boolean`, `controls` |
| `tooltip` | Small hint/assistive text bubble on hover/focus. | `a11y`, `help`, `overlay` |

### Decision usage

1. Normalize request intent (`date input`, `confirm delete`, `toast`, `sidebar`).
2. Match by `labels` first, then by exact `slug`.
3. Prefer exact semantic component (`calendar`, `alert-dialog`, `sonner`) before composition.
4. For composite requests, pick a primary component then supporting pieces (example: date input -> `calendar` + `popover` + `button`).
5. Validate each candidate with `shadcn view` before running add script.

