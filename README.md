# bacnguyenne.github.io

My personal blog — notes on building with AI: LLM apps, agents, retrieval,
evals, and shipping AI features to production.

Live at **https://bacnguyenne.github.io**

Built with [Astro](https://astro.build/), with a dark-first design, light/dark
toggle, tags, RSS, and per-post SEO. Deployed automatically to GitHub Pages via
GitHub Actions (`.github/workflows/deploy.yml`) on every push to `main`.

## Writing a new post

Add a Markdown (or MDX) file to `src/content/blog/`:

```md
---
title: 'My new post'
description: 'One-line summary used in listings, SEO, and the RSS feed.'
pubDate: 'Jun 19 2026'
tags: [agents, evals]
# heroImage: '../../assets/cover.jpg'   # optional
# draft: true                            # optional — hides from build
---

Write the post here in Markdown. Reading time and tag pages are generated
automatically.
```

Commit and push to `main` — the site rebuilds and redeploys on its own.

## Local development

```sh
npm install
npm run dev      # http://localhost:4321
npm run build    # production build into ./dist
npm run preview  # preview the production build
```

## Project structure

```text
src/
├── components/   # BaseHead, Header, Footer, ThemeToggle, PostCard, ...
├── content/blog/ # the blog posts (Markdown / MDX)
├── layouts/      # BlogPost layout
├── lib/          # small helpers (reading time)
├── pages/        # routes: index, about, blog/, tags/, 404, rss.xml
├── styles/       # global.css (design system)
└── consts.ts     # site title, description, social links, nav
astro.config.mjs  # site URL, fonts (Inter + JetBrains Mono), Shiki, integrations
```
