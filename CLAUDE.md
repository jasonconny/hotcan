# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

```sh
npm install        # install dependencies
npm run dev        # Vite dev server (http://localhost:5173)
npm run build      # type-check (tsc -b) then Vite production build → dist/
npm run preview    # serve the built dist/ locally
bash scripts/deploy.sh             # build + deploy dist/ to Cloudflare Pages
bash scripts/upload-audio-to-r2.sh # one-time/audio-change upload to R2
```

There are no tests. The quality gate is a manual visual/functional check (see DEPLOY.md → "Verifying a Deployment").

## What this is

A **React 19 + Vite + TypeScript** static archive site for a podcast that ran 100 episodes (2012–2014). It's a frozen archive — no new content or features are expected. It was rewritten from an AngularJS 1.5 / Gulp app; the goal of any change should be to preserve the existing design, content, and URLs.

Deployed as a static site on **Cloudflare Pages**. Episode **audio is hosted on Cloudflare R2**, not in the repo or the build (too large; `*.mp3`/`*.ogg` are gitignored).

## Architecture

### Data flow
- `src/data/hotcan.json` — the 100 episodes, imported directly (bundled at build time, never fetched). Raw shape: `{number, title, date, filename, intro, songs[]}` where `intro` is a **string key**, not an object.
- `src/data/episodes.ts` — the single source of truth at runtime. Maps the raw JSON into typed `Episode[]` (see `src/types.ts`): parses `number`, derives `routename` via `src/lib/slug.ts`, builds `mp3Path`/`oggPath`, resolves `intro` to a full `Song` via `src/data/intros.ts`, and **sorts by episode number** so `episodes[n-1]` is episode `n` (used for prev/next nav). Exports `episodes` and `getEpisodeByRoutename`.
- `src/data/intros.ts` — maps the few intro name keys to full track objects; everything not explicitly matched (including both "Hip Hug-Her" spellings in the data) falls through to a Booker T default. This mirrors the original app's behavior exactly — preserve it.

### Routing (`src/App.tsx`)
Declarative React Router (`BrowserRouter` in `src/main.tsx`). `/` redirects to the first episode (`/beginnings`). Static routes: `/all`, `/about`, `/contact`, `/for-content-owners`, `/uhoh`. Episodes are `/:episodeName` (looked up by `routename`; unknown slug renders `NotFoundPage`).

**Legacy URL redirects** (`src/lib/legacyRedirects.ts`) preserve old WordPress inbound links: `/category/podcast` → `/all`, and `/podcast/the-hot-can-all-vinyl-power-hour-episode-<n>-<slug>` → the episode. An explicit map handles special cases; a general rule slices the fixed prefix off the rest. Don't "simplify" the slice offsets (43/44) — they're load-bearing.

### Audio + hosting
Audio `<source>` paths point at `/_res/audio/*`. In production, `public/_redirects` issues a **301 to R2** for those paths, and a `/* → index.html 200` catch-all enables SPA routing. The Vite dev server does **not** honor `_redirects`, so audio 404s locally unless files are placed in `public/_res/audio/`. `public/` is copied verbatim into `dist/` by Vite.

### Search (`src/pages/AllEpisodesPage.tsx`)
Client-side substring filter over a precomputed haystack of each episode's text fields (replicates AngularJS's default `filter`). Matches are highlighted via `src/lib/highlight.tsx`, which returns React `<mark>` nodes (no `dangerouslySetInnerHTML`).

## Styling

Single global stylesheet `src/index.css`. The 8 brand colors are CSS custom properties in `:root`. BEM class names from the original design are preserved (`.logo`, `.episode-nav__link--previous`, `.song-list__item`, etc.), as are the three responsive breakpoints (1000 / 760 / 480 px). Keep it plain CSS — no preprocessor or CSS-in-JS.

## Deployment env vars

| Variable | Purpose |
|---|---|
| `CLOUDFLARE_ACCOUNT_ID` | Cloudflare account ID (wrangler) |
| `CLOUDFLARE_API_TOKEN` | token with Pages:Edit + R2:Edit |
| `CF_PAGES_PROJECT` | Pages project name (`hotcan`) |
| `R2_BUCKET_NAME` | R2 bucket name (`hotcan-audio`) |

See DEPLOY.md for full first-time setup.
