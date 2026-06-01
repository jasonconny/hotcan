# Local QA checklist

Run through this before deploying to Cloudflare. The goal is to catch anything broken
**locally** — the only things that genuinely can't be verified until production are the R2
audio 301 redirect and the Pages SPA fallback (both live in `public/_redirects`).

## 0. Setup

```sh
nvm use            # 26.3.0 (from .nvmrc)
npm install
npm run dev        # http://localhost:5173
```

Keep the browser devtools **Console** and **Network** tabs open throughout — there should
be no red errors or failed requests on any page.

## 1. Build gate (run before everything else)

```sh
npm run build      # must pass: tsc -b type-check + vite build, no errors
```

- [ ] Build completes with no TypeScript or Vite errors
- [ ] `dist/` contains `index.html`, `_redirects`, `favicon.ico`, `assets/` (hashed JS+CSS), `_res/img/`
- [ ] `dist/` does **NOT** contain `_res/audio` → `test ! -d dist/_res/audio && echo OK`
- [ ] `dist/` is small (well under ~1 MB; it was ~708 KB)

```sh
npm run preview    # serves the real build at http://localhost:4173
```

Do a second pass of the route/feature checks below against **preview** too — it's the
closest thing to production (and it also serves local audio via the Vite plugin).

## 2. Routing

- [ ] `/` redirects to `/beginnings`
- [ ] `/all` loads the episode list
- [ ] `/about`, `/contact`, `/for-content-owners`, `/uhoh` all render
- [ ] A known episode loads: `/cold-duck-time`
- [ ] An unknown slug shows the "Uh Oh!" page: `/this-does-not-exist`
- [ ] **Deep-link reload**: navigate to `/all`, then reload the page — it still loads (SPA fallback)
- [ ] Browser **back/forward** buttons work across several navigations
- [ ] Page **scrolls to top** when navigating to a new route
- [ ] Each page's **browser tab title** updates (e.g. "Episode 35: Cold Duck Time | The Hot Can…")

### Legacy WordPress redirects

- [ ] `/category/podcast` → `/all`
- [ ] `/podcast/the-hot-can-all-vinyl-power-hour-episode-1` → `/beginnings`
- [ ] `/podcast/the-hot-can-all-vinyl-power-hour-episode-35-cold-duck-time` → `/cold-duck-time`
- [ ] `/podcast/the-hot-can-all-vinyl-power-hour-episode-100--never-ending-melody` → `/never-ending-melody`

## 3. Episode page (`/cold-duck-time` or any episode)

- [ ] Heading reads: `The Hot Can All Vinyl Power Hour, episode N: "Title"`
- [ ] Posted date renders in long form (e.g. "May 8, 2012")
- [ ] **Audio player** appears and **plays**
- [ ] **Seeking** works — drag the scrubber to the middle and it resumes there (this exercises HTTP Range)
- [ ] **Download link** ("download this episode") opens/downloads the MP3
- [ ] Intro row shows artist, title, album, label, year
- [ ] Songs list: album is a **link** when there's an album URL, plain italic text when there isn't
- [ ] **Prev/next arrows** (left/right edges) go to the correct adjacent episodes
- [ ] On episode **1**, the previous arrow is hidden; on episode **100**, the next arrow is hidden

## 4. All Episodes + search (`/all`)

- [ ] All **100** episodes are listed, each title links to its episode
- [ ] Default view shows the intro + song titles per episode
- [ ] Typing filters the list **live**
- [ ] Result count shows "showing X of Y episodes"
- [ ] A nonsense term shows `"<term>" produced no results`
- [ ] Matches are **highlighted** in the results
- [ ] Search matches across fields — try an **artist**, an **album**, a **label**, and a **year** (e.g. `1972`)
- [ ] Clearing the search box restores the full list

## 5. Audio specifics (the local-serving path)

- [ ] In **dev and preview**, audio loads from `/_res/audio/mp3/...` (check the Network tab — `206 Partial Content` on seek)
- [ ] Spot-check a couple of different episodes' audio, not just episode 1
- [ ] Quick header check (optional):
  ```sh
  curl -s -o /dev/null -D - -H 'Range: bytes=0-99' \
    "http://localhost:5173/_res/audio/mp3/episode_001_Beginnings.mp3" \
    | grep -iE 'HTTP/|content-range'
  # expect: HTTP/1.1 206 Partial Content + Content-Range: bytes 0-99/...
  ```

## 6. Design / responsive

- [ ] Purple theme, fixed circular **logo** (top-left), floating circular **nav arrows**
- [ ] Resize the window through the three breakpoints — **1000px**, **760px**, **480px** — layout stays sane
- [ ] At ≤760px the search row stacks (becomes block layout)
- [ ] (If possible) compare side-by-side with the live site to confirm the look matches

## 7. Accessibility (quick pass)

- [ ] **Keyboard only**: Tab reaches the nav links, search input, audio controls, and prev/next; focus is visible
- [ ] Prev/next arrow links announce a real label (inspect: `aria-label="Previous Episode: …"`)
- [ ] Search input has an associated label (inspect: `<label for="episode-search">`)
- [ ] `<html lang="en">` is present
- [ ] (Optional) Run Lighthouse or axe DevTools on an episode page and the `/all` page

## 8. Cross-browser

- [ ] **Chrome** — full pass
- [ ] **Safari** — plays audio (uses the MP3 source; Safari doesn't support OGG)
- [ ] **Firefox** — plays audio (may use the OGG source)

## 9. Pre-deploy Cloudflare sanity

These protect the production deploy specifically:

- [ ] `public/_redirects` line 1 points at your **real** R2 public URL (no `PLACEHOLDER`), and the
      `/* /index.html 200` SPA fallback line is present
- [ ] R2 already has the audio uploaded, **or** plan to run `bash scripts/upload-audio-to-r2.sh`
      (only needed if audio changed)
- [ ] Confirm again that `dist/_res/audio` does not exist (step 1) — audio must stay R2-only

> Note: the audio **301 → R2** and the Pages SPA fallback come from `public/_redirects`, which
> the local dev/preview servers do not execute. They can only be verified on the deployed
> site — see DEPLOY.md → "Verifying a Deployment".

## 10. Deploy

```sh
export CLOUDFLARE_ACCOUNT_ID=...
export CLOUDFLARE_API_TOKEN=...
export CF_PAGES_PROJECT=hotcan
bash scripts/deploy.sh
```

Then on the deployed URL: load an episode, confirm audio plays via a `301` to R2 in the
Network tab, and reload a deep link (e.g. `/all`) to confirm the SPA fallback works.
