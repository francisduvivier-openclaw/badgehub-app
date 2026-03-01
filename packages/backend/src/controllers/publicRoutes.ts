import { Router } from "express";
import { BadgeHubData } from "@domain/BadgeHubData";
import { createBadgeHubData } from "@domain/createBadgeHubData";
import { Readable } from "node:stream";

export function registerPublicRoutes(
  router: Router,
  badgeHubData: BadgeHubData = createBadgeHubData(),
) {
  router.get("/projects/:slug", async (req, res) => {
    const details = await badgeHubData.getProject(req.params.slug, "latest");
    if (!details) return res.status(404).json({ reason: `No public app with slug '${req.params.slug}' found` });
    return res.status(200).json(details);
  });

  router.get("/project-summaries", async (req, res) => {
    const q = req.query;
    const projectSlugs = typeof q.slugs === "string" ? q.slugs.split(",") : [];
    const data = await badgeHubData.getProjectSummaries(
      {
        slugs: projectSlugs,
        pageStart: q.pageStart ? Number(q.pageStart) : undefined,
        pageLength: q.pageLength ? Number(q.pageLength) : undefined,
        badge: typeof q.badge === "string" ? q.badge : undefined,
        category: typeof q.category === "string" ? q.category : undefined,
        search: typeof q.search === "string" ? q.search : undefined,
        userId: typeof q.userId === "string" ? q.userId : undefined,
        orderBy: q.orderBy === "installs" ? "installs" : "published_at",
      },
      "latest",
    );
    return res.status(200).json(data);
  });

  router.get("/project-latest-revisions", async (req, res) => {
    const slugs = typeof req.query.slugs === "string" ? req.query.slugs.split(",") : undefined;
    const data = await badgeHubData.getProjectSummaries({ slugs, orderBy: "published_at" }, "latest");
    res.setHeader("Cache-Control", "max-age=10");
    return res.status(200).json(data.map((p) => ({ slug: p.slug, revision: p.revision })));
  });

  router.get("/project-latest-revisions/:slug", async (req, res) => {
    const projectDetails = await badgeHubData.getProject(req.params.slug, "latest");
    if (projectDetails?.latest_revision == undefined) {
      return res.status(404).json({ reason: `No published app with slug '${req.params.slug}' found` });
    }
    res.setHeader("Cache-Control", "max-age=10");
    return res.status(200).json(projectDetails.latest_revision);
  });

  router.get("/projects/:slug/rev:revision", async (req, res) => {
    const details = await badgeHubData.getProject(req.params.slug, Number(req.params.revision));
    if (!details) return res.status(404).json({ reason: `No public app with slug [${req.params.slug}] and revision [${req.params.revision}] found` });
    res.setHeader("Cache-Control", "public, max-age=31536000, immutable");
    return res.status(200).json(details);
  });

  router.get("/projects/:slug/latest/files/:filePath", async (req, res) => {
    const file = await badgeHubData.getFileContents(req.params.slug, "latest", req.params.filePath);
    if (!file) return res.status(404).json({ reason: `No app with slug '${req.params.slug}' found` });
    res.setHeader("Content-Disposition", `attachment; filename=\"${req.params.filePath}\"`);
    Readable.from(file).pipe(res);
  });

  router.get("/projects/:slug/rev:revision/files/:filePath", async (req, res) => {
    const file = await badgeHubData.getFileContents(req.params.slug, Number(req.params.revision), req.params.filePath);
    if (!file) return res.status(404).json({ reason: `No app with slug '${req.params.slug}' and revision '${req.params.revision}' found` });
    res.setHeader("Content-Disposition", `attachment; filename=\"${req.params.filePath}\"`);
    res.setHeader("Cache-Control", "public, max-age=31536000, immutable");
    Readable.from(file).pipe(res);
  });

  router.get("/categories", async (_req, res) => res.status(200).json(await badgeHubData.getCategories()));
  router.get("/badges", async (_req, res) => res.status(200).json(await badgeHubData.getBadges()));
  router.get("/ping", async (req, res) => {
    const id = typeof req.query.id === "string" ? req.query.id : undefined;
    const mac = typeof req.query.mac === "string" ? req.query.mac : undefined;
    if (id) await badgeHubData.registerBadge(id, mac);
    return res.status(200).json("pong");
  });
  router.get("/stats", async (_req, res) => res.status(200).json(await badgeHubData.getStats()));

  router.post("/projects/:slug/rev:revision/report/install", async (req, res) => {
    await badgeHubData.reportInstall(req.params.slug, Number(req.params.revision), req.query as any);
    res.status(204).send();
  });
  router.post("/projects/:slug/rev:revision/report/launch", async (req, res) => {
    await badgeHubData.reportLaunch(req.params.slug, Number(req.params.revision), req.query as any);
    res.status(204).send();
  });
  router.post("/projects/:slug/rev:revision/report/crash", async (req, res) => {
    await badgeHubData.reportCrash(req.params.slug, Number(req.params.revision), req.query as any, req.body as any);
    res.status(204).send();
  });
}
