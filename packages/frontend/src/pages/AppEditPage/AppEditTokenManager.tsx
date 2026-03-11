import React, { useState, useEffect, useCallback } from "react";
import Keycloak from "keycloak-js";
import { getFreshAuthorizedTsRestClient } from "@api/tsRestClient.ts";
import { ProjectApiTokenMetadata } from "@shared/domain/readModels/project/ProjectApiToken";
import { assertDefined } from "@shared/util/assertions";

import { DeleteIcon } from "@sharedComponents/icons/DeleteIcon.tsx";
import { EyeIcon } from "@sharedComponents/icons/EyeIcon.tsx";
import { ClipboardCopyIcon } from "@sharedComponents/icons/ClipboardCopyIcon.tsx";
import { EyeOffIcon } from "@sharedComponents/icons/EyeOffIcon.tsx";

interface AppEditTokenManagerProps {
  slug: string;
  keycloak: Keycloak;
}

/**
 * A component to manage API tokens for a project on the edit page.
 * It allows viewing token status, generating new tokens, and revoking existing ones.
 */
const AppEditTokenManager: React.FC<AppEditTokenManagerProps> = ({
  slug,
  keycloak,
}) => {
  const [tokenMetadata, setTokenMetadata] =
    useState<ProjectApiTokenMetadata | null>(null);
  const [newToken, setNewToken] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showToken, setShowToken] = useState(true);
  const [isOperating, setIsOperating] = useState(false);
  const [copied, setCopied] = useState(false);

  const fetchTokenMetadata = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const client = await getFreshAuthorizedTsRestClient(keycloak);
      const response = await client.getProjectApiTokenMetadata({
        params: { slug },
      });
      if (response.status === 200) {
        setTokenMetadata(response.body);
      } else if (response.status === 404) {
        setTokenMetadata(null);
      } else {
        setError("Failed to fetch token information.");
        console.error(response);
      }
    } catch (e) {
      setError("An error occurred while fetching token information.");
      console.error(e);
    } finally {
      setLoading(false);
    }
  }, [slug, keycloak]);

  useEffect(() => {
    fetchTokenMetadata();
  }, [fetchTokenMetadata]);

  const handleGenerateToken = async () => {
    assertDefined(keycloak);
    setIsOperating(true);
    setError(null);
    setNewToken(null);
    try {
      const client = await getFreshAuthorizedTsRestClient(keycloak);
      const response = await client.createProjectAPIToken({
        params: { slug },
        body: undefined,
      });
      if (response.status === 200) {
        setNewToken(response.body.token);
        setShowToken(true);
        await fetchTokenMetadata(); // Refresh metadata
      } else {
        setError("Failed to generate token.");
        console.error(response);
      }
    } catch (e) {
      setError("An error occurred while generating the token.");
      console.error(e);
    } finally {
      setIsOperating(false);
    }
  };

  const handleRevokeToken = async () => {
    if (
      !window.confirm(
        "Are you sure you want to revoke the API token? This action cannot be undone."
      )
    ) {
      return;
    }
    assertDefined(keycloak);
    setIsOperating(true);
    setError(null);
    try {
      const client = await getFreshAuthorizedTsRestClient(keycloak);
      const response = await client.revokeProjectAPIToken({ params: { slug } });
      if (response.status === 204) {
        setTokenMetadata(null);
        setNewToken(null);
      } else {
        setError("Failed to revoke token.");
        console.error(response);
      }
    } catch (e) {
      setError("An error occurred while revoking the token.");
      console.error(e);
    } finally {
      setIsOperating(false);
    }
  };

  const handleCopyToClipboard = () => {
    if (newToken) {
      navigator.clipboard.writeText(newToken);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  if (loading) {
    return (
      <section className="bg-gray-800 p-6 rounded-lg shadow-lg">
        <h2 className="text-2xl font-semibold text-slate-100 mb-4">
          API Token
        </h2>
        <p className="text-slate-400">Loading token information...</p>
      </section>
    );
  }

  return (
    <section className="bg-gray-800 p-6 rounded-lg shadow-lg">
      <h2 className="text-2xl font-semibold text-slate-100 mb-4">API Token</h2>
      <div className="space-y-4">
        {error && <p className="text-red-400">{error}</p>}

        {newToken && (
          <div className="bg-gray-900 p-4 rounded-lg">
            <h3 className="text-lg font-semibold text-emerald-400">
              New Token Generated
            </h3>
            <p className="text-slate-400 text-sm mb-2">
              Please copy this token. You will not be able to see it again.
            </p>
            <div className="flex items-center space-x-2 bg-gray-700 p-2 rounded-md">
              <input
                type={showToken ? "text" : "password"}
                readOnly
                value={newToken}
                className="flex-grow bg-transparent border-none text-slate-200 font-mono focus:ring-0"
              />
              <button
                onClick={() => setShowToken(!showToken)}
                className="text-slate-400 hover:text-white"
                title={showToken ? "Hide token" : "Show token"}
              >
                {showToken ? <EyeOffIcon /> : <EyeIcon />}
              </button>
              <button
                onClick={handleCopyToClipboard}
                className="text-slate-400 hover:text-white relative"
                title="Copy to clipboard"
              >
                <ClipboardCopyIcon />
                {copied && (
                  <span className="absolute -top-7 right-0 bg-emerald-600 text-white text-xs rounded px-2 py-1">
                    Copied!
                  </span>
                )}
              </button>
            </div>
          </div>
        )}

        {tokenMetadata ? (
          <div className={newToken ? "mt-4" : ""}>
            <p className="text-slate-300">
              An API token exists for this project.
            </p>
            <p className="text-sm text-slate-500">
              Created: {new Date(tokenMetadata.created_at).toLocaleString()}
            </p>
            {tokenMetadata.last_used_at && (
              <p className="text-sm text-slate-500">
                Last used:{" "}
                {new Date(tokenMetadata.last_used_at).toLocaleString()}
              </p>
            )}
            <div className="mt-4 flex gap-4 items-center">
              <button
                onClick={handleRevokeToken}
                disabled={isOperating}
                className="bg-red-600 text-white rounded px-4 py-2 flex items-center gap-2 hover:bg-red-700 disabled:opacity-50"
              >
                <DeleteIcon />
                Revoke Token
              </button>
              <button
                onClick={handleGenerateToken}
                disabled={isOperating}
                className="bg-blue-600 text-white rounded px-4 py-2 hover:bg-blue-700 disabled:opacity-50"
              >
                Regenerate Token
              </button>
            </div>
          </div>
        ) : (
          <div>
            <p className="text-slate-300">No active API token.</p>
            <button
              onClick={handleGenerateToken}
              disabled={isOperating}
              className="mt-4 bg-emerald-600 text-white rounded px-4 py-2 hover:bg-emerald-700 disabled:opacity-50"
            >
              Generate New Token
            </button>
          </div>
        )}
      </div>
    </section>
  );
};

export default AppEditTokenManager;
