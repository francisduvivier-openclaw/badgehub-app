import React from "react";

/**
 * Renders the GitLab icon as an SVG element.
 */
export const GitLabIcon: React.FC<{ className?: string }> = ({
  className = "h-5 w-5",
}) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 24 24"
    fill="currentColor"
    aria-hidden="true"
    className={className}
  >
    <path d="M23.955 13.587l-1.34-4.145-2.736-8.455a.43.43 0 00-.814 0L16.33 9.44H7.67L4.935.987a.43.43 0 00-.814 0L1.385 9.44H1.38l-1.34 4.145a.961.961 0 00.343 1.144l11.04 8.01a.961.961 0 001.144 0l11.04-8.01a.961.961 0 00.343-1.144z" />
  </svg>
);
