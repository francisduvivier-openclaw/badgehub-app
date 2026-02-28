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

const viteEnv: Record<string, string | undefined> =
  ((import.meta as any)?.env as Record<string, string | undefined> | undefined) ?? {};

function getEnv(envVarName: string) {
  return (
    process.env[envVarName] ??
    viteEnv[envVarName] ??
    viteEnv[`VITE_${envVarName}`]
  );
}

export function getAndAssertEnv(envVarName: string) {
  const envVar = getEnv(envVarName);
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
      KEYCLOAK_REALM: getEnv("KEYCLOAK_REALM") ?? "master",
      KEYCLOAK_CLIENT_ID: getEnv("KEYCLOAK_CLIENT_ID") ?? "badgehub-api-frontend",
    },
    BADGEHUB_API_BASE_URL: getAndAssertEnv("BADGEHUB_API_BASE_URL"),
    BADGE_SLUGS: (getEnv("BADGE_SLUGS") ?? "why2025,mch2022").split(","),
    CATEGORY_NAMES: [...(getEnv("CATEGORY_NAMES") ?? "Default").split(",")],
    ADMIN_CATEGORY_NAMES: (getEnv("ADMIN_CATEGORY_NAMES") ?? "Default").split(","),
    isDevEnvironment: (getEnv("NODE_ENV") ?? "") === "development",
  };
}

export const getSharedConfig = (): SharedConfig => {
  return (globalThis as any).__SHARED_CONFIG__ ?? readBFFEnv();
};
