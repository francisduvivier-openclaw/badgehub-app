import { type Role, roleSchema } from "./User";

export type JwtRolePayload = {
  realm_access?: unknown;
  resource_access?: unknown;
  [key: string]: unknown;
};

function isRecord(value: unknown): value is Record<string, unknown> {
  return value !== null && typeof value === "object" && !Array.isArray(value);
}

function getRoles(access: unknown): unknown[] {
  if (!isRecord(access)) {
    return [];
  }

  return Array.isArray(access.roles) ? access.roles : [];
}

/**
 * Maps roles from a Keycloak access-token payload.
 *
 * Realm roles are read from `realm_access.roles`.
 * Client roles are read only from `resource_access.<clientId>.roles`.
 */
export function rolesFromJwtPayload(
  payload: JwtRolePayload,
  clientId: string
): Role[] {
  const found = new Set<Role>();

  const candidates: unknown[] = [...getRoles(payload.realm_access)];

  if (isRecord(payload.resource_access)) {
    candidates.push(...getRoles(payload.resource_access[clientId]));
  }

  for (const candidate of candidates) {
    const parsed = roleSchema.safeParse(candidate);

    if (parsed.success) {
      found.add(parsed.data);
    }
  }

  return [...found];
}
