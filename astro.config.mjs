// @ts-check
import { defineConfig } from "astro/config";

// Static output: every route is prerendered to HTML at build time and served
// from Cloudflare Workers Static Assets (see wrangler.jsonc). No client
// framework ships; the few interactive pieces are small vanilla TS modules.
export default defineConfig({
  // Canonical origin for URLs, sitemap, and social cards. Override with SITE_URL.
  site: process.env.SITE_URL || "https://kunalgoenka.com",
  output: "static",
  trailingSlash: "ignore",
  build: { format: "directory", inlineStylesheets: "always" },
  prefetch: { prefetchAll: true, defaultStrategy: "hover" },
  devToolbar: { enabled: false }
});
