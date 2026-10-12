# nicolasramos.es

Portfolio site for Nicolás Ramos: Odoo implementation, local AI agents and business automation.
Static Astro 7 site, bilingual Spanish and English, zero JavaScript except the mobile nav,
the scroll reveals and one copy email button.

## Stack

- Astro 7 (static output), TypeScript strict
- Tailwind CSS 4 through `@tailwindcss/vite`
- Self hosted fonts: Manrope Variable for text, Geist Mono for data and labels
- `@astrojs/sitemap` with i18n hreflang, MDX integration available for long form content
- Docker multi stage build (node build, nginx serve) plus a GitHub Actions workflow for Coolify

## Layout

```
src/i18n/{es,en}/index.ts   all page copy, one file per locale
src/data/projects.ts        project content plus GitHub facts
src/data/site.ts            routes, contact links, hreflang pairs
src/components/             layout pieces (header, footer, cards, reveal)
src/sections/             one body per page, rendered by both locales
src/pages/                  thin pages: ES at /, EN at /en/
scripts/                    Playwright checks (visual evidence and structure audit)
```

Each page exists once as a locale agnostic body component, so the Spanish and English
versions cannot drift apart.

## Commands

```bash
npm install
npm run dev            # astro dev
npm run build          # static build into dist/
npm run preview:lan    # serve dist/ on 0.0.0.0:4321
```

## Checks

Both scripts expect a running preview server and Playwright.

```bash
npm run verify   # screenshots, console and network errors, nav, copy button, reveal state
npm run audit    # per route and viewport: h1 count, horizontal overflow, fonts, focus ring, dead text
```

Set `BASE`, `PLAYWRIGHT_PATH` and `BROWSER_PATH` when the defaults do not fit your machine.
Reveals are captured with `prefers-reduced-motion: reduce`, which also proves the reduced motion
fallback leaves every element visible.

## Facts and honesty

Star, fork, language and last push numbers in `src/data/projects.ts` come from the GitHub API.
There are no testimonials, no prices and no invented metrics anywhere on the site.

## Pending decisions

- **Repository and hosting**: the site is not published yet. `nicolasramos.es` still serves the old
  Odoo 14 install. Deploy needs a repo, a Coolify app and DNS pointed at it.
- **Contact form**: the contact page uses a prefilled `mailto:` link. Direct form submission needs
  a Web3Forms or Formspree key from the owner.
- **Legal pages**: privacy, cookies and legal notice link to the pages published on nramos.dev.
  Move them into this site if the two properties must stay separate.
- **Analytics**: Plausible is wired through `PUBLIC_ANALYTICS_DOMAIN` and stays disabled when unset.
