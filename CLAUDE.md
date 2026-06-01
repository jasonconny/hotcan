# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

```sh
# Install dependencies
npm install

# Build for production (outputs to dist/)
npx gulp build:prod

# Development with browser-sync (proxies hotcan.dev)
npx gulp watch

# Deploy to Cloudflare Pages
bash scripts/deploy.sh

# Upload audio files to R2 (one-time or after audio changes)
export CLOUDFLARE_ACCOUNT_ID=<id>
export CLOUDFLARE_API_TOKEN=<token>
export R2_BUCKET_NAME=hotcan-audio
bash scripts/upload-audio-to-r2.sh
```

There are no tests.

## Architecture

This is a **Gulp 3 + AngularJS 1.x SPA** deployed as a static site on **Cloudflare Pages**. Audio files (100 episodes, MP3 + OGG) are too large for Pages and are hosted separately on **Cloudflare R2**.

### Key files

- `src/_res/js/app.js` — the entire frontend: AngularJS module, all routes (ui-router), controllers (`MainController`, `EpisodeController`, `AllEpisodesController`), services (`EpisodeService`, `UtilityService`), and filters. This is the only JS file compiled into `dist/`.
- `src/_res/json/hotcan.json` — episode data loaded at runtime via `$http`. The JSON structure drives all episode pages.
- `src/_res/sass/main.scss` — compiled and minified into `dist/_res/css/main.min.<version>.css`.
- `src/_redirects` — two rules: (1) redirect `/_res/audio/*` to the R2 public URL with a 301; (2) SPA catch-all rewrites `/*` to `index.html`.
- `gulpfile.js` — build pipeline: `clean:dist` → `copy:res` (copies non-audio/css/js assets) → `sass:prod` + `uglify:js` → `build:index` (injects versioned CSS/JS filenames into `index.html`).

### Audio routing

Audio files are referenced in `app.js` as `/_res/audio/mp3/<file>.mp3`. The browser follows a 301 redirect (defined in `src/_redirects`) to the R2 public URL. Audio files in `src/_res/audio/` are **not** included in `dist/` — the gulpfile explicitly excludes them in the `copy:res` task.

### Versioning

CSS and JS assets are named with the `package.json` version (e.g., `app.min.1.1.1.js`). The `build:index` task injects these versioned paths into `index.html` using `gulp-inject`.

### Legacy URL redirects

`app.js` contains explicit `$urlRouterProvider.when()` rules for old WordPress-style URLs (e.g., `/podcast/the-hot-can-all-vinyl-power-hour-episode-1`) that redirect to the current AngularJS route format (`/beginnings`). A general regex rule handles the rest of the legacy pattern.

## Deployment environment variables

| Variable | Purpose |
|---|---|
| `CLOUDFLARE_ACCOUNT_ID` | Cloudflare account ID (used by wrangler) |
| `CLOUDFLARE_API_TOKEN` | API token with Pages:Edit + R2:Edit permissions |
| `CF_PAGES_PROJECT` | Cloudflare Pages project name (`hotcan`) |
| `R2_BUCKET_NAME` | R2 bucket name (`hotcan-audio`) |
