import { getSqliteDb } from "@db/sqliteDatabase";
import { BadgeHubData } from "@domain/BadgeHubData";
import { createBadgeHubData } from "@domain/createBadgeHubData";
import { stringToSemiRandomNumber } from "@dev/populate-db/stringToSemiRandomNumber";
import {
  createSemiRandomAppdata,
  get1DayAfterSemiRandomUpdatedAt,
  getSemiRandomDates,
} from "@dev/populate-db/createSemiRandomAppdata";
import { SHARED_BADGE_IDS, SHARED_PROJECT_NAMES } from "@shared/dev/populate/populateFixtures";
import { runSharedPopulate } from "@shared/dev/populate/populateRunner";

const writeDraftAppFiles = async (
  badgeHubData: BadgeHubData,
  projectName: string,
  semanticVersion: string = ""
) => {
  const {
    projectSlug,
    created_at,
    updated_at,
    iconBuffer,
    iconRelativePath,
    appMetadata,
  } = await createSemiRandomAppdata(projectName, semanticVersion);

  const metadataJsonContent = Buffer.from(JSON.stringify(appMetadata));
  await badgeHubData.writeDraftFile(
    projectSlug,
    "metadata.json",
    {
      mimetype: "application/json",
      size: metadataJsonContent.length,
      fileContent: metadataJsonContent,
    },
    { created_at, updated_at }
  );

  if (iconRelativePath && iconBuffer) {
    await badgeHubData.writeDraftFile(
      projectSlug,
      iconRelativePath,
      {
        mimetype: "image/png",
        size: iconBuffer.length,
        fileContent: iconBuffer,
      },
      { created_at, updated_at }
    );
  }

  const initPyContent = Buffer.from(
    `print('Hello world from the ${projectName} app${semanticVersion}')`
  );
  await badgeHubData.writeDraftFile(
    projectSlug,
    "__init__.py",
    {
      mimetype: "text/x-python-script",
      size: initPyContent.length,
      fileContent: initPyContent,
    },
    { created_at, updated_at }
  );
};

async function cleanTables() {
  const db = getSqliteDb();
  db.exec(`
    DELETE FROM event_reports;
    DELETE FROM files;
    DELETE FROM versions;
    DELETE FROM project_api_token;
    DELETE FROM registered_badges;
    DELETE FROM projects;
    DELETE FROM sqlite_sequence WHERE name IN ('event_reports', 'files', 'versions');
  `);
}

export async function repopulateDB() {
  const badgeHubData = createBadgeHubData();

  await runSharedPopulate({
    reset: cleanTables,
    projectNames: SHARED_PROJECT_NAMES,
    badgeIds: SHARED_BADGE_IDS,
    createDraftProject: async (projectName) => {
      const semiRandomNumber = await stringToSemiRandomNumber(projectName);
      const slug = projectName.toLowerCase();
      const { created_at, updated_at } = await getSemiRandomDates(projectName);
      await badgeHubData.insertProject(
        {
          slug,
          idp_user_id: `seed-user-${semiRandomNumber % 99}`,
        },
        { created_at, updated_at }
      );
      await writeDraftAppFiles(badgeHubData, projectName);
    },
    publishProject: async (projectName) => {
      const slug = projectName.toLowerCase();
      await badgeHubData.publishVersion(
        slug,
        await get1DayAfterSemiRandomUpdatedAt(projectName)
      );
      await writeDraftAppFiles(badgeHubData, projectName, "0.0.1");
    },
    registerBadge: async (badgeId) => {
      await badgeHubData.registerBadge(badgeId, undefined);
    },
    reportInstall: async (projectSlug, badgeId) => {
      await badgeHubData.reportInstall(projectSlug, 1, { id: badgeId });
    },
    refreshReports: async () => {
      await badgeHubData.refreshReports();
    },
  });
}
