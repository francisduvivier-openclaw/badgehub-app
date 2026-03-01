# Frontend Preview Architecture

This document describes how PR preview mode works in the browser, with explicit boundaries between:

- preview/runtime-specific code, and
- **shared backend logic** reused by both backend and preview.

## Mermaid diagram

```mermaid
flowchart TD
  subgraph Browser["Browser (GitHub Pages PR Preview)"]
    UI["React UI pages + hooks\nTech: react, react-router, vite"]
    Client["API client\npackages/frontend/src/api/tsRestClient.ts\nTech: fetch, URLSearchParams"]
    SW["Service Worker API gateway\npackages/frontend/public/api-sw.js\nTech: Service Worker fetch interception"]
    Adapter["Preview data access adapter\n(in-browser runtime adapter)\nTech: adapter pattern, sql.js (WASM SQLite)"]

    UI -->|calls getProjectSummaries/getProject/...| Client
    Client -->|HTTP to <BASE_PATH>/api/v3/*| SW
    SW -->|invoke handlers| SharedHandlers
    SharedHandlers -->|read/write via interface| Adapter
  end

  subgraph Shared["🟦 Shared with Backend (single source of truth)"]
    SharedHandlers["Shared API/Core handlers\npackages/shared/src/api/backendCoreHandlers.ts\nExamples: getProjectSummariesHandler, getProjectHandler, getBadgesHandler, getStatsHandler"]
    SharedPopulate["Shared populate flow + fixtures\npackages/shared/src/dev/populate/*\nrunSharedPopulate(hooks), shared fixtures/constants"]
    SharedContracts["Shared contracts + domain models\nTech: zod schemas, shared TypeScript types"]

    SharedHandlers --- SharedContracts
    SharedHandlers --- SharedPopulate
  end

  subgraph Backend["Backend runtime (comparison path)"]
    Router["Backend router layer (oRPC/HTTP)"]
    BackendAdapter["Server data adapter + DB"]

    Router --> SharedHandlers
    SharedHandlers --> BackendAdapter
  end
```

## Key design notes

1. **Shared business logic first**
   - Request handling behavior should live in shared handlers (`packages/shared/...`) and be reused by both backend and preview.

2. **Runtime differences are isolated**
   - Backend uses server router + server DB adapter.
   - Preview uses Service Worker transport + browser-side adapter.

3. **API shape remains stable for UI**
   - The UI calls the same client methods (`getProjectSummaries`, `getProject`, etc.), minimizing page/component churn.

4. **Feature/package notes**
   - **Service Worker API**: request interception in browser preview.
   - **sql.js**: SQLite in browser via WASM.
   - **zod**: shared schema/contracts validation.
   - **TypeScript shared types**: same domain models across frontend/backend/shared.

## Current implementation status (high-level)

- Service Worker API interception is in place for preview requests.
- Base-path routing fixes were applied for GitHub Pages preview paths.
- Shared-handler usage is the intended architecture; remaining hardening focuses on extending route coverage and data lifecycle details.
