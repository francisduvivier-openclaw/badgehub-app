import { type OpenAPI, oc } from "@orpc/contract";
import { errorResponseSchema } from "@shared/contracts/errorSchemas";
import { badgeSlugSchema } from "@shared/domain/readModels/Badge";
import { badgeHubStatsSchema } from "@shared/domain/readModels/BadgeHubStats";
import {
  appMetadataJSONSchema,
  developmentStatusSchema,
} from "@shared/domain/readModels/project/AppMetadataJSON";
import { categoryNameSchema } from "@shared/domain/readModels/project/Category";
import type { OrderByOption } from "@shared/domain/readModels/project/ordering";
import { detailedProjectSchema } from "@shared/domain/readModels/project/ProjectDetails";
import { projectLatestRevisionsSchema } from "@shared/domain/readModels/project/ProjectRevision";
import { projectSummariesSchema } from "@shared/domain/readModels/project/ProjectSummaries";
import { projectVersionsSchema } from "@shared/domain/readModels/project/ProjectVersions";
import { __tsCheckSame } from "@shared/zodUtils/zodTypeComparison";
import { z } from "zod";

const orderByOptionSchema = z.enum([
  "average_rating",
  "published_at",
  "rating_count",
  "updated_at",
  "installs",
  "name",
]);
__tsCheckSame<
  OrderByOption,
  OrderByOption,
  z.infer<typeof orderByOptionSchema>
>(true);

export const getProjectsQuerySchema = z.object({
  pageStart: z.coerce.number().optional(),
  pageLength: z.coerce.number().optional(),
  badge: badgeSlugSchema.optional(),
  category: categoryNameSchema.optional(),
  excludeCategories: z
    .string()
    .describe(
      "optional comma separated list of categories to exclude. Unknown categories are ignored."
    )
    .optional(),
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
  orderBy: orderByOptionSchema.optional(),
  developmentStatus: developmentStatusSchema
    .optional()
    .describe(`Filter by development status.`),
});

export const badgeIdentifiersSchema = z.object({
  mac: z.string().describe("the mac address of the badge").optional(),
  id: z
    .string()
    .describe(
      "the id of the badge, this should be an string that is unique to the badge and persistent, and not sniffable like the mac."
    ),
});

export const crashReportBodySchema = z.object({
  reason: z
    .string()
    .describe("An optional reason for the app crash.")
    .optional(),
});

export const ratingReportBodySchema = z.object({
  rating: z.coerce
    .number()
    .int()
    .min(1)
    .max(5)
    .describe("A rating from 1 to 5."),
});

export const categoryNamesSchema = z.array(categoryNameSchema);
export const badgeSlugsSchema = z.array(badgeSlugSchema);

const publicBase = oc.errors({
  NOT_FOUND: {
    status: 404,
    data: errorResponseSchema,
  },
});

export const PROMETHEUS_CONTENT_TYPE =
  "text/plain; version=0.0.4; charset=utf-8";

/**
 * Advertise the Prometheus exposition format instead of application/json.
 * The handler returns a File body so oRPC does not JSON-encode the text.
 */
const prometheusTextSpec = (
  operation: OpenAPI.OperationObject
): OpenAPI.OperationObject => {
  const response = operation.responses?.["200"];
  if (!response || "$ref" in response) return operation;
  return {
    ...operation,
    responses: {
      ...operation.responses,
      "200": {
        ...response,
        content: {
          [PROMETHEUS_CONTENT_TYPE]: {
            schema: {
              type: "string" as const,
              description:
                "Prometheus text exposition format (version 0.0.4) of the same hub stats as GET /stats.",
            },
          },
        },
      },
    },
  };
};

export const publicRestContracts = {
  getProject: publicBase
    .route({
      method: "GET",
      path: "/projects/{slug}",
      summary: "Get (Latest) Project Details by Slug",
      tags: ["Public"],
      successStatus: 200,
    })
    .input(z.object({ slug: z.string() }))
    .output(detailedProjectSchema),

  getProjectSummaries: publicBase
    .route({
      method: "GET",
      path: "/project-summaries",
      summary: "Get all Projects",
      tags: ["Public"],
    })
    .input(getProjectsQuerySchema)
    .output(projectSummariesSchema),

  getProjectLatestRevisions: publicBase
    .route({
      method: "GET",
      path: "/project-latest-revisions",
      summary:
        "Get the latest revisions for a list of project slugs. Allows for quickly checking for updates.",
      tags: ["Public"],
    })
    .input(z.object({ slugs: z.string().optional() }))
    .output(projectLatestRevisionsSchema),

  getProjectLatestRevision: publicBase
    .route({
      method: "GET",
      path: "/project-latest-revisions/{slug}",
      summary:
        "Get the latest revision number for a project. Allows for quickly checking for updates.",
      tags: ["Public"],
    })
    .input(z.object({ slug: z.string() }))
    .output(z.number()),

  getProjectForRevision: publicBase
    .route({
      method: "GET",
      // Public URL stays /projects/{slug}/rev{N}; Express rewrites revN → revisions/N
      path: "/projects/{slug}/revisions/{revision}",
      summary:
        "Get project details for a specific published revision of the project",
      tags: ["Public"],
    })
    .input(
      z.object({
        slug: z.string(),
        revision: z.coerce.number(),
      })
    )
    .output(detailedProjectSchema),

  getProjectVersions: publicBase
    .route({
      method: "GET",
      path: "/projects/{slug}/versions",
      summary:
        "Get unique metadata versions for a project with the highest revision for each version",
      description:
        "Returns the list of unique versions (from the version field in project metadata) with the highest revision number for that version. Only published revisions are considered. Ordered by revision descending.",
      tags: ["Public"],
      successStatus: 200,
    })
    .input(z.object({ slug: z.string() }))
    .output(projectVersionsSchema),

  getLatestPublishedMetadataFile: publicBase
    .route({
      method: "GET",
      path: "/projects/{slug}/latest/files/metadata.json",
      summary: "Get the metadata for the latest published project revision",
      tags: ["Public"],
      outputStructure: "detailed",
    })
    .input(z.object({ slug: z.string() }))
    .output(
      z.object({
        headers: z.record(z.string(), z.string()).optional(),
        body: appMetadataJSONSchema,
      })
    ),

  getLatestPublishedFile: publicBase
    .route({
      method: "GET",
      path: "/projects/{slug}/latest/files/{+filePath}",
      summary: "Get the latest published revision of a file in the project",
      tags: ["Public"],
      outputStructure: "detailed",
    })
    .input(z.object({ slug: z.string(), filePath: z.string() }))
    .output(
      z.object({
        headers: z.record(z.string(), z.string()).optional(),
        body: z.unknown().describe("File content"),
      })
    ),

  getMetadataFileForRevision: publicBase
    .route({
      method: "GET",
      path: "/projects/{slug}/revisions/{revision}/files/metadata.json",
      summary: "Get the metadata for a specific published project revision",
      tags: ["Public"],
      outputStructure: "detailed",
    })
    .input(
      z.object({
        slug: z.string(),
        revision: z.coerce.number(),
      })
    )
    .output(
      z.object({
        headers: z.record(z.string(), z.string()).optional(),
        body: appMetadataJSONSchema,
      })
    ),

  getFileForRevision: publicBase
    .route({
      method: "GET",
      path: "/projects/{slug}/revisions/{revision}/files/{+filePath}",
      summary: "Get a file for a specific revision of the project",
      tags: ["Public"],
      outputStructure: "detailed",
    })
    .input(
      z.object({
        slug: z.string(),
        revision: z.coerce.number(),
        filePath: z.string(),
      })
    )
    .output(
      z.object({
        headers: z.record(z.string(), z.string()).optional(),
        body: z.unknown().describe("ReadableStream"),
      })
    ),

  getCategories: publicBase
    .route({
      method: "GET",
      path: "/categories",
      tags: ["Public"],
    })
    .output(categoryNamesSchema),

  getBadges: publicBase
    .route({
      method: "GET",
      path: "/badges",
      tags: ["Public"],
    })
    .output(badgeSlugsSchema),

  ping: publicBase
    .route({
      method: "GET",
      path: "/ping",
      tags: ["Public"],
    })
    .input(badgeIdentifiersSchema)
    .output(z.string().describe("Ping the server to check if it's alive")),

  getStats: publicBase
    .route({
      method: "GET",
      path: "/stats",
      tags: ["Public"],
    })
    .output(badgeHubStatsSchema),

  getPrometheusStats: publicBase
    .route({
      method: "GET",
      path: "/metrics",
      summary: "Prometheus-compatible stats",
      description:
        "Exposes the same hub stats as GET /stats in Prometheus text exposition format (version 0.0.4).",
      tags: ["Public"],
      outputStructure: "detailed",
      spec: prometheusTextSpec,
    })
    .output(
      z.object({
        headers: z.record(z.string(), z.string()).optional(),
        body: z.unknown().describe("Prometheus text exposition format"),
      })
    ),

  reportInstall: publicBase
    .route({
      method: "POST",
      path: "/projects/{slug}/revisions/{revision}/report/install",
      summary: "Report an installation of an app.",
      tags: ["Public"],
      successStatus: 204,
      inputStructure: "detailed",
    })
    .input(
      z.object({
        params: z.object({
          slug: z.string(),
          revision: z.coerce.number(),
        }),
        query: badgeIdentifiersSchema,
        // Allow empty body or any legacy payload (e.g. JSON string)
        body: z.unknown().optional(),
      })
    )
    .output(z.void()),

  reportLaunch: publicBase
    .route({
      method: "POST",
      path: "/projects/{slug}/revisions/{revision}/report/launch",
      summary: "Report a launch of an app.",
      tags: ["Public"],
      successStatus: 204,
      inputStructure: "detailed",
    })
    .input(
      z.object({
        params: z.object({
          slug: z.string(),
          revision: z.coerce.number(),
        }),
        query: badgeIdentifiersSchema,
        body: z.unknown().optional(),
      })
    )
    .output(z.void()),

  reportCrash: publicBase
    .route({
      method: "POST",
      path: "/projects/{slug}/revisions/{revision}/report/crash",
      summary: "Report a crash of an app.",
      tags: ["Public"],
      successStatus: 204,
      inputStructure: "detailed",
    })
    .input(
      z.object({
        params: z.object({
          slug: z.string(),
          revision: z.coerce.number(),
        }),
        query: badgeIdentifiersSchema,
        body: crashReportBodySchema.optional(),
      })
    )
    .output(z.void()),

  reportRatingFromBadge: publicBase
    .route({
      method: "POST",
      path: "/projects/{slug}/revisions/{revision}/report/rating",
      summary: "Report a rating of an app from a badge.",
      tags: ["Public"],
      successStatus: 204,
      inputStructure: "detailed",
    })
    .input(
      z.object({
        params: z.object({
          slug: z.string(),
          revision: z.coerce.number(),
        }),
        query: badgeIdentifiersSchema,
        body: ratingReportBodySchema,
      })
    )
    .output(z.void()),
};
