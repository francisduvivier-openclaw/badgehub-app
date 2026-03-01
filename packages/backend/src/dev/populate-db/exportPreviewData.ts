/**
 * Generates packages/frontend/public/preview-data.sqlite from fixture data.
 * The service worker (api-sw.js) fetches this file on install and opens it
 * with sql.js so the frontend PR preview has realistic project data, backed
 * by the same SQLiteBadgeHubMetadata queries as the real backend.
 *
 * Usage: npm run export-preview-data --workspace=packages/backend
 */
import { mkdtempSync, rmSync, copyFileSync } from "node:fs";
import { tmpdir } from "node:os";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { DatabaseSync } from "node:sqlite";
import { NodeSqliteAdapter } from "@db/NodeSqliteAdapter";
import { SQLiteBadgeHubMetadata } from "@shared/db/SQLiteBadgeHubMetadata";
import { BADGEHUB_SCHEMA_SQL } from "@shared/db/sqliteSchema";
import { PROJECT_NAMES, USERS, BADGE_IDS } from "@dev/populate-db/fixtures";
import {
  createSemiRandomAppdata,
  getSemiRandomDates,
  get1DayAfterSemiRandomUpdatedAt,
} from "@dev/populate-db/createSemiRandomAppdata";
import { stringToSemiRandomNumber } from "@dev/populate-db/stringToSemiRandomNumber";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const OUT_PATH = path.resolve(
  __dirname,
  "../../../..",
  "frontend",
  "public",
  "preview-data.sqlite"
);

async function main() {
  const tempDir = mkdtempSync(path.join(tmpdir(), "badgehub-preview-export-"));
  const dbPath = path.join(tempDir, "preview.sqlite");
  const rawDb = new DatabaseSync(dbPath);
  rawDb.exec(BADGEHUB_SCHEMA_SQL);

  const adapter = new NodeSqliteAdapter(rawDb);
  const metadata = new SQLiteBadgeHubMetadata(
    adapter,
    (slug, revision, filePath) =>
      `/api/v3/projects/${encodeURIComponent(slug)}/versions/${revision}/files/${filePath}`
  );

  try {
    console.log(`Inserting ${PROJECT_NAMES.length} projects…`);
    for (const projectName of PROJECT_NAMES) {
      const semiRandomNumber = await stringToSemiRandomNumber(projectName);
      const slug = projectName.toLowerCase();
      const userName = USERS[semiRandomNumber % USERS.length]!;
      const { created_at, updated_at } = await getSemiRandomDates(projectName);

      await metadata.insertProject(
        { slug, idp_user_id: userName },
        { created_at, updated_at }
      );

      const { appMetadata } = await createSemiRandomAppdata(projectName, "");
      await metadata.updateDraftMetadata(slug, appMetadata);
    }

    console.log("Publishing half the projects…");
    const halfNames = PROJECT_NAMES.slice(0, PROJECT_NAMES.length >> 1);
    for (const projectName of halfNames) {
      const publishDate = await get1DayAfterSemiRandomUpdatedAt(projectName);
      await metadata.publishVersion(projectName.toLowerCase(), publishDate);
    }

    console.log("Reporting installs…");
    const publishedSlugs = halfNames.map((n) => n.toLowerCase());
    const nbDownloads = 500;
    for (let i = 0; i < nbDownloads; i++) {
      const semiRandomIndex = await stringToSemiRandomNumber("download" + i);
      await metadata.reportEvent(
        publishedSlugs[semiRandomIndex % publishedSlugs.length]!,
        1,
        BADGE_IDS[(i % BADGE_IDS.length) >> 2] + "-v1",
        "install_count"
      );
    }

    // Close the database before copying so all pages are flushed to disk.
    rawDb.close();
    copyFileSync(dbPath, OUT_PATH);
    console.log(`Wrote SQLite database → ${OUT_PATH}`);
  } finally {
    rmSync(tempDir, { recursive: true, force: true });
  }
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
