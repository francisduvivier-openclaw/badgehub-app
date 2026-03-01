import type { BadgeSlug } from "@shared/domain/readModels/Badge";
import type { CategoryName } from "@shared/domain/readModels/project/Category";
import type { BadgeHubStats } from "@shared/domain/readModels/BadgeHubStats";
import type { ProjectDetails } from "@shared/domain/readModels/project/ProjectDetails";
import type { ProjectSummary } from "@shared/domain/readModels/project/ProjectSummaries";
import type { CreateProjectProps } from "@shared/domain/writeModels/project/WriteProject";

export type Ok<T> = { status: 200; body: T };
export type NoContent = { status: 204; body: undefined };
export type Nok<T extends number = number> = { status: T; body: { reason: string } };

export type BackendDataAccess = {
  getBadges(): Promise<BadgeSlug[]>;
  getCategories(): Promise<CategoryName[]>;
  registerBadge(id: string, mac?: string): Promise<void>;
  getStats(): Promise<BadgeHubStats>;
  getProjectSummaries(query: {
    pageStart?: number;
    pageLength?: number;
    badge?: BadgeSlug;
    category?: CategoryName;
    search?: string;
    slugs?: string[];
    userId?: string;
    orderBy: "published_at" | "updated_at" | "installs";
  }, revision: "latest" | "draft"): Promise<ProjectSummary[]>;
  getProject(slug: string, revision: "latest" | "draft"): Promise<ProjectDetails | undefined>;
  getFileContents(slug: string, revision: "latest", filePath: string): Promise<Uint8Array | undefined>;
  insertProject(project: CreateProjectProps): Promise<void>;
  publishVersion(slug: string): Promise<void>;
};

export async function getBadgesHandler(data: BackendDataAccess): Promise<Ok<BadgeSlug[]>> {
  return { status: 200, body: await data.getBadges() };
}

export async function getCategoriesHandler(data: BackendDataAccess): Promise<Ok<CategoryName[]>> {
  return { status: 200, body: await data.getCategories() };
}

export async function pingHandler(data: BackendDataAccess, id?: string, mac?: string): Promise<Ok<string>> {
  if (id) await data.registerBadge(id, mac);
  return { status: 200, body: "pong" };
}

export async function getStatsHandler(data: BackendDataAccess): Promise<Ok<BadgeHubStats>> {
  return { status: 200, body: await data.getStats() };
}

export async function getProjectSummariesHandler(
  data: BackendDataAccess,
  query: {
    pageStart?: number;
    pageLength?: number;
    badge?: BadgeSlug;
    category?: CategoryName;
    search?: string;
    slugs?: string;
    userId?: string;
    orderBy?: "published_at" | "updated_at" | "installs";
  },
  revision: "latest" | "draft" = "latest",
): Promise<Ok<ProjectSummary[]>> {
  const slugs = query.slugs?.split(",") || [];
  return {
    status: 200,
    body: await data.getProjectSummaries(
      { ...query, slugs, orderBy: query.orderBy ?? "published_at" },
      revision,
    ),
  };
}

export async function getProjectHandler(
  data: BackendDataAccess,
  slug: string,
  revision: "latest" | "draft" = "latest",
): Promise<Ok<ProjectDetails> | Nok<404>> {
  const project = await data.getProject(slug, revision);
  if (!project) return { status: 404, body: { reason: `No project with slug '${slug}' found` } };
  return { status: 200, body: project };
}

export async function getLatestPublishedFileHandler(
  data: BackendDataAccess,
  slug: string,
  filePath: string,
): Promise<Ok<Uint8Array> | Nok<404>> {
  const file = await data.getFileContents(slug, "latest", filePath);
  if (!file) return { status: 404, body: { reason: `No app with slug '${slug}' found` } };
  return { status: 200, body: file };
}

export async function createProjectHandler(
  data: BackendDataAccess,
  slug: string,
  props: CreateProjectProps,
  userId: string,
): Promise<NoContent> {
  await data.insertProject({ ...props, slug, idp_user_id: userId });
  return { status: 204, body: undefined };
}

export async function publishProjectHandler(data: BackendDataAccess, slug: string): Promise<NoContent> {
  await data.publishVersion(slug);
  return { status: 204, body: undefined };
}
