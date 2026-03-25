# Keyboard

## Overview

Use this guide to handle the soft keyboard with [`react-native-keyboard-controller`](https://docs.expo.dev/versions/latest/sdk/keyboard-controller/). It aligns Android and iOS behavior beyond React Native’s [`Keyboard`](https://reactnative.dev/docs/keyboard) and [`KeyboardAvoidingView`](https://reactnative.dev/docs/keyboardavoidingview). Expo-oriented install and platform notes: [Expo SDK: Keyboard Controller](https://docs.expo.dev/versions/latest/sdk/keyboard-controller/).

## Guidelines

### When to use

- Prefer this library when core avoidance is inconsistent, chat or long forms need scroll sync, or you want toolbar-style field navigation without rebuilding it yourself.

### Choosing components

Pick by **what moves** and **how much content scrolls**:

| Component                 | Use when                                                                               | What it does                                                                                                                                                                         |
| ------------------------- | -------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| `KeyboardAvoidingView`    | One screen, relatively static layout (short form, simple chat shell)                   | Resizes or shifts layout (`behavior`: `padding`, `height`, `position`, `translate-with-padding`). Same general idea as RN’s `KeyboardAvoidingView`, but consistent across platforms. |
| `KeyboardStickyView`      | A bar (composer, actions) should sit on the keyboard without resizing the whole screen | Moves **only** that child with the keyboard; outer layout stays the same.                                                                                                            |
| `KeyboardAwareScrollView` | Many fields or long content inside a `ScrollView`                                      | Scrolls so the focused `TextInput` stays visible; follows keyboard animation.                                                                                                        |
| `KeyboardToolbar`         | Users jump between several inputs                                                      | Sticky prev / next / done above the keyboard; uses the library’s focus order (view hierarchy).                                                                                       |
| `KeyboardChatScrollView`  | Chat-style UI (often `inverted` lists, specific lift behavior)                         | Tunes how the thread moves when the keyboard opens (`keyboardLiftBehavior`, `offset`, etc.).                                                                                         |

**Also in the library** (reach for them when the table above is not enough):

- `OverKeyboardView` — show UI **over** the keyboard **without** dismissing it (e.g. suggestions menu).
- `KeyboardExtender` — custom strip **inside** the keyboard area (not for nesting another `TextInput`).
- `KeyboardBackgroundView` — match the system keyboard background for visual continuity (no layout logic).

For hooks (`useKeyboardHandler`), Reanimated-driven layouts, and Expo root wiring, see [Expo: Advanced keyboard handling](https://docs.expo.dev/guides/keyboard-handling#advanced-keyboard-handling-with-keyboard-controller).

## Setup

Authoritative checklist: [Installation](https://kirillzyusko.github.io/react-native-keyboard-controller/docs/installation).

### Install and configure

- Install with `npx expo install react-native-keyboard-controller` (or `yarn` / `npm` per that doc).
- Add [`react-native-reanimated`](https://docs.swmansion.com/react-native-reanimated/docs/fundamentals/getting-started/#installation) first; this library depends on it.
- Wrap the app in `KeyboardProvider`. If the keyboard flashes on cold start, the installation doc describes `preload={false}` and manual preload.
- Reinstall pods and rebuild Android/iOS; use **Linking** / troubleshooting there if autolinking fails.

### Bare React Native

If the app is not Expo-first, [install Expo modules](https://docs.expo.dev/bare/installing-expo-modules) when needed, then follow the same [Installation](https://kirillzyusko.github.io/react-native-keyboard-controller/docs/installation) guide.

## Usage

### Root layout

`KeyboardProvider` is required for the components below to work.

```tsx
import type { ReactNode } from "react";
import { KeyboardProvider } from "react-native-keyboard-controller";

export default function RootLayout({ children }: { children: ReactNode }) {
  return <KeyboardProvider>{children}</KeyboardProvider>;
}
```

### KeyboardAvoidingView

Use for a **non-scroll** or lightly structured screen. With React Navigation headers, pass `keyboardVerticalOffset` (e.g. `useHeaderHeight()` from `@react-navigation/elements`) or enable `automaticOffset` so the header is accounted for—see the [KeyboardAvoidingView API](https://kirillzyusko.github.io/react-native-keyboard-controller/docs/api/components/keyboard-avoiding-view).

```tsx
import { TextInput } from "react-native";
import { KeyboardAvoidingView } from "react-native-keyboard-controller";

export function LoginScreen() {
  return (
    <KeyboardAvoidingView behavior="padding" className="flex-1 p-4">
      <TextInput placeholder="Email" />
      <TextInput placeholder="Password" />
    </KeyboardAvoidingView>
  );
}
```

### KeyboardAwareScrollView and KeyboardToolbar

Typical **long form**: scrollable body plus accessory keys. `bottomOffset` is spacing between keyboard and caret; tune for tab bars or safe area.

```tsx
import { TextInput } from "react-native";
import {
  KeyboardAwareScrollView,
  KeyboardToolbar,
} from "react-native-keyboard-controller";

export function ProfileForm() {
  return (
    <>
      <KeyboardAwareScrollView
        bottomOffset={62}
        className="flex-1"
        contentContainerClassName="gap-4 p-4"
      >
        <TextInput placeholder="Name" />
        <TextInput placeholder="Email" />
      </KeyboardAwareScrollView>
      <KeyboardToolbar>
        <KeyboardToolbar.Prev />
        <KeyboardToolbar.Next />
        <KeyboardToolbar.Done />
      </KeyboardToolbar>
    </>
  );
}
```

### KeyboardStickyView

Keeps a **single footer** glued to the top of the keyboard; the rest of the tree does not shrink the same way as `KeyboardAvoidingView`.

```tsx
import { TextInput, View } from "react-native";
import { KeyboardStickyView } from "react-native-keyboard-controller";

export function ThreadWithComposer() {
  return (
    <View className="flex-1">
      {/* message list */}
      <KeyboardStickyView>
        <TextInput placeholder="Message" />
      </KeyboardStickyView>
    </View>
  );
}
```

### KeyboardChatScrollView

Use for **chat** layouts. Set `inverted` when the list is inverted (newest at the bottom). `keyboardLiftBehavior` controls whether content always lifts, only when scrolled to the end, stays lifted after dismiss, etc.

```tsx
import { KeyboardChatScrollView } from "react-native-keyboard-controller";

export function ChatThread() {
  return (
    <KeyboardChatScrollView
      className="flex-1"
      contentContainerClassName="flex-grow p-4"
      inverted
      keyboardLiftBehavior="always"
    >
      {/* messages; often a list inside */}
    </KeyboardChatScrollView>
  );
}
```

### Virtualized lists with KeyboardAwareScrollView

`FlatList` / `FlashList` / similar: supply `KeyboardAwareScrollView` as the scroll component.

```tsx
import { FlatList, TextInput, View } from "react-native";
import { KeyboardAwareScrollView } from "react-native-keyboard-controller";

const rows = [{ id: "1" }, { id: "2" }];

export function ListForm() {
  return (
    <FlatList
      className="flex-1"
      contentContainerClassName="gap-4 p-4"
      data={rows}
      keyExtractor={(item) => item.id}
      renderItem={() => (
        <View>
          <TextInput placeholder="Field" />
        </View>
      )}
      renderScrollComponent={(props) => <KeyboardAwareScrollView {...props} />}
    />
  );
}
```

## Official references

- [Installation](https://kirillzyusko.github.io/react-native-keyboard-controller/docs/installation)
- [Components overview](https://kirillzyusko.github.io/react-native-keyboard-controller/docs/guides/components-overview)
- [KeyboardAvoidingView](https://kirillzyusko.github.io/react-native-keyboard-controller/docs/api/components/keyboard-avoiding-view)
- [KeyboardAwareScrollView](https://kirillzyusko.github.io/react-native-keyboard-controller/docs/api/components/keyboard-aware-scroll-view)
- [KeyboardChatScrollView](https://kirillzyusko.github.io/react-native-keyboard-controller/docs/api/components/keyboard-chat-scroll-view)
- [KeyboardStickyView](https://kirillzyusko.github.io/react-native-keyboard-controller/docs/api/components/keyboard-sticky-view)
- [KeyboardToolbar](https://kirillzyusko.github.io/react-native-keyboard-controller/docs/api/components/keyboard-toolbar)
