---
name: typescript
description: Strict TypeScript—`import type`, props as interfaces, explicit return types, discriminated unions, typed navigation and env. Use when configuring tsconfig, typing React/React Native components, or modeling variant data.
version: 1.0.0
---

# TypeScript

Conventions for strict, maintainable TypeScript. Applies across stacks unless a more specific skill overrides it.

## When to Use

- Enabling or tuning `tsconfig.json` and compiler strictness
- Typing component props, hooks, and shared data shapes
- Choosing `interface` vs `type`, `import type`, and discriminated unions
- Typing navigation param lists or environment variables

## Overview

Use strict TypeScript configuration with explicit return types, `import type` for type-only imports, and discriminated unions for data modeling. Type safety prevents runtime errors and improves developer experience.

## Key Principles

- Enable `strict: true` in `tsconfig.json`
- Use `import type` for types and interfaces
- Use `interface` (not `type`) for component props
- Explicit return types on functions and components
- Discriminated unions for variant data

## Usage

### Strict Configuration

```json
// tsconfig.json
{
  "compilerOptions": {
    "strict": true,
    "noUncheckedIndexedAccess": true
  }
}
```

### Import Type

```typescript
import type { ReactNode } from 'react';
import type { ViewProps } from 'react-native';
import type { Workshop } from '../types/workshop';
```

### Props Interfaces

```typescript
interface ActionCardProps extends PressableProps {
  title: string;
  description?: string;
  children?: ReactNode;
}

export function ActionCard({ title, description, children }: ActionCardProps): JSX.Element {
  // ...
}
```

### Discriminated Unions

```typescript
type HeaderItem = { id: string; type: 'header'; title: string };
type MessageItem = { id: string; type: 'message'; text: string };
type ImageItem = { id: string; type: 'image'; url: string };
type FeedItem = HeaderItem | MessageItem | ImageItem;

function renderItem(item: FeedItem) {
  switch (item.type) {
    case 'header': return <SectionHeader title={item.title} />;
    case 'message': return <MessageRow text={item.text} />;
    case 'image': return <ImageRow url={item.url} />;
  }
}
```

### Type-Safe Navigation

```typescript
export type MainStackParamList = {
  Home: undefined;
  Detail: { id: string };
};

type Props = NativeStackScreenProps<MainStackParamList, 'Home'>;
```

### Environment Variables

```typescript
// types/env.d.ts
declare global {
  namespace NodeJS {
    interface ProcessEnv {
      EXPO_PUBLIC_API_URL: string;
    }
  }
}
export {};
```

## Mistakes to Avoid

- Using `type` instead of `interface` for props (interfaces are extendable)
- Forgetting `import type` for type-only imports
- Missing explicit return types on exported functions
- Using `any` instead of proper types or `unknown`
- Boolean flags instead of discriminated unions for variant data

## References

- [TypeScript Handbook](https://www.typescriptlang.org/docs/handbook/)
