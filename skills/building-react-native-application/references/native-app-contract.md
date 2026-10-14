# Native App Contract

## Overview

The stack every `building-react-native-application` recipe builds on.

## Guidelines

### Tech stack

| Layer | Choice |
| --- | --- |
| Runtime | Expo |
| Language | TypeScript |
| Styling | NativeWind, Tailwind CSS, class-variance-authority |
| Routing | React Navigation (static config, `src/routes`) |
| Server state | TanStack Query |
| Client global state | Zustand |
| HTTP | Axios |
| Dates | date-fns (`src/libs/date-utils/`) |
| Presentational UI | React Native Reusables-style primitives in `src/ui/` |
