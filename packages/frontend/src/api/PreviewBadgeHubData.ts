import type { BackendDataAccess } from "@shared/api/backendCoreHandlers";
import type { SQLiteBadgeHubMetadata } from "@shared/db/SQLiteBadgeHubMetadata";
import type { BadgeSlug } from "@shared/domain/readModels/Badge";
import type { CategoryName } from "@shared/domain/readModels/project/Category";
import type { ProjectSummary } from "@shared/domain/readModels/project/ProjectSummaries";
import type { ProjectDetails } from "@shared/domain/readModels/project/ProjectDetails";
import type { BadgeHubStats } from "@shared/domain/readModels/BadgeHubStats";
import type { OrderByOption } from "@shared/domain/readModels/project/ordering";
import type { CreateProjectProps } from "@shared/domain/writeModels/project/WriteProject";

/**
 * Thin BackendDataAccess adapter that delegates all metadata queries to
 * SQLiteBadgeHubMetadata.  The same SQL runs here as in the real backend —
 * the only difference from production is that the underlying SqliteDb
 * implementation is SqlJsAdapter (sql.js / browser) rather than
 * NodeSqliteAdapter (node:sqlite).
 *
 * File-content retrieval is a no-op because the preview SW does not serve
 * binary files.
 */
export class PreviewBadgeHubData implements BackendDataAccess {
  constructor(private readonly metadata: SQLiteBadgeHubMetadata) {}

  getBadges(): Promise<BadgeSlug[]> {
    return this.metadata.getBadges();
  }

  getCategories(): Promise<CategoryName[]> {
    return this.metadata.getCategories();
  }

  getStats(): Promise<BadgeHubStats> {
    return this.metadata.getStats();
  }

  registerBadge(id: string, mac?: string): Promise<void> {
    return this.metadata.registerBadge(id, mac);
  }

  getProject(slug: string, revision: "latest" | "draft"): Promise<ProjectDetails | undefined> {
    return this.metadata.getProject(slug, revision);
  }

  getProjectSummaries(
    query: {
      pageStart?: number;
      pageLength?: number;
      badge?: BadgeSlug;
      category?: CategoryName;
      search?: string;
      slugs?: string[];
      userId?: string;
      orderBy: OrderByOption;
    },
    revision: "latest" | "draft"
  ): Promise<ProjectSummary[]> {
    return this.metadata.getProjectSummaries(query, revision);
  }

  // Files are not served in the preview SW
  async getFileContents(): Promise<undefined> {
    return undefined;
  }

  async insertProject(_project: CreateProjectProps): Promise<void> {
    // no-op in preview
  }

  async publishVersion(_slug: string): Promise<void> {
    // no-op in preview
  }

  async reportInstall(): Promise<void> {
    // no-op in preview
  }

  async reportLaunch(): Promise<void> {
    // no-op in preview
  }

  async reportCrash(): Promise<void> {
    // no-op in preview
  }
}
