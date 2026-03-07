import { defineConfig } from "vite";
import tsconfigPaths from "vite-tsconfig-paths";
import * as path from "node:path";

function buildSharedConfigBanner() {
  const keycloakBaseUrl =
    process.env.VITE_KEYCLOAK_BASE_URL ?? "https://auth.example.invalid";
  const keycloakRealm = process.env.VITE_KEYCLOAK_REALM ?? "master";
  const config = {
    BADGE_SLUGS: (
      process.env.VITE_BADGE_SLUGS ?? "why2025,troopers23,mch2022"
    ).split(","),
    CATEGORY_NAMES: (
      process.env.VITE_CATEGORY_NAMES ??
      "Uncategorised,Event related,Games,Graphics,Hardware,Utility,Wearable,Data,Silly,Hacking,Troll,Unusable,Adult,Virus,SAO,Interpreter"
    ).split(","),
    ADMIN_CATEGORY_NAMES: (
      process.env.VITE_ADMIN_CATEGORY_NAMES ?? "Default"
    ).split(","),
    BADGEHUB_API_BASE_URL:
      process.env.VITE_BADGEHUB_API_BASE_URL ?? "https://api.example.invalid",
    keycloakPublic: {
      KEYCLOAK_BASE_URL: keycloakBaseUrl,
      KEYCLOAK_REALM: keycloakRealm,
      KEYCLOAK_CLIENT_ID:
        process.env.VITE_KEYCLOAK_CLIENT_ID ?? "badgehub-frontend",
    },
    isDevEnvironment: process.env.NODE_ENV === "development",
  };
  return `globalThis.__SHARED_CONFIG__ = ${JSON.stringify(config)};`;
}

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
    minify: false,
    outDir: "public",
    emptyOutDir: false, // don't wipe the rest of public/
    rollupOptions: {
      input: { "api-sw": path.resolve(__dirname, "src/api-sw.ts") },
      output: {
        entryFileNames: "[name].js",
        format: "es",
        banner: buildSharedConfigBanner(),
      },
    },
  },
});
