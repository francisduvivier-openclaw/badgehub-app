import { initClient } from "@ts-rest/core";
import { BADGHUB_API_V3_URL } from "@config.ts";
import { tsRestApiContracts } from "@shared/contracts/restContracts.ts";
import Keycloak from "keycloak-js";

export const publicTsRestClient = initClient(tsRestApiContracts, {
  baseUrl: BADGHUB_API_V3_URL,
});

export type TsRestClient = typeof publicTsRestClient;

async function getFreshToken(keycloak: Keycloak | undefined) {
  await keycloak?.updateToken(30);
  return keycloak?.token;
}

export async function getAuthorizationHeader(keycloak: Keycloak | undefined) {
  return { authorization: `Bearer ${await getFreshToken(keycloak)}` };
}

export const getFreshAuthorizedTsRestClient = async (keycloak: Keycloak) => {
  const headers = await getAuthorizationHeader(keycloak);
  return initClient(tsRestApiContracts, {
    baseUrl: BADGHUB_API_V3_URL,
    baseHeaders: headers,
  });
};
