import {
  getFreshAuthorizedApiClient,
  publicApiClient,
} from "@api/apiClient.ts";
import type { FileMetadata } from "@shared/domain/readModels/project/FileMetadata.ts";
import type { ProjectDetails } from "@shared/domain/readModels/project/ProjectDetails.ts";
import { assertDefined } from "@shared/util/assertions.ts";
import CodeBlock from "@sharedComponents/CodeBlock.tsx";
import type { MpkArchiveFile } from "@sharedComponents/MpkExplorer.tsx";
import Spinner from "@sharedComponents/Spinner.tsx";
import { downloadProjectFile } from "@utils/downloadProjectFile.ts";
import { getLanguageFromFile, getPreviewType } from "@utils/filePreview.ts";
import type Keycloak from "keycloak-js";
import type React from "react";
import {
  lazy,
  Suspense,
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";

const MpkExplorer = lazy(() => import("@sharedComponents/MpkExplorer.tsx"));

type PreviewFile = Pick<
  FileMetadata,
  "full_path" | "image_height" | "image_width" | "mimetype" | "url"
>;

const DownloadIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    className="w-4 h-4 text-base-content/80 hover:text-base-content"
    fill="none"
    viewBox="0 0 24 24"
    stroke="currentColor"
    strokeWidth={2}
    style={{ display: "inline", verticalAlign: "middle" }}
    aria-hidden="true"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      d="M4 16v2a2 2 0 002 2h12a2 2 0 002-2v-2M7 10l5 5m0 0l5-5m-5 5V4"
    />
  </svg>
);

// JSON Preview Component with pretty print option and syntax highlighting
const JsonPreview: React.FC<{ content: string }> = ({ content }) => {
  const [isPretty, setIsPretty] = useState(false);

  const formatJson = (jsonStr: string): string => {
    try {
      const parsed = JSON.parse(jsonStr);
      return JSON.stringify(parsed, null, 2);
    } catch (error) {
      console.warn("Failed to parse JSON, displaying raw content:", error);
      return jsonStr;
    }
  };

  const displayContent = isPretty ? formatJson(content) : content;

  return (
    <div>
      <div className="mb-2 flex items-center gap-2">
        <span className="text-base-content/80 text-sm">JSON file</span>
        <button
          type="button"
          onClick={() => setIsPretty(!isPretty)}
          className="btn btn-xs btn-ghost"
        >
          {isPretty ? "Show Raw" : "Pretty Print"}
        </button>
      </div>
      <CodeBlock language="json">{displayContent}</CodeBlock>
    </div>
  );
};

// Python Preview Component with syntax highlighting
const PythonPreview: React.FC<{ content: string }> = ({ content }) => {
  return (
    <div>
      <div className="mb-2">
        <span className="text-base-content/80 text-sm">Python file</span>
      </div>
      <CodeBlock language="python">{content}</CodeBlock>
    </div>
  );
};

// Text Preview Component with syntax highlighting for recognized file types
const TextPreview: React.FC<{ content: string; filename: string }> = ({
  content,
  filename,
}) => {
  const language = getLanguageFromFile(filename);

  if (language === "text") {
    // Plain text - use basic pre/code styling
    return (
      <div>
        <div className="mb-2">
          <span className="text-base-content/80 text-sm">Text file</span>
        </div>
        <pre className="text-base-content/80 whitespace-pre-wrap break-words">
          <code>{content}</code>
        </pre>
      </div>
    );
  }

  // Use syntax highlighting for recognized programming languages
  return (
    <div>
      <div className="mb-2">
        <span className="text-base-content/80 text-sm">{language} file</span>
      </div>
      <CodeBlock language={language}>{content}</CodeBlock>
    </div>
  );
};

// Image Preview Component
const ImagePreview: React.FC<{ file: PreviewFile; imageBlob?: Blob }> = ({
  file,
  imageBlob,
}) => {
  const [imageUrl, setImageUrl] = useState<string>(file.url || "");

  useEffect(() => {
    if (imageBlob) {
      const url = URL.createObjectURL(imageBlob);
      setImageUrl(url);
      return () => URL.revokeObjectURL(url);
    } else if (file.url) {
      setImageUrl(file.url);
    }
  }, [imageBlob, file.url]);

  return (
    <div>
      <div className="mb-2">
        <span className="text-base-content/80 text-sm">
          Image file{" "}
          {file.image_width &&
            file.image_height &&
            `(${file.image_width}×${file.image_height})`}
        </span>
      </div>
      <div className="flex justify-center">
        {imageUrl && (
          <img
            src={imageUrl}
            alt={file.full_path}
            className="max-w-full max-h-96 rounded border border-base-300"
            style={{ maxHeight: "400px" }}
          />
        )}
      </div>
    </div>
  );
};

const AudioPreview: React.FC<{ file: PreviewFile; audioBlob?: Blob }> = ({
  file,
  audioBlob,
}) => {
  const [audioUrl, setAudioUrl] = useState(file.url || "");

  useEffect(() => {
    if (audioBlob) {
      const url = URL.createObjectURL(audioBlob);
      setAudioUrl(url);
      return () => URL.revokeObjectURL(url);
    }
    setAudioUrl(file.url || "");
  }, [audioBlob, file.url]);

  return (
    <div>
      <div className="mb-2">
        <span className="text-base-content/80 text-sm">Audio file</span>
      </div>
      {audioUrl && (
        // biome-ignore lint/a11y/useMediaCaption: audio is user-uploaded content without available captions
        <audio className="w-full" controls preload="metadata" src={audioUrl}>
          Your browser does not support audio playback.
        </audio>
      )}
    </div>
  );
};

// No Preview Component for unsupported types
const NoPreview: React.FC<{ mimetype: string }> = ({ mimetype }) => {
  return (
    <div className="text-center py-8 opacity-60">
      <p>Preview not available for this file type.</p>
      <p className="text-sm mt-2">MIME type: {mimetype}</p>
      <p className="text-sm">Use the download button to view the file.</p>
    </div>
  );
};

// Helper function to render file preview content
const renderFilePreview = (
  loading: boolean,
  currentFile: PreviewFile | null,
  fileContent: string | null,
  previewBlob?: Blob,
  loadingLabel = "Downloading file..."
): React.ReactElement => {
  if (loading) {
    return (
      <div role="status" aria-label="Downloading file">
        <Spinner />
        <p className="text-center opacity-60">{loadingLabel}</p>
      </div>
    );
  }

  if (!currentFile) {
    return <div className="opacity-60">No file selected</div>;
  }

  const previewType = getPreviewType(
    currentFile.mimetype,
    currentFile.full_path
  );

  switch (previewType) {
    case "image":
      return <ImagePreview file={currentFile} imageBlob={previewBlob} />;
    case "audio":
      return <AudioPreview file={currentFile} audioBlob={previewBlob} />;
    case "mpk":
      return (
        <div className="opacity-60">Select a file inside the archive.</div>
      );
    case "json":
      return fileContent ? (
        <JsonPreview content={fileContent} />
      ) : (
        <div className="opacity-60">Loading JSON...</div>
      );
    case "python":
      return fileContent ? (
        <PythonPreview content={fileContent} />
      ) : (
        <div className="opacity-60">Loading Python file...</div>
      );
    case "text":
      return fileContent ? (
        <TextPreview content={fileContent} filename={currentFile.full_path} />
      ) : (
        <div className="opacity-60">Loading text file...</div>
      );
    case "unsupported":
      return <NoPreview mimetype={currentFile.mimetype} />;
    default:
      return <div className="opacity-60">Unknown file type</div>;
  }
};

interface AppCodePreviewProps {
  project: ProjectDetails;
  isDraft?: boolean;
  keycloak?: Keycloak;
  previewedArchiveFile?: MpkArchiveFile | null;
  previewedFile?: string | null;
  showFileList?: boolean;
}

const AppCodePreview: React.FC<AppCodePreviewProps> = ({
  project,
  isDraft = false,
  keycloak,
  previewedArchiveFile: externalArchiveFile,
  previewedFile: externalPreviewedFile,
  showFileList = true,
}) => {
  const files = useMemo(
    () => project?.version?.files ?? [],
    [project?.version?.files]
  );
  const [previewedFile, setPreviewedFile] = useState<string | null>(null);
  const [fileContent, setFileContent] = useState<string | null>(null);
  const [previewBlob, setPreviewBlob] = useState<Blob | null>(null);
  const [loading, setLoading] = useState(false);
  const [expandedMpk, setExpandedMpk] = useState<string | null>(null);
  const [archiveFile, setArchiveFile] = useState<PreviewFile | null>(null);
  const [archiveFileLoading, setArchiveFileLoading] = useState(false);
  const archiveFileRequestId = useRef(0);

  // Get the currently previewed file metadata
  const projectFile = files.find((f) => f.full_path === previewedFile) || null;
  const currentFile = archiveFile ?? projectFile;

  // Use external previewedFile if provided, otherwise find __init__.py by default
  useEffect(() => {
    if (externalPreviewedFile !== undefined) {
      setPreviewedFile(externalPreviewedFile);
      setArchiveFile(null);
      return;
    }

    if (!files?.length) {
      setPreviewedFile(null);
      setFileContent(null);
      setPreviewBlob(null);
      return;
    }
    const initFile = files.find(
      (f) =>
        (f.name === "__init__" && f.ext === "py") ||
        f.full_path === "__init__.py"
    );
    if (initFile) {
      setPreviewedFile(initFile.full_path);
    } else {
      setPreviewedFile(null);
      setFileContent(null);
      setPreviewBlob(null);
    }
  }, [files, externalPreviewedFile]);

  // Fetch file content when previewedFile changes
  useEffect(() => {
    if (archiveFile) return;

    if (!previewedFile || !projectFile) {
      setFileContent(null);
      setPreviewBlob(null);
      return;
    }

    // For unsupported types, don't fetch content
    if (
      getPreviewType(projectFile.mimetype, projectFile.full_path) ===
      "unsupported"
    ) {
      setFileContent(null);
      setPreviewBlob(null);
      setLoading(false);
      return;
    }

    setLoading(true);

    const fetchContent = async () => {
      try {
        if (isDraft) {
          // Draft mode - use authenticated API
          assertDefined(keycloak);
          const client = await getFreshAuthorizedApiClient(keycloak);
          const response = await client.getDraftFile({
            params: { slug: project.slug, filePath: previewedFile },
          });

          if (response.status === 200 && response.body !== undefined) {
            // Binary previews need an object URL for authenticated draft files.
            const previewType = getPreviewType(
              projectFile.mimetype,
              projectFile.full_path
            );
            if (
              previewType === "image" ||
              previewType === "audio" ||
              previewType === "mpk"
            ) {
              if (response.body instanceof Blob) {
                setPreviewBlob(response.body);
                setFileContent(null);
              } else {
                setFileContent("// Unable to display file content");
                setPreviewBlob(null);
              }
            } else if (typeof response.body === "string") {
              setFileContent(response.body);
              setPreviewBlob(null);
            } else if (response.body instanceof Blob) {
              setFileContent(await response.body.text());
              setPreviewBlob(null);
            } else {
              // Already-parsed JSON or other non-blob bodies
              setFileContent(JSON.stringify(response.body));
              setPreviewBlob(null);
            }
          } else {
            setFileContent("// Unable to load file");
            setPreviewBlob(null);
          }
        } else {
          // Published mode - use public API
          const res = await publicApiClient.getLatestPublishedFile({
            params: {
              slug: project.slug,
              filePath: previewedFile,
            },
          });

          if (res.status === 200) {
            if (
              ["image", "audio"].includes(
                getPreviewType(projectFile.mimetype, projectFile.full_path)
              )
            ) {
              // Published binary previews can use the file URL directly.
              setPreviewBlob(null);
              setFileContent(null);
            } else if (
              getPreviewType(projectFile.mimetype, projectFile.full_path) ===
                "mpk" &&
              res.body instanceof Blob
            ) {
              setPreviewBlob(res.body);
              setFileContent(null);
            } else if (typeof res.body === "string") {
              setFileContent(res.body);
              setPreviewBlob(null);
            } else if (res.body instanceof Blob) {
              const text = await res.body.text();
              setFileContent(text);
              setPreviewBlob(null);
            } else if (res.body !== undefined) {
              // The API client may return already-parsed JSON (e.g. for
              // .json files with a proper Content-Type per #398),
              // so the body can arrive as an object rather than as text/Blob.
              // Stringify compactly (no indent) so JsonPreview's raw/pretty
              // toggle still has an actual formatting difference to show.
              setFileContent(JSON.stringify(res.body));
              setPreviewBlob(null);
            } else {
              setFileContent("// Unable to display file content");
              setPreviewBlob(null);
            }
          } else {
            setFileContent("// Unable to load file");
            setPreviewBlob(null);
          }
        }
      } catch (error) {
        console.error("Failed to fetch file content:", error);
        setFileContent(
          "// Network error - please check your connection and try again"
        );
        setPreviewBlob(null);
      } finally {
        setLoading(false);
      }
    };

    fetchContent();
  }, [
    previewedFile,
    project.slug,
    projectFile,
    archiveFile,
    isDraft,
    keycloak,
  ]);

  const handlePreview = (fullPath: string) => {
    archiveFileRequestId.current += 1;
    setArchiveFile(null);
    setExpandedMpk(null);
    setPreviewedFile(fullPath);
  };

  const fetchMpkBlob = async (file: FileMetadata): Promise<Blob> => {
    const response = isDraft
      ? await (async () => {
          assertDefined(keycloak);
          const client = await getFreshAuthorizedApiClient(keycloak);
          return client.getDraftFile({
            params: { slug: project.slug, filePath: file.full_path },
          });
        })()
      : await publicApiClient.getLatestPublishedFile({
          params: { slug: project.slug, filePath: file.full_path },
        });

    if (response.status !== 200 || !(response.body instanceof Blob)) {
      throw new Error("MPK download did not return a file");
    }
    return response.body;
  };

  const handleToggleMpk = (file: FileMetadata) => {
    if (expandedMpk === file.full_path) {
      setExpandedMpk(null);
      setArchiveFile(null);
      setFileContent(null);
      setPreviewBlob(null);
      return;
    }

    setExpandedMpk(file.full_path);
    setPreviewedFile(null);
    setArchiveFile(null);
    setFileContent(null);
    setPreviewBlob(null);
  };

  const handleArchivePreview = useCallback(async (file: MpkArchiveFile) => {
    const requestId = ++archiveFileRequestId.current;
    const archivePreviewFile: PreviewFile = {
      full_path: file.path,
      mimetype: "application/octet-stream",
      url: "",
    };
    setArchiveFile(archivePreviewFile);
    setPreviewedFile(null);
    setFileContent(null);
    setPreviewBlob(null);

    const previewType = getPreviewType(
      archivePreviewFile.mimetype,
      archivePreviewFile.full_path
    );
    if (previewType === "unsupported") {
      setArchiveFileLoading(false);
      return;
    }

    setArchiveFileLoading(true);
    try {
      const blob = await file.load();
      if (requestId !== archiveFileRequestId.current) return;
      if (previewType === "image" || previewType === "audio") {
        setPreviewBlob(blob);
      } else {
        setFileContent(await blob.text());
      }
    } catch (error) {
      if (requestId === archiveFileRequestId.current) {
        console.error("Failed to extract MPK entry:", error);
        setFileContent("// Unable to extract this archive entry");
      }
    } finally {
      if (requestId === archiveFileRequestId.current) {
        setArchiveFileLoading(false);
      }
    }
  }, []);

  useEffect(() => {
    if (externalArchiveFile === undefined) return;
    if (externalArchiveFile) void handleArchivePreview(externalArchiveFile);
    else setArchiveFile(null);
  }, [externalArchiveFile, handleArchivePreview]);

  const handleDownload = async (file: FileMetadata) => {
    if (isDraft) {
      if (!keycloak) {
        throw new Error("Keycloak is required to download draft files");
      }
      // Draft mode - download via API
      await downloadProjectFile(keycloak, project.slug, file);
    } else {
      // Published mode - use direct URL
      window.location.href = file.url;
    }
  };

  return (
    <section
      className="card bg-base-200 shadow-lg text-left"
      data-testid="code-preview-section"
    >
      <div className="card-body">
        <h2 className="card-title text-2xl mb-4">Code Preview / Files</h2>
        {showFileList && (
          <div className="flex flex-col md:flex-row gap-8">
            <div className="w-full">
              <h3 className="text-lg font-medium text-base-content mb-2">
                Project Files:
              </h3>
              <ul className="list-none text-sm space-y-1">
                {files.map((f) => {
                  const isMpk =
                    getPreviewType(f.mimetype, f.full_path) === "mpk";
                  const isExpanded = expandedMpk === f.full_path;
                  return (
                    <li key={f.full_path}>
                      <div className="flex items-center gap-2">
                        <button
                          type="button"
                          className="btn btn-xs btn-ghost"
                          onClick={() => handleDownload(f)}
                          title="Download file"
                          style={{
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            background: "none",
                            border: "none",
                            cursor: "pointer",
                          }}
                        >
                          <DownloadIcon />
                        </button>
                        {isMpk && (
                          <span aria-hidden="true" className="w-3 opacity-60">
                            {isExpanded ? "v" : ">"}
                          </span>
                        )}
                        <button
                          type="button"
                          className={`text-left hover:underline font-mono ${
                            previewedFile === f.full_path || isExpanded
                              ? "text-base-content font-bold"
                              : "opacity-60"
                          }`}
                          onClick={() =>
                            isMpk
                              ? handleToggleMpk(f)
                              : handlePreview(f.full_path)
                          }
                          style={{
                            background: "none",
                            border: "none",
                            padding: 0,
                            cursor: "pointer",
                          }}
                          title={isMpk ? "Explore archive" : "Preview file"}
                          aria-label={
                            isMpk
                              ? `${isExpanded ? "Collapse" : "Expand"} ${f.full_path}`
                              : `Preview ${f.full_path}`
                          }
                        >
                          {f.full_path}
                        </button>
                        {f.size_formatted ? (
                          <span className="ml-2 opacity-60">
                            {f.size_formatted}
                          </span>
                        ) : null}
                      </div>
                      {isExpanded && (
                        <Suspense
                          fallback={
                            <div
                              role="status"
                              aria-label="Loading archive explorer"
                            >
                              <Spinner />
                            </div>
                          }
                        >
                          <MpkExplorer
                            filename={f.full_path}
                            loadArchive={() => fetchMpkBlob(f)}
                            onSelect={(file) => void handleArchivePreview(file)}
                            selectedPath={archiveFile?.full_path ?? null}
                          />
                        </Suspense>
                      )}
                    </li>
                  );
                })}
              </ul>
            </div>
          </div>
        )}
        <div className={showFileList ? "mt-6 md:ml-0" : "mt-4"}>
          <div className="code-block font-mono text-sm bg-base-300 rounded p-4 overflow-x-auto min-h-[200px]">
            {renderFilePreview(
              loading || archiveFileLoading,
              currentFile,
              fileContent,
              previewBlob || undefined,
              archiveFileLoading
                ? "Extracting archive entry..."
                : "Downloading file..."
            )}
          </div>
        </div>
      </div>
    </section>
  );
};

export default AppCodePreview;
