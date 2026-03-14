import { stringToSemiRandomNumber } from "@dev/stringToSemiRandomNumber";
import {
  ICON_COUNT,
  ICON_FILENAMES,
  SIX_HUNDRED_DAYS_IN_MS,
  TWENTY_FOUR_HOURS_IN_MS,
  USERS,
  CATEGORY_NAMES,
} from "@dev/fixtures";
import { createSemiRandomAppMetadata } from "@shared/dev/createSemiRandomAppMetadata";
import { ISODateString } from "@shared/domain/readModels/ISODateString";

export const getSemiRandomDates = async (stringToDigest: string) => {
  const semiRandomNumber = await stringToSemiRandomNumber(stringToDigest);
  const createMillisBack = semiRandomNumber % SIX_HUNDRED_DAYS_IN_MS;
  const created_at = date(createMillisBack);

  const updated_at = date(
    createMillisBack -
      Math.min(
        0,
        createMillisBack - (semiRandomNumber % (1234 * TWENTY_FOUR_HOURS_IN_MS))
      )
  );
  return { created_at, updated_at };
};
export const get1DayAfterSemiRandomUpdatedAt = async (projectSlug: string) => {
  return new Date(
    Date.parse((await getSemiRandomDates(projectSlug)).updated_at) +
      TWENTY_FOUR_HOURS_IN_MS
  ).toISOString() as ISODateString;
};

function date(millisBackFrom2025: number) {
  const JAN_FIRST_2025_BRUSSELS = 1_735_686_000_000;
  const MAX_DATE_MILLIS = JAN_FIRST_2025_BRUSSELS;
  return new Date(MAX_DATE_MILLIS - millisBackFrom2025).toISOString();
}

export async function createSemiRandomAppdata(
  projectName: string,
  semanticVersion: string,
  loadIcon: (filename: string) => Promise<Uint8Array | undefined>
) {
  const semiRandomNumber = await stringToSemiRandomNumber(projectName);
  const projectSlug = projectName.toLowerCase();

  const { created_at, updated_at } = await getSemiRandomDates(projectName);

  let iconBytes: Uint8Array | undefined = undefined;

  // Pick a semirandom icon
  const iconIndex = semiRandomNumber % (ICON_COUNT + 4);
  const iconFilename = ICON_FILENAMES[iconIndex];
  const iconRelativePath = iconFilename;
  if (iconFilename) {
    iconBytes = await loadIcon(iconFilename);
  }

  const appMetadata = createSemiRandomAppMetadata({
    projectName,
    semanticVersion,
    semiRandomNumber,
    users: USERS,
    categoryNames: CATEGORY_NAMES,
  });

  appMetadata.icon_map = iconRelativePath ? { "64x64": iconRelativePath } : undefined;

  return {
    projectSlug,
    created_at,
    updated_at,
    iconBytes,
    iconRelativePath,
    appMetadata,
  };
}
