import { Hono } from "hono";
import { BadgeHubData } from "@domain/BadgeHubData";
import { createBadgeHubData } from "@domain/createBadgeHubData";
import { UserDataInRequest, AuthVariables, addAuthenticationMiddleware } from "@auth/jwt-decode";
import { ProjectDetails, ProjectSlug } from "@shared/domain/readModels/project/ProjectDetails";
import { MAX_UPLOAD_FILE_SIZE_BYTES } from "@config";
import { ProjectAlreadyExistsError, UserError } from "@domain/UserError";
import { detectMimeType } from "@util/mimeTypeDetection";
import { jwtVerifyTokenMiddleware } from "@auth/jwt-verify";

type AuthCtx = { Variables: AuthVariables };

const requestIsFromAllowedUser = (
  user: UserDataInRequest | undefined,
  { allowedUsers }: { allowedUsers: string[] },
) => user && allowedUsers.includes(user.idp_user_id);

const checkUserAuthorization = (
  userId: string,
  user: UserDataInRequest | undefined,
) => {
  if (!requestIsFromAllowedUser(user, { allowedUsers: [userId] })) {
    return `You are not allowed to access the draft projects of user with id '${userId}'`;
  }
  return undefined;
};

const checkProjectAuthorization = async (
  badgeHubData: BadgeHubData,
  slug: ProjectSlug,
  user: UserDataInRequest | undefined,
  apiToken: string | undefined,
  project?: ProjectDetails,
): Promise<{ status: number; reason: string } | undefined> => {
  project = project ?? (await badgeHubData.getProject(slug, "draft"));
  if (!project) return { status: 404, reason: `No project with slug '${slug}' found` };

  if (apiToken) {
    const tokenIsValidForProject = await badgeHubData.checkApiToken(slug, apiToken);
    return tokenIsValidForProject
      ? undefined
      : { status: 403, reason: `The given badgehub-api-token not authorized for project with slug '${slug}'` };
  }

  if (!user) return { status: 403, reason: "No authentication provided" };

  if (!requestIsFromAllowedUser(user, { allowedUsers: [project.idp_user_id] })) {
    return {
      status: 403,
      reason: `The user in the JWT token is not authorized for project with slug '${slug}'`,
    };
  }

  return undefined;
};

// Simple in-memory rate limiter: 500 requests per 15 minutes per IP.
const rateCounts = new Map<string, { count: number; resetAt: number }>();
async function rateLimiterMiddleware(c: any, next: () => Promise<void>) {
  const ip = c.req.header("x-forwarded-for") ?? "unknown";
  const now = Date.now();
  const windowMs = 15 * 60 * 1000;
  const limit = 500;
  let entry = rateCounts.get(ip);
  if (!entry || now > entry.resetAt) {
    entry = { count: 0, resetAt: now + windowMs };
    rateCounts.set(ip, entry);
  }
  entry.count++;
  if (entry.count > limit) {
    return c.json({ reason: "Too many requests" }, 429);
  }
  await next();
}

export function registerPrivateRoutes(
  app: Hono,
  badgeHubData: BadgeHubData = createBadgeHubData(),
) {
  const privateApp = new Hono<AuthCtx>();
  privateApp.use("*", rateLimiterMiddleware, jwtVerifyTokenMiddleware, addAuthenticationMiddleware);

  privateApp.post("/projects/:slug", async (c) => {
    const user = c.get("user");
    if (!user) return c.json({ reason: "No user in request" }, 403);
    try {
      const body = await c.req.json().catch(() => ({}));
      await badgeHubData.insertProject({
        ...(body as any),
        slug: c.req.param("slug"),
        idp_user_id: user.idp_user_id,
      });
      return c.body(null, 204);
    } catch (e) {
      if (e instanceof ProjectAlreadyExistsError) return c.json({ reason: e.message }, 409);
      if (e instanceof UserError) return c.json({ reason: e.message }, 400);
      throw e;
    }
  });

  privateApp.patch("/projects/:slug", async (c) => {
    const slug = c.req.param("slug");
    const fail = await checkProjectAuthorization(badgeHubData, slug, c.get("user"), c.get("apiToken"));
    if (fail) return c.json({ reason: fail.reason }, fail.status as any);
    const body = await c.req.json().catch(() => ({}));
    await badgeHubData.updateProject(slug, body);
    return c.body(null, 204);
  });

  privateApp.delete("/projects/:slug", async (c) => {
    const slug = c.req.param("slug");
    const fail = await checkProjectAuthorization(badgeHubData, slug, c.get("user"), c.get("apiToken"));
    if (fail) return c.json({ reason: fail.reason }, fail.status as any);
    await badgeHubData.deleteProject(slug);
    return c.body(null, 204);
  });

  privateApp.patch("/projects/:slug/draft/metadata", async (c) => {
    const slug = c.req.param("slug");
    const fail = await checkProjectAuthorization(badgeHubData, slug, c.get("user"), c.get("apiToken"));
    if (fail) return c.json({ reason: fail.reason }, fail.status as any);
    const body = await c.req.json().catch(() => ({}));
    await badgeHubData.updateDraftMetadata(slug, body);
    return c.body(null, 204);
  });

  privateApp.get("/projects/:slug/draft", async (c) => {
    const slug = c.req.param("slug");
    const project = await badgeHubData.getProject(slug, "draft");
    if (!project) return c.json({ reason: `No project with slug '${slug}' found` }, 404);
    const fail = await checkProjectAuthorization(badgeHubData, slug, c.get("user"), c.get("apiToken"), project);
    if (fail) return c.json({ reason: fail.reason }, fail.status as any);
    return c.json(project);
  });

  privateApp.patch("/projects/:slug/publish", async (c) => {
    const slug = c.req.param("slug");
    const fail = await checkProjectAuthorization(badgeHubData, slug, c.get("user"), c.get("apiToken"));
    if (fail) return c.json({ reason: fail.reason }, fail.status as any);
    await badgeHubData.publishVersion(slug);
    return c.body(null, 204);
  });

  privateApp.post("/projects/:slug/draft/files/*", async (c) => {
    const slug = c.req.param("slug");
    const prefix = `/api/v3/projects/${slug}/draft/files/`;
    const filePath = decodeURIComponent(c.req.path.slice(prefix.length));
    const fail = await checkProjectAuthorization(badgeHubData, slug, c.get("user"), c.get("apiToken"));
    if (fail) return c.json({ reason: fail.reason }, fail.status as any);

    const formData = await c.req.parseBody();
    const file = formData["file"];
    if (!file || typeof file === "string") {
      return c.json({ reason: "No file provided with multipart/form-data under field file" }, 400);
    }
    if (file.size > MAX_UPLOAD_FILE_SIZE_BYTES) {
      return c.json({ reason: `File exceeds maximum size of ${MAX_UPLOAD_FILE_SIZE_BYTES} bytes` }, 413);
    }
    const fileContent = new Uint8Array(await file.arrayBuffer());
    const detectedMimeType = detectMimeType(file.type, filePath);
    await badgeHubData.writeDraftFile(slug, filePath, {
      mimetype: detectedMimeType,
      fileContent,
      directory: undefined,
      fileName: file.name,
      size: file.size,
    });
    return c.body(null, 204);
  });

  privateApp.post("/projects/:slug/draft/icon", async (c) => {
    const slug = c.req.param("slug");
    const project = await badgeHubData.getProject(slug, "draft");
    if (!project) return c.json({ reason: `No project with slug '${slug}' found` }, 404);
    const fail = await checkProjectAuthorization(badgeHubData, slug, c.get("user"), c.get("apiToken"), project);
    if (fail) return c.json({ reason: fail.reason }, fail.status as any);
    try {
      const body = await c.req.json().catch(() => ({}));
      const iconPaths = await badgeHubData.setDraftIconFromFile(slug, body.filePath, body.sizes, project);
      if (!iconPaths) {
        return c.json({ reason: `File '${body.filePath}' not found in draft project '${slug}'` }, 404);
      }
      return c.json({ iconPaths });
    } catch (error) {
      if (error instanceof UserError) return c.json({ reason: error.message }, 400);
      throw error;
    }
  });

  privateApp.delete("/projects/:slug/draft/files/*", async (c) => {
    const slug = c.req.param("slug");
    const prefix = `/api/v3/projects/${slug}/draft/files/`;
    const filePath = decodeURIComponent(c.req.path.slice(prefix.length));
    const fail = await checkProjectAuthorization(badgeHubData, slug, c.get("user"), c.get("apiToken"));
    if (fail) return c.json({ reason: fail.reason }, fail.status as any);
    await badgeHubData.deleteDraftFile(slug, filePath);
    return c.body(null, 204);
  });

  privateApp.get("/projects/:slug/draft/files/*", async (c) => {
    const slug = c.req.param("slug");
    const prefix = `/api/v3/projects/${slug}/draft/files/`;
    const filePath = decodeURIComponent(c.req.path.slice(prefix.length));
    const fail = await checkProjectAuthorization(badgeHubData, slug, c.get("user"), c.get("apiToken"));
    if (fail) return c.json({ reason: fail.reason }, fail.status as any);
    const fileContents = await badgeHubData.getFileContents(slug, "draft", filePath);
    if (!fileContents) {
      return c.json(
        { reason: `Project with slug '${slug}' or file '${filePath}' not found` },
        404,
      );
    }
    return c.body(fileContents);
  });

  privateApp.post("/projects/:slug/token", async (c) => {
    const slug = c.req.param("slug");
    const fail = await checkProjectAuthorization(badgeHubData, slug, c.get("user"), c.get("apiToken"));
    if (fail) return c.json({ reason: fail.reason }, fail.status as any);
    return c.json({ token: await badgeHubData.createProjectApiToken(slug) });
  });

  privateApp.get("/projects/:slug/token", async (c) => {
    const slug = c.req.param("slug");
    const fail = await checkProjectAuthorization(badgeHubData, slug, c.get("user"), c.get("apiToken"));
    if (fail) return c.json({ reason: fail.reason }, fail.status as any);
    const metadata = await badgeHubData.getProjectApiTokenMetadata(slug);
    if (!metadata) return c.json({ reason: "No Project API" }, 404);
    return c.json({ last_used_at: metadata.last_used_at, created_at: metadata.created_at });
  });

  privateApp.delete("/projects/:slug/token", async (c) => {
    const slug = c.req.param("slug");
    const fail = await checkProjectAuthorization(badgeHubData, slug, c.get("user"), c.get("apiToken"));
    if (fail) return c.json({ reason: fail.reason }, fail.status as any);
    await badgeHubData.revokeProjectAPIToken(slug);
    return c.body(null, 204);
  });

  privateApp.get("/users/:userId/drafts", async (c) => {
    const userId = c.req.param("userId");
    const reason = checkUserAuthorization(userId, c.get("user"));
    if (reason) return c.json({ reason }, 403);
    const q = c.req.query();
    const projects = await badgeHubData.getProjectSummaries(
      {
        pageStart: q.pageStart ? Number(q.pageStart) : undefined,
        pageLength: q.pageLength ? Number(q.pageLength) : undefined,
        userId,
        orderBy: "updated_at",
      },
      "draft",
    );
    return c.json(projects);
  });

  app.route("/api/v3", privateApp);
}
