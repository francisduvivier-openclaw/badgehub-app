import {
  isAdminUser,
  type Role,
} from "@shared/domain/readModels/project/User.ts";

export function canEditProject(
  user: { id: string; roles?: Role[] } | undefined,
  projectOwnerId: string | undefined
): boolean {
  if (!user?.id || !projectOwnerId) {
    return false;
  }
  return isAdminUser({ roles: user.roles ?? [] }) || user.id === projectOwnerId;
}
