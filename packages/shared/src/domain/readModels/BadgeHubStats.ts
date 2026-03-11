import { z } from "zod/v3";
import { __tsCheckSame } from "@shared/zodUtils/zodTypeComparison";

export const badgeHubStatsSchema = z.object({
  projects: z.number().describe("number of projects"),
  projectInstalls: z
    .number()
    .describe("Total number of project installations reported."),
  projectAuthors: z.number().describe("number of project authors"),
  badges: z.number().describe("Number of registered badges"),
});

export type BadgeHubStats = {
  projectInstalls: number;
  projects: number;
  projectAuthors: number;
  badges: number;
};

__tsCheckSame<
  BadgeHubStats,
  BadgeHubStats,
  z.infer<typeof badgeHubStatsSchema>
>(true);
