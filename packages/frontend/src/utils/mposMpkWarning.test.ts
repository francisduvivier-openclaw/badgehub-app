import { describe, expect, it } from "vitest";
import { shouldWarnMposNeedsMpk } from "./mposMpkWarning.ts";

describe("shouldWarnMposNeedsMpk", () => {
  it("warns when an mpos_api badge is selected without an MPK", () => {
    expect(
      shouldWarnMposNeedsMpk({ badges: ["mpos_api_v1"], filePaths: [] })
    ).toBe(true);
  });

  it("warns for a Python file when a fri3d badge is selected", () => {
    expect(
      shouldWarnMposNeedsMpk({
        badges: ["fri3d_2024"],
        filePaths: ["src/main.py"],
      })
    ).toBe(true);
  });

  it("does not infer MPOS from a Python file for other badges", () => {
    expect(
      shouldWarnMposNeedsMpk({
        badges: ["why2025"],
        filePaths: ["main.py"],
      })
    ).toBe(false);
  });

  it("does not warn for a fri3d badge without a Python file", () => {
    expect(
      shouldWarnMposNeedsMpk({ badges: ["fri3d_2024"], filePaths: [] })
    ).toBe(false);
  });

  it("stops warning once an MPK is present", () => {
    expect(
      shouldWarnMposNeedsMpk({
        badges: ["mpos_api_v1", "fri3d_2024"],
        filePaths: ["main.py", "APP.MPK"],
      })
    ).toBe(false);
  });
});
