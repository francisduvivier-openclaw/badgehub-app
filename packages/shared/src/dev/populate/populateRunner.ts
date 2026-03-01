export type PopulateHooks = {
  reset(): Promise<void>;
  projectNames: string[];
  badgeIds: string[];
  createDraftProject(projectName: string): Promise<void>;
  publishProject(projectName: string): Promise<void>;
  registerBadge(badgeId: string): Promise<void>;
  reportInstall(projectSlug: string, badgeId: string): Promise<void>;
  refreshReports(): Promise<void>;
};

export async function runSharedPopulate(hooks: PopulateHooks): Promise<void> {
  await hooks.reset();

  for (const projectName of hooks.projectNames) {
    await hooks.createDraftProject(projectName);
  }

  const publishedProjectNames = hooks.projectNames.slice(0, hooks.projectNames.length >> 1);
  for (const projectName of publishedProjectNames) {
    await hooks.publishProject(projectName);
  }

  for (const badgeId of hooks.badgeIds.slice(3)) {
    await hooks.registerBadge(badgeId);
  }

  const publishedProjectSlugs = publishedProjectNames.map((p) => p.toLowerCase());
  const nbDownloads = 500;
  for (let i = 0; i < nbDownloads; i++) {
    const badgeId = hooks.badgeIds[(i % hooks.badgeIds.length) >> 2] ?? hooks.badgeIds[0]!;
    const slug = publishedProjectSlugs[i % publishedProjectSlugs.length];
    if (!slug) continue;
    await hooks.reportInstall(slug, `${badgeId}-v1`);
  }

  await hooks.refreshReports();
}
