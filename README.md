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

Three viable targets, and the repo supports all three without code changes. The number that
decides it is the home page payload: the six scroll-world clips plus their posters are
**21.8 MB per visit**.

| | GitHub Pages | Cloudflare Pages | Coolify (self-hosted) |
| --- | --- | --- | --- |
| Real 301 redirects | no — no redirect rules, and Astro's static redirects are meta refreshes | yes, `public/_redirects` | yes, `nginx/default.conf` |
| Cache and security headers | no | yes, `public/_headers` | yes, `nginx/default.conf` |
| Bandwidth for the clips | soft 100 GB/month ≈ 4,500 home visits | unlimited on the free tier | whatever the host's line provides |
| Setup | Actions publishes `dist/` | connect the repo, `npm ci && npm run build`, output `dist` | already wired, needs one secret |

**Recommended: Cloudflare Pages.** Free, unlimited bandwidth, a CDN between the visitor and
the video, and it honours `public/_redirects` (the Odoo 14 SEO 301s) and `public/_headers`
(caching and security headers). Point the domain at Cloudflare, create a Pages project from the
repository with build command `npm ci && npm run build` and output directory `dist`, then add
`nicolasramos.es` and `www.nicolasramos.es` as custom domains.

**The Coolify path stays wired** as the self-hosted option: GitHub Actions builds an image to
ghcr.io and then calls `POST /api/v1/deploy?uuid=…` with a bearer token; Coolify detects the
`Dockerfile` (node builds, nginx serves `dist/`), and `nginx/default.conf` carries the same
redirects and caching as `_redirects` and `_headers`. The trade is that every visit pulls ~22 MB
through the host's line and the site is only as up as that machine.

To wire that path without clicking through the panel:

```bash
export COOLIFY_API_TOKEN=cn_...                       # created by a member of the owning team
./tools/coolify-provision.sh --dry-run               # reads Coolify, prints what it would do
./tools/coolify-provision.sh --set-ci-secrets        # project + app + domains + Actions secrets
```

The script is idempotent — it reuses the project and the application when they already exist — and
it needs no GitHub App because the repository is public (`POST /applications/public`). CI
authenticates the documented way, a bearer header plus the app uuid: `--set-ci-secrets` stores
`COOLIFY_API_TOKEN`, `COOLIFY_APP_UUID` and `COOLIFY_BASE_URL`. Coolify 4.1.x answers `401` to the
older `?token=` webhook URL, so it is not used. Give the token the minimum abilities and revoke it
once the app is wired.

**GitHub Pages** works mechanically (`actions/deploy-pages` publishing `dist/`), but it cannot
issue the 301s the old Odoo URLs depend on and it caps bandwidth, so it is a poor home for a
site whose hero is video.

`www` → apex flattening and TLS are host settings in all three cases: Cloudflare and Coolify
(Traefik) handle the certificate automatically; on nginx the certificate comes from Coolify's
proxy in front of the container.

One repo-size note for any choice: the clips live in `public/world/` (21.5 MB). If they get
re-cut often, move them to Git LFS before the history grows, because every version of a clip
stays in the pack forever.

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
