<div align="center">

# Kunal Goenka · Portfolio

**An interactive, macOS-style portfolio for an AI Engineer working on agentic systems, enterprise RAG, and production AI infrastructure.**

[![React](https://img.shields.io/badge/React-18-61DAFB?logo=react&logoColor=white)](https://react.dev/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5-3178C6?logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![Vite](https://img.shields.io/badge/Vite-5-646CFF?logo=vite&logoColor=white)](https://vitejs.dev/)
[![UnoCSS](https://img.shields.io/badge/UnoCSS-0.59-333?logo=unocss&logoColor=white)](https://unocss.dev/)
[![Zustand](https://img.shields.io/badge/Zustand-4-443E38)](https://zustand-demo.pmnd.rs/)
[![License: MIT](https://img.shields.io/badge/License-MIT-green.svg)](LICENSE)

</div>

---

## Overview

This is a personal portfolio presented as a fully interactive macOS desktop. Instead of a single scrolling page, the experience is a windowed operating system you can explore: open apps from the dock, browse a résumé as a filesystem in the terminal, and read engineering case studies with architecture diagrams and animated charts.

It is built as a production-grade single-page application: code-split per app, lazily loaded, strongly typed end to end, and deployed on a static host.

- **Live site:** deployed via Vercel (see [Deployment](#deployment)).
- **Author:** Kunal Goenka, AI Engineer, Agentic AI & Enterprise Systems.
- **Contact:** [k.goenka23@gmail.com](mailto:k.goenka23@gmail.com) · [LinkedIn](https://www.linkedin.com/in/kunalgoenka23/) · [GitHub](https://github.com/itskunal23)

---

## Features

- **Desktop shell.** A windowed macOS environment with a dock, top bar, menus (Wi-Fi, battery, control center), Launchpad, Spotlight, and draggable, resizable app windows.
- **Bear.** The primary content app: profile, experience, skills, education, recognition, and six full project case studies, each with a problem statement, conceptual architecture diagram, engineering decisions, and a measured result.
- **Terminal.** Browse the résumé as a small filesystem using familiar commands (`ls`, `cd about`, `cat bio.txt`).
- **Safari.** Contact details and external links.
- **Typora & VS Code.** Markdown and code viewers that round out the desktop metaphor.
- **Custom data visualizations.** Lightweight, animated KPI, bar, donut, and chip charts rendered from inline chart specs embedded in the Markdown content.
- **Theming.** Day and night wallpapers with a matching light/dark theme.

---

## Tech stack

| Layer | Technology |
| --- | --- |
| Framework | [React 18](https://react.dev/) |
| Language | [TypeScript 5](https://www.typescriptlang.org/) (strict) |
| Build tool | [Vite 5](https://vitejs.dev/) |
| Styling | [UnoCSS](https://unocss.dev/) (atomic CSS) |
| State | [Zustand](https://zustand-demo.pmnd.rs/) |
| Animation | [Framer Motion](https://www.framer.com/motion/) |
| Content | [react-markdown](https://github.com/remarkjs/react-markdown) + remark/rehype (GFM, math, KaTeX) |
| Windows | [react-rnd](https://github.com/bokuweb/react-rnd) |
| Tooling | ESLint, Prettier, Husky, lint-staged, pnpm |

---

## Architecture

The app loads a boot screen, then a login screen, then the desktop. Each desktop app is a separate chunk that is downloaded and evaluated only the first time it is opened, which keeps the initial payload small.

```
src/
├── pages/            Boot, Login, Desktop (the three top-level screens)
├── components/
│   ├── apps/         One component per app window (Bear, Terminal, Safari, ...)
│   ├── dock/         Dock and dock items
│   ├── menus/        Top bar, Wi-Fi, battery, control center, Apple menu
│   ├── AppWindow     Draggable/resizable window frame + Suspense boundary
│   ├── Launchpad     App grid
│   └── Spotlight     Search overlay
├── configs/          Data-driven content: apps, dock, launchpad, terminal, user
├── stores/           Zustand slices (system, dock, user)
├── charts/           Custom animated chart renderers (KPI, bar, donut, chips)
├── hooks/            Reusable hooks (audio, battery, window size, ...)
├── styles/           Global + per-app CSS and the theme
└── types/            Shared TypeScript definitions

public/
├── markdown/         All portfolio content (about, experience, skills, projects, ...)
├── img/diagrams/     Conceptual architecture diagrams for the case studies
└── files/            Downloadable résumé (PDF)
```

**Content is data, not code.** The portfolio text lives in `public/markdown/*.md` and the terminal content in `src/configs/terminal.tsx`. Updating the portfolio rarely means touching component code.

**Code splitting.** `vite.config.ts` isolates heavy dependencies (syntax highlighter, KaTeX, Markdown, Milkdown, Framer Motion, React) into their own cacheable chunks so the main bundle stays lean and each app only pulls in what it needs.

---

## Getting started

### Prerequisites

- [Node.js](https://nodejs.org/) 20 or newer
- [pnpm](https://pnpm.io/) 9 (`corepack enable` will provide it)

### Install

```bash
pnpm install
```

### Develop

```bash
pnpm dev
```

The dev server starts on `http://localhost:5173` with hot module replacement.

### Build

```bash
pnpm build
```

This type-checks the project (`tsc --noEmit`) and produces a static bundle in `dist/`.

### Preview the production build

```bash
pnpm serve
```

### Lint

```bash
pnpm lint
```

---

## Available scripts

| Script | Description |
| --- | --- |
| `pnpm dev` | Start the Vite dev server with HMR |
| `pnpm build` | Type-check and build the static site into `dist/` |
| `pnpm serve` | Preview the production build locally |
| `pnpm lint` | Run ESLint across the project |
| `pnpm typecheck` | Run the TypeScript compiler without emitting output |

---

## Deployment

The site is a static single-page app and deploys cleanly to any static host.

### Vercel (primary)

The repository is connected to Vercel. Vercel auto-detects the Vite framework preset:

- **Build command:** `pnpm build`
- **Output directory:** `dist`
- **Install command:** `pnpm install`

A `vercel.json` is included to rewrite all routes to `index.html` so the SPA handles its own routing. Every push to `main` triggers a production deployment; pull requests get preview deployments automatically.

### GitHub Pages (optional)

A GitHub Actions workflow (`.github/workflows/deploy.yaml`) also builds the site and can publish `dist/` to GitHub Pages. Set a custom domain via the `cname` field in that workflow and update the canonical / Open Graph URLs in `index.html` if you use it.

---

## Content and accuracy

The project case studies describe real engineering work done in professional roles. To protect proprietary information, they use **generalized architecture** and contain no internal source code, confidential data, restricted screenshots, internal URLs, or credentials. Architecture diagrams are conceptual explanations of the systems, not reproductions of internal designs. Every metric on the site maps to work that was actually shipped.

---

## Credits

The macOS desktop interface is adapted from the open-source [playground-macos](https://github.com/Renovamen/playground-macos) template by [@Renovamen](https://github.com/Renovamen), which is MIT licensed. All portfolio content, project case studies, and architecture diagrams are the original work of Kunal Goenka.

---

## License

Released under the [MIT License](LICENSE).
