import { getFreshAuthorizedApiClient } from "@api/apiClient.ts";
import type { AppMetadataJSON } from "@shared/domain/readModels/project/AppMetadataJSON.ts";
import { act, renderHook } from "@testing-library/react";
import type Keycloak from "keycloak-js";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { AUTOSAVE_DEBOUNCE_MS } from "./editPageFeedback.ts";
import { useDraftMetadataAutosave } from "./useDraftMetadataAutosave.ts";

vi.mock("@api/apiClient.ts", async (importOriginal) => {
  const actual = await importOriginal<typeof import("@api/apiClient.ts")>();
  return {
    ...actual,
    getFreshAuthorizedApiClient: vi.fn(),
  };
});

const keycloak = { authenticated: true } as Keycloak;

function metadata(name: string): AppMetadataJSON {
  return { name, description: "A test app" };
}

describe("useDraftMetadataAutosave", () => {
  const changeDraftAppMetadata = vi.fn();

  beforeEach(() => {
    changeDraftAppMetadata.mockReset();
    changeDraftAppMetadata.mockResolvedValue({
      status: 204,
      body: undefined,
      headers: new Headers(),
    });
    vi.mocked(getFreshAuthorizedApiClient).mockResolvedValue({
      changeDraftAppMetadata,
    } as unknown as Awaited<ReturnType<typeof getFreshAuthorizedApiClient>>);
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it("does not save on mount", async () => {
    renderHook(() =>
      useDraftMetadataAutosave({
        slug: "demo",
        appMetadata: metadata("Demo"),
        keycloak,
      })
    );

    await act(async () => {
      await vi.advanceTimersByTimeAsync(AUTOSAVE_DEBOUNCE_MS);
    });

    expect(changeDraftAppMetadata).not.toHaveBeenCalled();
  });

  it("debounces metadata saves by 3 seconds", async () => {
    const { rerender } = renderHook(
      ({ appMetadata }) =>
        useDraftMetadataAutosave({
          slug: "demo",
          appMetadata,
          keycloak,
        }),
      { initialProps: { appMetadata: metadata("Demo") } }
    );

    rerender({ appMetadata: metadata("Demo 1") });
    await act(async () => {
      await vi.advanceTimersByTimeAsync(AUTOSAVE_DEBOUNCE_MS - 1);
    });
    expect(changeDraftAppMetadata).not.toHaveBeenCalled();

    rerender({ appMetadata: metadata("Demo 12") });
    await act(async () => {
      await vi.advanceTimersByTimeAsync(AUTOSAVE_DEBOUNCE_MS - 1);
    });
    expect(changeDraftAppMetadata).not.toHaveBeenCalled();

    await act(async () => {
      await vi.advanceTimersByTimeAsync(1);
    });

    expect(changeDraftAppMetadata).toHaveBeenCalledTimes(1);
    expect(changeDraftAppMetadata).toHaveBeenCalledWith({
      params: { slug: "demo" },
      body: metadata("Demo 12"),
    });
  });

  it("saves immediately when saveNow is called", async () => {
    const { result, rerender } = renderHook(
      ({ appMetadata }) =>
        useDraftMetadataAutosave({
          slug: "demo",
          appMetadata,
          keycloak,
        }),
      { initialProps: { appMetadata: metadata("Demo") } }
    );

    rerender({ appMetadata: metadata("Updated") });

    await act(async () => {
      await result.current.saveNow();
    });

    expect(changeDraftAppMetadata).toHaveBeenCalledTimes(1);
    expect(changeDraftAppMetadata).toHaveBeenCalledWith({
      params: { slug: "demo" },
      body: metadata("Updated"),
    });

    await act(async () => {
      await vi.advanceTimersByTimeAsync(AUTOSAVE_DEBOUNCE_MS);
    });
    expect(changeDraftAppMetadata).toHaveBeenCalledTimes(1);
  });

  it("does not save when metadata is unchanged", async () => {
    const { result } = renderHook(() =>
      useDraftMetadataAutosave({
        slug: "demo",
        appMetadata: metadata("Demo"),
        keycloak,
      })
    );

    await act(async () => {
      await result.current.saveNow();
    });

    expect(changeDraftAppMetadata).not.toHaveBeenCalled();
  });

  it("forces a save when metadata is unchanged", async () => {
    const unchangedMetadata = metadata("Demo");
    const { result } = renderHook(() =>
      useDraftMetadataAutosave({
        slug: "demo",
        appMetadata: unchangedMetadata,
        keycloak,
      })
    );

    await act(async () => {
      await result.current.saveNow({ force: true });
    });

    expect(changeDraftAppMetadata).toHaveBeenCalledTimes(1);
    expect(changeDraftAppMetadata).toHaveBeenCalledWith({
      params: { slug: "demo" },
      body: unchangedMetadata,
    });
  });

  it("reports an error when the save request fails", async () => {
    const consoleErrorSpy = vi
      .spyOn(console, "error")
      .mockImplementation(() => {});
    changeDraftAppMetadata.mockResolvedValue({
      status: 500,
      body: { reason: "Nope" },
      headers: new Headers(),
    });

    const { result, rerender } = renderHook(
      ({ appMetadata }) =>
        useDraftMetadataAutosave({
          slug: "demo",
          appMetadata,
          keycloak,
        }),
      { initialProps: { appMetadata: metadata("Demo") } }
    );

    rerender({ appMetadata: metadata("Updated") });

    let saved = true;
    await act(async () => {
      saved = await result.current.saveNow();
    });

    expect(saved).toBe(false);
    expect(result.current.saveError).toBe("Could not save draft.");
    consoleErrorSpy.mockRestore();
  });
});
