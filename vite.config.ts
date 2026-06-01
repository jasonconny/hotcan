import { createReadStream, statSync } from 'node:fs';
import { join, normalize } from 'node:path';
import { defineConfig, type Connect, type Plugin } from 'vite';
import react from '@vitejs/plugin-react';

// Podcast audio (~24GB) lives in ./audio, deliberately OUTSIDE public/ so it is never
// copied into the production build — it is served from Cloudflare R2 in production via the
// _redirects 301 rule. This plugin serves those files from the local ./audio directory at
// /_res/audio/* during `vite dev` and `vite preview`, with HTTP Range support so the audio
// player can seek.
function serveLocalAudio(): Plugin {
  const audioRoot = join(import.meta.dirname, 'audio');
  const PREFIX = '/_res/audio/';

  const middleware: Connect.NextHandleFunction = (req, res, next) => {
    const url = req.url ?? '';
    if (!url.startsWith(PREFIX)) return next();

    const rel = normalize(decodeURIComponent(url.slice(PREFIX.length).split('?')[0]));
    const filePath = join(audioRoot, rel);
    // Guard against path traversal outside the audio root.
    if (!filePath.startsWith(audioRoot)) {
      res.statusCode = 403;
      return res.end();
    }

    let size: number;
    try {
      const stat = statSync(filePath);
      if (!stat.isFile()) return next();
      size = stat.size;
    } catch {
      return next();
    }

    const type = filePath.endsWith('.ogg') ? 'audio/ogg' : 'audio/mpeg';
    res.setHeader('Content-Type', type);
    res.setHeader('Accept-Ranges', 'bytes');

    const match = /bytes=(\d*)-(\d*)/.exec(req.headers.range ?? '');
    if (match) {
      let start = match[1] ? parseInt(match[1], 10) : 0;
      let end = match[2] ? parseInt(match[2], 10) : size - 1;
      if (Number.isNaN(start)) start = 0;
      if (Number.isNaN(end) || end >= size) end = size - 1;
      if (start > end) {
        res.statusCode = 416;
        res.setHeader('Content-Range', `bytes */${size}`);
        return res.end();
      }
      res.statusCode = 206;
      res.setHeader('Content-Range', `bytes ${start}-${end}/${size}`);
      res.setHeader('Content-Length', end - start + 1);
      createReadStream(filePath, { start, end }).pipe(res);
    } else {
      res.statusCode = 200;
      res.setHeader('Content-Length', size);
      createReadStream(filePath).pipe(res);
    }
  };

  return {
    name: 'serve-local-audio',
    configureServer(server) {
      server.middlewares.use(middleware);
    },
    configurePreviewServer(server) {
      server.middlewares.use(middleware);
    },
  };
}

// hotcan is a static SPA deployed to Cloudflare Pages.
// - publicDir (public/) holds _redirects, favicon, and image assets copied verbatim.
// - outDir 'dist' matches the existing Cloudflare Pages deploy target.
export default defineConfig({
  plugins: [react(), serveLocalAudio()],
  build: {
    outDir: 'dist',
  },
});
