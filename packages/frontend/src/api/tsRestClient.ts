import { initClient } from "@ts-rest/core";
import { BADGEHUB_API_BASE_URL } from "@config.ts";
import { tsRestApiContracts } from "@shared/contracts/restContracts.ts";
import Keycloak from "keycloak-js";

export const publicTsRestClient = initClient(tsRestApiContracts, {
  baseUrl: BADGEHUB_API_BASE_URL + "/api/v3",
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
    baseUrl: BADGEHUB_API_BASE_URL + "/api/v3",
    baseHeaders: headers,
  });
};
