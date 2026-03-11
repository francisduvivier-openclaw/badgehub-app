import { initContract } from "@ts-rest/core";
import { z } from "zod/v3";
import {
  detailedProjectSchema,
  projectSummarySchema,
} from "@shared/domain/readModels/project/ProjectDetails";
import { categoryNameSchema } from "@shared/domain/readModels/project/Category";
import { badgeSlugSchema } from "@shared/domain/readModels/Badge";
import { projectLatestRevisionsSchema } from "@shared/domain/readModels/project/ProjectRevision";
import { badgeHubStatsSchema } from "@shared/domain/readModels/BadgeHubStats";

const c = initContract();

const errorResponseSchema = z.object({ reason: z.string() });
export const getProjectsQuerySchema = z.object({
  pageStart: z.coerce.number().optional(),
  pageLength: z.coerce.number().optional(),
  badge: badgeSlugSchema.optional(),
  category: categoryNameSchema.optional(),
  slugs: z
    .string()
    .describe("optional comma separated list of project slugs to filter on")
    .optional(),
  userId: z.string().optional(),
  search: z
    .string()
    .max(50, "the search string should not be longer than 50 characters long")
    .optional()
    .describe("allow a text search over the apps' slug, name and descriptions"),
});

export const publicProjectContracts = c.router({
  getProject: {
    method: "GET",
    path: `/projects/:slug`,
    pathParams: z.object({ slug: z.string() }),
    responses: {
      200: detailedProjectSchema,
      404: errorResponseSchema,
    },
    summary: "Get (Latest) Project Details by Slug",
  },
  getProjectSummaries: {
    method: "GET",
    path: `/project-summaries`,
    query: getProjectsQuerySchema,
    responses: {
      200: z.array(projectSummarySchema),
    },
    summary: "Get all Projects",
  },
  getProjectLatestRevisions: {
    method: "GET",
    path: `/project-latest-revisions`,
    query: z.object({
      slugs: z.string().optional(),
    }),
    responses: {
      200: projectLatestRevisionsSchema,
    },
    summary:
      "Get the latest revisions for a list of project slugs. Allows for quickly checking for updates.",
  },
  getProjectLatestRevision: {
    method: "GET",
    path: `/project-latest-revisions/:slug`,
    pathParams: z.object({ slug: z.string() }),
    responses: { 200: z.number() },
    summary:
      "Get the latest revision number for a project. Allows for quickly checking for updates.",
  },
  getProjectForRevision: {
    method: "GET",
    path: `/projects/:slug/rev:revision`,
    pathParams: z.object({
      slug: z.string(),
      revision: z.coerce.number(),
    }),
    responses: {
      200: detailedProjectSchema,
      404: errorResponseSchema,
    },
    summary:
      "Get project details for a specific published revision of the project",
  },
});

export const publicFilesContracts = c.router({
  getLatestPublishedFile: {
    method: "GET",
    path: `/projects/:slug/latest/files/:filePath`,
    pathParams: z.object({
      slug: z.string(),
      filePath: z.string(),
    }),
    responses: {
      200: z.unknown().describe("ReadableStream"), // ReadableStream
      404: errorResponseSchema,
    },
    summary: "Get the latest published revision of a file in the project",
  },
  getFileForRevision: {
    method: "GET",
    path: `/projects/:slug/rev:revision/files/:filePath`,
    pathParams: z.object({
      slug: z.string(),
      revision: z.coerce.number(),
      filePath: z.string(),
    }),
    responses: {
      200: z.unknown().describe("ReadableStream"), // ReadableStream,
      404: errorResponseSchema,
    },
    summary: "Get a file for a specific revision of the project",
  },
});

export const pingQuerySchema = z.object({
  mac: z.string().describe("the mac address of the badge").optional(),
  id: z.string().describe("the id of the badge").optional(),
});

export const publicOtherContracts = c.router({
  getCategories: {
    method: "GET",
    path: `/categories`,
    responses: {
      200: z.array(categoryNameSchema),
    },
  },
  getBadges: {
    method: "GET",
    path: `/badges`,
    responses: {
      200: z.array(badgeSlugSchema),
    },
  },
  ping: {
    method: "GET",
    path: `/ping`,
    query: pingQuerySchema,
    responses: {
      200: z.string().describe("Ping the server to check if it's alive"),
    },
  },
  getStats: {
    method: "GET",
    path: `/stats`,
    responses: {
      200: badgeHubStatsSchema,
    },
  },
});

export const publicRestContracts = c.router({
  ...publicProjectContracts,
  ...publicFilesContracts,
  ...publicOtherContracts,
});
