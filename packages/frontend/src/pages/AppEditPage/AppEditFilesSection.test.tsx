import { dummyApps, render, screen } from "@__test__";
import { getFreshAuthorizedApiClient } from "@api/apiClient.ts";
import type { ProjectEditFormData } from "@pages/AppEditPage/ProjectEditFormData.ts";
import type { ProjectDetails } from "@shared/domain/readModels/project/ProjectDetails.ts";
import { strToU8, zipSync } from "fflate";
import { describe, expect, it, vi } from "vitest";
import AppEditFilesSection from "./AppEditFilesSection.tsx";

vi.mock("@api/apiClient.ts", async (importOriginal) => {
  const actual = await importOriginal<typeof import("@api/apiClient.ts")>();
  return {
    ...actual,
    getFreshAuthorizedApiClient: vi.fn(),
  };
});

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

  it("automatically warns when an existing MPK version does not match", async () => {
    const details = dummyApps[0]?.details;
    expect(details).toBeDefined();
    if (!details) throw new Error("Expected dummy project details");

    const archive = zipSync({
      "demo/MANIFEST.JSON": strToU8(
        JSON.stringify({ fullname: "demo", version: "1.0.0" })
      ),
    });
    vi.mocked(getFreshAuthorizedApiClient).mockResolvedValue({
      getDraftFile: vi.fn().mockResolvedValue({
        status: 200,
        body: new Blob([archive.buffer as ArrayBuffer]),
      }),
    } as unknown as Awaited<ReturnType<typeof getFreshAuthorizedApiClient>>);

    const appMetadata: ProjectEditFormData = {
      ...details.version.app_metadata,
      version: "2.0.0",
    };
    const timestamp = new Date().toISOString();
    const project: ProjectDetails = {
      ...details,
      slug: "demo",
      version: {
        ...details.version,
        project_slug: "demo",
        app_metadata: appMetadata,
        files: [
          {
            full_path: "demo.mpk",
            name: "demo",
            ext: "mpk",
            size_formatted: "1 KB",
            mimetype: "application/octet-stream",
            size_of_content: archive.byteLength,
            sha256: "e".repeat(64),
            url: "http://api.test/demo.mpk",
            dir: "",
            created_at: timestamp,
            updated_at: timestamp,
          },
        ],
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

    expect(await screen.findByTestId("draft-mpk-warning")).toHaveTextContent(
      'MANIFEST version "1.0.0" does not match BadgeHub version "2.0.0".'
    );
  });
});
