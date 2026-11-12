# Kunal Goenka

The personal portfolio of **Kunal Goenka**, a Data Scientist working on agentic AI at Boeing and an MS Computer Science (AI) student at Georgia Tech.

> I build software at the intersection of AI systems, design, and how people think.

- **Site:** [kunalgoenka.com](https://kunalgoenka.com)
- **LinkedIn:** [linkedin.com/in/kunalgoenka23](https://www.linkedin.com/in/kunalgoenka23/)
- **GitHub:** [github.com/itskunal23](https://github.com/itskunal23)
- **Email:** [k.goenka23@gmail.com](mailto:k.goenka23@gmail.com)

Designed, written, and built by Kunal Goenka. This is an original project, not a fork or a template.

## Design

The site is built around one idea: **execution graphs**. Kunal's work is about explicit paths through AI systems and the moments a system hands off to a person. So every project is presented as an interactive graph of how it works. You can select a step to read what it does, or trace a request through the system.

- **Color carries meaning.** Cobalt marks automated paths and links. Amber marks the steps where a person makes the call.
- **Depth, without WebGL.** The home page sets the same graph on a tilted plane with real CSS 3D depth. Steps lift off the plane as a request passes through, and the plane follows the cursor slightly on desktop.
- **One component everywhere.** The hero, all eight case studies, and the small "fingerprint" glyphs in project lists come from the same graph data. On narrow screens the graph turns 90 degrees and reads top to bottom.
- **Type:** Schibsted Grotesk for interface and headings, Newsreader for long-form reading.

## Stack

| | |
| --- | --- |
| Framework | [Astro 5](https://astro.build), fully static output |
| Client JavaScript | About 2 kB of vanilla TypeScript; no UI framework ships to the browser |
| Styling | Hand-written CSS with design tokens, container queries, and native cross-document view transitions |
| Fonts | Self-hosted variable fonts from [Fontsource](https://fontsource.org) |
| Hosting | Cloudflare Workers Static Assets ([wrangler.jsonc](wrangler.jsonc)) |
| Tests | Vitest (content integrity and accuracy), Playwright and axe-core (browser, accessibility, layout, links) |

## Project structure

```
src/
  data/         All content, typed: profile, experience, projects, expertise, education
  components/   Graph (interactive execution graph), Hero, Glyph, ProjectList, Header, Contact
  layouts/      Base layout: metadata, Open Graph, JSON-LD, fonts
  pages/        Home, Work, Work/[slug], Experience, About, 404, sitemap.xml, robots.txt
  styles/       Global tokens and base styles
tests/
  unit/         Graph integrity, cross-references, and factual-accuracy guards
  e2e/          Navigation, interaction, accessibility, responsive layout, broken links
scripts/        Screenshot, Lighthouse, layout-cost, and Open Graph image helpers
```

Content accuracy is documented in [CONTENT_SOURCES.md](CONTENT_SOURCES.md). LinkedIn is the source of truth, and every reconciliation with older material is recorded there.

## Development

Requires Node 22 and pnpm 9.

```bash
pnpm install
pnpm dev            # local dev server
pnpm build          # astro check (types) + static build to dist/
pnpm lint
pnpm test           # unit tests (run after build to also scan the built HTML)
pnpm test:e2e       # Playwright; serves dist/ with astro preview
```

## Deployment

Cloudflare builds the site with `pnpm run build` and deploys it with `npx wrangler deploy`, which uploads `dist/` as static assets. Unknown paths return the generated `404.html` with a real 404 status.

## Confidentiality

Case studies for Boeing work are generalized descriptions. The diagrams illustrate an approach, not an internal design. No proprietary source code, data, documents, or internal details appear anywhere in this repository.

## History and attribution

Version 1 of this site (before November 2026) was a macOS-style desktop adapted from the MIT-licensed [playground-macos](https://github.com/Renovamen/playground-macos) template by Renovamen. Version 2 is a ground-up rebuild: none of that template's code, components, or assets remain. That earlier history is preserved in git.

Third-party software and fonts: Astro (MIT); Schibsted Grotesk and Newsreader (SIL Open Font License 1.1), distributed via Fontsource.

## License

Code is MIT licensed (see [LICENSE](LICENSE)). The written content, case studies, and portrait are © Kunal Goenka and are not covered by the code license.
