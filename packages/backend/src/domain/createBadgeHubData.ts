import { BadgeHubData } from "@domain/BadgeHubData";
import { SQLiteBadgeHubMetadata } from "@db/SQLiteBadgeHubMetadata";
import { SQLiteBadgeHubFiles } from "@db/SQLiteBadgeHubFiles";
import { getNodeSqliteAdapter } from "@db/sqliteDatabase";
import { getFileDownloadUrl } from "@db/getFileDownloadUrl";

export function createBadgeHubData(): BadgeHubData {
  return new BadgeHubData(
    new SQLiteBadgeHubMetadata(getNodeSqliteAdapter(), getFileDownloadUrl),
    new SQLiteBadgeHubFiles()
  );
}
