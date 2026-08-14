import { dummyApps, render, screen } from "@__test__";
import type { ProjectEditFormData } from "@pages/AppEditPage/ProjectEditFormData.ts";
import type { ProjectDetails } from "@shared/domain/readModels/project/ProjectDetails.ts";
import { describe, expect, it, vi } from "vitest";
import AppEditFilesSection from "./AppEditFilesSection.tsx";

vi.mock("./AppEditFileUpload.tsx", () => ({
  default: () => <div data-testid="file-upload" />,
}));

vi.mock("./AppEditFileList.tsx", () => ({
  default: () => <div data-testid="file-list" />,
}));

const keycloak = {
  updateToken: vi.fn().mockResolvedValue(true),
} as unknown as import("keycloak-js").default;

describe("AppEditFilesSection", () => {
  it("shows MPK guidance for an MPOS project", () => {
    const details = dummyApps[0]?.details;
    expect(details).toBeDefined();
    if (!details) throw new Error("Expected dummy project details");

    const appMetadata: ProjectEditFormData = {
      ...details.version.app_metadata,
      badges: ["mpos_api_v1"],
    };
    const project: ProjectDetails = {
      ...details,
      version: {
        ...details.version,
        app_metadata: appMetadata,
        files: [],
      },
    };

    render(
      <AppEditFilesSection
        project={project}
        appMetadata={appMetadata}
        slug="demo"
        keycloak={keycloak}
        onPreviewFile={vi.fn()}
        onPreviewArchive={vi.fn()}
        onSetIcon={vi.fn()}
        onDeleteFile={vi.fn()}
        onSetMainExecutable={vi.fn()}
        onUploadSuccess={vi.fn()}
      />
    );

    expect(screen.getByRole("alert")).toHaveTextContent(
      "MicroPythonOS apps must include an MPK file."
    );
    expect(
      screen.getByRole("link", {
        name: /learn more about publishing micropythonos apps on badgehub/i,
      })
    ).toHaveAttribute("href", "https://docs.micropythonos.com/apps/badgehub/");
  });
});
