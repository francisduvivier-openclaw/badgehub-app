import type { UserDataInRequest } from "@auth/jwt-decode";
import type { BadgeHubData } from "@domain/BadgeHubData";
import { ORPCError } from "@orpc/server";
import type { ProjectDetails } from "@shared/domain/readModels/project/ProjectDetails";
import { describe, expect, it, vi } from "vitest";
import { assertProjectAccess, assertUserAccess } from "./authorization";
import type { AuthContext } from "./context";

const project = {
  slug: "owned-app",
  idp_user_id: "owner-id",
} as ProjectDetails;

function auth(user?: UserDataInRequest, apiToken?: string): AuthContext {
  return {
    user,
    apiToken,
    headers: new Headers(),
  };
}

function badgeHubData(overrides: Partial<BadgeHubData> = {}): BadgeHubData {
  return {
    getProject: vi.fn().mockResolvedValue(project),
    checkApiToken: vi.fn().mockResolvedValue(true),
    ...overrides,
  } as unknown as BadgeHubData;
}

describe("assertProjectAccess", () => {
  it("allows the project owner", async () => {
    const resolved = await assertProjectAccess(
      badgeHubData(),
      project.slug,
      auth({ idp_user_id: "owner-id", roles: [] }),
      project
    );
    expect(resolved).toBe(project);
  });

  it("allows an admin to edit another user's project", async () => {
    const resolved = await assertProjectAccess(
      badgeHubData(),
      project.slug,
      auth({ idp_user_id: "admin-id", roles: ["admin"] }),
      project
    );
    expect(resolved).toBe(project);
  });

  it("rejects a non-admin who does not own the project", async () => {
    await expect(
      assertProjectAccess(
        badgeHubData(),
        project.slug,
        auth({ idp_user_id: "other-id", roles: [] }),
        project
      )
    ).rejects.toBeInstanceOf(ORPCError);
  });

  it("rejects a missing user when no API token is provided", async () => {
    await expect(
      assertProjectAccess(badgeHubData(), project.slug, auth(), project)
    ).rejects.toBeInstanceOf(ORPCError);
  });
});

describe("assertUserAccess", () => {
  it("allows a user to access their own draft list", () => {
    expect(() =>
      assertUserAccess("owner-id", { idp_user_id: "owner-id", roles: [] })
    ).not.toThrow();
  });

  it("rejects an admin listing another user's drafts", () => {
    expect(() =>
      assertUserAccess("owner-id", {
        idp_user_id: "admin-id",
        roles: ["admin"],
      })
    ).toThrow(ORPCError);
  });
});
