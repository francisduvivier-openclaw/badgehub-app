import { SQLiteBadgeHubMetadata } from "@shared/db/SQLiteBadgeHubMetadata";
import { PROJECT_NAMES, USERS, BADGE_IDS } from "@dev/fixtures";
import {
  createSemiRandomAppdata,
  getSemiRandomDates,
  get1DayAfterSemiRandomUpdatedAt,
} from "@dev/createSemiRandomAppdata";
import { stringToSemiRandomNumber } from "@dev/stringToSemiRandomNumber";

async function sha256Hex(data: Uint8Array): Promise<string> {
  const hashBuffer = await crypto.subtle.digest("SHA-256", data);
  return Array.from(new Uint8Array(hashBuffer))
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("");
}

async function writeFile(
  db: SQLiteBadgeHubMetadata,
  slug: string,
  pathParts: string[],
  content: Uint8Array,
  mimetype: string
) {
  const sha256 = await sha256Hex(content);
  await db.writeDraftFileMetadata(
    slug,
    pathParts,
    { mimetype, fileContent: content, size: content.length },
    sha256
  );
  await db.writeFileContent(sha256, content);
}

/**
 * Populates a SQLiteBadgeHubMetadata instance with semi-random fixture data.
 * Works in both browser (Service Worker) and Node.js environments.
 *
 * @param metadata - An already-initialised SQLiteBadgeHubMetadata adapter
 * @param loadIcon - Callback to load an icon by filename; returns undefined if unavailable
 */
export async function populatePreviewDb(
  metadata: SQLiteBadgeHubMetadata,
  loadIcon: (filename: string) => Promise<Uint8Array | undefined>
): Promise<void> {
  console.log(`[populatePreviewDb] Inserting ${PROJECT_NAMES.length} projects…`);
  for (const projectName of PROJECT_NAMES) {
    const semiRandomNumber = await stringToSemiRandomNumber(projectName);
    const slug = projectName.toLowerCase();
    const userName = USERS[semiRandomNumber % USERS.length]!;
    const { created_at, updated_at } = await getSemiRandomDates(projectName);

    await metadata.insertProject(
      { slug, idp_user_id: userName },
      { created_at, updated_at }
    );

    const { appMetadata, iconBytes, iconRelativePath } =
      await createSemiRandomAppdata(projectName, "", loadIcon);
    await metadata.updateDraftMetadata(slug, appMetadata);

    if (iconBytes && iconRelativePath) {
      const sha256 = await sha256Hex(iconBytes);
      const pathParts = iconRelativePath.split("/");
      await metadata.writeDraftFileMetadata(
        slug,
        pathParts,
        { mimetype: "image/png", fileContent: iconBytes, size: iconBytes.length },
        sha256
      );
      await metadata.writeFileContent(sha256, iconBytes);
    }

    const metadataJson = new TextEncoder().encode(
      JSON.stringify(appMetadata, null, 2)
    );
    await writeFile(metadata, slug, ["metadata.json"], metadataJson, "application/json");

    const pythonLines = [
      `# ${projectName} badge app`,
      `import display`,
      ``,
      `def main():`,
      `    display.print("${projectName}")`,
      ``,
      `main()`,
    ];
    const pythonSrc = new TextEncoder().encode(pythonLines.join("\n") + "\n");
    await writeFile(metadata, slug, ["__init__.py"], pythonSrc, "text/x-python");
  }

  console.log("[populatePreviewDb] Publishing half the projects…");
  const halfNames = PROJECT_NAMES.slice(0, PROJECT_NAMES.length >> 1);
  for (const projectName of halfNames) {
    const publishDate = await get1DayAfterSemiRandomUpdatedAt(projectName);
    await metadata.publishVersion(projectName.toLowerCase(), publishDate);
  }

  console.log("[populatePreviewDb] Reporting installs…");
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
  console.log("[populatePreviewDb] Done.");
}
