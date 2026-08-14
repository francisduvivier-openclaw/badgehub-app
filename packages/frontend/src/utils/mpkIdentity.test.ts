import { strToU8, zipSync } from "fflate";
import { describe, expect, it } from "vitest";
import { inspectMpkIdentity } from "./mpkIdentity.ts";

const mpk = (entries: Record<string, Uint8Array>) => {
  const archive = zipSync(entries);
  return new Blob([archive.buffer as ArrayBuffer]);
};

const manifest = (fullname: string) =>
  strToU8(JSON.stringify({ fullname, name: "Demo" }));

describe("inspectMpkIdentity", () => {
  it("accepts matching slug, fullname and directory", async () => {
    const result = await inspectMpkIdentity(
      mpk({
        "com.example.demo/MANIFEST.JSON": manifest("com.example.demo"),
        "com.example.demo/main.py": strToU8("print('demo')"),
      }),
      "com.example.demo"
    );

    expect(result).toEqual({
      directory: "com.example.demo",
      fullname: "com.example.demo",
      warnings: [],
    });
  });

  it("warns when the manifest fullname differs from the app slug", async () => {
    const result = await inspectMpkIdentity(
      mpk({
        "com.example.demo/MANIFEST.JSON": manifest("com.example.demo"),
      }),
      "different-slug"
    );

    expect(result.warnings).toEqual([
      expect.objectContaining({ code: "fullname_slug_mismatch" }),
    ]);
  });

  it("warns when the MPK directory differs from the manifest fullname", async () => {
    const result = await inspectMpkIdentity(
      mpk({
        "wrong-directory/MANIFEST.JSON": manifest("com.example.demo"),
      }),
      "com.example.demo"
    );

    expect(result.warnings.map(({ code }) => code)).toEqual([
      "directory_fullname_mismatch",
    ]);
  });

  it("reports an unreadable manifest separately from identity warnings", async () => {
    const result = await inspectMpkIdentity(
      mpk({ "com.example.demo/MANIFEST.JSON": strToU8("{") }),
      "com.example.demo"
    );

    expect(result.error).toBe("MANIFEST.JSON is not valid JSON.");
    expect(result.warnings).toEqual([]);
  });
});
