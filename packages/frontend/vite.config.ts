import tailwindcss from "@tailwindcss/vite";
import react from "@vitejs/plugin-react";
import { defineConfig } from "vite";

const publicStaticFileDir = "static";

// https://vite.dev/config/
export default defineConfig({
  server: {
    host: true, // bind to all interfaces so remote machines can reach it
    port: 5173, // fixed port so index-indirect-dev.html can reference it
    cors: true, // allow the backend origin to load Vite assets
    allowedHosts: true, // allow any Host header (e.g. op5b.local)
  },
  // Use tsconfig "paths" (@*, @shared/*) natively — no vite-tsconfig-paths needed
  resolve: {
    tsconfigPaths: true,
  },
  plugins: [tailwindcss(), ...react()],
  build: {
    rollupOptions: {
      output: {
        entryFileNames: `${publicStaticFileDir}/entry_[name]-[hash].js`,
        chunkFileNames: `${publicStaticFileDir}/chunks/[name]-[hash].js`,
        assetFileNames: `${publicStaticFileDir}/assets/[name]-[hash].[ext]`,
        manualChunks: (id) => {
          if (id.includes("node_modules/@zip.js")) {
            return "zip";
          }
          if (id.includes("node_modules")) {
            return "vendor";
          }
          return null;
        },
      },
    },
  },
});
