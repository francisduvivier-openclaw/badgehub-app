const SW_VERSION = "v2";

let previewData = null; // loaded from preview-data.json on install

self.addEventListener("install", (event) => {
  event.waitUntil(
    fetch("preview-data.json")
      .then((r) => r.json())
      .then((data) => {
        previewData = data;
      })
      .catch((e) => {
        console.warn("[api-sw] Could not load preview-data.json", e);
      })
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

  if (!previewData) {
    event.respondWith(
      json({ reason: "Preview data not loaded yet — try refreshing" }, 503)
    );
    return;
  }

  const { summaries, stats, badges, categories } = previewData;

  if (event.request.method === "GET" && path === "/project-summaries") {
    const badge = url.searchParams.get("badge");
    const category = url.searchParams.get("category");
    const userId = url.searchParams.get("userId");
    const search = url.searchParams.get("search")?.toLowerCase();

    let list = summaries.slice();
    if (badge) list = list.filter((p) => p.badges?.includes(badge));
    if (category) list = list.filter((p) => p.categories?.includes(category));
    if (userId) list = list.filter((p) => p.idp_user_id === userId);
    if (search) {
      list = list.filter(
        (p) =>
          p.slug.includes(search) ||
          (p.name ?? "").toLowerCase().includes(search) ||
          (p.description ?? "").toLowerCase().includes(search)
      );
    }

    event.respondWith(json(list));
    return;
  }

  if (event.request.method === "GET" && path.startsWith("/projects/")) {
    const slug = decodeURIComponent(path.split("/")[2] || "");
    const summary = summaries.find((s) => s.slug === slug);
    if (!summary) {
      event.respondWith(
        json({ reason: `No project with slug '${slug}' found` }, 404)
      );
      return;
    }
    event.respondWith(
      json({
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
      })
    );
    return;
  }

  if (event.request.method === "GET" && path === "/badges") {
    event.respondWith(json(badges));
    return;
  }

  if (event.request.method === "GET" && path === "/categories") {
    event.respondWith(json(categories));
    return;
  }

  if (event.request.method === "GET" && path === "/stats") {
    event.respondWith(json(stats));
    return;
  }

  event.respondWith(
    json({ reason: `SW route not implemented (${SW_VERSION}): ${path}` }, 404)
  );
});
