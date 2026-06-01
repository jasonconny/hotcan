import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// hotcan is a static SPA deployed to Cloudflare Pages.
// - publicDir (public/) holds _redirects, favicon, and image assets copied verbatim.
// - outDir 'dist' matches the existing Cloudflare Pages deploy target.
export default defineConfig({
  plugins: [react()],
  build: {
    outDir: 'dist',
  },
});
