---
title: "The Complete Guide to Modern CSS: Flexbox to Container Queries"
date: "2026-01-10"
category: "Design"
tags:
  - CSS
  - Web Design
  - Frontend
description: "Master modern CSS techniques including Flexbox, Grid, CSS Variables, Container Queries, and the new color functions that are changing web design."
---

CSS has evolved dramatically in recent years. Features that once required JavaScript or complex hacks are now native to the language. Here's your guide to the modern CSS landscape.

## CSS Grid — Beyond Basics

Grid isn't just for simple layouts. Use `subgrid`, named areas, and auto-fit for truly responsive design without media queries:

```css
.dashboard {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  grid-template-rows: subgrid;
  gap: 1.5rem;
}
```

## Container Queries

The game-changer. Components that respond to their container's size, not the viewport:

```css
.card-container {
  container-type: inline-size;
  container-name: card;
}

@container card (min-width: 400px) {
  .card { flex-direction: row; }
}
```

## Modern Color Functions

`oklch()` and `color-mix()` give you perceptually uniform colors:

```css
:root {
  --primary: oklch(65% 0.25 260);
  --primary-light: color-mix(in oklch, var(--primary) 60%, white);
}
```

## Scroll-driven Animations

Animate based on scroll progress — no JavaScript needed:

```css
@keyframes reveal {
  from { opacity: 0; transform: translateY(30px); }
  to { opacity: 1; transform: translateY(0); }
}

.section {
  animation: reveal linear both;
  animation-timeline: view();
  animation-range: entry 0% entry 100%;
}
```

## Nesting

Native CSS nesting is finally here:

```css
.card {
  background: white;
  
  & .title {
    font-size: 1.5rem;
  }
  
  &:hover {
    box-shadow: 0 4px 12px rgb(0 0 0 / 0.1);
  }
}
```

CSS has never been more powerful. Embrace these modern features and ship better UIs with less code.
