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
      //   (a) First-ever load – SW is actively installing (downloading WASM +
      //       SQLite).  reg.installing is non-null.  We wait up to 60 s for
      //       clients.claim() to fire.  60 s is a safety valve; in practice
      //       the 644 KB WASM + 140 KB SQLite finish in seconds even on slow
      //       connections.
      //
      //   (b) Hard-refresh (Ctrl+Shift+R in Chrome) – the browser bypasses the
      //       SW entirely for this load, so controllerchange never fires.
      //       reg.installing is null (SW already installed, nothing to install).
      //       Fix: do a programmatic soft-reload (window.location.reload()).
      //       JS-initiated navigation does NOT bypass the SW.
      //       A sessionStorage flag prevents an infinite reload loop.
      const reg = await navigator.serviceWorker.getRegistration(
        import.meta.env.BASE_URL,
      );
      if (!navigator.serviceWorker.controller) {
        const isInstalling = reg?.installing != null;

        if (isInstalling) {
          // SW is downloading/initialising – wait as long as it needs.
          await new Promise<void>((resolve) => {
            const timer = setTimeout(resolve, 60_000); // 60 s safety valve
            navigator.serviceWorker.addEventListener(
              "controllerchange",
              () => { clearTimeout(timer); resolve(); },
              { once: true },
            );
          });
        } else {
          // SW already installed but not controlling → hard-refresh bypass.
          // Do one soft-reload; the guard prevents an infinite loop.
          if (!sessionStorage.getItem("sw-reloaded")) {
            sessionStorage.setItem("sw-reloaded", "1");
            window.location.reload();
            return; // Don't render – we're about to reload.
          }
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

