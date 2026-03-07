import { useCallback } from "react";
import {
  publicTsRestClient as defaultTsRestClient,
} from "@api/tsRestClient.ts";
import type { AppFetcher } from "@sharedComponents/AppGridWithFilterAndPagination.tsx";

export const useProjectSummariesFetcher = (
  tsRestClient: typeof defaultTsRestClient = defaultTsRestClient
): AppFetcher => {
  return useCallback(
    async (filters) => {
      const result = await tsRestClient?.getProjectSummaries({
        query: {
          category: filters.category,
          badge: filters.badge,
        },
      });
      switch (result.status) {
        case 200:
          return result.body;
        default: {
          const reason = (result.body as { reason: string })?.reason;
          const err = new Error(`Failed to fetch projects, reason ${reason}`);
          (err as Error & { httpStatus: number }).httpStatus = result.status;
          throw err;
        }
      }
    },
    [tsRestClient]
  );
};
