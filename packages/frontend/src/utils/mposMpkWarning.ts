type MposMpkWarningInput = {
  badges?: readonly string[];
  filePaths?: readonly string[];
};

export function shouldWarnMposNeedsMpk({
  badges = [],
  filePaths = [],
}: MposMpkWarningInput): boolean {
  const normalizedBadges = badges.map((badge) => badge.toLowerCase());
  const normalizedPaths = filePaths.map((path) => path.toLowerCase());
  const hasMpk = normalizedPaths.some((path) => path.endsWith(".mpk"));

  if (hasMpk) return false;

  const hasMposBadge = normalizedBadges.some((badge) =>
    badge.startsWith("mpos_api")
  );
  const hasFri3dBadge = normalizedBadges.some((badge) =>
    badge.startsWith("fri3d")
  );
  const hasPythonFile = normalizedPaths.some((path) => path.endsWith(".py"));

  return hasMposBadge || (hasPythonFile && (hasMposBadge || hasFri3dBadge));
}
