import { renderHook } from "@testing-library/react";
import type Keycloak from "keycloak-js";
import { describe, expect, it, vi } from "vitest";
import { useUserDraftProjectsFetcher } from "./useUserDraftProjectsFetcher.ts";

describe("useUserDraftProjectsFetcher", () => {
  it("requests only the signed-in user's drafts, even for admins", async () => {
    const getUserDraftProjects = vi.fn().mockResolvedValue({
      status: 200,
      body: [],
      headers: new Headers(),
    });
    const apiClient = { getUserDraftProjects };
    const keycloak = {
      authenticated: true,
      token: "admin-token",
      updateToken: vi.fn().mockResolvedValue(false),
    } as unknown as Keycloak;

    const { result } = renderHook(() =>
      useUserDraftProjectsFetcher({
        apiClient: apiClient as never,
        user: {
          id: "admin-id",
          name: "Admin",
          email: "",
          roles: ["admin"],
        },
        keycloak,
      })
    );

    expect(result.current).toBeDefined();
    await result.current?.({ pageStart: 0 });

    expect(getUserDraftProjects).toHaveBeenCalledWith(
      expect.objectContaining({
        params: { userId: "admin-id" },
      })
    );
  });
});
