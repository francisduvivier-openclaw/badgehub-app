/// <reference lib="webworker" />
declare const self: ServiceWorkerGlobalScope;
export {}; // make this file a module

import initSqlJs from "sql.js";
import { SqlJsAdapter } from "@db/SqlJsAdapter";
import { SQLiteBadgeHubMetadata } from "@shared/db/SQLiteBadgeHubMetadata";
import { PreviewBadgeHubData } from "@api/PreviewBadgeHubData";
import { createPublicApiRouter } from "@shared/api/honoRouter";
import type { Hono } from "hono";

const API_PREFIX = "/api/v3";

/**
 * Bump this number whenever preview-data.sqlite is regenerated (schema
 * changes, new fixture data, etc.).  Clients whose cached version does not
 * match will discard the old IndexedDB entry, re-download the file, and store
 * the new bytes under the updated version.
 */
const PREVIEW_DATA_VERSION = 3;

const IDB_NAME = "badgehub-preview";
const IDB_STORE = "sqlite-cache";
const IDB_KEY = "preview-data";

function openIdb(): Promise<IDBDatabase> {
  return new Promise((resolve, reject) => {
    const req = indexedDB.open(IDB_NAME, 1);
    req.onupgradeneeded = () => {
      req.result.createObjectStore(IDB_STORE);
    };
    req.onsuccess = () => resolve(req.result);
    req.onerror = () => reject(req.error);
  });
}

async function loadFromIdb(): Promise<Uint8Array | null> {
  try {
    const db = await openIdb();
    return await new Promise<Uint8Array | null>((resolve, reject) => {
      const tx = db.transaction(IDB_STORE, "readonly");
      const req = tx.objectStore(IDB_STORE).get(IDB_KEY);
      req.onsuccess = () => {
        const cached = req.result as
          | { version: number; data: Uint8Array }
          | undefined;
        resolve(cached?.version === PREVIEW_DATA_VERSION ? cached.data : null);
      };
      req.onerror = () => reject(req.error);
      tx.oncomplete = () => db.close();
    });
  } catch (e) {
    console.warn("[api-sw] Could not read from IndexedDB", e);
    return null;
  }
}

async function saveToIdb(data: Uint8Array): Promise<void> {
  try {
    const db = await openIdb();
    await new Promise<void>((resolve, reject) => {
      const tx = db.transaction(IDB_STORE, "readwrite");
      tx.objectStore(IDB_STORE).put({ version: PREVIEW_DATA_VERSION, data }, IDB_KEY);
      tx.oncomplete = () => {
        db.close();
        resolve();
      };
      tx.onerror = () => reject(tx.error);
    });
  } catch (e) {
    console.warn("[api-sw] Could not save to IndexedDB", e);
  }
}

let honoApp: Hono | null = null;
let appPromise: Promise<Hono> | null = null;

function fileUrl(slug: string, revision: number | string, filePath: string): string {
  // Segment must match the Hono routes: "rev<N>" for numbered revisions,
  // or the alias as-is ("latest" / "draft") for the /latest/files/* route.
  const revSegment = typeof revision === "number" ? `rev${revision}` : revision;
  return `/api/v3/projects/${encodeURIComponent(slug)}/${revSegment}/files/${filePath}`;
}

/**
 * Loads the SQLite database and initialises the shared Hono public router.
 * On first load the bytes are fetched from the network and persisted in
 * IndexedDB.  Subsequent loads (same PREVIEW_DATA_VERSION) are served from
 * the cache, avoiding the network round-trip.
 */
function loadApp(): Promise<Hono> {
  if (honoApp) return Promise.resolve(honoApp);
  if (!appPromise) {
    appPromise = Promise.all([
      initSqlJs({ locateFile: (file) => new URL(file, self.location.href).href }),
      loadFromIdb().then(async (cached) => {
        if (cached) return cached;
        const buffer = await fetch(
          new URL("preview-data.sqlite", self.location.href)
        ).then((r) => r.arrayBuffer());
        const bytes = new Uint8Array(buffer);
        saveToIdb(bytes); // fire-and-forget; errors are logged inside saveToIdb
        return bytes;
      }),
    ])
      .then(([SQL, bytes]) => {
        const db = new SQL.Database(bytes);
        const adapter = new SqlJsAdapter(db);
        const metadata = new SQLiteBadgeHubMetadata(adapter, fileUrl);
        const backend = new PreviewBadgeHubData(metadata);
        honoApp = createPublicApiRouter(backend);
        appPromise = null;
        return honoApp;
      })
      .catch((e) => {
        appPromise = null;
        throw e;
      });
  }
  return appPromise;
}

self.addEventListener("install", (event) => {
  // Pre-load the SQLite database so it's ready before we start intercepting requests.
  event.waitUntil(
    loadApp()
      .catch((e) =>
        console.warn("[api-sw] Could not pre-load preview-data.sqlite", e)
      )
      .then(() => self.skipWaiting())
  );
});

self.addEventListener("activate", (event) => {
  event.waitUntil(self.clients.claim());
});

self.addEventListener("fetch", (event) => {
  const url = new URL(event.request.url);
  if (url.origin !== self.location.origin) return;

  // Only intercept /api/v3/ requests on this origin.
  const apiIndex = url.pathname.indexOf(API_PREFIX + "/");
  if (apiIndex === -1) return;

  // Only intercept GET requests (POST report routes are no-ops in preview anyway).
  if (event.request.method !== "GET") return;

  // Normalise the URL: strip the GitHub Pages base path prefix so Hono sees
  // exactly /api/v3/... regardless of deployment sub-path.
  const apiPath = url.pathname.slice(apiIndex);
  const normalizedUrl = new URL(apiPath + url.search, "https://localhost");
  const normalizedRequest = new Request(normalizedUrl.toString(), event.request);

  event.respondWith(
    loadApp()
      .then((app) => app.fetch(normalizedRequest))
      .catch((e) => {
        console.error("[api-sw] error", e);
        return new Response(
          JSON.stringify({ reason: "Preview data could not be loaded" }),
          { status: 503, headers: { "Content-Type": "application/json" } },
        );
      })
  );
});
