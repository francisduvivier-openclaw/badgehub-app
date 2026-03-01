type RequestArgs = {
  params?: Record<string, string | number>;
  query?: Record<string, unknown>;
  body?: unknown;
  headers?: Record<string, string | undefined>;
};

type BrowserBackendResponse<T = unknown> = {
  status: number;
  body?: T;
  headers: Headers;
};

type BrowserBackedClient = {
  [key: string]: (args?: RequestArgs) => Promise<BrowserBackendResponse>;
};

/**
 * Temporary shim during oRPC migration: browser-backed runtime is disabled.
 * Keep exported symbol for compatibility with older imports.
 */
export function createBrowserBackedClient(): BrowserBackedClient {
  const unavailable = async () => ({
    status: 503,
    body: { reason: "Browser backend disabled during API client migration" },
    headers: new Headers(),
  });

  return new Proxy(
    {},
    {
      get: () => unavailable,
    },
  ) as BrowserBackedClient;
}
