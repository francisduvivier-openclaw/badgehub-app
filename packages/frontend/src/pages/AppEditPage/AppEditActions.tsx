import type React from "react";
import { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";

interface AppEditActionsProps {
  onClickDeleteApplication: () => unknown;
  workInProgress: boolean;
  onWorkInProgressChange: (workInProgress: boolean) => void;
}

const AppEditActions: React.FC<AppEditActionsProps> = ({
  onClickDeleteApplication,
  workInProgress,
  onWorkInProgressChange,
}) => {
  const [showDeleteConfirmation, setShowDeleteConfirmation] = useState(false);
  const cancelDeleteButtonRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    if (showDeleteConfirmation) {
      cancelDeleteButtonRef.current?.focus();
    }
  }, [showDeleteConfirmation]);

  const confirmDelete = () => {
    setShowDeleteConfirmation(false);
    void onClickDeleteApplication();
  };

  return (
    <section className="card bg-base-200 shadow-lg">
      <div className="card-body">
        <h2 className="card-title text-2xl mb-4">Actions</h2>
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
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
          <div>
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
          Deleting an application is permanent and cannot be undone.
        </p>
      </div>

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
