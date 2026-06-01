# Deploying hotcan to Cloudflare Pages

hotcan is deployed as a static site on Cloudflare Pages. Podcast audio files
are hosted separately on Cloudflare R2 object storage — they are too large for
Pages (25MB per file limit) and are not under source control.

---

## How Audio Routing Works

The React app sets audio paths as `/_res/audio/mp3/<file>.mp3`. When a browser
requests one of those URLs, the `_redirects` file (kept in `public/` and emitted
to `dist/` by the Vite build) instructs Cloudflare to issue a `301` redirect to
the matching path on R2. The HTML5 audio player follows the redirect
transparently.

The `_redirects` file also handles SPA routing: any path that doesn't match a
real file is rewritten to `index.html` so React Router can resolve the route
client-side.

The audio files live in the gitignored `audio/` directory at the repo root —
deliberately *outside* `public/`, so they are never copied into the build. A small
Vite plugin (`serveLocalAudio` in `vite.config.ts`) serves them at `/_res/audio/*`
during `npm run dev` and `npm run preview`, with HTTP Range support so the player can
seek. In production those paths 301 to R2 instead. This keeps the Pages deploy tiny;
the audio (too large for Pages' 25MB per-file limit) lives only on R2.

---

## First-Time Setup

### 1. Authenticate Wrangler

```sh
npx wrangler login
```

This opens a browser window to authorize your Cloudflare account.

### 2. Get Your Account ID

1. Log in to https://dash.cloudflare.com
2. On the right sidebar of the home page, copy your **Account ID**.

### 3. Create an API Token

Go to **https://dash.cloudflare.com/profile/api-tokens** → Create Token.

Start from the "Edit Cloudflare Workers" template, then add:
- **Cloudflare Pages:Edit** — Account level
- **R2 Storage:Edit** — Account level

Copy the token value — you'll need it as `CLOUDFLARE_API_TOKEN`.

### 4. Create the Cloudflare Pages Project

```sh
npx wrangler pages project create hotcan
```

When prompted, select **Direct Upload**. Note the project name (e.g. `hotcan`)
— this is your `CF_PAGES_PROJECT`.

### 5. Create the R2 Bucket

```sh
npx wrangler r2 bucket create hotcan-audio
```

### 6. Enable Public Access on the R2 Bucket

1. Go to https://dash.cloudflare.com → **R2** → **hotcan-audio** → **Settings**
2. Under **Public Access**, click **Allow Access**
3. Copy the public URL — it looks like:
   ```
   https://pub-<32-character-hash>.r2.dev
   ```

### 7. Update `public/_redirects` with the Real R2 URL

Edit [`public/_redirects`](public/_redirects) and replace the placeholder on line 1:

```
# Before:
/_res/audio/* https://pub-PLACEHOLDER.r2.dev/_res/audio/:splat 301

# After:
/_res/audio/* https://pub-<your-hash>.r2.dev/_res/audio/:splat 301
```

Commit this change before deploying.

### 8. Upload Audio Files to R2 (One-Time)

Place your audio files at:
- `public/_res/audio/mp3/*.mp3`
- `public/_res/audio/ogg/*.ogg`

Then run:

```sh
export CLOUDFLARE_ACCOUNT_ID=<your-account-id>
export CLOUDFLARE_API_TOKEN=<your-api-token>
export R2_BUCKET_NAME=hotcan-audio

bash scripts/upload-audio-to-r2.sh
```

This is safe to re-run — existing objects are overwritten. You only need to
run it again if audio files change.

---

## Deploying the Site

Set these environment variables (add them to your shell profile to avoid
repeating):

```sh
export CLOUDFLARE_ACCOUNT_ID=<your-account-id>
export CLOUDFLARE_API_TOKEN=<your-api-token>
export CF_PAGES_PROJECT=hotcan
```

Then run:

```sh
bash scripts/deploy.sh
```

The script will:
1. Run `npm install`
2. Run `npm run build` (Vite, outputs to `dist/`)
3. Deploy `dist/` to Cloudflare Pages via `wrangler pages deploy`

---

## Environment Variables Reference

| Variable | Used By | Description |
|---|---|---|
| `CLOUDFLARE_ACCOUNT_ID` | wrangler | Your Cloudflare account ID |
| `CLOUDFLARE_API_TOKEN` | wrangler | API token with Pages:Edit + R2:Edit |
| `CF_PAGES_PROJECT` | `deploy.sh` | Cloudflare Pages project name |
| `R2_BUCKET_NAME` | `upload-audio-to-r2.sh` | R2 bucket name (e.g. `hotcan-audio`) |

---

## dist/ Structure After Build

```
dist/
├── _redirects         (audio → R2 redirect + SPA catch-all, from public/)
├── favicon.ico        (from public/)
├── index.html
├── assets/            (Vite-bundled, content-hashed JS + CSS)
└── _res/
    └── img/           (logos + apple touch icons, from public/)
```

Audio files are **not** in `dist/`. They live in R2 at:
```
https://pub-<hash>.r2.dev/_res/audio/mp3/<filename>.mp3
https://pub-<hash>.r2.dev/_res/audio/ogg/<filename>.ogg
```

---

## Verifying a Deployment

1. Visit the Pages URL (shown in `wrangler pages deploy` output)
2. Navigate to an episode and confirm the audio player loads
3. In browser DevTools → Network tab, audio requests should show a `301`
   redirect to the R2 URL followed by a `200` response from R2
4. Test direct URL navigation (e.g. `/episode/001`) — should load without a 404
