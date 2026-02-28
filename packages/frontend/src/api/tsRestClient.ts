import { initClient } from "@ts-rest/core";
import { BADGHUB_API_V3_URL } from "@config.ts";
import { tsRestApiContracts } from "@shared/contracts/restContracts.ts";
import Keycloak from "keycloak-js";
import { createBrowserBackedClient } from "@browserBackend.ts";

export type TsRestClient = ReturnType<typeof createBrowserBackedClient>;

const BROWSER_BACKEND_ENABLED =
  import.meta.env.VITE_ENABLE_BROWSER_BACKEND === "true";

export const publicTsRestClient: TsRestClient = BROWSER_BACKEND_ENABLED
  ? createBrowserBackedClient()
  : initClient(tsRestApiContracts, { baseUrl: BADGHUB_API_V3_URL });

async function getFreshToken(keycloak: Keycloak | undefined) {
  await keycloak?.updateToken(30);
  return keycloak?.token;
}

export async function getAuthorizationHeader(keycloak: Keycloak | undefined) {
  return { authorization: `Bearer ${await getFreshToken(keycloak)}` };
}

export const getFreshAuthorizedTsRestClient = async (keycloak: Keycloak) => {
  if (BROWSER_BACKEND_ENABLED) {
    return publicTsRestClient;
  }
  const headers = await getAuthorizationHeader(keycloak);
  return initClient(tsRestApiContracts, {
    baseUrl: BADGHUB_API_V3_URL,
    baseHeaders: headers,
  });
};
