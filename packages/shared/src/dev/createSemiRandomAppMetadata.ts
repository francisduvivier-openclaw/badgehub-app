import { getBadgeSlugs } from "@shared/domain/readModels/Badge";
import { AppMetadataJSON } from "@shared/domain/readModels/project/AppMetadataJSON";

function getSemiRandomElementSelection<T>(
  semiRandomNumber: number,
  items: T[],
  maxItems: number
): T[] {
  const nbItems = Math.max(semiRandomNumber % maxItems, 1);
  const selection = new Set<T>();
  for (let i = 0; i < nbItems; i++) {
    selection.add(items[(i + semiRandomNumber) % items.length]!);
  }
  return [...selection];
}

function getDescription(appName: string, semiRandomNumber: number) {
  switch (semiRandomNumber % 4) {
    case 0:
      return `Use ${appName} for some cool graphical effects.`;
    case 1:
      return `With ${appName}, you can do interesting things with the sensors.`;
    case 2:
      return `Make some magic happen with ${appName}.`;
    case 3:
      return `${appName} is just some silly test app.`;
  }
}

function getLongDescription(appName: string, semiRandomNumber: number) {
  // Deterministic 50% coverage.
  if (semiRandomNumber % 2 !== 0) {
    return undefined;
  }

  return `Lorem ipsum dolor sit amet, consectetur adipiscing elit. ${appName} posuere orci sed odio faucibus, vitae varius velit faucibus. Integer tempus, nisl eu porttitor fermentum, purus nibh hendrerit velit, quis volutpat dolor felis eu sem.

Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. ${appName} facilisis nunc id lorem bibendum, non congue neque elementum.

Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.`;
}

export function createSemiRandomAppMetadata(options: {
  projectName: string;
  semanticVersion: string;
  semiRandomNumber: number;
  users: string[];
  categoryNames: string[];
}): AppMetadataJSON {
  const {
    projectName,
    semanticVersion,
    semiRandomNumber,
    users,
    categoryNames,
  } = options;
  const userId = semiRandomNumber % users.length;

  const categories = getSemiRandomElementSelection(
    semiRandomNumber,
    categoryNames,
    3
  );

  const allBadges = getBadgeSlugs();
  const badges = getSemiRandomElementSelection(
    semiRandomNumber,
    allBadges,
    allBadges.length
  );

  const appMetadata: AppMetadataJSON = {
    name: projectName,
    description: getDescription(projectName, semiRandomNumber),
    long_description: getLongDescription(projectName, semiRandomNumber),
    author: users[userId]!,
    license_type: "MIT",
    badges,
    categories,
  };

  if (semiRandomNumber % 2 === 0) {
    appMetadata.git_url = "https://github.com/badgehubcrew/badgehub-app";
  } else if (semiRandomNumber % 3 === 0) {
    appMetadata.git_url = "https://gitlab.com/team-badge/badgevms-badgehub";
  }

  if (semiRandomNumber % 2 === 0) {
    appMetadata.hidden = false;
  }
  if (semiRandomNumber % 9 === 0) {
    appMetadata.hidden = true;
  }

  if (semanticVersion !== "") {
    appMetadata.version = semanticVersion;
  }

  return appMetadata;
}
