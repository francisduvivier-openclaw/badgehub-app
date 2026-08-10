import { getLanguageFromFile, getPreviewType } from "@utils/filePreview.ts";
import { describe, expect, it } from "vitest";

describe("getPreviewType", () => {
  it("recognizes MPK archives by extension", () => {
    expect(getPreviewType("application/octet-stream", "package.mpk")).toBe(
      "mpk"
    );
  });

  it("detects image types by mimetype", () => {
    expect(getPreviewType("image/png", "icon.png")).toBe("image");
  });

  it("detects audio types by mimetype", () => {
    expect(getPreviewType("audio/x-wav", "sounds/Warning.wav")).toBe("audio");
    expect(getPreviewType("audio/mpeg", "sounds/music.mp3")).toBe("audio");
  });

  it("detects json types by mimetype", () => {
    expect(getPreviewType("application/json", "data.json")).toBe("json");
  });

  it("detects python types by mimetype", () => {
    expect(getPreviewType("text/x-python", "main.py")).toBe("python");
  });

  it("detects text types by mimetype", () => {
    expect(getPreviewType("text/plain", "readme.txt")).toBe("text");
  });

  it("falls back to extension for octet-stream", () => {
    expect(getPreviewType("application/octet-stream", "script.py")).toBe(
      "python"
    );
    expect(getPreviewType("application/octet-stream", "notes.md")).toBe("text");
    expect(getPreviewType("application/octet-stream", "photo.jpg")).toBe(
      "image"
    );
    expect(
      getPreviewType("application/octet-stream", "sounds/Warning.wav")
    ).toBe("audio");
  });

  it("returns unsupported when no match is found", () => {
    expect(getPreviewType("application/zip", "archive.zip")).toBe(
      "unsupported"
    );
  });
});

describe("getLanguageFromFile", () => {
  it("maps known extensions to syntax highlighter language", () => {
    expect(getLanguageFromFile("component.tsx")).toBe("tsx");
    expect(getLanguageFromFile("script.py")).toBe("python");
  });

  it("falls back to text for unknown extensions", () => {
    expect(getLanguageFromFile("file.unknownext")).toBe("text");
  });
});
