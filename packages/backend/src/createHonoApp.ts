import { Hono } from "hono";
import { cors } from "hono/cors";
import { logger } from "hono/logger";
import { swaggerUI } from "@hono/swagger-ui";
import { createPublicApiRouter } from "@shared/api/honoRouter";
import { FRONTEND_DIST_DIR, FRONTEND_PUBLIC_DIR, IS_DEV_ENVIRONMENT } from "@config";
import { registerPrivateRoutes } from "@controllers/privateRoutes";
import { createBadgeHubData } from "@domain/createBadgeHubData";
import { createSwaggerDoc } from "@createSwaggerDoc";
import { getSharedConfig } from "@shared/config/sharedConfig";
import { BadgeHubData } from "@domain/BadgeHubData";
import { createReadStream } from "node:fs";
import { stat } from "node:fs/promises";
import { Readable } from "node:stream";
import * as path from "node:path";
import * as fs from "node:fs";
import mime from "mime-types";

function getIndexHtmlContents() {
  try {
    const original = fs.readFileSync(path.join(FRONTEND_DIST_DIR, "index.html"), {
      encoding: "utf8",
    });
    return original.replace(
      `<!-- __SHARED_CONFIG_SCRIPT_PLACEHOLDER__ -->`,
      `<script type="application/javascript">globalThis.__SHARED_CONFIG__ = ${JSON.stringify(getSharedConfig())};</script>\n`,
    );
  } catch {
    return "<!-- frontend not built -->";
  }
}

async function serveFile(filePath: string): Promise<Response | null> {
  try {
    const s = await stat(filePath);
    if (!s.isFile()) return null;
    const mimeType = mime.lookup(filePath) || "application/octet-stream";
    const stream = Readable.toWeb(createReadStream(filePath)) as ReadableStream;
    return new Response(stream, {
      headers: {
        "Content-Type": mimeType,
        "Content-Length": String(s.size),
      },
    });
  } catch {
    return null;
  }
}

export const createHonoApp = (badgeHubData: BadgeHubData = createBadgeHubData()) => {
  const app = new Hono();

  app.use("*", logger());
  app.use("*", cors());

  // SPA routes – always serve index.html with injected shared config.
  const indexHtmlContents = getIndexHtmlContents();
  app.get("/", (c) => {
    c.header("Content-Type", "text/html");
    return c.body(indexHtmlContents);
  });
  app.get("/page", (c) => {
    c.header("Content-Type", "text/html");
    return c.body(indexHtmlContents);
  });
  app.get("/page/*", (c) => {
    c.header("Content-Type", "text/html");
    return c.body(indexHtmlContents);
  });

  // Static files from frontend dist and public directories.
  app.use("*", async (c, next) => {
    const urlPath = c.req.path;
    for (const root of [FRONTEND_DIST_DIR, FRONTEND_PUBLIC_DIR]) {
      const filePath = path.join(root, urlPath);
      // Prevent path traversal outside root
      if (!filePath.startsWith(root + path.sep) && filePath !== root) {
        continue;
      }
      const res = await serveFile(filePath);
      if (res) return res;
    }
    await next();
  });

  // Swagger docs
  const swaggerDoc = createSwaggerDoc();
  app.get("/api-docs/swagger.json", (c) => c.json(swaggerDoc));
  app.get("/api-docs", swaggerUI({ url: "/api-docs/swagger.json" }));

  // Public API routes (shared with service worker via createPublicApiRouter)
  const publicRouter = createPublicApiRouter(badgeHubData);
  app.route("/", publicRouter);

  // Private API routes (backend-only)
  registerPrivateRoutes(app, badgeHubData);

  return app;
};
