import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { HashRouter, Route, Routes, useParams } from "react-router-dom";
import "./index.css";
import HomePage from "./pages/HomePage/HomePage.tsx";
import AppDetailPage from "@pages/AppDetailPage/AppDetailPage.tsx";
import AppEditPage from "@pages/AppEditPage/AppEditPage.tsx";
import CreateProjectPage from "@pages/AppCreationPage/AppCreationPage.tsx";

import { SessionProvider } from "@sharedComponents/keycloakSession/SessionProvider.tsx";
import { TodoPage } from "@pages/TodoPage.tsx";
import MyProjectsPage from "@pages/MyProjectsPage/MyProjectsPage.tsx";
import { IS_DEV_ENVIRONMENT } from "@config.ts";
import { useTitle } from "@hooks/useTitle.ts";

const AppDetailWrapper = () => {
  const { slug } = useParams<{ slug: string }>();
  if (!slug) {
    return <div>Error: App slug is required</div>;
  }
  return <AppDetailPage slug={slug} />;
};

const AppEditPageWrapper = () => {
  const { slug } = useParams<{ slug: string }>();
  useTitle(`Edit project ${slug}`);
  if (!slug) {
    return <div>Error: App slug is required</div>;
  }
  return <AppEditPage slug={slug} />;
};

async function bootstrap() {
  if (
    import.meta.env.VITE_ENABLE_BROWSER_BACKEND === "true" &&
    "serviceWorker" in navigator
  ) {
    try {
      await navigator.serviceWorker.register(
        `${import.meta.env.BASE_URL}api-sw.js`,
        { scope: import.meta.env.BASE_URL, type: "module" },
      );
      // Ensure the SW is controlling this page before the first render so that
      // every API request is intercepted.  Two failure modes exist:
      //
      //   (a) First-ever load – SW just installed; clients.claim() is in-flight.
      //       Fix: wait for the "controllerchange" event (fast, < 1 s).
      //
      //   (b) Hard-refresh (Ctrl+Shift+R in Chrome) – the browser bypasses the
      //       SW entirely for all requests in that load, so controllerchange
      //       never fires.
      //       Fix: after 1.5 s with no controller, do a programmatic soft-reload
      //       (window.location.reload()).  JS-initiated navigation does NOT
      //       bypass the SW, so the next load is intercepted normally.
      //       A sessionStorage flag prevents an infinite reload loop.
      if (!navigator.serviceWorker.controller) {
        const controlled = await Promise.race([
          new Promise<boolean>((resolve) =>
            navigator.serviceWorker.addEventListener(
              "controllerchange",
              () => resolve(true),
              { once: true },
            ),
          ),
          new Promise<boolean>((resolve) => setTimeout(() => resolve(false), 1500)),
        ]);

        if (!controlled && !sessionStorage.getItem("sw-reloaded")) {
          // Soft-reload so the SW can intercept requests on the next load.
          sessionStorage.setItem("sw-reloaded", "1");
          window.location.reload();
          return; // Don't render – we're about to reload.
        }
      }
      // Clear the guard so repeated hard-refreshes each get one reload attempt.
      sessionStorage.removeItem("sw-reloaded");
    } catch (error) {
      console.error("Failed to register API service worker", error);
    }
  }

  createRoot(document.getElementById("root")!).render(
    <StrictMode>
      <HashRouter>
        <SessionProvider>
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/page/project/:slug" element={<AppDetailWrapper />} />
            <Route
              path="/page/project/:slug/edit"
              element={<AppEditPageWrapper />}
            />
            <Route path="/page/my-projects" element={<MyProjectsPage />} />
            <Route path="/page/todo" element={<TodoPage />} />
            <Route
              path="/page/create-project"
              element={<CreateProjectPage />}
            />
          </Routes>
        </SessionProvider>
      </HashRouter>
    </StrictMode>,
  );
}

bootstrap();

// Floating toggle button logic
function setupTodoToggleButton() {
  const btn = document.createElement("button");
  btn.className = "todo-toggle-btn";
  btn.title = "Toggle TODO overlay";
  btn.innerHTML = "🟧";
  let enabled = false;

  const rootDiv = document.getElementById("root");

  function updateRootClass() {
    if (!rootDiv) return;
    if (enabled) {
      rootDiv.classList.add("debugEnabled");
    } else {
      rootDiv.classList.remove("debugEnabled");
    }
    btn.style.opacity = enabled ? "1" : "0.6";
  }

  btn.onclick = () => {
    enabled = !enabled;
    updateRootClass();
  };

  document.body.appendChild(btn);
  updateRootClass();
}

if (IS_DEV_ENVIRONMENT) {
  setupTodoToggleButton();
}

