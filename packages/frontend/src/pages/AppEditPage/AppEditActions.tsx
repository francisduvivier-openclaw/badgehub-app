import type React from "react";
import { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";

interface AppEditActionsProps {
  onClickDeleteApplication: () => unknown;
  onTransferOwner: (newOwnerId: string) => Promise<boolean> | boolean;
  projectOwnerId: string;
  workInProgress: boolean;
  onWorkInProgressChange: (workInProgress: boolean) => void;
}

const AppEditActions: React.FC<AppEditActionsProps> = ({
  onClickDeleteApplication,
  onTransferOwner,
  projectOwnerId,
  workInProgress,
  onWorkInProgressChange,
}) => {
  const [showDeleteConfirmation, setShowDeleteConfirmation] = useState(false);
  const [showTransferConfirmation, setShowTransferConfirmation] =
    useState(false);
  const [newOwnerId, setNewOwnerId] = useState("");
  const [transferError, setTransferError] = useState<string | null>(null);
  const [isTransferring, setIsTransferring] = useState(false);
  const cancelDeleteButtonRef = useRef<HTMLButtonElement>(null);
  const cancelTransferButtonRef = useRef<HTMLButtonElement>(null);
  const trimmedNewOwnerId = newOwnerId.trim();

  useEffect(() => {
    if (showDeleteConfirmation) {
      cancelDeleteButtonRef.current?.focus();
    }
  }, [showDeleteConfirmation]);

  useEffect(() => {
    if (showTransferConfirmation) {
      cancelTransferButtonRef.current?.focus();
    }
  }, [showTransferConfirmation]);

  const confirmDelete = () => {
    setShowDeleteConfirmation(false);
    void onClickDeleteApplication();
  };

  const openTransferConfirmation = () => {
    setTransferError(null);
    if (!trimmedNewOwnerId) {
      setTransferError("Enter the new owner's user ID.");
      return;
    }
    if (trimmedNewOwnerId === projectOwnerId) {
      setTransferError("This user already owns the project.");
      return;
    }
    setShowTransferConfirmation(true);
  };

  const confirmTransfer = async () => {
    setIsTransferring(true);
    setTransferError(null);
    try {
      const transferred = await onTransferOwner(trimmedNewOwnerId);
      if (transferred) {
        setShowTransferConfirmation(false);
        setNewOwnerId("");
      }
    } finally {
      setIsTransferring(false);
    }
  };

  return (
    <section className="card bg-base-200 shadow-lg">
      <div className="card-body">
        <h2 className="card-title text-2xl mb-4">Actions</h2>
        <div className="flex flex-col sm:flex-row items-start justify-between gap-6">
          <div className="flex flex-col items-start gap-4">
            <label className="label cursor-pointer justify-start gap-3 p-0">
              <input
                type="checkbox"
                className="toggle toggle-warning"
                checked={workInProgress}
                onChange={(e) => onWorkInProgressChange(e.target.checked)}
              />
              <span className="label-text font-medium">Work in progress</span>
            </label>
            <Link to=".." className="btn btn-neutral">
              Cancel
            </Link>
          </div>
          <div className="flex w-full max-w-xl flex-col gap-3 sm:w-auto">
            <div>
              <h3 className="font-semibold">Transfer ownership</h3>
              <p className="text-sm opacity-70">
                Current owner:{" "}
                <span className="font-mono">{projectOwnerId}</span>
              </p>
            </div>
            <div className="flex flex-col gap-2 sm:flex-row">
              <label className="input input-bordered flex min-w-0 flex-1 items-center gap-2">
                <span className="shrink-0 text-sm opacity-70">New owner</span>
                <input
                  type="text"
                  className="min-w-0 grow"
                  value={newOwnerId}
                  onChange={(event) => {
                    setNewOwnerId(event.target.value);
                    setTransferError(null);
                  }}
                  onKeyDown={(event) => {
                    if (event.key === "Enter") {
                      event.preventDefault();
                      openTransferConfirmation();
                    }
                  }}
                />
              </label>
              <button
                type="button"
                className="btn btn-warning"
                onClick={openTransferConfirmation}
                disabled={!trimmedNewOwnerId}
              >
                Transfer
              </button>
            </div>
            {transferError && (
              <p className="text-sm text-error" role="alert">
                {transferError}
              </p>
            )}
            <button
              type="button"
              className="btn btn-error flex items-center"
              onClick={() => setShowDeleteConfirmation(true)}
            >
              <svg
                className="icon h-5 w-5 mr-2"
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 20 20"
                fill="currentColor"
                aria-hidden="true"
              >
                <path
                  fillRule="evenodd"
                  d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z"
                  clipRule="evenodd"
                />
              </svg>
              Delete Application
            </button>
          </div>
        </div>
        <p className="text-xs opacity-60 mt-4 text-right">
          Transferring or deleting an application is permanent and cannot be
          undone.
        </p>
      </div>

      {showTransferConfirmation && (
        <dialog
          open
          className="modal"
          aria-labelledby="transfer-ownership-title"
          onCancel={(event) => {
            event.preventDefault();
            setShowTransferConfirmation(false);
          }}
        >
          <div className="modal-box">
            <h3
              id="transfer-ownership-title"
              className="text-lg font-bold text-warning"
            >
              Transfer this project?
            </h3>
            <p className="py-4">
              Ownership will move from{" "}
              <span className="font-mono">{projectOwnerId}</span> to{" "}
              <span className="font-mono">{trimmedNewOwnerId}</span>.
            </p>
            <div className="modal-action">
              <button
                type="button"
                className="btn"
                onClick={() => setShowTransferConfirmation(false)}
                ref={cancelTransferButtonRef}
                disabled={isTransferring}
              >
                Keep owner
              </button>
              <button
                type="button"
                className="btn btn-warning"
                onClick={confirmTransfer}
                disabled={isTransferring}
                aria-busy={isTransferring}
              >
                {isTransferring && (
                  <span className="loading loading-spinner loading-sm" />
                )}
                Transfer project
              </button>
            </div>
          </div>
          <button
            type="button"
            className="modal-backdrop"
            aria-label="Close transfer confirmation"
            onClick={() => setShowTransferConfirmation(false)}
          />
        </dialog>
      )}

      {showDeleteConfirmation && (
        <dialog
          open
          className="modal"
          aria-labelledby="delete-application-title"
          onCancel={(event) => {
            event.preventDefault();
            setShowDeleteConfirmation(false);
          }}
        >
          <div className="modal-box">
            <h3
              id="delete-application-title"
              className="text-lg font-bold text-error"
            >
              Delete this application?
            </h3>
            <p className="py-4">
              This permanently deletes the application and all its revisions.
              This action cannot be undone.
            </p>
            <div className="modal-action">
              <button
                type="button"
                className="btn"
                onClick={() => setShowDeleteConfirmation(false)}
                ref={cancelDeleteButtonRef}
              >
                Keep application
              </button>
              <button
                type="button"
                className="btn btn-error"
                onClick={confirmDelete}
              >
                Delete application
              </button>
            </div>
          </div>
          <button
            type="button"
            className="modal-backdrop"
            aria-label="Close delete confirmation"
            onClick={() => setShowDeleteConfirmation(false)}
          />
        </dialog>
      )}
    </section>
  );
};

export default AppEditActions;
