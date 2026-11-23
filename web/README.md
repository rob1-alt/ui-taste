# taster · web

The site, in Next.js (App Router, React 19, TypeScript, no CSS framework). It replaces `site/` once the Vercel project points at this folder; the two stylesheets were carried over as they were.

```bash
cd web
npm install
npm run dev      # syncs the images, then http://localhost:3000
npm run build    # static landing, /library, one page per screen
```

## What it reads

- `skills/ui-taste/library/index.json`, at build time (`src/lib/library.ts`). No `data.js` step any more.
- `site/thumbs/`, still produced by `python3 site/build.py` (it crops the top of each capture, which the image optimiser cannot do). A screen without a thumbnail is left out of the site instead of 404ing: run `build.py` after a batch.
- `skills/ui-taste/library/screens/` for the full captures shown on a screen's page, `site/brand/` for the logo and favicons.

`scripts/sync-assets.mjs` copies these into `public/` (git-ignored) before `dev` and `build`.

## Routes

- `/` the landing. Hero mosaic, specimens, numbers (computed at build), index, method, the anti-slop demo, install.
- `/library` the index with filters in the query string (`?type=pricing&tags=dark&q=linear&p=mobile`). Opening a screen puts `/library/<id>` in the address bar without leaving the page; old `#id=…` links still work.
- `/library/<id>` one screen as a page (523 of them, static), with its Open Graph image generated on demand from the thumbnail.
- `/index.html`, `/library.html` and `/site/*` redirect to the new paths.

## Deploying on Vercel

In the project settings, set **Root Directory** to `web` and keep "Include files outside the root directory" on (the build reads `../site` and `../skills`). The `noindex` header and meta are set in `next.config.ts` and `src/lib/meta.ts`: remove both when launching.

## Where things are

```
src/app/(landing)/        page.tsx + layout (landing.css)
src/app/(library)/        library/page.tsx, library/[id]/page.tsx, opengraph-image.tsx (library.css)
src/components/landing/   Mosaic, Specimens, Stats, IndexRows, Fixer, Checklist, Effects (measure mode, grid, copy)
src/components/library/   LibraryApp (filters, grid, dialog), DetailView, DetailPage, LibraryBar, ThemeToggle
src/lib/                  library.ts (index → items), format.ts (labels, helpers), fonts.ts, meta.ts
src/styles/               landing.css, library.css (from site/, fonts via CSS variables)
```
