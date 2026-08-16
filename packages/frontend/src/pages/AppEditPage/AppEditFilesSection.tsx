import { getFreshAuthorizedApiClient } from "@api/apiClient.ts";
import type { ProjectEditFormData } from "@pages/AppEditPage/ProjectEditFormData.ts";
import type { ProjectDetails } from "@shared/domain/readModels/project/ProjectDetails.ts";
import type { MpkArchiveFile } from "@sharedComponents/MpkExplorer.tsx";
import { getPreviewType } from "@utils/filePreview.ts";
import {
  getMpkVersionWarning,
  inspectMpkIdentity,
  type MpkIdentityInspection,
} from "@utils/mpkIdentity.ts";
import { shouldWarnMposNeedsMpk } from "@utils/mposMpkWarning.ts";
import type Keycloak from "keycloak-js";
import type React from "react";
import { useCallback, useEffect, useRef, useState } from "react";
import AppEditFileList from "./AppEditFileList.tsx";
import AppEditFileUpload, {
  type UploadSuccessResult,
} from "./AppEditFileUpload.tsx";

const RECENT_HIGHLIGHT_MS = 5_000;

type DraftMpkInspection = {
  filePath: string;
  inspection: MpkIdentityInspection;
};

const AppEditFilesSection: React.FC<{
  project: ProjectDetails;
  appMetadata: ProjectEditFormData;
  slug: string;
  keycloak: Keycloak;
  mainExecutable?: string;
  onPreviewFile: (filePath: string) => void;
  onPreviewArchive: (file: MpkArchiveFile) => void;
  onSetIcon: (filePath: string) => void;
  onDeleteFile: (filePath: string) => void;
  onSetMainExecutable: (filePath: string) => void;
  onUploadSuccess: (result: UploadSuccessResult) => void;
}> = ({
  project,
  appMetadata,
  slug,
  keycloak,
  mainExecutable,
  onPreviewFile,
  onPreviewArchive,
  onSetIcon,
  onDeleteFile,
  onSetMainExecutable,
  onUploadSuccess,
}) => {
  const [recentPaths, setRecentPaths] = useState<ReadonlySet<string>>(
    () => new Set()
  );
  const [mpkInspections, setMpkInspections] = useState<DraftMpkInspection[]>(
    []
  );
  const clearRecentTimerRef = useRef<ReturnType<typeof setTimeout> | null>(
    null
  );

  useEffect(() => {
    return () => {
      if (clearRecentTimerRef.current) {
        clearTimeout(clearRecentTimerRef.current);
      }
    };
  }, []);

  const draftFiles = project.version.files;
  useEffect(() => {
    const mpkFiles = draftFiles.filter(
      (file) => getPreviewType(file.mimetype, file.full_path) === "mpk"
    );
    if (mpkFiles.length === 0) {
      setMpkInspections([]);
      return;
    }

    let active = true;
    void getFreshAuthorizedApiClient(keycloak)
      .then((client) =>
        Promise.all(
          mpkFiles.map(async (file): Promise<DraftMpkInspection> => {
            try {
              const response = await client.getDraftFile({
                params: { slug, filePath: file.full_path },
              });
              if (response.status !== 200 || !(response.body instanceof Blob)) {
                throw new Error("MPK download did not return a file");
              }
              return {
                filePath: file.full_path,
                inspection: await inspectMpkIdentity(response.body, slug),
              };
            } catch (error) {
              console.error(`Failed to inspect ${file.full_path}`, error);
              return {
                filePath: file.full_path,
                inspection: {
                  error: "This MPK file could not be inspected.",
                  warnings: [],
                },
              };
            }
          })
        )
      )
      .then((inspections) => {
        if (active) setMpkInspections(inspections);
      })
      .catch((error) => {
        console.error("Failed to inspect draft MPK files", error);
        if (active) {
          setMpkInspections(
            mpkFiles.map((file) => ({
              filePath: file.full_path,
              inspection: {
                error: "This MPK file could not be inspected.",
                warnings: [],
              },
            }))
          );
        }
      });

    return () => {
      active = false;
    };
  }, [draftFiles, keycloak, slug]);

  const handleUploadSuccess = useCallback(
    (result: UploadSuccessResult) => {
      if (result.uploadedPaths && result.uploadedPaths.length > 0) {
        setRecentPaths(new Set(result.uploadedPaths));
        if (clearRecentTimerRef.current) {
          clearTimeout(clearRecentTimerRef.current);
        }
        clearRecentTimerRef.current = setTimeout(() => {
          setRecentPaths(new Set());
          clearRecentTimerRef.current = null;
        }, RECENT_HIGHLIGHT_MS);
      }
      onUploadSuccess(result);
    },
    [onUploadSuccess]
  );

  const showMposMpkWarning = shouldWarnMposNeedsMpk({
    badges: appMetadata.badges,
    filePaths: project.version.files.map((file) => file.full_path),
  });
  const mpkFeedback = mpkInspections.flatMap(({ filePath, inspection }) => {
    const versionWarning = getMpkVersionWarning(
      inspection.version,
      appMetadata.version
    );
    return [
      ...(inspection.error
        ? [{ key: `${filePath}-error`, filePath, message: inspection.error }]
        : []),
      ...inspection.warnings.map((warning) => ({
        key: `${filePath}-${warning.code}`,
        filePath,
        message: warning.message,
      })),
      ...(versionWarning
        ? [
            {
              key: `${filePath}-${versionWarning.code}`,
              filePath,
              message: versionWarning.message,
            },
          ]
        : []),
    ];
  });

  return (
    <section className="card bg-base-200 shadow-lg text-left">
      <div className="card-body gap-4">
        <h2 className="card-title text-2xl">Project files</h2>
        {showMposMpkWarning && (
          <div className="alert alert-warning items-start" role="alert">
            <div>
              <p>
                MicroPythonOS apps must include an MPK file. Upload the exported{" "}
                <code>.mpk</code> package instead of individual application
                files.
              </p>
              <a
                className="link"
                href="https://docs.micropythonos.com/apps/badgehub/"
                target="_blank"
                rel="noreferrer"
              >
                Learn more about publishing MicroPythonOS apps on BadgeHub
              </a>
            </div>
          </div>
        )}
        {mpkFeedback.length > 0 && (
          <div
            className="alert alert-warning items-start"
            role="alert"
            data-testid="draft-mpk-warning"
          >
            <div>
              <p className="font-semibold">MicroPythonOS package warning</p>
              <ul className="list-disc pl-5">
                {mpkFeedback.map((feedback) => (
                  <li key={feedback.key}>
                    <span className="font-mono">{feedback.filePath}</span>:{" "}
                    {feedback.message}
                  </li>
                ))}
              </ul>
              <a
                className="link"
                href="https://docs.micropythonos.com/apps/badgehub/"
                target="_blank"
                rel="noreferrer"
              >
                Learn more about publishing MicroPythonOS apps on BadgeHub
              </a>
            </div>
          </div>
        )}
        <AppEditFileUpload
          slug={slug}
          expectedAppVersion={appMetadata.version}
          keycloak={keycloak}
          onUploadSuccess={handleUploadSuccess}
        />
        <AppEditFileList
          project={project}
          onSetIcon={onSetIcon}
          iconFilePath={appMetadata?.icon_map?.["64x64"]}
          onDeleteFile={onDeleteFile}
          mainExecutable={mainExecutable}
          onSetMainExecutable={onSetMainExecutable}
          onPreview={onPreviewFile}
          onPreviewArchive={onPreviewArchive}
          slug={slug}
          keycloak={keycloak}
          recentPaths={recentPaths}
        />
      </div>
    </section>
  );
};

export default AppEditFilesSection;
