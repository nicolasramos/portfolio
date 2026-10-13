# nicolasramos.es

Portfolio site for Nicolás Ramos: Odoo implementation, local AI agents and business automation.
Static Astro 7 site, bilingual Spanish and English. The home page is a scroll-scrubbed world of
six video stops; the inner pages are editorial and interactive without shipping a line of
JavaScript for that interactivity.

## Stack

- Astro 7 (static output), TypeScript strict
- Tailwind CSS 4 through `@tailwindcss/vite`
- Self hosted fonts: Manrope Variable for text, Geist Mono for data and labels
- `@astrojs/sitemap` with i18n hreflang, MDX integration available for long form content
- Strict monochrome tokens in `src/styles/global.css` (`--color-night`, `panel`, `line`, `ink`,
  `muted`, `accent`). Never name a colour token `base`, `sm`, `lg` or `xl`: Tailwind turns
  `--color-<name>` into a `text-<name>` utility and body text silently turns black.
- Docker multi stage build (node build, nginx serve) plus a GitHub Actions workflow for Coolify

## How the home works

`src/components/ScrollWorld.astro` mounts `public/world/scrub-engine.js`: six mp4 clips scrubbed
by scroll, one still poster each, no autoplay. The clips and posters are generated with ComfyUI
(Wan 2.2 for video, JuggernautXL for stills) through `tools/` — see `tools/README.md`, and set
`COMFY_SERVER` to reach the machine. Copy lives in `src/data/world.ts`.

Two things the engine taught us: it assumes a light page, so its buttons are overridden for the
dark theme; and video models cannot hold lettering, so the logo on the end card is a DOM overlay
(`.sw-finale-mark`), never pixels inside the clip.

## Interactions are CSS only

- `/servicios/`: ticking a self-diagnosis sentence keeps the matching service sheets lit and dims
  the rest. Real checkboxes plus `:has()` rules generated from the copy in
  `src/components/services/FitSelector.astro`.
- `/proyectos/`: language filter from radio buttons plus `:has()`, generated in
  `src/sections/ProjectsBody.astro`.

No hydration cost, they work with JavaScript disabled, and they print complete.

## Layout

```
src/i18n/{es,en}/index.ts   all page copy, one file per locale
src/data/projects.ts        project narrative; facts are merged from repos.json
src/data/repos.json         committed GitHub snapshot, written by npm run refresh
src/data/site.ts            routes, contact links, hreflang pairs
src/data/world.ts           the six scroll-world stops (ES and EN)
src/components/             layout pieces (header, footer, cards, reveal, scroll world)
src/sections/               one body per page, rendered by both locales
src/pages/                  thin pages: ES at /, EN at /en/
public/world/               the six clips, their posters and the scrub engine
scripts/                    Playwright checks (see below)
tools/                      ComfyUI clients, shot list and prompts that produced the media
nginx/ Dockerfile coolify.toml .github/workflows/deploy.yml   the deploy path
```

Each page exists once as a locale agnostic body component, so the Spanish and English
versions cannot drift apart.

## Commands

```bash
npm install
npm run dev            # astro dev
npm run build          # static build into dist/
npm run preview:lan    # serve dist/ on 0.0.0.0:4321
npm run refresh        # rewrite src/data/repos.json from GitHub (uses the gh CLI when present)
```

`npm run build` never touches the network: repository facts are a committed snapshot, so CI and
offline builds are deterministic. A repo missing from the snapshot fails the build with the
command to run rather than rendering stale numbers.

## Checks

All of them expect a running preview server (`npm run preview:lan`) and Playwright. Set `BASE`,
`PLAYWRIGHT_PATH` and `BROWSER_PATH` when the defaults do not fit your machine.

```bash
npm run verify        # screenshots, console and network errors, nav, copy button, reveal state
npm run audit         # per route and viewport: h1 count, overflow, fonts, focus ring, dead text
npm run contrast      # WCAG AA walker: every visible text node against its resolved background
npm run world-check   # the scroll world: scenes, posters, seekable clips, reduced motion, mobile
npm run pages-check   # self-diagnosis lit/dim, every language filter, artwork, mobile overflow
```

Reveals are captured with `prefers-reduced-motion: reduce`, which also proves the reduced motion
fallback leaves every element visible.

## Deploy

The path is already in the repo: GitHub → GitHub Actions → an image in ghcr.io → Coolify.

1. Push the branch, open the pull request, merge into `main`.
2. In Coolify, create an application from this repository. Coolify picks up the `Dockerfile`
   (node builds `dist/`, nginx serves it) — no build command to configure.
3. Add the secret the workflow expects: `COOLIFY_WEBHOOK_URL`, the app deploy webhook. The
   workflow posts the new image tag to it after a push to `main`. `GITHUB_TOKEN` comes from
   Actions and the image lands in `ghcr.io/<owner>/<repo>`.
4. Domains `nicolasramos.es` and `www.nicolasramos.es` are declared in `coolify.toml`; point DNS at
   the Coolify host and let Traefik issue the certificate.
5. Old Odoo 14 URLs are preserved by `nginx/default.conf` (301s to the canonical trailing-slash
   form, blog to nramos.dev) and `/web/*` returns 410.

Any static host also works, and is cheaper to operate: build `npm ci && npm run build`, publish
`dist/`. Cloudflare Pages or Netlify need no changes. Note `public/world/` carries about 21 MB of
video: if the clips get re-cut often, move `public/world/*.mp4` to Git LFS before the history grows.

## Facts and honesty

Stars, forks, language, dates, licence, open issues and contributors come from the GitHub API
(`npm run refresh`). Repositories without a declared licence show none rather than a guess. There
are no testimonials, no prices and no invented metrics anywhere on the site.

## Pending decisions

- **Contact form**: the contact page uses a prefilled `mailto:` link. Direct submission needs a
  Web3Forms or Formspree key from the owner.
- **Legal pages**: privacy, cookies and legal notice link to the pages published on nramos.dev.
  Move them into this site if the two properties must stay separate.
- **Analytics**: Plausible is wired through `PUBLIC_ANALYTICS_DOMAIN` and stays disabled when unset.
