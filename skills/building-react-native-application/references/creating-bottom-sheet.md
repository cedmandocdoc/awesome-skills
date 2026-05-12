# Creating Bottom Sheet

## Overview

Use this guide whenever work involves a **bottom sheet** in an app that follows this skill. Default to shared wrappers under `src/ui/BottomSheet`. Do not build from the raw `@gorhom/bottom-sheet` API unless the wrapper does not expose the needed behavior.

**Scope:** Describe sheet content (static, scrollable, or list-driven), whether the shared wrapper is enough, and any dismissal or gesture constraints before implementing.

## Prerequisites

- [creating-component.md](./creating-component.md) — props, composition, and presentational patterns
- [placing-component.md](./placing-component.md) — `src/ui/` versus `src/features/` placement

## Default path

- Use **`BottomSheetView`** for most feature sheets with static content.
- Set **`scrollable: true`** on `BottomSheetView` when the body should scroll.
- Use **`BottomSheetList`** for flat-list driven sheets (for example option pickers).
- Keep visibility in local feature state or the feature store; pass **`open`** and **`onDismiss`** into the shared wrapper.

## Already wired

- **`src/App.tsx`** (or the app root) should wrap the tree with **`GestureHandlerRootView`** and **`BottomSheetModalProvider`** once — follow the existing app setup rather than duplicating it.
- The shared wrapper typically owns **`present()` / `dismiss()`**, backdrop, dynamic sizing, safe-area padding, and the standard title plus close header.
- Most feature code should **not** import from `@gorhom/bottom-sheet` directly.

## Decision flow

### 1. Choose the shared primitive first

- Use **`BottomSheetView`** when the body is static UI, a short form, grouped actions, or filter controls.
- Use **`BottomSheetView`** with **`scrollable: true`** when the body can overflow vertically.
- Use **`BottomSheetList`** when the body is a flat list and the caller can express the UI with standard `BottomSheetFlatList` props.

### 2. Follow the wrapper control pattern

- Drive the sheet with a controlled boolean such as `isOpen` or feature-store state.
- Pass **`open={isOpen}`** and **`onDismiss={() => setIsOpen(false)}`** into the wrapper.
- Pass **`title`** when the standard header is sufficient.
- Use **`enableCloseOnDismiss={false}`** only when backdrop press and pan-to-close must be disabled.

### 3. Let the wrapper own the modal details

- Do not manually call **`present()`** or **`dismiss()`** from feature components when the shared wrapper is enough.
- Do not add another provider around a feature subtree unless there is a specific isolation requirement.
- Let **`BottomSheetView`** and **`BottomSheetList`** apply their built-in padding and safe-area handling before adding custom spacing.
- Treat **`src/ui/BottomSheet/BottomSheetModal.tsx`** (or equivalent) as an internal implementation detail unless the wrapper itself is being changed.

### 4. Drop to `@gorhom/bottom-sheet` only when needed

- Use gorhom primitives directly only when the feature needs behavior the shared wrapper does not expose.
- Common reasons: mounted **`BottomSheet`**, imperative snap-point control, custom footer or backdrop, modal hooks, or another advanced primitive intentionally hidden by the wrapper.
- When using gorhom directly, keep visuals and dismissal behavior aligned with the rest of the app.

## Implementation workflow

1. Choose **`BottomSheetView`** or **`BottomSheetList`** based on content shape.
2. Keep open state in local component state or the relevant feature store.
3. Pass **`open`**, **`onDismiss`**, and **`title`** into the wrapper.
4. Add only the extra props the content needs (for example **`scrollable`** or flat-list configuration).
5. Verify closing behavior, scrolling, and spacing on both platforms.

## Repo patterns

Concrete file names depend on the app. Prefer these shapes when they exist:

- A feature-owned filter sheet driven by store state and rendered with **`BottomSheetView`** (for example a job list filter component under `src/features/...`).
- Another filter sheet with grouped controls using the same **`open` / `onDismiss`** contract.

Use the project’s existing bottom-sheet feature components as the live reference when paths differ from the examples above.

## Implementation rules

- Import shared sheet components from **`@/ui/BottomSheet`**, not from **`@gorhom/bottom-sheet`**, unless there is a documented need to bypass the wrapper.
- Prefer controlled **`open` / `onDismiss`** over imperative refs in feature code.
- Use **`scrollable: true`** on **`BottomSheetView`** before reaching for gorhom scrollable primitives directly.
- Pass regular flat-list props into **`BottomSheetList`**; it should wrap **`BottomSheetFlatList`** and apply standard padding defaults.
- Do not repeat provider setup inside features.
- Do not rely on a **`header`** prop as a customization hook unless the wrapper implementation is updated to render custom header content.

## Review checklist

- Uses **`@/ui/BottomSheet`** by default, or clearly documents why raw gorhom primitives are required.
- Uses the controlled **`open` / `onDismiss`** pattern instead of manual modal refs in feature code.
- Chooses **`BottomSheetView`** or **`BottomSheetList`** based on content shape.
- Relies on the shared wrapper for standard header, backdrop, dismissal, and safe-area behavior.
- Avoids duplicating provider setup.
- Verifies scrolling and close behavior on both platforms.

## Project files

| Area                         | Typical location |
| ---------------------------- | ---------------- |
| Wrapper exports              | `src/ui/BottomSheet/index.ts` |
| View implementation        | `src/ui/BottomSheet/BottomSheetView.tsx` |
| List implementation        | `src/ui/BottomSheet/BottomSheetList.tsx` |
| Modal implementation       | `src/ui/BottomSheet/BottomSheetModal.tsx` |

Adjust paths if the app uses a different `src/ui` layout.

## Gorhom documentation

Use when the shared wrapper is insufficient.

| Topic | Doc |
| ----- | --- |
| Modal usage | [Modal usage](https://gorhom.dev/react-native-bottom-sheet/modal/usage) |
| Modal props | [Modal props](https://gorhom.dev/react-native-bottom-sheet/modal/props) |
| Modal methods | [Modal methods](https://gorhom.dev/react-native-bottom-sheet/modal/methods) |
| Modal hooks | [Modal hooks](https://gorhom.dev/react-native-bottom-sheet/modal/hooks) |
| Bottom sheet usage | [Usage](https://gorhom.dev/react-native-bottom-sheet/usage) |
| Bottom sheet props | [Props](https://gorhom.dev/react-native-bottom-sheet/props) |
| Bottom sheet methods | [Methods](https://gorhom.dev/react-native-bottom-sheet/methods) |
| Bottom sheet hooks | [Hooks](https://gorhom.dev/react-native-bottom-sheet/hooks) |
| BottomSheetView | [BottomSheetView](https://gorhom.dev/react-native-bottom-sheet/components/bottomsheetview) |
| BottomSheetScrollView | [BottomSheetScrollView](https://gorhom.dev/react-native-bottom-sheet/components/bottomsheetscrollview) |
| BottomSheetFlatList | [BottomSheetFlatList](https://gorhom.dev/react-native-bottom-sheet/components/bottomsheetflatlist) |
| BottomSheetSectionList | [BottomSheetSectionList](https://gorhom.dev/react-native-bottom-sheet/components/bottomsheetsectionlist) |
| BottomSheetBackdrop | [BottomSheetBackdrop](https://gorhom.dev/react-native-bottom-sheet/components/bottomsheetbackdrop) |
| BottomSheetFooter | [BottomSheetFooter](https://gorhom.dev/react-native-bottom-sheet/components/bottomsheetfooter) |
