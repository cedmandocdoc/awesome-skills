# Creating Bottom Sheet Component

## Overview

Create bottom sheet UI using shared wrappers under `src/ui/BottomSheet`. Do **not** use raw `@gorhom/bottom-sheet` unless the wrapper cannot express the needed behavior — when bypassing, keep visuals and dismissal aligned with the rest of the app.

## Prerequisites

- [creating-component.md](./creating-component.md) — placement and shared rules
- [creating-ui-component.md](./creating-ui-component.md) — composition root under `src/ui/BottomSheet/`
- `@gorhom/bottom-sheet` installed in the app
- App root wrapped once with `GestureHandlerRootView` and `BottomSheetModalProvider`

## Guidelines

### Wrapper selection

| Content | Wrapper |
| --- | --- |
| Static UI, short form, grouped actions, filters | **`BottomSheetView`** |
| Scrollable body that can overflow | **`BottomSheetView`** with `scrollable: true` → body is gorhom **`BottomSheetScrollView`** |
| Flat list (option pickers, long selectable lists) | **`BottomSheetFlatList`** |

### Control pattern

- Prefer controlled `open` / `onDismiss` in feature code over imperative `present` / `dismiss`.
- Drive visibility with a controlled boolean (`isOpen` or store state).
- Pass `open={isOpen}` and `onDismiss={() => setIsOpen(false)}`.
- Inside the shell: call `present()` when `open` becomes true. Do **not** call `dismiss()` when `open` becomes false — gorhom closes via gesture or backdrop and fires `onDismiss`.
- Pass any gorhom modal prop (`snapPoints`, `enablePanDownToClose`, `index`, etc.) through the wrapper unchanged.
- Shell default `backgroundStyle` is `THEME[scheme].wash`; callers may override.

### Sheet header

| Wrapper | Header guidance |
| --- | --- |
| **`BottomSheetView`** | Render header inside `children` by default. Use modal-level `header` prop when a fixed toolbar is needed above a scrolling body. |
| **`BottomSheetFlatList`** | Use wrapper `header` (fixed above rows) or gorhom `ListHeaderComponent` (scrolls with rows). One is required when header UI is present. |

### Prop forwarding

- Derive wrapper prop types from gorhom with `Omit` — do not use `Pick`.
- `BottomSheetModal` (internal shell) owns only: controlled `open`, default `backdropComponent` (overridable via `backdrop`), default `backgroundStyle`, optional `header`.
- All remaining gorhom props pass through unchanged.

Wrapper-owned keys to `Omit` from gorhom `BottomSheetModal`:

| Key | Reason |
| --- | --- |
| `ref` | Internal ref drives `present()` |
| `children` | View / FlatList wrappers supply body content |
| `backdropComponent` | Shell renders default backdrop; overridable via `backdrop` |
| `backgroundStyle` | Shell applies theme default; caller can override |

Optional `backdrop` type:

```tsx
type BottomSheetBackdropConfig = Omit<
  BottomSheetBackdropProps,
  "animatedIndex" | "animatedPosition"
>;
```

### Folder layout

```text
src/ui/BottomSheet/
  BottomSheetModal.tsx      — internal gorhom modal shell (not exported)
  BottomSheetView.tsx       — static + scrollable bodies
  BottomSheetFlatList.tsx   — list body + optional header
  index.ts                  — exports BottomSheetView, BottomSheetFlatList
```

### Naming

- Public exports: `BottomSheetView`, `BottomSheetFlatList` from `@/ui/BottomSheet`.
- Internal shell: `BottomSheetModal` — not exported from public barrel.
- Feature sheets: `<Feature><Purpose>Sheet` (e.g. `JobFiltersSheet`, `OptionPickerSheet`).

## Setup

Wrap the app tree once — do not duplicate providers in features:

```tsx
import { BottomSheetModalProvider } from "@gorhom/bottom-sheet";
import { GestureHandlerRootView } from "react-native-gesture-handler";

export function AppProviders({ children }: { children: React.ReactNode }) {
  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <BottomSheetModalProvider>{children}</BottomSheetModalProvider>
    </GestureHandlerRootView>
  );
}
```

Install:

```bash
node ../scripts/run-package.cjs -- expo install @gorhom/bottom-sheet
```

## Examples

### Feature filter sheet (BottomSheetView)

```tsx
import { Pressable, Text, View } from "react-native";
import { BottomSheetView } from "@/ui/BottomSheet";

export function JobFiltersSheet() {
  const isOpen = useJobStore((s) => s.isFilterOpen);
  const setFilterOpen = useJobStore((s) => s.setFilterOpen);

  return (
    <BottomSheetView
      open={isOpen}
      onDismiss={() => setFilterOpen(false)}
      scrollable
    >
      <View className="flex-row items-center justify-between pb-4">
        <Text className="text-lg font-semibold">Filters</Text>
        <Pressable onPress={() => setFilterOpen(false)}>
          <Text className="text-primary">Close</Text>
        </Pressable>
      </View>
      {/* filter controls */}
    </BottomSheetView>
  );
}
```

### Option picker (BottomSheetFlatList with fixed header)

```tsx
import { BottomSheetFlatList } from "@/ui/BottomSheet";

<BottomSheetFlatList
  open={isOpen}
  onDismiss={() => setIsOpen(false)}
  header={
    <View className="flex-row items-center justify-between px-4 pb-4">
      <Text className="text-lg font-semibold">Choose option</Text>
    </View>
  }
  data={options}
  renderItem={renderOption}
  keyExtractor={(item) => item.id}
/>
```

## Related

- [creating-component.md](./creating-component.md)
- [creating-ui-component.md](./creating-ui-component.md)
- [managing-screen-background.md](./managing-screen-background.md)
- [managing-styling.md](./managing-styling.md)

## References

| Topic | URL |
| --- | --- |
| Modal usage | https://gorhom.dev/react-native-bottom-sheet/modal/usage |
| Modal props | https://gorhom.dev/react-native-bottom-sheet/modal/props |
| Modal methods | https://gorhom.dev/react-native-bottom-sheet/modal/methods |
| Modal hooks | https://gorhom.dev/react-native-bottom-sheet/modal/hooks |
| Bottom sheet usage | https://gorhom.dev/react-native-bottom-sheet/usage |
| Bottom sheet props | https://gorhom.dev/react-native-bottom-sheet/props |
| BottomSheetView | https://gorhom.dev/react-native-bottom-sheet/components/bottomsheetview |
| BottomSheetScrollView | https://gorhom.dev/react-native-bottom-sheet/components/bottomsheetscrollview |
| BottomSheetFlatList | https://gorhom.dev/react-native-bottom-sheet/components/bottomsheetflatlist |
| BottomSheetBackdrop | https://gorhom.dev/react-native-bottom-sheet/components/bottomsheetbackdrop |
