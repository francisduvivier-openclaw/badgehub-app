import { z } from "zod/v3";
import { detailedProjectSchema } from "@shared/domain/readModels/project/ProjectDetails";
import { categoryNameSchema } from "@shared/domain/readModels/project/Category";
import { badgeSlugSchema } from "@shared/domain/readModels/Badge";
import { projectLatestRevisionsSchema } from "@shared/domain/readModels/project/ProjectRevision";
import { badgeHubStatsSchema } from "@shared/domain/readModels/BadgeHubStats";
import { projectSummarySchema } from "@shared/domain/readModels/project/ProjectSummaries";

const errorResponseSchema = z.object({ reason: z.string() });
export const getProjectsQuerySchema = z.object({
  pageStart: z.coerce.number().optional(),
  pageLength: z.coerce.number().optional(),
  badge: badgeSlugSchema.optional(),
  category: categoryNameSchema.optional(),
  slugs: z.string().describe("optional comma separated list of project slugs to filter on").optional(),
  userId: z.string().optional(),
  search: z
    .string()
    .max(50, "the search string should not be longer than 50 characters long")
    .optional()
    .describe("allow a text search over the apps' slug, name and descriptions"),
  orderBy: z.enum(["published_at", "installs"]).optional(),
});

const projectRevisionParams = z.object({
  slug: z.string(),
  revision: z.coerce.number(),
});

export const publicProjectContracts = {
  getProject: { method: "GET", path: `/projects/:slug`, pathParams: z.object({ slug: z.string() }), responses: { 200: detailedProjectSchema, 404: errorResponseSchema } },
  getProjectSummaries: { method: "GET", path: `/project-summaries`, query: getProjectsQuerySchema, responses: { 200: z.array(projectSummarySchema) } },
  getProjectLatestRevisions: { method: "GET", path: `/project-latest-revisions`, query: z.object({ slugs: z.string().optional() }), responses: { 200: projectLatestRevisionsSchema } },
  getProjectLatestRevision: { method: "GET", path: `/project-latest-revisions/:slug`, pathParams: z.object({ slug: z.string() }), responses: { 200: z.number() } },
  getProjectForRevision: { method: "GET", path: `/projects/:slug/rev:revision`, pathParams: projectRevisionParams, responses: { 200: detailedProjectSchema, 404: errorResponseSchema } },
} as const;

export const publicFilesContracts = {
  getLatestPublishedFile: { method: "GET", path: `/projects/:slug/latest/files/:filePath` },
  getFileForRevision: { method: "GET", path: `/projects/:slug/rev:revision/files/:filePath` },
} as const;

export const badgeIdentifiersSchema = z.object({
  mac: z.string().describe("the mac address of the badge").optional(),
  id: z.string().describe("the id of the badge").optional(),
});

export const publicOtherContracts = {
  getCategories: { method: "GET", path: `/categories`, responses: { 200: z.array(categoryNameSchema) } },
  getBadges: { method: "GET", path: `/badges`, responses: { 200: z.array(badgeSlugSchema) } },
  ping: { method: "GET", path: `/ping`, query: badgeIdentifiersSchema, responses: { 200: z.string() } },
  getStats: { method: "GET", path: `/stats`, responses: { 200: badgeHubStatsSchema } },
} as const;

const crashReportBodySchema = z.object({
  reason: z.string().describe("An optional reason for the app crash.").optional(),
});

export const publicReportContracts = {
  reportInstall: { method: "POST", path: "/projects/:slug/rev:revision/report/install" },
  reportLaunch: { method: "POST", path: "/projects/:slug/rev:revision/report/launch" },
  reportCrash: { method: "POST", path: "/projects/:slug/rev:revision/report/crash", body: crashReportBodySchema },
} as const;

export const publicRestContracts = {
  ...publicProjectContracts,
  ...publicFilesContracts,
  ...publicOtherContracts,
  ...publicReportContracts,
} as const;
