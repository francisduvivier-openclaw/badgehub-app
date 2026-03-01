import initSqlJs from "sql.js";
import { ApiFetcherArgs, initClient } from "@ts-rest/core";
import { tsRestApiContracts } from "@shared/contracts/restContracts.ts";
import { matchRoute } from "@api/routeContractMatch.ts";
import { SqlJsAdapter } from "@db/SqlJsAdapter.ts";
import { SQLiteBadgeHubMetadata } from "@shared/db/SQLiteBadgeHubMetadata.ts";
import { BADGEHUB_SCHEMA_SQL } from "@shared/db/sqliteSchema.ts";
import type { OrderByOption } from "@shared/domain/readModels/project/ordering.ts";

const PREVIEW_AUTHOR = "preview-user";
const PREVIEW_BADGE = "fri3d-badge";
const PREVIEW_CATEGORY = "tools";

async function createMetadata(): Promise<SQLiteBadgeHubMetadata> {
  const SQL = await initSqlJs({
    locateFile: (file) =>
      `https://cdn.jsdelivr.net/npm/sql.js@1.12.0/dist/${file}`,
  });
  const db = new SQL.Database();
  const adapter = new SqlJsAdapter(db);
  adapter.exec(BADGEHUB_SCHEMA_SQL);

  const metadata = new SQLiteBadgeHubMetadata(adapter, () => "http://localhost/preview-only");
  await metadata.insertProject({ slug: "demo-app", idp_user_id: PREVIEW_AUTHOR });
  await metadata.updateDraftMetadata("demo-app", {
    name: "Demo App",
    description: "Preview app backed by in-browser sqlite",
    categories: [PREVIEW_CATEGORY],
    badges: [PREVIEW_BADGE],
  });
  await metadata.publishVersion("demo-app");
  return metadata;
}

// Lazy-initialized: WASM loads in the background, blocks only on first API call
let metadataPromise: Promise<SQLiteBadgeHubMetadata> | undefined;
function getMetadata(): Promise<SQLiteBadgeHubMetadata> {
  if (!metadataPromise) {
    metadataPromise = createMetadata();
  }
  return metadataPromise;
}

function notFound(reason = "Not found") {
  return { status: 404 as const, body: { reason }, headers: new Headers() };
}

export function createBrowserBackedClient() {
  // Start loading WASM eagerly so it's ready when the first API call arrives
  getMetadata();

  return initClient(tsRestApiContracts, {
    baseUrl: "",
    api: async (args: ApiFetcherArgs) => {
      const metadata = await getMetadata();

      // --- Public: misc ---

      if (matchRoute(args, tsRestApiContracts.ping)) {
        return { status: 200, body: "pong", headers: new Headers() };
      }

      if (matchRoute(args, tsRestApiContracts.getBadges)) {
        return { status: 200, body: await metadata.getBadges(), headers: new Headers() };
      }

      if (matchRoute(args, tsRestApiContracts.getCategories)) {
        return { status: 200, body: await metadata.getCategories(), headers: new Headers() };
      }

      if (matchRoute(args, tsRestApiContracts.getStats)) {
        return { status: 200, body: await metadata.getStats(), headers: new Headers() };
      }

      // --- Public: project summaries ---

      if (matchRoute(args, tsRestApiContracts.getProjectSummaries)) {
        const url = new URL(args.path, "http://localhost");
        const sp = url.searchParams;
        const query = {
          badge: sp.get("badge") ?? undefined,
          category: sp.get("category") ?? undefined,
          search: sp.get("search") ?? undefined,
          slugs: sp.get("slugs")?.split(",").filter(Boolean),
          userId: sp.get("userId") ?? undefined,
          orderBy: (sp.get("orderBy") ?? "installs") as OrderByOption,
          pageStart: sp.has("pageStart") ? Number(sp.get("pageStart")) : undefined,
          pageLength: sp.has("pageLength") ? Number(sp.get("pageLength")) : undefined,
        };
        const summaries = await metadata.getProjectSummaries(query, "latest");
        return { status: 200, body: summaries, headers: new Headers() };
      }

      // --- Public: project details ---

      const projectMatch = matchRoute(args, tsRestApiContracts.getProject);
      if (projectMatch) {
        const slug = projectMatch.get("slug")!;
        const project = await metadata.getProject(slug, "latest");
        if (!project) return notFound("Project not found");
        return { status: 200, body: project, headers: new Headers() };
      }

      // --- Public: files (not served in browser preview) ---

      if (matchRoute(args, tsRestApiContracts.getLatestPublishedFile)) {
        return notFound("File serving is not supported in browser preview");
      }

      // --- Private: create project ---

      const createMatch = matchRoute(args, tsRestApiContracts.createProject);
      if (createMatch) {
        const slug = createMatch.get("slug")!;
        const body = (args.body ?? {}) as Record<string, unknown>;
        await metadata.insertProject({ slug, idp_user_id: PREVIEW_AUTHOR });
        await metadata.updateDraftMetadata(slug, {
          name: (body.name as string) ?? slug,
          description: (body.description as string) ?? undefined,
          categories: (body.categories as string[]) ?? [PREVIEW_CATEGORY],
          badges: (body.badges as string[]) ?? [PREVIEW_BADGE],
        });
        return { status: 204, body: undefined, headers: new Headers() };
      }

      // --- Private: get draft ---

      const draftMatch = matchRoute(args, tsRestApiContracts.getDraftProject);
      if (draftMatch) {
        const slug = draftMatch.get("slug")!;
        const project = await metadata.getProject(slug, "draft");
        if (!project) return notFound("Project not found");
        return { status: 200, body: project, headers: new Headers() };
      }

      // --- Private: publish ---

      const publishMatch = matchRoute(args, tsRestApiContracts.publishVersion);
      if (publishMatch) {
        const slug = publishMatch.get("slug")!;
        await metadata.publishVersion(slug);
        return { status: 204, body: undefined, headers: new Headers() };
      }

      // Unhandled route
      return notFound(
        `Browser backend route not implemented: ${args.method} ${args.path}`
      );
    },
  });
}
