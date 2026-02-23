import express from "express";
import { pinoHttp } from "pino-http";
import serveApiDocs from "@serveApiDocs";
import {
  FRONTEND_DIST_DIR,
  FRONTEND_PUBLIC_DIR,
  IS_DEV_ENVIRONMENT,
} from "@config";
import { registerPublicRoutes } from "@controllers/publicRoutes";
import { registerPrivateRoutes } from "@controllers/privateRoutes";
import cors from "cors";
import * as path from "path";
import * as fs from "node:fs";
import { getSharedConfig } from "@shared/config/sharedConfig";

function getIndexHtmlContents() {
  const original = fs.readFileSync(
    path.join(FRONTEND_DIST_DIR, "index.html"),
    // TODO replace indexHtmlContents
    { encoding: "utf8" }
  );
  return original.replace(
    `<!-- __SHARED_CONFIG_SCRIPT_PLACEHOLDER__ -->`,
    `<script type="application/javascript">globalThis.__SHARED_CONFIG__ = ${JSON.stringify(getSharedConfig())};</script>
`
  );
}

export const createExpressServer = () => {
  const app = express();
  if (IS_DEV_ENVIRONMENT) {
    app.use((req, res, next) => {
      res.header("Access-Control-Allow-Origin", "*");
      next(); // for inspection during development
    });
  }

  app.use(cors());

  // Accept any valid JSON value (including primitives like JSON strings).
  app.use(express.json({ strict: false }));
  const indexHtmlContents = getIndexHtmlContents();
  // Handle requests for the root and /page routes by sending the main HTML file.
  // This is crucial for Single Page Applications (SPAs) that use client-side routing.
  app.get(["/", "/page", "/page/*"], (req, res) => {
    res.setHeader("Content-Type", "text/html");
    res.send(indexHtmlContents);
  });

  app.use(express.static(FRONTEND_DIST_DIR));
  app.use(express.static(FRONTEND_PUBLIC_DIR));

  const pino = pinoHttp();
  app.use(pino);

  serveApiDocs(app);

  const apiV3Router = express.Router();
  app.use("/api/v3", apiV3Router);

  registerPublicRoutes(apiV3Router);
  registerPrivateRoutes(apiV3Router);
  app.use((err: any, req: any, res: any, next: any) => {
    console.warn(err);
    next(err);
  });
  return app;
};
