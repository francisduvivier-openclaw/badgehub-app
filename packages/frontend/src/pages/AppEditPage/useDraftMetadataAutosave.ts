import { getFreshAuthorizedApiClient } from "@api/apiClient.ts";
import type { AppMetadataJSON } from "@shared/domain/readModels/project/AppMetadataJSON.ts";
import type Keycloak from "keycloak-js";
import { useCallback, useEffect, useRef, useState } from "react";
import { AUTOSAVE_DEBOUNCE_MS } from "./editPageFeedback.ts";

function serializeMetadata(metadata: AppMetadataJSON): string {
  return JSON.stringify(metadata);
}

export function useDraftMetadataAutosave({
  slug,
  appMetadata,
  keycloak,
}: {
  slug: string;
  appMetadata: AppMetadataJSON | undefined;
  keycloak: Keycloak | undefined;
}) {
  const [isSaving, setIsSaving] = useState(false);
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);
  const [saveError, setSaveError] = useState<string | null>(null);
  const lastSavedSerializedRef = useRef<string | null>(null);
  const latestMetadataRef = useRef(appMetadata);
  const debounceTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const saveQueueRef = useRef(Promise.resolve(true));
  const successfulSaveCountRef = useRef(0);
  const keycloakRef = useRef(keycloak);
  const slugRef = useRef(slug);

  latestMetadataRef.current = appMetadata;
  keycloakRef.current = keycloak;

  if (slugRef.current !== slug) {
    slugRef.current = slug;
    lastSavedSerializedRef.current = appMetadata
      ? serializeMetadata(appMetadata)
      : null;
  } else if (appMetadata && lastSavedSerializedRef.current === null) {
    lastSavedSerializedRef.current = serializeMetadata(appMetadata);
  }

  const clearDebounce = useCallback(() => {
    if (debounceTimerRef.current !== null) {
      clearTimeout(debounceTimerRef.current);
      debounceTimerRef.current = null;
    }
  }, []);

  const persistIfDirty = useCallback(
    async (force = false): Promise<boolean> => {
      const metadata = latestMetadataRef.current;
      const currentKeycloak = keycloakRef.current;
      if (!metadata || !currentKeycloak) {
        return true;
      }

      const serialized = serializeMetadata(metadata);
      if (!force && serialized === lastSavedSerializedRef.current) {
        return true;
      }

      setSaveError(null);
      setIsSaving(true);
      try {
        const result = await (
          await getFreshAuthorizedApiClient(currentKeycloak)
        ).changeDraftAppMetadata({
          params: { slug: slugRef.current },
          body: metadata,
        });
        if (result.status !== 204) {
          console.error("changeDraftAppMetadata failed", result);
          setSaveError("Could not save draft.");
          return false;
        }
        lastSavedSerializedRef.current = serialized;
        successfulSaveCountRef.current += 1;
        setSaveError(null);
        const latestMetadata = latestMetadataRef.current;
        const latestSerialized = latestMetadata
          ? serializeMetadata(latestMetadata)
          : null;
        setHasUnsavedChanges(latestSerialized !== serialized);
        return true;
      } catch (error) {
        console.error(error);
        setSaveError("Could not save draft.");
        return false;
      } finally {
        setIsSaving(false);
      }
    },
    []
  );

  const saveNow = useCallback(
    async (options?: { force?: boolean }): Promise<boolean> => {
      clearDebounce();
      const successfulSaveCount = successfulSaveCountRef.current;
      const persist = () =>
        persistIfDirty(
          Boolean(options?.force) &&
            successfulSaveCountRef.current === successfulSaveCount
        );
      const result = saveQueueRef.current.then(persist, persist);
      saveQueueRef.current = result.then(
        () => true,
        () => true
      );
      return result;
    },
    [clearDebounce, persistIfDirty]
  );

  useEffect(() => {
    if (!appMetadata) {
      return;
    }
    const isDirty =
      serializeMetadata(appMetadata) !== lastSavedSerializedRef.current;
    setHasUnsavedChanges(isDirty);
    if (!isDirty) {
      clearDebounce();
      return;
    }

    clearDebounce();
    debounceTimerRef.current = setTimeout(() => {
      debounceTimerRef.current = null;
      void saveNow();
    }, AUTOSAVE_DEBOUNCE_MS);

    return clearDebounce;
  }, [appMetadata, clearDebounce, saveNow]);

  return { saveNow, isSaving, hasUnsavedChanges, saveError };
}
