import { useEffect, useMemo, useState } from "react";
import type { AppCardProps } from "@sharedComponents/types.ts";
import Filters, { SortOption } from "@sharedComponents/AppsGrid/Filters.tsx";
import Spinner from "@sharedComponents/Spinner.tsx";
import AppsGrid from "@sharedComponents/AppsGrid/AppsGrid.tsx";
import Pagination from "@sharedComponents/AppsGrid/Pagination.tsx";
import { z } from "zod/v3";
import { getProjectsQuerySchema } from "@shared/contracts/publicRestContracts.ts";
import { BadgeSlug } from "@shared/domain/readModels/Badge.ts";
import { CategoryName } from "@shared/domain/readModels/project/Category.ts";
import { ProjectSummary } from "@shared/domain/readModels/project/ProjectSummaries.ts";

export type ProjectQueryParams = z.infer<typeof getProjectsQuerySchema>;
export type AppFetcher = (
  filters: ProjectQueryParams
) => Promise<ProjectSummary[] | undefined>;

export const AppGridWithFilterAndPagination = ({
  appFetcher,
  searchQuery,
  editable = false,
}: {
  appFetcher: AppFetcher;
  searchQuery: string;
  editable?: boolean;
}) => {
  const [apps, setApps] = useState<AppCardProps[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Filter state
  const [badge, setBadgeFilter] = useState<BadgeSlug | undefined>();
  const [category, setCategoryFilter] = useState<CategoryName | undefined>();
  const [sortBy, setSortBy] = useState<SortOption>();
  // Pagination state
  const [currentPage, setCurrentPage] = useState<number>(1);
  const pageSize = 12;

  // Fetch apps with filters, retrying while the preview service worker is
  // still initialising (HTTP 503 from api-sw.js loading preview-data.json).
  useEffect(() => {
    setLoading(true);
    setError(null);
    setCurrentPage(1);
    let cancelled = false;
    let retryTimer: ReturnType<typeof setTimeout> | undefined;

    const attempt = () => {
      appFetcher({ badge, category })
        .then((res) => {
          if (cancelled) return;
          if (Array.isArray(res)) {
            setApps(res);
            setError(null);
            setLoading(false);
          } else {
            setError("Failed to fetch projects, invalid response type.");
            setLoading(false);
          }
        })
        .catch((e: Error & { httpStatus?: number }) => {
          if (cancelled) return;
          if (e.httpStatus === 503) {
            // Preview SW is still loading preview-data.json — keep the spinner
            // and retry automatically once it's ready.
            retryTimer = setTimeout(attempt, 800);
          } else {
            console.error(e);
            setError(e.message || "Failed to fetch projects");
            setLoading(false);
          }
        });
    };

    attempt();
    return () => {
      cancelled = true;
      clearTimeout(retryTimer);
    };
  }, [badge, category, appFetcher]);

  // Filter apps by search query before pagination
  const filteredSortedApps = useMemo(() => {
    let result = apps;
    if (sortBy === "mostInstalled") {
      result = [...apps].sort((a, b) => b.installs - a.installs);
    }
    if (!searchQuery.trim()) return result;
    const filteredApps = result.filter((app) =>
      app.name?.toLowerCase().includes(searchQuery.trim().toLowerCase())
    );

    return filteredApps;
  }, [apps, searchQuery, sortBy]);

  // Compute paginated apps from filteredApps
  const paginatedApps = useMemo(() => {
    const start = (currentPage - 1) * pageSize;
    return filteredSortedApps.slice(start, start + pageSize);
  }, [filteredSortedApps, currentPage]);

  // Handlers for Filters component
  const handleBadgeChange = (value: BadgeSlug | undefined) =>
    setBadgeFilter(value);
  const handleCategoryChange = (value: CategoryName | undefined) =>
    setCategoryFilter(value);
  const handleResetFilters = () => {
    setBadgeFilter(undefined);
    setCategoryFilter(undefined);
  };

  return (
    <>
      {!editable && (
        <Filters
          badge={badge}
          category={category}
          sortBy={sortBy}
          onBadgeChange={handleBadgeChange}
          onCategoryChange={handleCategoryChange}
          onSortByChange={setSortBy}
          onResetFilters={handleResetFilters}
        />
      )}
      {loading ? (
        <Spinner />
      ) : error ? (
        <div
          data-testid="error-message"
          className="text-center py-10 text-red-400"
        >
          {error}
        </div>
      ) : (
        <AppsGrid apps={paginatedApps} editable={editable} />
      )}
      {/* show pagination if more than one page */}
      {filteredSortedApps.length > pageSize && (
        <Pagination
          currentPage={currentPage}
          totalPages={Math.ceil(filteredSortedApps.length / pageSize)}
          onPageChange={setCurrentPage}
        />
      )}
    </>
  );
};
