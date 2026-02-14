---
title: "React Performance Optimization: A Practical Guide"
date: "2026-02-05"
category: "Tutorials"
tags:
  - React
  - Performance
  - Web Development
description: "Practical techniques to optimize React applications — from memo, useMemo, and lazy loading to virtualization and bundle analysis."
---

Performance isn't an afterthought. Here are the techniques I use daily to keep React apps snappy and responsive.

## 1. Avoid Unnecessary Re-renders

The most common performance issue. Use `React.memo`, `useMemo`, and `useCallback` strategically — not everywhere.

```tsx
// Only memo components that are expensive to render
const ExpensiveList = React.memo(({ items }: { items: Item[] }) => (
  <ul>
    {items.map(item => <ListItem key={item.id} item={item} />)}
  </ul>
));
```

## 2. Code Splitting with React.lazy

Don't load your entire app upfront:

```tsx
const Dashboard = React.lazy(() => import('./pages/Dashboard'));
const Settings = React.lazy(() => import('./pages/Settings'));

// Wrap in Suspense
<Suspense fallback={<Skeleton />}>
  <Dashboard />
</Suspense>
```

## 3. Virtualize Long Lists

Rendering 10,000 DOM nodes is never a good idea:

```tsx
import { useVirtualizer } from '@tanstack/react-virtual';

const virtualizer = useVirtualizer({
  count: items.length,
  getScrollElement: () => parentRef.current,
  estimateSize: () => 50,
});
```

## 4. Optimize Images

- Use `loading="lazy"` and `decoding="async"`
- Serve WebP/AVIF formats
- Use responsive `srcset` for different screen sizes

## 5. Bundle Analysis

Run `npx vite-bundle-visualizer` to identify bloated dependencies. Common culprits:
- moment.js → use date-fns instead
- lodash (full import) → use lodash-es with tree shaking
- Unused icon libraries

## 6. Debounce Expensive Operations

Search inputs, resize handlers, scroll listeners — debounce them all:

```tsx
const debouncedSearch = useMemo(
  () => debounce((query: string) => fetchResults(query), 300),
  []
);
```

Performance optimization is about measuring first and optimizing second. Use React DevTools Profiler and Lighthouse to find real bottlenecks, not imagined ones.
