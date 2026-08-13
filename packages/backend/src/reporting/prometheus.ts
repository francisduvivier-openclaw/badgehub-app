import type { BadgeHubStats } from "@shared/domain/readModels/BadgeHubStats";

export { PROMETHEUS_CONTENT_TYPE } from "@shared/contracts/publicRestContracts";

type PrometheusMetricType = "gauge" | "counter";

type StatMetric = {
  help: string;
  type: PrometheusMetricType;
};

/**
 * One Prometheus series per BadgeHubStats field. Event totals are counters;
 * current counts are gauges. Names stay aligned with the JSON /stats keys.
 */
const STAT_METRICS: { [K in keyof BadgeHubStats]: StatMetric } = {
  projects: { help: "Number of projects", type: "gauge" },
  installs: { help: "Total install reports", type: "counter" },
  crashes: { help: "Total crash reports", type: "counter" },
  launches: { help: "Total launch reports", type: "counter" },
  installed_projects: {
    help: "Number of projects with at least one install",
    type: "gauge",
  },
  launched_projects: {
    help: "Number of projects with at least one launch",
    type: "gauge",
  },
  crashed_projects: {
    help: "Number of projects with at least one crash",
    type: "gauge",
  },
  authors: { help: "Number of project authors", type: "gauge" },
  badges: { help: "Number of registered badges", type: "gauge" },
};

const STAT_METRIC_KEYS = Object.keys(STAT_METRICS) as (keyof BadgeHubStats)[];

export function formatBadgeHubStatsAsPrometheus(stats: BadgeHubStats): string {
  const blocks = STAT_METRIC_KEYS.map((key) => {
    const { help, type } = STAT_METRICS[key];
    const name = `badgehub_${key}`;
    return `# HELP ${name} ${help}\n# TYPE ${name} ${type}\n${name} ${stats[key]}`;
  });
  return `${blocks.join("\n\n")}\n`;
}
