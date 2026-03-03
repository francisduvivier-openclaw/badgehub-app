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
      // Wait for the SW to claim this page before rendering so that the very
      // first API requests (home page list, detail page fetch) are intercepted.
      // Without this, hard refreshes and first-visit loads fire requests before
      // clients.claim() has run, causing GitHub Pages to return 404s.
      if (!navigator.serviceWorker.controller) {
        await Promise.race([
          new Promise<void>((resolve) =>
            navigator.serviceWorker.addEventListener(
              "controllerchange",
              () => resolve(),
              { once: true },
            ),
          ),
          // Safety valve: proceed after 5 s even if the SW never claims us
          // (e.g. the browser blocks service workers in this context).
          new Promise<void>((resolve) => setTimeout(resolve, 5000)),
        ]);
      }
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

