import { Express } from "express";
import swaggerUi from "swagger-ui-express";
import { createSwaggerDoc } from "@createSwaggerDoc";

const swaggerDoc = createSwaggerDoc();

export default function serveApiDocs(app: Express) {
  app.get("/api-docs/swagger.json", (_req, res) => {
    res.status(200).json(swaggerDoc);
  });

  const options = {
    swaggerOptions: { url: "/api-docs/swagger.json" },
  };
  app.use(
    "/api-docs",
    swaggerUi.serveFiles(undefined, options),
    swaggerUi.setup(undefined, options),
  );
}
