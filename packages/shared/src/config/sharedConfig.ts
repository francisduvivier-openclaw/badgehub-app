export type SharedConfig = {
  BADGE_SLUGS: [string, ...string[]];
  CATEGORY_NAMES: [string, ...string[]];
  ADMIN_CATEGORY_NAMES: [string, ...string[]];
  BADGEHUB_API_BASE_URL: string;
  keycloakPublic: {
    realmIssuerUrl: string;
    KEYCLOAK_BASE_URL: string;
    KEYCLOAK_REALM: string;
    KEYCLOAK_CLIENT_ID: string;
  };
  isDevEnvironment: boolean;
};

export function getAndAssertEnv(envVarName: string) {
  const envVar = process.env[envVarName];
  if (envVar == null) {
    throw new Error(
      `Environment variable [${envVarName}] is not set and is required.`
    );
  }
  return envVar;
}

function readBFFEnv() {
  return {
    keycloakPublic: {
      KEYCLOAK_BASE_URL: getAndAssertEnv("KEYCLOAK_BASE_URL"),
      KEYCLOAK_REALM: process.env.KEYCLOAK_REALM ?? "master",
      KEYCLOAK_CLIENT_ID:
        process.env.KEYCLOAK_CLIENT_ID ?? "badgehub-api-frontend",
    },
    BADGEHUB_API_BASE_URL: getAndAssertEnv("BADGEHUB_API_BASE_URL"),
    BADGE_SLUGS: getAndAssertEnv("BADGE_SLUGS")?.split(","),
    CATEGORY_NAMES: [...getAndAssertEnv("CATEGORY_NAMES")?.split(",")],
    ADMIN_CATEGORY_NAMES: process.env["ADMIN_CATEGORY_NAMES"]?.split(",") ?? [
      "Default",
    ],
    isDevEnvironment: process.env.NODE_ENV === "development",
  };
}

export const getSharedConfig = (): SharedConfig => {
  return (globalThis as any).__SHARED_CONFIG__ ?? readBFFEnv();
};
