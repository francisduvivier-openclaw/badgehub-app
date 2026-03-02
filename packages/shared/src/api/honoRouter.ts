import { Hono } from "hono";
import type { BackendDataAccess } from "@shared/api/backendCoreHandlers";

/**
 * Creates a Hono app with all public /api/v3 routes wired to the given
 * BackendDataAccess implementation.  Used in both the Node.js backend and the
 * browser service worker (via PreviewBadgeHubData) so that route definitions
 * are maintained in exactly one place.
 */
export function createPublicApiRouter(data: BackendDataAccess): Hono {
  const app = new Hono();

  app.get("/api/v3/badges", async (c) => {
    return c.json(await data.getBadges());
  });

  app.get("/api/v3/categories", async (c) => {
    return c.json(await data.getCategories());
  });

  app.get("/api/v3/ping", async (c) => {
    const id = c.req.query("id");
    const mac = c.req.query("mac");
    if (id) await data.registerBadge(id, mac);
    return c.json("pong");
  });

  app.get("/api/v3/stats", async (c) => {
    return c.json(await data.getStats());
  });

  app.get("/api/v3/project-summaries", async (c) => {
    const q = c.req.query();
    const slugs = q.slugs ? q.slugs.split(",") : [];
    const summaries = await data.getProjectSummaries(
      {
        slugs,
        pageStart: q.pageStart ? Number(q.pageStart) : undefined,
        pageLength: q.pageLength ? Number(q.pageLength) : undefined,
        badge: q.badge || undefined,
        category: q.category || undefined,
        search: q.search || undefined,
        userId: q.userId || undefined,
        orderBy: q.orderBy === "installs" ? "installs" : "published_at",
      },
      "latest",
    );
    return c.json(summaries);
  });

  app.get("/api/v3/project-latest-revisions", async (c) => {
    const slugs = c.req.query("slugs")?.split(",");
    const summaries = await data.getProjectSummaries(
      { slugs, orderBy: "published_at" },
      "latest",
    );
    c.header("Cache-Control", "max-age=10");
    return c.json(summaries.map((p) => ({ slug: p.slug, revision: p.revision })));
  });

  app.get("/api/v3/project-latest-revisions/:slug", async (c) => {
    const slug = c.req.param("slug");
    const project = await data.getProject(slug, "latest");
    if (project?.latest_revision == undefined) {
      return c.json(
        { reason: `No published app with slug '${slug}' found` },
        404,
      );
    }
    c.header("Cache-Control", "max-age=10");
    return c.json(project.latest_revision);
  });

  // File download – latest revision.  The wildcard captures paths with slashes.
  app.get("/api/v3/projects/:slug/latest/files/*", async (c) => {
    const slug = c.req.param("slug");
    const prefix = `/api/v3/projects/${slug}/latest/files/`;
    const filePath = decodeURIComponent(c.req.path.slice(prefix.length));
    const file = await data.getFileContents(slug, "latest", filePath);
    if (!file) {
      return c.json({ reason: `No app with slug '${slug}' found` }, 404);
    }
    c.header("Content-Disposition", `attachment; filename="${filePath}"`);
    return c.body(file);
  });

  // File download – specific revision.  :rev captures the whole "revN" segment.
  app.get("/api/v3/projects/:slug/:rev{rev[0-9]+}/files/*", async (c) => {
    const slug = c.req.param("slug");
    const rev = c.req.param("rev");
    const revision = Number(rev.slice(3));
    const prefix = `/api/v3/projects/${slug}/${rev}/files/`;
    const filePath = decodeURIComponent(c.req.path.slice(prefix.length));
    const file = await data.getFileContents(slug, revision, filePath);
    if (!file) {
      return c.json(
        { reason: `No app with slug '${slug}' and revision '${revision}' found` },
        404,
      );
    }
    c.header("Content-Disposition", `attachment; filename="${filePath}"`);
    c.header("Cache-Control", "public, max-age=31536000, immutable");
    return c.body(file);
  });

  // Project by specific revision.
  app.get("/api/v3/projects/:slug/:rev{rev[0-9]+}", async (c) => {
    const slug = c.req.param("slug");
    const revision = Number(c.req.param("rev").slice(3));
    const details = await data.getProject(slug, revision);
    if (!details) {
      return c.json(
        { reason: `No public app with slug [${slug}] and revision [${revision}] found` },
        404,
      );
    }
    c.header("Cache-Control", "public, max-age=31536000, immutable");
    return c.json(details);
  });

  // Project – latest published revision.
  app.get("/api/v3/projects/:slug", async (c) => {
    const slug = c.req.param("slug");
    const details = await data.getProject(slug, "latest");
    if (!details) {
      return c.json(
        { reason: `No public app with slug '${slug}' found` },
        404,
      );
    }
    return c.json(details);
  });

  // Usage reporting – no-op in preview, real events in production.
  app.post("/api/v3/projects/:slug/:rev{rev[0-9]+}/report/install", async (c) => {
    const slug = c.req.param("slug");
    const revision = Number(c.req.param("rev").slice(3));
    const id = c.req.query("id");
    const mac = c.req.query("mac");
    await data.reportInstall(slug, revision, { id, mac });
    return c.body(null, 204);
  });

  app.post("/api/v3/projects/:slug/:rev{rev[0-9]+}/report/launch", async (c) => {
    const slug = c.req.param("slug");
    const revision = Number(c.req.param("rev").slice(3));
    const id = c.req.query("id");
    const mac = c.req.query("mac");
    await data.reportLaunch(slug, revision, { id, mac });
    return c.body(null, 204);
  });

  app.post("/api/v3/projects/:slug/:rev{rev[0-9]+}/report/crash", async (c) => {
    const slug = c.req.param("slug");
    const revision = Number(c.req.param("rev").slice(3));
    const id = c.req.query("id");
    const mac = c.req.query("mac");
    const body = await c.req.json().catch(() => ({}));
    await data.reportCrash(slug, revision, { id, mac }, body);
    return c.body(null, 204);
  });

  return app;
}
