import { OpenAPIObject } from "openapi3-ts";
import { EXPRESS_PORT } from "@config";

export const createSwaggerDoc = (): OpenAPIObject => {
  const paths: OpenAPIObject["paths"] = {
    "/api-docs/swagger.json": {
      get: { tags: ["Open API"], summary: "Get OpenAPI document", responses: { "200": { description: "ok" } } },
    },

    "/api/v3/projects/{slug}": {
      get: { tags: ["Public"], responses: { "200": { description: "ok" }, "404": { description: "not found" } } },
      post: { tags: ["Private"], security: [{ bearerAuth: [] }, { apiTokenAuth: [] }], responses: { "204": { description: "created" } } },
      patch: { tags: ["Private"], security: [{ bearerAuth: [] }, { apiTokenAuth: [] }], responses: { "204": { description: "updated" } } },
      delete: { tags: ["Private"], security: [{ bearerAuth: [] }, { apiTokenAuth: [] }], responses: { "204": { description: "deleted" } } },
    },
  };

  return {
    openapi: "3.0.0",
    info: { title: "BadgeHub API", version: "1.0.0" },
    paths,
    tags: [
      { name: "Open API", description: "Operations allowing to download the open api spec." },
      { name: "Public", description: "Operations available without any authentication." },
      { name: "Private", description: "Operations available to authenticated users via JWT Bearer token OR API token." },
    ],
    servers: [
      { url: "/" },
      { url: "https://badgehub-api.p1m.nl/" },
      { url: `http://localhost:${EXPRESS_PORT}/` },
    ],
    components: {
      securitySchemes: {
        bearerAuth: {
          type: "http",
          scheme: "bearer",
          bearerFormat: "JWT",
          description: "JWT Bearer token (for user sessions)",
        },
        apiTokenAuth: {
          type: "apiKey",
          in: "header",
          name: "badgehub-api-token",
          description: "Project-specific API token (for automation)",
        },
      },
    },
  };
};
