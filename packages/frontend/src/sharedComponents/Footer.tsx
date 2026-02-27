import React from "react";

const Footer: React.FC = () => {
  const year = new Date().getFullYear();
  return (
    <footer className="bh-surface border-t-2 bh-border-soft mt-16 shadow-[0_-1px_0_rgba(148,163,184,0.22)]">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8 text-center bh-text-muted">
        <div className="mb-4">
          <a
            href="https://github.com/BadgeHubCrew/badgehub-app/blob/main/README.md"
            target="_blank"
            className="px-3 bh-link text-sm"
          >
            About
          </a>
          <a
            href="https://github.com/badgehubcrew/badgehub-app/issues"
            target="_blank"
            className="px-3 bh-link text-sm"
          >
            Contact
          </a>
          <a
            href="https://github.com/badgehubcrew"
            target="_blank"
            rel="noopener noreferrer"
            className="px-3 bh-link text-sm"
          >
            GitHub
          </a>
        </div>
        <p className="text-sm font-mono">
          &copy; {year} BadgeHub. All rights reserved.
        </p>
        <p className="text-xs bh-text-muted mt-2">
          Designed for makers, by makers.
        </p>
      </div>
    </footer>
  );
};

export default Footer;
