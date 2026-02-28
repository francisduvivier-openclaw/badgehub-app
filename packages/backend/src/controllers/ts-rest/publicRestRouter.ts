import { initServer } from "@ts-rest/express";
import {
  publicFilesContracts,
  publicOtherContracts,
  publicProjectContracts,
  publicReportContracts,
  publicRestContracts,
} from "@shared/contracts/publicRestContracts";
import { BadgeHubData } from "@domain/BadgeHubData";
import { createBadgeHubData } from "@domain/createBadgeHubData";
import { noContent, nok, ok } from "@controllers/ts-rest/httpResponses";
import { Readable } from "node:stream";
import { RouterImplementation } from "@ts-rest/express/src/lib/types";
import { ProjectLatestRevisions } from "@shared/domain/readModels/project/ProjectRevision";
import {
  getBadgesHandler,
  getCategoriesHandler,
  getLatestPublishedFileHandler,
  getProjectHandler,
  getProjectSummariesHandler,
  getStatsHandler,
  pingHandler,
} from "@shared/api/backendCoreHandlers";

const createFilesRouter = (badgeHubData: BadgeHubData) => {
  const filesRouter: RouterImplementation<typeof publicFilesContracts> = {
    getLatestPublishedFile: async ({ params: { slug, filePath }, res }) => {
      const response = await getLatestPublishedFileHandler(
        badgeHubData,
        slug,
        filePath
      );
      if (response.status !== 200) return response;
      const data = Readable.from(response.body);
      res.setHeader(
        "Content-Disposition",
        `attachment; filename="${filePath}"`
      );
      return ok(data);
    },
    getFileForRevision: async ({
      params: { slug, revision, filePath },
      res,
    }) => {
      const file = await badgeHubData.getFileContents(slug, revision, filePath);
      if (!file) {
        return nok(
          404,
          `No app with slug '${slug}' and revision '${revision}' found`
        );
      }
      res.setHeader(
        "Content-Disposition",
        `attachment; filename="${filePath}"`
      );
      // Enable public caching for immutable revisioned files (1 year)
      res.setHeader("Cache-Control", "public, max-age=31536000, immutable");
      const data = Readable.from(file);
      return ok(data);
    },
  };
  return filesRouter;
};

const createProjectRouter = (badgeHubData: BadgeHubData) => {
  const projectRouter: RouterImplementation<typeof publicProjectContracts> = {
    getProject: async ({ params: { slug } }) => {
      return getProjectHandler(badgeHubData, slug, "latest");
    },
    getProjectSummaries: async ({ query }) => {
      return getProjectSummariesHandler(badgeHubData, query, "latest");
    },
    getProjectLatestRevisions: async ({ query, res }) => {
      const slugs = (query.slugs && query.slugs?.split(",")) || undefined;
      const data = await badgeHubData.getProjectSummaries(
        { slugs: slugs, orderBy: "published_at" },
        "latest"
      );
      // TODO optimize this
      const projectRevisionMap: ProjectLatestRevisions = data.map((p) => ({
        slug: p.slug,
        revision: p.revision,
      }));
      res.setHeader("Cache-Control", "max-age=10");
      return ok(projectRevisionMap);
    },
    getProjectLatestRevision: async ({ params: { slug }, res }) => {
      // TODO optimize this
      const projectDetails = await badgeHubData.getProject(slug, "latest");
      if (projectDetails?.latest_revision == undefined) {
        return nok(404, `No published app with slug '${slug}' found`);
      }
      res.setHeader("Cache-Control", "max-age=10");
      return ok(projectDetails?.latest_revision);
    },
    getProjectForRevision: async ({ params: { slug, revision }, res }) => {
      const details = await badgeHubData.getProject(slug, revision);
      if (!details) {
        return nok(
          404,
          `No public app with slug [${slug}] and revision [${revision}] found`
        );
      }
      // Enable public caching for immutable revisioned files (1 year)
      res.setHeader("Cache-Control", "public, max-age=31536000, immutable");
      return ok(details);
    },
  };
  return projectRouter;
};

const createPublicOtherRouter = (badgeHubData: BadgeHubData) => {
  const otherRouter: RouterImplementation<typeof publicOtherContracts> = {
    getBadges: async () => getBadgesHandler(badgeHubData),
    getCategories: async () => getCategoriesHandler(badgeHubData),
    ping: async ({ query: { id, mac } }) => pingHandler(badgeHubData, id, mac),
    getStats: async () => getStatsHandler(badgeHubData),
  };
  return otherRouter;
};

const createReportRouter = (badgeHubData: BadgeHubData) => {
  const reportRouter: RouterImplementation<typeof publicReportContracts> = {
    reportInstall: async ({ params, query }) => {
      await badgeHubData.reportInstall(params.slug, params.revision, query);
      return noContent();
    },
    reportLaunch: async ({ params, query }) => {
      await badgeHubData.reportLaunch(params.slug, params.revision, query);
      return noContent();
    },
    reportCrash: async ({ params, query, body }) => {
      await badgeHubData.reportCrash(params.slug, params.revision, query, body);
      return noContent();
    },
  };
  return reportRouter;
};

export const createPublicRestRouter = (
  badgeHubData: BadgeHubData = createBadgeHubData()
) => {
  return initServer().router(publicRestContracts, {
    ...createProjectRouter(badgeHubData),
    ...createFilesRouter(badgeHubData),
    ...createPublicOtherRouter(badgeHubData),
    ...createReportRouter(badgeHubData),
  } as any);
};
