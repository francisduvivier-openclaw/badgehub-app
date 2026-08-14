import { describe, expect, it } from "vitest";
import { canEditProject } from "./canEditProject.ts";

describe("canEditProject", () => {
  it("returns false when the user is logged out", () => {
    expect(canEditProject(undefined, "owner-id")).toBe(false);
  });

  it("returns true for the project owner", () => {
    expect(canEditProject({ id: "owner-id", roles: [] }, "owner-id")).toBe(
      true
    );
  });

  it("returns true for an admin who does not own the project", () => {
    expect(
      canEditProject({ id: "admin-id", roles: ["admin"] }, "owner-id")
    ).toBe(true);
  });

  it("returns false for a logged-in user who is not the owner or an admin", () => {
    expect(canEditProject({ id: "other-id", roles: [] }, "owner-id")).toBe(
      false
    );
  });
});
