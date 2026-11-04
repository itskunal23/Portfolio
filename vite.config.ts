import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import unocss from "unocss/vite";
import autoImport from "unplugin-auto-import/vite";
import path from "path";

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    unocss(),
    react(),
    autoImport({
      imports: ["react"],
      dts: "src/auto-imports.d.ts",
      dirs: ["src/hooks", "src/stores", "src/components/**"]
    })
  ],
  resolve: {
    alias: {
      "~/": `${path.resolve(__dirname, "src")}/`
    }
  },
  // Dev-server performance.
  //
  // The app windows (Bear, Typora, VSCode, ...) are lazy-loaded, so Vite's
  // startup scan doesn't see their dependencies. Without this list, opening
  // an app for the first time makes Vite discover new deps, re-optimize, and
  // force a full page reload. Pre-declaring them bundles everything once.
  optimizeDeps: {
    include: [
      "react",
      "react-dom",
      "react-dom/client",
      "zustand",
      "zustand/react/shallow",
      "framer-motion",
      "date-fns",
      "react-rnd",
      "react-rangeslider",
      "@rooks/use-raf",
      "react-markdown",
      "remark-gfm",
      "remark-math",
      "rehype-katex",
      "rehype-external-links",
      "react-syntax-highlighter",
      "@milkdown/core",
      "@milkdown/react",
      "@milkdown/preset-commonmark",
      "@milkdown/preset-gfm",
      "@milkdown/plugin-history",
      "@milkdown/plugin-listener"
    ]
  },
  server: {
    // Pre-transform the entry and first screens while the server boots so the
    // first browser request doesn't wait on a cold transform waterfall.
    warmup: {
      clientFiles: ["./src/index.tsx", "./src/pages/*.tsx"]
    }
  },
  build: {
    // vendor-highlighter (react-syntax-highlighter + its language grammars)
    // is legitimately ~630 kB and isolated into its own cacheable chunk, so
    // raise the warning threshold rather than emit a false alarm on it.
    chunkSizeWarningLimit: 700,
    rollupOptions: {
      output: {
        // Split large, independent libraries into their own chunks so the
        // main bundle stays small and these heavy deps can be cached
        // separately (and loaded only by the apps that use them).
        //
        // We use the function form of manualChunks and match against each
        // module's resolved path. Under pnpm this is more robust than the
        // object/string form: the string form asks Rollup to resolve bare
        // package names as entry ids, which fails for transitive,
        // non-hoisted deps (e.g. highlight.js / lowlight pulled in by
        // react-syntax-highlighter live only inside the pnpm store, not at
        // the project root). Path matching avoids that resolution entirely.
        manualChunks(id) {
          if (!id.includes("node_modules")) return;

          const inPkg = (name: string) =>
            id.includes(`/node_modules/${name}/`) ||
            id.includes(`/node_modules/.pnpm/${name}@`) ||
            id.includes(`\\node_modules\\${name}\\`) ||
            id.includes(`\\node_modules\\.pnpm\\${name}@`);

          if (inPkg("react") || inPkg("react-dom") || inPkg("scheduler"))
            return "vendor-react";

          if (
            inPkg("react-markdown") ||
            inPkg("remark-gfm") ||
            inPkg("remark-math") ||
            inPkg("rehype-katex") ||
            inPkg("rehype-external-links")
          )
            return "vendor-markdown";

          if (inPkg("katex")) return "vendor-katex";

          // react-syntax-highlighter and the grammar packs it pulls in
          // (highlight.js, lowlight, refractor, prismjs) are the heaviest
          // group; isolate them into their own cacheable chunk.
          if (
            inPkg("react-syntax-highlighter") ||
            inPkg("highlight.js") ||
            inPkg("lowlight") ||
            inPkg("refractor") ||
            inPkg("prismjs")
          )
            return "vendor-highlighter";

          if (id.includes("@milkdown")) return "vendor-milkdown";

          if (inPkg("framer-motion")) return "vendor-motion";
        }
      }
    }
  }
});
