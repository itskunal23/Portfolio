# Portfolio

Personal portfolio built with Astro + TypeScript + Tailwind. Showcases agentic AI work, MCP integrations, and OMSCS journey.

## Problem
As an AI Engineer specializing in agentic workflows and MCP, I needed a professional portfolio that demonstrates technical depth while reflecting my design sensibility. Existing templates felt generic and didn't showcase the specific work I do.

## Solution
A custom-built portfolio using Astro (static site generation), TypeScript (type safety), and Tailwind (utility-first styling). Features an Apple-inspired design system, dark/light mode, and sections for projects, writing, and technical expertise.

## Tech Stack
- **Framework**: Astro 5.x (islands architecture, zero-JS by default)
- **Language**: TypeScript 5.x (strict mode)
- **Styling**: Tailwind CSS 3.x + custom design tokens
- **Deployment**: Vercel (edge functions, automatic HTTPS)
- **Analytics**: Vercel Analytics + Speed Insights
- **Fonts**: System font stack (SF Pro / Inter fallback)

## Demo
**Live**: https://kunal-goenka-portfolio.vercel.app/
**Custom Domain**: https://kunalgoenka.com/

## Installation
```bash
git clone https://github.com/itskunal23/Portfolio.git
cd Portfolio
npm install
npm run dev
```

## Usage
```bash
# Development server
npm run dev

# Production build
npm run build

# Preview production build
npm run preview

# Type checking
npm run check
```

## Architecture
```
src/
├── components/       # Reusable UI components (Button, Card, Section, etc.)
├── layouts/          # Page layouts (BaseLayout, BlogLayout)
├── pages/            # File-based routing (index.astro, blog/[slug].astro)
├── styles/           # Global styles, Tailwind imports
├── content/          # Content collections (blog posts, projects)
├── utils/            # Helper functions (date formatting, etc.)
└── config/           # Site config, navigation, social links
```

## Key Features
- **Apple-inspired design** — Custom color tokens (#0071E3, #1D1D1F), SF Pro typography
- **Dark/Light mode** — System preference detection + manual toggle with persistence
- **Content collections** — Type-safe blog posts and project entries via Astro content layer
- **Responsive** — Mobile-first, tested at 320px, 768px, 1024px, 1440px
- **Accessible** — Semantic HTML, ARIA labels, focus management, WCAG AA contrast
- **Performance** — Static generation, optimized images, minimal JS (< 10KB)

## Contributing
PRs welcome for typo fixes, accessibility improvements, or design system enhancements. See [CONTRIBUTING.md](CONTRIBUTING.md).

## License
MIT © Kunal Goenka