import initSqlJs, { type Database } from "sql.js";
import { ApiFetcherArgs, initClient } from "@ts-rest/core";
import { tsRestApiContracts } from "@shared/contracts/restContracts.ts";
import { matchRoute } from "@api/routeContractMatch.ts";
import type { ProjectSummary } from "@shared/domain/readModels/project/ProjectSummaries.ts";
import type { ProjectDetails } from "@shared/domain/readModels/project/ProjectDetails.ts";
import type { BadgeHubStats } from "@shared/domain/readModels/BadgeHubStats.ts";

const PREVIEW_AUTHOR = "preview-user";
const PREVIEW_BADGE = "fri3d-badge";
const PREVIEW_CATEGORY = "tools";

function seed(db: Database) {
  db.run(`
    CREATE TABLE IF NOT EXISTS projects (
      slug TEXT PRIMARY KEY,
      name TEXT NOT NULL,
      description TEXT NOT NULL,
      category TEXT NOT NULL,
      badges TEXT NOT NULL,
      authorId TEXT NOT NULL,
      publishedRevision INTEGER NOT NULL DEFAULT 1,
      draftRevision INTEGER NOT NULL DEFAULT 2,
      metadataJson TEXT NOT NULL,
      updatedAt TEXT NOT NULL,
      createdAt TEXT NOT NULL
    );
  `);

  db.run(`
    CREATE TABLE IF NOT EXISTS project_files (
      slug TEXT NOT NULL,
      revision INTEGER NOT NULL,
      filePath TEXT NOT NULL,
      content TEXT NOT NULL,
      PRIMARY KEY (slug, revision, filePath)
    );
  `);

  const now = new Date().toISOString();
  const metadata = {
    name: "Demo App",
    description: "Preview app backed by in-browser sqlite",
    categories: [PREVIEW_CATEGORY],
    badges: [PREVIEW_BADGE],
    author: PREVIEW_AUTHOR,
  };

  db.run(
    `INSERT OR IGNORE INTO projects (slug, name, description, category, badges, authorId, metadataJson, updatedAt, createdAt)
     VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
    [
      "demo-app",
      metadata.name,
      metadata.description,
      PREVIEW_CATEGORY,
      JSON.stringify(metadata.badges),
      metadata.author,
      JSON.stringify(metadata),
      now,
      now,
    ],
  );

  db.run(
    `INSERT OR IGNORE INTO project_files (slug, revision, filePath, content) VALUES (?, ?, ?, ?)`,
    ["demo-app", 1, "main.py", "print('hello from github pages preview')\n"],
  );
}

function firstRow<T extends Record<string, unknown>>(
  db: Database,
  sql: string,
  params: unknown[] = [],
): T | null {
  const stmt = db.prepare(sql, params);
  try {
    if (!stmt.step()) return null;
    return stmt.getAsObject() as T;
  } finally {
    stmt.free();
  }
}

function allRows<T extends Record<string, unknown>>(
  db: Database,
  sql: string,
  params: unknown[] = [],
): T[] {
  const stmt = db.prepare(sql, params);
  const out: T[] = [];
  try {
    while (stmt.step()) out.push(stmt.getAsObject() as T);
  } finally {
    stmt.free();
  }
  return out;
}

type ProjectRow = {
  slug: string;
  name: string;
  description: string;
  category: string;
  badges: string;
  authorId: string;
  publishedRevision: number;
  draftRevision: number;
  metadataJson: string;
  updatedAt: string;
  createdAt: string;
};

const PROJECT_COLUMNS =
  "slug, name, description, category, badges, authorId, publishedRevision, draftRevision, metadataJson, updatedAt, createdAt";

function toSummary(row: ProjectRow): ProjectSummary {
  const metadata = JSON.parse(row.metadataJson) as Record<string, unknown>;
  return {
    slug: row.slug,
    idp_user_id: row.authorId,
    name: (metadata.name as string) ?? row.slug,
    description: (metadata.description as string) ?? row.description,
    categories: (metadata.categories as string[]) ?? [row.category],
    badges: (metadata.badges as string[]) ?? JSON.parse(row.badges),
    revision: row.publishedRevision,
    published_at: row.updatedAt,
    installs: 0,
    license_type: (metadata.license_type as string) ?? undefined,
  };
}

function toDetails(row: ProjectRow): ProjectDetails {
  const metadata = JSON.parse(row.metadataJson) as Record<string, unknown>;
  return {
    slug: row.slug,
    idp_user_id: row.authorId,
    latest_revision: row.publishedRevision,
    created_at: row.createdAt,
    updated_at: row.updatedAt,
    version: {
      revision: row.publishedRevision,
      project_slug: row.slug,
      published_at: row.updatedAt,
      files: [],
      app_metadata: {
        name: (metadata.name as string) ?? row.name,
        description: (metadata.description as string) ?? row.description,
        categories: (metadata.categories as string[]) ?? [row.category],
        badges: (metadata.badges as string[]) ?? JSON.parse(row.badges),
        author: (metadata.author as string) ?? row.authorId,
      },
    },
  };
}

function notFound(reason = "Not found") {
  return { status: 404 as const, body: { reason }, headers: new Headers() };
}

async function createBackendDb(): Promise<Database> {
  const SQL = await initSqlJs({
    locateFile: (file) =>
      `https://cdn.jsdelivr.net/npm/sql.js@1.12.0/dist/${file}`,
  });
  const db = new SQL.Database();
  seed(db);
  return db;
}

// Lazy-initialized: WASM loads in the background, blocks only on first API call
let dbPromise: Promise<Database> | undefined;
function getDb(): Promise<Database> {
  if (!dbPromise) {
    dbPromise = createBackendDb();
  }
  return dbPromise;
}

function findProject(db: Database, slug: string): ProjectRow | null {
  return firstRow<ProjectRow>(
    db,
    `SELECT ${PROJECT_COLUMNS} FROM projects WHERE slug = ?`,
    [slug],
  );
}

export function createBrowserBackedClient() {
  // Start loading WASM eagerly so it's ready when the first API call arrives
  getDb();

  return initClient(tsRestApiContracts, {
    baseUrl: "",
    api: async (args: ApiFetcherArgs) => {
      const db = await getDb();

      // --- Public: misc ---

      if (matchRoute(args, tsRestApiContracts.ping)) {
        return { status: 200, body: "pong", headers: new Headers() };
      }

      if (matchRoute(args, tsRestApiContracts.getBadges)) {
        return {
          status: 200,
          body: [PREVIEW_BADGE],
          headers: new Headers(),
        };
      }

      if (matchRoute(args, tsRestApiContracts.getCategories)) {
        return {
          status: 200,
          body: [PREVIEW_CATEGORY],
          headers: new Headers(),
        };
      }

      if (matchRoute(args, tsRestApiContracts.getStats)) {
        const row = firstRow<{ n: number }>(
          db,
          "SELECT COUNT(*) AS n FROM projects",
        );
        const stats: BadgeHubStats = {
          projects: row?.n ?? 0,
          installs: 0,
          crashes: 0,
          launches: 0,
          installed_projects: 0,
          launched_projects: 0,
          crashed_projects: 0,
          authors: 0,
          badges: 0,
        };
        return { status: 200, body: stats, headers: new Headers() };
      }

      // --- Public: project summaries ---

      if (matchRoute(args, tsRestApiContracts.getProjectSummaries)) {
        const rows = allRows<ProjectRow>(
          db,
          `SELECT ${PROJECT_COLUMNS} FROM projects ORDER BY updatedAt DESC`,
        );
        const summaries = rows.map(toSummary);
        return { status: 200, body: summaries, headers: new Headers() };
      }

      // --- Public: project details ---

      const projectMatch = matchRoute(args, tsRestApiContracts.getProject);
      if (projectMatch) {
        const slug = projectMatch.get("slug")!;
        const row = findProject(db, slug);
        if (!row) return notFound("Project not found");
        return { status: 200, body: toDetails(row), headers: new Headers() };
      }

      // --- Public: files ---

      const fileMatch = matchRoute(
        args,
        tsRestApiContracts.getLatestPublishedFile,
      );
      if (fileMatch) {
        const slug = fileMatch.get("slug")!;
        const filePath = fileMatch.get("filePath")!;
        const project = firstRow<{ publishedRevision: number }>(
          db,
          "SELECT publishedRevision FROM projects WHERE slug = ?",
          [slug],
        );
        if (!project) return notFound("Project not found");
        const file = firstRow<{ content: string }>(
          db,
          "SELECT content FROM project_files WHERE slug = ? AND revision = ? AND filePath = ?",
          [slug, project.publishedRevision, filePath],
        );
        if (!file) return notFound("File not found");
        return { status: 200, body: file.content, headers: new Headers() };
      }

      // --- Private: create project ---

      const createMatch = matchRoute(
        args,
        tsRestApiContracts.createProject,
      );
      if (createMatch) {
        const slug = createMatch.get("slug")!;
        const now = new Date().toISOString();
        const body = (args.body ?? {}) as Record<string, unknown>;
        const metadata = {
          name: (body.name as string) ?? slug,
          description: (body.description as string) ?? "",
          categories: (body.categories as string[]) ?? [PREVIEW_CATEGORY],
          badges: (body.badges as string[]) ?? [PREVIEW_BADGE],
          author: PREVIEW_AUTHOR,
        };
        db.run(
          `INSERT INTO projects (slug, name, description, category, badges, authorId, metadataJson, updatedAt, createdAt)
           VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
          [
            slug,
            String(metadata.name),
            String(metadata.description),
            (metadata.categories[0] ?? PREVIEW_CATEGORY),
            JSON.stringify(metadata.badges),
            metadata.author,
            JSON.stringify(metadata),
            now,
            now,
          ],
        );
        return { status: 204, body: undefined, headers: new Headers() };
      }

      // --- Private: get draft ---

      const draftMatch = matchRoute(
        args,
        tsRestApiContracts.getDraftProject,
      );
      if (draftMatch) {
        const slug = draftMatch.get("slug")!;
        const row = findProject(db, slug);
        if (!row) return notFound("Project not found");
        return { status: 200, body: toDetails(row), headers: new Headers() };
      }

      // --- Private: publish ---

      const publishMatch = matchRoute(
        args,
        tsRestApiContracts.publishVersion,
      );
      if (publishMatch) {
        const slug = publishMatch.get("slug")!;
        const now = new Date().toISOString();
        db.run(
          "UPDATE projects SET publishedRevision = draftRevision, draftRevision = draftRevision + 1, updatedAt = ? WHERE slug = ?",
          [now, slug],
        );
        return { status: 204, body: undefined, headers: new Headers() };
      }

      // Unhandled route
      return notFound(
        `Browser backend route not implemented: ${args.method} ${args.path}`,
      );
    },
  });
}
