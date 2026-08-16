import { getFreshAuthorizedApiClient } from "@api/apiClient.ts";
import type { AppMetadataJSON } from "@shared/domain/readModels/project/AppMetadataJSON.ts";
import type Keycloak from "keycloak-js";
import { useCallback, useEffect, useRef, useState } from "react";
import {
  AUTOSAVE_DEBOUNCE_MS,
  AUTOSAVE_SUCCESS_MESSAGE_MS,
} from "./editPageFeedback.ts";

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
  const [draftSaved, setDraftSaved] = useState(false);
  const [saveError, setSaveError] = useState<string | null>(null);
  const lastSavedSerializedRef = useRef<string | null>(null);
  const latestMetadataRef = useRef(appMetadata);
  const debounceTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const savedFeedbackTimerRef = useRef<ReturnType<typeof setTimeout> | null>(
    null
  );
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

  const cancelSavedFeedbackTimer = useCallback(() => {
    if (savedFeedbackTimerRef.current !== null) {
      clearTimeout(savedFeedbackTimerRef.current);
      savedFeedbackTimerRef.current = null;
    }
  }, []);

  const clearSavedFeedback = useCallback(() => {
    cancelSavedFeedbackTimer();
    setDraftSaved(false);
  }, [cancelSavedFeedbackTimer]);

  const showSavedFeedback = useCallback(() => {
    cancelSavedFeedbackTimer();
    setDraftSaved(true);
    savedFeedbackTimerRef.current = setTimeout(() => {
      savedFeedbackTimerRef.current = null;
      setDraftSaved(false);
    }, AUTOSAVE_SUCCESS_MESSAGE_MS);
  }, [cancelSavedFeedbackTimer]);

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

      clearSavedFeedback();
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
        if (!force && latestSerialized === serialized) {
          showSavedFeedback();
        }
        return true;
      } catch (error) {
        console.error(error);
        setSaveError("Could not save draft.");
        return false;
      } finally {
        setIsSaving(false);
      }
    },
    [clearSavedFeedback, showSavedFeedback]
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
      if (!options?.force) {
        return result;
      }
      return result.then((saved) => {
        clearSavedFeedback();
        return saved;
      });
    },
    [clearDebounce, clearSavedFeedback, persistIfDirty]
  );

  useEffect(() => {
    if (!appMetadata) {
      return;
    }
    if (serializeMetadata(appMetadata) === lastSavedSerializedRef.current) {
      return;
    }

    clearSavedFeedback();
    clearDebounce();
    debounceTimerRef.current = setTimeout(() => {
      debounceTimerRef.current = null;
      void saveNow();
    }, AUTOSAVE_DEBOUNCE_MS);

    return clearDebounce;
  }, [appMetadata, clearDebounce, clearSavedFeedback, saveNow]);

  useEffect(() => cancelSavedFeedbackTimer, [cancelSavedFeedbackTimer]);

  return { saveNow, isSaving, draftSaved, saveError };
}
