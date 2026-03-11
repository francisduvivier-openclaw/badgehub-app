import React from "react";
import { GitHubIcon } from "./icons/GitHubIcon.tsx";
import { GitLabIcon } from "./icons/GitLabIcon.tsx";

interface GitLinkProps {
  url?: string;
}

function urlHasHost(url: string, GITHUB_HOSTNAME: string) {
  try {
    return new URL(url).hostname === GITHUB_HOSTNAME;
  } catch {
    return false;
  }
}

/**
 * Renders a GitHub or GitLab icon linking to the provided source code URL.
 * It returns null if the URL is not provided or not from a supported provider.
 */
const GitLink: React.FC<GitLinkProps> = ({ url }) => {
  if (!url) {
    return null;
  }

  const GITHUB_HOSTNAME = "github.com";
  const GitIcon = urlHasHost(url, GITHUB_HOSTNAME)
    ? GitHubIcon
    : urlHasHost(url, "gitlab.com")
      ? GitLabIcon
      : null;

  if (!GitIcon) {
    return null; // Only render for supported Git providers
  }

  return (
    <a
      href={url}
      target="_blank"
      rel="noopener noreferrer"
      className="text-slate-400 hover:text-white transition-colors ml-2 flex-shrink-0"
      aria-label="Source code repository"
      title="Source Code Repository"
    >
      <GitIcon className="h-5 w-5" />
    </a>
  );
};

export default GitLink;
