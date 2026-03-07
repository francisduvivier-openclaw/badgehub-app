import { EXPRESS_PORT, IS_DEV_ENVIRONMENT } from "@config";
import { runMigrations } from "@db/migrations";
import { createHonoApp } from "@createHonoApp";
import { startMqtt } from "@reporting/mqtt";
import { startRefreshReportsInterval } from "@reporting/refreshReports";
import { createBadgeHubData } from "@domain/createBadgeHubData";
import { serve } from "@hono/node-server";

async function startServer() {
  const badgeHubData = createBadgeHubData();
  const app = createHonoApp(badgeHubData);

  await runMigrations();

  serve({ fetch: app.fetch, port: EXPRESS_PORT }, () => {
    console.info(
      `Node.js server started with settings port [${EXPRESS_PORT}], IS_DEV_ENV [${IS_DEV_ENVIRONMENT}].\nApp available at http://localhost:${EXPRESS_PORT}/`,
    );
    startMqtt(badgeHubData);
    startRefreshReportsInterval(badgeHubData);
  });
}

// noinspection JSIgnoredPromiseFromCall
startServer();
