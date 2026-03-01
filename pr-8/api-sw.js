const SW_VERSION = "v2";

let previewData = null;
let previewDataPromise = null;

/** Load preview-data.json, caching in memory and de-duplicating concurrent requests. */
function loadPreviewData() {
  if (previewData) return Promise.resolve(previewData);
  if (!previewDataPromise) {
    previewDataPromise = fetch("preview-data.json")
      .then((r) => r.json())
      .then((data) => {
        previewData = data;
        previewDataPromise = null;
        return data;
      })
      .catch((e) => {
        previewDataPromise = null;
        throw e;
      });
  }
  return previewDataPromise;
}

self.addEventListener("install", (event) => {
  // Pre-load data so it's ready before we start intercepting requests.
  event.waitUntil(
    loadPreviewData()
      .catch((e) => console.warn("[api-sw] Could not pre-load preview-data.json", e))
      .then(() => self.skipWaiting())
  );
});

self.addEventListener("activate", (event) => {
  event.waitUntil(self.clients.claim());
});

function json(data, status = 200) {
  return new Response(JSON.stringify(data), {
    status,
    headers: { "Content-Type": "application/json" },
  });
}

self.addEventListener("fetch", (event) => {
  const url = new URL(event.request.url);
  if (url.origin !== self.location.origin) return;
  const apiPrefixIndex = url.pathname.indexOf("/api/v3/");
  if (apiPrefixIndex === -1) return;

  const path = url.pathname.slice(apiPrefixIndex + "/api/v3".length);

  if (event.request.method === "GET" && path === "/ping") {
    event.respondWith(json("pong"));
    return;
  }

  // All other routes need the preview data. loadPreviewData() will fetch it
  // lazily if the SW process was restarted (module variables reset to null),
  // so the request simply waits rather than getting an immediate 503.
  event.respondWith(
    loadPreviewData()
      .then(({ summaries, stats, badges, categories }) => {
        if (event.request.method === "GET" && path === "/project-summaries") {
          const badge = url.searchParams.get("badge");
          const category = url.searchParams.get("category");
          const userId = url.searchParams.get("userId");
          const search = url.searchParams.get("search")?.toLowerCase();

          let list = summaries.slice();
          if (badge) list = list.filter((p) => p.badges?.includes(badge));
          if (category)
            list = list.filter((p) => p.categories?.includes(category));
          if (userId) list = list.filter((p) => p.idp_user_id === userId);
          if (search) {
            list = list.filter(
              (p) =>
                p.slug.includes(search) ||
                (p.name ?? "").toLowerCase().includes(search) ||
                (p.description ?? "").toLowerCase().includes(search)
            );
          }
          return json(list);
        }

        if (event.request.method === "GET" && path.startsWith("/projects/")) {
          const slug = decodeURIComponent(path.split("/")[2] || "");
          const summary = summaries.find((s) => s.slug === slug);
          if (!summary) {
            return json(
              { reason: `No project with slug '${slug}' found` },
              404
            );
          }
          return json({
            slug: summary.slug,
            idp_user_id: summary.idp_user_id,
            latest_revision: summary.revision,
            created_at: summary.published_at,
            updated_at: summary.published_at,
            version: {
              revision: summary.revision,
              project_slug: summary.slug,
              published_at: summary.published_at,
              files: [],
              app_metadata: {
                name: summary.name,
                description: summary.description,
                categories: summary.categories,
                badges: summary.badges,
                author: summary.idp_user_id,
                license_type: summary.license_type,
              },
            },
          });
        }

        if (event.request.method === "GET" && path === "/badges") {
          return json(badges);
        }

        if (event.request.method === "GET" && path === "/categories") {
          return json(categories);
        }

        if (event.request.method === "GET" && path === "/stats") {
          return json(stats);
        }

        return json(
          { reason: `SW route not implemented (${SW_VERSION}): ${path}` },
          404
        );
      })
      .catch((e) => {
        console.error("[api-sw] Failed to load preview data", e);
        return json({ reason: "Preview data could not be loaded" }, 503);
      })
  );
});
