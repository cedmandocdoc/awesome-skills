# Web App Contract

## Overview

The stack every `building-react-web-application` recipe builds on.

## Guidelines

### Tech stack

| Layer | Choice |
| --- | --- |
| Bundler | Vite |
| Language | TypeScript |
| Styling | Tailwind CSS v4, class-variance-authority (`cva` + `cx` from the same package) |
| Routing | TanStack Router (file-based, `src/routes`) |
| Server state | TanStack Query |
| Client global state | Zustand |
| HTTP | Axios |
| Dates | date-fns (`src/libs/date-utils/`) |
| Presentational UI | shadcn/ui-style primitives in `src/ui/` |
