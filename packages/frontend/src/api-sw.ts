/// <reference lib="webworker" />
declare const self: ServiceWorkerGlobalScope;
export {}; // make this file a module

import initSqlJs from "sql.js";
import { SqlJsAdapter } from "@db/SqlJsAdapter";
import { SQLiteBadgeHubMetadata } from "@shared/db/SQLiteBadgeHubMetadata";
import { PreviewBadgeHubData } from "@api/PreviewBadgeHubData";
import {
  pingHandler,
  getBadgesHandler,
  getCategoriesHandler,
  getStatsHandler,
  getProjectSummariesHandler,
  getProjectHandler,
} from "@shared/api/backendCoreHandlers";
import {
  badgeIdentifiersSchema,
  getProjectsQuerySchema,
} from "@shared/contracts/publicRestContracts";

const API_PREFIX = "/api/v3";

let backend: PreviewBadgeHubData | null = null;
let backendPromise: Promise<PreviewBadgeHubData> | null = null;

function fileUrl(slug: string, revision: number | string, filePath: string): string {
  return `/api/v3/projects/${encodeURIComponent(slug)}/versions/${revision}/files/${filePath}`;
}

/** Loads the SQLite database via sql.js, caching in memory and de-duplicating concurrent requests. */
function loadBackend(): Promise<PreviewBadgeHubData> {
  if (backend) return Promise.resolve(backend);
  if (!backendPromise) {
    backendPromise = Promise.all([
      initSqlJs({ locateFile: (file) => new URL(file, self.location.href).href }),
      fetch(new URL("preview-data.sqlite", self.location.href)).then((r) =>
        r.arrayBuffer()
      ),
    ])
      .then(([SQL, buffer]) => {
        const db = new SQL.Database(new Uint8Array(buffer));
        const adapter = new SqlJsAdapter(db);
        const metadata = new SQLiteBadgeHubMetadata(adapter, fileUrl);
        backend = new PreviewBadgeHubData(metadata);
        backendPromise = null;
        return backend;
      })
      .catch((e) => {
        backendPromise = null;
        throw e;
      });
  }
  return backendPromise;
}

function json(data: unknown, status = 200): Response {
  return new Response(JSON.stringify(data), {
    status,
    headers: { "Content-Type": "application/json" },
  });
}

self.addEventListener("install", (event) => {
  // Pre-load the SQLite database so it's ready before we start intercepting requests.
  event.waitUntil(
    loadBackend()
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
  const idx = url.pathname.indexOf(API_PREFIX + "/");
  if (idx === -1) return;
  if (event.request.method !== "GET") return;

  const path = url.pathname.slice(idx + API_PREFIX.length);
  const params = Object.fromEntries(url.searchParams);

  event.respondWith(
    loadBackend()
      .then(async (be): Promise<Response> => {
        if (path === "/ping") {
          const { id, mac } = badgeIdentifiersSchema.parse(params);
          const result = await pingHandler(be, id, mac);
          return json(result.body, result.status);
        }

        if (path === "/project-summaries") {
          const query = getProjectsQuerySchema.parse(params);
          const result = await getProjectSummariesHandler(be, query);
          return json(result.body, result.status);
        }

        if (path.startsWith("/projects/")) {
          const slug = decodeURIComponent(path.slice("/projects/".length));
          const result = await getProjectHandler(be, slug);
          return json(result.body, result.status);
        }

        if (path === "/badges") {
          const result = await getBadgesHandler(be);
          return json(result.body, result.status);
        }

        if (path === "/categories") {
          const result = await getCategoriesHandler(be);
          return json(result.body, result.status);
        }

        if (path === "/stats") {
          const result = await getStatsHandler(be);
          return json(result.body, result.status);
        }

        return json({ reason: `SW route not implemented: ${path}` }, 404);
      })
      .catch((e) => {
        console.error("[api-sw] error", e);
        return json({ reason: "Preview data could not be loaded" }, 503);
      })
  );
});
