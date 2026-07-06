# Creating Bottom Sheet Component

## Overview

Create **bottom sheet UI** using shared wrappers under `src/ui/BottomSheet`. Do not use raw `@gorhom/bottom-sheet` unless the wrapper does not expose the needed behavior. Before implementing, decide content shape (static, scrollable, or list-driven), whether the shared wrapper is enough, and any dismissal or gesture constraints.

Start from [creating-component.md](./creating-component.md).

## Prerequisites

- [creating-component.md](./creating-component.md) — placement and shared rules
- [creating-ui-component.md](./creating-ui-component.md) — composition root under `src/ui/BottomSheet/`
- `@gorhom/bottom-sheet` installed in the app:

```bash
node ../scripts/run-package.cjs -- expo install @gorhom/bottom-sheet
```

- App root wrapped once with **`GestureHandlerRootView`** and **`BottomSheetModalProvider`**

## Guidelines

### Default path

- Use **`BottomSheetView`** for static or scrollable feature sheets; set **`scrollable: true`** when the body can overflow.
- Use **`BottomSheetFlatList`** for flat-list driven sheets (for example option pickers).
- Import from **`@/ui/BottomSheet`**, not **`@gorhom/bottom-sheet`**, unless there is a documented bypass.
- Keep open state in local component state or the feature store; pass **`open`** and **`onDismiss`** into the wrapper.

### App setup

Wrap the app tree once. Do not duplicate providers in features.

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

### Choose the primitive

| Content                                           | Wrapper                                           |
| ------------------------------------------------- | ------------------------------------------------- |
| Static UI, short form, grouped actions, filters   | **`BottomSheetView`**                             |
| Scrollable body that can overflow                 | **`BottomSheetView`** with **`scrollable: true`** |
| Flat list (option pickers, long selectable lists) | **`BottomSheetFlatList`**                         |

### Control pattern

- Drive visibility with a controlled boolean (`isOpen` or store state).
- Pass **`open={isOpen}`** and **`onDismiss={() => setIsOpen(false)}`**.
- Call **`present()`** when **`open`** becomes true; do **not** call **`dismiss()`** when **`open`** becomes false — gorhom closes via gesture or backdrop and fires **`onDismiss`**.
- Prefer **`open` / `onDismiss`** over imperative **`present()` / `dismiss()`** in feature code.
- Pass any other gorhom modal prop (for example **`snapPoints`**, **`enablePanDownToClose`**, **`index`**) through the wrapper unchanged.

### Sheet header

When a sheet needs a title, close control, or other header UI:

| Wrapper                   | Header guidance                                                                                                                                                                                                                                                                                                                     |
| ------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **`BottomSheetView`**     | **Default preference:** render header UI **inside `children`**. **`header`** remains available through modal prop forwarding when the use case calls for it — for example a fixed toolbar while the body scrolls.                                                                                                                   |
| **`BottomSheetFlatList`** | **Use `header` or `ListHeaderComponent`.** List sheets have no other natural place for header UI. Prefer wrapper **`header`** (fixed above rows, forwarded to **`BottomSheetModal`**) when the title or toolbar should not scroll with the list; use gorhom **`ListHeaderComponent`** when the header should scroll away with rows. |

For **`BottomSheetFlatList`**, one of **`header`** or **`ListHeaderComponent`** is required whenever the sheet shows header UI.

### Prop forwarding

- Derive wrapper prop types from gorhom with **`Omit`** — do **not** use **`Pick`** to enumerate gorhom props.
- **`BottomSheetModal`** owns only:
  - controlled **`open`**
  - default **`backdropComponent`** (via optional **`backdrop`** prop)
  - default **`backgroundStyle`**
  - optional wrapper-only **`header`** (forwarded to **`BottomSheetModal`**; especially useful for list sheets)
- All remaining gorhom **`BottomSheetModal`** props pass through unchanged.
- **`BottomSheetView`** and **`BottomSheetFlatList`** inherit the full modal prop surface and forward it to **`BottomSheetModal`**.
- At runtime, cast the combined props object when spreading to **`BottomSheetModal`**, **`BottomSheetView`**, **`BottomSheetScrollView`**, or **`BottomSheetFlatList`**. Gorhom and React Native ignore keys that are not part of that component's API.

Wrapper-owned keys to **`Omit`** from gorhom **`BottomSheetModal`**:

| Key                     | Reason                                                         |
| ----------------------- | -------------------------------------------------------------- |
| **`ref`**               | Internal ref drives **`present()`**                            |
| **`children`**          | View / FlatList wrappers supply body content                   |
| **`backdropComponent`** | Shell renders default backdrop; overridable via **`backdrop`** |
| **`backgroundStyle`**   | Shell applies theme default; caller can override               |

Optional **`backdrop`** type — gorhom backdrop props minus values the shell injects:

```tsx
type BottomSheetBackdropConfig = Omit<
  BottomSheetBackdropProps,
  "animatedIndex" | "animatedPosition"
>;
```

### Wrapper vs gorhom

Use gorhom primitives directly only when the feature needs behavior the shared wrapper cannot express — for example mounted **`BottomSheet`**, modal hooks, or a fully custom modal tree. When bypassing the wrapper, keep visuals and dismissal aligned with the rest of the app.

### Folder layout

Keep wrappers under **`src/ui/BottomSheet/`**. Export only **`BottomSheetView`** and **`BottomSheetFlatList`** from the barrel.

```text
src/ui/BottomSheet/
  BottomSheetModal.tsx      — internal gorhom modal shell
  BottomSheetView.tsx       — static + scrollable bodies
  BottomSheetFlatList.tsx   — list body + optional header
  index.ts                  — public exports
```

| Area                   | Location                                     |
| ---------------------- | -------------------------------------------- |
| Public barrel          | `src/ui/BottomSheet/index.ts`                |
| Modal shell (internal) | `src/ui/BottomSheet/BottomSheetModal.tsx`    |
| View wrapper           | `src/ui/BottomSheet/BottomSheetView.tsx`     |
| Flat list wrapper      | `src/ui/BottomSheet/BottomSheetFlatList.tsx` |

### Gorhom documentation

Use when the shared wrapper is insufficient.

| Topic        | Doc                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                        |
| ------------ | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Modal        | [Usage](https://gorhom.dev/react-native-bottom-sheet/modal/usage), [Props](https://gorhom.dev/react-native-bottom-sheet/modal/props), [Methods](https://gorhom.dev/react-native-bottom-sheet/modal/methods), [Hooks](https://gorhom.dev/react-native-bottom-sheet/modal/hooks)                                                                                                                                                                                                                             |
| Bottom sheet | [Usage](https://gorhom.dev/react-native-bottom-sheet/usage), [Props](https://gorhom.dev/react-native-bottom-sheet/props), [Methods](https://gorhom.dev/react-native-bottom-sheet/methods), [Hooks](https://gorhom.dev/react-native-bottom-sheet/hooks)                                                                                                                                                                                                                                                     |
| Components   | [BottomSheetView](https://gorhom.dev/react-native-bottom-sheet/components/bottomsheetview), [BottomSheetScrollView](https://gorhom.dev/react-native-bottom-sheet/components/bottomsheetscrollview), [BottomSheetFlatList](https://gorhom.dev/react-native-bottom-sheet/components/bottomsheetflatlist), [BottomSheetBackdrop](https://gorhom.dev/react-native-bottom-sheet/components/bottomsheetbackdrop), [BottomSheetFooter](https://gorhom.dev/react-native-bottom-sheet/components/bottomsheetfooter) |

### Naming

- Wrapper exports: **`BottomSheetView`**, **`BottomSheetFlatList`** from `@/ui/BottomSheet`.
- Internal shell: **`BottomSheetModal`** — not exported from the public barrel.
- Feature sheet components: `<Feature><Purpose>Sheet` (for example `JobFiltersSheet`, `OptionPickerSheet`).

## Examples

### BottomSheetModal (internal shell)

**Owns:** controlled **`open`**, default backdrop, default background. Everything else is gorhom defaults plus caller props.

`src/ui/BottomSheet/BottomSheetModal.tsx`

```tsx
import {
  BottomSheetBackdrop,
  type BottomSheetBackdropProps,
  BottomSheetModal as GorhomBottomSheetModal,
} from "@gorhom/bottom-sheet";
import { useCallback, useEffect, useRef, type ReactNode } from "react";
import {
  useColorScheme,
  type ComponentProps,
  type StyleProp,
  type ViewStyle,
} from "react-native";
import { THEME } from "@/theme";

export type BottomSheetBackdropConfig = Omit<
  BottomSheetBackdropProps,
  "animatedIndex" | "animatedPosition"
>;

export type BottomSheetModalProps = Omit<
  ComponentProps<typeof GorhomBottomSheetModal>,
  "ref" | "children" | "backdropComponent" | "backgroundStyle"
> & {
  open: boolean;
  header?: ReactNode;
  backdrop?: BottomSheetBackdropConfig;
  backgroundStyle?: StyleProp<ViewStyle>;
  children: ReactNode;
};

export function BottomSheetModal({
  open,
  onDismiss,
  header,
  backdrop,
  backgroundStyle,
  children,
  ...gorhomProps
}: BottomSheetModalProps) {
  const colorScheme = useColorScheme();
  const palette = THEME[colorScheme === "dark" ? "dark" : "light"];
  const sheetRef = useRef<GorhomBottomSheetModal>(null);

  useEffect(() => {
    if (open) {
      sheetRef.current?.present();
    }
  }, [open]);

  const renderBackdrop = useCallback(
    (props: BottomSheetBackdropProps) => (
      <BottomSheetBackdrop {...props} {...backdrop} />
    ),
    [backdrop],
  );

  return (
    <GorhomBottomSheetModal
      ref={sheetRef}
      onDismiss={onDismiss}
      backdropComponent={renderBackdrop}
      backgroundStyle={backgroundStyle ?? { backgroundColor: palette.wash }}
      {...gorhomProps}
    >
      {header}
      {children}
    </GorhomBottomSheetModal>
  );
}
```

### BottomSheetView

**Use when:** static or scrollable non-list content. By default, put header UI in **`children`**; pass **`header`** when a fixed modal-level header fits the layout better.

`src/ui/BottomSheet/BottomSheetView.tsx`

```tsx
import {
  BottomSheetScrollView,
  BottomSheetView as GorhomBottomSheetView,
} from "@gorhom/bottom-sheet";
import type { ComponentProps, ReactNode } from "react";
import {
  BottomSheetModal,
  type BottomSheetModalProps,
} from "./BottomSheetModal";

type BottomSheetViewBodyProps =
  | ({ scrollable?: false } & Omit<
      ComponentProps<typeof GorhomBottomSheetView>,
      "children"
    >)
  | ({ scrollable: true } & Omit<
      ComponentProps<typeof BottomSheetScrollView>,
      "children"
    >);

export type BottomSheetViewProps = Omit<BottomSheetModalProps, "children"> &
  BottomSheetViewBodyProps & {
    children: ReactNode;
  };

export function BottomSheetView(props: BottomSheetViewProps) {
  const { scrollable, children } = props;
  const modalProps = props as Omit<BottomSheetModalProps, "children">;

  if (scrollable) {
    return (
      <BottomSheetModal {...modalProps}>
        <BottomSheetScrollView
          {...(props as ComponentProps<typeof BottomSheetScrollView>)}
        >
          {children}
        </BottomSheetScrollView>
      </BottomSheetModal>
    );
  }

  return (
    <BottomSheetModal {...modalProps}>
      <GorhomBottomSheetView
        {...(props as ComponentProps<typeof GorhomBottomSheetView>)}
      >
        {children}
      </GorhomBottomSheetView>
    </BottomSheetModal>
  );
}
```

### BottomSheetFlatList

**Use when:** virtualized list content. When the sheet needs header UI, use wrapper **`header`** or gorhom **`ListHeaderComponent`** — prefer **`header`** for a fixed title or toolbar.

`src/ui/BottomSheet/BottomSheetFlatList.tsx`

```tsx
import { BottomSheetFlatList as GorhomBottomSheetFlatList } from "@gorhom/bottom-sheet";
import type { ComponentProps } from "react";
import {
  BottomSheetModal,
  type BottomSheetModalProps,
} from "./BottomSheetModal";

export type BottomSheetFlatListProps<T> = Omit<
  BottomSheetModalProps,
  "children"
> &
  Omit<ComponentProps<typeof GorhomBottomSheetFlatList<T>>, "children">;

export function BottomSheetFlatList<T>(props: BottomSheetFlatListProps<T>) {
  const modalProps = props as Omit<BottomSheetModalProps, "children">;
  const flatListProps = props as ComponentProps<
    typeof GorhomBottomSheetFlatList<T>
  >;

  return (
    <BottomSheetModal {...modalProps}>
      <GorhomBottomSheetFlatList {...flatListProps} />
    </BottomSheetModal>
  );
}
```

Modal and flat-list prop names do not overlap in gorhom; the casts document which API each spread targets.

### Public barrel

`src/ui/BottomSheet/index.ts`

```tsx
export {
  BottomSheetFlatList,
  type BottomSheetFlatListProps,
} from "./BottomSheetFlatList";
export { BottomSheetView, type BottomSheetViewProps } from "./BottomSheetView";
```

### Feature filter sheet with `BottomSheetView`

Default pattern: header markup inside **`children`**.

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

### Option picker with `BottomSheetFlatList`

List sheets need **`header`** or **`ListHeaderComponent`** for title UI. Below, **`header`** keeps the title fixed while rows scroll.

```tsx
import { useState } from "react";
import { Pressable, Text, View } from "react-native";
import { BottomSheetFlatList } from "@/ui/BottomSheet";

export function OptionPickerSheet() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <BottomSheetFlatList
      open={isOpen}
      onDismiss={() => setIsOpen(false)}
      header={
        <View className="flex-row items-center justify-between px-4 pb-4">
          <Text className="text-lg font-semibold">Choose option</Text>
          <Pressable onPress={() => setIsOpen(false)}>
            <Text className="text-primary">Close</Text>
          </Pressable>
        </View>
      }
      data={options}
      renderItem={renderOption}
      keyExtractor={(item) => item.id}
    />
  );
}
```

### Backdrop overrides

Pass gorhom backdrop props through **`backdrop`** without flattening them on the wrapper.

```tsx
<BottomSheetFlatList
  open={isOpen}
  onDismiss={() => setIsOpen(false)}
  backdrop={{ appearsOnIndex: 0, disappearsOnIndex: -1, opacity: 0.6 }}
  data={options}
  renderItem={renderOption}
  keyExtractor={(item) => item.id}
/>
```
