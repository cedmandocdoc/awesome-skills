# Creating Bottom Sheet Component

## Overview

Create **bottom sheet UI** using shared wrappers under `src/ui/BottomSheet`. Do not use raw `@gorhom/bottom-sheet` unless the wrapper does not expose the needed behavior. Before implementing, decide content shape (static, scrollable, or list-driven), whether the shared wrapper is enough, and any dismissal or gesture constraints.

Start from [creating-component.md](./creating-component.md).

## Naming

- Wrapper exports: `BottomSheetView`, `BottomSheetList` from `@/ui/BottomSheet`.
- Feature sheet components: `<Feature><Purpose>Sheet` (for example `JobFiltersSheet`, `OptionPickerSheet`).

## Guidelines

### Default path

- Use **`BottomSheetView`** for static feature sheets; set **`scrollable: true`** when the body can overflow.
- Use **`BottomSheetList`** for flat-list driven sheets (for example option pickers).
- Import from **`@/ui/BottomSheet`**, not **`@gorhom/bottom-sheet`**, unless there is a documented bypass.
- Keep open state in local component state or the feature store; pass **`open`** and **`onDismiss`** into the wrapper.

### App setup (already wired)

- The app root should wrap the tree with **`GestureHandlerRootView`** and **`BottomSheetModalProvider`** once—do not duplicate providers in features.
- The shared wrapper owns **`present()` / `dismiss()`**, backdrop, dynamic sizing, safe-area padding, and the standard title plus close header.
- Treat **`src/ui/BottomSheet/BottomSheetModal.tsx`** (or equivalent) as an internal detail unless changing the wrapper itself.

### Choose the primitive

| Content | Wrapper |
| ------- | ------- |
| Static UI, short form, grouped actions, filters | **`BottomSheetView`** |
| Scrollable body that can overflow | **`BottomSheetView`** with **`scrollable: true`** |
| Flat list (option pickers, long selectable lists) | **`BottomSheetList`** |

### Control pattern

- Drive visibility with a controlled boolean (`isOpen` or store state).
- Pass **`open={isOpen}`**, **`onDismiss={() => setIsOpen(false)}`**, and **`title`** when the standard header is enough.
- Use **`enableCloseOnDismiss={false}`** only when backdrop press and pan-to-close must be disabled.
- Prefer **`open` / `onDismiss`** over imperative **`present()` / `dismiss()`** in feature code.
- Do not add another provider around a feature subtree unless isolation requires it.

### Wrapper vs gorhom

Use gorhom primitives directly only when the feature needs behavior the shared wrapper hides—for example mounted **`BottomSheet`**, imperative snap points, custom footer or backdrop, or modal hooks. When bypassing the wrapper, keep visuals and dismissal aligned with the rest of the app.

### Project layout

| Area | Typical location |
| ---- | ---------------- |
| Wrapper exports | `src/ui/BottomSheet/index.ts` |
| View | `src/ui/BottomSheet/BottomSheetView.tsx` |
| List | `src/ui/BottomSheet/BottomSheetList.tsx` |
| Modal | `src/ui/BottomSheet/BottomSheetModal.tsx` |

Adjust paths if the app uses a different `src/ui` layout.

### Gorhom documentation

Use when the shared wrapper is insufficient.

| Topic | Doc |
| ----- | --- |
| Modal | [Usage](https://gorhom.dev/react-native-bottom-sheet/modal/usage), [Props](https://gorhom.dev/react-native-bottom-sheet/modal/props), [Methods](https://gorhom.dev/react-native-bottom-sheet/modal/methods), [Hooks](https://gorhom.dev/react-native-bottom-sheet/modal/hooks) |
| Bottom sheet | [Usage](https://gorhom.dev/react-native-bottom-sheet/usage), [Props](https://gorhom.dev/react-native-bottom-sheet/props), [Methods](https://gorhom.dev/react-native-bottom-sheet/methods), [Hooks](https://gorhom.dev/react-native-bottom-sheet/hooks) |
| Components | [BottomSheetView](https://gorhom.dev/react-native-bottom-sheet/components/bottomsheetview), [BottomSheetScrollView](https://gorhom.dev/react-native-bottom-sheet/components/bottomsheetscrollview), [BottomSheetFlatList](https://gorhom.dev/react-native-bottom-sheet/components/bottomsheetflatlist), [BottomSheetBackdrop](https://gorhom.dev/react-native-bottom-sheet/components/bottomsheetbackdrop), [BottomSheetFooter](https://gorhom.dev/react-native-bottom-sheet/components/bottomsheetfooter) |

## Examples

### Feature filter sheet with `BottomSheetView`

```tsx
import { BottomSheetView } from "@/ui/BottomSheet";

export function JobFiltersSheet() {
  const isOpen = useJobStore((s) => s.isFilterOpen);
  const setFilterOpen = useJobStore((s) => s.setFilterOpen);

  return (
    <BottomSheetView
      open={isOpen}
      onDismiss={() => setFilterOpen(false)}
      title="Filters"
      scrollable
    >
      {/* filter controls */}
    </BottomSheetView>
  );
}
```

### Option picker with `BottomSheetList`

```tsx
<BottomSheetList
  open={isOpen}
  onDismiss={() => setIsOpen(false)}
  title="Choose option"
  data={options}
  renderItem={renderOption}
  keyExtractor={(item) => item.id}
/>
```
