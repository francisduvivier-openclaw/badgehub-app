import { ErrorType, NotAuthenticatedError } from "@error";
import { decodeJwt } from "jose";
import type { Context, Next } from "hono";
import { User } from "@shared/domain/readModels/project/User";

export type UserDataInRequest = Pick<User, "idp_user_id">;

export type AuthVariables = {
  user: UserDataInRequest | undefined;
  apiToken: string | undefined;
};

function stripBearerPrefix<T extends string | undefined>(apiToken: T): T {
  return apiToken?.toLowerCase().startsWith("bearer ")
    ? (apiToken?.slice("bearer ".length) as T)
    : apiToken;
}

const decodeTokenWithErrorHandling = (token: string) => {
  try {
    return decodeJwt(token);
  } catch (e) {
    console.warn(
      "JWT:decodeTokenWithErrorHandling: Unable to decodeJwt JWT token, error:",
      e,
    );
    throw NotAuthenticatedError("Unable to decode JWT token: " + e);
  }
};

export async function addAuthenticationMiddleware(
  c: Context<{ Variables: AuthVariables }>,
  next: Next,
) {
  try {
    const authorizationHeader = c.req.header("authorization");
    const apiToken = stripBearerPrefix(c.req.header("badgehub-api-token"));

    if (!authorizationHeader) {
      if (!apiToken) {
        console.warn(
          "JWT:addUserSubMiddleware: Missing authorization and badgehub-api-token header",
        );
        throw NotAuthenticatedError(
          "Missing authorization and badgehub-api-token header",
        );
      }
      c.set("apiToken", apiToken);
      c.set("user", undefined);
      await next();
      return;
    }

    const token = stripBearerPrefix(authorizationHeader);
    const payload = decodeTokenWithErrorHandling(token);
    if (!("sub" in payload) || !payload.sub) {
      console.warn(
        "JWT:addUserSubMiddleware: payload does not contain user sub",
      );
      throw NotAuthenticatedError("JWT does not contain user sub");
    }
    c.set("user", { idp_user_id: payload.sub });
    c.set("apiToken", undefined);
    await next();
  } catch (e: unknown) {
    if (e && typeof e === "object" && "name" in e && "message" in e) {
      const err = e as { name: string; message: string };
      if (err.name === ErrorType.NotAuthorized) {
        return c.json({ reason: err.message }, 403);
      }
      if (err.name === ErrorType.NotAuthenticated) {
        return c.json({ reason: err.message }, 401);
      }
    }
    console.warn("JWT:handleError: Internal server error", e);
    return c.json({ reason: "Internal server error" }, 500);
  }
}
