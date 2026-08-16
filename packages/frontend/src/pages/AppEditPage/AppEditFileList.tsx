import { getFreshAuthorizedApiClient } from "@api/apiClient.ts";
import { FileListItem } from "@pages/AppEditPage/FileListItem.tsx";
import type { ProjectDetails } from "@shared/domain/readModels/project/ProjectDetails.ts";
import type { MpkArchiveFile } from "@sharedComponents/MpkExplorer.tsx";
import Spinner from "@sharedComponents/Spinner.tsx";
import { getPreviewType } from "@utils/filePreview.ts";
import type Keycloak from "keycloak-js";
import type React from "react";
import { lazy, Suspense, useMemo, useState } from "react";

const MpkExplorer = lazy(() => import("@sharedComponents/MpkExplorer.tsx"));

interface AppEditFileListProps {
  project: ProjectDetails;
  onSetIcon?: (filePath: string) => void;
  iconFilePath?: string;
  onDeleteFile?: (filePath: string) => void;
  mainExecutable?: string;
  onSetMainExecutable?: (filePath: string) => void;
  onPreview?: (filePath: string) => void;
  onPreviewArchive?: (file: MpkArchiveFile) => void;
  slug: string;
  keycloak: Keycloak;
  recentPaths?: ReadonlySet<string>;
}

/**
 * Displays a list of project files with actions to delete or set an icon/main executable.
 * Sorted by most recently updated first so new uploads appear at the top.
 */
const AppEditFileList: React.FC<AppEditFileListProps> = ({
  project,
  onSetIcon,
  iconFilePath,
  onDeleteFile,
  mainExecutable,
  onSetMainExecutable,
  onPreview,
  onPreviewArchive,
  slug,
  keycloak,
  recentPaths,
}) => {
  const [expandedMpk, setExpandedMpk] = useState<string | null>(null);
  const [selectedArchivePath, setSelectedArchivePath] = useState<string | null>(
    null
  );
  const files = useMemo(() => {
    const list = project?.version?.files ?? [];
    return [...list].sort(
      (a, b) => Date.parse(b.updated_at) - Date.parse(a.updated_at)
    );
  }, [project?.version?.files]);

  if (files.length === 0) {
    return (
      <p
        className="opacity-50 italic text-sm"
        data-testid="app-edit-file-list-empty"
      >
        No files yet. Drop files above to add them to this draft.
      </p>
    );
  }

  return (
    <ul
      className="list-none text-sm space-y-1"
      data-testid="app-edit-file-list"
    >
      {files.map((file) => {
        const isMpk = getPreviewType(file.mimetype, file.full_path) === "mpk";
        const isExpanded = expandedMpk === file.full_path;
        const loadArchive = async () => {
          const client = await getFreshAuthorizedApiClient(keycloak);
          const response = await client.getDraftFile({
            params: { slug, filePath: file.full_path },
          });
          if (response.status !== 200 || !(response.body instanceof Blob)) {
            throw new Error("MPK download did not return a file");
          }
          return response.body;
        };

        return (
          <FileListItem
            key={file.full_path}
            file={file}
            onDeleteFile={onDeleteFile}
            onSetIcon={onSetIcon}
            iconFilePath={iconFilePath}
            mainExecutable={mainExecutable}
            onSetMainExecutable={onSetMainExecutable}
            onPreview={
              onPreview
                ? (filePath) => {
                    setSelectedArchivePath(null);
                    onPreview(filePath);
                  }
                : undefined
            }
            onToggleArchive={
              isMpk
                ? () => {
                    setSelectedArchivePath(null);
                    setExpandedMpk(isExpanded ? null : file.full_path);
                  }
                : undefined
            }
            archiveExpanded={isExpanded}
            slug={slug}
            keycloak={keycloak}
            isRecent={recentPaths?.has(file.full_path) ?? false}
          >
            {isExpanded && (
              <Suspense
                fallback={
                  <div role="status" aria-label="Loading archive explorer">
                    <Spinner />
                  </div>
                }
              >
                <MpkExplorer
                  expectedAppSlug={slug}
                  expectedAppVersion={project.version.app_metadata.version}
                  filename={file.full_path}
                  loadArchive={loadArchive}
                  onSelect={(archiveFile) => {
                    setSelectedArchivePath(archiveFile.path);
                    onPreviewArchive?.(archiveFile);
                  }}
                  selectedPath={selectedArchivePath}
                />
              </Suspense>
            )}
          </FileListItem>
        );
      })}
    </ul>
  );
};

export default AppEditFileList;
