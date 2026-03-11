import { z } from "zod/v3";
import { getSharedConfig } from "@shared/config/sharedConfig";

const sharedConfig = getSharedConfig();
export const categoryNameSchema = z.enum(getAllCategoryNames());
export type CategoryName = string;

export function getAllCategoryNames(): [CategoryName, ...CategoryName[]] {
  return [...sharedConfig.categories, ...sharedConfig.adminOnlyCategories];
}

export function getAdminOnlyCategoryNames(): [CategoryName, ...CategoryName[]] {
  return sharedConfig.adminOnlyCategories;
}

export function isAdminCategory(category: CategoryName) {
  return sharedConfig.adminOnlyCategories.includes(category);
}
