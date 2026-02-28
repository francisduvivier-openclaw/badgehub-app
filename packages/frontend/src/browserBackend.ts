import initSqlJs, { type Database } from "sql.js";
import sqlWasmUrl from "sql.js/dist/sql-wasm.wasm?url";
import { ApiFetcherArgs, initClient } from "@ts-rest/core";
import { tsRestApiContracts } from "@shared/contracts/restContracts.ts";
import { matchRoute } from "@api/routeContractMatch.ts";
import type { ProjectSummary } from "@shared/domain/readModels/project/ProjectSummaries.ts";
import type { ProjectDetails } from "@shared/domain/readModels/project/ProjectDetails.ts";
import {
  createProjectHandler,
  getBadgesHandler,
  getCategoriesHandler,
  getLatestPublishedFileHandler,
  getProjectHandler,
  getProjectSummariesHandler,
  getStatsHandler,
  pingHandler,
  publishProjectHandler,
  type BackendDataAccess,
} from "@shared/api/backendCoreHandlers.ts";

const PREVIEW_AUTHOR = "preview-user";
const PREVIEW_BADGE = "why2025";
const PREVIEW_CATEGORY = "Default";

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

async function createBackendDb(): Promise<Database> {
  const SQL = await initSqlJs({
    locateFile: () => sqlWasmUrl,
  });
  const db = new SQL.Database();
  seed(db);
  return db;
}

let dbPromise: Promise<Database> | undefined;
function getDb(): Promise<Database> {
  if (!dbPromise) dbPromise = createBackendDb();
  return dbPromise;
}

function findProject(db: Database, slug: string): ProjectRow | null {
  return firstRow<ProjectRow>(
    db,
    `SELECT ${PROJECT_COLUMNS} FROM projects WHERE slug = ?`,
    [slug],
  );
}

async function createDataAccess(): Promise<BackendDataAccess> {
  const db = await getDb();
  return {
    getBadges: async () => [PREVIEW_BADGE],
    getCategories: async () => [PREVIEW_CATEGORY],
    registerBadge: async () => {},
    getStats: async () => {
      const row = firstRow<{ n: number }>(db, "SELECT COUNT(*) AS n FROM projects");
      return {
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
    },
    getProjectSummaries: async () => {
      const rows = allRows<ProjectRow>(
        db,
        `SELECT ${PROJECT_COLUMNS} FROM projects ORDER BY updatedAt DESC`,
      );
      return rows.map(toSummary);
    },
    getProject: async (slug) => {
      const row = findProject(db, slug);
      return row ? toDetails(row) : undefined;
    },
    getFileContents: async (slug, _revision, filePath) => {
      const project = firstRow<{ publishedRevision: number }>(
        db,
        "SELECT publishedRevision FROM projects WHERE slug = ?",
        [slug],
      );
      if (!project) return undefined;
      const file = firstRow<{ content: string }>(
        db,
        "SELECT content FROM project_files WHERE slug = ? AND revision = ? AND filePath = ?",
        [slug, project.publishedRevision, filePath],
      );
      return file ? new TextEncoder().encode(file.content) : undefined;
    },
    insertProject: async (project) => {
      const now = new Date().toISOString();
      const metadata = {
        name: project.slug,
        description: "",
        categories: [PREVIEW_CATEGORY],
        badges: [PREVIEW_BADGE],
        author: PREVIEW_AUTHOR,
      };
      db.run(
        `INSERT INTO projects (slug, name, description, category, badges, authorId, metadataJson, updatedAt, createdAt)
         VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
        [
          project.slug,
          String(metadata.name),
          String(metadata.description),
          metadata.categories[0] ?? PREVIEW_CATEGORY,
          JSON.stringify(metadata.badges),
          PREVIEW_AUTHOR,
          JSON.stringify(metadata),
          now,
          now,
        ],
      );
    },
    publishVersion: async (slug) => {
      const now = new Date().toISOString();
      db.run(
        "UPDATE projects SET publishedRevision = draftRevision, draftRevision = draftRevision + 1, updatedAt = ? WHERE slug = ?",
        [now, slug],
      );
    },
  };
}

function notFound(reason = "Not found") {
  return { status: 404 as const, body: { reason }, headers: new Headers() };
}

export function createBrowserBackedClient() {
  getDb();

  return initClient(tsRestApiContracts, {
    baseUrl: "",
    api: async (args: ApiFetcherArgs) => {
      const data = await createDataAccess();

      if (matchRoute(args, tsRestApiContracts.ping)) {
        const response = await pingHandler(data);
        return { ...response, headers: new Headers() };
      }
      if (matchRoute(args, tsRestApiContracts.getBadges)) {
        const response = await getBadgesHandler(data);
        return { ...response, headers: new Headers() };
      }
      if (matchRoute(args, tsRestApiContracts.getCategories)) {
        const response = await getCategoriesHandler(data);
        return { ...response, headers: new Headers() };
      }
      if (matchRoute(args, tsRestApiContracts.getStats)) {
        const response = await getStatsHandler(data);
        return { ...response, headers: new Headers() };
      }

      if (matchRoute(args, tsRestApiContracts.getProjectSummaries)) {
        const response = await getProjectSummariesHandler(data, args.rawQuery ?? {});
        return { ...response, headers: new Headers() };
      }

      const projectMatch = matchRoute(args, tsRestApiContracts.getProject);
      if (projectMatch) {
        const response = await getProjectHandler(data, projectMatch.get("slug")!);
        return { ...response, headers: new Headers() };
      }

      const fileMatch = matchRoute(args, tsRestApiContracts.getLatestPublishedFile);
      if (fileMatch) {
        const response = await getLatestPublishedFileHandler(
          data,
          fileMatch.get("slug")!,
          fileMatch.get("filePath")!,
        );
        if (response.status !== 200) return { ...response, headers: new Headers() };
        return {
          status: 200,
          body: new TextDecoder().decode(response.body),
          headers: new Headers(),
        };
      }

      const createMatch = matchRoute(args, tsRestApiContracts.createProject);
      if (createMatch) {
        const response = await createProjectHandler(
          data,
          createMatch.get("slug")!,
          (args.body ?? {}) as any,
          PREVIEW_AUTHOR,
        );
        return { ...response, headers: new Headers() };
      }

      const draftMatch = matchRoute(args, tsRestApiContracts.getDraftProject);
      if (draftMatch) {
        const response = await getProjectHandler(data, draftMatch.get("slug")!, "draft");
        return { ...response, headers: new Headers() };
      }

      const publishMatch = matchRoute(args, tsRestApiContracts.publishVersion);
      if (publishMatch) {
        const response = await publishProjectHandler(data, publishMatch.get("slug")!);
        return { ...response, headers: new Headers() };
      }

      return notFound(
        `Browser backend route not implemented: ${args.method} ${args.path}`,
      );
    },
  });
}
