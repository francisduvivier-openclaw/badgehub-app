import { ProjectSummary } from "@shared/domain/readModels/project/ProjectSummaries.ts";

export type AppCardProps = ProjectSummary & {
  editable?: boolean;
};
