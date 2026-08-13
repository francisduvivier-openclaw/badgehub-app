import type { BadgeHubStats } from "@shared/domain/readModels/BadgeHubStats";
import { describe, expect, test } from "vitest";
import { formatBadgeHubStatsAsPrometheus } from "./prometheus";

const sampleStats: BadgeHubStats = {
  projects: 12,
  installs: 34,
  crashes: 1,
  launches: 56,
  installed_projects: 7,
  launched_projects: 8,
  crashed_projects: 2,
  authors: 9,
  badges: 3,
};

describe("formatBadgeHubStatsAsPrometheus", () => {
  test("emits Prometheus 0.0.4 text for every stats field", () => {
    expect(formatBadgeHubStatsAsPrometheus(sampleStats)).toMatchInlineSnapshot(`
      "# HELP badgehub_projects Number of projects
      # TYPE badgehub_projects gauge
      badgehub_projects 12

      # HELP badgehub_installs Total install reports
      # TYPE badgehub_installs counter
      badgehub_installs 34

      # HELP badgehub_crashes Total crash reports
      # TYPE badgehub_crashes counter
      badgehub_crashes 1

      # HELP badgehub_launches Total launch reports
      # TYPE badgehub_launches counter
      badgehub_launches 56

      # HELP badgehub_installed_projects Number of projects with at least one install
      # TYPE badgehub_installed_projects gauge
      badgehub_installed_projects 7

      # HELP badgehub_launched_projects Number of projects with at least one launch
      # TYPE badgehub_launched_projects gauge
      badgehub_launched_projects 8

      # HELP badgehub_crashed_projects Number of projects with at least one crash
      # TYPE badgehub_crashed_projects gauge
      badgehub_crashed_projects 2

      # HELP badgehub_authors Number of project authors
      # TYPE badgehub_authors gauge
      badgehub_authors 9

      # HELP badgehub_badges Number of registered badges
      # TYPE badgehub_badges gauge
      badgehub_badges 3
      "
    `);
  });
});
