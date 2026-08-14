import { createExpressServer } from "@createExpressServer";
import { isInDebugMode } from "@util/debug";
import type { Express } from "express";
import { decodeJwt } from "jose";
import request from "supertest";
import { beforeAll, describe, expect, test } from "vitest";

const USER1_TOKEN =
  "eyJhbGciOiJSUzI1NiIsInR5cCIgOiAiSldUIiwia2lkIiA6ICJnUGI4VjZ5dHZTMkpFakdjVDFlLWdTWVRPbFBTNm04Xzkta210cHFDMktVIn0.eyJleHAiOjE3NDgyOTA4NzMsImlhdCI6MTc0ODI5MDgxMywiYXV0aF90aW1lIjoxNzQ4MjkwODEzLCJqdGkiOiI1NmIzOTUwNS0yYjJmLTQ1MDgtOTY0NC03NTFmN2FjMzI0ZGQiLCJpc3MiOiJodHRwczovL2tleWNsb2FrLnAxbS5ubC9yZWFsbXMvbWFzdGVyIiwiYXVkIjoiYWNjb3VudCIsInN1YiI6ImQ4MDc1MzM3LTBmMTAtNGNkYi04YjQ4LWJlMWRjMTg3NDdhMyIsInR5cCI6IkJlYXJlciIsImF6cCI6ImJhZGdlaHViIiwic2Vzc2lvbl9zdGF0ZSI6IjIzMWFkYmRkLTE1NDctNDRjYi1hNjI3LTI2MjJmNzI2YzcxMCIsImFjciI6IjEiLCJhbGxvd2VkLW9yaWdpbnMiOlsiaHR0cHM6Ly9iYWRnZWh1Yi5wMW0ubmwvIl0sInJlYWxtX2FjY2VzcyI6eyJyb2xlcyI6WyJkZWZhdWx0LXJvbGVzLW1hc3RlciIsIm9mZmxpbmVfYWNjZXNzIiwidW1hX2F1dGhvcml6YXRpb24iXX0sInJlc291cmNlX2FjY2VzcyI6eyJhY2NvdW50Ijp7InJvbGVzIjpbIm1hbmFnZS1hY2NvdW50IiwibWFuYWdlLWFjY291bnQtbGlua3MiLCJ2aWV3LXByb2ZpbGUiXX19LCJzY29wZSI6Im9wZW5pZCBlbWFpbCBwcm9maWxlIiwic2lkIjoiMjMxYWRiZGQtMTU0Ny00NGNiLWE2MjctMjYyMmY3MjZjNzEwIiwiZW1haWxfdmVyaWZpZWQiOmZhbHNlLCJuYW1lIjoidGVzdCB1c2VyIDEgVGVzdGVyIiwicHJlZmVycmVkX3VzZXJuYW1lIjoidGVzdHVzZXIxIiwiZ2l2ZW5fbmFtZSI6InRlc3QgdXNlciAxIiwiZmFtaWx5X25hbWUiOiJUZXN0ZXIiLCJlbWFpbCI6ImZkdXZpdmllcit0ZXN0dXNlcjFAZ21haWwuY29tIn0.h9R3nkDZ4C1LMAHKY-iBr24vW2tZMDwNgkA-6S1GQ2KNdnCjaOnROGB0bOCD5vaJO09YqItduM2gBD-oWGX0WuX57p5r5h3lCJi12NEV1YUdc0Z_pqB5ZvmXnJcquejqnnIiia8utcsOUQOsvhDJI4E0afyNl4J0JzcTwwIeOsP_oxkaFCb1aIMOVEIVwyOQYUfIcXsyFNJm356zgMQbD3WNI3eNCi2bDs-KfKaasCdgrMYjEM7gfXetgkJVbgT0v0AXyo9pzVGFDjzNPkoNNo0P5in8AA0qh2C3F-EXFsj3Xmagb_K1un94q4wW4IEMUqbhHbuR2bdePzg6219-Kg";
const USER1_ID = decodeJwt(USER1_TOKEN).sub;

const toSlug = (name: string) => name.toLowerCase().replace(/[^a-z0-9]/g, "_");

function unsignedJwt(payload: Record<string, unknown>): string {
  const encode = (value: object) =>
    Buffer.from(JSON.stringify(value)).toString("base64url");
  return `${encode({ alg: "none", typ: "JWT" })}.${encode(payload)}.`;
}

const ADMIN_TOKEN = unsignedJwt({
  sub: "admin-user-id",
  realm_access: { roles: ["admin"] },
});

describe("Admin users can edit any project, but not list another user's drafts", {
  timeout: isInDebugMode() ? 3600_000 : undefined,
}, () => {
  let app: Express;
  let user1AppId: string;

  beforeAll(async () => {
    app = createExpressServer();
    user1AppId = toSlug(`admin_edit_test_${crypto.randomUUID()}`);
    const createRes = await request(app)
      .post(`/api/v3/projects/${user1AppId}`)
      .auth(USER1_TOKEN, { type: "bearer" });
    expect(createRes.statusCode).toBe(204);
  });

  test("admin can GET another user's draft project", async () => {
    const res = await request(app)
      .get(`/api/v3/projects/${user1AppId}/draft`)
      .auth(ADMIN_TOKEN, { type: "bearer" });
    expect(res.statusCode).toBe(200);
    expect(res.body.slug).toBe(user1AppId);
    expect(res.body.idp_user_id).toBe(USER1_ID);
  });

  test("admin can PATCH another user's draft metadata", async () => {
    const res = await request(app)
      .patch(`/api/v3/projects/${user1AppId}/draft/metadata`)
      .auth(ADMIN_TOKEN, { type: "bearer" })
      .send({ description: "Edited by admin" });
    expect(res.statusCode).toBe(204);

    const getRes = await request(app)
      .get(`/api/v3/projects/${user1AppId}/draft`)
      .auth(ADMIN_TOKEN, { type: "bearer" });
    expect(getRes.statusCode).toBe(200);
    expect(getRes.body.version.app_metadata.description).toBe(
      "Edited by admin"
    );
  });

  test("admin cannot list another user's drafts", async () => {
    const res = await request(app)
      .get(`/api/v3/users/${USER1_ID}/drafts`)
      .auth(ADMIN_TOKEN, { type: "bearer" });
    expect(res.statusCode).toBe(403);
  });
});
