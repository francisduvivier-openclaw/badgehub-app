import {
  BlobReader,
  type FileEntry,
  TextWriter,
  ZipReader,
} from "@zip.js/zip.js";

const MAX_MANIFEST_SIZE_BYTES = 1024 * 1024;

export type MpkIdentityWarning = {
  code:
    | "directory_fullname_mismatch"
    | "fullname_slug_mismatch"
    | "version_mismatch";
  message: string;
};

export type MpkIdentityInspection = {
  directory?: string;
  error?: string;
  fullname?: string;
  warnings: MpkIdentityWarning[];
};

const normalizeArchivePath = (path: string) =>
  path.replace(/\\/g, "/").replace(/^\.\//, "").replace(/\/+/g, "/");

const isIgnoredArchivePath = (path: string) => {
  if (!path) return true;
  if (path === "__MACOSX" || path.startsWith("__MACOSX/")) return true;
  const basename = path.replace(/\/$/, "").split("/").pop() ?? "";
  return basename === ".DS_Store" || basename.startsWith("._");
};

export async function inspectMpkIdentity(
  blob: Blob,
  appSlug: string,
  appVersion?: string
): Promise<MpkIdentityInspection> {
  const reader = new ZipReader(new BlobReader(blob));

  try {
    const entries = (await reader.getEntries())
      .map((entry) => ({
        entry,
        path: normalizeArchivePath(entry.filename),
      }))
      .filter(({ path }) => !isIgnoredArchivePath(path));

    const topLevelDirectories = new Set(
      entries.map(({ path }) => path.split("/")[0]).filter(Boolean)
    );
    if (topLevelDirectories.size !== 1) {
      return {
        error: "MPK must contain exactly one top-level application directory.",
        warnings: [],
      };
    }

    const directory = [...topLevelDirectories][0];
    const manifest = entries.find(
      ({ entry, path }) =>
        !entry.directory &&
        path.toLowerCase() === `${directory}/manifest.json`.toLowerCase()
    ) as { entry: FileEntry; path: string } | undefined;

    if (!manifest) {
      return {
        directory,
        error:
          "MPK does not contain MANIFEST.JSON in its application directory.",
        warnings: [],
      };
    }
    if (manifest.entry.uncompressedSize > MAX_MANIFEST_SIZE_BYTES) {
      return {
        directory,
        error: "MANIFEST.JSON is too large to inspect.",
        warnings: [],
      };
    }

    let parsed: unknown;
    try {
      const text = await manifest.entry.getData(new TextWriter());
      parsed = JSON.parse(text);
    } catch {
      return {
        directory,
        error: "MANIFEST.JSON is not valid JSON.",
        warnings: [],
      };
    }

    if (!parsed || typeof parsed !== "object") {
      return {
        directory,
        error: "MANIFEST.JSON must contain a JSON object.",
        warnings: [],
      };
    }

    const manifestData = parsed as Record<string, unknown>;
    const fullnameValue = manifestData.fullname;
    if (typeof fullnameValue !== "string" || !fullnameValue.trim()) {
      return {
        directory,
        error: "MANIFEST.JSON does not contain a fullname.",
        warnings: [],
      };
    }

    const fullname = fullnameValue.trim();
    const warnings: MpkIdentityWarning[] = [];
    if (fullname !== appSlug) {
      warnings.push({
        code: "fullname_slug_mismatch",
        message: `MANIFEST fullname "${fullname}" does not match BadgeHub app identifier "${appSlug}".`,
      });
    }
    if (directory !== fullname) {
      warnings.push({
        code: "directory_fullname_mismatch",
        message: `MPK directory "${directory}" does not match MANIFEST fullname "${fullname}".`,
      });
    }
    const expectedVersion = appVersion?.trim();
    if (expectedVersion) {
      const manifestVersionValue = manifestData.version;
      const manifestVersion =
        typeof manifestVersionValue === "string"
          ? manifestVersionValue.trim()
          : undefined;
      if (manifestVersion !== expectedVersion) {
        warnings.push({
          code: "version_mismatch",
          message: manifestVersion
            ? `MANIFEST version "${manifestVersion}" does not match BadgeHub version "${expectedVersion}".`
            : `MANIFEST version is missing or invalid and does not match BadgeHub version "${expectedVersion}".`,
        });
      }
    }

    return { directory, fullname, warnings };
  } catch {
    return {
      error: "This MPK file could not be inspected.",
      warnings: [],
    };
  } finally {
    await reader.close().catch(() => undefined);
  }
}
