import {
  IconMapWithUrls,
  ProjectSummary,
} from "@shared/domain/readModels/project/ProjectDetails";
import moment from "moment";
import { DBProject } from "@db/models/project/DBProject";
import { DBVersion } from "@db/models/project/DBVersion";
import sql, { raw } from "sql-template-tag";
import { LatestOrDraftAlias } from "@shared/domain/readModels/project/Version";
import { getFileDownloadUrl } from "@db/getFileDownloadUrl";

export function getBaseSelectProjectQuery(
  revision: LatestOrDraftAlias = "latest"
) {
  const revision_column =
    revision === "draft" ? raw(`p.draft_revision`) : raw(`p.latest_revision`);
  return sql`select p.slug,
                    p.git,
                    p.idp_user_id,
                    p.created_at,
                    p.updated_at,
                    p.deleted_at,
                    v.published_at,
                    v.revision,
                    v.size_of_zip,
                    v.app_metadata
             from projects p
                    left join versions v on ${revision_column} = v.revision and p.slug = v.project_slug`;
}

export const projectQueryResponseToReadModel = (
  enrichedDBProject: ProjectQueryResponse
): ProjectSummary => {
  const appMetadata = enrichedDBProject.app_metadata;
  const projectSummary: ProjectSummary = {
    idp_user_id: enrichedDBProject.idp_user_id,
    categories: appMetadata.categories,
    description: appMetadata.description,
    // download_counter: undefined, // TODO
    license_type: appMetadata.license_type,
    name: appMetadata.name ?? enrichedDBProject.slug,
    published_at:
      (enrichedDBProject.published_at &&
        moment(enrichedDBProject.published_at).toDate()) ||
      undefined,
    revision: enrichedDBProject.revision,
    slug: enrichedDBProject.slug,
    // states: undefined,
    // status: undefined, // TODO
    // dependencies: undefined, // TODO
    // votes: undefined, // TODO
    // warnings: undefined, // TODO
    icon_map:
      appMetadata.icon_map &&
      (Object.fromEntries(
        Object.entries(appMetadata.icon_map).map(([key, full_path]) => [
          key,
          {
            full_path,
            url: getFileDownloadUrl(
              enrichedDBProject.slug,
              enrichedDBProject.published_at
                ? enrichedDBProject.revision
                : "draft",
              full_path
            ),
          },
        ])
      ) as IconMapWithUrls),
    badges: appMetadata.badges,
  };
  if (appMetadata.hidden) {
    projectSummary.hidden = appMetadata.hidden;
  }
  if (enrichedDBProject.git) {
    projectSummary.git = enrichedDBProject.git;
  }
  return projectSummary;
};

export type ProjectQueryResponse = DBProject & DBVersion;
