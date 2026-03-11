import { Version, versionSchema } from "./Version";
import { User } from "./User";
import { DatedData, datedDataSchema } from "./DatedData";
import { BadgeSlug } from "../Badge";
import {
  CategoryName,
  categoryNameSchema,
} from "@shared/domain/readModels/project/Category";
import { z } from "zod/v3";
import { __tsCheckSame } from "@shared/zodUtils/zodTypeComparison";

export type ProjectStatusName =
  | "working"
  | "in_progress"
  | "broken"
  | "unknown";

export const projectStatusNameSchema = z.enum([
  "working",
  "in_progress",
  "broken",
  "unknown",
]);

export interface ProjectCore {
  slug: string;
  idp_user_id: User["idp_user_id"];
  git?: string; // Git URL of the project, if it exists
  latest_revision?: number; // Latest revision number of the project
}

export type FullPathAndUrl = {
  full_path: string;
  url: string;
};
export type IconMapWithUrls = {
  "8x8"?: FullPathAndUrl;
  "16x16"?: FullPathAndUrl;
  "32x32"?: FullPathAndUrl;
  "64x64"?: FullPathAndUrl;
};

export interface ProjectSummary extends ProjectCore {
  // Computed
  hidden?: boolean;
  name: string;
  published_at?: Date; // Can be undefined if not published yet
  icon_map?: IconMapWithUrls; // Relative path to the icon of the project
  // download_counter?: number; // Sum of all version download count|null
  // ratings: { average: number; count: number } | null; // Average rating and count of ratings
  license_type?: string; // Eg. MIT
  categories?: CategoryName[];
  badges?: Array<BadgeSlug>;
  description?: string; // description in metadata of latest version of the projectct
  revision: number; // latest revision number of the project
}

export interface ProjectDetails extends ProjectCore, DatedData {
  version: Version;
  author?: { name: string }; // TODO
  // states?: Array<ProjectStatusOnBadge>;|null
  // votes?: Array<VoteFromUser>;|null
  // warnings?: Array<WarningFromUser>;|null
  // collaborators?: Array<User>;|null
}

export type ProjectSlug = ProjectDetails["slug"];

export const projectCoreSchema = z.object({
  slug: z.string(),
  idp_user_id: z.string(),
  git: z.string().optional(),
  latest_revision: z.number().optional(),
});

export const detailedProjectSchema = projectCoreSchema
  .extend({
    version: versionSchema,
    author: z.object({ name: z.string() }).optional(),
  })
  .extend(datedDataSchema.shape);

const fullPathAndUrlSchema = z.object({
  full_path: z.string(),
  url: z.string().url(),
});
export const iconMapWithUrlsSchema = z
  .object({
    "8x8": fullPathAndUrlSchema.optional(),
    "16x16": fullPathAndUrlSchema.optional(),
    "32x32": fullPathAndUrlSchema.optional(),
    "64x64": fullPathAndUrlSchema.optional(),
  })
  .describe(
    `Icon Map of the project that maps from accepted sizes to a file path and url.`
  );

export const projectSummarySchema = projectCoreSchema.extend({
  name: z.string(),
  hidden: z.boolean().optional(),
  published_at: z.date().optional(),
  icon_map: iconMapWithUrlsSchema.optional(),
  license_type: z.string().optional(),
  categories: z.array(categoryNameSchema).optional(),
  badges: z.array(z.string()).optional(), // Array of BadgeSlugs
  description: z.string().optional(),
  revision: z.number(),
});

__tsCheckSame<
  ProjectDetails,
  ProjectDetails,
  z.infer<typeof detailedProjectSchema>
>(true);

__tsCheckSame<
  ProjectSummary,
  ProjectSummary,
  z.infer<typeof projectSummarySchema>
>(true);

__tsCheckSame<
  ProjectStatusName,
  ProjectStatusName,
  z.infer<typeof projectStatusNameSchema>
>(true);
