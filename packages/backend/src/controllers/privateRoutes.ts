import { NextFunction, Request, Response, Router } from "express";
import multer from "multer";
import { BadgeHubData } from "@domain/BadgeHubData";
import { createBadgeHubData } from "@domain/createBadgeHubData";
import { getUser, AuthenticatedRequest, UserDataInRequest } from "@auth/jwt-decode";
import { ProjectDetails, ProjectSlug } from "@shared/domain/readModels/project/ProjectDetails";
import { Readable } from "node:stream";
import { MAX_UPLOAD_FILE_SIZE_BYTES } from "@config";
import { ProjectAlreadyExistsError, UserError } from "@domain/UserError";
import { detectMimeType } from "@util/mimeTypeDetection";
import { addAuthenticationMiddleware } from "@auth/jwt-decode";
import { jwtVerifyTokenMiddleware } from "@auth/jwt-verify";
import rateLimit from "express-rate-limit";

const upload = multer({ limits: { fileSize: MAX_UPLOAD_FILE_SIZE_BYTES } });

const requestIsFromAllowedUser = (request: { user: UserDataInRequest }, { allowedUsers }: { allowedUsers: string[] }) => {
  const user = getUser(request);
  return user && allowedUsers.includes(user.idp_user_id);
};

const checkUserAuthorization = (userId: string, request: any) => {
  if (!requestIsFromAllowedUser(request, { allowedUsers: [userId] })) {
    return `You are not allowed to access the draft projects of user with id '${userId}'`;
  }
  return undefined;
};

const checkProjectAuthorization = async (
  badgeHubData: BadgeHubData,
  slug: ProjectSlug,
  request: unknown,
  project?: ProjectDetails,
): Promise<{ status: number; reason: string } | undefined> => {
  project = project ?? (await badgeHubData.getProject(slug, "draft"));
  if (!project) return { status: 404, reason: `No project with slug '${slug}' found` };

  const authenticatedRequest = request as AuthenticatedRequest;
  if (authenticatedRequest.apiToken) {
    const tokenIsValidForProject = await badgeHubData.checkApiToken(slug, authenticatedRequest.apiToken);
    return tokenIsValidForProject
      ? undefined
      : { status: 403, reason: `The given badgehub-api-token not authorized for project with slug '${slug}'` };
  }

  if (!authenticatedRequest.user) return { status: 403, reason: "No authentication provided" };

  if (!requestIsFromAllowedUser(authenticatedRequest, { allowedUsers: [project.idp_user_id] })) {
    return { status: 403, reason: `The user in the JWT token is not authorized for project with slug '${slug}'` };
  }

  return undefined;
};

export function registerPrivateRoutes(
  router: Router,
  badgeHubData: BadgeHubData = createBadgeHubData(),
) {
  const rateLimiter = rateLimit({ windowMs: 15 * 60 * 1000, max: 500 });

  router.use(rateLimiter, jwtVerifyTokenMiddleware, addAuthenticationMiddleware);

  router.post("/projects/:slug", async (req, res) => {
    const user = getUser(req as unknown as AuthenticatedRequest);
    if (!user) return res.status(403).json({ reason: "No user in request" });
    try {
      await badgeHubData.insertProject({ ...(req.body as any), slug: req.params.slug, idp_user_id: user.idp_user_id });
      return res.status(204).send();
    } catch (e) {
      if (e instanceof ProjectAlreadyExistsError) return res.status(409).json({ reason: e.message });
      if (e instanceof UserError) return res.status(400).json({ reason: e.message });
      throw e;
    }
  });

  router.patch("/projects/:slug", async (req, res) => {
    const fail = await checkProjectAuthorization(badgeHubData, req.params.slug, req);
    if (fail) return res.status(fail.status).json({ reason: fail.reason });
    await badgeHubData.updateProject(req.params.slug, req.body);
    res.status(204).send();
  });

  router.delete("/projects/:slug", async (req, res) => {
    const fail = await checkProjectAuthorization(badgeHubData, req.params.slug, req);
    if (fail) return res.status(fail.status).json({ reason: fail.reason });
    await badgeHubData.deleteProject(req.params.slug);
    res.status(204).send();
  });

  router.patch("/projects/:slug/draft/metadata", async (req, res) => {
    const fail = await checkProjectAuthorization(badgeHubData, req.params.slug, req);
    if (fail) return res.status(fail.status).json({ reason: fail.reason });
    await badgeHubData.updateDraftMetadata(req.params.slug, req.body);
    res.status(204).send();
  });

  router.get("/projects/:slug/draft", async (req, res) => {
    const project = await badgeHubData.getProject(req.params.slug, "draft");
    if (!project) return res.status(404).json({ reason: `No project with slug '${req.params.slug}' found` });
    const fail = await checkProjectAuthorization(badgeHubData, req.params.slug, req, project);
    if (fail) return res.status(fail.status).json({ reason: fail.reason });
    return res.status(200).json(project);
  });

  router.patch("/projects/:slug/publish", async (req, res) => {
    const fail = await checkProjectAuthorization(badgeHubData, req.params.slug, req);
    if (fail) return res.status(fail.status).json({ reason: fail.reason });
    await badgeHubData.publishVersion(req.params.slug);
    res.status(204).send();
  });

  router.post("/projects/:slug/draft/files/:filePath", upload.single("file"), async (req, res) => {
    const slug = req.params.slug as string;
    const filePath = req.params.filePath as string;
    const fail = await checkProjectAuthorization(badgeHubData, slug, req);
    if (fail) return res.status(fail.status).json({ reason: fail.reason });
    const typedFile = req.file as Express.Multer.File | undefined;
    if (!typedFile?.buffer) {
      return res.status(400).json({ reason: "No file provided with multipart/form-data under field file" });
    }
    const detectedMimeType = detectMimeType(typedFile.mimetype, filePath);
    await badgeHubData.writeDraftFile(slug, filePath, {
      mimetype: detectedMimeType,
      fileContent: typedFile.buffer,
      directory: typedFile.destination,
      fileName: typedFile.filename,
      size: typedFile.size,
    });
    return res.status(204).send();
  });

  router.post("/projects/:slug/draft/icon", async (req, res) => {
    const project = await badgeHubData.getProject(req.params.slug, "draft");
    if (!project) return res.status(404).json({ reason: `No project with slug '${req.params.slug}' found` });
    const fail = await checkProjectAuthorization(badgeHubData, req.params.slug, req, project);
    if (fail) return res.status(fail.status).json({ reason: fail.reason });
    try {
      const iconPaths = await badgeHubData.setDraftIconFromFile(req.params.slug, req.body.filePath, req.body.sizes, project);
      if (!iconPaths) return res.status(404).json({ reason: `File '${req.body.filePath}' not found in draft project '${req.params.slug}'` });
      return res.status(200).json({ iconPaths });
    } catch (error) {
      if (error instanceof UserError) return res.status(400).json({ reason: error.message });
      throw error;
    }
  });

  router.delete("/projects/:slug/draft/files/:filePath", async (req, res) => {
    const fail = await checkProjectAuthorization(badgeHubData, req.params.slug, req);
    if (fail) return res.status(fail.status).json({ reason: fail.reason });
    await badgeHubData.deleteDraftFile(req.params.slug, req.params.filePath);
    res.status(204).send();
  });

  router.get("/projects/:slug/draft/files/:filePath", async (req, res) => {
    const fail = await checkProjectAuthorization(badgeHubData, req.params.slug, req);
    if (fail) return res.status(fail.status).json({ reason: fail.reason });
    const fileContents = await badgeHubData.getFileContents(req.params.slug, "draft", req.params.filePath);
    if (!fileContents) return res.status(404).json({ reason: `Project with slug '${req.params.slug}' or file '${req.params.filePath}' not found` });
    Readable.from(fileContents).pipe(res);
  });

  router.post("/projects/:slug/token", async (req, res) => {
    const fail = await checkProjectAuthorization(badgeHubData, req.params.slug, req);
    if (fail) return res.status(fail.status).json({ reason: fail.reason });
    return res.status(200).json({ token: await badgeHubData.createProjectApiToken(req.params.slug) });
  });

  router.get("/projects/:slug/token", async (req, res) => {
    const fail = await checkProjectAuthorization(badgeHubData, req.params.slug, req);
    if (fail) return res.status(fail.status).json({ reason: fail.reason });
    const metadata = await badgeHubData.getProjectApiTokenMetadata(req.params.slug);
    if (!metadata) return res.status(404).json({ reason: "No Project API" });
    return res.status(200).json({ last_used_at: metadata.last_used_at, created_at: metadata.created_at });
  });

  router.delete("/projects/:slug/token", async (req, res) => {
    const fail = await checkProjectAuthorization(badgeHubData, req.params.slug, req);
    if (fail) return res.status(fail.status).json({ reason: fail.reason });
    await badgeHubData.revokeProjectAPIToken(req.params.slug);
    res.status(204).send();
  });

  router.get("/users/:userId/drafts", async (req, res) => {
    const reason = checkUserAuthorization(req.params.userId, req);
    if (reason) return res.status(403).json({ reason });
    const projects = await badgeHubData.getProjectSummaries(
      {
        pageStart: req.query.pageStart ? Number(req.query.pageStart) : undefined,
        pageLength: req.query.pageLength ? Number(req.query.pageLength) : undefined,
        userId: req.params.userId,
        orderBy: "updated_at",
      },
      "draft",
    );
    return res.status(200).json(projects);
  });
}
