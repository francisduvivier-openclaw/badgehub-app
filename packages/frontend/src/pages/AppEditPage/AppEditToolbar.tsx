import type React from "react";

type SaveState = "failed" | "saved" | "saving" | "unsaved";

const saveStateDetails = (state: SaveState) => {
  switch (state) {
    case "failed":
      return {
        className: "border-error/40 bg-error/15 text-error",
        label: "Save failed",
      };
    case "saving":
      return {
        className: "border-info/40 bg-info/15 text-info",
        label: "Saving draft…",
      };
    case "unsaved":
      return {
        className: "border-warning/50 bg-warning/20 text-warning-content",
        label: "Unsaved changes",
      };
    case "saved":
      return {
        className: "border-success/40 bg-success/15 text-success",
        label: "Draft saved",
      };
  }
};

const SavedIcon = () => (
  <svg
    className="h-4 w-4 shrink-0"
    viewBox="0 0 20 20"
    fill="currentColor"
    aria-hidden="true"
  >
    <path
      fillRule="evenodd"
      d="M16.704 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.296-7.293a1 1 0 011.408 0z"
      clipRule="evenodd"
    />
  </svg>
);

const ErrorIcon = () => (
  <svg
    className="h-4 w-4 shrink-0"
    viewBox="0 0 20 20"
    fill="currentColor"
    aria-hidden="true"
  >
    <path
      fillRule="evenodd"
      d="M8.257 3.099c.765-1.36 2.72-1.36 3.486 0l6.518 11.59A2 2 0 0116.518 17H3.482a2 2 0 01-1.743-2.311l6.518-11.59zM11 13a1 1 0 10-2 0 1 1 0 002 0zm-1-7a1 1 0 00-1 1v3a1 1 0 102 0V7a1 1 0 00-1-1z"
      clipRule="evenodd"
    />
  </svg>
);

const AppEditToolbar: React.FC<{
  slug: string;
  revision: number;
  isSaving: boolean;
  hasUnsavedChanges: boolean;
  saveError: string | null;
  onSaveDraft: () => void;
  onRetrySave: () => void;
  isPublishing: boolean;
  publishedMessage: string | null;
}> = ({
  slug,
  revision,
  isSaving,
  hasUnsavedChanges,
  saveError,
  onSaveDraft,
  onRetrySave,
  isPublishing,
  publishedMessage,
}) => {
  const state: SaveState = saveError
    ? "failed"
    : isSaving
      ? "saving"
      : hasUnsavedChanges
        ? "unsaved"
        : "saved";
  const details = saveStateDetails(state);
  const showPublishedMessage = Boolean(publishedMessage);

  return (
    <div
      className="sticky top-16 z-40 mb-4 grid grid-cols-[minmax(0,1fr)_auto] items-center gap-3 rounded-box border border-base-300 bg-base-100/95 px-3 py-2 shadow-md backdrop-blur"
      data-testid="app-edit-toolbar"
    >
      <h1 className="min-w-0 truncate text-lg font-bold sm:text-xl">
        Editing {slug}/rev{revision}
      </h1>
      <div className="flex min-w-0 items-center justify-end gap-2">
        <div
          className={`flex min-h-8 min-w-0 items-center gap-2 rounded-full border px-3 py-1 text-xs font-semibold sm:text-sm ${
            showPublishedMessage
              ? "border-success/40 bg-success/15 text-success"
              : details.className
          }`}
          data-testid="autosave-feedback"
          data-save-state={showPublishedMessage ? "published" : state}
          role={state === "failed" ? "alert" : "status"}
          aria-live={state === "failed" ? "assertive" : "polite"}
          aria-atomic="true"
        >
          {showPublishedMessage ? (
            <>
              <SavedIcon />
              <span className="truncate" data-testid="publish-success-message">
                {publishedMessage}
              </span>
            </>
          ) : (
            <>
              {state === "saving" && (
                <span className="loading loading-spinner loading-xs" />
              )}
              {state === "unsaved" && (
                <span
                  className="h-2.5 w-2.5 shrink-0 rounded-full bg-warning ring-2 ring-warning/20"
                  aria-hidden="true"
                />
              )}
              {state === "saved" && <SavedIcon />}
              {state === "failed" && <ErrorIcon />}
              <span>{state === "failed" ? saveError : details.label}</span>
              {state === "failed" && (
                <button
                  type="button"
                  className="btn btn-error btn-xs ml-1"
                  onClick={onRetrySave}
                >
                  Retry
                </button>
              )}
            </>
          )}
        </div>
        {state === "unsaved" && !showPublishedMessage && (
          <button
            type="button"
            className="btn btn-outline btn-warning btn-sm"
            onClick={onSaveDraft}
          >
            Save draft
          </button>
        )}
        <button
          type="submit"
          form="app-edit-form"
          className="btn btn-primary btn-sm"
          disabled={isPublishing}
          aria-busy={isPublishing}
        >
          {isPublishing && (
            <span
              className="loading loading-spinner loading-sm"
              data-testid="publish-spinner"
            />
          )}
          Publish
        </button>
      </div>
    </div>
  );
};

export default AppEditToolbar;
