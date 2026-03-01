import { z } from "zod/v3";
import { detailedProjectSchema } from "@shared/domain/readModels/project/ProjectDetails";
import { __tsCheckSame } from "@shared/zodUtils/zodTypeComparison";
import { CreateProjectProps, createProjectPropsSchema } from "@shared/domain/writeModels/project/WriteProject";
import { writeAppMetadataJSONSchema } from "@shared/domain/writeModels/AppMetadataJSON";
import { projectApiTokenMetadataSchema } from "@shared/domain/readModels/project/ProjectApiToken";
import { projectSummarySchema } from "@shared/domain/readModels/project/ProjectSummaries";

const createProjectBodySchema = createProjectPropsSchema
  .omit({ slug: true, idp_user_id: true })
  .describe("Schema request body for creating or updating a project");
type CreateProjectBody = Omit<CreateProjectProps, "slug" | "idp_user_id">;

__tsCheckSame<CreateProjectBody, CreateProjectBody, z.infer<typeof createProjectBodySchema>>(true);

const errorResponseSchema = z.object({ reason: z.string() });

const authorizationHeaderSchema = z.object({ authorization: z.string().optional() });

const authorizationOrTokenHeaderSchema = z.union([
  z.object({ "badgehub-api-token": z.string().optional() }),
  authorizationHeaderSchema,
]);

const iconSizeSchema = z.enum(["8x8", "16x16", "32x32", "64x64"]);

const setDraftIconBodySchema = z.object({
  filePath: z.string(),
  sizes: z.array(iconSizeSchema).min(1),
});

const setDraftIconResponseSchema = z.object({
  iconPaths: z.record(iconSizeSchema, z.string()),
});

export const privateProjectContracts = {
  createProject: { method: "POST", path: "/projects/:slug", body: createProjectBodySchema, headers: authorizationHeaderSchema, responses: { 204: z.void(), 409: errorResponseSchema, 403: errorResponseSchema } },
  updateProject: { method: "PATCH", path: "/projects/:slug", body: createProjectBodySchema, headers: authorizationOrTokenHeaderSchema },
  deleteProject: { method: "DELETE", path: "/projects/:slug", headers: authorizationOrTokenHeaderSchema },
  writeDraftFile: { method: "POST", path: "/projects/:slug/draft/files/:filePath", contentType: "multipart/form-data", body: z.any(), headers: authorizationOrTokenHeaderSchema },
  setDraftIconFromFile: { method: "POST", path: "/projects/:slug/draft/icon", body: setDraftIconBodySchema, headers: authorizationOrTokenHeaderSchema, responses: { 200: setDraftIconResponseSchema } },
  deleteDraftFile: { method: "DELETE", path: "/projects/:slug/draft/files/:filePath", headers: authorizationOrTokenHeaderSchema },
  changeDraftAppMetadata: { method: "PATCH", path: "/projects/:slug/draft/metadata", body: writeAppMetadataJSONSchema, headers: authorizationOrTokenHeaderSchema },
  getDraftFile: { method: "GET", path: "/projects/:slug/draft/files/:filePath", headers: authorizationOrTokenHeaderSchema, responses: { 200: z.unknown() } },
  getDraftProject: { method: "GET", path: "/projects/:slug/draft", headers: authorizationOrTokenHeaderSchema, responses: { 200: detailedProjectSchema } },
  publishVersion: { method: "PATCH", path: "/projects/:slug/publish", headers: authorizationOrTokenHeaderSchema },
  createProjectAPIToken: { method: "POST", path: "/projects/:slug/token", headers: authorizationOrTokenHeaderSchema, responses: { 200: z.object({ token: z.string() }) } },
  getProjectApiTokenMetadata: { method: "GET", path: "/projects/:slug/token", headers: authorizationOrTokenHeaderSchema, responses: { 200: projectApiTokenMetadataSchema } },
  revokeProjectAPIToken: { method: "DELETE", path: "/projects/:slug/token", headers: authorizationOrTokenHeaderSchema },
} as const;

export const privateRestContracts = {
  ...privateProjectContracts,
  getUserDraftProjects: {
    method: "GET",
    path: "/users/:userId/drafts",
    pathParams: z.object({ userId: z.string() }),
    query: z.object({
      pageStart: z.coerce.number().optional(),
      pageLength: z.coerce.number().optional(),
    }),
    responses: { 200: z.array(projectSummarySchema), 403: errorResponseSchema },
    headers: authorizationHeaderSchema,
  },
} as const;
