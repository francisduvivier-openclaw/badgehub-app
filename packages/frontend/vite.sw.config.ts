import { defineConfig } from "vite";
import tsconfigPaths from "vite-tsconfig-paths";
import * as path from "node:path";

// Separate Vite build for the service worker.
// Outputs public/api-sw.js with a stable filename (no hash) so the browser
// can register it at a predictable URL.
export default defineConfig({
  plugins: [tsconfigPaths()],
  publicDir: false, // no static assets to copy for the SW build
  resolve: {
    alias: {
      "@shared": path.resolve(__dirname, "../shared/src"),
    },
  },
  build: {
    outDir: "public",
    emptyOutDir: false, // don't wipe the rest of public/
    rollupOptions: {
      input: { "api-sw": path.resolve(__dirname, "src/api-sw.ts") },
      output: {
        entryFileNames: "[name].js",
        format: "es",
      },
    },
  },
});
