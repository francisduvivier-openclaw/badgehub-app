import { createRemoteJWKSet, jwtVerify } from "jose";
import {
  DISABLE_AUTH,
  KEYCLOAK_CERTS_URL,
  KEYCLOAK_REALM_ISSUER_URL,
} from "@config";
import type { Context, Next } from "hono";

const JWKS = createRemoteJWKSet(new URL(KEYCLOAK_CERTS_URL!));

async function jwtVerifyToken(token: string) {
  if (DISABLE_AUTH) {
    return;
  }
  try {
    await jwtVerify(token, JWKS, {
      issuer: KEYCLOAK_REALM_ISSUER_URL,
      algorithms: ["RS256"],
    });
  } catch (error) {
    console.error("JWT verification error:", error);
    throw new Error("JWT verification failed");
  }
}

export async function jwtVerifyTokenMiddleware(c: Context, next: Next) {
  const authHeader = c.req.header("authorization");

  if (!authHeader) {
    if (c.req.header("badgehub-api-token")) {
      await next();
      return;
    }
    return c.json(
      { error: "Authorization as well as badgehub-api-token header is missing" },
      401,
    );
  }

  const [bearer, token] = authHeader.split(" ");
  if (bearer !== "Bearer" || !token || token.trim() === "" || token === "undefined") {
    return c.json({ reason: "Not authenticated" }, 401);
  }

  try {
    await jwtVerifyToken(token);
    await next();
  } catch {
    return c.json({ reason: "JWT verification failed" }, 401);
  }
}
