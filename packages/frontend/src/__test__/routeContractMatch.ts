import { tsRestApiContracts } from "@shared/contracts/restContracts.ts";

type ApiFetcherArgs = {
  method: string;
  path: string;
};

function getPathValues(path: string, matcher: string): Map<string, string> | undefined {
  const pathValues = new Map<string, string>();
  const normalizedPath = path.startsWith("/") ? path : `/${path}`;
  const normalizedMatcher = matcher.startsWith("/") ? matcher : `/${matcher}`;

  const pathParts = normalizedPath.split("/").filter(Boolean);
  const matcherParts = normalizedMatcher.split("/").filter(Boolean);

  if (pathParts.length !== matcherParts.length) return undefined;

  for (let i = 0; i < pathParts.length; i++) {
    const matcherPart = matcherParts[i];
    const pathPart = pathParts[i];
    if (matcherPart?.startsWith(":")) {
      pathValues.set(matcherPart.slice(1), pathPart);
      continue;
    }
    if (matcherPart !== pathPart) return undefined;
  }

  return pathValues;
}

type ApiRoute = (typeof tsRestApiContracts)[keyof typeof tsRestApiContracts];

export const matchRoute = (args: ApiFetcherArgs, routeContract: ApiRoute) => {
  return args.method === routeContract.method && getPathValues(new URL(args.path, "http://localhost").pathname, routeContract.path);
};
