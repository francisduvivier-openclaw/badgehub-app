const SW_VERSION = "v1";
const PREVIEW_CATEGORY = "Default";
const PREVIEW_BADGES = ["why2025", "mch2022"];

const projects = [
  "CodeCraft",
  "PixelPulse",
  "BitBlast",
  "NanoGames",
  "CircuitForge",
  "ByteBash",
  "SparkScript",
  "LogicLand",
].map((name, index) => {
  const slug = name.toLowerCase();
  const badge = PREVIEW_BADGES[index % PREVIEW_BADGES.length];
  const publishedAt = new Date(Date.now() - index * 86_400_000).toISOString();
  return {
    slug,
    idp_user_id: "preview-user",
    name,
    description: `Preview app ${slug}`,
    categories: [PREVIEW_CATEGORY],
    badges: [badge],
    revision: 1,
    published_at: publishedAt,
    installs: 0,
    license_type: undefined,
  };
});

self.addEventListener("install", (event) => {
  event.waitUntil(self.skipWaiting());
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

  if (event.request.method === "GET" && path === "/project-summaries") {
    const badge = url.searchParams.get("badge");
    const category = url.searchParams.get("category");
    const userId = url.searchParams.get("userId");
    const search = url.searchParams.get("search")?.toLowerCase();

    let list = projects.slice();
    if (badge) list = list.filter((p) => p.badges.includes(badge));
    if (category) list = list.filter((p) => p.categories.includes(category));
    if (userId) list = list.filter((p) => p.idp_user_id === userId);
    if (search) {
      list = list.filter(
        (p) =>
          p.slug.includes(search) ||
          p.name.toLowerCase().includes(search) ||
          p.description.toLowerCase().includes(search),
      );
    }

    event.respondWith(json(list));
    return;
  }

  if (event.request.method === "GET" && path.startsWith("/projects/")) {
    const slug = decodeURIComponent(path.split("/")[2] || "");
    const p = projects.find((x) => x.slug === slug);
    if (!p) {
      event.respondWith(json({ reason: `No project with slug '${slug}' found` }, 404));
      return;
    }
    event.respondWith(
      json({
        slug: p.slug,
        idp_user_id: p.idp_user_id,
        latest_revision: 1,
        created_at: p.published_at,
        updated_at: p.published_at,
        version: {
          revision: 1,
          project_slug: p.slug,
          published_at: p.published_at,
          files: [],
          app_metadata: {
            name: p.name,
            description: p.description,
            categories: p.categories,
            badges: p.badges,
            author: "preview-user",
          },
        },
      }),
    );
    return;
  }

  if (event.request.method === "GET" && path === "/badges") {
    event.respondWith(json(PREVIEW_BADGES));
    return;
  }

  if (event.request.method === "GET" && path === "/categories") {
    event.respondWith(json([PREVIEW_CATEGORY]));
    return;
  }

  if (event.request.method === "GET" && path === "/ping") {
    event.respondWith(json("pong"));
    return;
  }

  if (event.request.method === "GET" && path === "/stats") {
    event.respondWith(
      json({
        projects: projects.length,
        installs: 0,
        crashes: 0,
        launches: 0,
        installed_projects: 0,
        launched_projects: 0,
        crashed_projects: 0,
        authors: 1,
        badges: PREVIEW_BADGES.length,
      }),
    );
    return;
  }

  event.respondWith(json({ reason: `SW route not implemented (${SW_VERSION}): ${path}` }, 404));
});
