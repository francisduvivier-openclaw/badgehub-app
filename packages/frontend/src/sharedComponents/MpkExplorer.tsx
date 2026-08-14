import Spinner from "@sharedComponents/Spinner.tsx";
import {
  inspectMpkIdentity,
  type MpkIdentityInspection,
} from "@utils/mpkIdentity.ts";
import {
  BlobReader,
  BlobWriter,
  type FileEntry,
  ZipReader,
} from "@zip.js/zip.js";
import type React from "react";
import { useEffect, useMemo, useRef, useState } from "react";

export type MpkArchiveFile = {
  load: () => Promise<Blob>;
  path: string;
  size: number;
};

type ArchiveNode = {
  children: ArchiveNode[];
  entry?: FileEntry;
  name: string;
  path: string;
};

const extensionOf = (path: string) => path.toLowerCase().split(".").pop() ?? "";

const mimeTypeFor = (path: string): string => {
  const extension = extensionOf(path);
  const types: Record<string, string> = {
    gif: "image/gif",
    jpeg: "image/jpeg",
    jpg: "image/jpeg",
    json: "application/json",
    mp3: "audio/mpeg",
    ogg: "audio/ogg",
    png: "image/png",
    py: "text/x-python",
    svg: "image/svg+xml",
    wav: "audio/wav",
    webp: "image/webp",
  };
  return types[extension] ?? "application/octet-stream";
};

const buildTree = (entries: FileEntry[]): ArchiveNode[] => {
  const root: ArchiveNode = { children: [], name: "", path: "" };

  for (const entry of entries) {
    const parts = entry.filename.split("/").filter(Boolean);
    let parent = root;
    parts.forEach((part, index) => {
      const path = parts.slice(0, index + 1).join("/");
      let node = parent.children.find((child) => child.name === part);
      if (!node) {
        node = { children: [], name: part, path };
        parent.children.push(node);
      }
      if (index === parts.length - 1) node.entry = entry;
      parent = node;
    });
  }

  const sortNodes = (nodes: ArchiveNode[]) => {
    nodes.sort((left, right) => {
      const leftFolder = left.children.length > 0 && !left.entry;
      const rightFolder = right.children.length > 0 && !right.entry;
      if (leftFolder !== rightFolder) return leftFolder ? -1 : 1;
      return left.name.localeCompare(right.name);
    });
    nodes.forEach((node) => {
      sortNodes(node.children);
    });
  };
  sortNodes(root.children);

  const compactNode = (node: ArchiveNode): ArchiveNode => {
    let compacted = {
      ...node,
      children: node.children.map(compactNode),
    };
    while (
      !compacted.entry &&
      compacted.children.length === 1 &&
      !compacted.children[0]?.entry
    ) {
      const child = compacted.children[0];
      if (!child) break;
      compacted = {
        ...child,
        name: `${compacted.name}/${child.name}`,
      };
    }
    return compacted;
  };

  return root.children.map(compactNode);
};

const ArchiveNodes: React.FC<{
  depth?: number;
  nodes: ArchiveNode[];
  onSelect: (file: MpkArchiveFile) => void;
  onToggleFolder: (path: string) => void;
  collapsedFolders: ReadonlySet<string>;
  selectedPath: string | null;
}> = ({
  collapsedFolders,
  depth = 0,
  nodes,
  onSelect,
  onToggleFolder,
  selectedPath,
}) => (
  <ul className={depth === 0 ? "space-y-1" : "mt-1 space-y-1"}>
    {nodes.map((node) => {
      const isFolder = node.children.length > 0 && !node.entry;
      const isCollapsed = collapsedFolders.has(node.path);
      return (
        <li key={node.path}>
          {isFolder ? (
            <button
              type="button"
              className="flex w-full items-center gap-2 rounded py-1 text-left font-mono opacity-70 hover:bg-base-300 hover:opacity-100"
              style={{ paddingLeft: `${depth * 1.25}rem` }}
              onClick={() => onToggleFolder(node.path)}
              aria-label={`${isCollapsed ? "Expand" : "Collapse"} folder ${node.name}`}
            >
              <span aria-hidden="true" className="w-3 text-center">
                {isCollapsed ? ">" : "v"}
              </span>
              <span className="break-all">{node.name}/</span>
            </button>
          ) : node.entry ? (
            <button
              type="button"
              className={`w-full py-1 text-left font-mono hover:underline ${
                selectedPath === node.path
                  ? "font-bold text-base-content"
                  : "opacity-60"
              }`}
              style={{ paddingLeft: `${depth * 1.25}rem` }}
              onClick={() => {
                const entry = node.entry;
                if (!entry) return;
                onSelect({
                  path: entry.filename,
                  size: entry.uncompressedSize,
                  load: () =>
                    entry.getData(new BlobWriter(mimeTypeFor(entry.filename))),
                });
              }}
              title={`Preview ${node.path}`}
            >
              {node.name}
            </button>
          ) : null}
          {node.children.length > 0 && !isCollapsed && (
            <ArchiveNodes
              collapsedFolders={collapsedFolders}
              depth={depth + 1}
              nodes={node.children}
              onSelect={onSelect}
              onToggleFolder={onToggleFolder}
              selectedPath={selectedPath}
            />
          )}
        </li>
      );
    })}
  </ul>
);

const ArchiveContents: React.FC<{
  blob: Blob;
  expectedAppSlug?: string;
  filename: string;
  onSelect: (file: MpkArchiveFile) => void;
  selectedPath: string | null;
}> = ({ blob, expectedAppSlug, filename, onSelect, selectedPath }) => {
  const [entries, setEntries] = useState<FileEntry[] | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [identity, setIdentity] = useState<MpkIdentityInspection | null>(null);
  const [collapsedFolders, setCollapsedFolders] = useState<ReadonlySet<string>>(
    () => new Set()
  );

  useEffect(() => {
    let active = true;
    const reader = new ZipReader(new BlobReader(blob));
    setEntries(null);
    setError(null);
    setIdentity(null);

    if (expectedAppSlug) {
      void inspectMpkIdentity(blob, expectedAppSlug).then((inspection) => {
        if (active) setIdentity(inspection);
      });
    }

    void reader
      .getEntries()
      .then((archiveEntries) => {
        if (active) {
          setEntries(
            archiveEntries.filter(
              (entry): entry is FileEntry => !entry.directory
            )
          );
        }
      })
      .catch(() => {
        if (active) setError("This MPK file could not be read.");
      });

    return () => {
      active = false;
      void reader.close();
    };
  }, [blob, expectedAppSlug]);

  const nodes = useMemo(() => (entries ? buildTree(entries) : []), [entries]);
  const handleToggleFolder = (path: string) => {
    setCollapsedFolders((current) => {
      const next = new Set(current);
      if (next.has(path)) next.delete(path);
      else next.add(path);
      return next;
    });
  };

  if (!entries && !error) {
    return (
      <div role="status" aria-label={`Reading file list for ${filename}`}>
        <Spinner />
        <p className="text-center opacity-60">Reading archive file list...</p>
      </div>
    );
  }

  if (error) return <div className="alert alert-error">{error}</div>;

  return (
    <div
      className="ml-8 border-l border-base-300 pl-3"
      data-testid="mpk-explorer"
    >
      {identity && (identity.error || identity.warnings.length > 0) && (
        <div className="alert alert-warning mb-3 text-sm" role="alert">
          <div>
            <p className="font-semibold">MicroPythonOS package warning</p>
            {identity.error && <p>{identity.error}</p>}
            {identity.warnings.length > 0 && (
              <ul className="list-disc pl-5">
                {identity.warnings.map((warning) => (
                  <li key={warning.code}>{warning.message}</li>
                ))}
              </ul>
            )}
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
      {nodes.length > 0 ? (
        <ArchiveNodes
          collapsedFolders={collapsedFolders}
          nodes={nodes}
          onSelect={onSelect}
          onToggleFolder={handleToggleFolder}
          selectedPath={selectedPath}
        />
      ) : (
        <p className="py-2 opacity-60">This archive is empty.</p>
      )}
    </div>
  );
};

const MpkExplorer: React.FC<{
  expectedAppSlug?: string;
  filename: string;
  loadArchive: () => Promise<Blob>;
  onSelect: (file: MpkArchiveFile) => void;
  selectedPath: string | null;
}> = ({ expectedAppSlug, filename, loadArchive, onSelect, selectedPath }) => {
  const loadArchiveRef = useRef(loadArchive);
  const [blob, setBlob] = useState<Blob | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let active = true;
    void loadArchiveRef
      .current()
      .then((archiveBlob) => {
        if (active) setBlob(archiveBlob);
      })
      .catch(() => {
        if (active) setError("Unable to download this MPK file.");
      });
    return () => {
      active = false;
    };
  }, []);

  if (!blob && !error) {
    return (
      <div role="status" aria-label="Downloading file">
        <Spinner />
        <p className="text-center opacity-60">Downloading MPK archive...</p>
      </div>
    );
  }

  if (error) return <div className="alert alert-error my-2">{error}</div>;

  return (
    <ArchiveContents
      blob={blob as Blob}
      expectedAppSlug={expectedAppSlug}
      filename={filename}
      onSelect={onSelect}
      selectedPath={selectedPath}
    />
  );
};

export default MpkExplorer;
