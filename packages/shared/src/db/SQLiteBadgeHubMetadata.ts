import type { SqliteDb } from "@shared/db/SqliteDb";
import { safe } from "@shared/db/templateToSql";
import { getBadgeSlugs } from "@shared/domain/readModels/Badge";
import { getAllCategoryNames } from "@shared/domain/readModels/project/Category";
import type { BadgeHubStats } from "@shared/domain/readModels/BadgeHubStats";
import type { ProjectDetails } from "@shared/domain/readModels/project/ProjectDetails";
import { detailedProjectSchema } from "@shared/domain/readModels/project/ProjectDetails";
import type { ProjectSummary } from "@shared/domain/readModels/project/ProjectSummaries";
import type { RevisionNumberOrAlias, LatestOrDraftAlias } from "@shared/domain/readModels/project/Version";
import type { FileMetadata } from "@shared/domain/readModels/project/FileMetadata";
import type { UploadedFile } from "@shared/domain/UploadedFile";
import type { WriteAppMetadataJSON } from "@shared/domain/writeModels/AppMetadataJSON";
import type { CreateProjectProps } from "@shared/domain/writeModels/project/WriteProject";
import type { OrderByOption } from "@shared/domain/readModels/project/ordering";

const ONE_KILO = 1024;

/** Convert a SQLite datetime string (or ISO string) to an ISO 8601 string. */
function dbDateToISO(s: string | null | undefined): string | undefined {
  if (s == null) return undefined;
  const normalized = s.includes("T") ? s : s.replace(" ", "T") + "Z";
  return new Date(normalized).toISOString();
}

/** Join path segments with "/" separators, ignoring empty segments. */
function joinPath(...parts: string[]): string {
  return parts.filter(Boolean).join("/");
}

/** Split a path into { dir, name, ext } without depending on node:path. */
function parsePath(pathParts: string[]): { dir: string; name: string; ext: string } {
  const full = pathParts.join("/");
  const lastSlash = full.lastIndexOf("/");
  const filename = lastSlash >= 0 ? full.slice(lastSlash + 1) : full;
  const dir = lastSlash >= 0 ? full.slice(0, lastSlash) : "";
  const lastDot = filename.lastIndexOf(".");
  if (lastDot <= 0) return { dir, name: filename, ext: "" };
  return { dir, name: filename.slice(0, lastDot), ext: filename.slice(lastDot) };
}

export type FileUrlBuilder = (
  slug: string,
  revision: number | "draft" | "latest",
  filePath: string
) => string;

type MockDates = { created_at?: string | null; updated_at?: string | null };

type ProjectChanges = {
  git?: string | null;
  latest_revision?: number | null;
  draft_revision?: number | null;
  idp_user_id?: string | null;
  deleted_at?: string | null;
};

type ProjectSummaryQuery = {
  pageStart?: number;
  pageLength?: number;
  badge?: string;
  category?: string;
  search?: string;
  slugs?: string[];
  userId?: string;
  orderBy: OrderByOption;
};

export class SQLiteBadgeHubMetadata {
  constructor(
    private readonly db: SqliteDb,
    private readonly buildFileUrl: FileUrlBuilder
  ) {}

  async insertProject(project: CreateProjectProps, mockDates?: MockDates): Promise<void> {
    const createdAt = mockDates?.created_at ?? null;
    const updatedAt = mockDates?.updated_at ?? null;
    this.db.run`
      INSERT INTO projects (slug, git, idp_user_id, created_at, updated_at, deleted_at)
      VALUES (${project.slug}, ${project.git ?? null}, ${project.idp_user_id},
              COALESCE(${createdAt}, CURRENT_TIMESTAMP),
              COALESCE(${updatedAt}, CURRENT_TIMESTAMP), NULL)
      ON CONFLICT(slug)
      DO UPDATE SET
        git = excluded.git,
        idp_user_id = excluded.idp_user_id,
        updated_at = COALESCE(excluded.updated_at, CURRENT_TIMESTAMP),
        deleted_at = NULL`;

    this.db.run`
      INSERT INTO versions (project_slug, revision, app_metadata, published_at)
      VALUES (${project.slug}, 1, '{}', NULL)
      ON CONFLICT(project_slug, revision) DO NOTHING`;

    this.db.run`
      UPDATE projects
      SET draft_revision = COALESCE(draft_revision, 1),
          latest_revision = NULL
      WHERE slug = ${project.slug}`;
  }

  async updateProject(projectSlug: string, changes: ProjectChanges): Promise<void> {
    const allowedKeys = new Set(["git", "latest_revision", "draft_revision", "idp_user_id", "deleted_at"]);
    const entries = Object.entries(changes)
      .filter(([, value]) => value !== undefined)
      .filter(([key]) => allowedKeys.has(key));
    if (!entries.length) return;
    const setSql = entries.map(([key]) => `${key} = ?`).join(", ");
    const values = entries.map(([, value]) => value);
    this.db.runRaw(
      `UPDATE projects SET ${setSql}, updated_at = CURRENT_TIMESTAMP WHERE slug = ?`,
      [...values, projectSlug]
    );
  }

  async deleteProject(projectSlug: string): Promise<void> {
    this.db.run`UPDATE projects SET deleted_at = CURRENT_TIMESTAMP, updated_at = CURRENT_TIMESTAMP WHERE slug = ${projectSlug}`;
  }

  async publishVersion(projectSlug: string, mockDate?: string | null): Promise<void> {
    const publishAt = mockDate ?? null;

    const project = this.db.get<{ draft_revision: number | null }>`
      SELECT draft_revision FROM projects WHERE slug = ${projectSlug} AND deleted_at IS NULL`;
    if (!project || project.draft_revision === null) {
      throw new Error(`Project draft not found: ${projectSlug}`);
    }

    this.db.run`
      UPDATE versions
      SET published_at = COALESCE(${publishAt}, CURRENT_TIMESTAMP),
          updated_at = COALESCE(${publishAt}, CURRENT_TIMESTAMP)
      WHERE project_slug = ${projectSlug} AND revision = ${project.draft_revision}`;

    const nextDraftRevision = project.draft_revision + 1;
    this.db.run`
      INSERT INTO versions (project_slug, revision, app_metadata, published_at)
      SELECT project_slug, ${nextDraftRevision}, app_metadata, NULL
      FROM versions
      WHERE project_slug = ${projectSlug} AND revision = ${project.draft_revision}
      ON CONFLICT(project_slug, revision) DO NOTHING`;

    this.db.run`
      INSERT INTO files (version_id, dir, name, ext, mimetype, size_of_content, sha256,
                         image_width, image_height, created_at, updated_at, deleted_at)
      SELECT vTo.id, f.dir, f.name, f.ext, f.mimetype, f.size_of_content, f.sha256,
             f.image_width, f.image_height,
             COALESCE(${publishAt}, CURRENT_TIMESTAMP),
             COALESCE(${publishAt}, CURRENT_TIMESTAMP),
             f.deleted_at
      FROM files f
      JOIN versions vFrom ON vFrom.id = f.version_id
      JOIN versions vTo ON vTo.project_slug = vFrom.project_slug AND vTo.revision = ${nextDraftRevision}
      WHERE vFrom.project_slug = ${projectSlug} AND vFrom.revision = ${project.draft_revision}`;

    this.db.run`
      UPDATE projects
      SET latest_revision = ${project.draft_revision}, draft_revision = ${nextDraftRevision}
      WHERE slug = ${projectSlug}`;
  }

  async getProject(
    projectSlug: string,
    versionRevision: RevisionNumberOrAlias
  ): Promise<ProjectDetails | undefined> {
    const project = this.db.get<{
      slug: string;
      idp_user_id: string;
      latest_revision: number | null;
      created_at: string;
      updated_at: string;
    }>`SELECT slug, idp_user_id, latest_revision, created_at, updated_at
       FROM projects WHERE slug = ${projectSlug} AND deleted_at IS NULL`;

    if (!project) return undefined;

    type VersionRow = { revision: number; app_metadata: string; published_at: string | null };
    let versionRow: VersionRow | undefined;
    if (typeof versionRevision === "number") {
      versionRow = this.db.get<VersionRow>`
        SELECT revision, app_metadata, published_at
        FROM versions
        WHERE project_slug = ${projectSlug} AND revision = ${versionRevision}`;
    } else {
      versionRow = this.db.get<VersionRow>`
        SELECT revision, app_metadata, published_at
        FROM versions
        WHERE project_slug = ${projectSlug}
          AND revision = (
            SELECT CASE WHEN ${versionRevision} = 'draft' THEN draft_revision ELSE latest_revision END
            FROM projects WHERE slug = ${projectSlug}
          )`;
    }

    if (!versionRow) return undefined;
    if (typeof versionRevision === "number" && (versionRevision <= 0 || !versionRow.published_at)) {
      return undefined;
    }

    const files = this.db.all<{
      dir: string;
      name: string;
      ext: string;
      mimetype: string;
      size_of_content: string;
      sha256: string;
      image_width: number | null;
      image_height: number | null;
      created_at: string;
      updated_at: string;
    }>`SELECT dir, name, ext, mimetype, size_of_content, sha256,
              image_width, image_height, created_at, updated_at
       FROM files
       WHERE version_id = (SELECT id FROM versions WHERE project_slug = ${projectSlug} AND revision = ${versionRow.revision})
         AND deleted_at IS NULL`;

    const revision = versionRow.revision;
    const publishedAt = versionRow.published_at;
    return detailedProjectSchema.parse({
      slug: project.slug,
      idp_user_id: project.idp_user_id,
      latest_revision: project.latest_revision,
      created_at: dbDateToISO(project.created_at),
      updated_at: dbDateToISO(project.updated_at),
      version: {
        revision,
        project_slug: project.slug,
        app_metadata: JSON.parse(versionRow.app_metadata || "{}"),
        published_at: dbDateToISO(publishedAt),
        files: files.map((f) => {
          const full_path = joinPath(f.dir, f.name + f.ext);
          return {
            dir: f.dir,
            name: f.name,
            ext: f.ext,
            mimetype: f.mimetype,
            size_of_content: Number(f.size_of_content),
            sha256: f.sha256,
            image_width: f.image_width ?? undefined,
            image_height: f.image_height ?? undefined,
            created_at: dbDateToISO(f.created_at),
            updated_at: dbDateToISO(f.updated_at),
            size_formatted: (Number(f.size_of_content) / ONE_KILO).toFixed(2) + "KB",
            full_path,
            url: this.buildFileUrl(project.slug, publishedAt ? revision : "draft", full_path),
          };
        }),
      },
    });
  }

  async getFileMetadata(
    projectSlug: string,
    versionRevision: RevisionNumberOrAlias,
    filePath: string
  ): Promise<FileMetadata | undefined> {
    const { dir, name, ext } = parsePath(filePath.split("/"));

    const row = this.db.get<{
      dir: string;
      name: string;
      ext: string;
      mimetype: string;
      size_of_content: string;
      sha256: string;
      image_width: number | null;
      image_height: number | null;
      created_at: string;
      updated_at: string;
      revision: number;
      published_at: string | null;
    }>`SELECT f.*, v.revision, v.published_at
       FROM files f
       JOIN versions v ON v.id = f.version_id
       WHERE v.project_slug = ${projectSlug}
         AND v.revision = (
           SELECT CASE
                    WHEN ${versionRevision} = 'draft'  THEN draft_revision
                    WHEN ${versionRevision} = 'latest' THEN latest_revision
                    ELSE ${versionRevision}
                  END
           FROM projects WHERE slug = ${projectSlug}
         )
         AND f.dir = ${dir}
         AND f.name = ${name}
         AND f.ext = ${ext}
         AND f.deleted_at IS NULL`;

    if (!row) return undefined;
    if (typeof versionRevision === "number" && (versionRevision <= 0 || !row.published_at)) {
      return undefined;
    }
    const full_path = joinPath(row.dir, row.name + row.ext);
    return {
      dir: row.dir,
      name: row.name,
      ext: row.ext,
      mimetype: row.mimetype,
      size_of_content: Number(row.size_of_content),
      sha256: row.sha256,
      image_width: row.image_width ?? undefined,
      image_height: row.image_height ?? undefined,
      created_at: dbDateToISO(row.created_at) as string,
      updated_at: dbDateToISO(row.updated_at) as string,
      size_formatted: (Number(row.size_of_content) / ONE_KILO).toFixed(2) + "KB",
      full_path,
      url: this.buildFileUrl(projectSlug, row.published_at ? row.revision : "draft", full_path),
    };
  }

  async getBadges(): Promise<string[]> {
    return getBadgeSlugs();
  }

  async getCategories(): Promise<string[]> {
    return getAllCategoryNames();
  }

  async refreshReports(): Promise<void> {
    // No-op for SQLite: stats are read directly from the tables.
  }

  async getStats(): Promise<BadgeHubStats> {
    const count = (strings: TemplateStringsArray, ...values: unknown[]): number => {
      const row = this.db.get<{ count?: number | bigint | string }>(strings, ...values);
      return Number(row?.count ?? 0);
    };

    return {
      projects: count`SELECT COUNT(*) AS count FROM projects WHERE deleted_at IS NULL`,
      installs: count`SELECT COUNT(*) AS count FROM event_reports WHERE event_type = ${"install_count"}`,
      launches: count`SELECT COUNT(*) AS count FROM event_reports WHERE event_type = ${"launch_count"}`,
      crashes: count`SELECT COUNT(*) AS count FROM event_reports WHERE event_type = ${"crash_count"}`,
      installed_projects: count`SELECT COUNT(DISTINCT project_slug) AS count FROM event_reports WHERE event_type = ${"install_count"}`,
      launched_projects: count`SELECT COUNT(DISTINCT project_slug) AS count FROM event_reports WHERE event_type = ${"launch_count"}`,
      crashed_projects: count`SELECT COUNT(DISTINCT project_slug) AS count FROM event_reports WHERE event_type = ${"crash_count"}`,
      authors: count`SELECT COUNT(DISTINCT idp_user_id) AS count FROM projects WHERE deleted_at IS NULL AND idp_user_id IS NOT NULL`,
      badges: count`SELECT COUNT(*) AS count FROM registered_badges`,
    };
  }

  async getProjectSummaries(
    query: ProjectSummaryQuery,
    revision: LatestOrDraftAlias
  ): Promise<ProjectSummary[]> {
    const revisionCol = safe(revision === "draft" ? "p.draft_revision" : "p.latest_revision");

    const rows = this.db.all<{
      slug: string;
      idp_user_id: string;
      created_at: string;
      updated_at: string;
      git?: string;
      revision: number | null;
      published_at: string | null;
      app_metadata: string | null;
      distinct_installs: number | string;
    }>`SELECT p.slug,
              p.idp_user_id,
              p.created_at,
              p.updated_at,
              p.git,
              v.revision,
              v.published_at,
              v.app_metadata,
              (
                SELECT COUNT(DISTINCT er.badge_id)
                FROM event_reports er
                WHERE er.project_slug = p.slug
                  AND er.event_type = 'install_count'
              ) AS distinct_installs
       FROM projects p
       LEFT JOIN versions v ON v.project_slug = p.slug AND v.revision = ${revisionCol}
       WHERE p.deleted_at IS NULL`;

    let summaries = rows
      .filter((r) => r.revision !== null)
      .map((r) => {
        const metadata = JSON.parse(r.app_metadata || "{}") as Record<string, unknown>;
        const effectiveRevision = r.revision as number;
        const categories = Array.isArray(metadata.categories)
          ? (metadata.categories.length > 0 ? metadata.categories : ["Uncategorised"])
          : metadata.categories;
        return {
          slug: r.slug,
          idp_user_id: r.idp_user_id,
          name: (metadata.name as string) ?? r.slug,
          published_at: dbDateToISO(r.published_at ?? undefined) ?? undefined,
          installs: Number(r.distinct_installs ?? 0),
          icon_map: metadata.icon_map
            ? Object.fromEntries(
                Object.entries(metadata.icon_map as Record<string, unknown>).map(([key, fullPath]) => [
                  key,
                  {
                    full_path: String(fullPath),
                    url: this.buildFileUrl(r.slug, r.published_at ? effectiveRevision : "draft", String(fullPath)),
                  },
                ])
              )
            : undefined,
          license_type: metadata.license_type as string | undefined,
          categories: categories as string[] | undefined,
          badges: metadata.badges as string[] | undefined,
          description: metadata.description as string | undefined,
          revision: effectiveRevision,
          hidden: metadata.hidden as boolean | undefined,
        };
      });

    if (revision === "latest") {
      summaries = summaries.filter((s) => Boolean(s.published_at));
      if (!query.slugs?.length) {
        summaries = summaries.filter((s) => !s.hidden);
      }
    }

    if (query.badge) summaries = summaries.filter((s) => s.badges?.includes(query.badge!));
    if (query.category) summaries = summaries.filter((s) => (s.categories as string[] | undefined)?.includes(query.category!));
    if (query.search) {
      const searchLower = query.search.toLowerCase();
      summaries = summaries.filter((s) => {
        const text = [s.name, s.description ?? "", ...((s.categories as string[] | undefined) ?? [])].join(" ").toLowerCase();
        return text.includes(searchLower);
      });
    }
    if (query.slugs?.length) summaries = summaries.filter((s) => query.slugs!.includes(s.slug));
    if (query.userId) summaries = summaries.filter((s) => s.idp_user_id === query.userId);

    if (query.orderBy === "installs") summaries.sort((a, b) => b.installs - a.installs);
    if (query.orderBy === "published_at") summaries.sort((a, b) => (b.published_at ?? "").localeCompare(a.published_at ?? ""));
    if (query.orderBy === "updated_at") summaries.sort((a, b) => b.revision - a.revision);

    const start = query.pageStart ?? 0;
    const end = query.pageLength ? start + query.pageLength : undefined;
    return summaries.slice(start, end) as ProjectSummary[];
  }

  async updateDraftMetadata(
    slug: string,
    newAppMetadata: WriteAppMetadataJSON,
    _mockDates?: MockDates
  ): Promise<void> {
    this.db.run`
      UPDATE versions
      SET app_metadata = ${JSON.stringify(newAppMetadata ?? {})}, updated_at = CURRENT_TIMESTAMP
      WHERE project_slug = ${slug}
        AND revision = (SELECT draft_revision FROM projects WHERE slug = ${slug})`;
  }

  async writeDraftFileMetadata(
    slug: string,
    pathParts: string[],
    uploadedFile: UploadedFile,
    sha256: string,
    _mockDates?: MockDates
  ): Promise<void> {
    const { dir, name, ext } = parsePath(pathParts);
    this.db.run`
      INSERT INTO files (version_id, dir, name, ext, mimetype, size_of_content, sha256,
                         image_width, image_height, deleted_at)
      VALUES (
        (SELECT id FROM versions
         WHERE project_slug = ${slug}
           AND revision = (SELECT draft_revision FROM projects WHERE slug = ${slug})),
        ${dir}, ${name}, ${ext},
        ${uploadedFile.mimetype}, ${uploadedFile.size}, ${sha256},
        ${uploadedFile.image_width ?? null}, ${uploadedFile.image_height ?? null},
        NULL
      )
      ON CONFLICT(version_id, dir, name, ext)
      DO UPDATE SET
        mimetype = excluded.mimetype,
        size_of_content = excluded.size_of_content,
        sha256 = excluded.sha256,
        image_width = excluded.image_width,
        image_height = excluded.image_height,
        deleted_at = NULL,
        updated_at = CURRENT_TIMESTAMP`;
  }

  async deleteDraftFile(slug: string, filePath: string): Promise<void> {
    const { dir, name, ext } = parsePath(filePath.split("/"));
    this.db.run`
      UPDATE files
      SET deleted_at = CURRENT_TIMESTAMP, updated_at = CURRENT_TIMESTAMP
      WHERE version_id = (
        SELECT id FROM versions
        WHERE project_slug = ${slug}
          AND revision = (SELECT draft_revision FROM projects WHERE slug = ${slug})
      )
        AND dir = ${dir}
        AND name = ${name}
        AND ext = ${ext}`;
  }

  async registerBadge(flashId: string, mac: string | undefined): Promise<void> {
    this.db.run`
      INSERT INTO registered_badges (id, mac)
      VALUES (${flashId}, ${mac ?? null})
      ON CONFLICT(id)
      DO UPDATE SET
        mac = COALESCE(registered_badges.mac, excluded.mac),
        last_seen_at = CURRENT_TIMESTAMP`;
  }

  async reportEvent(
    slug: string,
    revision: number,
    badgeId: string,
    eventType: "install_count" | "launch_count" | "crash_count"
  ): Promise<void> {
    this.db.run`INSERT INTO event_reports (project_slug, revision, badge_id, event_type)
                VALUES (${slug}, ${revision}, ${badgeId}, ${eventType})`;
  }

  async revokeProjectApiToken(slug: string): Promise<void> {
    this.db.run`DELETE FROM project_api_token WHERE project_slug = ${slug}`;
  }

  async getProjectApiTokenMetadata(
    slug: string
  ): Promise<{ created_at: string; last_used_at: string | null } | undefined> {
    return this.db.get`SELECT created_at, last_used_at FROM project_api_token WHERE project_slug = ${slug}`;
  }

  async createProjectApiToken(slug: string, tokenHash: string): Promise<void> {
    this.db.run`
      INSERT INTO project_api_token (project_slug, key_hash, created_at, last_used_at)
      VALUES (${slug}, ${tokenHash}, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP)
      ON CONFLICT(project_slug)
      DO UPDATE SET
        key_hash = excluded.key_hash,
        created_at = CURRENT_TIMESTAMP,
        last_used_at = CURRENT_TIMESTAMP`;
  }

  async getProjectApiTokenHash(slug: string): Promise<string | undefined> {
    const row = this.db.get<{ key_hash: string }>`SELECT key_hash FROM project_api_token WHERE project_slug = ${slug}`;
    return row?.key_hash;
  }
}
